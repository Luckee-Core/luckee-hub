import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { TerminalSession } from '@/model';

type TerminalSessionsState = Record<string, TerminalSession>;

const initialState: TerminalSessionsState = {};

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
    upsertTerminalSessions: (state, action: PayloadAction<TerminalSession[]>) => {
      for (const session of action.payload) {
        state[session.sessionId] = session;
      }
    },
    removeTerminalSession: (state, action: PayloadAction<string>) => {
      delete state[action.payload];
    },
  },
});

export const TerminalSessionsActions = terminalSessionsSlice.actions;
export const terminalSessionsReducer = terminalSessionsSlice.reducer;
