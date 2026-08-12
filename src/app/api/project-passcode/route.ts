import { NextResponse } from 'next/server';
import {
    PROJECT_PASSCODE_COOKIE,
    createUnlockToken,
    isPasscodeGatedSlug,
    verifyCaseStudyPasscode,
} from '@/lib/project-passcode';

export async function POST(request: Request) {
    let body: { passcode?: string; slug?: string };
    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ ok: false, error: 'Invalid request.' }, { status: 400 });
    }

    const slug = body.slug?.trim() ?? '';
    const passcode = body.passcode ?? '';

    if (!isPasscodeGatedSlug(slug)) {
        return NextResponse.json({ ok: false, error: 'This project is not passcode-gated.' }, { status: 400 });
    }

    if (!verifyCaseStudyPasscode(passcode)) {
        return NextResponse.json({ ok: false, error: 'Incorrect passcode.' }, { status: 401 });
    }

    const token = createUnlockToken();
    if (!token) {
        return NextResponse.json(
            { ok: false, error: 'Passcode is not configured on the server.' },
            { status: 503 }
        );
    }

    const response = NextResponse.json({ ok: true });
    response.cookies.set({
        name: PROJECT_PASSCODE_COOKIE,
        value: token,
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 60 * 60 * 24 * 30,
    });
    return response;
}
