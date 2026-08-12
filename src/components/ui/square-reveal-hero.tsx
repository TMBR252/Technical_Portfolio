"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { usePathname } from "next/navigation";
import { useLenis } from "lenis/react";
import { cn } from "@/lib/utils";

export type PreloadPhase = "intro" | "text" | "reveal" | "done";

export const PreloadContext = React.createContext<{
    isPreloading: boolean;
    phase: PreloadPhase;
}>({ isPreloading: true, phase: "intro" });

export const usePreloadState = () => React.useContext(PreloadContext);

export interface SquareRevealHeroProps {
    className?: string;
    introClassName?: string;
    revealClassName?: string;
    children?: React.ReactNode;
}

/** Hold on solid green + baked-in label, then staggered square dissolve. */
const LABEL_HOLD_DURATION = 1100;
const TILE_ANIMATION_MS = 420;
const STAGGER_WINDOW_MS = 1100;
const DISSOLVE_DURATION = TILE_ANIMATION_MS + STAGGER_WINDOW_MS + 120;

type GridConfig = {
    columns: number;
    rows: number;
    tileCount: number;
    order: number[];
    width: number;
    height: number;
};

function hasSessionLoaded() {
    if (typeof window === "undefined") return false;
    try {
        return window.sessionStorage.getItem("portfolioLoaded") === "true";
    } catch {
        return false;
    }
}

function titleForPath(pathname: string) {
    if (pathname === "/") return "HOME";

    const parts = pathname.split("/").filter(Boolean);
    if ((parts[0] === "projects" || parts[0] === "blog") && parts.length > 1) {
        const slug = parts[1];

        return slug
            .split("-")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ")
            .toUpperCase();
    }

    if (parts.length > 0) {
        return (parts[0].charAt(0).toUpperCase() + parts[0].slice(1)).toUpperCase();
    }

    return "LOADING";
}

function shuffledIndices(count: number, seed: number) {
    const indices = Array.from({ length: count }, (_, index) => index);
    let state = seed || 1;

    for (let index = indices.length - 1; index > 0; index -= 1) {
        state = (state * 1664525 + 1013904223) >>> 0;
        const swapIndex = state % (index + 1);
        [indices[index], indices[swapIndex]] = [indices[swapIndex], indices[index]];
    }

    return indices;
}

/**
 * Always use the window viewport. Measuring the overlay box is unsafe: before
 * the portal commits it lives inside `.marvin-page-shell` (`container-type`)
 * and Lenis, so clientWidth can be a 1280×720-style patch in the top-left.
 */
function getViewportSize() {
    if (typeof window === "undefined") {
        return { width: 0, height: 0 };
    }
    const vv = window.visualViewport;
    const width = Math.max(
        Math.ceil(window.innerWidth || 0),
        Math.ceil(document.documentElement?.clientWidth || 0),
        Math.ceil(vv?.width ?? 0),
    );
    const height = Math.max(
        Math.ceil(window.innerHeight || 0),
        Math.ceil(document.documentElement?.clientHeight || 0),
        Math.ceil(vv?.height ?? 0),
    );
    return { width, height };
}

function buildGrid(width: number, height: number, seed: number): GridConfig {
    // Phone / tablet / desktop tile density — keep dissolve readable on small screens.
    const baseTileSize = width < 768 ? 64 : width < 1024 ? 84 : 104;
    const tileSize = Math.max(
        baseTileSize,
        Math.ceil(Math.sqrt((width * height) / 280)),
    );
    const columns = Math.max(1, Math.ceil(width / tileSize));
    const rows = Math.max(1, Math.ceil(height / tileSize));
    const tileCount = columns * rows;

    return {
        columns,
        rows,
        tileCount,
        order: shuffledIndices(tileCount, seed * 37 + 31),
        width,
        height,
    };
}

function readBrandColors() {
    const styles = getComputedStyle(document.documentElement);
    const brand = styles.getPropertyValue("--brand").trim() || "#d1ff4d";
    const inkRgb = styles.getPropertyValue("--brand-foreground-rgb").trim();
    const ink = inkRgb ? `rgb(${inkRgb})` : "#111111";
    return { brand, ink };
}

function fitFontSize(
    ctx: CanvasRenderingContext2D,
    label: string,
    fontFamily: string,
    width: number,
    maxSize: number,
    minSize: number,
) {
    const maxWidth = width * 0.86;
    let size = maxSize;
    while (size > minSize) {
        ctx.font = `900 ${size}px ${fontFamily}`;
        if (ctx.measureText(label).width <= maxWidth) return size;
        size -= 2;
    }
    return minSize;
}

