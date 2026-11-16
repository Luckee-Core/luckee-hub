import type { ProjectCatalogTier } from '@/config/project-catalog-tier';
import type { HubProject, HubProjectRepo } from '@/model';

export type ListProjectsResponse = {
  projects: HubProject[];
  repos: HubProjectRepo[];
};

export type { HubConfigData, SetupProjectResponse } from './hub-config-types';

/** Hub UI preferences persisted in hub-express data/ui-preferences.json (committed) (favorites, table section moves). */
export type HubUiPreferencesData = {
  favoriteProjectIds: string[];
  projectSectionOverrides: Record<string, ProjectCatalogTier>;
};

export type GetHubUiPreferencesResponse = HubUiPreferencesData & {
  /** False until preferences have been saved once (the web app then migrates localStorage). */
  stored: boolean;
};
