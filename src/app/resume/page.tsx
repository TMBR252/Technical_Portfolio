'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, Download, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { usePerformance } from '@/hooks/usePerformance';
import { ResumeEmbed } from '@/components/ui/resume-embed';
import { portfolioData } from '@/data/portfolio';

const RESUME_URL = '/resume.pdf';

export default function ResumePage() {
    const { isLowPowerMode, isMobile } = usePerformance();

    return (
        <div className="h-[100dvh] bg-background relative flex flex-col pt-20 sm:pt-24 pb-4 overflow-hidden">
            <motion.div
                initial={isLowPowerMode ? { opacity: 0 } : { opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="container-creative px-4 sm:px-6 mb-4 flex-none flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 sm:gap-4"
            >
                <Link
                    href="/"
                    className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group"
                >
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    <span className="text-sm sm:text-base">Back to Portfolio</span>
                </Link>

                <div className="flex items-center gap-2 sm:gap-4">
                    <a
                        href={RESUME_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 rounded-full bg-primary/10 text-primary font-medium hover:bg-primary/20 transition-all active:scale-95 shadow-sm text-sm sm:text-base touch-manipulation"
                    >
                        <ExternalLink className="w-4 h-4 shrink-0" />
                        <span>{isMobile ? 'Open' : 'Open in New Tab'}</span>
                    </a>
                    <a
                        href={RESUME_URL}
                        download={`${portfolioData.personal.name.replace(/\s+/g, '_')}_${portfolioData.personal.title.replace(/\s+/g, '_')}.pdf`}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 rounded-full bg-primary text-primary-foreground font-medium hover:opacity-90 transition-all active:scale-95 shadow-sm text-sm sm:text-base touch-manipulation"
                    >
                        <Download className="w-4 h-4 shrink-0" />
                        <span>Download</span>
                    </a>
                </div>
            </motion.div>

            <motion.div
                initial={isLowPowerMode ? { opacity: 0 } : { opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.15 }}
                className="flex-1 w-full max-w-[1400px] mx-auto px-3 sm:px-4 md:px-6 min-h-0 pb-4 relative"
            >
                <ResumeEmbed />
            </motion.div>
        </div>
    );
}
