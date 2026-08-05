'use client';

import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type ProjectMediaProps = {
    children: ReactNode;
    className?: string;
    stageClassName?: string;
    onClick?: () => void;
    /** Soft staged background. Default true. */
    staged?: boolean;
};

/**
 * Chrome-free project media frame: soft stage + rounded image, no browser UI.
 */
export function ProjectMedia({
    children,
    className,
    stageClassName,
    onClick,
    staged = true,
}: ProjectMediaProps) {
    const frame = (
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
                'overflow-hidden rounded-2xl border border-black/10 bg-white shadow-[0_25px_80px_-12px_rgba(0,0,0,0.28)] dark:border-white/10 dark:bg-zinc-950 dark:shadow-[0_25px_80px_-12px_rgba(0,0,0,0.65)]',
                onClick && 'cursor-zoom-in transition-transform duration-500 hover:scale-[1.01]',
                className
            )}
        >
            {children}
        </div>
    );

    if (!staged) return frame;

    return (
        <div
            className={cn(
                'relative w-full overflow-hidden rounded-3xl',
                'bg-[radial-gradient(ellipse_at_30%_20%,rgba(180,180,180,0.35),transparent_55%),radial-gradient(ellipse_at_80%_80%,rgba(140,140,140,0.2),transparent_50%),linear-gradient(160deg,#e8e8e6_0%,#d4d4d0_45%,#c8c8c4_100%)]',
                'dark:bg-[radial-gradient(ellipse_at_30%_20%,rgba(80,80,80,0.4),transparent_55%),radial-gradient(ellipse_at_80%_80%,rgba(50,50,50,0.35),transparent_50%),linear-gradient(160deg,#1a1a1a_0%,#121212_45%,#0a0a0a_100%)]',
                stageClassName
            )}
        >
            <div
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-[0.12] mix-blend-overlay dark:opacity-[0.08]"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
                }}
            />
            <div className="relative p-4 sm:p-8 md:p-12">{frame}</div>
        </div>
    );
}
