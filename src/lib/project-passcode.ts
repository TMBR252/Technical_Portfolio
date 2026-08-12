import { createHmac, timingSafeEqual } from 'crypto';

export const PROJECT_PASSCODE_COOKIE = 'case_study_unlock';

/** Slugs that require the shared case-study passcode. */
export const PASSCODE_GATED_SLUGS = new Set(['primer-platform', 'ube-platform']);

export function isPasscodeGatedSlug(slug: string): boolean {
    return PASSCODE_GATED_SLUGS.has(slug);
}

export function getCaseStudyPasscode(): string {
    const fromEnv = process.env.PROJECT_CASE_STUDY_PASSCODE?.trim();
    if (fromEnv) return fromEnv;
    // Local fallback so the gate works before .env.local is set.
    if (process.env.NODE_ENV !== 'production') return 'preview';
    return '';
}

export function createUnlockToken(): string {
    const passcode = getCaseStudyPasscode();
    if (!passcode) return '';
    return createHmac('sha256', passcode).update('case-study-unlock-v1').digest('hex');
}

export function isValidUnlockToken(token: string | undefined): boolean {
    if (!token) return false;
    const expected = createUnlockToken();
    if (!expected || token.length !== expected.length) return false;
    try {
        return timingSafeEqual(Buffer.from(token), Buffer.from(expected));
    } catch {
        return false;
    }
}

export function verifyCaseStudyPasscode(input: string): boolean {
    const expected = getCaseStudyPasscode();
    if (!expected) return false;
    const a = Buffer.from(input.trim());
    const b = Buffer.from(expected);
    if (a.length !== b.length) return false;
    try {
        return timingSafeEqual(a, b);
    } catch {
        return false;
    }
}
