'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Award, Binary } from 'lucide-react';
import { portfolioData } from '@/data/portfolio';
import { Education } from '@/types';
import { cn } from '@/lib/utils';

const CornerAccents = ({ hoverClass }: { hoverClass: string }) => (
    <>
        <div className={cn("absolute -top-[1px] -left-[1px] w-4 h-4 border-t-2 border-l-2 border-black/40 dark:border-white/40 z-20 pointer-events-none transition-colors duration-500", hoverClass)} />
        <div className={cn("absolute -top-[1px] -right-[1px] w-4 h-4 border-t-2 border-r-2 border-black/40 dark:border-white/40 z-20 pointer-events-none transition-colors duration-500", hoverClass)} />
        <div className={cn("absolute -bottom-[1px] -left-[1px] w-4 h-4 border-b-2 border-l-2 border-black/40 dark:border-white/40 z-20 pointer-events-none transition-colors duration-500", hoverClass)} />
        <div className={cn("absolute -bottom-[1px] -right-[1px] w-4 h-4 border-b-2 border-r-2 border-black/40 dark:border-white/40 z-20 pointer-events-none transition-colors duration-500", hoverClass)} />
    </>
);

const formatYear = (iso: string) => new Date(iso).getFullYear();

/** Year range, or null when the dates aren't known - never guessed. */
function yearRange(edu: Education) {
    if (!edu.startDate) return null;
    const start = formatYear(edu.startDate);
    const end = edu.endDate ? formatYear(edu.endDate) : edu.isOngoing ? 'Present' : null;
    return end ? `${start} to ${end}` : `${start}`;
}

/** Texture only - both cards share the brand accent. */
const GRIDS = [
    'bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]',
    'bg-[radial-gradient(#80808012_1px,transparent_1px)] [background-size:16px_16px]',
];

function DegreeCard({
    edu,
    index,
    isLowPowerMode,
}: {
    edu: Education;
    index: number;
    isLowPowerMode?: boolean;
}) {
    const years = yearRange(edu);

    return (
        <motion.div
            initial={isLowPowerMode ? {} : { opacity: 0, y: 20 }}
            whileInView={isLowPowerMode ? {} : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
            className="col-span-1 border border-black/10 dark:border-white/10 bg-neutral-100 dark:bg-[#0a0a0a] overflow-hidden relative group flex flex-col min-h-[450px] transition-all duration-500 hover:-translate-y-2 hover:border-brand/50 hover:shadow-[0_20px_40px_-15px_rgb(var(--brand-rgb)/0.25)]"
        >
            <CornerAccents hoverClass="group-hover:border-brand" />

            <div className="p-8 relative z-10 transition-transform duration-500 group-hover:translate-x-1">
                <span className="block text-xs font-bold uppercase tracking-widest text-neutral-500 dark:text-neutral-400 group-hover:text-brand transition-colors">
                    {edu.degree}
                    {years && ` • ${years}`}
                </span>
                <h3 className="mt-3 text-3xl font-black text-neutral-900 dark:text-white">
                    {edu.institution}
                </h3>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center relative p-8 mt-auto border-t border-black/10 dark:border-white/10 bg-gradient-to-b from-transparent to-black/5 dark:to-white/5 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-brand/20 via-black/40 to-black/10 dark:from-brand/15 dark:via-black/50 dark:to-transparent transition-opacity duration-500 group-hover:opacity-80" />

                <div className="absolute inset-0 opacity-10 pointer-events-none">
                    <div className={cn('absolute inset-0', GRIDS[index % GRIDS.length])} />
                </div>

                <div className="relative z-10 flex flex-col items-center transition-transform duration-500 group-hover:scale-105">
                    <div className="relative mb-6">
                        <GraduationCap
                            className="w-32 h-32 md:w-36 md:h-36 text-white/90 drop-shadow-xl"
                            strokeWidth={1.25}
                        />

                        {/* Anchored to the cap, not the card */}
                        {edu.gpa && (
                            <div className="absolute -top-1 -right-7 text-right leading-none md:-right-9">
                                <span className="block font-mono text-3xl md:text-4xl font-black tabular-nums text-brand drop-shadow-[0_0_16px_rgb(var(--brand-rgb)/0.3)]">
                                    {edu.gpa}
                                </span>
                                <span className="mt-1.5 block font-mono text-[9px] uppercase tracking-[0.3em] text-white/70">
                                    GPA
                                </span>
                            </div>
                        )}
                    </div>

                    {edu.achievements && edu.achievements.length > 0 && (
                        <div className="flex flex-wrap gap-2 justify-center mb-4">
                            {edu.achievements.map((item) => (
                                <span
                                    key={item}
                                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] bg-black/40 dark:bg-white/10 text-white border border-white/20 font-mono font-bold backdrop-blur-md shadow-lg group-hover:border-brand/60 group-hover:text-brand transition-colors"
                                >
                                    <Award className="w-3 h-3" />
                                    {item}
                                </span>
                            ))}
                        </div>
                    )}

                    <p className="text-[10px] font-mono text-white/90 uppercase tracking-widest bg-black/50 px-2 py-1 rounded backdrop-blur-sm border border-white/10 group-hover:border-brand/50 transition-colors">
                        {edu.major}
                    </p>
                </div>

                {/*
                 * Sweep, not the shared `animate-scan`: that one animates `top`
                 * at constant opacity, so it reads as a hard bar parked on the
                 * card. This translates and fades at both ends instead.
                 */}
                {!isLowPowerMode && (
                    <motion.div
                        aria-hidden
                        className="pointer-events-none absolute inset-x-0 top-0 z-20 h-24 bg-[linear-gradient(to_bottom,transparent,rgb(var(--brand-rgb)/0.10),transparent)]"
                        initial={{ y: '-100%', opacity: 0 }}
                        animate={{ y: ['-100%', '420%'], opacity: [0, 1, 1, 0] }}
                        transition={{
                            duration: 4.5,
                            times: [0, 0.15, 0.85, 1],
                            repeat: Infinity,
                            repeatDelay: 2.5,
                            ease: 'linear',
                            delay: index * 1.2,
                        }}
                    />
                )}
            </div>
        </motion.div>
    );
}

