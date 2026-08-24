import { combineReducers } from '@reduxjs/toolkit';
import { appReducer } from './appSlice';
import { projectsReducer } from './dumps/projects';
import { projectReposReducer } from './dumps/projectRepos';
import { terminalSessionsReducer } from './dumps/terminalSessions';
import { localDatabaseProbesReducer } from './dumps/localDatabaseProbes';
import { supabaseProbesReducer } from './dumps/supabaseProbes';
import { expressEnvProbesReducer } from './dumps/expressEnvProbes';
import { runningJobsReducer } from './dumps/runningJobs';
import { breadcrumbBuilderReducer } from './builders/breadcrumbBuilder';
import { projectsBuilderReducer } from './builders/projectsBuilder';
import { currentProjectReducer } from './current/currentProject';

export const rootReducer = combineReducers({
  app: appReducer,
  breadcrumbBuilder: breadcrumbBuilderReducer,
  projects: projectsReducer,
  projectRepos: projectReposReducer,
  terminalSessions: terminalSessionsReducer,
  localDatabaseProbes: localDatabaseProbesReducer,
  supabaseProbes: supabaseProbesReducer,
  expressEnvProbes: expressEnvProbesReducer,
  runningJobs: runningJobsReducer,
  projectsBuilder: projectsBuilderReducer,
  currentProject: currentProjectReducer,
});
