import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

type LoadStatus = 'idle' | 'loading' | 'loaded' | 'error';

type LocalDatabaseOperation = 'probe' | 'setup' | 'step';

type ProjectsBuilderState = {
  listLoadStatus: LoadStatus;
  listError: string | null;
  activeTerminalSessionId: string | null;
  terminalDockOpen: boolean;
  terminalSessionOrder: string[];
  localDatabaseLoadStatus: LoadStatus;
  localDatabaseOperation: LocalDatabaseOperation | null;
  activeLocalDatabaseStepId: string | null;
  localDatabaseError: string | null;
  localDatabaseSetupMessage: string | null;
  activeLocalDatabaseProjectId: string | null;
};

const initialState: ProjectsBuilderState = {
  listLoadStatus: 'idle',
  listError: null,
  activeTerminalSessionId: null,
  terminalDockOpen: false,
  terminalSessionOrder: [],
  localDatabaseLoadStatus: 'idle',
  localDatabaseOperation: null,
  activeLocalDatabaseStepId: null,
  localDatabaseError: null,
  localDatabaseSetupMessage: null,
  activeLocalDatabaseProjectId: null,
};

export const projectsBuilderSlice = createSlice({
  name: 'projectsBuilder',
  initialState,
  reducers: {
    setListLoadStatus: (state, action: PayloadAction<LoadStatus>) => {
      state.listLoadStatus = action.payload;
    },
    setListError: (state, action: PayloadAction<string | null>) => {
      state.listError = action.payload;
    },
    setActiveTerminalSessionId: (state, action: PayloadAction<string | null>) => {
      state.activeTerminalSessionId = action.payload;
    },
    setTerminalDockOpen: (state, action: PayloadAction<boolean>) => {
      state.terminalDockOpen = action.payload;
    },
    setTerminalSessionOrder: (state, action: PayloadAction<string[]>) => {
      state.terminalSessionOrder = action.payload;
    },
    setLocalDatabaseLoadStatus: (state, action: PayloadAction<LoadStatus>) => {
      state.localDatabaseLoadStatus = action.payload;
    },
    setLocalDatabaseOperation: (state, action: PayloadAction<LocalDatabaseOperation | null>) => {
      state.localDatabaseOperation = action.payload;
    },
    setActiveLocalDatabaseStepId: (state, action: PayloadAction<string | null>) => {
      state.activeLocalDatabaseStepId = action.payload;
    },
    setLocalDatabaseError: (state, action: PayloadAction<string | null>) => {
      state.localDatabaseError = action.payload;
    },
    setLocalDatabaseSetupMessage: (state, action: PayloadAction<string | null>) => {
      state.localDatabaseSetupMessage = action.payload;
    },
    setActiveLocalDatabaseProjectId: (state, action: PayloadAction<string | null>) => {
      state.activeLocalDatabaseProjectId = action.payload;
    },
    resetLocalDatabaseState: (state) => {
      state.localDatabaseLoadStatus = 'idle';
      state.localDatabaseOperation = null;
      state.activeLocalDatabaseStepId = null;
      state.localDatabaseError = null;
      state.localDatabaseSetupMessage = null;
      state.activeLocalDatabaseProjectId = null;
    },
  },
});

export const ProjectsBuilderActions = projectsBuilderSlice.actions;
export const projectsBuilderReducer = projectsBuilderSlice.reducer;
