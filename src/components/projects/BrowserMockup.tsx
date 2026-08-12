'use client';

import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type BrowserMockupProps = {
    children: ReactNode;
    url?: string;
    className?: string;
    stageClassName?: string;
    onClick?: () => void;
};

/**
 * Dribbble-style browser frame on a soft staged background.
 * Role: presentation chrome for project case-study screenshots.
 */
export function BrowserMockup({
    children,
    url = 'primer.app',
    className,
    stageClassName,
    onClick,
}: BrowserMockupProps) {
    return (
        <div
            className={cn(
                'relative w-full overflow-hidden rounded-3xl',
                'bg-[radial-gradient(ellipse_at_30%_20%,rgba(180,180,180,0.35),transparent_55%),radial-gradient(ellipse_at_80%_80%,rgba(140,140,140,0.2),transparent_50%),linear-gradient(160deg,#e8e8e6_0%,#d4d4d0_45%,#c8c8c4_100%)]',
                'dark:bg-[radial-gradient(ellipse_at_30%_20%,rgba(80,80,80,0.4),transparent_55%),radial-gradient(ellipse_at_80%_80%,rgba(50,50,50,0.35),transparent_50%),linear-gradient(160deg,#1a1a1a_0%,#121212_45%,#0a0a0a_100%)]',
                stageClassName
            )}
        >
            {/* Grain */}
            <div
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-[0.12] mix-blend-overlay dark:opacity-[0.08]"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
                }}
            />

            <div className={cn('relative p-4 sm:p-8 md:p-12', className)}>
                <div
                    role={onClick ? 'button' : undefined}
                    tabIndex={onClick ? 0 : undefined}
                    onClick={onClick}
                    onKeyDown={
                        onClick
                            ? (e) => {
                                  if (e.key === 'Enter' || e.key === ' ') {
                                      e.preventDefault();
                                      onClick();
                                  }
                              }
                            : undefined
                    }
                    className={cn(
                        'overflow-hidden rounded-xl border border-black/10 bg-white shadow-[0_25px_80px_-12px_rgba(0,0,0,0.35)] dark:border-white/10 dark:bg-zinc-950 dark:shadow-[0_25px_80px_-12px_rgba(0,0,0,0.7)]',
                        onClick && 'cursor-zoom-in transition-transform duration-500 hover:scale-[1.01]'
                    )}
                >
                    {/* Chrome bar */}
                    <div className="flex items-center gap-3 border-b border-black/8 bg-[#f4f4f2] px-3 py-2.5 dark:border-white/8 dark:bg-zinc-900">
                        <div className="flex shrink-0 gap-1.5">
                            <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
                            <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
                            <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
                        </div>
                        <div className="mx-auto flex min-w-0 max-w-md flex-1 items-center justify-center rounded-md bg-white/80 px-3 py-1 text-[11px] font-medium text-zinc-500 shadow-sm ring-1 ring-black/5 dark:bg-zinc-800/80 dark:text-zinc-400 dark:ring-white/5">
                            <span className="truncate">{url}</span>
                        </div>
                        <div className="w-[42px] shrink-0" aria-hidden />
                    </div>

                    {/* Viewport */}
                    <div className="relative bg-white dark:bg-zinc-950">{children}</div>
                </div>
            </div>
        </div>
    );
}
