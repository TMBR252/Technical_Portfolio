import React, { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Github, Linkedin, Instagram, ArrowDownRight, Bot, Zap, ExternalLink, MessageSquare } from 'lucide-react';
import { portfolioData } from "@/data/portfolio";
import Link from 'next/link';
import { Spotlight } from "@/components/ui/spotlight-new";
import { BlockWarpTitle } from "@/components/sections/BlockWarpTitle";

/** Hover tooltips only when a fine pointer can hover — useless on touch. */
function canUseHoverTooltip() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
}

export function HeroVisual({ isExiting = false }: { isExiting?: boolean }) {
  const { personal } = portfolioData;
  const prefersReducedMotion = useReducedMotion();
  const [tooltip, setTooltip] = useState<{ show: boolean; text: string; x: number; y: number; icon: 'zap' | 'bot' | null }>({
    show: false,
    text: '',
    x: 0,
    y: 0,
    icon: null
  });

  const zapHovered = tooltip.show && tooltip.icon === 'zap';
  const botHovered = tooltip.show && tooltip.icon === 'bot';

  const zapMotion = {
    initial: { scale: 1 },
    animate: isExiting && !zapHovered && !prefersReducedMotion ? { scale: 1.2 } : { scale: 1 },
    transition: isExiting && !zapHovered && !prefersReducedMotion
      ? { duration: 1.2, repeat: Infinity, repeatType: "mirror" as const, ease: "easeInOut" as const }
      : { duration: prefersReducedMotion ? 0 : 0.25, ease: "easeOut" as const },
  };

  const botMotion = {
    initial: { rotate: 0, y: 0 },
    animate: isExiting && !botHovered && !prefersReducedMotion ? { rotate: 8, y: -10 } : { rotate: 0, y: 0 },
    transition: isExiting && !botHovered && !prefersReducedMotion
      ? { duration: 1.1, repeat: Infinity, repeatType: "mirror" as const, ease: "easeInOut" as const }
      : { duration: prefersReducedMotion ? 0 : 0.25, ease: "easeOut" as const },
  };

  const iconAccentClass =
    "text-brand fill-none transition-[filter,color] duration-300 group-hover:drop-shadow-[0_0_6px_rgb(var(--brand-rgb)/0.28)]";

  // Stepped sizes for lg:hidden — allow wrap on phone to avoid clip; nowrap from md+
  // Slight negative tracking for display Inter Black; more open than tracking-tighter
  const titleClass =
    "font-black leading-[0.9] tracking-[-0.02em] md:tracking-[-0.025em] [font-kerning:normal] text-shiny will-change-transform px-4 " +
    "whitespace-normal break-words md:whitespace-nowrap " +
    "text-[clamp(2.9rem,12vw,4rem)] sm:text-[clamp(3.25rem,9.5vw,4.5rem)] md:text-[clamp(3.85rem,7.5vw,5.75rem)]";

  // Gutters around Zap/Bot — tablet needs more air than phone/desktop
  const iconGutterClass =
    "inline-flex relative cursor-pointer group align-middle items-center justify-center " +
    "min-w-12 min-h-12 touch-manipulation " +
    "mx-[0.08em] md:mx-[0.16em]";

  // Desktop social floats — scale with viewport (fixed 48px looks tiny on ultrawide)
  const desktopSocialHit =
    "inline-flex items-center justify-center size-[clamp(2.75rem,3.2vw,4rem)]";

  const githubUrl = personal.socialLinks.find((s) => s.platform === "GitHub")?.url;
  const linkedinUrl = personal.socialLinks.find((s) => s.platform === "LinkedIn")?.url;
  const instagramUrl = personal.socialLinks.find((s) => s.platform === "Instagram")?.url;

  const introCopy = `Hi, I'm ${personal.name}. I design AI products people actually want to use every day.`;
  const collabCopy = "Open to all forms of collaboration, regardless of location and language.";

  const showHoverTooltip = (
    e: React.MouseEvent,
    text: string,
    icon: 'zap' | 'bot'
  ) => {
    if (!canUseHoverTooltip()) return;
    setTooltip({ show: true, text, icon, x: e.clientX, y: e.clientY });
  };

  // Social floats via Framer — md+ absolute only (phone row is static)
  const githubFloat = {
    initial: prefersReducedMotion ? { opacity: isExiting ? 1 : 0 } : { opacity: 0, y: 40 },
    animate: isExiting
      ? (prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 1, y: [0, -10, 0] })
      : { opacity: 0, y: prefersReducedMotion ? 0 : 40 },
    transition: isExiting
      ? prefersReducedMotion
        ? { duration: 0.01 }
        : {
            opacity: { duration: 1, ease: [0.16, 1, 0.3, 1] as const },
            y: { duration: 2, repeat: Infinity, ease: "easeInOut" as const },
          }
      : { duration: 0.3 },
  };
  const linkedinFloat = {
    initial: prefersReducedMotion ? { opacity: isExiting ? 1 : 0 } : { opacity: 0, y: 40 },
    animate: isExiting
      ? (prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 1, y: [0, 10, 0] })
      : { opacity: 0, y: prefersReducedMotion ? 0 : 40 },
    transition: isExiting
      ? prefersReducedMotion
        ? { duration: 0.01 }
        : {
            opacity: { duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] as const },
            y: { duration: 2.5, delay: 0.1, repeat: Infinity, ease: "easeInOut" as const },
          }
      : { duration: 0.3 },
  };
  const instagramFloat = {
    initial: prefersReducedMotion ? { opacity: isExiting ? 1 : 0, x: 0 } : { opacity: 0, y: 40, x: 0 },
    animate: isExiting
      ? (prefersReducedMotion ? { opacity: 1, y: 0, x: 0 } : { opacity: 1, y: 0, x: [0, 10, 0] })
      : { opacity: 0, y: prefersReducedMotion ? 0 : 40, x: 0 },
    transition: isExiting
      ? prefersReducedMotion
        ? { duration: 0.01 }
        : {
            opacity: { duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] as const },
            y: { duration: 1, delay: 0.2 },
            x: { duration: 3, delay: 0.2, repeat: Infinity, ease: "easeInOut" as const },
          }
      : { duration: 0.3 },
  };

  const enterTransition = (delay = 0) =>
    prefersReducedMotion
      ? { duration: 0.01 }
      : { duration: 1.2, delay, ease: [0.16, 1, 0.3, 1] as const };

  return (
    <motion.div
      initial={{ opacity: prefersReducedMotion ? 1 : 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: prefersReducedMotion ? 0 : 0.4 }}
      className="relative min-h-screen w-full flex flex-col bg-background text-foreground overflow-x-hidden overflow-y-visible md:overflow-hidden lg:h-[100dvh] lg:max-h-[100dvh] lg:min-h-0 selection:bg-primary/20"
    >
      {/* Background Pattern */}
      <div className="w-full absolute h-full z-0 bg-[radial-gradient(circle,_#888_0.5px,_transparent_0.5px)] dark:bg-[radial-gradient(circle,_#444_0.5px,_transparent_0.5px)] opacity-20 [background-size:24px_24px]" />

      {/* Spotlight Effect - Dramatic lighting */}
      <div className="absolute inset-0 z-[5] pointer-events-none overflow-hidden">
        <Spotlight
          duration={10}
          xOffset={120}
          translateY={-300}
          gradientFirst="radial-gradient(68.54% 68.72% at 55.02% 31.46%, hsla(0, 0%, 100%, .15) 0, hsla(0, 0%, 100%, .05) 50%, transparent 80%)"
          gradientSecond="radial-gradient(50% 50% at 50% 50%, hsla(0, 0%, 100%, .1) 0, hsla(0, 0%, 100%, .02) 80%, transparent 100%)"
          gradientThird="radial-gradient(50% 50% at 50% 50%, hsla(0, 0%, 100%, .08) 0, hsla(0, 0%, 100%, 0) 80%, transparent 100%)"
        />
      </div>

      {/*
        Desktop pad lives on the TITLE STACK (not main+justify-center).
        Padding on main with justify-center recenters the block, so only
        absolute -top icons looked like they moved into the nav gap.
      */}
      {/* Tighter max-width on lg+ so ultrawide “pushes in” instead of edge-to-edge */}
      <main className="relative flex-1 flex flex-col justify-center min-h-0 pt-28 sm:pt-32 md:pt-40 lg:pt-0 pb-6 md:pb-10 lg:pb-0 z-10 w-full mx-auto max-w-[105rem]">
        {/* gap-4 frozen on phone + desktop; tablet-only open stack */}
        <div className="flex relative gap-4 md:gap-9 lg:gap-3 xl:gap-4 px-5 sm:px-6 lg:px-10 xl:px-14 md:items-center w-full flex-col justify-center lg:flex-1 lg:min-h-0 lg:justify-center lg:pt-[clamp(7rem,16vh,12rem)] lg:pb-[clamp(5rem,12vh,10rem)]">

          {/* Follow-Cursor Tooltip */}
          <AnimatePresence>
            {tooltip.show && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ type: "spring", damping: 20, stiffness: 300 }}
                className="fixed pointer-events-none z-[100] flex items-center gap-2 bg-zinc-900 dark:bg-white text-white dark:text-black font-bold px-4 py-2.5 rounded-full shadow-2xl"
                style={{
                  left: tooltip.x,
                  top: tooltip.y,
                  x: "-50%",
                  y: "-150%", // offset slightly above the cursor
                }}
              >
                {tooltip.icon === 'zap' && <ExternalLink className="w-4 h-4" />}
                {tooltip.icon === 'bot' && <MessageSquare className="w-4 h-4" />}
                <span className="text-sm">{tooltip.text}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Intro — phone only · same content width as collab (padding on wrapper, not inside max-w) */}
          <div className="md:hidden w-full px-4">
            <motion.p
              initial={prefersReducedMotion ? false : { opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.8, delay: 0.2 }}
              className="text-xs text-muted-foreground text-start leading-relaxed w-full max-w-[16rem] font-medium uppercase tracking-widest"
            >
              {introCopy}
            </motion.p>
          </div>

          {/* Line 1: AI × DESIGN — tablet intro absolute; desktop intro in-flow (frozen) */}
          <div className="md:flex gap-8 items-start lg:items-center relative">
            {/* Tablet width reserve */}
            <div
              className="hidden md:block lg:hidden shrink-0 w-[200px] md:w-[240px]"
              aria-hidden="true"
            />
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="hidden md:block lg:hidden absolute bottom-0 left-0 w-[200px] md:w-[240px] text-sm text-muted-foreground text-right leading-relaxed font-medium uppercase tracking-[0.2em]"
            >
              {introCopy}
            </motion.p>
            {/* Desktop intro — in-flow, frozen */}
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="hidden lg:block text-xs text-muted-foreground text-right leading-relaxed max-w-[220px] font-medium uppercase tracking-[0.2em]"
            >
              {introCopy}
            </motion.p>
            {/* lg:pt reserves float room inside the frame so icons don't sit in nav pad */}
            <div className="relative lg:pt-14">
              {/* Floating GitHub — tablet: above frame; desktop: inside reserved pt */}
              <motion.div
                {...githubFloat}
                className="hidden md:block absolute -top-16 lg:top-0 right-0 md:right-2 text-primary/60 hover:text-primary z-20 will-change-transform"
              >
                <a
                  href={githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center size-12 lg:size-[clamp(2.75rem,3.2vw,4rem)]"
                >
                  <Github className="w-8 h-8 lg:w-[65%] lg:h-[65%]" />
                </a>
              </motion.div>
              {/* Mobile / tablet: solid shiny title */}
              <motion.h1
                initial={prefersReducedMotion ? false : { opacity: 0, y: 30 }}
                animate={isExiting || prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={enterTransition(0)}
                className={`lg:hidden ${titleClass}`}
              >
                AI × DESIGN
              </motion.h1>
              {/* Desktop: block warp title — frozen */}
              <motion.h1
                initial={prefersReducedMotion ? false : { opacity: 0, y: 30 }}
                animate={isExiting || prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={enterTransition(0)}
                className="hidden lg:block leading-[0.85] tracking-[-0.025em] [font-kerning:normal] will-change-transform px-4"
              >
                <BlockWarpTitle text="AI × DESIGN" />
              </motion.h1>
            </div>
          </div>

          {/* Line 2: PRODUCT */}
          <div className="md:flex gap-8 items-start lg:items-center relative">
            <div className="relative">
              {/* Floating LinkedIn / Instagram — md+ (frozen offsets) */}
              <motion.div
                {...linkedinFloat}
                className="hidden md:block absolute -top-2 -left-14 md:-left-16 lg:-left-6 xl:-left-10 2xl:-left-14 text-primary/60 hover:text-primary z-20 will-change-transform"
              >
                <a
                  href={linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center size-12 lg:size-[clamp(2.75rem,3.2vw,4rem)]"
                >
                  <Linkedin className="w-8 h-8 lg:w-[65%] lg:h-[65%]" />
                </a>
              </motion.div>
              {/* Desktop Instagram — frozen on PRODUCT row */}
              <motion.div
                {...instagramFloat}
                className="hidden lg:block absolute -bottom-12 right-20 xl:right-12 2xl:right-8 text-primary/60 hover:text-primary z-20 will-change-transform"
              >
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={desktopSocialHit}
                >
                  <Instagram className="w-[65%] h-[65%]" />
                </a>
              </motion.div>
              {/* Mobile / tablet: solid shiny title */}
              <motion.h1
                initial={prefersReducedMotion ? false : { opacity: 0, y: 30 }}
                animate={isExiting || prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={enterTransition(0.1)}
                className={`lg:hidden inline-flex flex-wrap items-center ${titleClass}`}
              >
                <span>PROD</span>
                <motion.div
                  {...zapMotion}
                  role="button"
                  tabIndex={0}
                  aria-label="Go to Projects"
                  className={iconGutterClass}
                  onClick={() => { window.location.href = '/projects'; }}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); window.location.href = '/projects'; } }}
                  onMouseEnter={(e) => showHoverTooltip(e, "Go to Projects", 'zap')}
                  onMouseMove={(e) => {
                    if (!tooltip.show || !canUseHoverTooltip()) return;
                    setTooltip(prev => ({ ...prev, x: e.clientX, y: e.clientY }));
                  }}
                  onMouseLeave={() => setTooltip(prev => ({ ...prev, show: false }))}
                >
                  <Zap className={`w-[0.8em] h-[0.8em] ${iconAccentClass}`} strokeWidth={2} />
                </motion.div>
                <span>UCT</span>
              </motion.h1>
              {/* Desktop: block warp title — frozen */}
              <motion.h1
                initial={prefersReducedMotion ? false : { opacity: 0, y: 30 }}
                animate={isExiting || prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={enterTransition(0.1)}
                className="hidden lg:flex items-center leading-[0.85] tracking-[-0.025em] [font-kerning:normal] will-change-transform px-4"
              >
                <BlockWarpTitle text="PROD" />
                <motion.div
                  {...zapMotion}
                  className="inline-flex mx-[0.08em] relative cursor-pointer group align-middle text-[clamp(3rem,min(10vw,12vh),13rem)]"
                  onClick={() => { window.location.href = '/projects'; }}
                  onMouseEnter={(e) => showHoverTooltip(e, "Go to Projects", 'zap')}
                  onMouseMove={(e) => {
                    if (!tooltip.show || !canUseHoverTooltip()) return;
                    setTooltip(prev => ({ ...prev, x: e.clientX, y: e.clientY }));
                  }}
                  onMouseLeave={() => setTooltip(prev => ({ ...prev, show: false }))}
                >
                  <Zap className={`w-[0.8em] h-[0.8em] ${iconAccentClass}`} strokeWidth={1.5} />
                </motion.div>
                <BlockWarpTitle text="UCT" />
              </motion.h1>
            </div>
          </div>

          {/* Line 3: ENGINEER — tablet collab absolute; desktop collab in-flow (frozen) */}
          <div className="md:flex gap-8 items-start lg:items-center relative">
            <div className="relative">
              {/* Tablet Instagram — top aligned with ENGINEER; horizontal unchanged */}
              <motion.div
                {...instagramFloat}
                className="hidden md:block lg:hidden absolute top-16 right-10 text-primary/60 hover:text-primary z-20 will-change-transform"
              >
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center size-12"
                >
                  <Instagram size={32} />
                </a>
              </motion.div>
            {/* Mobile / tablet: solid shiny title */}
            <motion.h1
              initial={prefersReducedMotion ? false : { opacity: 0, y: 30 }}
              animate={isExiting || prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={enterTransition(0.2)}
              className={`lg:hidden inline-flex flex-wrap items-center ${titleClass}`}
            >
              <span>EN</span>
              <motion.div
                {...botMotion}
                role="button"
                tabIndex={0}
                aria-label="Talk to my Assistant"
                className={iconGutterClass}
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  window.dispatchEvent(new CustomEvent('portfolio:toggle-chatbot', {
                    detail: { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
                  }));
                }}
                onKeyDown={(e) => {
                  if (e.key !== 'Enter' && e.key !== ' ') return;
                  e.preventDefault();
                  const rect = e.currentTarget.getBoundingClientRect();
                  window.dispatchEvent(new CustomEvent('portfolio:toggle-chatbot', {
                    detail: { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
                  }));
                }}
                onMouseEnter={(e) => showHoverTooltip(e, "Talk to my Assistant", 'bot')}
                onMouseMove={(e) => {
                  if (!tooltip.show || !canUseHoverTooltip()) return;
                  setTooltip(prev => ({ ...prev, x: e.clientX, y: e.clientY }));
                }}
                onMouseLeave={() => setTooltip(prev => ({ ...prev, show: false }))}
              >
                <Bot className={`w-[0.85em] h-[0.85em] ${iconAccentClass}`} />
              </motion.div>
              <span>GINEER</span>
            </motion.h1>
            {/* Desktop: block warp title — frozen */}
            <motion.h1
              initial={prefersReducedMotion ? false : { opacity: 0, y: 30 }}
              animate={isExiting || prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={enterTransition(0.2)}
              className="hidden lg:flex items-center leading-[0.85] tracking-[-0.025em] [font-kerning:normal] will-change-transform px-4"
            >
              <BlockWarpTitle text="EN" />
              <motion.div
                {...botMotion}
                className="inline-flex mx-[0.08em] relative cursor-pointer group align-middle text-[clamp(3rem,min(10vw,12vh),13rem)]"
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  window.dispatchEvent(new CustomEvent('portfolio:toggle-chatbot', {
                    detail: { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
                  }));
                }}
                onMouseEnter={(e) => showHoverTooltip(e, "Talk to my Assistant", 'bot')}
                onMouseMove={(e) => {
                  if (!tooltip.show || !canUseHoverTooltip()) return;
                  setTooltip(prev => ({ ...prev, x: e.clientX, y: e.clientY }));
                }}
                onMouseLeave={() => setTooltip(prev => ({ ...prev, show: false }))}
              >
                <Bot className={`w-[0.85em] h-[0.85em] ${iconAccentClass}`} />
              </motion.div>
              <BlockWarpTitle text="GINEER" />
            </motion.h1>
            </div>

            {/* Tablet — width reserve + absolute collab (does not affect desktop stack) */}
            <div
              className="hidden md:block lg:hidden shrink-0 w-[200px] md:w-[240px]"
              aria-hidden="true"
            />
            <motion.p
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="hidden md:block lg:hidden absolute top-0 right-0 w-[200px] md:w-[240px] text-sm text-muted-foreground leading-relaxed font-medium uppercase tracking-widest"
            >
              {collabCopy}
            </motion.p>
            {/* Desktop — in-flow collab (frozen prior spacing) */}
            <motion.p
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="hidden lg:block text-xs text-muted-foreground pt-8 leading-relaxed max-w-[200px] font-medium uppercase tracking-widest"
            >
              {collabCopy}
            </motion.p>
          </div>

          {/* Phone — static socials + collab */}
          <div className="md:hidden flex flex-col gap-6 pt-3 px-4">
            <div className="flex items-center gap-6 text-primary/60">
              {githubUrl && (
                <a
                  href={githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center size-12 touch-manipulation active:text-primary"
                  aria-label="GitHub"
                >
                  <Github size={24} />
                </a>
              )}
              {linkedinUrl && (
                <a
                  href={linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center size-12 touch-manipulation active:text-primary"
                  aria-label="LinkedIn"
                >
                  <Linkedin size={24} />
                </a>
              )}
              {instagramUrl && (
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center size-12 touch-manipulation active:text-primary"
                  aria-label="Instagram"
                >
                  <Instagram size={24} />
                </a>
              )}
            </div>
            <motion.p
              initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.8, delay: 0.4 }}
              className="text-xs text-muted-foreground leading-relaxed w-full max-w-[16rem] font-medium uppercase tracking-widest"
            >
              {collabCopy}
            </motion.p>
          </div>

        </div>

      </main>

      {/* Home-only page footer — phone resume 48px; md+ unchanged expand behavior */}
      <motion.footer
        initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
        animate={isExiting || prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
        transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.9, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 mt-auto w-full shrink-0"
      >
        <div className="max-w-[105rem] mx-auto px-5 sm:px-6 md:px-12 lg:px-16 xl:px-20 2xl:px-24 py-6 sm:py-8 md:py-10 lg:py-4 xl:py-6">
          {/* Phone: stacked · Desktop: single row */}
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:gap-6">
            <div className="flex items-center justify-between md:contents gap-4">
              <p className="text-xs md:text-[10px] font-medium uppercase tracking-[0.22em] text-muted-foreground/70 shrink-0">
                © {new Date().getFullYear()} {personal.name}
              </p>
              <div className="text-xs md:text-[10px] whitespace-nowrap font-bold tracking-[0.3em] text-muted-foreground uppercase">
                NYC — 2026
              </div>
            </div>

            <div className="hidden md:block flex-1 h-px bg-foreground/10" />

            <div className="flex items-center justify-between md:justify-end gap-4 md:gap-6">
              <div className="flex items-center gap-2.5 shrink-0">
                <span className="relative flex size-2">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-brand opacity-40 motion-safe:animate-ping motion-reduce:animate-none" />
                  <span className="relative inline-flex size-2 rounded-full bg-brand" />
                </span>
                <span className="text-xs md:text-[10px] font-bold uppercase tracking-[0.22em] sm:tracking-[0.28em] text-muted-foreground">
                  Open to collaboration
                </span>
              </div>
              <Link href="/resume" className="group flex items-center shrink-0 touch-manipulation">
                {/* Expanded by default on phone/tablet (no hover); collapse + hover-expand on lg+ */}
                <div className="relative flex items-center h-12 w-40 sm:w-44 lg:w-12 lg:group-hover:w-44 rounded-full overflow-hidden transition-all duration-500 ease-[0.23,1,0.32,1] motion-reduce:transition-none bg-brand lg:bg-foreground/10 lg:group-hover:bg-brand">
                  <span className="whitespace-nowrap opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-200 lg:group-hover:delay-150 text-[10px] font-black uppercase tracking-widest text-brand-foreground pl-5 sm:pl-6 pr-12">
                    View Resume
                  </span>
                  <div className="absolute right-0 flex items-center justify-center size-12 text-brand-foreground rotate-45 lg:text-foreground lg:rotate-0 lg:group-hover:text-brand-foreground lg:group-hover:rotate-45 transition-all duration-500 motion-reduce:transition-none motion-reduce:lg:group-hover:rotate-0">
                    <ArrowDownRight className="w-5 h-5" />
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </motion.footer>
    </motion.div>
  );
}
