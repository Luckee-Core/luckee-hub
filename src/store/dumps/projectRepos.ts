import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { HubProjectRepo } from '@/model';

type ProjectReposState = HubProjectRepo[];

const initialState: ProjectReposState = [];

export const projectReposSlice = createSlice({
  name: 'projectRepos',
  initialState,
  reducers: {
    setProjectRepos: (_state, action: PayloadAction<HubProjectRepo[]>) => action.payload,
  },
});

export const ProjectReposActions = projectReposSlice.actions;
export const projectReposReducer = projectReposSlice.reducer;
