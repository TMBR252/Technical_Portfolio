'use client';

import {
    useCallback,
    useEffect,
    useRef,
    useState,
    type CSSProperties,
} from 'react';

/**
 * Frame-scrubbed video driven by the pointer.
 *
 * The source is a character turnaround encoded all-intra (every frame a
 * keyframe) so an arbitrary seek decodes without walking forward from a
 * distant keyframe — that is what makes scrubbing feel continuous rather
 * than steppy.
 *
 * Frames are painted through a canvas so the flat studio backdrop can be
 * keyed to transparency at runtime. Doing it here rather than baking an
 * alpha channel into the asset keeps a single MP4 that every browser can
 * decode (WebM alpha is unsupported in Safari, and HEVC-with-alpha is not
 * encodable outside macOS).
 */

/** Background key tuned against the source's flat backdrop. */
export type BackdropKey = {
    /** Backdrop colour to remove, as [r, g, b]. */
    color: [number, number, number];
    /** Pixels within this RGB distance are backdrop — also absorbs codec speckle. */
    nearDistance?: number;
    /** Chromaticity ramp: below `lo` reads as backdrop, above `hi` as subject. */
    chromaLo?: number;
    chromaHi?: number;
    /** Luma ramp: pixels darker than `lo` are always kept (unlit subject detail). */
    lumaLo?: number;
    lumaHi?: number;
    /**
     * Normalised y where the ground plane begins. Below it the chroma gate is
     * raised to `groundChroma*` so the contact shadow drops out while the dark
     * feet — and any blade dipping into the same band — survive.
     */
    groundStart?: number;
    groundChromaLo?: number;
    groundChromaHi?: number;
    /**
     * Guards detail that is enclosed by the subject. The eye whites are bright
     * and near-neutral, so a purely colour-based test reads them as backdrop
     * and eats holes in them. Anything the backdrop cannot reach by flooding in
     * from the frame edge is therefore treated as subject — except where it is
     * within this RGB distance of the backdrop, which marks a real gap seen
     * through the body (between blade and shoulder, say) that must stay clear.
     */
    enclosedLo?: number;
    enclosedHi?: number;
    /** Beyond this RGB distance a pixel is solid subject; skips the chroma maths. */
    subjectDistance?: number;
    /**
     * Luma above which a pixel is brighter than the backdrop itself. The render
     * carries a faint glow just outside the silhouette; left in, un-mixing
     * divides it by a small alpha and clamps it to white, drawing a bright rim.
     */
    haloLuma?: number;
};

type MouseScrubVideoProps = {
    src: string;
    className?: string;
    style?: CSSProperties;
    /** Lower = smoother and slower, higher = snappier. 8–14 reads well. */
    smoothing?: number;
    /** Cap on seeks per second; seeking every frame overwhelms the decoder. */
    maxSeekFps?: number;
    /** Ignore seeks shorter than this. Use 1 / sourceFps. */
    minimumSeekDistance?: number;
    /** Trim unusable time at either end of the clip. */
    startPadding?: number;
    endPadding?: number;
    /**
     * Absolute timestamps, evenly spaced across progress 0→1, used instead of
     * mapping progress linearly onto duration.
     *
     * A turnaround rarely rotates at a constant rate, so equal cursor travel
     * would otherwise produce unequal rotation — the character races through
     * one half of the sweep and crawls through the other. Sampling the clip at
     * even angular steps and storing those times here makes rotation track the
     * cursor evenly.
     */
    timeMap?: number[];
    /** Resting position, 0–1. */
    initialProgress?: number;
    /** Which pointer axis drives the scrub. */
    axis?: 'x' | 'y';
    reversed?: boolean;
    /** Hold the last position after the pointer leaves, instead of resetting. */
    continueAfterLeave?: boolean;
    /**
     * `container` maps the pointer across this element's own box. `window`
     * maps it across the viewport, so a character sitting behind other
     * content still tracks the pointer everywhere on the page.
     */
    pointerSource?: 'container' | 'window';
    /** Omit to paint frames untouched. */
    backdropKey?: BackdropKey;
    poster?: string;
};

const clamp = (value: number, min: number, max: number) =>
    Math.min(Math.max(value, min), max);

