'use client';

import { useState } from 'react';
import { ExternalLink, FileText } from 'lucide-react';
import { portfolioData } from '@/data/portfolio';

const RESUME_URL = '/resume.pdf';

/**
 * Native PDF embed - avoids react-pdf / pdfjs webpack crashes.
 * Browsers that can't inline PDFs still get Open + the empty-state CTA.
 */
export function ResumeEmbed() {
    const [failed, setFailed] = useState(false);

    if (failed) {
        return (
            <div className="flex h-full w-full flex-col items-center justify-center gap-4 rounded-2xl border border-border/50 bg-muted/30 p-6 text-center">
                <FileText className="size-10 text-muted-foreground" aria-hidden />
                <p className="max-w-sm text-sm text-muted-foreground">
                    This browser can&apos;t preview PDFs inline. Open it in a new tab instead.
                </p>
                <a
                    href={RESUME_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-12 items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground touch-manipulation"
                >
                    <ExternalLink className="size-4" />
                    Open resume
                </a>
            </div>
        );
    }

    return (
        <div className="relative h-full w-full overflow-hidden rounded-2xl border border-border/50 bg-muted/30">
            <object
                data={`${RESUME_URL}#view=FitH`}
                type="application/pdf"
                className="absolute inset-0 h-full w-full"
                aria-label={`${portfolioData.personal.name} - ${portfolioData.personal.title} Resume`}
            >
                <iframe
                    title={`${portfolioData.personal.name} - ${portfolioData.personal.title} Resume`}
                    src={`${RESUME_URL}#view=FitH`}
                    className="absolute inset-0 h-full w-full border-0 bg-background"
                    onError={() => setFailed(true)}
                />
            </object>
        </div>
    );
}
