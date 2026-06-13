import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

type RunningJobsState = Record<string, string>;

const initialState: RunningJobsState = {};

export const runningJobsSlice = createSlice({
  name: 'runningJobs',
  initialState,
  reducers: {
    setRunningJob: (
      state,
      action: PayloadAction<{ projectId: string; jobId: string | null }>,
    ) => {
      const { projectId, jobId } = action.payload;
      if (jobId) {
        state[projectId] = jobId;
      } else {
        delete state[projectId];
      }
    },
  },
});

export const RunningJobsActions = runningJobsSlice.actions;
export const runningJobsReducer = runningJobsSlice.reducer;
