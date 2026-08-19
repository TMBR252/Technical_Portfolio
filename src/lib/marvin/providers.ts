/**
 * Model transport. Four adapters behind one ordered fallback chain.
 *
 * Knows nothing about Marvin. Sampling is supplied by the caller because at
 * these temperatures it is a property of the character, not of the transport.
 */
import { SAMPLING } from './persona';

export interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
    images?: string[];
}

export interface ProviderResult {
    reply: string;
    provider: string;
}

const OLLAMA_BASE_URL = (process.env.OLLAMA_BASE_URL || 'http://127.0.0.1:11434').replace(/\/$/, '');
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'gemma4:31b';
const OLLAMA_TIMEOUT_MS = Number(process.env.OLLAMA_TIMEOUT_MS) || 12_000;

export { OLLAMA_BASE_URL, OLLAMA_MODEL };

interface Adapter {
    name: string;
    /** Whether this provider is configured at all. */
    available: () => boolean;
    /** Whether it can handle an image request. */
    vision: boolean;
    call: (messages: ChatMessage[], systemPrompt: string) => Promise<string>;
}

async function callOllama(messages: ChatMessage[], systemPrompt: string): Promise<string> {
    const hasCloudFallback = !!(
        process.env.OPENAI_API_KEY ||
        process.env.GROQ_API_KEY ||
        process.env.GEMINI_API_KEY
    );
    // Short timeout only when we can fall back. Ollama-only setups running a
    // large local model need to be allowed to finish.
    const signal = hasCloudFallback ? AbortSignal.timeout(OLLAMA_TIMEOUT_MS) : undefined;

    const response = await fetch(`${OLLAMA_BASE_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        ...(signal ? { signal } : {}),
        body: JSON.stringify({
            model: OLLAMA_MODEL,
            stream: false,
            // Thinking models otherwise spend the whole budget in `thinking`.
            think: false,
            messages: [
                { role: 'system', content: systemPrompt },
                ...messages.map((m) =>
                    m.images?.length
                        ? { role: m.role, content: m.content, images: m.images }
                        : { role: m.role, content: m.content }
                ),
            ],
            options: {
                temperature: SAMPLING.temperature,
                top_p: SAMPLING.topP,
                num_predict: SAMPLING.maxTokens,
            },
        }),
    });

    if (!response.ok) {
        throw new Error(`Ollama API error ${response.status}: ${await response.text()}`);
    }

    const data = await response.json();
    const content =
        (typeof data?.message?.content === 'string' && data.message.content.trim()) ||
        (typeof data?.message?.thinking === 'string' && data.message.thinking.trim()) ||
        '';
    if (!content) throw new Error('Empty response from Ollama');
    return content;
}

async function callOpenAI(messages: ChatMessage[], systemPrompt: string): Promise<string> {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) throw new Error('OPENAI_API_KEY not configured');

    const mapped = messages.map((m) =>
        m.images?.length
            ? {
                  role: m.role,
                  content: [
                      { type: 'text' as const, text: m.content },
                      ...m.images.map((img) => ({
                          type: 'image_url' as const,
                          image_url: { url: `data:image/jpeg;base64,${img}` },
                      })),
                  ],
              }
            : { role: m.role, content: m.content }
    );

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [{ role: 'system', content: systemPrompt }, ...mapped],
            max_tokens: SAMPLING.maxTokens,
            temperature: SAMPLING.temperature,
            top_p: SAMPLING.topP,
        }),
    });

    if (!response.ok) {
        throw new Error(`OpenAI API error ${response.status}: ${await response.text()}`);
    }

    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content;
    if (!content) throw new Error('Empty response from OpenAI');
    return content;
}

async function callGroq(messages: ChatMessage[], systemPrompt: string): Promise<string> {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) throw new Error('GROQ_API_KEY not configured');

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({
            model: 'llama-3.1-8b-instant',
            messages: [
                { role: 'system', content: systemPrompt },
                ...messages.map((m) => ({ role: m.role, content: m.content })),
            ],
            max_tokens: SAMPLING.maxTokens,
            temperature: SAMPLING.temperature,
            top_p: SAMPLING.topP,
        }),
    });

    if (!response.ok) {
        throw new Error(`Groq API error ${response.status}: ${await response.text()}`);
    }

    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content;
    if (!content) throw new Error('Empty response from Groq');
    return content;
}

async function callGemini(messages: ChatMessage[], systemPrompt: string): Promise<string> {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error('GEMINI_API_KEY not configured');

    const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                systemInstruction: { parts: [{ text: systemPrompt }] },
                contents: messages.map((m) => ({
                    role: m.role === 'assistant' ? 'model' : 'user',
                    parts: [{ text: m.content }],
                })),
                generationConfig: {
                    maxOutputTokens: SAMPLING.maxTokens,
                    temperature: SAMPLING.temperature,
                    topP: SAMPLING.topP,
                },
            }),
        }
    );

    if (!response.ok) {
        throw new Error(`Gemini API error ${response.status}: ${await response.text()}`);
    }

    const data = await response.json();
    const content = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!content) throw new Error('Empty response from Gemini');
    return content;
}

/** Tried in order. Local first, so a self-hosted model wins when present. */
const ADAPTERS: Adapter[] = [
    { name: 'ollama', available: () => true, vision: true, call: callOllama },
    { name: 'openai', available: () => !!process.env.OPENAI_API_KEY, vision: true, call: callOpenAI },
    { name: 'groq', available: () => !!process.env.GROQ_API_KEY, vision: false, call: callGroq },
    { name: 'gemini', available: () => !!process.env.GEMINI_API_KEY, vision: false, call: callGemini },
];

export class AllProvidersFailedError extends Error {
    constructor(public readonly failures: Record<string, string>) {
        super('All providers failed');
        this.name = 'AllProvidersFailedError';
    }
}

/**
 * Walks the chain and returns the first success. Replaces four levels of
 * nested try/catch with one loop.
 */
export async function generateReply(
    messages: ChatMessage[],
    systemPrompt: string,
    opts: { needsVision?: boolean } = {}
): Promise<ProviderResult> {
    const failures: Record<string, string> = {};
    const candidates = ADAPTERS.filter(
        (a) => a.available() && (!opts.needsVision || a.vision)
    );

    for (const adapter of candidates) {
        try {
            const reply = await adapter.call(messages, systemPrompt);
            return {
                reply,
                provider: adapter.name === 'ollama' ? `ollama:${OLLAMA_MODEL}` : adapter.name,
            };
        } catch (error) {
            failures[adapter.name] = error instanceof Error ? error.message : String(error);
        }
    }

    throw new AllProvidersFailedError(failures);
}

export function providerStatus() {
    return {
        ollamaModel: OLLAMA_MODEL,
        ollamaBaseUrl: OLLAMA_BASE_URL,
        openai: !!process.env.OPENAI_API_KEY,
        groq: !!process.env.GROQ_API_KEY,
        gemini: !!process.env.GEMINI_API_KEY,
    };
}
