'use client';

import { useMemo, useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import { portfolioData } from '@/data/portfolio';
import { cn, formatDate } from '@/lib/utils';
import { usePerformance } from '@/hooks/usePerformance';
import { Experience } from '@/types';
import { SkillsFoundation } from '@/components/sections/skills/SkillsFoundation';

const EASE = [0.16, 1, 0.3, 1] as const;

function rolePeriod(exp: Experience): string {
    const start = formatDate(exp.startDate);
    if (exp.isOngoing || !exp.endDate) return `${start} — Present`;
    return `${start} — ${formatDate(exp.endDate)}`;
}

function sortRoles(experiences: Experience[]): Experience[] {
    return [...experiences].sort((a, b) => {
        if (a.isOngoing !== b.isOngoing) return a.isOngoing ? -1 : 1;
        return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
    });
}

function RoleRow({
    exp,
    index,
    open,
    onToggle,
    reduceMotion,
}: {
    exp: Experience;
    index: number;
    open: boolean;
    onToggle: () => void;
    reduceMotion: boolean;
}) {
    const bullets = exp.responsibilities?.slice(0, 3) ?? [];
    const year = new Date(exp.startDate).getFullYear();

    return (
        <motion.article
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-8% 0px' }}
            transition={{ duration: 0.5, delay: Math.min(index * 0.05, 0.3), ease: EASE }}
            className="relative border-t border-foreground/10 pl-12 md:pl-20"
        >
            <div className="absolute left-0 top-6 z-10 -translate-x-1/2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-background">
                    <span
                        className={cn(
                            'h-2.5 w-2.5 rounded-full border-2 transition-colors',
                            open
                                ? 'border-brand bg-brand'
                                : 'border-foreground/30 bg-background',
                        )}
                    />
                </div>
            </div>
            <span className="absolute left-5 top-7 hidden font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground md:inline">
                {year}
            </span>

            <button
                type="button"
                onClick={onToggle}
                aria-expanded={open}
                className="grid w-full grid-cols-1 gap-2 py-6 text-left sm:grid-cols-[minmax(0,1fr)_auto] sm:items-baseline sm:gap-8"
            >
                <div className="min-w-0">
                    <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground md:hidden">
                        {year}
                    </p>
                    <div className="flex items-center gap-3">
                        {exp.logo && (
                            <span className="relative hidden h-7 w-7 shrink-0 sm:block">
                                <Image
                                    src={exp.logo}
                                    alt=""
                                    fill
                                    unoptimized
                                    className="object-contain object-left"
                                />
                            </span>
                        )}
                        <p className="text-sm font-semibold tracking-tight text-foreground">
                            {exp.company}
                        </p>
                    </div>
                    <p className="mt-1 text-lg font-medium text-foreground/80 md:text-xl">
                        {exp.position}
                    </p>
                </div>
                <p
                    className={cn(
                        'font-mono text-[11px] font-bold uppercase tracking-widest sm:text-right',
                        open ? 'text-brand' : 'text-muted-foreground',
                    )}
                >
                    {rolePeriod(exp)}
                </p>
            </button>

            <AnimatePresence initial={false}>
                {open && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: EASE }}
                        className="overflow-hidden"
                    >
                        <div className="pb-8 pr-0 sm:pr-4">
                            <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-[15px]">
                                {exp.description}
                            </p>
                            {bullets.length > 0 && (
                                <ul className="mt-4 max-w-2xl space-y-2">
                                    {bullets.map((item) => (
                                        <li
                                            key={item}
                                            className="flex gap-2.5 text-sm text-muted-foreground"
                                        >
                                            <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-brand" />
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.article>
    );
}

function JourneyRoles({
    roles,
    openId,
    onToggle,
    reduceMotion,
}: {
    roles: Experience[];
    openId: string | null;
    onToggle: (id: string) => void;
    reduceMotion: boolean;
}) {
    const ref = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [height, setHeight] = useState(0);

    useEffect(() => {
        const node = ref.current;
        if (!node) return;

        const updateHeight = () => {
            const rect = node.getBoundingClientRect();
            setHeight(rect.height);
        };

        updateHeight();
        const observer = new ResizeObserver(updateHeight);
        observer.observe(node);
        return () => observer.disconnect();
    }, [openId]);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start 40%', 'end 50%'],
    });
    const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
    const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

    return (
        <div ref={containerRef} className="relative mt-2">
            <div ref={ref} className="relative">
                {roles.map((exp, index) => (
                    <RoleRow
                        key={exp.id}
                        exp={exp}
                        index={index}
                        open={openId === exp.id}
                        onToggle={() => onToggle(exp.id)}
                        reduceMotion={reduceMotion}
                    />
                ))}
                <div className="border-t border-foreground/10" />

                <div
                    style={{ height: `${height}px` }}
                    className="absolute left-0 top-0 w-[2px] -translate-x-1/2 overflow-hidden bg-[linear-gradient(to_bottom,var(--tw-gradient-stops))] from-transparent from-[0%] via-neutral-200 to-transparent to-[99%] [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_80%,transparent_100%)] dark:via-neutral-700"
                >
                    <motion.div
                        style={{
                            height: reduceMotion ? height : heightTransform,
                            opacity: reduceMotion ? 1 : opacityTransform,
                        }}
                        className="absolute inset-x-0 top-0 w-[2px] rounded-full bg-gradient-to-t from-brand via-brand/80 to-transparent from-[0%] via-[10%]"
                    />
                </div>
            </div>
        </div>
    );
}

export function ExperienceIndex() {
    const prefersReducedMotion = useReducedMotion();
    const { isLowPowerMode } = usePerformance();
    const reduceMotion = Boolean(prefersReducedMotion || isLowPowerMode);
    const [openId, setOpenId] = useState<string | null>(null);

    const roles = useMemo(() => sortRoles(portfolioData.experiences), []);
    const education = portfolioData.education;

    return (
        <div className="bg-background text-foreground">
            <SkillsFoundation
                showIntro
                showCards={false}
                eyebrow="Journey"
                heading="Architecture to products"
                tagline="The icons are the tools from the projects. Education and the roles that followed sit below."
            />

            <div className="mx-auto max-w-3xl px-4 pb-28 sm:px-6 lg:px-8">
                <section aria-labelledby="education-heading">
                    <h2
                        id="education-heading"
                        className="text-[10px] font-bold uppercase tracking-[0.32em] text-muted-foreground"
                    >
                        Education
                    </h2>
                    <ul className="mt-6">
                        {education.map((edu) => (
                            <li
                                key={edu.id}
                                className="border-t border-foreground/10 py-5"
                            >
                                <p className="text-lg font-semibold tracking-tight">
                                    {edu.institution}
                                </p>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    {edu.degree}
                                    {edu.major ? ` · ${edu.major}` : ''}
                                </p>
                            </li>
                        ))}
                    </ul>
                </section>

                <section aria-labelledby="roles-heading" className="mt-16">
                    <h2
                        id="roles-heading"
                        className="text-[10px] font-bold uppercase tracking-[0.32em] text-muted-foreground"
                    >
                        Roles
                    </h2>
                    <JourneyRoles
                        roles={roles}
                        openId={openId}
                        onToggle={(id) =>
                            setOpenId((current) => (current === id ? null : id))
                        }
                        reduceMotion={reduceMotion}
                    />
                </section>
            </div>
        </div>
    );
}
