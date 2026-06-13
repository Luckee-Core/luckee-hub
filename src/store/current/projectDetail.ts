import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

type CurrentProjectDetailState = {
  projectId: string | null;
};

const initialState: CurrentProjectDetailState = {
  projectId: null,
};

export const currentProjectDetailSlice = createSlice({
  name: 'currentProjectDetail',
  initialState,
  reducers: {
    setProjectId: (state, action: PayloadAction<string | null>) => {
      state.projectId = action.payload;
    },
    reset: () => initialState,
  },
});

export const CurrentProjectDetailActions = currentProjectDetailSlice.actions;
export const currentProjectDetailReducer = currentProjectDetailSlice.reducer;
