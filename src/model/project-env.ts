import type { HubProjectRepoRole } from './hub-project-repo';

export type ProjectEnvKey = {
  key: string;
  secret: boolean;
  required: boolean;
  optional: boolean;
  present: boolean;
  placeholder?: string;
  value?: string;
};

export type ProjectEnvSection = {
  id: string;
  title: string;
  description: string;
  keys: ProjectEnvKey[];
};

export type ProjectEnvProbe = {
  role: HubProjectRepoRole;
  repoName: string;
  cloned: boolean;
  envPath?: string;
  sections: ProjectEnvSection[];
  message?: string;
};

export type DataPlaneOption = {
  id: string;
  label: string;
  value: string;
  keys: string[];
  usesLocalDatabase?: boolean;
};

export type DataPlaneConfig = {
  modeKey: string;
  options: DataPlaneOption[];
};

export type DataPlaneProbe = {
  supported: boolean;
  modeKey?: string;
  value?: string | null;
  activeOptionId?: string | null;
  message?: string;
};
