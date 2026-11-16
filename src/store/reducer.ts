import { combineReducers } from '@reduxjs/toolkit';
import { appReducer } from './appSlice';
import { projectsReducer } from './dumps/projects';
import { projectReposReducer } from './dumps/projectRepos';
import { terminalSessionsReducer } from './dumps/terminalSessions';
import { localDatabaseProbesReducer } from './dumps/localDatabaseProbes';
import { supabaseProbesReducer } from './dumps/supabaseProbes';
import { envProbesReducer } from './dumps/envProbes';
import { dataPlaneProbesReducer } from './dumps/dataPlaneProbes';
import { projectOverviewsReducer } from './dumps/projectOverviews';
import { runningJobsReducer } from './dumps/runningJobs';
import { breadcrumbBuilderReducer } from './builders/breadcrumbBuilder';
import { projectsBuilderReducer } from './builders/projectsBuilder';
import { terminalSidebarBuilderReducer } from './builders/terminalSidebarBuilder';
import { projectDetailBuilderReducer } from './builders/projectDetailBuilder';
import { currentProjectReducer } from './current/currentProject';
import { systemMetricsBuilderReducer } from './builders/systemMetricsBuilder';
import { projectFavoritesReducer } from './config/projectFavorites';
import { projectSectionOverridesReducer } from './config/projectSectionOverrides';

export const rootReducer = combineReducers({
  app: appReducer,
  breadcrumbBuilder: breadcrumbBuilderReducer,
  projects: projectsReducer,
  projectRepos: projectReposReducer,
  terminalSessions: terminalSessionsReducer,
  localDatabaseProbes: localDatabaseProbesReducer,
  supabaseProbes: supabaseProbesReducer,
  envProbes: envProbesReducer,
  dataPlaneProbes: dataPlaneProbesReducer,
  projectOverviews: projectOverviewsReducer,
  runningJobs: runningJobsReducer,
  projectsBuilder: projectsBuilderReducer,
  terminalSidebarBuilder: terminalSidebarBuilderReducer,
  projectDetailBuilder: projectDetailBuilderReducer,
  currentProject: currentProjectReducer,
  systemMetricsBuilder: systemMetricsBuilderReducer,
  projectFavorites: projectFavoritesReducer,
  projectSectionOverrides: projectSectionOverridesReducer,
});
