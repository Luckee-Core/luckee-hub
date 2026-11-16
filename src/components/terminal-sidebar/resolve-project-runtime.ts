import type { HubProject, TerminalSession } from '@/model';

export type ProjectTier = 'express' | 'web' | 'storage-express' | 'scheduler-worker';

export type TierTone = 'ok' | 'pending' | 'off';

export type ProjectTierStatus = {
  tier: ProjectTier;
  tone: TierTone;
  portUp: boolean;
  sessionId: string | null;
};

type ResolveProjectRuntimeInput = {
  project: HubProject;
  sessions: TerminalSession[];
  hasExpressRepo: boolean;
  hasWebRepo: boolean;
  isRunActive: boolean;
};

const isApiUp = (project: HubProject): boolean =>
  project.hookStatus === 'api_running' || project.hookStatus === 'ready';

const isWebUp = (project: HubProject): boolean =>
  project.hookStatus === 'web_running' || project.hookStatus === 'ready';

/**
 * Derives each tier's status from the live port probe (hookStatus / storageRunning), open terminals, and
 * whether a run job is in flight. No stored flags (ADR 025 §5).
 */
export const resolveProjectRuntime = ({
  project,
  sessions,
  hasExpressRepo,
  hasWebRepo,
  isRunActive,
}: ResolveProjectRuntimeInput): { tiers: ProjectTierStatus[]; isRunning: boolean } => {
  const sessionFor = (role: ProjectTier): string | null =>
    sessions.find((session) => session.role === role)?.sessionId ?? null;

  const build = (tier: ProjectTier, portUp: boolean, runCanStart: boolean): ProjectTierStatus => {
    const sessionId = sessionFor(tier);
    const tone: TierTone =
      portUp || sessionId ? 'ok' : runCanStart && isRunActive ? 'pending' : 'off';
    return { tier, tone, portUp, sessionId };
  };

  const tiers: ProjectTierStatus[] = [];
  if (hasExpressRepo) {
    tiers.push(build('express', isApiUp(project), true));
  }
  if (hasWebRepo) {
    tiers.push(build('web', isWebUp(project), true));
  }
  if (project.storageExpressSupported) {
    tiers.push(build('storage-express', Boolean(project.storageRunning), false));
  }
  if (sessionFor('scheduler-worker')) {
    tiers.push(build('scheduler-worker', false, false));
  }

  const isRunning =
    sessions.length > 0 || isApiUp(project) || isWebUp(project) || Boolean(project.storageRunning);
  return { tiers, isRunning };
};
