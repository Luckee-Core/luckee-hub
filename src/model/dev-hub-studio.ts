export type HookStatus =
  | 'catalog'
  | 'disabled'
  | 'missing'
  | 'cloned'
  | 'configured'
  | 'api_running'
  | 'web_running'
  | 'ready';

export type DevHubStudio = {
  id: string;
  name: string;
  description: string;
  hookStatus: HookStatus;
  enabled: boolean;
  apiOnly: boolean;
  webOnly: boolean;
  apiPort: number;
  webUrl?: string;
  paths?: {
    webDir?: string;
    expressDir?: string;
    workspaceFile?: string;
  };
};

export type TerminalSession = {
  sessionId: string;
  studioId: string;
  role: 'express' | 'web';
  label: string;
};

export type RunStudioResponse = {
  jobId: string;
  sessions: TerminalSession[];
};

export type LauncherJob = {
  jobId: string;
  studioId: string;
  status: 'running' | 'completed' | 'failed';
  message?: string;
  webUrl?: string;
  sessions?: TerminalSession[];
  updatedAt: string;
};
