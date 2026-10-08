export type HubProjectRepoType = 'express' | 'nextjs';

export type HubProjectRepo = {
  projectId: string;
  repoType: HubProjectRepoType;
  repoName: string;
  repoUrl?: string;
  localDir?: string;
  dirExists?: boolean;
  depsInstalled?: boolean;
  /** API repo runtime detected from the local directory. */
  apiRuntime?: 'node' | 'python';
  defaultApiPort?: number;
  defaultWebPortStart?: number;
  healthPath?: string;
};
