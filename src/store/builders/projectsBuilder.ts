import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { SetupJobStep } from '@/model';

type LoadStatus = 'idle' | 'loading' | 'loaded' | 'error';

type StorageExpressInFlight = {
  projectId: string;
  action: 'start' | 'close';
};

type LocalDatabaseOperation = 'probe' | 'setup' | 'step';

type ProjectsBuilderState = {
  listLoadStatus: LoadStatus;
  listError: string | null;
  localDatabaseLoadStatus: LoadStatus;
  localDatabaseOperation: LocalDatabaseOperation | null;
  activeLocalDatabaseStepId: string | null;
  localDatabaseError: string | null;
  localDatabaseSetupMessage: string | null;
  activeLocalDatabaseProjectId: string | null;
  supabaseLoadStatus: LoadStatus;
  supabaseError: string | null;
  supabaseSaveMessage: string | null;
  supabaseOperation: 'save' | null;
  supabaseUrl: string;
  supabaseServiceKey: string;
  supabaseEditing: boolean;
  runInFlightProjectId: string | null;
  luckeeParent: string | null;
  hubConfigLoadStatus: LoadStatus;
  hubConfigError: string | null;
  luckeeParentModalOpen: boolean;
  luckeeParentPicking: boolean;
  setupModalOpen: boolean;
  setupModalProjectId: string | null;
  setupModalStatus: 'running' | 'completed' | 'failed' | null;
  setupModalMessage: string | null;
  setupModalSteps: SetupJobStep[];
  setupModalLog: string | null;
  setupModalStartedAt: string | null;
  storageExpressInFlight: StorageExpressInFlight | null;
  storageExpressFeedbackProjectId: string | null;
  storageExpressError: string | null;
  storageExpressMessage: string | null;
};