export function EducationSection({ isLowPowerMode }: { isLowPowerMode?: boolean }) {
    const education = portfolioData.education;

    if (education.length === 0) return null;

    return (
        <div className="w-full max-w-6xl mx-auto p-4 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {education.map((edu, i) => (
                    <DegreeCard
                        key={edu.id}
                        edu={edu}
                        index={i}
                        isLowPowerMode={isLowPowerMode}
                    />
                ))}

                {/* Full-width closer, matching the original third card */}
                <motion.div
                    initial={isLowPowerMode ? {} : { opacity: 0, y: 20 }}
                    whileInView={isLowPowerMode ? {} : { opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: education.length * 0.2 }}
                    className="col-span-1 md:col-span-2 border border-black/10 dark:border-white/10 bg-neutral-100 dark:bg-[#0a0a0a] overflow-hidden relative group p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 transition-all duration-500 hover:border-brand/50 hover:shadow-[inset_0_0_30px_rgb(var(--brand-rgb)/0.08),0_0_30px_-5px_rgb(var(--brand-rgb)/0.25)] hover:bg-neutral-50 dark:hover:bg-[#0f0f0f]"
                >
                    <CornerAccents hoverClass="group-hover:border-brand" />
                    <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-brand/25 via-transparent to-transparent group-hover:opacity-40 transition-opacity duration-700" />

                    <div className="relative z-10 space-y-3 max-w-2xl">
                        <div className="flex items-center gap-2">
                            <Binary className="w-4 h-4 text-brand" />
                            <span className="text-xs font-bold uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
                                Applied Since
                            </span>
                        </div>
                        <h3 className="text-2xl md:text-3xl font-black text-neutral-900 dark:text-white">
                            Architecture into Product Engineering
                        </h3>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                            Two architecture degrees trained me to reason about constraints, codes, and complex spatial systems. That is the same thinking I now encode into automation products alongside domain experts.
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
