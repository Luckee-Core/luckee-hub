import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { ProjectOverview } from '@/model';

/** `undefined` = not loaded yet, `null` = no overview written for this project. */
type ProjectOverviewsState = Record<string, ProjectOverview | null | undefined>;

const initialState: ProjectOverviewsState = {};

export const projectOverviewsSlice = createSlice({
  name: 'projectOverviews',
  initialState,
  reducers: {
    setOverview: (
      state,
      action: PayloadAction<{ projectId: string; overview: ProjectOverview | null }>,
    ) => {
      state[action.payload.projectId] = action.payload.overview;
    },
  },
});

export const ProjectOverviewsActions = projectOverviewsSlice.actions;
export const projectOverviewsReducer = projectOverviewsSlice.reducer;
