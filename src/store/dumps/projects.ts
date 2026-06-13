import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { HubProject } from '@/model';

type ProjectsState = Record<string, HubProject>;

const initialState: ProjectsState = {};

export const projectsSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    setProjects: (_state, action: PayloadAction<HubProject[]>) => {
      const next: ProjectsState = {};
      for (const project of action.payload) {
        next[project.id] = project;
      }
      return next;
    },
    upsertProject: (state, action: PayloadAction<HubProject>) => {
      state[action.payload.id] = action.payload;
    },
  },
});

export const ProjectsActions = projectsSlice.actions;
export const projectsReducer = projectsSlice.reducer;
