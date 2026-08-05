'use client';

import { useState, useEffect, useMemo, useRef, type MouseEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { X, Box, ExternalLink, Github, Terminal, ChevronRight, ChevronLeft, Copy, Check, Zap, Sparkles, ArrowLeft, LayoutGrid } from 'lucide-react';
import { cn, formatDate } from '@/lib/utils';
import { Project } from '@/types';
import { ProjectPlaceholder } from './ProjectPlaceholder';
import { BrowserMockup } from './BrowserMockup';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { portfolioData } from '@/data/portfolio';

/** Site brand lime — matches Navbar / IdentitySequence accents */
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
    mockupUrl,
}: {
    image: string;
    imageCount: number;
    onOpen: () => void;
    mockupUrl?: string;
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 0.6 }}
            className="pb-4"
        >
            <BrowserMockup url={mockupUrl} onClick={onOpen}>
                <img
                    src={image}
                    alt="Visual gallery preview"
                    loading="lazy"
                    className="block h-auto w-full object-cover object-top"
                />
            </BrowserMockup>
            {imageCount > 1 && (
                <p className="mt-4 text-center text-sm text-muted-foreground">
                    Click to view all {imageCount} images
                </p>
            )}
        </motion.div>
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
    const router = useRouter();
    const isOngoing = project.status === 'ongoing';
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
    const [activeTocId, setActiveTocId] = useState('mission');
    const [hoveredTocId, setHoveredTocId] = useState<string | null>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    /** Hero first, then gallery shots (deduped) — one slideshow for the page */
    const slideshowImages = useMemo(() => {
        const gallery = project.galleryImages ?? [];
        if (project.image && !gallery.includes(project.image)) {
            return [project.image, ...gallery];
        }
        return gallery.length > 0 ? gallery : project.image ? [project.image] : [];
    }, [project.image, project.galleryImages]);

    const tocItems = useMemo(() => {
        const items: { id: string; label: string }[] = [
            { id: 'mission', label: t('sections.missionBrief') },
        ];
        if (project.features) items.push({ id: 'features', label: t('sections.keyFeatures') });
        if (project.challengesAndSolutions) items.push({ id: 'chronicles', label: t('sections.engineeringChronicles') });
        if (project.galleryImages?.length) items.push({ id: 'gallery', label: t('sections.visualGallery') });
        if (project.installation) items.push({ id: 'installation', label: t('sections.installation') });
        return items;
    }, [project.features, project.challengesAndSolutions, project.galleryImages, project.installation, t]);

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

    const openSlideshow = (index: number) => {
        if (slideshowImages.length === 0) return;
        setLightboxIndex(Math.max(0, Math.min(index, slideshowImages.length - 1)));
    };

    const scrollToSection = (id: string) => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setActiveTocId(id);
    };

    const handleExit = () => {
        if (typeof window !== 'undefined' && document.referrer.includes('/projects')) {
            router.back();
        } else {
            router.push('/projects');
        }
    };

    // Get other projects for "More Projects" section
    const otherProjects = useMemo(() => {
        const others = portfolioData.projects.filter(p => p.id !== project.id);
        // We take the first 5 projects. We avoid Math.random() here to prevent SSR hydration mismatch!
        return others.slice(0, 5);
    }, [project.id]);

    return (
        <div className="min-h-screen bg-background text-foreground pb-24 pt-24 sm:pt-32">

            {/* 1. HEADER SECTION (Centered, Blog Style) */}
            <div className="container max-w-7xl mx-auto px-6 mb-12 relative">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {/* Back Link */}
                    <div className="flex items-center gap-4 mb-6">
                        <div
                            onClick={handleExit}
                            className="flex items-center gap-2 text-sm text-muted-foreground font-medium hover:text-primary transition-colors group cursor-pointer"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            <span>{t('sections.backToProjects')}</span>
                        </div>
                    </div>

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

            {/* 2. HERO IMAGE SECTION (Dribbble-style browser mockup) */}
            <div className="container max-w-7xl mx-auto px-6 mb-16">
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                >
                    {project.image ? (
                        <BrowserMockup
                            url={project.demoUrl ? project.demoUrl.replace(/^https?:\/\//, '') : `${project.title.toLowerCase()}.app`}
                            onClick={() => openSlideshow(0)}
                        >
                            <img
                                src={project.image}
                                alt={project.title}
                                className="block h-auto w-full object-cover object-top"
                            />
                        </BrowserMockup>
                    ) : (
                        <div className="relative w-full aspect-video md:aspect-[2/1] overflow-hidden rounded-3xl border border-black/15 bg-secondary/5 shadow-2xl dark:border-border/40">
                            <ProjectPlaceholder className="rounded-none border-0 bg-transparent pb-0 [&>div.z-10]:scale-125" title={project.title} />
                        </div>
                    )}
                </motion.div>
            </div>

            {/* 3. ROLE / TIMELINE / TECH */}
            <div className={cn(
                'container max-w-7xl mx-auto px-6',
                project.highlights && project.highlights.length > 0 ? 'mb-8' : 'mb-20'
            )}>
                <div className="border-y border-black/20 dark:border-border/40 py-10 space-y-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
                        <div className="flex flex-col gap-2 max-w-xl">
                            <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">
                                {t('metadata.role')}
                            </span>
                            <span className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
                                {project.role || t('metadata.roleValue')}
                            </span>
                            {project.roleDescription && (
                                <p className="text-sm md:text-base text-muted-foreground leading-relaxed mt-1">
                                    {project.roleDescription}
                                </p>
                            )}
                        </div>
                        <div className="flex flex-col gap-2">
                            <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">
                                {t('metadata.timeline')}
                            </span>
                            <span className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
                                {project.customTimeline || formatDate(project.startDate)}
                            </span>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3">
                        <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">
                            {t('metadata.techStack')}
                        </span>
                        <p className={cn(
                            'text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight leading-[1.25]',
                            brand.text
                        )}>
                            {project.techStack.join(', ')}
                        </p>
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

                        {/* MISSION OVERVIEW */}
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

                        {/* FEATURES (BENTO GRID - Adapted for 8 cols) */}
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

                        {/* ENGINEERING CHRONICLES (TIMELINE) */}
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
                                                <span className={cn('font-bold text-xs uppercase tracking-wider block mb-1', brand.text)}>{t('sections.solution')}</span>
                                                {item.solution}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* GALLERY — single teaser → modal slideshow */}
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
                                    onOpen={() => {
                                        const start = project.image
                                            ? slideshowImages.indexOf(project.galleryImages![0])
                                            : 0;
                                        openSlideshow(start >= 0 ? start : 0);
                                    }}
                                    mockupUrl={
                                        project.demoUrl
                                            ? project.demoUrl.replace(/^https?:\/\//, '')
                                            : `${project.title.toLowerCase()}.app`
                                    }
                                />
                            </section>
                        )}

                        {/* INSTALLATION */}
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
                        <div className="sticky top-20 space-y-8">

                            {/* Actions Card */}
                            <div className="p-6 rounded-2xl bg-white dark:bg-secondary/5 border border-black/20 dark:border-white/10 backdrop-blur-sm shadow-sm dark:shadow-none">
                                <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-6">{t('sections.projectAccess')}</h3>
                                <div className="flex flex-col gap-3">
                                    {project.demoUrl && (
                                        <motion.a
                                            href={project.demoUrl === '#' ? undefined : project.demoUrl}
                                            target={project.demoUrl === '#' ? undefined : "_blank"}
                                            rel={project.demoUrl === '#' ? undefined : "noopener noreferrer"}
                                            className={cn(
                                                "flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm transition-all",
                                                project.demoUrl === '#'
                                                    ? "bg-zinc-800 text-zinc-500 cursor-not-allowed opacity-50 border border-white/5"
                                                    : "bg-foreground text-background hover:opacity-90 shadow-lg shadow-black/20"
                                            )}
                                            whileHover={project.demoUrl === '#' ? {} : { scale: 1.02 }}
                                            whileTap={project.demoUrl === '#' ? {} : { scale: 0.98 }}
                                        >
                                            <span>{t('sections.liveDemo')}</span>
                                            <ExternalLink className="w-4 h-4" />
                                        </motion.a>
                                    )}
                                    {project.repoUrl && (
                                        <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium text-sm bg-black/10 dark:bg-secondary/10 hover:bg-black/20 dark:hover:bg-secondary/20 text-foreground transition-all border border-black/5 dark:border-transparent hover:border-black/10 dark:hover:border-white/5">
                                            <Github className="w-4 h-4" />
                                            <span>{t('sections.sourceCode')}</span>
                                        </a>
                                    )}
                                </div>
                            </div>

                            {/* Tech Stack Tags */}
                            <div>
                                <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-6 pb-4 border-b border-black/25 dark:border-white/5">{t('sections.technologies')}</h3>
                                <div className="flex flex-wrap gap-2">
                                    {project.techStack.map(tech => (
                                        <div key={tech} className="px-3 py-1.5 bg-secondary/20 dark:bg-secondary/5 border border-black/20 dark:border-white/5 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:border-black/30 dark:hover:border-white/10 transition-colors cursor-default">
                                            {tech}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Table of Contents — scrollspy + hover highlight */}
                            <nav aria-label={t('sections.contents')}>
                                <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-6 pb-4 border-b border-black/25 dark:border-white/5">{t('sections.contents')}</h3>
                                <ul className="flex flex-col gap-1">
                                    {tocItems.map((item) => {
                                        const isActive = highlightedTocId === item.id;
                                        return (
                                            <li key={item.id}>
                                                <button
                                                    type="button"
                                                    onClick={() => scrollToSection(item.id)}
                                                    onMouseEnter={() => setHoveredTocId(item.id)}
                                                    onMouseLeave={() => setHoveredTocId(null)}
                                                    onFocus={() => setHoveredTocId(item.id)}
                                                    onBlur={() => setHoveredTocId(null)}
                                                    className={cn(
                                                        'w-full text-left py-1.5 transition-all duration-200 origin-left',
                                                        isActive
                                                            ? cn(brand.text, 'text-lg font-bold tracking-tight scale-[1.02]')
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

            {/* 5. FOOTER NAVIGATION (Back & More Projects) */}
            <div className="container max-w-7xl mx-auto px-6 mt-32 border-t border-border/40 pt-16">

                {/* Back Link Bottom */}
                <div className="mb-16">
                    <div
                        onClick={handleExit}
                        className="inline-flex items-center gap-2 text-muted-foreground font-medium hover:text-primary transition-colors group cursor-pointer"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        <span>{t('sections.backToProjects')}</span>
                    </div>
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
