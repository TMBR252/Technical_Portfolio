/**
 * Single breakpoint source of truth - aligned with Tailwind v3 defaults.
 * Layout bands follow #marvin-page-shell (frame = window). Device viewport
 * helpers stay available for chrome outside the shell (e.g. ChatBot).
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

/** Real browser viewport - use for ChatBot overlay / device chrome. */
export function getViewportWidth() {
    if (typeof window === "undefined") return BREAKPOINTS.LG;
    return window.innerWidth;
}

/** Real browser viewport height. */
export function getViewportHeight() {
    if (typeof window === "undefined") return 900;
    return window.innerHeight;
}

/**
 * Layout "window" width: Marvin page shell when present, else viewport.
 * Matches Tailwind md:/lg: which query @container marvin-shell.
 */
export function getFrameWidth() {
    if (typeof window === "undefined") return BREAKPOINTS.LG;
    const shell = document.getElementById("marvin-page-shell");
    if (shell instanceof HTMLElement) {
        const w = shell.clientWidth;
        if (w > 0) return w;
    }
    return window.innerWidth;
}

/** Layout "window" height: shell when present, else viewport. */
export function getFrameHeight() {
    if (typeof window === "undefined") return 900;
    const shell = document.getElementById("marvin-page-shell");
    if (shell instanceof HTMLElement) {
        const h = shell.clientHeight;
        if (h > 0) return h;
    }
    return window.innerHeight;
}

export function isBelowMd(width: number = getFrameWidth()) {
    return width < BREAKPOINTS.MD;
}

export function isMdUp(width: number = getFrameWidth()) {
    return width >= BREAKPOINTS.MD;
}

export function isLgUp(width: number = getFrameWidth()) {
    return width >= BREAKPOINTS.LG;
}

export function getViewportBand(width: number = getFrameWidth()) {
    if (width < BREAKPOINTS.MD) return "mobile" as const;
    if (width < BREAKPOINTS.LG) return "tablet" as const;
    return "desktop" as const;
}
