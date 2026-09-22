import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { HubProject } from '@/model';

export const EMPTY_HUB_PROJECT: HubProject = {
  id: '',
  name: '',
  description: '',
  hookStatus: 'catalog',
  enabled: true,
  apiPort: 0,
  localDatabaseSupported: false,
  supabaseSupported: false,
  expressEnvGroupIds: [],
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
