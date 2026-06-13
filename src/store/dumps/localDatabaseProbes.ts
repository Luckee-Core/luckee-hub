import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { LocalDatabaseProbe } from '@/model';

type LocalDatabaseProbesState = Record<string, LocalDatabaseProbe>;

const initialState: LocalDatabaseProbesState = {};

export const localDatabaseProbesSlice = createSlice({
  name: 'localDatabaseProbes',
  initialState,
  reducers: {
    upsertLocalDatabaseProbe: (
      state,
      action: PayloadAction<{ projectId: string; probe: LocalDatabaseProbe }>,
    ) => {
      state[action.payload.projectId] = action.payload.probe;
    },
    removeLocalDatabaseProbe: (state, action: PayloadAction<string>) => {
      delete state[action.payload];
    },
  },
});

export const LocalDatabaseProbesActions = localDatabaseProbesSlice.actions;
export const localDatabaseProbesReducer = localDatabaseProbesSlice.reducer;
