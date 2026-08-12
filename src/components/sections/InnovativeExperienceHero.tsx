'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface NodeData {
    label: string;
    description: string;
    imageUrl?: string;
    orbitIndex: number; // 0 for inner, 1 for outer
    position: number; // 0 to 1 along the orbit
}

interface InnovativeExperienceHeroProps {
    type: 'education' | 'journey' | 'experience';
    title: string;
    highlight: string;
    description: string;
}

const NODES_DATA: Record<string, NodeData[]> = {
    education: [
        { label: 'Product Craft', description: 'Continuous learning in systems, research, and interaction design.', orbitIndex: 0, position: 0.1, imageUrl: "/placeholders/node.svg" },
        { label: 'Research', description: 'Interviews, ticket mining, and prototype tests with the people who do the work.', orbitIndex: 1, position: 0.25, imageUrl: "/placeholders/node.svg" },
        { label: 'UI Systems', description: 'Reusable components, motion, and visual hierarchy.', orbitIndex: 0, position: 0.45, imageUrl: "/placeholders/node.svg" },
        { label: 'Prototyping', description: 'Figma and front-end prototypes that can be argued with.', orbitIndex: 1, position: 0.65, imageUrl: "/placeholders/node.svg" },
        { label: 'Chicago', description: 'Building for product teams from Chicago.', orbitIndex: 0, position: 0.85, imageUrl: "/placeholders/node.svg" },
        { label: 'Shipping', description: 'Clarity over decoration. Demos that feel inevitable.', orbitIndex: 1, position: 0.05, imageUrl: "/placeholders/node.svg" },
    ],
    journey: [
        { label: 'School', description: 'Visual communication and product design foundations.', orbitIndex: 0, position: 0.15, imageUrl: "/placeholders/node.svg" },
        { label: 'Searchless AI', description: 'Product design for an AI search company.', orbitIndex: 1, position: 0.35, imageUrl: "/placeholders/node.svg" },
        { label: 'Meridian Health', description: 'Clinical workflows so therapists spend less time clicking.', orbitIndex: 0, position: 0.55, imageUrl: "/placeholders/node.svg" },
        { label: 'Research', description: 'Working through directors, tickets, and prototype tests.', orbitIndex: 1, position: 0.75, imageUrl: "/placeholders/node.svg" },
        { label: '0 to 1', description: 'Owning product definition when the brief is still fuzzy.', orbitIndex: 0, position: 0.9, imageUrl: "/placeholders/node.svg" },
        { label: 'Chicago', description: 'Building for product teams from Chicago.', orbitIndex: 1, position: 0.02, imageUrl: "/placeholders/node.svg" },
    ],
    experience: [
        { label: 'Meridian', description: 'Product designer. Clinical documentation and operational surfaces.', orbitIndex: 0, position: 0.2, imageUrl: "/placeholders/node.svg" },
        { label: 'Searchless', description: 'Product design for AI search, from messy retrieval to finishable UI.', orbitIndex: 1, position: 0.45, imageUrl: "/placeholders/node.svg" },
        { label: 'Workflows', description: 'Progress, save states, and IA that match how people actually work.', orbitIndex: 0, position: 0.6, imageUrl: "/placeholders/node.svg" },
        { label: 'Alignment', description: 'Getting stakeholders to agree on the object they are building.', orbitIndex: 1, position: 0.8, imageUrl: "/placeholders/node.svg" },
        { label: 'Independent', description: 'Select freelance for thoughtful product teams.', orbitIndex: 0, position: 0.95, imageUrl: "/placeholders/node.svg" },
        { label: 'Constraints', description: 'Fixed libraries, short timelines, limited user access.', orbitIndex: 1, position: 0.1, imageUrl: "/placeholders/node.svg" },
    ]
};

const OUTER_PATH = "M 100,300 a 400,180 -15 1,0 800,0 a 400,180 -15 1,0 -800,0";
const INNER_PATH = "M 250,300 a 250,110 -15 1,0 500,0 a 250,110 -15 1,0 -500,0";

