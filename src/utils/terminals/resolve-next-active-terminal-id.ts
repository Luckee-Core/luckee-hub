/**
 * Keeps the active tab when it is still live, otherwise picks the first live tab (or null).
 */
export const resolveNextActiveTerminalId = (
  activeTerminalSessionId: string | null,
  orderedIds: string[],
): string | null => {
  if (activeTerminalSessionId && orderedIds.includes(activeTerminalSessionId)) {
    return activeTerminalSessionId;
  }
  return orderedIds[0] ?? null;
};
