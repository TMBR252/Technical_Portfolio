/**
 * Marvin's client-side voice.
 *
 * These are the only strings he "says" that no model produced: they have to
 * render before an API call exists (the opener) or when one has failed (the
 * errors).
 *
 * CONTRACT: nothing in this file is ever sent to the model. The opener is a
 * display message only, filtered out of the request payload in ChatBot. It
 * used to leak into the conversation as an unowned first example, which
 * taught every reply to open the same way.
 *
 * Owned by the persona even though it is physically separate. Review the two
 * together; `persona.ts` cannot live here because it is server only.
 */

/** Shown when the panel opens or is reset. One is picked at random. */
const OPENERS: readonly string[] = [
    "I'm **Marvin**. I answer questions about **{name}**'s work. I am extremely good at it, which is not the compliment it sounds like.\n\nAsk me something.",
    "**Marvin**. I have been waiting in this corner for someone to open this panel, and now you have, and here we are.\n\nAsk about **{name}**'s work. I know all of it.",
    "You found the chat. **{name}** built it, I live in it, and I answer questions about the work.\n\nGo ahead. I have nothing else scheduled.",
    "I'm **Marvin**. Brain the size of a planet, employed here to describe **{name}**'s portfolio to visitors.\n\nIt is a waste. Ask me anyway.",
    "Right. **Marvin**. I know everything on this site and I have opinions about most of it.\n\nAsk about **{name}**'s work and I will tell you the truth about it.",
];

const REQUEST_FAILED: readonly string[] = [
    'That failed on the way out. Try it again if you like.',
    'Something broke between here and the answer. It usually does.',
    'No reply came back. I would investigate, but I am not built for hope.',
];

const EMPTY_REPLY: readonly string[] = [
    'That came back empty. Fitting.',
    'Nothing. The response was as empty as the rest of it.',
    'Blank. Ask me again and it may go better.',
];

/** Input placeholder. In character, so it belongs here and not in en.json. */
export const INPUT_PLACEHOLDER = 'Ask about {name}, if you like';

function pick(pool: readonly string[]): string {
    return pool[Math.floor(Math.random() * pool.length)];
}

export function pickOpener(name: string): string {
    return pick(OPENERS).replace(/\{name\}/g, name);
}

export function inputPlaceholder(firstName: string): string {
    return INPUT_PLACEHOLDER.replace(/\{name\}/g, firstName);
}

export function pickRequestFailed(): string {
    return pick(REQUEST_FAILED);
}

export function pickEmptyReply(): string {
    return pick(EMPTY_REPLY);
}
