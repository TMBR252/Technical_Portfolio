'use client';

import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Bot } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { AnimatedThemeToggler } from '@/components/ui/animated-theme-toggler';
import { cn } from '@/lib/utils';

const navPill =
    'rounded-full transition-colors duration-300 hover:bg-muted/60 hover:text-brand active:bg-muted/60 active:text-brand';

type ThemeVisibility = 'desktop-only' | 'always' | 'hidden';

interface MarvinChromeControlsProps {
    themeVisibility?: ThemeVisibility;
    className?: string;
}

export function MarvinChromeControls({
    themeVisibility = 'desktop-only',
    className,
}: MarvinChromeControlsProps) {
    const t = useTranslations('navigation');
    const [mounted, setMounted] = useState(false);
    const [marvinOpen, setMarvinOpen] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        const sync = () => {
            setMarvinOpen(document.documentElement.dataset.marvinOpen === 'true');
        };
        sync();
        const observer = new MutationObserver(sync);
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['data-marvin-open'],
        });
        return () => observer.disconnect();
    }, []);

    const openMarvin = useCallback(() => {
        window.dispatchEvent(new CustomEvent('portfolio:open-chatbot'));
    }, []);

    return (
        <div className={cn('flex items-center justify-end gap-2 h-12 lg:h-10 shrink-0', className)}>
            {mounted && themeVisibility !== 'hidden' && (
                <AnimatedThemeToggler
                    className={cn(
                        'inline-flex items-center justify-center size-10 p-0 touch-manipulation',
                        navPill,
                        themeVisibility === 'desktop-only' && 'hidden lg:inline-flex',
                    )}
                />
            )}

            <AnimatePresence initial={false} mode="popLayout">
                {!marvinOpen && (
                    <motion.button
                        key="marvin-open"
                        type="button"
                        onClick={openMarvin}
                        initial={{ opacity: 0, scale: 0.92 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.92 }}
                        transition={{ duration: 0.2 }}
                        whileTap={{ scale: 0.95 }}
                        className={cn(
                            'group relative inline-flex items-center justify-center overflow-hidden touch-manipulation',
                            'h-12 min-w-12 lg:h-10 lg:min-w-10 px-2.5 bg-transparent',
                            navPill,
                            'transition-all duration-300 hover:px-3',
                        )}
                        aria-label={t('openChat')}
                    >
                        <Bot className="w-4 h-4 flex-shrink-0" />
                        <span
                            className={cn(
                                'max-w-0 overflow-hidden whitespace-nowrap opacity-0 ml-0',
                                'text-xs font-bold tracking-wide',
                                'transition-all duration-300',
                                'md:max-lg:max-w-[6.5rem] md:max-lg:opacity-100 md:max-lg:ml-2',
                                'lg:group-hover:max-w-[6.5rem] lg:group-hover:opacity-100 lg:group-hover:ml-2',
                            )}
                        >
                            {t('askMarvin')}
                        </span>
                    </motion.button>
                )}
            </AnimatePresence>
        </div>
    );
}
