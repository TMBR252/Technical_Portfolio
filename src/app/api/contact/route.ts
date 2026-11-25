import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

/** Hard caps so a single submission cannot bloat the mailbox or the process. */
const MAX_LENGTHS = {
    name: 100,
    email: 254,
    subject: 150,
    message: 5_000,
} as const;

/** Reject oversized payloads before parsing them. */
const MAX_BODY_BYTES = 32_000;

/** Per-IP throttle (in-memory, so it is per server instance). */
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;
const RATE_LIMIT_MAX = 5;

const EMAIL_PATTERN = /^[^\s@<>,;:"'\\]+@[^\s@<>,;:"'\\.]+(\.[^\s@<>,;:"'\\.]+)+$/;

const GENERIC_ERROR = 'Failed to send message. Please try again later.';

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function getClientIp(req: Request): string {
    return (
        req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
        req.headers.get('x-real-ip')?.trim() ||
        'unknown'
    );
}

function checkRateLimit(ip: string): boolean {
    const now = Date.now();

    // Drop expired buckets so the map cannot grow without bound.
    for (const [key, entry] of rateLimitMap) {
        if (now >= entry.resetAt) rateLimitMap.delete(key);
    }

    const entry = rateLimitMap.get(ip);
    if (!entry) {
        rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
        return true;
    }
    if (entry.count >= RATE_LIMIT_MAX) return false;

    entry.count += 1;
    return true;
}

function escapeHtml(str: string) {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

/** Strip CR/LF and other control characters that could break out of a mail header. */
function headerSafe(str: string) {
    // eslint-disable-next-line no-control-regex
    return str.replace(/[\r\n\u0000-\u001f\u007f]/g, ' ').trim();
}

type Field = keyof typeof MAX_LENGTHS;

function readField(value: unknown, field: Field, required: boolean): string | null {
    if (typeof value !== 'string') return required ? null : '';
    const trimmed = value.trim();
    if (!trimmed) return required ? null : '';
    if (trimmed.length > MAX_LENGTHS[field]) return null;
    return trimmed;
}

export async function POST(req: Request) {
    const ip = getClientIp(req);
    if (!checkRateLimit(ip)) {
        return NextResponse.json(
            { error: 'Too many messages sent. Please try again later.' },
            { status: 429, headers: { 'Retry-After': String(RATE_LIMIT_WINDOW_MS / 1000) } }
        );
    }

    const declaredLength = Number(req.headers.get('content-length') ?? '');
    if (Number.isFinite(declaredLength) && declaredLength > MAX_BODY_BYTES) {
        return NextResponse.json({ error: 'Message is too large.' }, { status: 413 });
    }

    let body: unknown;
    try {
        const raw = await req.text();
        if (Buffer.byteLength(raw) > MAX_BODY_BYTES) {
            return NextResponse.json({ error: 'Message is too large.' }, { status: 413 });
        }
        body = JSON.parse(raw);
    } catch {
        return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
    }

    if (typeof body !== 'object' || body === null) {
        return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
    }

    const payload = body as Record<string, unknown>;
    const name = readField(payload.name, 'name', true);
    const email = readField(payload.email, 'email', true);
    const subject = readField(payload.subject, 'subject', false);
    const message = readField(payload.message, 'message', true);

    if (name === null || email === null || message === null || subject === null) {
        return NextResponse.json({ error: 'Missing or invalid fields' }, { status: 400 });
    }
    if (!EMAIL_PATTERN.test(email)) {
        return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    const mailUser = process.env.EMAIL_USER;
    const mailPass = process.env.EMAIL_APP_PASSWORD;
    if (!mailUser || !mailPass) {
        console.error('Contact form: EMAIL_USER / EMAIL_APP_PASSWORD are not configured.');
        return NextResponse.json({ error: GENERIC_ERROR }, { status: 503 });
    }

    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safeSubject = headerSafe(subject || 'No Subject');
    const safeMessage = escapeHtml(message).replace(/\r?\n/g, '<br />');

    try {
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: { user: mailUser, pass: mailPass },
        });

        await transporter.sendMail({
            from: mailUser,
            to: mailUser, // Where you want to receive the messages
            subject: `New Message: ${safeSubject}`,
            text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
            html: `
                <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
                    <h3 style="color: #333;">You have a new message from your website!</h3>
                    <p><strong>Name: </strong> ${safeName}</p>
                    <p><strong>Email: </strong> ${safeEmail}</p>
                    <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
                    <p><strong>Message:</strong></p>
                    <p style="white-space: pre-wrap; color: #555;">${safeMessage}</p>
                </div>
            `,
        });

        return NextResponse.json({ message: 'Email sent successfully!' }, { status: 200 });
    } catch (error) {
        console.error('Error sending email:', error);
        return NextResponse.json({ error: GENERIC_ERROR }, { status: 500 });
    }
}
