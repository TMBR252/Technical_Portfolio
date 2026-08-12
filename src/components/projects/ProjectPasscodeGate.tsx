'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { BackToProjectsLink } from './BackToProjectsLink';

type ProjectPasscodeGateProps = {
    slug: string;
    title: string;
};

export function ProjectPasscodeGate({ slug, title }: ProjectPasscodeGateProps) {
    const router = useRouter();
    const [passcode, setPasscode] = useState('');
    const [error, setError] = useState('');
    const [pending, setPending] = useState(false);

    async function onSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError('');
        setPending(true);
        try {
            const response = await fetch('/api/project-passcode', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ passcode, slug }),
            });
            const data = (await response.json().catch(() => null)) as
                | { ok?: boolean; error?: string }
                | null;

            if (!response.ok || !data?.ok) {
                setError(data?.error || 'Incorrect passcode.');
                setPending(false);
                return;
            }

            router.refresh();
        } catch {
            setError('Could not verify the passcode. Try again.');
            setPending(false);
        }
    }

    return (
        <div className="relative min-h-[70vh] flex items-center justify-center px-6 py-24">
            <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_20%,rgba(180,180,180,0.12),transparent_55%)] dark:bg-[radial-gradient(ellipse_at_50%_20%,rgba(80,80,80,0.35),transparent_55%)]"
            />
            <div className="relative w-full max-w-md">
                <BackToProjectsLink
                    label="Back to Projects"
                    className="mb-8 hover:text-foreground"
                />

                <div className="rounded-2xl border border-black/10 bg-white/80 p-8 shadow-sm backdrop-blur-sm dark:border-white/10 dark:bg-zinc-950/80">
                    <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-brand/10 text-brand">
                        <Lock className="h-5 w-5" />
                    </div>
                    <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                        Protected case study
                    </p>
                    <h1 className="mb-3 text-2xl font-black uppercase tracking-tight text-foreground">
                        {title}
                    </h1>
                    <p className="mb-8 text-sm leading-relaxed text-muted-foreground">
                        Enter the passcode to view this project.
                    </p>

                    <form onSubmit={onSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label htmlFor="project-passcode" className="sr-only">
                                Passcode
                            </label>
                            <Input
                                id="project-passcode"
                                type="password"
                                autoComplete="current-password"
                                placeholder="Passcode"
                                value={passcode}
                                onChange={(event) => setPasscode(event.target.value)}
                                className="h-11 rounded-xl border-black/15 bg-background px-4 text-base dark:border-white/15"
                                disabled={pending}
                                autoFocus
                            />
                        </div>

                        {error && (
                            <p className="text-sm text-red-600 dark:text-red-400" role="alert">
                                {error}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={pending || !passcode.trim()}
                            className={cn(
                                'flex h-11 w-full items-center justify-center rounded-xl text-sm font-bold transition-all',
                                'bg-foreground text-background hover:opacity-90',
                                'disabled:cursor-not-allowed disabled:opacity-40'
                            )}
                        >
                            {pending ? 'Checking…' : 'Unlock'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
