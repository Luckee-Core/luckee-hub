import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { ProjectCatalogTier } from '@/config/project-catalog-tier';

type ProjectSectionOverridesState = {
  byProjectId: Record<string, ProjectCatalogTier>;
};

const initialState: ProjectSectionOverridesState = {
  byProjectId: {},
};

export const projectSectionOverridesSlice = createSlice({
  name: 'projectSectionOverrides',
  initialState,
  reducers: {
    setOverrides: (state, action: PayloadAction<Record<string, ProjectCatalogTier>>) => {
      state.byProjectId = action.payload;
    },
    setProjectTier: (
      state,
      action: PayloadAction<{ projectId: string; tier: ProjectCatalogTier }>,
    ) => {
      state.byProjectId[action.payload.projectId] = action.payload.tier;
    },
    clearProjectTier: (state, action: PayloadAction<string>) => {
      delete state.byProjectId[action.payload];
    },
  },
});

export const ProjectSectionOverridesActions = projectSectionOverridesSlice.actions;
export const projectSectionOverridesReducer = projectSectionOverridesSlice.reducer;
