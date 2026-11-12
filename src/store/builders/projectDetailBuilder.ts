import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { HubProjectRepoRole } from '@/model';

type LoadStatus = 'idle' | 'loading' | 'loaded' | 'error';

export type ProjectDetailTabId = 'overview' | 'repos';

export type ActiveRepoRef = {
  role: HubProjectRepoRole;
  repoName: string;
};

export type EnvSectionFormState = {
  values: Record<string, string>;
  editing: boolean;
  status: LoadStatus;
  error: string | null;
  message: string | null;
};

type ProjectDetailBuilderState = {
  activeTab: ProjectDetailTabId;
  activeRepo: ActiveRepoRef | null;
  activeEnvSectionId: string | null;
  envSectionForms: Record<string, EnvSectionFormState>;
};

const initialState: ProjectDetailBuilderState = {
  activeTab: 'overview',
  activeRepo: null,
  activeEnvSectionId: null,
  envSectionForms: {},
};

const emptyForm = (): EnvSectionFormState => ({
  values: {},
  editing: false,
  status: 'idle',
  error: null,
  message: null,
});

const formFor = (state: ProjectDetailBuilderState, sectionId: string): EnvSectionFormState => {
  if (!state.envSectionForms[sectionId]) {
    state.envSectionForms[sectionId] = emptyForm();
  }
  return state.envSectionForms[sectionId];
};

export const projectDetailBuilderSlice = createSlice({
  name: 'projectDetailBuilder',
  initialState,
  reducers: {
    reset: () => initialState,
    setActiveTab: (state, action: PayloadAction<ProjectDetailTabId>) => {
      state.activeTab = action.payload;
    },
    setActiveRepo: (state, action: PayloadAction<ActiveRepoRef | null>) => {
      state.activeRepo = action.payload;
      state.activeEnvSectionId = null;
      state.envSectionForms = {};
    },
    setActiveEnvSectionId: (state, action: PayloadAction<string | null>) => {
      state.activeEnvSectionId = action.payload;
    },
    setEnvSectionValue: (
      state,
      action: PayloadAction<{ sectionId: string; key: string; value: string }>,
    ) => {
      formFor(state, action.payload.sectionId).values[action.payload.key] = action.payload.value;
    },
    fillEnvSectionFromProbe: (
      state,
      action: PayloadAction<{ sectionId: string; values: Record<string, string> }>,
    ) => {
      formFor(state, action.payload.sectionId).values = { ...action.payload.values };
    },
    setEnvSectionStatus: (
      state,
      action: PayloadAction<{ sectionId: string; status: LoadStatus }>,
    ) => {
      formFor(state, action.payload.sectionId).status = action.payload.status;
    },
    setEnvSectionError: (
      state,
      action: PayloadAction<{ sectionId: string; error: string | null }>,
    ) => {
      const form = formFor(state, action.payload.sectionId);
      form.error = action.payload.error;
      if (action.payload.error) {
        form.message = null;
      }
    },
    setEnvSectionMessage: (
      state,
      action: PayloadAction<{ sectionId: string; message: string | null }>,
    ) => {
      const form = formFor(state, action.payload.sectionId);
      form.message = action.payload.message;
      if (action.payload.message) {
        form.error = null;
      }
    },
  },
});

export const ProjectDetailBuilderActions = projectDetailBuilderSlice.actions;
export const projectDetailBuilderReducer = projectDetailBuilderSlice.reducer;
