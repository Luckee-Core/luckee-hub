import type { HubProject, TerminalSession } from '@/model';

const ROLE_ORDER: Record<TerminalSession['role'], number> = {
  express: 0,
  web: 1,
  'storage-express': 2,
  'scheduler-worker': 3,
};

/**
 * Tab order for live terminals: by project name, then express → web → storage → scheduler worker.
 */
export const orderTerminalSessions = (
  terminalSessions: Record<string, TerminalSession>,
  projects: Record<string, HubProject>,
): TerminalSession[] =>
  Object.values(terminalSessions).sort((a, b) => {
    const nameA = projects[a.projectId]?.name ?? a.projectId;
    const nameB = projects[b.projectId]?.name ?? b.projectId;
    const byName = nameA.localeCompare(nameB);
    if (byName !== 0) {
      return byName;
    }
    const byRole = ROLE_ORDER[a.role] - ROLE_ORDER[b.role];
    return byRole !== 0 ? byRole : a.label.localeCompare(b.label);
  });
