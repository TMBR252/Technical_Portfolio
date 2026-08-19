import { NextRequest, NextResponse } from 'next/server';
import { pickRefusal } from '@/lib/marvin/persona';
import { buildSystemPrompt } from '@/lib/marvin/prompt';
import { checkRateLimit, guardRequest } from '@/lib/marvin/guard';
import { MAX_HISTORY_LENGTH, MAX_HISTORY_MESSAGES } from '@/lib/marvin/limits';
import {
    AllProvidersFailedError,
    OLLAMA_BASE_URL,
    generateReply,
    providerStatus,
    type ChatMessage,
} from '@/lib/marvin/providers';
import { getSubject } from '@/lib/marvin/knowledge';

interface ChatRequest {
    messages: ChatMessage[];
    locale?: string;
    image?: string;
    pageContext?: { type: string; slug?: string; title?: string; summary: string };
}

function getClientIp(req: NextRequest): string {
    return (
        req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
        req.headers.get('x-real-ip') ||
        'unknown'
    );
}

function refuse(reason: string, status = 200) {
    const reply = pickRefusal(reason);
    return NextResponse.json({ reply, provider: 'static' }, { status });
}

export async function POST(req: NextRequest) {
    try {
        if (!checkRateLimit(getClientIp(req))) {
            return refuse('rate', 429);
        }

        const body: ChatRequest = await req.json();

        if (!Array.isArray(body?.messages) || body.messages.length === 0) {
            return NextResponse.json(
                { error: 'Invalid request: messages array is required.' },
                { status: 400 }
            );
        }
        for (const msg of body.messages) {
            if (!msg.role || typeof msg.content !== 'string' || !msg.content) {
                return NextResponse.json({ error: 'Invalid message format.' }, { status: 400 });
            }
            if (!['user', 'assistant'].includes(msg.role)) {
                return NextResponse.json({ error: 'Invalid message role.' }, { status: 400 });
            }
        }

        const lastUserIndex = body.messages.map((m) => m.role).lastIndexOf('user');
        if (lastUserIndex === -1) {
            return NextResponse.json({ error: 'No user message found.' }, { status: 400 });
        }

        const guarded = guardRequest(body.messages[lastUserIndex].content, body.image);
        if (!guarded.ok) return refuse(guarded.reason);

        const { firstName } = getSubject();
        const userText =
            guarded.text ||
            `The visitor attached an image. Describe briefly what you see, then relate it to ${firstName} or this portfolio only if it is genuinely relevant.`;

        const messages: ChatMessage[] = body.messages
            .slice(-MAX_HISTORY_MESSAGES)
            .map((m, i, arr) => {
                const absoluteIndex = body.messages.length - arr.length + i;
                if (absoluteIndex === lastUserIndex) {
                    return {
                        role: m.role,
                        content: userText,
                        ...(guarded.image ? { images: [guarded.image] } : {}),
                    };
                }
                return { role: m.role, content: m.content.slice(0, MAX_HISTORY_LENGTH) };
            });

        const systemPrompt = buildSystemPrompt({
            locale: body.locale,
            pageContext: body.pageContext,
            session: { turn: body.messages.filter((m) => m.role === 'user').length },
        });

        try {
            const { reply, provider } = await generateReply(messages, systemPrompt, {
                needsVision: !!guarded.image,
            });
            return NextResponse.json({ reply, provider });
        } catch (error) {
            if (error instanceof AllProvidersFailedError) {
                console.error('[Chat] All providers failed:', error.failures);
                return NextResponse.json(
                    {
                        reply: pickRefusal(guarded.image ? 'vision' : 'offline'),
                        error: 'AI providers are currently unavailable.',
                    },
                    { status: 503 }
                );
            }
            throw error;
        }
    } catch (error) {
        console.error('[Chat] Unexpected error:', error);
        return NextResponse.json(
            { error: 'Internal server error.', reply: pickRefusal('offline') },
            { status: 500 }
        );
    }
}

export async function GET() {
    let ollama = false;
    try {
        const res = await fetch(`${OLLAMA_BASE_URL}/api/tags`, { cache: 'no-store' });
        ollama = res.ok;
    } catch {
        ollama = false;
    }

    return NextResponse.json({
        status: 'ok',
        bot: 'Marvin',
        providers: { ollama, ...providerStatus() },
    });
}
