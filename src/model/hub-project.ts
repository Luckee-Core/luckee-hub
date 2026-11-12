export type HookStatus =
  | 'catalog'
  | 'disabled'
  | 'missing'
  | 'cloned'
  | 'configured'
  | 'api_running'
  | 'web_running'
  | 'ready';

import type { DataPlaneConfig } from './project-env';

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
  supabaseSupported: boolean;
  dataPlane?: DataPlaneConfig;
  postgresActiveConsumer?: boolean;
  storageExpressSupported: boolean;
  storagePort: number;
  storageRunning?: boolean;
};

export type CloseProjectResponse = {
  killedSessionIds: string[];
  postgresStopped: boolean;
  message: string;
};

export type TerminalSession = {
  sessionId: string;
  projectId: string;
  role: 'express' | 'web' | 'storage-express' | 'scheduler-worker';
  label: string;
};

export type ProjectRunTarget = 'express' | 'web';

export type RunProjectResponse = {
  jobId: string;
  sessions: TerminalSession[];
};

export type SetupJobStepStatus = 'pending' | 'running' | 'done' | 'skipped' | 'failed';

export type SetupJobStep = {
  id: string;
  label: string;
  status: SetupJobStepStatus;
  message?: string;
};

export type LauncherJob = {
  jobId: string;
  projectId: string;
  status: 'running' | 'completed' | 'failed';
  message?: string;
  webUrl?: string;
  sessions?: TerminalSession[];
  steps?: SetupJobStep[];
  logTail?: string;
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

export type SupabaseProbe = {
  supported: boolean;
  expressEnvPath?: string;
  bootstrapSql?: string;
  expectedTables?: string[];
  hasSupabaseUrl: boolean;
  hasServiceKey: boolean;
  configured: boolean;
  /** True when every expected table exists (checked via Supabase REST with the service key). */
  schemaReady: boolean;
  /** Expected tables not found — present when the table check ran. */
  missingTables?: string[];
  /** Why the table check could not run (bad key, unreachable, …). */
  schemaCheckError?: string;
  message?: string;
};

export type SupabaseConfigSaveResult = {
  success: boolean;
  message: string;
  expressEnvPath: string;
};

