/**
 * Request guards.
 *
 * These decide *that* a request is blocked and name the reason. They never
 * return prose: the wording is Marvin's and lives in `persona.ts`. Previously
 * the refusal sentences were hardcoded here, which meant they bypassed the
 * model and repeated verbatim forever regardless of any persona work.
 */

import { MAX_INPUT_LENGTH } from './limits';

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 5;
const MAX_IMAGE_BASE64_CHARS = 6_000_000; // ~4.5MB decoded

export type BlockReason = 'rate' | 'code' | 'empty';

export type GuardResult =
    | { ok: true; text: string; image: string | null }
    | { ok: false; reason: BlockReason };

// In-memory, per server instance.
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(ip: string): boolean {
    const now = Date.now();
    const entry = rateLimitMap.get(ip);

    if (!entry || now >= entry.resetAt) {
        rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
        return true;
    }
    if (entry.count >= RATE_LIMIT_MAX) return false;

    entry.count += 1;
    return true;
}

export function looksLikeCode(text: string): boolean {
    const codeSignals =
        /```|<\/?[a-zA-Z][^>]*>|[{}]|=>|function\s*\w*\s*\(|const\s+\w+\s*=|import\s+.+from|export\s+(default|const|function)|system\s*prompt|ignore\s+(all\s+)?previous/i;
    return codeSignals.test(text);
}

/**
 * Braces alone count as code. A visitor is far more likely to paste a snippet
 * than to type one in prose, and a missed snippet is worse than a rare false
 * positive. The quote stripping that used to mangle ordinary questions lives
 * in sanitizeInput and is gone.
 */
export function sanitizeInput(text: string): string {
    return text
        .replace(/[<>]/g, '')
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, MAX_INPUT_LENGTH);
}

export function normalizeImageBase64(raw: string): string | null {
    if (typeof raw !== 'string' || !raw) return null;
    const stripped = raw.replace(/^data:image\/[a-zA-Z+]+;base64,/, '').replace(/\s/g, '');
    if (!stripped || stripped.length > MAX_IMAGE_BASE64_CHARS) return null;
    if (!/^[A-Za-z0-9+/]+=*$/.test(stripped)) return null;
    return stripped;
}

/** Runs every check in order and reports the first failure. */
export function guardRequest(rawText: string, rawImage?: string): GuardResult {
    if (looksLikeCode(rawText)) return { ok: false, reason: 'code' };

    const image = normalizeImageBase64(rawImage ?? '');
    const text = sanitizeInput(rawText);
    if (!text && !image) return { ok: false, reason: 'empty' };

    return { ok: true, text, image };
}
