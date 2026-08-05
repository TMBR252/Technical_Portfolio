'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { X, ArrowLeft, ArrowUpRight, ChevronRight, ChevronLeft, Copy, Check, Github } from 'lucide-react';
import { cn, formatDate } from '@/lib/utils';
import { Project } from '@/types';
import { ProjectPlaceholder } from './ProjectPlaceholder';
import { BrowserMockup } from './BrowserMockup';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { portfolioData } from '@/data/portfolio';

/** Shared measures. The masthead, every chapter, and the colophon sit on this one edge. */
const SHELL = 'mx-auto w-full max-w-6xl px-6';
const PROSE = 'max-w-[62ch]';
const RULE = 'border-black/10 dark:border-white/10';
const EYEBROW = 'font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground';

const two = (n: number) => String(n).padStart(2, '0');

/** Renders **bold** markers as weight, not as a coloured chip. */
const renderRichText = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
            return (
                <strong key={i} className="font-semibold text-foreground">
                    {part.slice(2, -2)}
                </strong>
            );
        }
        return <span key={i}>{part}</span>;
    });
};

/** Opacity + short lift on scroll-in. Collapses to a plain div when motion is reduced. */
const Reveal = ({
    children,
    delay = 0,
    className,
}: {
    children: React.ReactNode;
    delay?: number;
    className?: string;
}) => {
    const reduced = useReducedMotion();
    if (reduced) return <div className={className}>{children}</div>;
    return (
        <motion.div
            className={className}
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-8%' }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay }}
        >
            {children}
        </motion.div>
    );
};

/** A captioned image. The caption carries the argument; the image is the evidence. */
const Figure = ({
    src,
    label,
    caption,
    chrome = true,
    mockupUrl,
    onOpen,
}: {
    src: string;
    label?: string;
    caption?: string;
    chrome?: boolean;
    mockupUrl?: string;
    onOpen: () => void;
}) => (
    <Reveal className="mt-12">
        <figure className="space-y-4">
            {chrome ? (
                <BrowserMockup url={mockupUrl} onClick={onOpen}>
                    <img src={src} alt={label || caption || ''} loading="lazy" className="block h-auto w-full object-cover object-top" />
                </BrowserMockup>
            ) : (
                <button
                    type="button"
                    onClick={onOpen}
                    className={cn('block w-full cursor-zoom-in overflow-hidden rounded-2xl border', RULE)}
                >
                    <img src={src} alt={label || caption || ''} loading="lazy" className="block h-auto w-full" />
                </button>
            )}
            {(label || caption) && (
                <figcaption className={cn('flex flex-col gap-2 border-l pl-4 sm:flex-row sm:gap-6 sm:pl-6', RULE)}>
                    {label && <span className={cn(EYEBROW, 'shrink-0 pt-0.5 sm:w-44')}>{label}</span>}
                    {caption && (
                        <span className="max-w-[58ch] text-sm leading-relaxed text-muted-foreground">{caption}</span>
                    )}
                </figcaption>
            )}
        </figure>
    </Reveal>
);

/**
 * Numbered chapter heading — the spine of the scroll.
 * `sticky` parks it beside its own prose in the narrow-column beats;
 * full-width evidence sections (decisions, galleries) leave it inline.
 */
const ChapterHeading = ({
    index,
    eyebrow,
    heading,
    sticky,
}: {
    index: number;
    eyebrow: string;
    heading: string;
    sticky?: boolean;
}) => (
    <Reveal className={cn(sticky && 'lg:sticky lg:top-24 lg:self-start')}>
        <span className={EYEBROW}>
            {two(index)} — {eyebrow}
        </span>
        <h2 className="mt-5 max-w-[24ch] text-balance text-3xl font-semibold leading-[1.1] tracking-[-0.02em] text-foreground md:text-4xl">
            {heading}
        </h2>
    </Reveal>
);

