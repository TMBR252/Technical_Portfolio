"use client";

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import { ArrowUpRight, Cpu, Briefcase, Rocket, Link2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { portfolioData } from '@/data/portfolio';
import { SITE_FEATURES } from '@/lib/site-features';

const PreviewCard = ({
    title,
    subtitle,
    description,
    href,
    icon: Icon,
    index
}: {
    title: string;
    subtitle: string;
    description: string;
    href: string;
    icon: any;
    index: number;
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: index * 0.1 }}
            className="group relative h-full"
        >
            <Link
                href={href}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="block h-full min-h-[16rem] md:min-h-[18rem]"
            >
                <div className="relative h-full p-8 md:p-12 bg-zinc-50 dark:bg-zinc-950 border border-black/5 dark:border-white/5 rounded-3xl overflow-hidden transition-all duration-700 touch-manipulation hover:bg-white dark:hover:bg-zinc-900 active:bg-white dark:active:bg-zinc-900 group-hover:border-brand/40 group-active:border-brand/40 group-focus-within:border-brand/40">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.01] pointer-events-none group-hover:opacity-[0.05] group-active:opacity-[0.05] transition-opacity duration-700">
                        <div className="absolute inset-0" style={{
                            backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)',
                            backgroundSize: '24px 24px'
                        }} />
                    </div>

                    <div className="relative z-10 flex flex-col h-full space-y-6">
                        <div className="flex items-start justify-between">
                            <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 shadow-sm border border-black/5 dark:border-white/5 group-hover:scale-110 group-active:scale-110 group-hover:shadow-brand/20 group-active:shadow-brand/20 transition-all duration-700">
                                <Icon className="w-6 h-6 text-brand" />
                            </div>
                            <div className="h-10 w-10 flex items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800 opacity-0 group-hover:opacity-100 group-active:opacity-100 -translate-y-4 group-hover:translate-y-0 group-active:translate-y-0 transition-all duration-700">
                                <ArrowUpRight className="w-5 h-5 text-brand" />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-brand/70 group-hover:text-brand group-active:text-brand transition-colors duration-700">
                                {subtitle}
                            </span>
                            <h3 className="text-3xl md:text-4xl font-black text-foreground uppercase tracking-tighter leading-none group-hover:tracking-normal group-active:tracking-normal transition-all duration-700">
                                {title}
                            </h3>
                        </div>

                        <p className="text-sm text-muted-foreground/80 leading-relaxed font-medium">
                            {description}
                        </p>

                        <div className="pt-4 mt-auto">
                            <div className="flex items-center gap-2">
                                <div className="h-px flex-1 bg-black/5 dark:bg-white/5 group-hover:bg-brand/40 group-active:bg-brand/40 transition-colors duration-700" />
                                <span className="text-[10px] font-mono uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 group-active:opacity-100 translate-x-4 group-hover:translate-x-0 group-active:translate-x-0 transition-all duration-700 text-brand">
                                    Explore Section
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
};

export default function AboutMeHub() {
    const sectionRef = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"]
    });

    const y = useTransform(scrollYProgress, [0, 1], [0, -100]);

    const items = [
        ...(SITE_FEATURES.fullAboutNav
            ? [
                  {
                      title: "Competency",
                      subtitle: "Tech Stack & Soft Skills",
                      description:
                          "A comprehensive matrix of my technical arsenal from AI/ML research to enterprise full-stack architectures.",
                      href: "/skills",
                      icon: Cpu,
                  },
              ]
            : []),
        {
            title: "Production",
            subtitle: "Featured Engineering",
            description: "Deep-dives into my most significant builds across AI systems, Web3 protocols, and enterprise SaaS.",
            href: "/projects",
            icon: Rocket
        },
        {
            title: "Trajectory",
            subtitle: "Professional Journey",
            description: "A detailed timeline of my path as a design and product engineer - AI products, shipping craft, and roles that matter.",
            href: "/experience",
            icon: Briefcase
        },
        {
            title: "Linktree",
            subtitle: "All my links",
            description: "All my links",
            href: portfolioData.personal.linktreeUrl || "https://linktr.ee/",
            icon: Link2
        }
    ];

    return (
        <section ref={sectionRef} className="relative py-32 overflow-hidden bg-background dark:bg-black">
            {/* Background elements */}
            <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.01] pointer-events-none">
                <div className="absolute inset-0" style={{
                    backgroundImage: 'linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)',
                    backgroundSize: '100px 100px'
                }} />
            </div>

            <div className="container-creative relative z-10 px-6 md:px-12 lg:px-24">
                <div
                    className={cn(
                        'grid gap-6 lg:gap-8',
                        SITE_FEATURES.fullAboutNav
                            ? 'grid-cols-1 md:grid-cols-2'
                            : // Projects + Experience share a row on tablet+; Linktree full-width below
                              'grid-cols-1 md:grid-cols-2 md:auto-rows-fr'
                    )}
                >
                    {items.map((item, idx) => {
                        const isLinktree = item.title === 'Linktree';
                        const spanFull =
                            !SITE_FEATURES.fullAboutNav && isLinktree;
                        return (
                            <div
                                key={item.title}
                                className={cn(
                                    'min-h-0 h-full',
                                    spanFull && 'md:col-span-2'
                                )}
                            >
                                <PreviewCard {...item} index={idx} />
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
