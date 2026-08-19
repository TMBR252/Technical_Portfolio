'use client';

import { useState, useEffect, useMemo, useRef, type MouseEvent, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { X, Code, Box, ExternalLink, Github, Terminal, ChevronRight, ChevronLeft, Copy, Check, Zap, Sparkles, Clock, Users, Layers, LayoutGrid, MousePointerClick } from 'lucide-react';
import { cn, formatDate } from '@/lib/utils';
import { Project } from '@/types';
import { ProjectPlaceholder } from './ProjectPlaceholder';
import { ProjectMedia } from './ProjectMedia';
import { ProjectLiveEmbed } from './ProjectLiveEmbed';
import { ProjectStackModal } from './ProjectStackModal';
import { BackToProjectsLink } from './BackToProjectsLink';
import Link from 'next/link';
import { portfolioData } from '@/data/portfolio';
import type { CaseStudyEvidencePlaceholder, CaseStudySection, TechGroup } from '@/types';
import { useMarvinPageContext } from '@/providers/MarvinPageContextProvider';
import { buildMarvinPageContext } from '@/lib/marvin/page-context';
import { MarvinChromeControls } from '@/components/layout/MarvinChromeControls';

const brand = {
    text: 'text-brand',
    textMuted: 'text-brand/80',
    bgSoft: 'bg-brand/10',
    bgDot: 'bg-brand',
    borderSoft: 'border-brand/30',
    iconBox: 'bg-brand/10 text-brand',
    hoverBorder: 'group-hover:border-brand',
    hoverText: 'group-hover:text-brand',
} as const;

// --- Project Access Actions ---
const accessButtonBase = 'flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm transition-all';

const accessButtonVariants = {
    primary: 'font-bold bg-foreground text-background hover:opacity-90 shadow-lg shadow-black/20',
    accent: 'font-bold bg-brand/10 text-foreground border-2 border-brand hover:bg-brand/20',
    neutral:
        'font-semibold bg-white dark:bg-white/[0.06] text-foreground border-2 border-black/20 dark:border-white/20 hover:bg-black/[0.03] dark:hover:bg-white/10 hover:border-black/30 dark:hover:border-white/30 shadow-sm',
    unavailable:
        'font-bold cursor-not-allowed bg-black/[0.04] dark:bg-zinc-800/60 text-black/40 dark:text-zinc-500 border border-black/10 dark:border-white/5',
} as const;

/**
 * One action in the Project Access card. A '#' href marks an action that exists but
 * is not reachable; `locked` keeps the normal styling for work that stays private.
 */
const ProjectAccessButton = ({
    label,
    icon,
    variant,
    href,
    locked = false,
    iconAfter = false,
}: {
    label: string;
    icon: ReactNode;
    variant: keyof Omit<typeof accessButtonVariants, 'unavailable'>;
    href?: string;
    locked?: boolean;
    iconAfter?: boolean;
}) => {
    const isLink = Boolean(href) && href !== '#';
    const content = iconAfter ? (
        <>
            <span>{label}</span>
            {icon}
        </>
    ) : (
        <>
            {icon}
            <span>{label}</span>
        </>
    );

    if (isLink) {
        return (
            <motion.a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(accessButtonBase, accessButtonVariants[variant])}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
            >
                {content}
            </motion.a>
        );
    }

    return (
        <button
            type="button"
            aria-label={locked ? `${label} - private` : `${label} - unavailable`}
            aria-disabled={!locked}
            className={cn(
                accessButtonBase,
                locked ? accessButtonVariants[variant] : accessButtonVariants.unavailable,
                locked && 'cursor-lock-hover'
            )}
        >
            {content}
        </button>
    );
};

// --- Animated Terminal Component ---
const TerminalBlock = ({ title, code }: { title: string; code: string }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="rounded-xl overflow-hidden border border-black/15 dark:border-white/10 bg-slate-50 dark:bg-zinc-950 shadow-2xl">
            {/* Terminal Header */}
            <div className="flex items-center justify-between px-4 py-2 bg-slate-200/50 dark:bg-white/5 border-b border-black/10 dark:border-white/5">
                <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/80" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                    <div className={cn('w-3 h-3 rounded-full', brand.bgDot, 'opacity-80')} />
                </div>
                <span className="text-xs font-mono text-slate-500 dark:text-white/30">{title}</span>
                <div className="w-10" /> {/* Spacer for balance */}
            </div>

            {/* Terminal Body */}
            <div className="relative group p-4">
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={handleCopy}
                        className="p-1.5 rounded-md bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-slate-500 dark:text-white/50 hover:text-black dark:hover:text-white transition-all focus:outline-none"
                    >
                        {copied ? <Check className={cn('w-3.5 h-3.5', brand.text)} /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                </div>
                <div className="font-mono text-sm leading-relaxed overflow-x-auto">
                    {code.split('\n').map((line, i) => (
                        <div key={i} className="flex min-w-max">
                            <span className="text-slate-400 dark:text-white/20 mr-4 select-none">$</span>
                            <span className={brand.text}>{line}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// Helper to render text with bold markers (**text**)
const renderRichText = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={i} className={cn('font-bold px-1 rounded mx-0.5', brand.text, brand.bgSoft)}>{part.slice(2, -2)}</strong>;
        }
        return <span key={i}>{part}</span>;
    });
};

// --- Single teaser image → opens modal slideshow ---
const ProjectGalleryTeaser = ({
    image,
    imageCount,
    onOpen,
}: {
    image: string;
    imageCount: number;
    onOpen: () => void;
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 0.6 }}
            className="pb-4"
        >
            <ProjectMedia staged={false} onClick={onOpen} className="rounded-3xl shadow-none dark:shadow-none">
                <img
                    src={image}
                    alt="Visual gallery preview"
                    loading="lazy"
                    className="block h-auto w-full object-cover object-top"
                />
            </ProjectMedia>
            {imageCount > 1 && (
                <p className="mt-4 text-center text-sm text-muted-foreground">
                    Click to view all {imageCount} images
                </p>
            )}
        </motion.div>
    );
};

