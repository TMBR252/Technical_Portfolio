'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Menu, X, Moon, Sun, ChevronDown, Linkedin, Link2, Github, FileText } from 'lucide-react';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';

import CardNav from '@/components/ui/CardNav';
import { SITE_FEATURES } from '@/lib/site-features';
import { AnimatedThemeToggler } from '@/components/ui/animated-theme-toggler';
import { MarvinChromeControls } from '@/components/layout/MarvinChromeControls';
import { usePreloadState } from '@/components/ui/square-reveal-hero';
import { portfolioData } from '@/data/portfolio';

/** Soft grey pill + green label on hover / active */
const navPill =
    'rounded-full transition-colors duration-300 hover:bg-muted/60 hover:text-brand active:bg-muted/60 active:text-brand';
const navPillActive = 'bg-muted/60 text-brand hover:bg-muted/60 hover:text-brand';

/** Material-sized primary row for phone/tablet hamburger */
const mobileNavRow =
    'flex w-full min-h-[4.5rem] items-center justify-center rounded-2xl px-5 text-2xl font-black tracking-tight touch-manipulation transition-colors duration-200 hover:bg-brand/20 hover:text-brand focus-visible:bg-brand/20 focus-visible:text-brand active:scale-[0.99] active:bg-brand/25 active:text-brand';

const OWNER_TIMEZONE = 'America/New_York';

function Clock() {
    const [time, setTime] = useState<string>('');
    const [zone, setZone] = useState<string>('EST');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const timeFormatter = new Intl.DateTimeFormat('en-GB', {
            timeZone: OWNER_TIMEZONE,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
        });
        const zoneFormatter = new Intl.DateTimeFormat('en-US', {
            timeZone: OWNER_TIMEZONE,
            timeZoneName: 'short',
        });

        const updateTime = () => {
            const now = new Date();
            setTime(timeFormatter.format(now));
            const zonePart = zoneFormatter
                .formatToParts(now)
                .find((part) => part.type === 'timeZoneName')?.value;
            if (zonePart) setZone(zonePart);
        };

        updateTime();
        const interval = setInterval(updateTime, 1000);
        return () => clearInterval(interval);
    }, []);

    if (!mounted) {
        return (
            <span className="inline-flex items-baseline gap-2 font-mono font-black opacity-0">
                <span className="text-xl md:text-2xl tracking-widest">00:00:00</span>
                <span className="text-sm md:text-base tracking-[0.18em]">EST</span>
            </span>
        );
    }

    return (
        <span
            className="inline-flex items-baseline gap-2 font-mono font-black transition-all duration-300"
            title="America/New_York"
        >
            <span className="text-xl md:text-2xl text-gradient tracking-widest hover:tracking-[0.2em] transition-all duration-300">
                {time}
            </span>
            <span className="text-sm md:text-base tracking-[0.18em] text-muted-foreground">
                {zone}
            </span>
        </span>
    );
}

type MobileSecondaryLink = {
    label: string;
    href: string;
    external: boolean;
    icon: 'linktree' | 'linkedin' | 'github' | 'resume';
};

function MobileSecondaryNavLink({
    link,
    pathname,
    onNavigate,
}: {
    link: MobileSecondaryLink;
    pathname: string;
    onNavigate: () => void;
}) {
    const isActive =
        !link.external &&
        (pathname === link.href || pathname.startsWith(`${link.href}/`));
    const className = cn(
        'inline-flex min-h-12 items-center justify-between gap-2 rounded-2xl bg-muted/30 px-4 text-sm font-bold uppercase tracking-wider text-muted-foreground touch-manipulation transition-colors duration-200',
        'hover:bg-brand/20 hover:text-brand focus-visible:bg-brand/20 focus-visible:text-brand active:scale-[0.99] active:bg-brand/25 active:text-brand',
        isActive && 'bg-brand/15 text-brand hover:bg-brand/25 active:bg-brand/30'
    );
    const icon =
        link.icon === 'linkedin' ? (
            <Linkedin className="size-5 shrink-0 opacity-70" aria-hidden />
        ) : link.icon === 'github' ? (
            <Github className="size-5 shrink-0 opacity-70" aria-hidden />
        ) : link.icon === 'resume' ? (
            <FileText className="size-5 shrink-0 opacity-70" aria-hidden />
        ) : (
            <Link2 className="size-5 shrink-0 opacity-70" aria-hidden />
        );

    if (link.external) {
        return (
            <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={onNavigate}
                className={className}
            >
                <span>{link.label}</span>
                {icon}
            </a>
        );
    }

    return (
        <Link
            href={link.href}
            onClick={onNavigate}
            aria-current={isActive ? 'page' : undefined}
            className={className}
        >
            <span>{link.label}</span>
            {icon}
        </Link>
    );
}

