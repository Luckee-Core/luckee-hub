import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { HubProject } from '@/model';

export const EMPTY_HUB_PROJECT: HubProject = {
  id: '',
  name: '',
  description: '',
  hookStatus: 'catalog',
  hookChecks: [],
  enabled: true,
  apiOnly: false,
  webOnly: false,
  apiPort: 0,
  localDatabaseSupported: false,
};

export const currentProjectSlice = createSlice({
  name: 'currentProject',
  initialState: EMPTY_HUB_PROJECT,
  reducers: {
    setCurrentProject: (_state, action: PayloadAction<HubProject>) => action.payload,
    reset: () => EMPTY_HUB_PROJECT,
  },
});

export const CurrentProjectActions = currentProjectSlice.actions;
export const currentProjectReducer = currentProjectSlice.reducer;
