import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { ExpressEnvGroupProbe } from '@/model';

type ExpressEnvProbesState = Record<string, ExpressEnvGroupProbe>;

const initialState: ExpressEnvProbesState = {};

/**
 * Build dump key for an express env group probe.
 */
export const buildExpressEnvProbeKey = (projectId: string, groupId: string): string =>
  `${projectId}::${groupId}`;

export const expressEnvProbesSlice = createSlice({
  name: 'expressEnvProbes',
  initialState,
  reducers: {
    upsertProbe: (
      state,
      action: PayloadAction<{ projectId: string; groupId: string; probe: ExpressEnvGroupProbe }>,
    ) => {
      const key = buildExpressEnvProbeKey(action.payload.projectId, action.payload.groupId);
      state[key] = action.payload.probe;
    },
    clearProbe: (state, action: PayloadAction<{ projectId: string; groupId: string }>) => {
      const key = buildExpressEnvProbeKey(action.payload.projectId, action.payload.groupId);
      delete state[key];
    },
  },
});

export const ExpressEnvProbesActions = expressEnvProbesSlice.actions;
export const expressEnvProbesReducer = expressEnvProbesSlice.reducer;
