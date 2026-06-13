import type { HookStatus } from '@/model';

type ProjectsHookStatusBadgeProps = {
  hookStatus: HookStatus;
};

const LABELS: Record<HookStatus, string> = {
  catalog: 'Available',
  disabled: 'Disabled',
  missing: 'Missing paths',
  cloned: 'Cloned',
  configured: 'Configured',
  api_running: 'API running',
  web_running: 'Web running',
  ready: 'Ready',
};

const COLORS: Record<HookStatus, string> = {
  catalog: 'bg-gray-100 text-gray-600',
  disabled: 'bg-gray-200 text-gray-500',
  missing: 'bg-red-100 text-red-700',
  cloned: 'bg-yellow-100 text-yellow-800',
  configured: 'bg-blue-100 text-blue-800',
  api_running: 'bg-indigo-100 text-indigo-800',
  web_running: 'bg-purple-100 text-purple-800',
  ready: 'bg-green-100 text-green-800',
};

export const ProjectsHookStatusBadge = ({ hookStatus }: ProjectsHookStatusBadgeProps) => {
  return (
    <span className={`${styles.badge} ${COLORS[hookStatus]}`}>
      {LABELS[hookStatus]}
    </span>
  );
};

const styles = {
  badge: `
    shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium
  `,
};
