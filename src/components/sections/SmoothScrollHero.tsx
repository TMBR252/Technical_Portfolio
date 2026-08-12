"use client";

import {
    motion,
    useMotionTemplate,
    useScroll,
    useTransform,
    useSpring,
    MotionValue,
} from "framer-motion";
import { usePerformance } from "@/hooks/usePerformance";

export const SmoothScrollHero = () => {
    const { isLowPowerMode } = usePerformance();
    return (
        <div className="bg-background text-zinc-900 dark:text-zinc-50 relative z-0">
            <Hero isLowPowerMode={isLowPowerMode} />
        </div>
    );
};

const SECTION_HEIGHT = 1500;

const Hero = ({ isLowPowerMode }: { isLowPowerMode: boolean }) => {
    const { scrollY } = useScroll();

    const smoothScrollY = useSpring(scrollY, isLowPowerMode ? {
        stiffness: 50,
        damping: 30
    } : {
        mass: 0.1,
        stiffness: 100,
        damping: 20
    });

    return (
        <div
            style={{ height: `calc(${SECTION_HEIGHT}px + 100vh)` }}
            className="relative w-full"
        >
            <CenterImage scrollY={smoothScrollY} isLowPowerMode={isLowPowerMode} />

            {!isLowPowerMode && <ParallaxImages scrollY={smoothScrollY} />}

            <div className="absolute bottom-0 left-0 right-0 h-96 bg-gradient-to-b from-transparent to-background z-20 pointer-events-none" />
        </div>
    );
};

const CenterImage = ({
    scrollY,
    isLowPowerMode,
}: {
    scrollY: MotionValue<number>;
    isLowPowerMode: boolean;
}) => {
    const scale = useTransform(scrollY, [0, SECTION_HEIGHT], [0.5, 1]);
    const borderRadius = useTransform(scrollY, [0, SECTION_HEIGHT], [24, 0]);
    const opacity = useTransform(
        scrollY,
        [SECTION_HEIGHT + 1000, SECTION_HEIGHT + 1600],
        [1, 0]
    );

    const textOpacity = useTransform(scrollY, [0, 200], [1, 0]);
    const textScale = useTransform(scrollY, [0, 200], [1, isLowPowerMode ? 1 : 1.08]);
    const textY = useTransform(scrollY, [0, 200], [0, isLowPowerMode ? 0 : 40]);

    return (
        <div className="sticky top-0 z-0 flex h-[100dvh] w-full items-center justify-center overflow-hidden">
            <motion.div
                style={{
                    scale,
                    borderRadius,
                    opacity,
                    backgroundImage:
                        "url('/experience/Foto Utama.webp')",
                    backgroundPosition: "center",
                    backgroundSize: "cover",
                    backgroundRepeat: "no-repeat",
                }}
                className="relative h-full w-full origin-center shadow-2xl"
            >
                <div className="absolute inset-0 bg-black/40" />
            </motion.div>

            <div className="absolute inset-0 z-10 flex items-center justify-center px-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                    style={{
                        opacity: textOpacity,
                        scale: textScale,
                        y: textY,
                    }}
                    className="relative flex w-[min(92vw,72rem)] flex-col items-center justify-center rounded-[2rem] bg-white/50 px-6 py-10 text-center backdrop-blur-[80px] dark:bg-black/40 md:rounded-[3rem] md:px-16 md:py-16 lg:px-24 lg:py-20"
                >
                    <h1 className="font-black uppercase leading-[0.82] tracking-[-0.06em] text-foreground dark:text-white text-[clamp(2.75rem,11vw,10rem)]">
                        Experience
                    </h1>

                    <p className="mt-6 max-w-xl text-sm leading-relaxed text-foreground/70 dark:text-white/70 md:mt-8 md:text-lg">
                        From spatial systems thinking to shipping AI automation. A timeline of roles, constraints, and work that made it into production.
                    </p>
                </motion.div>
            </div>
        </div>
    );
};

const ParallaxImages = ({ scrollY }: { scrollY: MotionValue<number> }) => {
    return (
        <div className="mx-auto max-w-7xl px-4 absolute inset-0 z-20 pointer-events-none grid grid-cols-12 gap-4 h-full items-end pb-[10vh]">
            <div className="col-span-3 col-start-2">
                <ParallaxImg
                    scrollY={scrollY}
                    src="/experience/FotoSC1.webp"
                    alt="Space launch"
                    start={800}
                    end={-1500}
                    className="w-full shadow-2xl rounded-2xl border border-white/10 aspect-[4/3] object-cover"
                />
            </div>

            <div className="col-span-3 col-start-10 mb-32">
                <ParallaxImg
                    scrollY={scrollY}
                    src="/experience/FotoSC2.webp"
                    alt="Space launch"
                    start={1000}
                    end={-1500}
                    className="w-full shadow-2xl rounded-2xl border border-white/10 aspect-square object-cover"
                />
            </div>

            <div className="col-span-4 col-start-5 mb-10">
                <ParallaxImg
                    scrollY={scrollY}
                    src="/experience/FotoSC3.webp"
                    alt="Satellite view"
                    start={900}
                    end={-1800}
                    className="w-full shadow-2xl rounded-2xl border border-white/10 aspect-video object-cover"
                />
            </div>

            <div className="col-span-3 col-start-1 mb-64">
                <ParallaxImg
                    scrollY={scrollY}
                    src="/experience/FotoSC4.webp"
                    alt="Space texture"
                    start={1200}
                    end={-2000}
                    className="w-full shadow-2xl rounded-2xl border border-white/10 aspect-[3/4] object-cover"
                />
            </div>

            <div className="col-span-4 col-start-8 mb-40">
                <ParallaxImg
                    scrollY={scrollY}
                    src="/experience/FotoSC5.webp"
                    alt="Orbiting satellite"
                    start={1100}
                    end={-2000}
                    className="w-full shadow-2xl rounded-2xl border border-white/10 aspect-video object-cover"
                />
            </div>
        </div>
    );
};

const ParallaxImg = ({ className, alt, src, start, end, scrollY }: { className?: string, alt: string, src: string, start: number, end: number, scrollY: MotionValue<number> }) => {
    const opacity = useTransform(scrollY, [0, SECTION_HEIGHT * 1.2], [1, 0]);
    const scale = useTransform(scrollY, [0, SECTION_HEIGHT], [1, 1.2]);
    const y = useTransform(scrollY, [0, SECTION_HEIGHT], [start, end]);
    const transform = useMotionTemplate`translateY(${y}px) scale(${scale})`;

    return (
        <motion.img
            src={src}
            alt={alt}
            className={className}
            style={{ transform, opacity }}
        />
    );
};
