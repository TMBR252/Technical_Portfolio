'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ChevronDown, Link2, Navigation, Briefcase, Rocket, BookOpen, ImageIcon, FileText, MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { portfolioData } from '@/data/portfolio';

interface NavLink {
    label: string;
    href: string;
    description?: string;
}

interface NavItem {
    label: string;
    links: NavLink[];
}

interface CardNavProps {
    items: NavItem[];
    theme?: 'light' | 'dark';
    pathname?: string;
}

/** Scattered full grid cells that appear, then fade out; light green on card hover */
function GrowFadeGrid({ theme = 'dark' }: { theme?: string }) {
    const gridSize = 24;
    const cols = 14;
    const rows = 8;
    const isDark = theme === 'dark';

    const cells = useMemo(() => {
        const total = cols * rows;
        const count = 7;
        const picks = new Set<number>();
        while (picks.size < count) {
            picks.add(Math.floor(Math.random() * total));
        }
        return Array.from(picks).map((index) => ({
            index,
            delay: Math.random() * 4,
            duration: 2.2 + Math.random() * 1.6,
        }));
    }, []);

    const idleLine = isDark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.25)';

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Grid lines: muted → soft light green on hover */}
            <div
                className="absolute inset-0 opacity-[0.06] group-hover:opacity-0 transition-opacity duration-500"
                style={{
                    backgroundImage: `linear-gradient(to right, ${idleLine} 1px, transparent 1px), linear-gradient(to bottom, ${idleLine} 1px, transparent 1px)`,
                    backgroundSize: `${gridSize}px ${gridSize}px`,
                }}
            />
            <div
                className="absolute inset-0 opacity-0 group-hover:opacity-[0.12] transition-opacity duration-500"
                style={{
                    backgroundImage:
                        'linear-gradient(to right, var(--brand) 1px, transparent 1px), linear-gradient(to bottom, var(--brand) 1px, transparent 1px)',
                    backgroundSize: `${gridSize}px ${gridSize}px`,
                }}
            />

            {cells.map((cell) => {
                const col = cell.index % cols;
                const row = Math.floor(cell.index / cols);
                return (
                    <motion.div
                        key={cell.index}
                        className={cn(
                            "absolute transition-colors duration-500",
                            isDark
                                ? "bg-white/12 group-hover:bg-brand/25"
                                : "bg-black/8 group-hover:bg-brand/22"
                        )}
                        style={{
                            left: col * gridSize,
                            top: row * gridSize,
                            width: gridSize,
                            height: gridSize,
                        }}
                        animate={{
                            opacity: [0, 0.9, 0.9, 0],
                        }}
                        transition={{
                            duration: cell.duration,
                            delay: cell.delay,
                            repeat: Infinity,
                            ease: "easeInOut",
                            times: [0, 0.12, 0.55, 1],
                        }}
                    />
                );
            })}
        </div>
    );
}

function ActiveDot({ theme }: { theme: string }) {
    return (
        <span className="inline-flex ml-2 -translate-y-px align-middle">
            <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-brand"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand shadow-[0_0_5px_rgb(var(--brand-rgb)/0.8)]"></span>
            </span>
        </span>
    );
}

function MegaBoxBig({ href, icon: Icon, title, desc, theme, pathname }: any) {
    const isActive = pathname === href || pathname?.startsWith(`${href}/`);
    
    return (
        <Link href={href} className={cn(
            "group relative flex flex-col justify-between rounded-2xl border p-5 transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1 h-40 overflow-hidden",
            theme === 'dark'
                ? cn(
                    "bg-[#161616]",
                    isActive
                        ? "border-brand shadow-[0_0_15px_rgb(var(--brand-rgb)/0.08)]"
                        : "border-white/10 hover:border-brand hover:shadow-[0_0_15px_rgb(var(--brand-rgb)/0.08)]"
                )
                : cn(
                    "bg-black/[0.02] hover:bg-white",
                    isActive
                        ? "border-brand shadow-md shadow-brand/10"
                        : "border-black/10 hover:border-brand hover:shadow-md hover:shadow-brand/10"
                )
        )}>
            <GrowFadeGrid theme={theme} />

            {/* Text stays black / grey (or white / grey in dark) for legibility */}
            <Icon className={cn(
                "w-6 h-6 relative z-10 transition-all duration-300 group-hover:scale-110 group-hover:text-brand",
                theme === 'dark' ? "text-white/70" : "text-black/70",
                isActive && "text-brand"
            )} />

            <div className="relative z-10 mt-auto">
                <h4 className={cn(
                    "font-bold text-[15px] mb-1.5 flex items-center",
                    theme === 'dark' ? "text-white" : "text-black"
                )}>
                    {title}
                    {isActive && <ActiveDot theme={theme} />}
                </h4>
                <p className={cn(
                    "text-xs font-medium leading-relaxed",
                    theme === 'dark' ? "text-white/55" : "text-black/55"
                )}>{desc}</p>
            </div>
        </Link>
    )
}

