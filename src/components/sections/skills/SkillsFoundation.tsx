'use client';

import { motion } from 'framer-motion';
import { ArchedTechIconsInteractive } from '@/components/ui/ArchedTechIcons';
import { KineticTechGrid } from '@/components/ui/KineticTechGrid';
import { projectCoverage } from '@/lib/project-coverage';
import { cn } from '@/lib/utils';

export function SkillsFoundation({
    className,
    showIntro = true,
    showCards = true,
    heading = 'The kit from the work',
    tagline = 'I design the product and direct the build. Everything here comes straight from the case studies: the tools I work in, and the stacks those products run on.',
    eyebrow = 'Across the work',
}: {
    className?: string;
    showIntro?: boolean;
    showCards?: boolean;
    heading?: string;
    tagline?: string;
    eyebrow?: string;
}) {
    const { tools, stack } = projectCoverage();
    const archIcons = [...tools, ...stack].map((item) => ({
        src: item.icon,
        invertDark: item.invertDark,
    }));

    return (
        <section
            id="skills"
            className={cn(
                'relative overflow-hidden bg-background px-4 sm:px-8',
                showIntro ? 'pt-32 pb-24 sm:pt-36 md:pt-44' : 'pt-6 pb-8 md:pt-10 md:pb-12',
                className,
            )}
        >
            <div className="relative z-10 mx-auto w-full max-w-7xl">
                <div className="relative mb-0 flex w-full flex-col items-center justify-center">
                    <ArchedTechIconsInteractive key="arched-project-coverage" icons={archIcons} />

                    {showIntro && (
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ margin: '-100px', once: true }}
                            transition={{ duration: 0.6 }}
                            className="relative z-10 mx-auto -mt-[30px] max-w-3xl space-y-4 px-4 text-center pointer-events-auto sm:-mt-[50px] md:-mt-[70px]"
                        >
                            {eyebrow && (
                                <motion.span
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ margin: '-100px', once: true }}
                                    transition={{ duration: 0.5, delay: 0.2 }}
                                    className="block text-[10px] font-mono font-bold uppercase tracking-[0.5em] text-primary/80"
                                >
                                    {eyebrow}
                                </motion.span>
                            )}
                            <h2 className="text-4xl font-medium tracking-tight text-foreground md:text-6xl">
                                {heading}
                            </h2>
                            <p className="pt-2 text-sm leading-relaxed text-muted-foreground md:text-base">
                                {tagline}
                            </p>
                        </motion.div>
                    )}
                </div>

                {showCards && (
                    <>
                        <motion.div
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ margin: '-80px', once: true }}
                            transition={{ duration: 0.5 }}
                            className="mt-16 w-full sm:mt-20 md:mt-24"
                        >
                            <p className="mb-5 text-[10px] font-bold uppercase tracking-[0.32em] text-muted-foreground">
                                How I work
                            </p>
                            <KineticTechGrid items={tools} />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ margin: '-80px', once: true }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="mt-14 w-full md:mt-16"
                        >
                            <p className="mb-5 text-[10px] font-bold uppercase tracking-[0.32em] text-muted-foreground">
                                What the products run on
                            </p>
                            <KineticTechGrid items={stack} />
                        </motion.div>
                    </>
                )}
            </div>
        </section>
    );
}
