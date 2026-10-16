import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { SystemMetricsSnapshot } from '@/model';

type SystemMetricsLoadStatus = 'idle' | 'loading' | 'loaded' | 'error';

type SystemMetricsBuilderState = {
  loadStatus: SystemMetricsLoadStatus;
  error: string | null;
  snapshot: SystemMetricsSnapshot | null;
  lastFetchedAt: string | null;
};

const initialState: SystemMetricsBuilderState = {
  loadStatus: 'idle',
  error: null,
  snapshot: null,
  lastFetchedAt: null,
};

export const systemMetricsBuilderSlice = createSlice({
  name: 'systemMetricsBuilder',
  initialState,
  reducers: {
    setLoadStatus: (state, action: PayloadAction<SystemMetricsLoadStatus>) => {
      state.loadStatus = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setSnapshot: (state, action: PayloadAction<SystemMetricsSnapshot | null>) => {
      state.snapshot = action.payload;
    },
    setLastFetchedAt: (state, action: PayloadAction<string | null>) => {
      state.lastFetchedAt = action.payload;
    },
    resetSystemMetrics: () => initialState,
  },
});

export const SystemMetricsBuilderActions = systemMetricsBuilderSlice.actions;
export const systemMetricsBuilderReducer = systemMetricsBuilderSlice.reducer;
