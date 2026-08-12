'use client';

import { ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

type ProjectLiveEmbedProps = {
    /** iframe src — a same-origin embed path built from the project repo, or an absolute embed URL */
    src: string;
    /** Full-size destination for what the frame contains. Also supplies the chrome bar label. */
    externalUrl?: string;
    title: string;
    /** Overrides the note under the frame. Defaults to built-site wording. */
    caption?: string;
    /** Overrides the chrome bar link text. Defaults to "Open live". */
    openLabel?: string;
    className?: string;
};

/** Live preview frame — interactive iframe of the project site or a hosted prototype. */
export function ProjectLiveEmbed({ src, externalUrl, title, caption, openLabel, className }: ProjectLiveEmbedProps) {
    // The chrome bar names the public destination, falling back to the src when the
    // frame has no separate full-size home.
    const openUrl = externalUrl ?? src;
    let displayUrl = openUrl;
    try {
        displayUrl = new URL(openUrl, typeof window !== 'undefined' ? window.location.origin : 'https://localhost').host;
    } catch {
        displayUrl = openUrl.replace(/^\//, '');
    }

    return (
        <div
            className={cn(
                'overflow-hidden rounded-3xl border border-black/15 bg-white shadow-[0_24px_80px_-24px_rgba(0,0,0,0.35)] dark:border-white/10 dark:bg-zinc-950 dark:shadow-none',
                className,
            )}
        >
            <div className="flex items-center gap-3 border-b border-black/10 bg-zinc-100/90 px-4 py-3 dark:border-white/10 dark:bg-zinc-900/90">
                <div className="flex gap-1.5" aria-hidden>
                    <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
                    <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/80" />
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
                </div>
                <p className="min-w-0 flex-1 truncate text-center font-mono text-xs text-muted-foreground">
                    {displayUrl}
                </p>
                {externalUrl && (
                    <a
                        href={externalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-black/10 px-3 py-1.5 text-xs font-semibold text-foreground transition-colors hover:bg-black/5 dark:border-white/10 dark:hover:bg-white/10"
                    >
                        {openLabel ?? 'Open live'}
                        <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                )}
            </div>

            <div className="relative bg-zinc-50 dark:bg-zinc-950">
                <iframe
                    src={src}
                    title={`${title} live preview`}
                    className="block h-[min(80vh,900px)] w-full border-0 bg-white"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    allow="clipboard-write; fullscreen"
                    allowFullScreen
                />
            </div>

            <p className="border-t border-black/10 px-4 py-3 text-center text-xs text-muted-foreground dark:border-white/10">
                {caption ?? 'Scroll and click through the built site inside the frame.'}
            </p>
        </div>
    );
}
