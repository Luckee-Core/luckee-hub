import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { ProjectEnvProbe } from '@/model';

export const buildEnvProbeKey = (projectId: string, role: string, repoName: string): string =>
  `${projectId}:${role}:${repoName}`;

type EnvProbesState = Record<string, ProjectEnvProbe | undefined>;

const initialState: EnvProbesState = {};

export const envProbesSlice = createSlice({
  name: 'envProbes',
  initialState,
  reducers: {
    setProbe: (state, action: PayloadAction<ProjectEnvProbe & { projectId: string }>) => {
      const key = buildEnvProbeKey(action.payload.projectId, action.payload.role, action.payload.repoName);
      const { projectId: _p, ...probe } = action.payload;
      state[key] = probe;
    },
    clearForProject: (state, action: PayloadAction<string>) => {
      const prefix = `${action.payload}:`;
      for (const key of Object.keys(state)) {
        if (key.startsWith(prefix)) {
          delete state[key];
        }
      }
    },
  },
});

export const EnvProbesActions = envProbesSlice.actions;
export const envProbesReducer = envProbesSlice.reducer;
