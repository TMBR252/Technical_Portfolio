import React from 'react';

/** Optional case-study scroll section - omit empty sections; order = page order */
export interface CaseStudyEvidencePlaceholder {
    title: string;
    artifact: string;
    description: string;
    aspectRatio?: 'wide' | 'standard';
}

export interface CaseStudyMedia {
    src: string;
    alt: string;
    caption?: string;
    /** When true, image covers a fixed frame (object-cover) instead of natural height. */
    fillFrame?: boolean;
}

export interface CaseStudyBlock {
    title: string;
    body?: string;
    image?: string;
    imageAlt?: string;
    imageCaption?: string;
    media?: CaseStudyMedia[];
    placeholder?: CaseStudyEvidencePlaceholder;
}

export interface CaseStudySection {
    id: string;
    label: string;
    body?: string;
    blocks?: CaseStudyBlock[];
    images?: string[];
}

export interface TechGroup {
    label: string;
    items: string[];
}

export interface Project {
    id: string;
    slug: string;
    title: string;
    description: string;
    longDescription?: string;
    image?: string;
    techStack: string[];
    /** Categorised stack for the Technologies panel. Falls back to flat `techStack` when unset. */
    techGroups?: TechGroup[];
    tools: string[];
    status: 'ongoing' | 'completed' | 'planned';
    demoUrl?: string;
    /** When true and heroEmbedSrc is set, hero renders an interactive iframe instead of the hero image. */
    heroEmbed?: boolean;
    /** Same-origin path to a built site (e.g. /embed/primer/) or an absolute URL to a hosted demo. */
    heroEmbedSrc?: string;
    /** Note shown under the hero frame. Use it to say what the frame contains. */
    heroEmbedCaption?: string;
    /** Looping same-origin video for the project hero (e.g. /project/demo.mp4). */
    heroVideo?: string;
    /**
     * Named visual chapters below case-study copy (for TOC + 1/2/1 rows).
     * Each section becomes a sidebar nav item that scrolls to its image block.
     */
    visualSections?: {
        id: string;
        label: string;
        rows: CaseStudyMedia[][];
    }[];
    /** @deprecated Prefer `visualSections` */
    visualRows?: CaseStudyMedia[][];
    /** Looping video shown in the gallery slot (replaces the image teaser when set). */
    galleryVideo?: string;
    /** Clickable prototype or walkthrough. Renders the "Demo" action, separate from the deployed site. */
    prototypeUrl?: string;
    repoUrl?: string;
    /** Show a locked source-code action without exposing a repository URL. */
    privateRepo?: boolean;
    startDate: string;
    endDate?: string;
    highlights?: string[];
    challenges?: string[];
    /** @deprecated Prefer `categories` — kept for legacy entries */
    category?: string;
    /** Role lenses this project should appear under in the archive filters */
    categories?: string[];
    /** Domain / industry tags shown in the case-study hero (e.g. PropTech) */
    industries?: string[];
    /** Delivery surface, e.g. Web, Local app, Hardware */
    platform?: string;
    /** One-line statement of what you personally owned */
    contribution?: string;
    /**
     * Outcome block. Prefer verified metrics/quotes; otherwise only `shipped`.
     * Do not invent performance claims.
     */
    outcome?: {
        shipped: string;
        metrics?: string[];
        quotes?: string[];
    };
    /** Flexible case-study sections (preferred). When set, drives TOC + scroll column. */
    caseStudy?: CaseStudySection[];
    /** @deprecated Prefer caseStudy - kept for projects not yet migrated */
    features?: { title: string; items: string[] }[];
    installation?: { title: string; cmd?: string; code?: string; type: 'code' | 'text' }[];
    /** @deprecated Prefer caseStudy */
    challengesAndSolutions?: { problem: string; solution: string }[];
    galleryImages?: string[];
    team?: string;
    customTimeline?: string;
    role?: string;
    /** Short blurb under the role title on the project page */
    roleDescription?: string;
    /** When true, the project detail page requires the shared case-study passcode. */
    requiresPasscode?: boolean;
}

export interface Experience {
    id: string;
    company: string;
    position: string;
    description: string;
    responsibilities?: string[];
    skills: string[];
    startDate: string;
    endDate?: string;
    isOngoing: boolean;
    location?: string;
    type: 'full-time' | 'part-time' | 'contract' | 'internship' | 'freelance' | 'volunteer' | 'apprenticeship' | 'self-employed';
    logo?: string;
    logoBg?: string;
    link?: string;
    galleryImages?: string[];
    externalLink?: string | string[];
    keyLearnings?: string[];
    impact?: string[];
}

export interface Education {
    id: string;
    institution: string;
    degree: string;
    major: string;
    startDate: string;
    endDate?: string;
    isOngoing: boolean;
    gpa?: string;
    activities?: string[];
    achievements?: string[];
}

export interface Achievement {
    id: string;
    title: string;
    issuer: string;
    date: string;
    description?: string;
    image?: string;
    credentialUrl?: string;
    credentialId?: string;
    tags?: string[];
    type?: string;
    category: 'certification' | 'award' | 'recognition' | 'publication';
}

export interface Skill {
    name: string;
    level?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
    category: 'frontend' | 'backend' | 'database' | 'devops' | 'mobile' | 'ai' | 'data' | 'blockchain' | 'software' | 'cloud' | 'other';
    description?: string;
}

export interface TechStack {
    name: string;
    icon: string;
    category: 'language' | 'framework' | 'library' | 'database' | 'cloud' | 'tool';
    url?: string;
    relatedProjects?: string[];
}

export interface SoftSkill {
    name: string;
    description?: string;
}

export interface Tool {
    name: string;
    icon: string;
    category: 'ide' | 'design' | 'productivity' | 'devops' | 'communication' | 'other';
    relatedProjects?: string[];
}

export interface SocialLink {
    platform: string;
    url: string;
    icon: string;
    username?: string;
}

export interface Language {
    name: string;
    level: 'Native' | 'Fluent' | 'Professional' | 'Limited Working' | 'Elementary';
}

export interface FAQ {
    question: string;
    answer: string;
}

export interface PersonalInfo {
    name: string;
    /** e.g. 'he/him', 'she/her', 'they/them'. Defaults to they/them when unset. */
    pronouns?: string;
    title: string;
    subtitle: string;
    bio: string;
    avatar: string;
    location: string;
    email: string;
    phone?: string;
    website?: string;
    linktreeUrl?: string;
    resumeUrl?: string;
    languages?: Language[];
    socialLinks: SocialLink[];
}

export interface BlogPost {
    id: string;
    slug: string;
    title: string;
    excerpt: string;
    content: string;
    image: string;
    date: string;
    category: string;
    tags: string[];
    author: {
        name: string;
        avatar: string;
    };
    readTime: string;
}

export interface GalleryItem {
    id: string;
    title: string;
    description: string;
    date: string;
    type: 'image' | 'video';
    url: string;
    thumbnail?: string;
    category: string;
}

export interface PortfolioData {
    personal: PersonalInfo;
    projects: Project[];
    experiences: Experience[];
    education: Education[];
    achievements: Achievement[];
    techStack: TechStack[];
    hardSkills: Skill[];
    softSkills: SoftSkill[];
    tools: Tool[];
    faqs: FAQ[];
    blogs: BlogPost[];
    gallery: GalleryItem[];
}
