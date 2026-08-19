/**
 * Assembles the system prompt. Composition only: no voice, no facts, no
 * guards. Each of those has its own file.
 */
import { buildPersona } from './persona';
import { buildKnowledge, getSubject } from './knowledge';

/** What is true of this conversation right now. */
export interface SessionFacts {
    /** 1-based index of the visitor message being answered. */
    turn: number;
}

/** Only the fields the prompt renders. Serialized upstream by page-context.ts. */
export interface PromptPageContext {
    type: string;
    title?: string;
    summary: string;
}

export interface PromptInput {
    locale?: string;
    pageContext?: PromptPageContext;
    session: SessionFacts;
}

const LANGUAGES: Record<string, string> = { en: 'English' };

/**
 * Facts that are only true of this exact moment. Without these Marvin answers
 * message fifteen exactly as he answers message one, which is most of what
 * makes a persona feel like a recording.
 */
function buildSessionBlock({ turn }: SessionFacts): string {
    const lines = [`- This is message ${turn} of this conversation.`];

    if (turn === 1) {
        lines.push('- They have just opened the panel. You have said nothing yet.');
    } else if (turn >= 8) {
        lines.push('- They have been talking to you for a while now. You may notice that.');
    }

    return `## Right now
${lines.join('\n')}

Use these when they make the reply better. Never recite them back.`;
}

function buildPageBlock(pageContext?: PromptPageContext): string {
    if (!pageContext?.summary) return '';

    return `## Current page context
The visitor is looking at this page. When they say "this project", "this page",
or "here", answer from the facts below first. Do not invent anything beyond
this section and Portfolio Data.
- Page type: ${pageContext.type}${pageContext.title ? `\n- Title: ${pageContext.title}` : ''}

${pageContext.summary}`;
}

export function buildSystemPrompt({ locale, pageContext, session }: PromptInput): string {
    const { fullName, firstName, pronouns } = getSubject();
    const language = LANGUAGES[locale ?? 'en'] ?? 'English';

    return [
        buildPersona({ fullName, firstName, pronouns, language }),
        buildKnowledge(),
        buildPageBlock(pageContext),
        buildSessionBlock(session),
    ]
        .filter(Boolean)
        .join('\n\n');
}
