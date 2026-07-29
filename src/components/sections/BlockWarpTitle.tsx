'use client';

import React, { useEffect, useRef } from 'react';
import { useTheme } from 'next-themes';
import { BREAKPOINTS } from '@/lib/breakpoints';

/**
 * Physics pattern adapted from:
 * - https://github.com/hazadus/ts-particle-text (square particles + spring ease)
 * - https://github.com/Axshatt/ParticleText (repel force + friction + always spring home)
 * - Frank's Laboratory particle text tutorials (force × density falloff)
 *
 * Every frame: mouse repulsion on CURRENT position + spring back to origin.
 * That equilibrium is what keeps blocks "in the system" while warping.
 */

type Particle = {
  ox: number;
  oy: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  /** How strongly this block reacts to the mouse (Frank Lab "density") */
  density: number;
  friction: number;
  ease: number;
};

interface BlockWarpTitleProps {
  text: string;
  className?: string;
  fontSize?: number;
  interactive?: boolean;
}

function resolveFontSize(explicit?: number) {
  if (explicit) return explicit;
  if (typeof window === 'undefined') return 176;
  const w = window.innerWidth;
  const h = window.innerHeight;
  const aspect = w / Math.max(1, h);
  // Wide: slight width dampen only — keep titles large; height still caps overflow
  const widthFactor = aspect > 1.85 ? 0.09 : aspect > 1.55 ? 0.1 : 0.11;
  const byWidth = w * widthFactor;
  const chromeFactor = aspect > 1.85 ? 0.5 : aspect > 1.55 ? 0.48 : 0.46;
  const chrome = Math.min(h * 0.56, Math.max(280, h * chromeFactor));
  const byHeight = Math.max(48, (h - chrome) / 2.95);
  const maxPx = aspect > 1.85 ? 12 * 16 : 13 * 16;
  return Math.min(maxPx, Math.max(3 * 16, Math.min(byWidth, byHeight)));
}

