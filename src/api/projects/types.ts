import type { HubProject, HubProjectRepo } from '@/model';

export type ListProjectsResponse = {
  projects: HubProject[];
  repos: HubProjectRepo[];
};
