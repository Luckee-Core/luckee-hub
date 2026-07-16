import type { HubProject, HubProjectRepo } from '@/model';

export type ListProjectsResponse = {
  projects: HubProject[];
  repos: HubProjectRepo[];
};

export type { HubConfigData, SetupProjectResponse } from './hub-config-types';
