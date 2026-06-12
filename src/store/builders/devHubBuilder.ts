import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { TerminalSession } from '@/model';

type LoadStatus = 'idle' | 'loading' | 'loaded' | 'error';

type DevHubBuilderState = {
  listLoadStatus: LoadStatus;
  listError: string | null;
  runningJobIds: Record<string, string>;
  terminalSessions: TerminalSession[];
  activeTerminalSessionId: string | null;
  terminalDockOpen: boolean;
};

const initialState: DevHubBuilderState = {
  listLoadStatus: 'idle',
  listError: null,
  runningJobIds: {},
  terminalSessions: [],
  activeTerminalSessionId: null,
  terminalDockOpen: false,
};

export const devHubBuilderSlice = createSlice({
  name: 'devHubBuilder',
  initialState,
  reducers: {
    setListLoadStatus: (state, action: PayloadAction<LoadStatus>) => {
      state.listLoadStatus = action.payload;
    },
    setListError: (state, action: PayloadAction<string | null>) => {
      state.listError = action.payload;
    },
    setRunningJob: (
      state,
      action: PayloadAction<{ studioId: string; jobId: string | null }>,
    ) => {
      const { studioId, jobId } = action.payload;
      if (jobId) {
        state.runningJobIds[studioId] = jobId;
      } else {
        delete state.runningJobIds[studioId];
      }
    },
    setTerminalSessions: (state, action: PayloadAction<TerminalSession[]>) => {
      state.terminalSessions = action.payload;
      if (
        action.payload.length > 0 &&
        !action.payload.some((s) => s.sessionId === state.activeTerminalSessionId)
      ) {
        state.activeTerminalSessionId = action.payload[0].sessionId;
      }
    },
    addTerminalSessions: (state, action: PayloadAction<TerminalSession[]>) => {
      const existing = new Set(state.terminalSessions.map((s) => s.sessionId));
      for (const session of action.payload) {
        if (!existing.has(session.sessionId)) {
          state.terminalSessions.push(session);
        }
      }
      if (!state.activeTerminalSessionId && state.terminalSessions.length > 0) {
        state.activeTerminalSessionId = state.terminalSessions[0].sessionId;
      }
    },
    setActiveTerminalSessionId: (state, action: PayloadAction<string | null>) => {
      state.activeTerminalSessionId = action.payload;
    },
    removeTerminalSession: (state, action: PayloadAction<string>) => {
      const sessionId = action.payload;
      const index = state.terminalSessions.findIndex((s) => s.sessionId === sessionId);
      if (index === -1) {
        return;
      }
      state.terminalSessions.splice(index, 1);
      if (state.activeTerminalSessionId === sessionId) {
        const next =
          state.terminalSessions[index] ?? state.terminalSessions[index - 1] ?? null;
        state.activeTerminalSessionId = next?.sessionId ?? null;
      }
      if (state.terminalSessions.length === 0) {
        state.terminalDockOpen = false;
      }
    },
    setTerminalDockOpen: (state, action: PayloadAction<boolean>) => {
      state.terminalDockOpen = action.payload;
    },
  },
});

export const DevHubBuilderActions = devHubBuilderSlice.actions;
export const devHubBuilderReducer = devHubBuilderSlice.reducer;