const TerminalBlock = ({ title, code }: { title: string; code: string }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className={cn('overflow-hidden rounded-xl border bg-secondary/20 dark:bg-white/[0.02]', RULE)}>
            <div className={cn('flex items-center justify-between border-b px-4 py-2.5', RULE)}>
                <span className={EYEBROW}>{title}</span>
                <button
                    onClick={handleCopy}
                    className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-black/5 hover:text-foreground dark:hover:bg-white/5"
                    aria-label="Copy"
                >
                    {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                </button>
            </div>
            <div className="overflow-x-auto p-4 font-mono text-sm leading-relaxed text-foreground">
                {code.split('\n').map((line, i) => (
                    <div key={i} className="flex min-w-max">
                        <span className="mr-4 select-none text-muted-foreground/50">$</span>
                        <span>{line}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

type Chapter = {
    id: string;
    eyebrow: string;
    heading: string;
    kind: 'beat' | 'decisions' | 'features' | 'challenges' | 'gallery' | 'install';
    body?: string[];
    aside?: string;
    figures?: number[];
};

export function ProjectPageContent({ project }: { project: Project; isLowPowerMode?: boolean }) {
    const t = useTranslations('projects');
    const router = useRouter();
    const isOngoing = project.status === 'ongoing';
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [activeChapter, setActiveChapter] = useState<string | null>(null);
    const [showRail, setShowRail] = useState(false);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const mastheadRef = useRef<HTMLElement>(null);

    const mockupUrl = project.demoUrl
        ? project.demoUrl.replace(/^https?:\/\//, '')
        : `${project.title.toLowerCase().replace(/\s+/g, '')}.app`;

    const handleExit = () => {
        if (typeof window !== 'undefined' && document.referrer.includes('/projects')) {
            router.back();
        } else {
            router.push('/projects');
        }
    };

    /** Curated figures win; otherwise fall back to filesystem-discovered gallery images. */
    const figures = useMemo(() => {
        if (project.figures?.length) return project.figures;
        return (project.galleryImages || []).map((src) => ({ src, label: undefined, caption: undefined, chrome: true }));
    }, [project.figures, project.galleryImages]);

    /**
     * The spine. Projects with `narrative` get the authored story with design decisions
     * slotted after the second beat; everything else falls back to the legacy
     * context → features → constraints → gallery order so no project regresses.
     */
    const chapters = useMemo<Chapter[]>(() => {
        const out: Chapter[] = [];
        const hasDecisions = !!project.designDecisions?.length;

        if (project.narrative?.length) {
            project.narrative.forEach((beat, i) => {
                out.push({
                    id: `chapter-${i}`,
                    kind: 'beat',
                    eyebrow: beat.eyebrow,
                    heading: beat.heading,
                    body: beat.body,
                    aside: beat.aside,
                    figures: beat.figures,
                });
                if (hasDecisions && i === 1) {
                    out.push({
                        id: 'decisions',
                        kind: 'decisions',
                        eyebrow: t('sections.designDecisions'),
                        heading: t('sections.designDecisionsHeading'),
                    });
                }
            });
            if (hasDecisions && !out.some((c) => c.kind === 'decisions')) {
                out.push({
                    id: 'decisions',
                    kind: 'decisions',
                    eyebrow: t('sections.designDecisions'),
                    heading: t('sections.designDecisionsHeading'),
                });
            }
        } else {
            out.push({
                id: 'context',
                kind: 'beat',
                eyebrow: t('sections.missionBrief'),
                heading: project.description,
                body: [project.longDescription || project.description],
            });
            if (project.features?.length) {
                out.push({
                    id: 'features',
                    kind: 'features',
                    eyebrow: t('sections.keyFeatures'),
                    heading: t('sections.keyFeaturesHeading'),
                });
            }
            if (hasDecisions) {
                out.push({
                    id: 'decisions',
                    kind: 'decisions',
                    eyebrow: t('sections.designDecisions'),
                    heading: t('sections.designDecisionsHeading'),
                });
            }
            if (project.challengesAndSolutions?.length) {
                out.push({
                    id: 'constraints',
                    kind: 'challenges',
                    eyebrow: t('sections.engineeringChronicles'),
                    heading: t('sections.constraintsHeading'),
                });
            }
            if (figures.length) {
                out.push({
                    id: 'gallery',
                    kind: 'gallery',
                    eyebrow: t('sections.visualGallery'),
                    heading: t('sections.visualGalleryHeading'),
                });
            }
        }

        if (project.installation?.length) {
            out.push({
                id: 'installation',
                kind: 'install',
                eyebrow: t('sections.installation'),
                heading: t('sections.installation'),
            });
        }

        return out;
    }, [project, figures, t]);

    /** Figures not claimed by a narrative beat still get shown, after the last chapter. */
    const orphanFigures = useMemo(() => {
        if (!project.narrative?.length) return [];
        const claimed = new Set(project.narrative.flatMap((b) => b.figures || []));
        return figures.map((_, i) => i).filter((i) => !claimed.has(i));
    }, [project.narrative, figures]);

    // Sticky rail: this route renders without the site navbar, so the rail is the
    // only persistent orientation once the masthead scrolls away.
    useEffect(() => {
        const masthead = mastheadRef.current;
        if (!masthead) return;
        const observer = new IntersectionObserver(([entry]) => setShowRail(!entry.isIntersecting), {
            rootMargin: '-72px 0px 0px 0px',
        });
        observer.observe(masthead);
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (!chapters.length) return;
        const nodes = chapters
            .map((c) => document.getElementById(c.id))
            .filter((n): n is HTMLElement => Boolean(n));
        if (!nodes.length) return;

        const observer = new IntersectionObserver(
            (entries) => {
                const visible = entries
                    .filter((e) => e.isIntersecting)
                    .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
                if (visible) setActiveChapter(visible.target.id);
            },
            { rootMargin: '-25% 0px -60% 0px' }
        );
        nodes.forEach((n) => observer.observe(n));
        return () => observer.disconnect();
    }, [chapters]);

    const otherProjects = useMemo(() => {
        const others = portfolioData.projects.filter((p) => p.id !== project.id);
        // First 5, not a random sample — Math.random() here would break SSR hydration.
        return others.slice(0, 5);
    }, [project.id]);

    const activeIndex = chapters.findIndex((c) => c.id === activeChapter);

    return (
        <article className="min-h-screen bg-background pb-24 text-foreground">
            {/* STICKY RAIL — replaces both the suppressed navbar and the old sidebar TOC */}
            <AnimatePresence>
                {showRail && (
                    <motion.div
                        initial={{ opacity: 0, y: -12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -12 }}
                        transition={{ duration: 0.25 }}
                        className={cn(
                            'fixed inset-x-0 top-0 z-50 border-b bg-background',
                            RULE
                        )}
                    >
                        <div className={cn(SHELL, 'flex h-14 items-center justify-between gap-6')}>
                            <button
                                onClick={handleExit}
                                className="flex shrink-0 items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                <span className="hidden sm:inline">{project.title}</span>
                            </button>

                            {activeIndex >= 0 && (
                                <span className={cn(EYEBROW, 'truncate')}>
                                    {two(activeIndex + 1)} — {chapters[activeIndex].eyebrow}
                                </span>
                            )}

                            {project.demoUrl && project.demoUrl !== '#' ? (
                                <a
                                    href={project.demoUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex shrink-0 items-center gap-1.5 text-sm font-medium text-foreground transition-opacity hover:opacity-70"
                                >
                                    <span className="hidden sm:inline">{t('sections.liveDemo')}</span>
                                    <ArrowUpRight className="h-4 w-4" />
                                </a>
                            ) : (
                                <span className="w-4" aria-hidden />
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* 1. MASTHEAD — one grid, one left edge, one rhythm */}
            <header ref={mastheadRef} className={cn(SHELL, 'pt-20 sm:pt-28')}>
                <button
                    onClick={handleExit}
                    className="group mb-14 flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                    <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                    <span>{t('sections.backToProjects')}</span>
                </button>

                <div className={cn(EYEBROW, 'flex flex-wrap items-center gap-x-3 gap-y-2')}>
                    <span>{project.category || t('metadata.roleValue')}</span>
                    {/* Separator only when both sit on one line — it orphans at the end of a wrap otherwise. */}
                    <span aria-hidden className="hidden text-muted-foreground/40 sm:inline">
                        /
                    </span>
                    <span className="flex items-center gap-2">
                        <span
                            className={cn(
                                'h-1.5 w-1.5 rounded-full',
                                isOngoing ? 'bg-foreground' : 'bg-muted-foreground/50'
                            )}
                        />
                        {isOngoing ? t('status.ongoing') : t('status.completed')}
                    </span>
                </div>

                <h1 className="mt-6 max-w-[14ch] text-balance text-[clamp(2.75rem,8vw,5.25rem)] font-semibold leading-[0.95] tracking-[-0.035em] text-foreground">
                    {project.title}
                </h1>

                <p className="mt-8 max-w-[54ch] text-lg leading-relaxed text-muted-foreground md:text-xl">
                    {project.premise || project.description}
                </p>

                {project.demoUrl && project.demoUrl !== '#' && (
                    <a
                        href={project.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-10 inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-background transition-opacity hover:opacity-85"
                    >
                        {t('sections.liveDemo')}
                        <ArrowUpRight className="h-4 w-4" />
                    </a>
                )}

                {/* Meta strip — same left edge as the title */}
                <dl className={cn('mt-16 grid grid-cols-2 gap-x-6 gap-y-8 border-t pt-8 md:grid-cols-3', RULE)}>
                    <div className="flex flex-col gap-2">
                        <dt className={EYEBROW}>{t('metadata.role')}</dt>
                        <dd className="text-sm font-medium text-foreground">{project.role || t('metadata.roleValue')}</dd>
                    </div>
                    <div className="flex flex-col gap-2">
                        <dt className={EYEBROW}>{t('metadata.timeline')}</dt>
                        <dd className="text-sm font-medium text-foreground">
                            {project.customTimeline || formatDate(project.startDate)}
                        </dd>
                    </div>
                    <div className="flex flex-col gap-2">
                        <dt className={EYEBROW}>{t('metadata.team')}</dt>
                        <dd className="text-sm font-medium text-foreground">{project.team || t('metadata.teamValue')}</dd>
                    </div>
                </dl>

                {/* Proof row — real figures, not decorated chips */}
                {project.metrics?.length ? (
                    <dl className={cn('mt-8 grid grid-cols-2 gap-x-6 gap-y-8 border-t pt-8 md:grid-cols-4', RULE)}>
                        {project.metrics.map((m) => (
                            <div key={m.label} className="flex flex-col gap-2">
                                <dt className="font-mono text-3xl font-medium tabular-nums tracking-tight text-foreground md:text-4xl">
                                    {m.value}
                                </dt>
                                <dd className="max-w-[22ch] text-xs leading-relaxed text-muted-foreground">{m.label}</dd>
                            </div>
                        ))}
                    </dl>
                ) : project.highlights?.length ? (
                    <ul className={cn('mt-8 grid grid-cols-1 gap-x-6 gap-y-3 border-t pt-8 sm:grid-cols-2', RULE)}>
                        {project.highlights.map((item) => (
                            <li key={item} className="flex items-start gap-3 text-sm text-muted-foreground">
                                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-muted-foreground/60" />
                                {item}
                            </li>
                        ))}
                    </ul>
                ) : null}
            </header>

            {/* 2. HERO FIGURE */}
            <div className={cn(SHELL, 'mt-16')}>
                {project.image ? (
                    <figure className="space-y-4">
                        <BrowserMockup url={mockupUrl} onClick={() => setSelectedImage(project.image!)}>
                            <img src={project.image} alt={project.title} className="block h-auto w-full object-cover object-top" />
                        </BrowserMockup>
                        {project.imageCaption && (
                            <figcaption className={cn('border-l pl-4 sm:pl-6', RULE)}>
                                <span className="block max-w-[58ch] text-sm leading-relaxed text-muted-foreground">
                                    {project.imageCaption}
                                </span>
                            </figcaption>
                        )}
                    </figure>
                ) : (
                    <div className={cn('relative aspect-video w-full overflow-hidden rounded-3xl border md:aspect-[2/1]', RULE)}>
                        <ProjectPlaceholder
                            className="rounded-none border-0 bg-transparent pb-0 [&>div.z-10]:scale-125"
                            title={project.title}
                        />
                    </div>
                )}
            </div>

            {/* 3. THE SPINE */}
            <div className={cn(SHELL, 'mt-28 space-y-28 md:mt-36 md:space-y-36')}>
                {chapters.map((chapter, i) => (
                    <section key={chapter.id} id={chapter.id} className="scroll-mt-24">
                        {/* Narrative beats run two columns — heading parked left, prose right.
                            Evidence sections run full width. The alternation is the page rhythm. */}
                        {chapter.kind === 'beat' ? (
                            <div className={cn('grid grid-cols-1 gap-x-10 gap-y-8 border-t pt-8 lg:grid-cols-12', RULE)}>
                                <div className="lg:col-span-5">
                                    <ChapterHeading index={i + 1} eyebrow={chapter.eyebrow} heading={chapter.heading} sticky />
                                </div>
                                <div className="lg:col-span-6 lg:col-start-7">
                                    <Reveal delay={0.05}>
                                        <div className={cn(PROSE, 'space-y-6')}>
                                            {chapter.body?.map((para, pi) => (
                                                <p key={pi} className="text-base leading-[1.75] text-muted-foreground md:text-lg">
                                                    {renderRichText(para)}
                                                </p>
                                            ))}
                                        </div>
                                    </Reveal>
                                    {chapter.aside && (
                                        <Reveal delay={0.1}>
                                            <p
                                                className={cn(
                                                    'mt-10 max-w-[46ch] border-l py-1 pl-6 text-base italic leading-relaxed text-foreground',
                                                    RULE
                                                )}
                                            >
                                                {chapter.aside}
                                            </p>
                                        </Reveal>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className={cn('border-t pt-8', RULE)}>
                                <ChapterHeading index={i + 1} eyebrow={chapter.eyebrow} heading={chapter.heading} />
                            </div>
                        )}

                        {chapter.kind === 'beat' && (
                            <>
                                {chapter.figures?.map((fi) => {
                                    const fig = figures[fi];
                                    if (!fig) return null;
                                    return (
                                        <Figure
                                            key={fig.src}
                                            src={fig.src}
                                            label={fig.label}
                                            caption={fig.caption}
                                            chrome={fig.chrome !== false}
                                            mockupUrl={mockupUrl}
                                            onOpen={() => setSelectedImage(fig.src)}
                                        />
                                    );
                                })}
                            </>
                        )}

                        {/* Decision / why it was made / what it cost / what it replaced */}
                        {chapter.kind === 'decisions' && (
                            <div className="mt-12">
                                {project.designDecisions?.map((d, di) => (
                                    <Reveal key={d.decision} delay={di * 0.03}>
                                        <div className={cn('grid grid-cols-1 gap-6 border-t py-10 lg:grid-cols-12 lg:gap-10', RULE)}>
                                            <div className="lg:col-span-5">
                                                <span className={cn(EYEBROW, 'text-muted-foreground/60')}>{two(di + 1)}</span>
                                                <h3 className="mt-3 max-w-[26ch] text-balance text-xl font-semibold leading-snug tracking-[-0.01em] text-foreground">
                                                    {d.decision}
                                                </h3>
                                            </div>
                                            <div className="space-y-6 lg:col-span-7">
                                                <div>
                                                    <span className={EYEBROW}>{t('sections.rationale')}</span>
                                                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground md:text-base">
                                                        {d.rationale}
                                                    </p>
                                                </div>
                                                <div>
                                                    <span className={EYEBROW}>{t('sections.tradeoff')}</span>
                                                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground md:text-base">
                                                        {d.tradeoff}
                                                    </p>
                                                </div>
                                                {d.rejected && (
                                                    <div>
                                                        <span className={EYEBROW}>{t('sections.rejected')}</span>
                                                        <p className="mt-2 text-sm leading-relaxed text-muted-foreground/80">
                                                            {d.rejected}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </Reveal>
                                ))}
                            </div>
                        )}

                        {/* Fallback: legacy feature groups */}
                        {chapter.kind === 'features' && (
                            <div className="mt-12 grid grid-cols-1 gap-x-10 gap-y-12 md:grid-cols-2">
                                {project.features?.map((group, gi) => (
                                    <Reveal key={group.title} delay={gi * 0.04}>
                                        <div className={cn('border-t pt-6', RULE)}>
                                            <h3 className="text-lg font-semibold text-foreground">{group.title}</h3>
                                            <ul className="mt-4 space-y-3">
                                                {group.items.map((item, ii) => (
                                                    <li key={ii} className="flex gap-3 text-sm leading-relaxed text-muted-foreground">
                                                        <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-muted-foreground/60" />
                                                        <span>{renderRichText(item)}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </Reveal>
                                ))}
                            </div>
                        )}

                        {/* Fallback: problem → solution pairs */}
                        {chapter.kind === 'challenges' && (
                            <div className="mt-12">
                                {project.challengesAndSolutions?.map((item, ci) => (
                                    <Reveal key={ci} delay={ci * 0.03}>
                                        <div className={cn('grid grid-cols-1 gap-6 border-t py-10 lg:grid-cols-12 lg:gap-10', RULE)}>
                                            <div className="lg:col-span-5">
                                                <span className={cn(EYEBROW, 'text-muted-foreground/60')}>{two(ci + 1)}</span>
                                                <h3 className="mt-3 max-w-[26ch] text-balance text-xl font-semibold leading-snug text-foreground">
                                                    {item.problem}
                                                </h3>
                                            </div>
                                            <div className="lg:col-span-7">
                                                <span className={EYEBROW}>{t('sections.solution')}</span>
                                                <p className="mt-2 text-sm leading-relaxed text-muted-foreground md:text-base">
                                                    {item.solution}
                                                </p>
                                            </div>
                                        </div>
                                    </Reveal>
                                ))}
                            </div>
                        )}

                        {chapter.kind === 'gallery' &&
                            figures.map((fig) => (
                                <Figure
                                    key={fig.src}
                                    src={fig.src}
                                    label={fig.label}
                                    caption={fig.caption}
                                    chrome={fig.chrome !== false}
                                    mockupUrl={mockupUrl}
                                    onOpen={() => setSelectedImage(fig.src)}
                                />
                            ))}

                        {chapter.kind === 'install' && (
                            <div className="mt-10 space-y-6">
                                {project.installation?.map((step, si) => (
                                    <div key={si}>
                                        {step.type === 'code' ? (
                                            <TerminalBlock title={step.title} code={step.cmd || step.code || ''} />
                                        ) : (
                                            <div className={cn('rounded-xl border p-6', RULE)}>
                                                <h3 className="text-base font-semibold text-foreground">{step.title}</h3>
                                                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                                                    {step.code || step.cmd}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>
                ))}

                {orphanFigures.length > 0 && (
                    <section id="figures" className="scroll-mt-24">
                        <div className={cn('border-t pt-8', RULE)}>
                            <ChapterHeading
                                index={chapters.length + 1}
                                eyebrow={t('sections.visualGallery')}
                                heading={t('sections.visualGalleryHeading')}
                            />
                        </div>
                        {orphanFigures.map((fi) => {
                            const fig = figures[fi];
                            return (
                                <Figure
                                    key={fig.src}
                                    src={fig.src}
                                    label={fig.label}
                                    caption={fig.caption}
                                    chrome={fig.chrome !== false}
                                    mockupUrl={mockupUrl}
                                    onOpen={() => setSelectedImage(fig.src)}
                                />
                            );
                        })}
                    </section>
                )}
            </div>

            {/* 4. COLOPHON — where the old sidebar's contents live now */}
            <div className={cn(SHELL, 'mt-32')}>
                <Reveal>
                    <div className={cn('border-t pt-8', RULE)}>
                        <span className={EYEBROW}>{t('sections.colophon')}</span>
                        <div className="mt-8 grid grid-cols-1 gap-x-10 gap-y-10 md:grid-cols-3">
                            <div>
                                <h3 className={EYEBROW}>{t('sections.technologies')}</h3>
                                <ul className="mt-4 space-y-2">
                                    {project.techStack.map((tech) => (
                                        <li key={tech} className="text-sm text-muted-foreground">
                                            {tech}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            {project.tools?.length > 0 && (
                                <div>
                                    <h3 className={EYEBROW}>{t('tools')}</h3>
                                    <ul className="mt-4 space-y-2">
                                        {project.tools.map((tool) => (
                                            <li key={tool} className="text-sm text-muted-foreground">
                                                {tool}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            <div className="flex flex-col items-start gap-3">
                                <h3 className={EYEBROW}>{t('sections.projectAccess')}</h3>
                                <div className="mt-1 flex flex-col gap-3">
                                    {project.demoUrl && project.demoUrl !== '#' && (
                                        <a
                                            href={project.demoUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 text-sm font-medium text-foreground underline-offset-4 hover:underline"
                                        >
                                            {t('sections.liveDemo')}
                                            <ArrowUpRight className="h-4 w-4" />
                                        </a>
                                    )}
                                    {project.repoUrl && (
                                        <a
                                            href={project.repoUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 text-sm font-medium text-foreground underline-offset-4 hover:underline"
                                        >
                                            <Github className="h-4 w-4" />
                                            {t('sections.sourceCode')}
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </Reveal>
            </div>

            {/* 5. FOOTER NAVIGATION */}
            <div className={cn(SHELL, 'mt-28')}>
                <button
                    onClick={handleExit}
                    className="group mb-16 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                    <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                    <span>{t('sections.backToProjects')}</span>
                </button>

                <div className={cn('border-t pt-8', RULE)}>
                    <div className="mb-8 flex items-center justify-between">
                        <h2 className={EYEBROW}>{t('sections.moreProjects')}</h2>
                        <div className="flex gap-2">
                            <button
                                onClick={() =>
                                    scrollContainerRef.current?.scrollBy({
                                        left: -scrollContainerRef.current.clientWidth / 3,
                                        behavior: 'smooth',
                                    })
                                }
                                className={cn(
                                    'rounded-full border p-2 text-muted-foreground transition-colors hover:text-foreground',
                                    RULE
                                )}
                                aria-label="Previous"
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </button>
                            <button
                                onClick={() =>
                                    scrollContainerRef.current?.scrollBy({
                                        left: scrollContainerRef.current.clientWidth / 3,
                                        behavior: 'smooth',
                                    })
                                }
                                className={cn(
                                    'rounded-full border p-2 text-muted-foreground transition-colors hover:text-foreground',
                                    RULE
                                )}
                                aria-label="Next"
                            >
                                <ChevronRight className="h-4 w-4" />
                            </button>
                        </div>
                    </div>

                    <div
                        ref={scrollContainerRef}
                        className="-mx-6 flex snap-x gap-6 overflow-x-auto px-6 pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']"
                    >
                        {otherProjects.map((p) => (
                            <Link
                                href={`/projects/${p.slug}`}
                                key={p.id}
                                className="group flex-none snap-center md:w-[calc(50%-0.75rem)] w-[80vw]"
                            >
                                <div className={cn('relative aspect-[16/10] overflow-hidden rounded-xl border bg-secondary/20', RULE)}>
                                    {p.image ? (
                                        <img
                                            src={p.image}
                                            alt={p.title}
                                            loading="lazy"
                                            className="absolute inset-0 h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]"
                                        />
                                    ) : (
                                        <ProjectPlaceholder className="absolute inset-0" title={p.title} />
                                    )}
                                </div>
                                <div className="mt-4 flex items-baseline justify-between gap-4">
                                    <h3 className="text-base font-semibold text-foreground">{p.title}</h3>
                                    <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                                </div>
                                <p className={cn(EYEBROW, 'mt-2 block')}>{p.category || p.techStack[0]}</p>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            {/* Lightbox */}
            <AnimatePresence>
                {selectedImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedImage(null)}
                        className="fixed inset-0 z-[200] flex cursor-zoom-out items-center justify-center bg-black/95 p-4 backdrop-blur-xl"
                    >
                        <img
                            src={selectedImage}
                            alt=""
                            className="max-h-[90vh] max-w-full rounded-lg object-contain shadow-2xl"
                        />
                        <button
                            className="absolute right-4 top-4 rounded-full bg-white/10 p-3 text-white transition-colors hover:bg-white/20"
                            aria-label="Close"
                        >
                            <X className="h-6 w-6" />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </article>
    );
}