const initialState: ProjectsBuilderState = {
  listLoadStatus: 'idle',
  listError: null,
  localDatabaseLoadStatus: 'idle',
  localDatabaseOperation: null,
  activeLocalDatabaseStepId: null,
  localDatabaseError: null,
  localDatabaseSetupMessage: null,
  activeLocalDatabaseProjectId: null,
  supabaseLoadStatus: 'idle',
  supabaseError: null,
  supabaseSaveMessage: null,
  supabaseOperation: null,
  supabaseUrl: '',
  supabaseServiceKey: '',
  supabaseEditing: false,
  runInFlightProjectId: null,
  luckeeParent: null,
  hubConfigLoadStatus: 'idle',
  hubConfigError: null,
  luckeeParentModalOpen: false,
  luckeeParentPicking: false,
  setupModalOpen: false,
  setupModalProjectId: null,
  setupModalStatus: null,
  setupModalMessage: null,
  setupModalSteps: [],
  setupModalLog: null,
  setupModalStartedAt: null,
  storageExpressInFlight: null,
  storageExpressFeedbackProjectId: null,
  storageExpressError: null,
  storageExpressMessage: null,
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
    setStorageExpressInFlight: (
      state,
      action: PayloadAction<StorageExpressInFlight | null>,
    ) => {
      state.storageExpressInFlight = action.payload;
    },
    setStorageExpressError: (
      state,
      action: PayloadAction<{ projectId: string; error: string | null }>,
    ) => {
      state.storageExpressFeedbackProjectId = action.payload.projectId;
      state.storageExpressError = action.payload.error;
      if (action.payload.error) {
        state.storageExpressMessage = null;
      }
    },
    setStorageExpressMessage: (
      state,
      action: PayloadAction<{ projectId: string; message: string | null }>,
    ) => {
      state.storageExpressFeedbackProjectId = action.payload.projectId;
      state.storageExpressMessage = action.payload.message;
      if (action.payload.message) {
        state.storageExpressError = null;
      }
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
    setSupabaseLoadStatus: (state, action: PayloadAction<LoadStatus>) => {
      state.supabaseLoadStatus = action.payload;
    },
    setSupabaseError: (state, action: PayloadAction<string | null>) => {
      state.supabaseError = action.payload;
    },
    setSupabaseSaveMessage: (state, action: PayloadAction<string | null>) => {
      state.supabaseSaveMessage = action.payload;
    },
    setSupabaseOperation: (state, action: PayloadAction<'save' | null>) => {
      state.supabaseOperation = action.payload;
    },
    setSupabaseUrl: (state, action: PayloadAction<string>) => {
      state.supabaseUrl = action.payload;
    },
    setSupabaseServiceKey: (state, action: PayloadAction<string>) => {
      state.supabaseServiceKey = action.payload;
    },
    setSupabaseEditing: (state, action: PayloadAction<boolean>) => {
      state.supabaseEditing = action.payload;
    },
    setRunInFlightProjectId: (state, action: PayloadAction<string | null>) => {
      state.runInFlightProjectId = action.payload;
    },
    setLuckeeParent: (state, action: PayloadAction<string | null>) => {
      state.luckeeParent = action.payload;
    },
    setHubConfigError: (state, action: PayloadAction<string | null>) => {
      state.hubConfigError = action.payload;
    },
    setHubConfigLoadStatus: (state, action: PayloadAction<LoadStatus>) => {
      state.hubConfigLoadStatus = action.payload;
    },
    setLuckeeParentModalOpen: (state, action: PayloadAction<boolean>) => {
      state.luckeeParentModalOpen = action.payload;
    },
    setLuckeeParentPicking: (state, action: PayloadAction<boolean>) => {
      state.luckeeParentPicking = action.payload;
    },
    openSetupModal: (
      state,
      action: PayloadAction<{ projectId: string; message?: string }>,
    ) => {
      state.setupModalOpen = true;
      state.setupModalProjectId = action.payload.projectId;
      state.setupModalStatus = 'running';
      state.setupModalMessage = action.payload.message ?? 'Starting setup...';
      state.setupModalSteps = [];
      state.setupModalLog = null;
      state.setupModalStartedAt = new Date().toISOString();
    },
    setSetupModalMessage: (state, action: PayloadAction<string>) => {
      state.setupModalMessage = action.payload;
    },
    setSetupModalSteps: (state, action: PayloadAction<SetupJobStep[]>) => {
      state.setupModalSteps = action.payload;
    },
    setSetupModalLog: (state, action: PayloadAction<string>) => {
      state.setupModalLog = action.payload;
    },
    setSetupModalStatus: (
      state,
      action: PayloadAction<{
        status: 'running' | 'completed' | 'failed';
        message?: string;
      }>,
    ) => {
      state.setupModalStatus = action.payload.status;
      if (action.payload.message !== undefined) {
        state.setupModalMessage = action.payload.message;
      }
    },
    closeSetupModal: (state) => {
      state.setupModalOpen = false;
      state.setupModalProjectId = null;
      state.setupModalStatus = null;
      state.setupModalMessage = null;
      state.setupModalSteps = [];
      state.setupModalLog = null;
      state.setupModalStartedAt = null;
    },
    resetLocalDatabaseState: (state) => {
      state.localDatabaseLoadStatus = 'idle';
      state.localDatabaseOperation = null;
      state.activeLocalDatabaseStepId = null;
      state.localDatabaseError = null;
      state.localDatabaseSetupMessage = null;
      state.activeLocalDatabaseProjectId = null;
    },
    resetSupabaseState: (state) => {
      state.supabaseLoadStatus = 'idle';
      state.supabaseError = null;
      state.supabaseSaveMessage = null;
      state.supabaseOperation = null;
      state.supabaseUrl = '';
      state.supabaseServiceKey = '';
      state.supabaseEditing = false;
    },
  },
});

export const ProjectsBuilderActions = projectsBuilderSlice.actions;
export const projectsBuilderReducer = projectsBuilderSlice.reducer;
