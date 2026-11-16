const inFlight = new Map<string, Promise<200 | 400 | 500>>();

/**
 * Runs `task` once per key at a time; concurrent callers share the in-flight promise (ADR 025 G6).
 */
export const runExclusive = (
  key: string,
  task: () => Promise<200 | 400 | 500>,
): Promise<200 | 400 | 500> => {
  const existing = inFlight.get(key);
  if (existing) {
    return existing;
  }
  const running = task().finally(() => {
    inFlight.delete(key);
  });
  inFlight.set(key, running);
  return running;
};
