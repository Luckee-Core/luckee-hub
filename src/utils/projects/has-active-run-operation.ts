type RunOperationState = {
  runningJobs: Record<string, string>;
  projectsBuilder: {
    runInFlightProjectId: string | null;
  };
};

/**
 * True when any project launch (API call or job poll) is in progress.
 */
export const hasActiveRunOperation = (state: RunOperationState): boolean => {
  return (
    state.projectsBuilder.runInFlightProjectId !== null ||
    Object.keys(state.runningJobs).length > 0
  );
};

/**
 * True when the given project is the one currently launching or polling.
 */
export const isProjectRunActive = (state: RunOperationState, projectId: string): boolean => {
  return (
    state.projectsBuilder.runInFlightProjectId === projectId || projectId in state.runningJobs
  );
};
