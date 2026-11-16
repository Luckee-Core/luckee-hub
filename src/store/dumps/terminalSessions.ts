import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { TerminalSession } from '@/model';

type TerminalSessionsState = Record<string, TerminalSession>;

const initialState: TerminalSessionsState = {};

/**
 * Live PTY sessions keyed by session id — a mirror of hub Express's session registry.
 * Single writer: syncTerminalSessionsThunk (ADR 025 G1).
 */
export const terminalSessionsSlice = createSlice({
  name: 'terminalSessions',
  initialState,
  reducers: {
    replaceTerminalSessions: (_state, action: PayloadAction<TerminalSession[]>) => {
      const next: TerminalSessionsState = {};
      for (const session of action.payload) {
        next[session.sessionId] = session;
      }
      return next;
    },
  },
});

export const TerminalSessionsActions = terminalSessionsSlice.actions;
export const terminalSessionsReducer = terminalSessionsSlice.reducer;
