type SetupOperationState = {
  runningJobs: Record<string, string>;
  projectsBuilder: {
    setupModalOpen: boolean;
    setupModalProjectId: string | null;
    setupModalStatus: 'running' | 'completed' | 'failed' | null;
    runInFlightProjectId: string | null;
  };
};

const isSetupJobId = (jobId: string): boolean => jobId.startsWith('setup-');

/**
 * True when any project setup (job poll) is in progress.
 */
export const hasActiveSetupOperation = (state: SetupOperationState): boolean => {
  if (state.projectsBuilder.setupModalOpen && state.projectsBuilder.setupModalStatus === 'running') {
    return true;
  }

  return Object.values(state.runningJobs).some(
    (jobId) => typeof jobId === 'string' && isSetupJobId(jobId),
  );
};

/**
 * True when the given project is currently setting up.
 */
export const isProjectSetupActive = (state: SetupOperationState, projectId: string): boolean => {
  if (
    state.projectsBuilder.setupModalOpen &&
    state.projectsBuilder.setupModalProjectId === projectId &&
    state.projectsBuilder.setupModalStatus === 'running'
  ) {
    return true;
  }

  const jobId = state.runningJobs[projectId];
  return typeof jobId === 'string' && isSetupJobId(jobId);
};
