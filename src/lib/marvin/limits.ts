/**
 * Shared numeric limits. Split out so the client can read the input cap
 * without importing the server-side guard (and its rate-limit state) into
 * the browser bundle.
 */

/** Longest visitor message accepted. The old 200 cut questions off mid-sentence. */
export const MAX_INPUT_LENGTH = 600;

/** Longest prior turn kept when replaying history to the model. */
export const MAX_HISTORY_LENGTH = MAX_INPUT_LENGTH * 2;

/** Prior turns replayed to the model. */
export const MAX_HISTORY_MESSAGES = 12;
