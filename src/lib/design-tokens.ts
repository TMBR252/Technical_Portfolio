/**
 * JS mirror of src/styles/tokens.css — use when CSS variables aren't enough
 * (canvas, Three.js, inline styles, tests).
 *
 * Prefer Tailwind utilities (text-brand, font-display, …) in React components.
 */

export const brand = {
    hex: '#d1ff4d',
    deepHex: '#7ba82e',
    rgb: '209 255 77',
    foregroundRgb: '17 17 17',
    deepRgb: '123 168 46',
    /** rgba() helper for non-Tailwind contexts */
    alpha: (a: number) => `rgb(209 255 77 / ${a})`,
} as const;

export const fonts = {
    /** CSS variable names set by next/font in layout.tsx — use these directly */
    interVar: '--font-inter',
    jetbrainsVar: '--font-jetbrains',
    playfairVar: '--font-playfair',
    signatureVar: '--font-signature',
    /** Tailwind / CSS usage */
    sans: 'var(--font-inter), system-ui, sans-serif',
    mono: 'var(--font-jetbrains), ui-monospace, monospace',
    display: "var(--font-playfair), Georgia, 'Times New Roman', serif",
    hand: "var(--font-signature), 'Segoe Script', cursive",
} as const;

export const typeRoles = {
    displayXl: 'text-display-xl',
    display: 'text-display',
    title: 'text-title',
    bodyLg: 'text-body-lg',
} as const;
