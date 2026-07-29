/**
 * Single breakpoint source of truth — aligned with Tailwind v3 defaults.
 * @see https://v3.tailwindcss.com/docs/breakpoints
 */
export const BREAKPOINTS = {
    SM: 640,
    MD: 768,
    LG: 1024,
    XL: 1280,
    XXL: 1536,
} as const;

export type BreakpointKey = keyof typeof BREAKPOINTS;

export function isBelowMd(width: number = typeof window !== "undefined" ? window.innerWidth : BREAKPOINTS.LG) {
    return width < BREAKPOINTS.MD;
}

export function isMdUp(width: number = typeof window !== "undefined" ? window.innerWidth : BREAKPOINTS.LG) {
    return width >= BREAKPOINTS.MD;
}

export function isLgUp(width: number = typeof window !== "undefined" ? window.innerWidth : BREAKPOINTS.LG) {
    return width >= BREAKPOINTS.LG;
}

export function getViewportBand(width: number) {
    if (width < BREAKPOINTS.MD) return "mobile" as const;
    if (width < BREAKPOINTS.LG) return "tablet" as const;
    return "desktop" as const;
}
