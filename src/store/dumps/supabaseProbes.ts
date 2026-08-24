import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { SupabaseProbe } from '@/model';

type SupabaseProbesState = Record<string, SupabaseProbe>;

const initialState: SupabaseProbesState = {};

export const supabaseProbesSlice = createSlice({
  name: 'supabaseProbes',
  initialState,
  reducers: {
    upsertSupabaseProbe: (
      state,
      action: PayloadAction<{ projectId: string; probe: SupabaseProbe }>,
    ) => {
      state[action.payload.projectId] = action.payload.probe;
    },
    clearSupabaseProbe: (state, action: PayloadAction<string>) => {
      delete state[action.payload];
    },
  },
});

export const SupabaseProbesActions = supabaseProbesSlice.actions;
export const supabaseProbesReducer = supabaseProbesSlice.reducer;