const EvidencePlaceholder = ({ placeholder }: { placeholder: CaseStudyEvidencePlaceholder }) => (
    <figure
        className={cn(
            'relative flex overflow-hidden rounded-2xl border border-dashed border-black/25 bg-secondary/10 p-6 dark:border-white/20 dark:bg-secondary/5',
            placeholder.aspectRatio === 'standard' ? 'min-h-72' : 'min-h-64',
        )}
    >
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,transparent_49.75%,rgba(0,0,0,0.06)_50%,transparent_50.25%)] bg-[length:20px_20px] dark:bg-[linear-gradient(135deg,transparent_49.75%,rgba(255,255,255,0.06)_50%,transparent_50.25%)]" />
        <div className="relative z-10 flex max-w-lg flex-col justify-end">
            <span className="mb-auto inline-flex w-fit rounded-full border border-brand/30 bg-brand/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-brand">
                Evidence to add
            </span>
            <p className="mt-10 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                {placeholder.artifact}
            </p>
            <h4 className="mt-2 text-xl font-bold tracking-tight text-foreground">{placeholder.title}</h4>
            <figcaption className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {placeholder.description}
            </figcaption>
        </div>
    </figure>
);

const CaseStudySectionView = ({
    section,
    onImageClick,
    slideshowCount,
}: {
    section: CaseStudySection;
    onImageClick: (src: string) => void;
    slideshowCount: number;
}) => {
    const sectionImages = section.images ?? [];
    const blockImageSet = new Set(
        section.blocks?.map((b) => b.image).filter((src): src is string => Boolean(src)) ?? [],
    );
    const sectionOnlyImages = sectionImages.filter((src) => !blockImageSet.has(src));

    return (
        <section id={section.id} className="scroll-mt-28">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground mb-6">
                {section.label}
            </h2>

            {section.body && (
                <p className="max-w-2xl text-lg text-muted-foreground leading-relaxed mb-10">
                    {renderRichText(section.body)}
                </p>
            )}

            {section.blocks && section.blocks.length > 0 && (
                <div className="max-w-2xl space-y-10 border-l border-black/15 pl-6 dark:border-white/10 md:pl-8">
                    {section.blocks.map((block, idx) => (
                        <div key={`${section.id}-${idx}`}>
                            <h3 className="text-sm font-bold uppercase tracking-wider text-foreground mb-2">
                                {block.title}
                            </h3>
                            {block.body && (
                                <p className="text-base text-muted-foreground leading-relaxed">
                                    {renderRichText(block.body)}
                                </p>
                            )}
                            {block.placeholder && (
                                <div className="mt-6 max-w-4xl">
                                    <EvidencePlaceholder placeholder={block.placeholder} />
                                </div>
                            )}
                            {block.image && (
                                <div className="mt-6 max-w-4xl">
                                    <ProjectMedia
                                        staged={false}
                                        onClick={() => onImageClick(block.image!)}
                                        className="rounded-2xl shadow-none dark:shadow-none"
                                    >
                                        <img
                                            src={block.image}
                                            alt={block.imageAlt ?? block.title}
                                            loading="lazy"
                                            className="block h-auto w-full object-cover object-top"
                                        />
                                    </ProjectMedia>
                                    {block.imageCaption && (
                                        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                                            {block.imageCaption}
                                        </p>
                                    )}
                                </div>
                            )}
                            {block.media && block.media.length > 0 && (
                                <div
                                    className={cn(
                                        'mt-6 grid gap-4',
                                        block.media.length >= 3
                                            ? 'sm:grid-cols-3'
                                            : block.media.length === 2
                                              ? 'sm:grid-cols-2'
                                              : 'grid-cols-1'
                                    )}
                                >
                                    {block.media.map((item) => (
                                        <figure key={item.src}>
                                            <ProjectMedia
                                                staged={false}
                                                onClick={() => onImageClick(item.src)}
                                                className="rounded-xl shadow-none dark:shadow-none"
                                            >
                                                <img
                                                    src={item.src}
                                                    alt={item.alt}
                                                    loading="lazy"
                                                    className="block h-auto w-full object-cover object-top"
                                                />
                                            </ProjectMedia>
                                            {item.caption && (
                                                <figcaption className="mt-3 text-sm leading-relaxed text-muted-foreground">
                                                    {item.caption}
                                                </figcaption>
                                            )}
                                        </figure>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {sectionOnlyImages.length > 0 && (
                <div className={cn('max-w-4xl', section.body || section.blocks?.length ? 'mt-12' : '')}>
                    <ProjectGalleryTeaser
                        image={sectionOnlyImages[0]}
                        imageCount={slideshowCount}
                        onOpen={() => onImageClick(sectionOnlyImages[0])}
                    />
                    {sectionOnlyImages.length > 1 && (
                        <p className="mt-3 text-sm text-muted-foreground">
                            {sectionOnlyImages.length - 1} more in this section · {slideshowCount} total
                        </p>
                    )}
                </div>
            )}
        </section>
    );
};

// --- Modal slideshow with thumbnail strip ---
const GallerySlideshow = ({
    images,
    index,
    onIndexChange,
    onClose,
}: {
    images: string[];
    index: number;
    onIndexChange: (index: number) => void;
    onClose: () => void;
}) => {
    const thumbRefs = useRef<(HTMLButtonElement | null)[]>([]);

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
            if (e.key === 'ArrowRight') onIndexChange((index + 1) % images.length);
            if (e.key === 'ArrowLeft') onIndexChange((index - 1 + images.length) % images.length);
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [index, images.length, onClose, onIndexChange]);

    useEffect(() => {
        thumbRefs.current[index]?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }, [index]);

    const goPrev = (e: MouseEvent) => {
        e.stopPropagation();
        onIndexChange((index - 1 + images.length) % images.length);
    };
    const goNext = (e: MouseEvent) => {
        e.stopPropagation();
        onIndexChange((index + 1) % images.length);
    };

    useEffect(() => {
        const prev = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = prev;
        };
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[200] flex flex-col bg-black/95 backdrop-blur-xl"
            role="dialog"
            aria-modal="true"
            aria-label="Image gallery"
        >
            <button
                type="button"
                onClick={onClose}
                className="absolute top-4 right-4 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                aria-label="Close gallery"
            >
                <X className="w-6 h-6" />
            </button>

            <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 pt-16 pb-4 sm:px-16">
                {images.length > 1 && (
                    <>
                        <button
                            type="button"
                            onClick={goPrev}
                            className="absolute left-2 sm:left-4 z-10 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                            aria-label="Previous image"
                        >
                            <ChevronLeft className="w-6 h-6" />
                        </button>
                        <button
                            type="button"
                            onClick={goNext}
                            className="absolute right-2 sm:right-4 z-10 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                            aria-label="Next image"
                        >
                            <ChevronRight className="w-6 h-6" />
                        </button>
                    </>
                )}

                <motion.img
                    key={images[index]}
                    initial={{ opacity: 0.4, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2 }}
                    src={images[index]}
                    alt={`Gallery image ${index + 1} of ${images.length}`}
                    onClick={(e) => e.stopPropagation()}
                    className="max-h-full max-w-full object-contain rounded-lg shadow-2xl cursor-default"
                />
            </div>

            {images.length > 1 && (
                <div
                    onClick={(e) => e.stopPropagation()}
                    className="shrink-0 border-t border-white/10 bg-black/40 px-4 py-3"
                >
                    <div className="mx-auto flex max-w-4xl gap-2 overflow-x-auto pb-1 scrollbar-thin">
                        {images.map((img, i) => (
                            <button
                                key={`${img}-${i}`}
                                type="button"
                                ref={(el) => {
                                    thumbRefs.current[i] = el;
                                }}
                                onClick={() => onIndexChange(i)}
                                className={cn(
                                    'relative h-14 w-20 sm:h-16 sm:w-24 shrink-0 overflow-hidden rounded-md border-2 transition-all',
                                    i === index
                                        ? 'border-brand opacity-100'
                                        : 'border-transparent opacity-50 hover:opacity-80'
                                )}
                                aria-label={`View image ${i + 1}`}
                                aria-current={i === index}
                            >
                                <img src={img} alt="" className="h-full w-full object-cover object-top" />
                            </button>
                        ))}
                    </div>
                    <p className="mt-2 text-center text-xs text-white/40 font-mono">
                        {index + 1} / {images.length}
                    </p>
                </div>
            )}
        </motion.div>
    );
};

// --- Typewriter Effect Component ---
const Typewriter = ({ examples }: { examples: string[] }) => {
    const [currentText, setCurrentText] = useState("");
    const [loopNum, setLoopNum] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);
    const typingSpeed = 100;
    const deletingSpeed = 50;
    const pauseTime = 2000;

    useEffect(() => {
        const handleType = () => {
            const i = loopNum % examples.length;
            const fullText = examples[i];

            setCurrentText(isDeleting
                ? fullText.substring(0, currentText.length - 1)
                : fullText.substring(0, currentText.length + 1)
            );

            if (!isDeleting && currentText === fullText) {
                setTimeout(() => setIsDeleting(true), pauseTime);
            } else if (isDeleting && currentText === "") {
                setIsDeleting(false);
                setLoopNum(loopNum + 1);
            }
        };

        const timer = setTimeout(handleType, isDeleting ? deletingSpeed : typingSpeed);
        return () => clearTimeout(timer);
    }, [currentText, isDeleting, loopNum, examples]);

    return (
        <span className={cn('font-mono', brand.text)}>
            {currentText}
            <span className="animate-pulse">|</span>
        </span>
    );
};

export function ProjectPageContent({ project, isLowPowerMode }: { project: Project; isLowPowerMode?: boolean }) {
    const t = useTranslations('projects');
    const tCommon = useTranslations('common');
    const { setPageContext, clearPageContext } = useMarvinPageContext();
    const isOngoing = project.status === 'ongoing';
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
    const [hoveredTocId, setHoveredTocId] = useState<string | null>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const hasCaseStudy = Boolean(project.caseStudy?.length);

    useEffect(() => {
        setPageContext(buildMarvinPageContext(project));
        return () => clearPageContext();
    }, [project, setPageContext, clearPageContext]);

    /** Case-study assets + explicit gallery list (deduped) — one slideshow for the page */
    const slideshowImages = useMemo(() => {
        const fromCase = (project.caseStudy ?? []).flatMap((section) => [
            ...(section.images ?? []),
            ...((section.blocks?.map((b) => b.image).filter(Boolean) as string[]) ?? []),
            ...(section.blocks?.flatMap((b) => b.media?.map((item) => item.src) ?? []) ?? []),
        ]);
        const fromVisualSections = (project.visualSections ?? []).flatMap((section) =>
            section.rows.flatMap((row) => row.map((item) => item.src)),
        );
        const fromVisualRows = (project.visualRows ?? []).flatMap((row) => row.map((item) => item.src));
        const gallery = project.galleryImages ?? [];
        const useHeroImage = !project.heroEmbed || !project.heroEmbedSrc;
        const all = [
            ...(useHeroImage && !project.heroVideo ? [project.image] : []),
            ...gallery,
            ...fromCase,
            ...fromVisualSections,
            ...fromVisualRows,
        ].filter(Boolean) as string[];
        return Array.from(new Set(all));
    }, [
        project.image,
        project.galleryImages,
        project.caseStudy,
        project.visualSections,
        project.visualRows,
        project.heroEmbed,
        project.heroEmbedSrc,
        project.heroVideo,
    ]);

    const showHeroEmbed = Boolean(project.heroEmbed && project.heroEmbedSrc);
    const showHeroVideo = Boolean(project.heroVideo);
    // The frame's open link should lead to whatever the frame contains: a hosted
    // prototype when the hero embeds one, otherwise the deployed site.
    const heroEmbedIsPrototype = showHeroEmbed && /(^|\.)figma\.com\//i.test(project.heroEmbedSrc!);
    const heroEmbedOpenUrl = heroEmbedIsPrototype ? project.prototypeUrl : project.demoUrl;
    const heroEmbedOpenLabel = heroEmbedIsPrototype ? 'Open in Figma' : undefined;

    const [stackOpen, setStackOpen] = useState(false);
    // Projects that declare techGroups are already categorised; the rest get a flat
    // technologies group plus their tools.
    const stackGroups = useMemo<TechGroup[]>(() => {
        if (project.techGroups?.length) return project.techGroups;
        const groups: TechGroup[] = [];
        if (project.techStack.length) groups.push({ label: t('sections.technologies'), items: project.techStack });
        if (project.tools?.length) groups.push({ label: t('sections.tools'), items: project.tools });
        return groups;
    }, [project.techGroups, project.techStack, project.tools, t]);

    const resolvedVisualSections = useMemo(() => {
        if (project.visualSections?.length) return project.visualSections;
        if (project.visualRows?.length) {
            return [{ id: 'visuals', label: 'Visuals', rows: project.visualRows }];
        }
        return [];
    }, [project.visualSections, project.visualRows]);

    const tocItems = useMemo(() => {
        if (hasCaseStudy) {
            const items = project.caseStudy!.map((section) => ({
                id: section.id,
                label: section.label,
            }));
            for (const section of resolvedVisualSections) {
                items.push({ id: section.id, label: section.label });
            }
            if (project.installation) {
                items.push({ id: 'installation', label: t('sections.installation') });
            }
            if (project.galleryVideo || slideshowImages.length > 0) {
                items.push({ id: 'gallery', label: t('sections.visualGallery') });
            }
            return items;
        }

        const items: { id: string; label: string }[] = [
            { id: 'mission', label: t('sections.missionBrief') },
        ];
        if (project.features) items.push({ id: 'features', label: t('sections.keyFeatures') });
        if (project.challengesAndSolutions) items.push({ id: 'chronicles', label: t('sections.engineeringChronicles') });
        if (project.galleryImages?.length) items.push({ id: 'gallery', label: t('sections.visualGallery') });
        if (project.installation) items.push({ id: 'installation', label: t('sections.installation') });
        return items;
    }, [
        hasCaseStudy,
        project.caseStudy,
        project.features,
        project.challengesAndSolutions,
        project.galleryImages,
        project.galleryVideo,
        project.installation,
        resolvedVisualSections,
        slideshowImages.length,
        t,
    ]);

    const [activeTocId, setActiveTocId] = useState(tocItems[0]?.id ?? 'mission');
    const tocRefs = useRef<Record<string, HTMLButtonElement | null>>({});

    const firstTocId = tocItems[0]?.id ?? 'mission';
    useEffect(() => {
        setActiveTocId(firstTocId);
    }, [project.id, firstTocId]);

    const highlightedTocId = hoveredTocId ?? activeTocId;

    useEffect(() => {
        const ids = tocItems.map((item) => item.id);
        const elements = ids
            .map((id) => document.getElementById(id))
            .filter((el): el is HTMLElement => Boolean(el));
        if (elements.length === 0) return;

        const observer = new IntersectionObserver(
            (entries) => {
                const visible = entries
                    .filter((entry) => entry.isIntersecting)
                    .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
                if (visible[0]?.target.id) {
                    setActiveTocId(visible[0].target.id);
                }
            },
            {
                rootMargin: '-20% 0px -55% 0px',
                threshold: [0, 0.1, 0.25, 0.5, 0.75],
            }
        );

        elements.forEach((el) => observer.observe(el));
        return () => observer.disconnect();
    }, [tocItems]);

    // Keep the active entry visible when the list is taller than the sidebar can show.
    useEffect(() => {
        tocRefs.current[activeTocId]?.scrollIntoView({ block: 'nearest' });
    }, [activeTocId]);

    const openSlideshow = (index: number) => {
        if (slideshowImages.length === 0) return;
        setLightboxIndex(Math.max(0, Math.min(index, slideshowImages.length - 1)));
    };

    const openSlideshowAt = (src: string) => {
        const index = slideshowImages.indexOf(src);
        openSlideshow(index >= 0 ? index : 0);
    };

    const scrollToSection = (id: string) => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setActiveTocId(id);
    };

    // Get other projects for "More Projects" section
    const otherProjects = useMemo(() => {
        const others = portfolioData.projects.filter(p => p.id !== project.id);
        // We take the first 5 projects. We avoid Math.random() here to prevent SSR hydration mismatch!
        return others.slice(0, 5);
    }, [project.id]);

    return (
        <div className="min-h-screen bg-background text-foreground pb-24">

            {/* Sticky chrome - back link always reachable above page content */}
            <div className="sticky top-0 z-40 marvin-fixed-chrome border-b border-black/10 bg-background/90 backdrop-blur-md dark:border-white/10 dark:bg-background/85">
                <div className="container mx-auto max-w-7xl px-6 py-3">
                    <div className="flex items-center justify-between gap-4">
                        <BackToProjectsLink
                            label={t('sections.backToProjects')}
                            className="min-h-10 touch-manipulation"
                        />
                        <MarvinChromeControls themeVisibility="always" />
                    </div>
                </div>
            </div>

            {/* 1. HEADER SECTION (Centered, Blog Style) */}
            <div className="container max-w-7xl mx-auto px-6 mb-12 relative pt-6 sm:pt-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {/* Title & Description - REMOVED max-w-4xl constraint for Title */}
                    <div className="w-full">
                        {/* Status Badge */}
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-6 border bg-secondary/10 dark:bg-secondary/5 border-black/20 dark:border-border/40 text-muted-foreground">
                            <span className={cn('w-2 h-2 rounded-full', brand.bgDot, isOngoing ? 'animate-pulse' : 'opacity-60')} />
                            {isOngoing ? t('status.ongoing') : t('status.completed')}
                        </div>

                        {/* Full Width Layout for Title */}
                        <h1 className="text-4xl md:text-5xl lg:text-7xl font-black tracking-tight text-foreground mb-6 leading-[1.0] break-words uppercase">
                            {project.title}
                        </h1>

                        <p className="text-xl md:text-2xl text-muted-foreground/80 leading-relaxed max-w-3xl font-light mb-8">
                            {project.description}
                        </p>

                        {/* Typewriter Effect (Subtext) */}
                        <div className={cn('font-mono text-sm mb-8 h-6 flex items-center', brand.textMuted)}>
                            <Typewriter examples={[
                                "Initiating project overview...",
                                "Loading technical specifications...",
                                "Decrypting success metrics..."
                            ]} />
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* 2. HERO — live embed or static capture */}
            <div className="container max-w-7xl mx-auto px-6 mb-16">
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                >
                    {showHeroEmbed ? (
                        <ProjectLiveEmbed
                            src={project.heroEmbedSrc!}
                            externalUrl={heroEmbedOpenUrl}
                            openLabel={heroEmbedOpenLabel}
                            title={project.title}
                            caption={project.heroEmbedCaption}
                        />
                    ) : showHeroVideo ? (
                        <ProjectMedia
                            staged={false}
                            className="rounded-3xl shadow-none dark:shadow-none"
                        >
                            <video
                                src={project.heroVideo}
                                poster={project.image}
                                autoPlay
                                loop
                                muted
                                playsInline
                                preload="metadata"
                                className="block aspect-[2/1] w-full bg-black object-cover object-center"
                            />
                        </ProjectMedia>
                    ) : project.image ? (
                        <ProjectMedia
                            staged={false}
                            onClick={() => openSlideshow(0)}
                            className="rounded-3xl shadow-none dark:shadow-none"
                        >
                            <img
                                src={project.image}
                                alt={project.title}
                                className="block h-auto w-full object-cover object-top"
                            />
                        </ProjectMedia>
                    ) : (
                        <div className="relative w-full aspect-video md:aspect-[2/1] overflow-hidden rounded-3xl bg-secondary/5 shadow-2xl">
                            <ProjectPlaceholder className="rounded-none border-0 bg-transparent pb-0 [&>div.z-10]:scale-125" title={project.title} />
                        </div>
                    )}
                </motion.div>
            </div>

            {/* 3. METADATA BAR (Horizontal Strip) */}
            <div className={cn(
                'container max-w-7xl mx-auto px-6',
                project.highlights && project.highlights.length > 0 ? 'mb-8' : 'mb-20'
            )}>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-y-8 gap-x-4 border-y border-black/20 dark:border-border/40 py-8">
                    <div className="flex flex-col gap-2">
                        <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold flex items-center gap-2">
                            <Code className="w-3 h-3" /> {t('metadata.role')}
                        </span>
                        <span className="font-bold text-foreground">{project.role || t('metadata.roleValue')}</span>
                    </div>
                    <div className="flex flex-col gap-2">
                        <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold flex items-center gap-2">
                            <Clock className="w-3 h-3" /> {t('metadata.timeline')}
                        </span>
                        <span className="font-bold text-foreground">{project.customTimeline || formatDate(project.startDate)}</span>
                    </div>
                    <div className="flex flex-col gap-2">
                        <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold flex items-center gap-2">
                            <Users className="w-3 h-3" /> {t('metadata.team')}
                        </span>
                        <span className="font-bold text-foreground">{project.team || t('metadata.teamValue')}</span>
                    </div>
                    <div className="flex flex-col gap-2">
                        <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold flex items-center gap-2">
                            <Layers className="w-3 h-3" /> {t('metadata.techStack')}
                        </span>
                        <span className="font-bold text-foreground truncate">{t('metadata.techStackValue', { count: project.techStack.length })}</span>
                    </div>
                </div>
            </div>

            {/* 3b. HIGHLIGHTS PROOF STRIP */}
            {project.highlights && project.highlights.length > 0 && (
                <div className="container max-w-7xl mx-auto px-6 mb-20">
                    <div className="flex flex-wrap gap-3">
                        {project.highlights.map((item) => (
                            <span
                                key={item}
                                className="inline-flex items-center gap-2 rounded-full border border-black/15 bg-secondary/10 px-4 py-2 text-sm font-medium text-foreground dark:border-white/10 dark:bg-secondary/5"
                            >
                                <Sparkles className={cn('h-3.5 w-3.5 shrink-0', brand.text)} />
                                {item}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* 4. MAIN CONTENT GRID */}
            <div className="container max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                    {/* LEFT COLUMN: Main Content (8 cols) */}
                    <div className="lg:col-span-8 space-y-20">

                        {hasCaseStudy ? (
                            <>
                                {project.caseStudy!.map((section) => (
                                    <CaseStudySectionView
                                        key={section.id}
                                        section={section}
                                        onImageClick={openSlideshowAt}
                                        slideshowCount={slideshowImages.length}
                                    />
                                ))}

                                {resolvedVisualSections.map((section) => (
                                    <div
                                        key={section.id}
                                        id={section.id}
                                        className="space-y-4 scroll-mt-28"
                                    >
                                        {section.rows.map((row, rowIndex) => {
                                            const renderMedia = (
                                                item: (typeof row)[number],
                                                opts?: { className?: string; stretch?: boolean },
                                            ) => {
                                                const fill = Boolean(item.fillFrame);
                                                return (
                                                    <ProjectMedia
                                                        key={item.src}
                                                        staged={false}
                                                        onClick={() => openSlideshowAt(item.src)}
                                                        className={cn(
                                                            'rounded-2xl shadow-none dark:shadow-none',
                                                            opts?.stretch && fill && 'h-full',
                                                            opts?.className,
                                                        )}
                                                    >
                                                        <img
                                                            src={item.src}
                                                            alt={item.alt}
                                                            loading="lazy"
                                                            className={cn(
                                                                'block w-full',
                                                                fill
                                                                    ? 'aspect-square h-full min-h-[14rem] object-cover object-center'
                                                                    : 'h-auto object-contain object-center bg-black',
                                                            )}
                                                        />
                                                    </ProjectMedia>
                                                );
                                            };

                                            // 3 items → tall character | uncropped diagram + cropping yellow filler
                                            if (row.length === 3) {
                                                const [figure, diagram, filler] = row;
                                                return (
                                                    <div
                                                        key={`${section.id}-row-${rowIndex}`}
                                                        className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:items-stretch"
                                                    >
                                                        <ProjectMedia
                                                            staged={false}
                                                            onClick={() => openSlideshowAt(figure.src)}
                                                            className="h-full min-h-[28rem] rounded-2xl bg-black shadow-none dark:shadow-none"
                                                        >
                                                            <img
                                                                src={figure.src}
                                                                alt={figure.alt}
                                                                loading="lazy"
                                                                className="block h-full min-h-[28rem] w-full bg-black object-contain object-center"
                                                            />
                                                        </ProjectMedia>

                                                        <div className="flex h-full min-h-[28rem] flex-col gap-4">
                                                            <ProjectMedia
                                                                staged={false}
                                                                onClick={() => openSlideshowAt(diagram.src)}
                                                                className="shrink-0 rounded-2xl bg-black shadow-none dark:shadow-none"
                                                            >
                                                                <img
                                                                    src={diagram.src}
                                                                    alt={diagram.alt}
                                                                    loading="lazy"
                                                                    className="block h-auto w-full bg-black object-contain object-center"
                                                                />
                                                            </ProjectMedia>

                                                            <ProjectMedia
                                                                staged={false}
                                                                onClick={() => openSlideshowAt(filler.src)}
                                                                className="min-h-0 flex-1 rounded-2xl shadow-none dark:shadow-none"
                                                            >
                                                                <img
                                                                    src={filler.src}
                                                                    alt={filler.alt}
                                                                    loading="lazy"
                                                                    className="block h-full min-h-[12rem] w-full object-cover object-center"
                                                                />
                                                            </ProjectMedia>
                                                        </div>
                                                    </div>
                                                );
                                            }

                                            return (
                                                <div
                                                    key={`${section.id}-row-${rowIndex}`}
                                                    className={cn(
                                                        'grid gap-4',
                                                        row.length >= 2 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1',
                                                    )}
                                                >
                                                    {row.map((item) => renderMedia(item))}
                                                </div>
                                            );
                                        })}
                                    </div>
                                ))}
                            </>
                        ) : (
                            <>
                                {/* LEGACY: mission / features / chronicles / gallery */}
                                <section id="mission">
                                    <div className="flex items-center gap-3 mb-6">
                                        <span className={cn('p-2 rounded-lg', brand.iconBox)}>
                                            <Box className="w-5 h-5" />
                                        </span>
                                        <h2 className="text-2xl font-bold text-foreground">{t('sections.missionBrief')}</h2>
                                    </div>
                                    <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-black prose-headings:tracking-tight prose-p:leading-loose text-zinc-600 dark:text-muted-foreground">
                                        <p>{project.longDescription || project.description}</p>
                                    </div>
                                </section>

                                {project.features && (
                                    <section id="features">
                                        <div className="flex items-center gap-3 mb-8">
                                            <span className={cn('p-2 rounded-lg', brand.iconBox)}>
                                                <Zap className="w-5 h-5" />
                                            </span>
                                            <h2 className="text-2xl font-bold text-foreground">{t('sections.keyFeatures')}</h2>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {project.features.map((group, idx) => (
                                                <motion.div
                                                    key={idx}
                                                    initial={{ opacity: 0, y: 20 }}
                                                    whileInView={{ opacity: 1, y: 0 }}
                                                    viewport={{ once: true }}
                                                    className="p-6 rounded-2xl bg-secondary/10 dark:bg-secondary/5 border border-black/25 dark:border-white/5 hover:border-black/35 dark:hover:border-white/10 transition-colors shadow-sm dark:shadow-none"
                                                >
                                                    <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center mb-4', brand.iconBox)}>
                                                        {idx === 0 ? <Box className="w-5 h-5" /> : idx === 1 ? <Terminal className="w-5 h-5" /> : idx === 2 ? <Zap className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
                                                    </div>
                                                    <h3 className="text-lg font-bold text-foreground mb-3">{group.title}</h3>
                                                    <ul className="space-y-2">
                                                        {group.items.map((item, i) => (
                                                            <li key={i} className="text-sm text-muted-foreground flex gap-2 items-start">
                                                                <span className={cn('mt-1.5 w-1 h-1 rounded-full shrink-0', brand.bgDot)} />
                                                                <span>{renderRichText(item)}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </section>
                                )}

                                {project.challengesAndSolutions && (
                                    <section id="chronicles">
                                        <div className="flex items-center gap-3 mb-8">
                                            <span className={cn('p-2 rounded-lg', brand.iconBox)}>
                                                <Terminal className="w-5 h-5" />
                                            </span>
                                            <h2 className="text-2xl font-bold text-foreground">{t('sections.engineeringChronicles')}</h2>
                                        </div>
                                        <div className="relative border-l border-black/40 dark:border-white/10 ml-3 space-y-12 pl-8 pb-4">
                                            {project.challengesAndSolutions.map((item, idx) => (
                                                <div key={idx} className="relative group">
                                                    <div className={cn('absolute -left-[37px] top-1 w-4 h-4 rounded-full bg-background border-2 border-black/40 dark:border-white/10 transition-colors z-10', brand.hoverBorder)} />
                                                    <h4 className={cn('text-lg font-bold text-foreground mb-2 transition-colors', brand.hoverText)}>
                                                        {item.problem}
                                                    </h4>
                                                    <div className="text-sm text-zinc-600 dark:text-muted-foreground pl-4 border-l border-black/30 dark:border-white/5">
                                                        <span className={cn('font-bold text-xs uppercase tracking-wider block mb-1', brand.text)}>{t('sections.solutionLabel')}</span>
                                                        {item.solution}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </section>
                                )}

                                {project.galleryImages && project.galleryImages.length > 0 && (
                                    <section id="gallery">
                                        <div className="flex items-center gap-3 mb-8">
                                            <span className={cn('p-2 rounded-lg', brand.iconBox)}>
                                                <LayoutGrid className="w-5 h-5" />
                                            </span>
                                            <h2 className="text-2xl font-bold text-foreground">{t('sections.visualGallery')}</h2>
                                        </div>
                                        <ProjectGalleryTeaser
                                            image={project.galleryImages[0]}
                                            imageCount={slideshowImages.length}
                                            onOpen={() => openSlideshowAt(project.galleryImages![0])}
                                        />
                                    </section>
                                )}
                            </>
                        )}

                        {/* INSTALLATION (shared) */}
                        {project.installation && (
                            <section id="installation">
                                <div className="flex items-center gap-3 mb-8">
                                    <span className={cn('p-2 rounded-lg', brand.iconBox)}>
                                        <Terminal className="w-5 h-5" />
                                    </span>
                                    <h2 className="text-2xl font-bold text-foreground">{t('sections.installation')}</h2>
                                </div>
                                <div className="space-y-6">
                                    {project.installation.map((step, idx) => (
                                        <div key={idx}>
                                            {step.type === 'code' ? (
                                                <TerminalBlock
                                                    title={step.title}
                                                    code={step.cmd || step.code || ''}
                                                />
                                            ) : (
                                                <div className="bg-secondary/20 dark:bg-secondary/5 p-6 rounded-2xl border border-black/10 dark:border-white/5">
                                                    <h3 className="text-base font-bold text-foreground mb-3 flex items-center gap-2">
                                                        <span className={cn('w-1.5 h-1.5 rounded-full', brand.bgDot)} />
                                                        {step.title}
                                                    </h3>
                                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                                        {step.code || step.cmd}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                    </div>

                    {/* RIGHT COLUMN: Sticky Sidebar (4 cols) */}
                    <div className="lg:col-span-4 relative">
                        {/* Capped so a long contents list stays reachable on short viewports */}
                        <div className="sticky top-24 space-y-6 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto lg:pr-2 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-black/10 dark:[&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full">

                            {/* Actions Card */}
                            <div className="p-6 rounded-2xl bg-white dark:bg-secondary/5 border border-black/20 dark:border-white/10 backdrop-blur-sm shadow-sm dark:shadow-none">
                                <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-6">{t('sections.projectAccess')}</h3>
                                <div className="flex flex-col gap-3">
                                    {project.demoUrl && (
                                        <ProjectAccessButton
                                            label={t('sections.liveDemo')}
                                            icon={<ExternalLink className="w-4 h-4" />}
                                            variant="primary"
                                            href={project.demoUrl}
                                            iconAfter
                                        />
                                    )}
                                    {project.prototypeUrl && (
                                        <ProjectAccessButton
                                            label={t('sections.interactiveDemo')}
                                            icon={<MousePointerClick className="w-4 h-4" />}
                                            variant="accent"
                                            href={project.prototypeUrl}
                                        />
                                    )}
                                    {(project.repoUrl || project.privateRepo || project.demoUrl || project.prototypeUrl) && (
                                        <ProjectAccessButton
                                            label={t('sections.sourceCode')}
                                            icon={<Github className="w-4 h-4" />}
                                            variant="neutral"
                                            href={project.repoUrl}
                                            locked={!project.repoUrl}
                                        />
                                    )}
                                    {stackGroups.length > 0 && (
                                        <motion.button
                                            type="button"
                                            onClick={() => setStackOpen(true)}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            className={cn(accessButtonBase, accessButtonVariants.neutral, 'mt-1 w-full')}
                                        >
                                            <Layers className="w-4 h-4" />
                                            <span>{t('sections.toolsAndTech')}</span>
                                        </motion.button>
                                    )}
                                </div>
                            </div>

                            {/* Table of Contents - scrollspy + hover highlight */}
                            <nav aria-label={t('sections.contents')}>
                                <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4 pb-3 border-b border-black/25 dark:border-white/5">{t('sections.contents')}</h3>
                                <ul className="flex flex-col">
                                    {tocItems.map((item) => {
                                        const isActive = highlightedTocId === item.id;
                                        return (
                                            <li key={item.id}>
                                                <button
                                                    type="button"
                                                    ref={(el) => {
                                                        tocRefs.current[item.id] = el;
                                                    }}
                                                    onClick={() => scrollToSection(item.id)}
                                                    onMouseEnter={() => setHoveredTocId(item.id)}
                                                    onMouseLeave={() => setHoveredTocId(null)}
                                                    onFocus={() => setHoveredTocId(item.id)}
                                                    onBlur={() => setHoveredTocId(null)}
                                                    className={cn(
                                                        'w-full text-left py-1 transition-all duration-200 origin-left',
                                                        isActive
                                                            ? cn(brand.text, 'text-base font-bold tracking-tight')
                                                            : 'text-sm font-medium text-muted-foreground'
                                                    )}
                                                    aria-current={activeTocId === item.id ? 'true' : undefined}
                                                >
                                                    {item.label}
                                                </button>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </nav>

                        </div>
                    </div>

                </div>
            </div>

            {/* 4b. VISUAL GALLERY — video finale, or image teaser → modal */}
            {hasCaseStudy && (project.galleryVideo || slideshowImages.length > 0) && (
                <section id="gallery" className="container max-w-7xl mx-auto px-6 mt-24 scroll-mt-28">
                    <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground mb-6">
                        {t('sections.visualGallery')}
                    </h2>
                    <p className="max-w-2xl text-lg text-muted-foreground leading-relaxed mb-10">
                        {project.galleryVideo
                            ? 'Motion and final surfaces from the project.'
                            : 'Screens, workflow captures, and final surfaces from the project.'}
                    </p>
                    {project.galleryVideo ? (
                        <ProjectMedia
                            staged={false}
                            onClick={() => openSlideshow(0)}
                            className="rounded-3xl shadow-none dark:shadow-none"
                        >
                            <video
                                src={project.galleryVideo}
                                autoPlay
                                loop
                                muted
                                playsInline
                                preload="metadata"
                                className="pointer-events-none block aspect-video w-full bg-black object-cover object-center"
                            />
                        </ProjectMedia>
                    ) : (
                        <ProjectGalleryTeaser
                            image={slideshowImages[0]}
                            imageCount={slideshowImages.length}
                            onOpen={() => openSlideshow(0)}
                        />
                    )}
                </section>
            )}

            {/* 5. FOOTER NAVIGATION (Back & More Projects) */}
            <div className="container max-w-7xl mx-auto px-6 mt-32 border-t border-border/40 pt-16">

                {/* Back Link Bottom */}
                <div className="mb-16">
                    <BackToProjectsLink
                        label={t('sections.backToProjects')}
                        className="group text-base"
                        iconClassName="transition-transform group-hover:-translate-x-1"
                    />
                </div>

                {/* MORE PROJECTS CAROUSEL */}
                <div className="relative group">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-bold">{t('sections.moreProjects')}</h2>
                        <div className="flex gap-2">
                            <button
                                onClick={() => {
                                    if (scrollContainerRef.current) {
                                        scrollContainerRef.current.scrollBy({ left: -scrollContainerRef.current.clientWidth / 3, behavior: 'smooth' });
                                    }
                                }}
                                className="p-2 rounded-full border border-black/10 dark:border-white/10 bg-black/10 dark:bg-secondary/5 hover:bg-black/20 dark:hover:bg-white/10 transition-colors text-muted-foreground hover:text-foreground"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => {
                                    if (scrollContainerRef.current) {
                                        scrollContainerRef.current.scrollBy({ left: scrollContainerRef.current.clientWidth / 3, behavior: 'smooth' });
                                    }
                                }}
                                className="p-2 rounded-full border border-black/10 dark:border-white/10 bg-black/10 dark:bg-secondary/5 hover:bg-black/20 dark:hover:bg-white/10 transition-colors text-muted-foreground hover:text-foreground"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    <div
                        ref={scrollContainerRef}
                        className="flex gap-6 overflow-x-auto pb-4 snap-x [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none'] -mx-6 px-6"
                    >
                        {otherProjects.map((p, i) => (
                            <Link
                                href={`/projects/${p.slug}`}
                                key={p.id}
                                className="flex-none w-[85vw] md:w-[calc(33.333%-1rem)] snap-center group relative aspect-video rounded-xl overflow-hidden border border-black/30 dark:border-white/10 bg-zinc-200 dark:bg-zinc-900 shadow-md dark:shadow-none"
                            >
                                {/* Background Layer */}
                                {p.image ? (
                                    <img src={p.image} alt={p.title} loading="lazy" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                ) : (
                                    <ProjectPlaceholder className="absolute inset-0" title={p.title} />
                                )}

                                {/* Gradient Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80 transition-opacity group-hover:opacity-90" />

                                {/* Content Overlay */}
                                <div className="absolute bottom-0 left-0 w-full p-5 flex flex-col justify-end">
                                    <div className="mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
                                        <span className={cn(
                                            'inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium backdrop-blur-md',
                                            brand.borderSoft,
                                            brand.bgSoft,
                                            brand.text,
                                            p.status !== 'ongoing' && 'opacity-70'
                                        )}>
                                            {p.status === 'ongoing' ? 'In Progress' : 'Completed'}
                                        </span>
                                    </div>
                                    <h3 className="font-bold text-lg leading-tight text-white mb-1 group-hover:text-primary transition-colors line-clamp-1">
                                        {p.title}
                                    </h3>
                                    <p className="text-sm text-zinc-400 line-clamp-1">
                                        {p.techStack[0]} • {p.category || "Development"}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

            </div>

            {/* Tools and technologies modal */}
            <AnimatePresence>
                {stackOpen && (
                    <ProjectStackModal
                        groups={stackGroups}
                        title={t('sections.toolsAndTech')}
                        onClose={() => setStackOpen(false)}
                    />
                )}
            </AnimatePresence>

            {/* Gallery slideshow modal */}
            <AnimatePresence>
                {lightboxIndex !== null && slideshowImages.length > 0 && (
                    <GallerySlideshow
                        images={slideshowImages}
                        index={lightboxIndex}
                        onIndexChange={setLightboxIndex}
                        onClose={() => setLightboxIndex(null)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
