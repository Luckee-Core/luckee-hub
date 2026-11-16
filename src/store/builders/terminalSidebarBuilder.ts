import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export const DEFAULT_TERMINAL_SIDEBAR_WIDTH = 480;

type TerminalSidebarActionKind = 'start' | 'stop';

type TerminalSidebarBuilderState = {
  isOpen: boolean;
  width: number;
  isRunningSectionCollapsed: boolean;
  activeTerminalSessionId: string | null;
  /** Bumped to make every session panel reopen its WebSocket for the same session id. */
  connectionEpoch: number;
  terminalLastSyncedAt: string | null;
  terminalLastSyncError: string | null;
  terminalConsecutiveFailures: number;
  runtimeLastSyncedAt: string | null;
  runtimeLastSyncError: string | null;
  actionProjectId: string | null;
  actionKind: TerminalSidebarActionKind | null;
  actionMessage: string | null;
  actionError: string | null;
};

const initialState: TerminalSidebarBuilderState = {
  isOpen: true,
  width: DEFAULT_TERMINAL_SIDEBAR_WIDTH,
  isRunningSectionCollapsed: false,
  activeTerminalSessionId: null,
  connectionEpoch: 0,
  terminalLastSyncedAt: null,
  terminalLastSyncError: null,
  terminalConsecutiveFailures: 0,
  runtimeLastSyncedAt: null,
  runtimeLastSyncError: null,
  actionProjectId: null,
  actionKind: null,
  actionMessage: null,
  actionError: null,
};

/**
 * Terminal sidebar UI state (primitives only). See ADR 025.
 */
const terminalSidebarBuilderSlice = createSlice({
  name: 'terminalSidebarBuilder',
  initialState,
  reducers: {
    setOpen: (state, action: PayloadAction<boolean>) => {
      state.isOpen = action.payload;
    },
    setWidth: (state, action: PayloadAction<number>) => {
      state.width = action.payload;
    },
    setRunningSectionCollapsed: (state, action: PayloadAction<boolean>) => {
      state.isRunningSectionCollapsed = action.payload;
    },
    setActiveTerminalSessionId: (state, action: PayloadAction<string | null>) => {
      state.activeTerminalSessionId = action.payload;
    },
    bumpConnectionEpoch: (state) => {
      state.connectionEpoch += 1;
    },
    setTerminalLastSyncedAt: (state, action: PayloadAction<string | null>) => {
      state.terminalLastSyncedAt = action.payload;
    },
    setTerminalLastSyncError: (state, action: PayloadAction<string | null>) => {
      state.terminalLastSyncError = action.payload;
    },
    setTerminalConsecutiveFailures: (state, action: PayloadAction<number>) => {
      state.terminalConsecutiveFailures = action.payload;
    },
    setRuntimeLastSyncedAt: (state, action: PayloadAction<string | null>) => {
      state.runtimeLastSyncedAt = action.payload;
    },
    setRuntimeLastSyncError: (state, action: PayloadAction<string | null>) => {
      state.runtimeLastSyncError = action.payload;
    },
    setActionProjectId: (state, action: PayloadAction<string | null>) => {
      state.actionProjectId = action.payload;
    },
    setActionKind: (state, action: PayloadAction<TerminalSidebarActionKind | null>) => {
      state.actionKind = action.payload;
    },
    setActionMessage: (state, action: PayloadAction<string | null>) => {
      state.actionMessage = action.payload;
    },
    setActionError: (state, action: PayloadAction<string | null>) => {
      state.actionError = action.payload;
    },
  },
});

export const TerminalSidebarBuilderActions = terminalSidebarBuilderSlice.actions;
export const terminalSidebarBuilderReducer = terminalSidebarBuilderSlice.reducer;
