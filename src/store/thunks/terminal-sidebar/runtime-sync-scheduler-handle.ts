/**
 * Holds the running scheduler's cleanup. Non-null means the app is initialized (keeps init idempotent
 * under React StrictMode double effects and HMR).
 */
export const runtimeSyncSchedulerHandle: { stop: (() => void) | null } = { stop: null };
