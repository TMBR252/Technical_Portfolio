'use client';

import { useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { usePerformance } from '@/hooks/usePerformance';
import { cn } from '@/lib/utils';

const EASE = [0.16, 1, 0.3, 1] as const;

type ExperienceAssembleProps = {
    className?: string;
    title?: string;
    line?: string;
    tagline?: string;
};

export function ExperienceAssemble({
    className,
    title = 'JOURNEY',
    line = 'Figuring It Out',
    tagline = 'Mostly designing, occasionally overthinking, always creating.',
}: ExperienceAssembleProps) {
    const prefersReducedMotion = useReducedMotion();
    const { isLowPowerMode } = usePerformance();
    const staticTitle = Boolean(prefersReducedMotion || isLowPowerMode);
    const slices = title.length;

    const sliceMeta = useMemo(
        () =>
            Array.from({ length: slices }, (_, index) => ({
                index,
                from: (index - (slices - 1) / 2) * 28,
            })),
        [slices],
    );

    return (
        <header className={cn('relative w-full pt-28 pb-16 sm:pt-32 md:pt-40 md:pb-24', className)}>
            <h1 className="sr-only">{title}</h1>

            <div
                className="relative inline-block max-w-full"
                aria-hidden
            >
                <span className="invisible block select-none text-[clamp(3.25rem,14vw,9.5rem)] font-black uppercase leading-[0.85] tracking-tighter">
                    {title}
                </span>

                {staticTitle ? (
                    <span className="absolute inset-0 text-[clamp(3.25rem,14vw,9.5rem)] font-black uppercase leading-[0.85] tracking-tighter text-foreground">
                        {title}
                    </span>
                ) : (
                    sliceMeta.map(({ index, from }) => (
                        <span
                            key={index}
                            className="absolute inset-y-0 overflow-hidden"
                            style={{
                                left: `${(index / slices) * 100}%`,
                                width: `${100 / slices + 0.08}%`,
                            }}
                        >
                            <motion.span
                                className="absolute top-0 whitespace-nowrap text-[clamp(3.25rem,14vw,9.5rem)] font-black uppercase leading-[0.85] tracking-tighter text-foreground"
                                style={{ left: `${-index * 100}%` }}
                                initial={{ x: from }}
                                animate={{ x: 0 }}
                                transition={{
                                    duration: 1.2 + index * 0.03,
                                    delay: 0.08 + index * 0.028,
                                    ease: EASE,
                                }}
                            >
                                {title}
                            </motion.span>
                        </span>
                    ))
                )}
            </div>

            <motion.div
                className="mt-6 max-w-xl"
                initial={staticTitle ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: staticTitle ? 0 : 0.55, ease: EASE }}
            >
                <p className="text-lg font-semibold tracking-tight text-foreground md:text-xl">
                    {line}
                </p>
                <p className="mt-1 text-base text-muted-foreground md:text-lg">
                    {tagline}
                </p>
            </motion.div>
        </header>
    );
}