// Sub-links for the "About" dropdown
const useNavItems = () => {
    const t = useTranslations('navigation.menu');
    const links = [
        { label: t('linktree'), href: portfolioData.personal.linktreeUrl || "https://linktr.ee/", description: t('linktreeDesc'), external: true },
        ...(SITE_FEATURES.fullAboutNav
            ? [{ label: t('skills'), href: "/skills", description: t('skillsDesc') }]
            : []),
        { label: t('experience'), href: "/experience", description: t('experienceDesc') },
        { label: t('projects'), href: "/projects", description: t('projectsDesc') },
        ...(SITE_FEATURES.fullAboutNav
            ? [{ label: t('blog'), href: "/blog", description: t('blogDesc') }]
            : []),
    ];
    return [
        {
            label: "About",
            links,
        }
    ];
};

export function Navbar() {
    const t = useTranslations('navigation');
    const navItems = useNavItems();
    const { theme, setTheme, resolvedTheme } = useTheme();
    const pathname = usePathname();
    const { scrollY } = useScroll();

    const [isVisible, setIsVisible] = useState(true);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [mounted, setMounted] = useState(false);
    
    // Consume preload state directly from context
    const { isPreloading: isPreloadActive } = usePreloadState();

    const isDark = resolvedTheme === 'dark';

    useEffect(() => {
        setMounted(true);
    }, []);

    // Lock body scroll when menu is open
    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isMenuOpen]);

    // Close menu on route change
    useEffect(() => {
        setIsMenuOpen(false);
    }, [pathname]);

    useMotionValueEvent(scrollY, 'change', (latest) => {
        if (isMenuOpen) return; // Don't hide navbar when menu is open

        const direction = latest > lastScrollY ? 'down' : 'up';
        setIsScrolled(latest > 50);

        if (direction === 'down' && latest > 100) {
            setIsVisible(false);
        } else {
            setIsVisible(true);
        }

        setLastScrollY(latest);
    });

    const toggleMenu = useCallback(() => {
        setIsMenuOpen((prev) => !prev);
    }, []);

    const closeMenu = useCallback(() => {
        setIsMenuOpen(false);
    }, []);

    const handleHomeClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
        if (pathname === '/') {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        closeMenu();
    }, [pathname, closeMenu]);

    // Flat hamburger IA - About contents only (no About label). Desktop CardNav unchanged.
    const aboutLinks = navItems.flatMap((category) => category.links);
    const aboutByPath = (path: string) => aboutLinks.find((link) => link.href === path);

    const mobilePrimaryLinks = [
        { label: t('home'), href: '/' },
        { label: aboutByPath('/projects')?.label ?? 'Projects', href: '/projects' },
        { label: aboutByPath('/experience')?.label ?? 'Experience', href: '/experience' },
        ...(SITE_FEATURES.fullAboutNav
            ? [
                  { label: aboutByPath('/skills')?.label ?? 'Skills', href: '/skills' },
                  { label: aboutByPath('/blog')?.label ?? 'Blog', href: '/blog' },
                  { label: 'Life', href: '/gallery' },
              ]
            : []),
        { label: t('contact'), href: '/contact' },
    ];

    const linktreeLink = aboutLinks.find(
        (link) => (link as { external?: boolean }).external
    );
    const linkedinUrl = portfolioData.personal.socialLinks.find(
        (s) => s.platform === 'LinkedIn'
    )?.url;
    const githubUrl = portfolioData.personal.socialLinks.find(
        (s) => s.platform === 'GitHub'
    )?.url;

    // Match desktop About sidebar order: Resume → Linktree, then socials.
    const mobileSecondaryLinks = [
        {
            label: 'Resume',
            href: '/resume',
            external: false,
            icon: 'resume' as const,
        },
        linktreeLink
            ? {
                  label: linktreeLink.label,
                  href: linktreeLink.href,
                  external: true,
                  icon: 'linktree' as const,
              }
            : null,
        linkedinUrl
            ? {
                  label: 'LinkedIn',
                  href: linkedinUrl,
                  external: true,
                  icon: 'linkedin' as const,
              }
            : null,
        githubUrl
            ? {
                  label: 'GitHub',
                  href: githubUrl,
                  external: true,
                  icon: 'github' as const,
              }
            : null,
    ].filter(Boolean) as MobileSecondaryLink[];

    const mobileUtilityLinks = SITE_FEATURES.fullAboutNav
        ? mobileSecondaryLinks
        : mobileSecondaryLinks.filter((link) => link.icon === 'resume' || link.icon === 'linktree');
    const mobileSocialLinks = SITE_FEATURES.fullAboutNav
        ? []
        : mobileSecondaryLinks.filter((link) => link.icon === 'linkedin' || link.icon === 'github');

    // Animation variants
    const navVariants = {
        visible: { y: 0, opacity: 1 },
        hidden: { y: -100, opacity: 0 }
    };

    const menuVariants = {
        closed: { opacity: 0 },
        open: { opacity: 1 }
    };

    return (
        <>
            <motion.nav
                variants={navVariants}
                initial="hidden"
                animate={!isPreloadActive && (isVisible || isMenuOpen) ? 'visible' : 'hidden'}
                transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
                className="fixed top-0 left-0 w-full z-[100] marvin-fixed-chrome"
            >
                <div className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-24 py-4 md:py-6">
                    <motion.div
                        className={cn(
                            'flex items-center gap-3 transition-all duration-500 rounded-full',
                            'lg:grid lg:grid-cols-[1fr_auto_1fr] lg:gap-4',
                            isScrolled ? 'glass-strong px-4 py-3 sm:px-6' : 'py-2'
                        )}
                        layout
                    >
                        {/* Make the Clock a Link to Home */}
                        <Link
                            href="/"
                            className="relative group flex items-center h-12 lg:h-10 min-w-12 lg:min-w-0 touch-manipulation lg:justify-self-start shrink-0"
                            onClick={handleHomeClick}
                        >
                            <Clock />
                        </Link>

                        {/* Desktop Navigation with CardNav */}
                        <div className="hidden lg:flex items-center justify-center gap-2 h-10">
                            {/* HOME */}
                            <Link
                                href="/"
                                onClick={handleHomeClick}
                                className={cn(
                                    'relative inline-flex items-center justify-center h-10 px-5 text-sm font-bold',
                                    navPill,
                                    pathname === '/'
                                        ? navPillActive
                                        : 'text-muted-foreground'
                                )}
                            >
                                <span className="relative z-10">{t('home')}</span>
                            </Link>

                            <CardNav
                                items={navItems}
                                theme={isDark ? 'dark' : 'light'}
                                pathname={pathname}
                            />

                            {/* CONTACT (Direct Link) */}
                            <Link
                                href="/contact"
                                className={cn(
                                    'relative inline-flex items-center justify-center h-10 px-5 text-sm font-bold',
                                    navPill,
                                    pathname === '/contact'
                                        ? navPillActive
                                        : 'text-muted-foreground'
                                )}
                            >
                                <span className="relative z-10">{t('contact')}</span>
                            </Link>
                        </div>

                        {/* Controls - phone/tablet: Marvin + hamburger flush right, no theme; desktop: theme + Marvin */}
                        <div className="ml-auto flex items-center justify-end gap-2 h-12 lg:h-10 lg:ml-0 lg:justify-self-end shrink-0">
                            <MarvinChromeControls themeVisibility="desktop-only" />

                            <motion.button
                                type="button"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={toggleMenu}
                                className={cn(
                                    'inline-flex items-center justify-center size-12 lg:hidden touch-manipulation',
                                    navPill,
                                    isMenuOpen ? navPillActive : 'bg-transparent'
                                )}
                                aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
                                aria-expanded={isMenuOpen}
                                aria-controls="mobile-nav-sheet"
                            >
                                <AnimatePresence mode="wait" initial={false}>
                                    <motion.div
                                        key={isMenuOpen ? 'close' : 'menu'}
                                        initial={{ rotate: -90, opacity: 0 }}
                                        animate={{ rotate: 0, opacity: 1 }}
                                        exit={{ rotate: 90, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                                    </motion.div>
                                </AnimatePresence>
                            </motion.button>
                        </div>
                    </motion.div>
                </div>
            </motion.nav >

            {/* Mobile Menu Overlay - Material big-button sheet (phone + tablet) */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        id="mobile-nav-sheet"
                        role="dialog"
                        aria-modal="true"
                        aria-label="Navigation menu"
                        variants={menuVariants}
                        initial="closed"
                        animate="open"
                        exit="closed"
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 z-[90] lg:hidden"
                    >
                        <motion.div
                            className="absolute inset-0 bg-background"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        />

                        {/* pt clears fixed header (48px controls + padding) so X stays usable */}
                        <div className="relative flex h-full flex-col pt-24 pb-[max(1rem,env(safe-area-inset-bottom))]">
                            <nav
                                className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto px-4"
                                aria-label="Primary"
                            >
                                {mobilePrimaryLinks.map((link) => {
                                    const isActive =
                                        link.href === '/'
                                            ? pathname === '/'
                                            : pathname === link.href || pathname.startsWith(`${link.href}/`);

                                    return (
                                        <Link
                                            key={link.href}
                                            href={link.href}
                                            onClick={link.href === '/' ? handleHomeClick : closeMenu}
                                            aria-current={isActive ? 'page' : undefined}
                                            className={cn(
                                                mobileNavRow,
                                                isActive
                                                    ? 'bg-brand/15 text-brand hover:bg-brand/25'
                                                    : 'bg-muted/30 text-muted-foreground hover:text-brand active:text-foreground'
                                            )}
                                        >
                                            {link.label}
                                        </Link>
                                    );
                                })}

                                {(mobileUtilityLinks.length > 0 || mobileSocialLinks.length > 0) && (
                                    <div className="flex flex-col gap-2 pt-4 pb-2">
                                        {/* Resume + Linktree: 2 equal columns on phone/tablet, same order as desktop */}
                                        {mobileUtilityLinks.length > 0 && (
                                            <div className="grid grid-cols-1 gap-2">
                                                {mobileUtilityLinks.map((link) => (
                                                    <MobileSecondaryNavLink
                                                        key={link.href}
                                                        link={link}
                                                        pathname={pathname}
                                                        onNavigate={closeMenu}
                                                    />
                                                ))}
                                            </div>
                                        )}
                                        {mobileSocialLinks.length > 0 && (
                                            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                                                {mobileSocialLinks.map((link) => (
                                                    <MobileSecondaryNavLink
                                                        key={link.href}
                                                        link={link}
                                                        pathname={pathname}
                                                        onNavigate={closeMenu}
                                                    />
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </nav>

                            <div className="flex shrink-0 items-center justify-center gap-3 border-t border-border/40 px-4 pt-4">
                                {mounted && (
                                    <AnimatedThemeToggler
                                        className="inline-flex min-h-12 min-w-12 items-center justify-center gap-2 rounded-full px-6 text-sm font-medium touch-manipulation bg-muted/40 hover:bg-muted/60 hover:text-brand active:bg-muted/60"
                                    />
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
