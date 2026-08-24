import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { SetupJobStep } from '@/model';

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
  supabaseLoadStatus: LoadStatus;
  supabaseError: string | null;
  supabaseSaveMessage: string | null;
  supabaseOperation: 'save' | 'seed' | null;
  supabaseUrl: string;
  supabaseServiceKey: string;
  supabaseDatabasePassword: string;
  supabaseEditing: boolean;
  expressEnvLoadStatus: LoadStatus;
  expressEnvError: string | null;
  expressEnvSaveMessage: string | null;
  aiEnvEditing: boolean;
  googleMapsEnvEditing: boolean;
  emailEnvEditing: boolean;
  anthropicApiKey: string;
  googleMapsApiKey: string;
  gmailServiceAccountJsonPath: string;
  gmailSendAsEmail: string;
  gmailFromName: string;
  emailOpenTrackingBaseUrl: string;
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
  setupModalStartedAt: string | null;
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
  supabaseLoadStatus: 'idle',
  supabaseError: null,
  supabaseSaveMessage: null,
  supabaseOperation: null,
  supabaseUrl: '',
  supabaseServiceKey: '',
  supabaseDatabasePassword: '',
  supabaseEditing: false,
  expressEnvLoadStatus: 'idle',
  expressEnvError: null,
  expressEnvSaveMessage: null,
  aiEnvEditing: false,
  googleMapsEnvEditing: false,
  emailEnvEditing: false,
  anthropicApiKey: '',
  googleMapsApiKey: '',
  gmailServiceAccountJsonPath: '',
  gmailSendAsEmail: '',
  gmailFromName: '',
  emailOpenTrackingBaseUrl: '',
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
  setupModalStartedAt: null,
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
    setSupabaseLoadStatus: (state, action: PayloadAction<LoadStatus>) => {
      state.supabaseLoadStatus = action.payload;
    },
    setSupabaseError: (state, action: PayloadAction<string | null>) => {
      state.supabaseError = action.payload;
    },
    setSupabaseSaveMessage: (state, action: PayloadAction<string | null>) => {
      state.supabaseSaveMessage = action.payload;
    },
    setSupabaseOperation: (state, action: PayloadAction<'save' | 'seed' | null>) => {
      state.supabaseOperation = action.payload;
    },
    setSupabaseUrl: (state, action: PayloadAction<string>) => {
      state.supabaseUrl = action.payload;
    },
    setSupabaseServiceKey: (state, action: PayloadAction<string>) => {
      state.supabaseServiceKey = action.payload;
    },
    setSupabaseDatabasePassword: (state, action: PayloadAction<string>) => {
      state.supabaseDatabasePassword = action.payload;
    },
    setSupabaseEditing: (state, action: PayloadAction<boolean>) => {
      state.supabaseEditing = action.payload;
    },
    setExpressEnvLoadStatus: (state, action: PayloadAction<LoadStatus>) => {
      state.expressEnvLoadStatus = action.payload;
    },
    setExpressEnvError: (state, action: PayloadAction<string | null>) => {
      state.expressEnvError = action.payload;
    },
    setExpressEnvSaveMessage: (state, action: PayloadAction<string | null>) => {
      state.expressEnvSaveMessage = action.payload;
    },
    setAiEnvEditing: (state, action: PayloadAction<boolean>) => {
      state.aiEnvEditing = action.payload;
    },
    setGoogleMapsEnvEditing: (state, action: PayloadAction<boolean>) => {
      state.googleMapsEnvEditing = action.payload;
    },
    setEmailEnvEditing: (state, action: PayloadAction<boolean>) => {
      state.emailEnvEditing = action.payload;
    },
    setAnthropicApiKey: (state, action: PayloadAction<string>) => {
      state.anthropicApiKey = action.payload;
    },
    setGoogleMapsApiKey: (state, action: PayloadAction<string>) => {
      state.googleMapsApiKey = action.payload;
    },
    setGmailServiceAccountJsonPath: (state, action: PayloadAction<string>) => {
      state.gmailServiceAccountJsonPath = action.payload;
    },
    setGmailSendAsEmail: (state, action: PayloadAction<string>) => {
      state.gmailSendAsEmail = action.payload;
    },
    setGmailFromName: (state, action: PayloadAction<string>) => {
      state.gmailFromName = action.payload;
    },
    setEmailOpenTrackingBaseUrl: (state, action: PayloadAction<string>) => {
      state.emailOpenTrackingBaseUrl = action.payload;
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
      state.setupModalStartedAt = new Date().toISOString();
    },
    setSetupModalMessage: (state, action: PayloadAction<string>) => {
      state.setupModalMessage = action.payload;
    },
    setSetupModalSteps: (state, action: PayloadAction<SetupJobStep[]>) => {
      state.setupModalSteps = action.payload;
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
      state.supabaseDatabasePassword = '';
      state.supabaseEditing = false;
    },
    resetExpressEnvForm: (state) => {
      state.expressEnvLoadStatus = 'idle';
      state.expressEnvError = null;
      state.expressEnvSaveMessage = null;
      state.aiEnvEditing = false;
      state.googleMapsEnvEditing = false;
      state.emailEnvEditing = false;
      state.anthropicApiKey = '';
      state.googleMapsApiKey = '';
      state.gmailServiceAccountJsonPath = '';
      state.gmailSendAsEmail = '';
      state.gmailFromName = '';
      state.emailOpenTrackingBaseUrl = '';
    },
  },
});

export const ProjectsBuilderActions = projectsBuilderSlice.actions;
export const projectsBuilderReducer = projectsBuilderSlice.reducer;
