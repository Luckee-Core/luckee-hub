export type HookStatus =
  | 'catalog'
  | 'disabled'
  | 'missing'
  | 'cloned'
  | 'configured'
  | 'api_running'
  | 'web_running'
  | 'ready';

export type HubProject = {
  id: string;
  name: string;
  description: string;
  hookStatus: HookStatus;
  enabled: boolean;
  apiPort: number;
  webUrl?: string;
  paths?: {
    workspaceFile?: string;
  };
  localDatabaseSupported: boolean;
  postgresActiveConsumer?: boolean;
};

export type CloseProjectResponse = {
  killedSessionIds: string[];
  postgresStopped: boolean;
  message: string;
};

export type TerminalSession = {
  sessionId: string;
  projectId: string;
  role: 'express' | 'web';
  label: string;
};

export type RunProjectResponse = {
  jobId: string;
  sessions: TerminalSession[];
};

export type LauncherJob = {
  jobId: string;
  projectId: string;
  status: 'running' | 'completed' | 'failed';
  message?: string;
  webUrl?: string;
  sessions?: TerminalSession[];
  updatedAt: string;
};

export type LocalDatabaseSetupStepStatus = 'done' | 'pending' | 'skipped' | 'blocked';

export type LocalDatabaseSetupStep = {
  id: string;
  title: string;
  detail?: string;
  status: LocalDatabaseSetupStepStatus;
  runnable: boolean;
  actionLabel?: string;
  skipped?: boolean;
  stoppable?: boolean;
  stopStepId?: string;
  stopActionLabel?: string;
};

export type LocalDatabaseStepResult = {
  success: boolean;
  stepId: string;
  message: string;
};

export type LocalDatabaseCleanupResult = {
  success: boolean;
  message: string;
};

export type LocalDatabaseProbe = {
  supported: boolean;
  kind?: 'postgres';
  databaseName?: string;
  migrationsDir?: string;
  migrationFiles?: string[];
  expressEnvPath?: string;
  setupSteps?: LocalDatabaseSetupStep[];
  postgresRunning: boolean;
  postgresStartedByHub?: boolean;
  databaseExists: boolean;
  schemaReady: boolean;
  envConfigured: boolean;
  databaseUrl?: string;
  message?: string;
};

export type LocalDatabaseSetupResult = {
  success: boolean;
  databaseName: string;
  databaseUrl: string;
  migrationsApplied: string[];
  message: string;
};
