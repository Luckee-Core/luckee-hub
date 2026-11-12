export type HubProjectRepoType = 'express' | 'nextjs' | 'storage-express';

export type HubProjectRepoRole =
  | 'web'
  | 'express'
  | 'storage'
  | 'console'
  | 'dispatcher-web'
  | 'dispatcher'
  | 'mobile';

export type HubProjectRepo = {
  projectId: string;
  repoType: HubProjectRepoType;
  role: HubProjectRepoRole;
  repoName: string;
  repoUrl?: string;
  localDir?: string;
  dirExists?: boolean;
  depsInstalled?: boolean;
  apiRuntime?: 'node' | 'python';
  defaultApiPort?: number;
  defaultWebPortStart?: number;
  healthPath?: string;
};