function resolveCanvasFont() {
  if (typeof window === 'undefined') {
    return 'Arial Black, Arial, sans-serif';
  }

  const bodyFamily = getComputedStyle(document.body).fontFamily || 'Arial, sans-serif';
  const varRaw = getComputedStyle(document.documentElement)
    .getPropertyValue('--font-inter')
    .trim()
    .replace(/['"]/g, '');

  return varRaw ? `${varRaw}, ${bodyFamily}` : bodyFamily;
}

function applyCanvasLetterSpacing(
  ctx: CanvasRenderingContext2D,
  letterSpacingEm: number,
  fontSize: number,
) {
  // Whole-string fillText + letterSpacing keeps OpenType kern pairs.
  // Per-glyph draw (old path) nullifies kerning.
  if ('letterSpacing' in ctx) {
    (ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing =
      `${letterSpacingEm * fontSize}px`;
  }
}

function buildParticles(
  text: string,
  fontSize: number,
  fontFamily: string,
  letterSpacingEm = -0.025,
): { particles: Particle[]; width: number; height: number } {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const probe = document.createElement('canvas');
  const probeCtx = probe.getContext('2d');
  if (!probeCtx) return { particles: [], width: 0, height: 0 };

  const font = `900 ${fontSize}px ${fontFamily}`;
  probeCtx.font = font;
  applyCanvasLetterSpacing(probeCtx, letterSpacingEm, fontSize);
  const measured = probeCtx.measureText(text);
  const supportsLetterSpacing = 'letterSpacing' in probeCtx;
  const letterSpacing = fontSize * letterSpacingEm;
  const textWidth = Math.max(
    fontSize,
    supportsLetterSpacing
      ? measured.width
      : measured.width + letterSpacing * Math.max(0, text.length - 1),
  );
  const width = Math.ceil(textWidth + fontSize * 0.08);
  const height = Math.ceil(fontSize * 1.05);

  const off = document.createElement('canvas');
  off.width = Math.max(1, Math.floor(width * dpr));
  off.height = Math.max(1, Math.floor(height * dpr));
  const ctx = off.getContext('2d', { willReadFrequently: true });
  if (!ctx) return { particles: [], width, height };

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = '#ffffff';
  ctx.font = font;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  applyCanvasLetterSpacing(ctx, letterSpacingEm, fontSize);

  const baseline = fontSize * 0.82;
  const xStart = 2;
  if (supportsLetterSpacing) {
    ctx.fillText(text, xStart, baseline);
  } else {
    let xCursor = xStart;
    for (const char of text) {
      ctx.fillText(char, xCursor, baseline);
      xCursor += probeCtx.measureText(char).width + letterSpacing;
    }
  }

  const stepCss = Math.max(3, Math.round(fontSize / 36));
  const step = Math.max(2, Math.round(stepCss * dpr));
  const block = Math.max(2.5, stepCss - 0.75);
  const { data } = ctx.getImageData(0, 0, off.width, off.height);
  const particles: Particle[] = [];

  for (let py = 0; py < off.height; py += step) {
    for (let px = 0; px < off.width; px += step) {
      const alpha = data[(py * off.width + px) * 4 + 3];
      if (alpha < 90) continue;

      const x = px / dpr;
      const y = py / dpr;

      particles.push({
        ox: x,
        oy: y,
        x,
        y,
        vx: 0,
        vy: 0,
        size: block,
        // Vary reaction so the warp rim feels organic, not rigid
        density: Math.random() * 18 + 8,
        friction: Math.random() * 0.35 + 0.55,
        ease: Math.random() * 0.08 + 0.06,
      });
    }
  }

  return { particles, width, height };
}

export function BlockWarpTitle({
  text,
  className = '',
  fontSize: fontSizeProp,
  interactive = true,
}: BlockWarpTitleProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf = 0;
    let disposed = false;
    let active = false;
    let particles: Particle[] = [];
    let width = 0; // full canvas (includes pad)
    let height = 0;
    let contentW = 0;
    let contentH = 0;
    let pad = 0;
    let dpr = 1;
    let fontSize = resolveFontSize(fontSizeProp);

    const mouse = { x: -9999, y: -9999, active: false };
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const desktopQuery = window.matchMedia(`(min-width: ${BREAKPOINTS.LG}px)`);
    const fontFamily = resolveCanvasFont();

    const isDark =
      resolvedTheme === 'dark' ||
      (resolvedTheme !== 'light' &&
        typeof document !== 'undefined' &&
        document.documentElement.classList.contains('dark'));
    // All cubes white in dark mode; near-black in light so they stay visible
    const blockColor = isDark ? '#ffffff' : '#171717';

    // Mouse influence radius (hazadus / Axshatt style)
    const mouseRadius = () => Math.max(80, Math.min(160, fontSize * 0.5));
    // Extra draw room so warp doesn't clip at the canvas edge
    const overflowPad = () => Math.ceil(mouseRadius() * 0.85);

    const roundRect = (x: number, y: number, size: number, radius: number) => {
      const r = Math.min(radius, size * 0.5);
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.arcTo(x + size, y, x + size, y + size, r);
      ctx.arcTo(x + size, y + size, x, y + size, r);
      ctx.arcTo(x, y + size, x, y, r);
      ctx.arcTo(x, y, x + size, y, r);
      ctx.closePath();
      ctx.fill();
    };

    const requestTick = () => {
      if (!active || disposed) return;
      if (!raf) raf = requestAnimationFrame(draw);
    };

    const teardownLoop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
      particles = [];
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      canvas.width = 1;
      canvas.height = 1;
      canvas.style.width = '0px';
      canvas.style.height = '0px';
      canvas.style.margin = '0';
    };

    const layout = () => {
      if (!desktopQuery.matches) {
        active = false;
        teardownLoop();
        return;
      }

      fontSize = resolveFontSize(fontSizeProp);
      const built = buildParticles(text, fontSize, fontFamily);
      const result =
        built.particles.length > 20
          ? built
          : buildParticles(text, fontSize, 'Arial Black, Arial, Helvetica, sans-serif');

      contentW = result.width;
      contentH = result.height;
      pad = overflowPad();
      width = contentW + pad * 2;
      height = contentH + pad * 2;
      // Shift homes into the padded canvas so letters stay visually aligned
      particles = result.particles.map((p) => ({
        ...p,
        ox: p.ox + pad,
        oy: p.oy + pad,
        x: p.x + pad,
        y: p.y + pad,
      }));
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      if (contentW < 8 || contentH < 8 || particles.length === 0) {
        active = false;
        teardownLoop();
        return;
      }

      active = true;
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      // Negative margin keeps layout size = letter box; overflow paints outside
      canvas.style.margin = `${-pad}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      requestTick();
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!active || !interactive || reduceMotion) return;

      // About mega-menu / nav chrome sit above the hero — don't warp cubes under them
      const overChrome =
        e.target instanceof Element &&
        !!e.target.closest('.marvin-fixed-chrome, [data-block-warp-ignore]');
      if (overChrome) {
        mouse.active = false;
        mouse.x = -9999;
        mouse.y = -9999;
        requestTick();
        return;
      }

      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      const r = mouseRadius();
      mouse.active =
        mouse.x > -r && mouse.x < width + r && mouse.y > -r && mouse.y < height + r;
      requestTick();
    };

    const onPointerLeaveWindow = () => {
      mouse.active = false;
      mouse.x = -9999;
      mouse.y = -9999;
      requestTick();
    };

    /**
     * hazadus/ts-particle-text update():
     *   force = -radius / distance
     *   vx/vy from angle when in range
     *   x += (vx *= friction) + (originX - x) * ease   ← spring EVERY frame
     *
     * Frank Lab falloff:
     *   force = (radius - distance) / radius
     *   push *= density
     */
    const draw = () => {
      raf = 0;
      if (disposed || !active) return;

      ctx.clearRect(0, 0, width, height);

      const radius = mouseRadius();
      let moving = false;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Distance from mouse to CURRENT position (not home) — critical for interaction
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const distance = Math.hypot(dx, dy) || 0.0001;

        if (mouse.active && interactive && !reduceMotion && distance < radius) {
          const forceDirectionX = dx / distance;
          const forceDirectionY = dy / distance;
          // Soft circular falloff (Frank Lab)
          const force = (radius - distance) / radius;
          const push = force * p.density * 0.55;
          // Repel away from cursor
          p.vx -= forceDirectionX * push;
          p.vy -= forceDirectionY * push;
        }

        // Spring home + friction — ALWAYS (keeps blocks in the letter system)
        p.vx *= p.friction;
        p.vy *= p.friction;
        p.x += p.vx + (p.ox - p.x) * p.ease;
        p.y += p.vy + (p.oy - p.y) * p.ease;

        if (
          Math.abs(p.vx) > 0.02 ||
          Math.abs(p.vy) > 0.02 ||
          Math.abs(p.ox - p.x) > 0.05 ||
          Math.abs(p.oy - p.y) > 0.05
        ) {
          moving = true;
        }

        ctx.fillStyle = blockColor;
        roundRect(p.x, p.y, p.size, Math.max(0.75, p.size * 0.12));
      }

      if (moving || mouse.active) {
        raf = requestAnimationFrame(draw);
      }
    };

    const boot = async () => {
      try {
        await document.fonts.ready;
        await document.fonts.load(`900 ${resolveFontSize(fontSizeProp)}px ${fontFamily}`);
      } catch {
        /* ignore */
      }
      if (disposed) return;
      layout();
      requestAnimationFrame(() => {
        if (!disposed) layout();
      });
    };

    boot();

    window.addEventListener('resize', layout);
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('blur', onPointerLeaveWindow);
    desktopQuery.addEventListener('change', layout);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', layout);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('blur', onPointerLeaveWindow);
      desktopQuery.removeEventListener('change', layout);
    };
  }, [text, fontSizeProp, interactive, resolvedTheme]);

  return (
    <span className={`relative inline-block leading-none align-middle overflow-visible ${className}`}>
      <canvas
        ref={canvasRef}
        aria-label={text}
        role="img"
        className="block pointer-events-none select-none overflow-visible"
      />
    </span>
  );
}
