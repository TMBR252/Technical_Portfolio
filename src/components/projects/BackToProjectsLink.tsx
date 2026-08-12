'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

type BackToProjectsLinkProps = {
    label: string;
    className?: string;
    iconClassName?: string;
};

/** Always navigates to /projects — never history.back() (referrer can match /projects/*). */
export function BackToProjectsLink({ label, className, iconClassName }: BackToProjectsLinkProps) {
    const router = useRouter();

    return (
        <Link
            href="/projects"
            onClick={(event) => {
                event.preventDefault();
                router.push('/projects');
            }}
            className={cn(
                'relative z-50 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary',
                className,
            )}
        >
            <ArrowLeft className={cn('h-4 w-4 shrink-0', iconClassName)} />
            <span>{label}</span>
        </Link>
    );
}
