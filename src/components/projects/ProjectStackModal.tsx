'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { TechGroup } from '@/types';

type ProjectStackModalProps = {
    groups: TechGroup[];
    title: string;
    onClose: () => void;
};

/**
 * Full tools and technologies inventory, grouped. Opened from the project sidebar.
 * Groups flow in CSS columns rather than a grid so uneven group lengths pack tightly
 * instead of leaving ragged rows.
 */
export function ProjectStackModal({ groups, title, onClose }: ProjectStackModalProps) {
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [onClose]);

    useEffect(() => {
        const prev = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = prev;
        };
    }, []);

    const total = groups.reduce((sum, group) => sum + group.items.length, 0);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 p-4 backdrop-blur-xl sm:p-8"
            role="dialog"
            aria-modal="true"
            aria-label={title}
        >
            <motion.div
                initial={{ opacity: 0, y: 24, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 24, scale: 0.98 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                onClick={(e) => e.stopPropagation()}
                className="flex max-h-full w-full max-w-5xl flex-col overflow-hidden rounded-3xl border border-black/20 bg-card shadow-2xl dark:border-white/10"
            >
                <header className="flex items-start justify-between gap-6 border-b border-black/20 px-6 py-6 dark:border-white/10 sm:px-8">
                    <div className="min-w-0">
                        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-black/20 bg-secondary/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground dark:border-border/40 dark:bg-secondary/5">
                            <span className="h-2 w-2 rounded-full bg-brand" />
                            Stack
                        </div>
                        <h2 className="text-2xl font-black uppercase leading-none tracking-tight text-foreground sm:text-3xl">
                            {title}
                        </h2>
                        <p className="mt-3 font-mono text-xs text-brand/80">
                            {total} entries / {groups.length} {groups.length === 1 ? 'category' : 'categories'}
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close"
                        className="-mr-2 -mt-2 shrink-0 rounded-full border border-black/20 p-2.5 text-muted-foreground transition-colors hover:border-brand hover:bg-brand/10 hover:text-foreground dark:border-white/20"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </header>

                <div
                    data-lenis-prevent="true"
                    className="overflow-y-auto px-6 py-8 sm:px-8 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-black/15 dark:[&::-webkit-scrollbar-thumb]:bg-white/15 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar]:w-1.5"
                >
                    <div className="columns-1 gap-x-10 sm:columns-2 lg:columns-3">
                        {groups.map((group) => (
                            <section key={group.label} className="mb-8 break-inside-avoid">
                                <div className="mb-3 flex items-baseline justify-between gap-3 border-b border-black/15 pb-2 dark:border-white/5">
                                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                                        {group.label}
                                    </h3>
                                    <span className="shrink-0 font-mono text-[10px] text-muted-foreground/60">
                                        {String(group.items.length).padStart(2, '0')}
                                    </span>
                                </div>
                                <ul className="flex flex-wrap gap-1.5">
                                    {group.items.map((item) => (
                                        <li
                                            key={item}
                                            className={cn(
                                                'rounded-lg border border-black/15 bg-secondary/20 px-2.5 py-1.5',
                                                'font-mono text-[11px] leading-none text-foreground/75 transition-colors',
                                                'hover:border-brand/50 hover:text-foreground dark:border-white/10 dark:bg-white/[0.04]',
                                            )}
                                        >
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        ))}
                    </div>
                </div>

                <footer className="flex items-center justify-between gap-4 border-t border-black/20 px-6 py-4 font-mono text-[10px] uppercase tracking-widest text-muted-foreground dark:border-white/10 sm:px-8">
                    <span>Everything shipped in this project</span>
                    <span className="shrink-0">Esc to close</span>
                </footer>
            </motion.div>
        </motion.div>
    );
}
