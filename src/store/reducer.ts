import { combineReducers } from '@reduxjs/toolkit';
import { appReducer } from './appSlice';
import { projectsReducer } from './dumps/projects';
import { terminalSessionsReducer } from './dumps/terminalSessions';
import { localDatabaseProbesReducer } from './dumps/localDatabaseProbes';
import { runningJobsReducer } from './dumps/runningJobs';
import { breadcrumbBuilderReducer } from './builders/breadcrumbBuilder';
import { projectsBuilderReducer } from './builders/projectsBuilder';
import { currentProjectDetailReducer } from './current/projectDetail';

export const rootReducer = combineReducers({
  app: appReducer,
  breadcrumbBuilder: breadcrumbBuilderReducer,
  projects: projectsReducer,
  terminalSessions: terminalSessionsReducer,
  localDatabaseProbes: localDatabaseProbesReducer,
  runningJobs: runningJobsReducer,
  projectsBuilder: projectsBuilderReducer,
  currentProjectDetail: currentProjectDetailReducer,
});