function MegaBoxSmall({ href, icon: Icon, title, desc, theme, pathname, external }: any) {
    const isActive = !external && (pathname === href || pathname?.startsWith(`${href}/`));
    
    return (
        <Link
            href={href}
            target={external ? "_blank" : undefined}
            rel={external ? "noopener noreferrer" : undefined}
            className={cn(
            "group relative flex flex-col justify-center rounded-2xl border p-4 transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1 overflow-hidden",
            theme === 'dark'
                ? cn(
                    "bg-[#161616]",
                    isActive
                        ? "border-brand shadow-[0_0_15px_rgb(var(--brand-rgb)/0.08)]"
                        : "border-white/10 hover:border-brand hover:shadow-[0_0_15px_rgb(var(--brand-rgb)/0.08)]"
                )
                : cn(
                    "bg-black/[0.02] hover:bg-white",
                    isActive
                        ? "border-brand shadow-md shadow-brand/10"
                        : "border-black/10 hover:border-brand hover:shadow-md hover:shadow-brand/10"
                )
        )}>
            <div className="absolute inset-0 opacity-60 pointer-events-none">
                <GrowFadeGrid theme={theme} />
            </div>
            <div className="flex items-start justify-between relative z-10">
                <div>
                    <h4 className={cn(
                        "font-bold text-sm mb-1.5 flex items-center",
                        theme === 'dark' ? "text-white" : "text-black"
                    )}>
                        {title}
                        {isActive && <ActiveDot theme={theme} />}
                    </h4>
                    <p className={cn(
                        "text-[11px] font-medium leading-relaxed",
                        theme === 'dark' ? "text-white/55" : "text-black/55"
                    )}>{desc}</p>
                </div>
                <div className="p-1.5 rounded-xl">
                    <Icon className={cn(
                        "w-4 h-4 mt-0.5 flex-shrink-0 transition-all duration-300 group-hover:scale-110 group-hover:text-brand",
                        theme === 'dark' ? "text-white/45" : "text-black/45",
                        isActive && "text-brand"
                    )} />
                </div>
            </div>
        </Link>
    )
}

function SidebarLink({ href, icon: Icon, title, desc, theme, pathname, onClick }: any) {
    const isAction = typeof onClick === 'function';
    const isActive = !isAction && (pathname === href || (href !== '#' && pathname?.startsWith(`${href}/`)));
    
    const className = cn(
        "group flex items-center gap-4 rounded-2xl border p-4 transition-all duration-500 overflow-hidden relative cursor-pointer hover:scale-[1.02] hover:-translate-x-1 text-left w-full",
        theme === 'dark'
            ? cn(
                "bg-[#161616]",
                isActive
                    ? "border-brand shadow-[0_0_15px_rgb(var(--brand-rgb)/0.08)]"
                    : "border-white/10 hover:border-brand hover:shadow-[0_0_15px_rgb(var(--brand-rgb)/0.08)]"
            )
            : cn(
                "bg-black/[0.02] hover:bg-white",
                isActive
                    ? "border-brand shadow-sm shadow-brand/10"
                    : "border-black/10 hover:border-brand hover:shadow-sm hover:shadow-brand/10"
            )
    );

    const content = (
        <>
            <div className="absolute inset-0 opacity-50 pointer-events-none">
                <GrowFadeGrid theme={theme} />
            </div>
            <div className="flex-1 relative z-10">
                <h4 className={cn(
                    "font-bold text-sm mb-1.5 flex items-center",
                    theme === 'dark' ? "text-white" : "text-black"
                )}>
                    {title}
                    {isActive && <ActiveDot theme={theme} />}
                </h4>
                <p className={cn(
                    "text-[11px] font-medium",
                    theme === 'dark' ? "text-white/55" : "text-black/55"
                )}>{desc}</p>
            </div>
            <Icon className={cn(
                "w-5 h-5 relative z-10 transition-all duration-300 group-hover:scale-110 group-hover:text-brand",
                theme === 'dark' ? "text-white/45" : "text-black/45",
                isActive && "text-brand"
            )} />
        </>
    );

    if (isAction) {
        return (
            <button type="button" onClick={onClick} className={className}>
                {content}
            </button>
        );
    }

    return (
        <Link href={href} className={className}>
            {content}
        </Link>
    )
}

