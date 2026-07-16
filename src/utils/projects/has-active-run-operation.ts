type RunOperationState = {
  runningJobs: Record<string, string>;
  projectsBuilder: {
    runInFlightProjectId: string | null;
  };
};

const isSetupJobId = (jobId: string): boolean => jobId.startsWith('setup-');

/**
 * True when any project launch (API call or job poll) is in progress.
 */
export const hasActiveRunOperation = (state: RunOperationState): boolean => {
  if (state.projectsBuilder.runInFlightProjectId !== null) {
    return true;
  }

  return Object.values(state.runningJobs).some(
    (jobId) => typeof jobId === 'string' && !isSetupJobId(jobId),
  );
};

/**
 * True when the given project is the one currently launching or polling.
 */
export const isProjectRunActive = (state: RunOperationState, projectId: string): boolean => {
  if (state.projectsBuilder.runInFlightProjectId === projectId) {
    return true;
  }

  const jobId = state.runningJobs[projectId];
  return typeof jobId === 'string' && !isSetupJobId(jobId);
};