function paintComposition(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    label: string,
) {
    const { brand, ink } = readBrandColors();
    // Caller sets a DPR transform. Do not reset it — that would paint only the
    // top-left 1/dpr quadrant on retina displays.
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = brand;
    ctx.fillRect(0, 0, width, height);

    const fontFamily =
        getComputedStyle(document.body).fontFamily ||
        "Inter, system-ui, sans-serif";
    // Long project titles need more room on narrow widths.
    const maxSize =
        width < 768
            ? Math.min(Math.max(width * 0.11, 36), 72)
            : width < 1024
              ? Math.min(Math.max(width * 0.12, 48), 112)
              : Math.min(Math.max(width * 0.13, 56), 176);
    const minSize = width < 768 ? Math.max(22, width * 0.05) : Math.max(28, width * 0.045);
    const fontSize = fitFontSize(ctx, label, fontFamily, width, maxSize, minSize);

    ctx.fillStyle = ink;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = `900 ${fontSize}px ${fontFamily}`;
    // letterSpacing is not reliable on canvas — approximate with tighter tracking via scaleX
    ctx.save();
    ctx.translate(width / 2, height / 2);
    ctx.scale(0.96, 1);
    ctx.fillText(label, 0, 0);
    ctx.restore();
}

function easeOutCubic(t: number) {
    return 1 - (1 - t) ** 3;
}