export default function MouseScrubVideo({
    src,
    className,
    style,
    smoothing = 10,
    maxSeekFps = 30,
    minimumSeekDistance = 1 / 24,
    startPadding = 0,
    endPadding = 0,
    timeMap,
    initialProgress = 0.5,
    axis = 'x',
    reversed = false,
    continueAfterLeave = true,
    pointerSource = 'container',
    backdropKey,
    poster,
}: MouseScrubVideoProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Animation state lives in refs so pointer movement never triggers a render.
    const targetProgressRef = useRef(clamp(initialProgress, 0, 1));
    const currentProgressRef = useRef(clamp(initialProgress, 0, 1));

    const durationRef = useRef(0);
    const lastFrameTimeRef = useRef<number | null>(null);
    const lastSeekTimeRef = useRef(0);
    const requestedVideoTimeRef = useRef(0);

    const animationFrameRef = useRef<number | null>(null);
    const seekingRef = useRef(false);
    const destroyedRef = useRef(false);
    const reducedMotionRef = useRef(false);
    // Reused across paints — reallocating these per frame would churn the GC.
    const scratchRef = useRef<{ reach: Uint8Array; stack: Int32Array } | null>(null);

    const [isReady, setIsReady] = useState(false);

    const getVideoTime = useCallback(
        (progress: number) => {
            const p = clamp(progress, 0, 1);
            if (!timeMap || timeMap.length < 2) return startPadding + p * durationRef.current;

            const scaled = p * (timeMap.length - 1);
            const i = Math.min(timeMap.length - 2, Math.floor(scaled));
            return timeMap[i] + (timeMap[i + 1] - timeMap[i]) * (scaled - i);
        },
        [startPadding, timeMap],
    );

    /** Paint the current frame, keying the backdrop out when configured. */
    const paint = useCallback(() => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (!video || !canvas || !video.videoWidth) return;

        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) return;

        const w = video.videoWidth;
        const h = video.videoHeight;
        if (canvas.width !== w || canvas.height !== h) {
            canvas.width = w;
            canvas.height = h;
        }

        ctx.clearRect(0, 0, w, h);
        ctx.drawImage(video, 0, 0, w, h);
        if (!backdropKey) return;

        const {
            color,
            nearDistance = 50,
            chromaLo = 0.006,
            chromaHi = 0.016,
            lumaLo = 25,
            lumaHi = 60,
            groundStart = 0.84,
            groundChromaLo = 0.03,
            groundChromaHi = 0.05,
            enclosedLo = 40,
            enclosedHi = 80,
            subjectDistance = 255,
            haloLuma = 220,
        } = backdropKey;

        const [bgR, bgG, bgB] = color;
        const bgSum = bgR + bgG + bgB || 1;
        const bgCr = bgR / bgSum;
        const bgCg = bgG / bgSum;
        const bgCb = bgB / bgSum;
        const nearSq = nearDistance * nearDistance;
        const subjectSq = subjectDistance * subjectDistance;
        const groundRow = Math.floor(groundStart * h);

        const frame = ctx.getImageData(0, 0, w, h);
        const data = frame.data;

        for (let y = 0; y < h; y++) {
            const onGround = y >= groundRow;
            const cLo = onGround ? groundChromaLo : chromaLo;
            const cHi = onGround ? groundChromaHi : chromaHi;
            const cSpan = cHi - cLo || 1;

            let i = y * w * 4;
            for (let x = 0; x < w; x++, i += 4) {
                const r = data[i];
                const g = data[i + 1];
                const b = data[i + 2];

                const dr = r - bgR;
                const dg = g - bgG;
                const db = b - bgB;
                const dist2 = dr * dr + dg * dg + db * db;
                // Most of the frame is backdrop, and most of the rest is solid
                // subject. Both bail before the per-pixel divides below.
                if (dist2 < nearSq) {
                    data[i + 3] = 0;
                    continue;
                }
                if (dist2 > subjectSq) continue; // already opaque

                const luma = 0.299 * r + 0.587 * g + 0.114 * b;
                if (luma > haloLuma) {
                    data[i + 3] = 0;
                    continue;
                }

                const sum = r + g + b || 1;
                // Chromaticity distance — the shadow keeps the backdrop's tint,
                // so it collapses to ~0 here while the subject does not.
                const chroma =
                    Math.abs(r / sum - bgCr) +
                    Math.abs(g / sum - bgCg) +
                    Math.abs(b / sum - bgCb);

                const chromaKeep =
                    chroma <= cLo ? 0 : chroma >= cHi ? 1 : (chroma - cLo) / cSpan;

                const darkKeep =
                    luma >= lumaHi ? 0 : luma <= lumaLo ? 1 : (lumaHi - luma) / (lumaHi - lumaLo);

                // Chroma and darkness decide *whether* a pixel is subject; they
                // are near-binary, which on 4:2:0 chroma gives a blocky, chewed
                // edge. Distance supplies the sub-pixel coverage a partly
                // covered edge pixel actually has, at full luma resolution.
                const cover = (Math.sqrt(dist2) - nearDistance) / (subjectDistance - nearDistance);
                const coverKeep = cover <= 0 ? 0 : cover >= 1 ? 1 : cover;

                // Not on the ground plane though: the contact shadow sits at a
                // real distance from the backdrop, so coverage would revive it.
                // There the chroma/darkness verdict stands, and the feet get
                // their soft edge from the luma ramp instead.
                let alpha = chromaKeep > darkKeep ? chromaKeep : darkKeep;
                if (!onGround && coverKeep > alpha) alpha = coverKeep;
                if (alpha < 1) data[i + 3] = alpha * 255;
            }
        }

        // Flood the transparency in from the frame edge. Only what the backdrop
        // can actually reach is backdrop; enclosed detail is subject.
        const count = w * h;
        let scratch = scratchRef.current;
        if (!scratch || scratch.reach.length !== count) {
            scratch = { reach: new Uint8Array(count), stack: new Int32Array(count) };
            scratchRef.current = scratch;
        }
        const { reach, stack } = scratch;
        reach.fill(0);

        let sp = 0;
        const push = (i: number) => {
            if (!reach[i] && data[i * 4 + 3] < 255) {
                reach[i] = 1;
                stack[sp++] = i;
            }
        };
        for (let x = 0; x < w; x++) {
            push(x);
            push((h - 1) * w + x);
        }
        for (let y = 0; y < h; y++) {
            push(y * w);
            push(y * w + w - 1);
        }
        while (sp > 0) {
            const i = stack[--sp];
            const x = i % w;
            if (x > 0) push(i - 1);
            if (x < w - 1) push(i + 1);
            if (i >= w) push(i - w);
            if (i < count - w) push(i + w);
        }

        const encSpan = enclosedHi - enclosedLo || 1;
        for (let p = 0; p < count; p++) {
            const i = p * 4;
            if (reach[p] || data[i + 3] === 255) continue;

            const dr = data[i] - bgR;
            const dg = data[i + 1] - bgG;
            const db = data[i + 2] - bgB;
            const dist = Math.sqrt(dr * dr + dg * dg + db * db);
            const solid =
                dist <= enclosedLo ? 0 : dist >= enclosedHi ? 1 : (dist - enclosedLo) / encSpan;

            const restored = solid * 255;
            if (restored > data[i + 3]) data[i + 3] = restored;
        }

        // Un-mix the backdrop out of partially transparent edge pixels. They are
        // a blend of subject and backdrop, so compositing them as-is leaves a
        // pale fringe around the silhouette — very visible on a dark page.
        // observed = subject*a + backdrop*(1-a)  =>  subject = (observed - backdrop*(1-a))/a
        for (let p = 0; p < count; p++) {
            const i = p * 4;
            const a = data[i + 3];
            // Below ~15% coverage the division blows up any noise in the pixel,
            // and its contribution to the composite is negligible anyway.
            if (a < 38 || a === 255) continue;

            const af = a / 255;
            const rest = 1 - af;
            // ImageData is straight (non-premultiplied) alpha, so solve for the
            // subject colour directly. Out-of-gamut results clamp on write.
            data[i] = (data[i] - bgR * rest) / af;
            data[i + 1] = (data[i + 1] - bgG * rest) / af;
            data[i + 2] = (data[i + 2] - bgB * rest) / af;
        }

        ctx.putImageData(frame, 0, 0);
    }, [backdropKey]);

    const requestSeek = useCallback(
        (targetTime: number, force = false) => {
            const video = videoRef.current;
            if (!video || !Number.isFinite(targetTime)) return;

            const safeTime = clamp(targetTime, startPadding, startPadding + durationRef.current);
            if (!force && Math.abs(video.currentTime - safeTime) < minimumSeekDistance) return;

            // Never stack seeks — a queue of currentTime writes shows up as stutter.
            if (!force && seekingRef.current) {
                requestedVideoTimeRef.current = safeTime;
                return;
            }

            requestedVideoTimeRef.current = safeTime;
            seekingRef.current = true;
            video.currentTime = safeTime;
        },
        [minimumSeekDistance, startPadding],
    );

    const animate = useCallback(
        (timestamp: number) => {
            if (destroyedRef.current) return;

            const video = videoRef.current;
            if (!video || durationRef.current <= 0) {
                animationFrameRef.current = requestAnimationFrame(animate);
                return;
            }

            const previous = lastFrameTimeRef.current ?? timestamp;
            const delta = Math.min((timestamp - previous) / 1000, 0.1);
            lastFrameTimeRef.current = timestamp;

            const target = targetProgressRef.current;
            const current = currentProgressRef.current;

            // Frame-rate-independent exponential smoothing, so the feel is the
            // same on 60Hz and 120Hz displays.
            const t = 1 - Math.exp(-smoothing * delta);
            let next = current + (target - current) * t;
            if (Math.abs(target - next) < 0.00005) next = target;
            currentProgressRef.current = next;

            const nextTime = getVideoTime(next);
            if (
                timestamp - lastSeekTimeRef.current >= 1000 / maxSeekFps &&
                Math.abs(video.currentTime - nextTime) >= minimumSeekDistance
            ) {
                lastSeekTimeRef.current = timestamp;
                requestSeek(nextTime);
            }

            animationFrameRef.current = requestAnimationFrame(animate);
        },
        [getVideoTime, maxSeekFps, minimumSeekDistance, requestSeek, smoothing],
    );

    const updateTargetFromPointer = useCallback(
        (clientX: number, clientY: number) => {
            let progress: number;

            if (pointerSource === 'window') {
                progress = axis === 'x' ? clientX / window.innerWidth : clientY / window.innerHeight;
            } else {
                const rect = containerRef.current?.getBoundingClientRect();
                if (!rect || rect.width <= 0 || rect.height <= 0) return;
                progress =
                    axis === 'x'
                        ? (clientX - rect.left) / rect.width
                        : (clientY - rect.top) / rect.height;
            }

            progress = clamp(progress, 0, 1);
            targetProgressRef.current = reversed ? 1 - progress : progress;
        },
        [axis, pointerSource, reversed],
    );

    // Pointer tracking. Touch is deliberately ignored: this is a hover
    // affordance, and claiming touch events here would fight page scrolling.
    useEffect(() => {
        if (reducedMotionRef.current) return;

        const target: EventTarget | null =
            pointerSource === 'window' ? window : containerRef.current;
        if (!target) return;

        const onMove = (event: Event) => {
            const e = event as PointerEvent;
            if (e.pointerType === 'touch') return;
            updateTargetFromPointer(e.clientX, e.clientY);
        };

        const onLeave = () => {
            if (!continueAfterLeave) targetProgressRef.current = clamp(initialProgress, 0, 1);
        };

        target.addEventListener('pointermove', onMove, { passive: true });
        target.addEventListener('pointerleave', onLeave);
        return () => {
            target.removeEventListener('pointermove', onMove);
            target.removeEventListener('pointerleave', onLeave);
        };
    }, [continueAfterLeave, initialProgress, pointerSource, updateTargetFromPointer]);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        destroyedRef.current = false;
        reducedMotionRef.current =
            typeof window !== 'undefined' &&
            window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        const handleLoadedMetadata = () => {
            const usable = video.duration - startPadding - endPadding;
            if (!Number.isFinite(video.duration) || usable <= 0) return;

            durationRef.current = usable;
            const initialTime = getVideoTime(clamp(initialProgress, 0, 1));
            requestedVideoTimeRef.current = initialTime;
            requestSeek(initialTime, true);
        };

        const handleSeeked = () => {
            seekingRef.current = false;
            paint();
            setIsReady(true);

            // A newer position may have been requested mid-seek.
            const latest = requestedVideoTimeRef.current;
            if (Math.abs(video.currentTime - latest) >= minimumSeekDistance) requestSeek(latest);
        };

        const handleCanPlay = () => {
            paint();
            setIsReady(true);
        };

        video.pause();
        video.muted = true;

        video.addEventListener('loadedmetadata', handleLoadedMetadata);
        video.addEventListener('seeked', handleSeeked);
        video.addEventListener('canplay', handleCanPlay);

        if (video.readyState >= HTMLMediaElement.HAVE_METADATA) handleLoadedMetadata();

        if (!reducedMotionRef.current) {
            animationFrameRef.current = requestAnimationFrame(animate);
        }

        return () => {
            destroyedRef.current = true;
            if (animationFrameRef.current !== null) cancelAnimationFrame(animationFrameRef.current);
            video.removeEventListener('loadedmetadata', handleLoadedMetadata);
            video.removeEventListener('seeked', handleSeeked);
            video.removeEventListener('canplay', handleCanPlay);
        };
    }, [
        animate,
        endPadding,
        getVideoTime,
        initialProgress,
        minimumSeekDistance,
        paint,
        requestSeek,
        startPadding,
    ]);

    return (
        <div
            ref={containerRef}
            className={className}
            style={{ position: 'relative', ...style }}
        >
            {/* Decode source. Kept in the layout tree (not display:none) so the
                frame is actually painted and available to drawImage. */}
            <video
                ref={videoRef}
                src={src}
                poster={poster}
                preload="auto"
                muted
                playsInline
                disablePictureInPicture
                aria-hidden="true"
                draggable={false}
                controls={false}
                style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    opacity: 0,
                    pointerEvents: 'none',
                }}
            />

            <canvas
                ref={canvasRef}
                aria-hidden="true"
                style={{
                    display: 'block',
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    pointerEvents: 'none',
                    userSelect: 'none',
                    opacity: isReady ? 1 : 0,
                    transition: 'opacity 400ms ease',
                }}
            />
        </div>
    );
}
