import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { DevHubStudio } from '@/model';

type DevHubStudiosState = Record<string, DevHubStudio>;

const initialState: DevHubStudiosState = {};

export const devHubStudiosSlice = createSlice({
  name: 'devHubStudios',
  initialState,
  reducers: {
    setStudios: (_state, action: PayloadAction<DevHubStudio[]>) => {
      const next: DevHubStudiosState = {};
      for (const studio of action.payload) {
        next[studio.id] = studio;
      }
      return next;
    },
    upsertStudio: (state, action: PayloadAction<DevHubStudio>) => {
      state[action.payload.id] = action.payload;
    },
  },
});

export const DevHubStudiosActions = devHubStudiosSlice.actions;
export const devHubStudiosReducer = devHubStudiosSlice.reducer;