export default function CardNav({
    items,
    theme = "dark",
    pathname = "/"
}: CardNavProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsExpanded(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const aboutItem = items.find(i => i.label === "About") || items[0];
    const allHrefs = ['/projects', '/experience', '/skills', '/blog', '/gallery', '/resume'];
    const isActive = useMemo(() => {
        return allHrefs.some(href => pathname === href || pathname.startsWith(`${href}/`));
    }, [pathname]);

    return (
        <div ref={containerRef} className="relative flex items-center h-10">
            <motion.button
                onMouseEnter={() => setIsExpanded(true)}
                onClick={() => setIsExpanded(!isExpanded)}
                className={cn(
                    "relative inline-flex items-center justify-center h-10 px-6 text-sm font-bold transition-colors duration-300 rounded-full group",
                    isActive || isExpanded
                        ? "bg-muted/60 text-brand hover:bg-muted/60 hover:text-brand"
                        : "text-muted-foreground hover:bg-muted/60 hover:text-brand"
                )}
            >
                {isActive && isExpanded && (
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute left-2.5 z-10 flex items-center justify-center"
                    >
                        <motion.span
                            animate={{ opacity: [1, 0.4, 1], scale: [1, 1.3, 1] }}
                            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                            className="w-1.5 h-1.5 rounded-full bg-brand shadow-[0_0_8px_rgb(var(--brand-rgb)/0.6)]"
                        />
                    </motion.div>
                )}
                {/* Label stays optically centered; arrow sits in reserved right space */}
                <span className="relative z-10">{aboutItem.label}</span>
                <motion.div
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute right-1.5 z-10"
                >
                    <ChevronDown className="w-4 h-4 opacity-50" />
                </motion.div>
            </motion.button>

            {/* Mega Menu Dropdown */}
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        onMouseLeave={() => setIsExpanded(false)}
                        initial={{ opacity: 0, y: 10, scale: 0.98, x: "-50%" }}
                        animate={{ opacity: 1, y: 20, scale: 1, x: "-50%" }}
                        exit={{ opacity: 0, y: 10, scale: 0.98, x: "-50%" }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                        className="absolute top-full left-1/2 z-[100] pointer-events-auto"
                    >
                        <div className={cn(
                            "relative w-[min(920px,calc(100vw-2rem))] max-w-[calc(100vw-2rem)] rounded-[1.5rem] border shadow-2xl flex flex-col md:flex-row backdrop-blur-2xl transition-all overflow-hidden",
                            theme === 'dark'
                                ? "bg-[#0a0a0a]/95 border-white/10 shadow-black/80"
                                : "bg-white/95 border-black/10 shadow-black/5"
                        )}>
                            {/* Left Main Area */}
                            <div className="flex-1 p-4 md:p-5 flex flex-col gap-3 md:gap-4 min-w-0">
                                {/* Top 2 big boxes */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                                    <MegaBoxBig href="/projects" icon={Rocket} title="Projects" desc="Discover my latest builds" theme={theme} pathname={pathname} />
                                    <MegaBoxBig href="/experience" icon={Briefcase} title="Experience" desc="My professional journey" theme={theme} pathname={pathname} />
                                </div>
                                {/* Bottom 3 small boxes */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
                                    <MegaBoxSmall href="/skills" icon={Navigation} title="Skills" desc="Technical expertise" theme={theme} pathname={pathname} />
                                    <MegaBoxSmall
                                        href={portfolioData.personal.linktreeUrl || "https://linktr.ee/"}
                                        icon={Link2}
                                        title="Linktree"
                                        desc="All my links"
                                        theme={theme}
                                        pathname={pathname}
                                        external
                                    />
                                    <MegaBoxSmall href="/blog" icon={BookOpen} title="Blog" desc="Insights and docs" theme={theme} pathname={pathname} />
                                </div>
                            </div>

                            {/* Right Sidebar — Life / Resume / Chat */}
                            <div className={cn(
                                "w-full md:w-[260px] md:shrink-0 p-4 flex flex-col justify-center gap-4 border-t md:border-t-0 md:border-l",
                                theme === 'dark' ? "border-white/5" : "border-black/5"
                            )}>
                                <SidebarLink href="/gallery" icon={ImageIcon} title="Life" desc="Books, travel & personal" theme={theme} pathname={pathname} />
                                <SidebarLink href="/resume" icon={FileText} title="Resume" desc="View or download my CV" theme={theme} pathname={pathname} />
                                <SidebarLink
                                    href="#"
                                    icon={MessageCircle}
                                    title="Marvin"
                                    desc="Ask about my work"
                                    theme={theme}
                                    pathname={pathname}
                                    onClick={() => {
                                        setIsExpanded(false);
                                        window.dispatchEvent(new CustomEvent('portfolio:open-chatbot'));
                                    }}
                                />
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