export function SquareRevealHero({
    className,
    introClassName,
    revealClassName,
    children,
}: SquareRevealHeroProps) {
    const pathname = usePathname();
    const lenis = useLenis();

    const [phase, setPhase] = React.useState<PreloadPhase>("text");
    const [previousPathname, setPreviousPathname] = React.useState(pathname);
    const [transitionIndex, setTransitionIndex] = React.useState(0);
    const [reduceMotion, setReduceMotion] = React.useState(false);
    const [sessionChecked, setSessionChecked] = React.useState(false);
    // Locked for the whole transition so every word (WELCOME / HOME / PROJECTS / …)
    // is baked into the dissolving surface — never a live DOM text layer.
    const [surfaceLabel, setSurfaceLabel] = React.useState("WELCOME");
    const [grid, setGrid] = React.useState<GridConfig>(() => buildGrid(0, 0, 0));

    const canvasRef = React.useRef<HTMLCanvasElement>(null);
    const overlayRef = React.useRef<HTMLDivElement>(null);
    const sourceRef = React.useRef<HTMLCanvasElement | null>(null);
    const [portalTarget, setPortalTarget] = React.useState<HTMLElement | null>(null);

    const showOverlay = phase !== "done";

    const syncGrid = React.useCallback((seed: number) => {
        const { width, height } = getViewportSize();
        if (width < 2 || height < 2) return;
        setGrid((prev) => {
            if (prev.width === width && prev.height === height) return prev;
            return buildGrid(width, height, seed);
        });
    }, []);

    React.useLayoutEffect(() => {
        setPortalTarget(document.body);
    }, []);

    // Measure once before paint; skip welcome on in-session revisits.
    React.useLayoutEffect(() => {
        syncGrid(transitionIndex);

        const media = window.matchMedia("(prefers-reduced-motion: reduce)");
        setReduceMotion(media.matches);

        if (hasSessionLoaded()) {
            setPhase("done");
        } else {
            setSurfaceLabel("WELCOME");
        }

        setSessionChecked(true);
    }, []);

    // Lock a fresh grid when a route transition starts.
    React.useLayoutEffect(() => {
        if (transitionIndex === 0) return;
        syncGrid(transitionIndex);
    }, [transitionIndex, syncGrid]);

    // Overlay is portaled to body (outside Lenis / container-type). Keep bitmap in sync with that box.
    React.useLayoutEffect(() => {
        if (!showOverlay) return;

        const overlay = overlayRef.current;
        syncGrid(transitionIndex);

        const onResize = () => {
            if (phase === "reveal") return;
            syncGrid(transitionIndex);
        };

        const ro = overlay ? new ResizeObserver(onResize) : null;
        if (overlay && ro) ro.observe(overlay);
        window.addEventListener("resize", onResize);
        window.visualViewport?.addEventListener("resize", onResize);

        return () => {
            ro?.disconnect();
            window.removeEventListener("resize", onResize);
            window.visualViewport?.removeEventListener("resize", onResize);
        };
    }, [showOverlay, phase, transitionIndex, syncGrid, portalTarget]);

    // Reset during render so the incoming page cannot paint before coverage begins.
    if (pathname !== previousPathname) {
        setPreviousPathname(pathname);
        setSurfaceLabel(titleForPath(pathname));
        setPhase("text");
        setTransitionIndex((index) => index + 1);
    }

    const isInitialRender = React.useRef(true);
    const [renderedChildren, setRenderedChildren] = React.useState(children);

    React.useEffect(() => {
        isInitialRender.current = false;
    }, []);

    React.useEffect(() => {
        if (phase === "text" || phase === "reveal" || phase === "done" || isInitialRender.current) {
            setRenderedChildren(children);
        }
    }, [children, phase]);

    React.useEffect(() => {
        const media = window.matchMedia("(prefers-reduced-motion: reduce)");
        const onMotion = () => setReduceMotion(media.matches);
        media.addEventListener("change", onMotion);
        return () => media.removeEventListener("change", onMotion);
    }, []);

    React.useEffect(() => {
        const isPreloading = phase !== "done";
        window.dispatchEvent(new CustomEvent("preload-state-change", { detail: isPreloading }));

        if (isPreloading) {
            document.body.style.overflow = "hidden";
            document.documentElement.style.overflow = "hidden";
            window.scrollTo(0, 0);
            lenis?.stop();
        } else {
            document.body.style.overflow = "";
            document.documentElement.style.overflow = "";
            lenis?.start();
        }

        return () => {
            document.body.style.overflow = "";
            document.documentElement.style.overflow = "";
            lenis?.start();
            window.dispatchEvent(new CustomEvent("preload-state-change", { detail: false }));
        };
    }, [lenis, phase]);

    React.useEffect(() => {
        if (!sessionChecked || phase === "done") return;

        const wait =
            phase === "text"
                ? reduceMotion
                    ? 0
                    : LABEL_HOLD_DURATION
                : phase === "reveal"
                    ? reduceMotion
                        ? 250
                        : DISSOLVE_DURATION
                    : 0;

        const timeout = window.setTimeout(() => {
            if (phase === "text") {
                setPhase("reveal");
                return;
            }

            if (phase === "reveal") {
                setPhase("done");
                try {
                    window.sessionStorage.setItem("portfolioLoaded", "true");
                } catch {
                    // Storage can be unavailable in private browsing contexts.
                }
            }
        }, wait);

        return () => window.clearTimeout(timeout);
    }, [phase, reduceMotion, transitionIndex, sessionChecked]);

    // Paint green + label into one bitmap so the word is part of the surface.
    React.useLayoutEffect(() => {
        if (!showOverlay) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const width = grid.width;
        const height = grid.height;
        if (width < 2 || height < 2) return;
        const dpr = Math.min(window.devicePixelRatio || 1, 2);

        const source = document.createElement("canvas");
        source.width = Math.max(1, Math.floor(width * dpr));
        source.height = Math.max(1, Math.floor(height * dpr));
        const sourceCtx = source.getContext("2d");
        if (!sourceCtx) return;

        sourceCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
        paintComposition(sourceCtx, width, height, surfaceLabel);
        sourceRef.current = source;

        canvas.width = source.width;
        canvas.height = source.height;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        canvas.style.display = "block";

        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(source, 0, 0);
    }, [showOverlay, grid, surfaceLabel, transitionIndex]);

    // Dissolve by fading square slices of that same bitmap.
    React.useEffect(() => {
        if (phase !== "reveal") return;

        const canvas = canvasRef.current;
        const source = sourceRef.current;
        if (!canvas || !source) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        if (reduceMotion) {
            let start: number | null = null;
            let raf = 0;
            const tick = (now: number) => {
                if (start === null) start = now;
                const t = Math.min(1, (now - start) / 250);
                ctx.setTransform(1, 0, 0, 1, 0, 0);
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.globalAlpha = 1 - t;
                ctx.drawImage(source, 0, 0);
                ctx.globalAlpha = 1;
                if (t < 1) raf = requestAnimationFrame(tick);
            };
            raf = requestAnimationFrame(tick);
            return () => cancelAnimationFrame(raf);
        }

        const { columns, rows, tileCount, order } = grid;
        const tileW = canvas.width / columns;
        const tileH = canvas.height / rows;
        const stagger = tileCount > 1 ? STAGGER_WINDOW_MS / (tileCount - 1) : 0;

        let start: number | null = null;
        let raf = 0;

        const tick = (now: number) => {
            if (start === null) start = now;
            const elapsed = now - start;

            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            for (let index = 0; index < tileCount; index += 1) {
                const delay = order[index] * stagger;
                const local = Math.min(1, Math.max(0, (elapsed - delay) / TILE_ANIMATION_MS));
                const opacity = 1 - easeOutCubic(local);
                if (opacity <= 0.01) continue;

                const col = index % columns;
                const row = Math.floor(index / columns);
                const x = col * tileW;
                const y = row * tileH;

                ctx.globalAlpha = opacity;
                ctx.drawImage(source, x, y, tileW, tileH, x, y, tileW, tileH);
            }

            ctx.globalAlpha = 1;

            if (elapsed < DISSOLVE_DURATION) {
                raf = requestAnimationFrame(tick);
            }
        };

        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, [phase, grid, reduceMotion, transitionIndex]);

    const overlay =
        showOverlay && grid.width > 1 && grid.height > 1 ? (
        <div
            ref={overlayRef}
            className={cn("pointer-events-auto overflow-hidden", introClassName)}
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: grid.width,
                height: grid.height,
                zIndex: 2147483646,
                margin: 0,
                background: "transparent",
            }}
            aria-live="polite"
            aria-label={`Loading ${surfaceLabel}`}
        >
            <canvas
                ref={canvasRef}
                className="absolute top-0 left-0 block"
                style={{ width: grid.width, height: grid.height }}
                aria-hidden
            />
        </div>
    ) : null;

    return (
        <div className={cn("relative isolate min-h-screen w-full bg-background text-foreground", className)}>
            <PreloadContext.Provider value={{ isPreloading: showOverlay, phase }}>
                <div className={cn("relative z-0", revealClassName)}>{renderedChildren}</div>
            </PreloadContext.Provider>

            {overlay && portalTarget ? createPortal(overlay, portalTarget) : null}
        </div>
    );
}
