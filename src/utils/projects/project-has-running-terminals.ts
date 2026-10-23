import type { TerminalSession } from '@/model';

type TerminalSessionsDump = Record<string, TerminalSession>;

/**
 * True when hub Express reports at least one terminal session for the project.
 */
export const projectHasRunningTerminals = (
  terminalSessions: TerminalSessionsDump,
  projectId: string,
): boolean =>
  Object.values(terminalSessions).some((session) => session.projectId === projectId);