export function InnovativeExperienceHero({ type, title, highlight, description }: InnovativeExperienceHeroProps) {
    const rawNodes = NODES_DATA[type] || NODES_DATA.experience;
    const [hoveredNode, setHoveredNode] = useState<string | null>(null);

    return (
        <section className="relative w-full py-4 lg:py-6 overflow-visible bg-transparent transition-colors duration-500">

            <div className="w-full mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-12 items-center h-full overflow-visible">

                <div className="relative z-20 lg:-ml-28 lg:pr-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        viewport={{ once: true }}
                        className="flex flex-col items-start gap-5 md:gap-6"
                    >
                        <Badge variant="secondary" className="bg-muted">
                            {type === 'education' ? 'Education' : type === 'journey' ? 'Journey' : 'Archive'}
                        </Badge>

                        <h2 className="max-w-3xl text-4xl font-semibold tracking-tight text-balance text-foreground md:text-5xl lg:text-6xl lg:leading-[1.1] lg:tracking-tighter">
                            {title}<br />{highlight}
                        </h2>

                        <p className="max-w-xl text-base text-balance text-muted-foreground sm:text-lg">
                            {description}
                        </p>

                        <Button
                            asChild
                            size="lg"
                            className="group h-12 gap-2 rounded-full bg-brand text-brand-foreground hover:bg-brand/90"
                        >
                            <Link href="/resume">
                                View resume
                                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                            </Link>
                        </Button>
                    </motion.div>
                </div>

                {/* Right Orbital Column - Strictly Following Image 1 (Wide Ellipse) */}
                <div className="relative w-full h-[300px] md:h-[450px] lg:h-[600px] flex items-center justify-center overflow-visible">
                    {/* Responsive Container for Orbit */}
                    <div className="relative w-[1000px] h-[600px] scale-[0.3] sm:scale-[0.4] md:scale-[0.5] lg:scale-[0.65] xl:scale-[0.75] transition-transform duration-500 origin-center shrink-0 overflow-visible">
                        {/* SVG Orbital Paths (Tilted Ellipses) */}
                        <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible" viewBox="0 0 1000 600">
                            <path d={OUTER_PATH} className="stroke-neutral-400 dark:stroke-neutral-600 opacity-60 dark:opacity-40" fill="none" strokeWidth="1.5" strokeDasharray="6 8" />
                            <path d={INNER_PATH} className="stroke-neutral-400 dark:stroke-neutral-600 opacity-60 dark:opacity-40" fill="none" strokeWidth="1.5" strokeDasharray="6 8" />
                        </svg>

                        {/* Nodes - Positioned using offset-path to ensure they sit directly on the dashed lines */}
                        {rawNodes.map((node) => (
                            <OrbitalNode
                                key={node.label}
                                node={node}
                                isHovered={hoveredNode === node.label}
                                onHover={() => setHoveredNode(node.label)}
                                onLeave={() => setHoveredNode(null)}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

function OrbitalNode({ node, isHovered, onHover, onLeave }: {
    node: NodeData; isHovered: boolean; onHover: () => void; onLeave: () => void;
}) {
    const path = node.orbitIndex === 0 ? INNER_PATH : OUTER_PATH;
    const isLeftSide = node.position < 0.25 || node.position > 0.75;

    return (
        <div
            className="absolute"
            style={{
                offsetPath: `path('${path}')`,
                offsetDistance: `${node.position * 100}%`,
                offsetRotate: '0deg',
                zIndex: isHovered ? 50 : 20
            }}
        >
            <div className="relative" onMouseEnter={onHover} onMouseLeave={onLeave}>
                {/* 
                    The anchor point of this container is at (0,0). 
                    We place the button exactly at (0,0) by centering it with translate. 
                */}
                <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2">
                    <button
                        onMouseEnter={onHover}
                        onMouseLeave={onLeave}
                        className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 pointer-events-auto",
                            "bg-neutral-100 dark:bg-neutral-800 text-black dark:text-white border border-neutral-200 dark:border-neutral-700 shadow-sm",
                            isHovered && "scale-110 shadow-lg border-neutral-300 dark:border-neutral-600 bg-neutral-200 dark:bg-neutral-700"
                        )}
                    >
                        <Plus className={cn("w-4 h-4 transition-transform duration-500", isHovered && "rotate-45")} />
                    </button>

                    {/* Detail Card (Image 4 Style) - Anchored strictly to the center of the icon */}
                    <AnimatePresence>
                        {isHovered && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95, x: "-50%" }}
                                animate={{ opacity: 1, y: 0, scale: 1, x: "-50%" }}
                                exit={{ opacity: 0, y: 10, scale: 0.95, x: "-50%" }}
                                className="absolute bottom-[calc(100%+12px)] left-1/2 z-50 pointer-events-none"
                            >
                                <div className="relative w-[320px] bg-neutral-950/95 dark:bg-neutral-50/95 backdrop-blur-xl rounded-2xl overflow-hidden shadow-2xl pt-2 px-4 pb-4 md:pt-3 md:px-5 md:pb-5 space-y-3 border border-white/10 dark:border-black/5">
                                    {/* Tail to node */}
                                    <div className="absolute top-[calc(100%-8px)] left-1/2 -translate-x-1/2 w-4 h-4 bg-neutral-950/95 dark:bg-neutral-50/95 border-r border-b border-white/10 dark:border-black/5 rotate-45 -z-10" />
                                    <div className="space-y-1">
                                        <h4 className="text-neutral-100 dark:text-neutral-900 font-bold text-lg leading-tight">{node.label}</h4>
                                        <p className="text-neutral-400 dark:text-neutral-500 text-sm leading-relaxed">
                                            {node.description}
                                        </p>
                                    </div>

                                    {/* Image Visualization Area */}
                                    <div className="aspect-video relative rounded-xl bg-neutral-900/50 dark:bg-neutral-200/50 overflow-hidden border border-white/5 dark:border-black/5">
                                        {node.imageUrl ? (
                                            <Image src={node.imageUrl} alt={node.label} fill sizes="(max-width: 768px) 50px, 100px" className="object-cover" />
                                        ) : (
                                            <div className="absolute inset-0 flex items-center justify-center text-[10px] uppercase tracking-widest text-white/20 dark:text-black/20 font-mono">
                                                Visualization Area
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/60 dark:from-neutral-50/60 to-transparent" />
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* The Label - Positioned relative to the anchor point (stays out of center logic) */}
                <div className={cn(
                    "absolute top-0 whitespace-nowrap transition-all duration-300 pointer-events-none",
                    isLeftSide ? "right-6 pr-4 text-right" : "left-6 pl-4 text-left",
                    "-translate-y-1/2"
                )}>
                    <span className={cn(
                        "text-sm font-bold text-black dark:text-white transition-all duration-300",
                        isHovered ? "opacity-100" : "opacity-70"
                    )}>
                        {node.label}
                    </span>
                </div>
            </div>
        </div>
    );
}

