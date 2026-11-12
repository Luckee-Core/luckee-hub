import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { DataPlaneProbe } from '@/model';

type DataPlaneProbesState = Record<string, DataPlaneProbe | undefined>;

const initialState: DataPlaneProbesState = {};

export const dataPlaneProbesSlice = createSlice({
  name: 'dataPlaneProbes',
  initialState,
  reducers: {
    setProbe: (state, action: PayloadAction<{ projectId: string; probe: DataPlaneProbe }>) => {
      state[action.payload.projectId] = action.payload.probe;
    },
  },
});

export const DataPlaneProbesActions = dataPlaneProbesSlice.actions;
export const dataPlaneProbesReducer = dataPlaneProbesSlice.reducer;
