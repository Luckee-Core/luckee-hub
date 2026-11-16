/** Terminal list is considered stale after three missed 5s polls. */
export const TERMINAL_SYNC_STALE_AFTER_MS = 15_000;

/** Consecutive failed syncs before the sidebar shows a connection warning. */
export const TERMINAL_SYNC_FAILURE_WARNING_THRESHOLD = 3;

/** Hook statuses that mean the project is not set up locally (hidden from the Running list). */
export const NOT_SET_UP_HOOK_STATUSES = ['catalog', 'disabled', 'missing'] as const;
