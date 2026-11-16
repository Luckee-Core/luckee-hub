'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { PROJECT_DETAIL_PAGE_PATH } from '@/config';
import { useAppDispatch, useAppSelector } from '@/store';
import { setCurrentProjectThunk } from '@/store/thunks/projects';
import {
  startProjectFromSidebarThunk,
  stopProjectFromSidebarThunk,
} from '@/store/thunks/terminal-sidebar';
import {
  hasActiveRunOperation,
  hasActiveSetupOperation,
  isProjectRunActive,
  projectHasExpressRepo,
  projectHasWebRepo,
} from '@/utils/projects';
import { resolveProjectRuntime } from '../../resolve-project-runtime';
import { TierDot } from './tier-dot';

type RunningServicesRowProps = {
  projectId: string;
};

/**
 * One project: name (opens detail), A/W/S/L status dots, and Start or Stop all.
 */
export const RunningServicesRow = ({ projectId }: RunningServicesRowProps) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const projects = useAppSelector((state) => state.projects);
  const projectRepos = useAppSelector((state) => state.projectRepos);
  const terminalSessions = useAppSelector((state) => state.terminalSessions);
  const runningJobs = useAppSelector((state) => state.runningJobs);
  const projectsBuilder = useAppSelector((state) => state.projectsBuilder);
  const builder = useAppSelector((state) => state.terminalSidebarBuilder);

  const project = projects[projectId];

  const runtime = useMemo(() => {
    if (!project) {
      return null;
    }
    const runState = { runningJobs, projectsBuilder };
    return resolveProjectRuntime({
      project,
      sessions: Object.values(terminalSessions).filter((session) => session.projectId === projectId),
      hasExpressRepo: projectHasExpressRepo(projectRepos, projectId),
      hasWebRepo: projectHasWebRepo(projectRepos, projectId),
      isRunActive: isProjectRunActive(runState, projectId),
    });
  }, [project, projectId, projectRepos, projectsBuilder, runningJobs, terminalSessions]);

  const isLaunchBusy = useMemo(
    () =>
      hasActiveRunOperation({ runningJobs, projectsBuilder }) ||
      hasActiveSetupOperation({ runningJobs, projectsBuilder }),
    [runningJobs, projectsBuilder],
  );

  if (!project || !runtime) {
    return null;
  }

  const isActionBusy = builder.actionProjectId === projectId && builder.actionKind !== null;
  const isRunActive = isProjectRunActive({ runningJobs, projectsBuilder }, projectId);
  const isRunning = runtime.isRunning;
  const startDisabled = isActionBusy || isLaunchBusy;
  const showFeedback = builder.actionProjectId === projectId;

  const buttonLabel = isActionBusy
    ? builder.actionKind === 'start'
      ? 'Starting…'
      : 'Stopping…'
    : isRunActive
      ? 'Starting…'
      : isRunning
        ? 'Stop all'
        : 'Start';

  const openDetail = (): void => {
    void dispatch(setCurrentProjectThunk(projectId)).then((status) => {
      if (status === 200) {
        router.push(PROJECT_DETAIL_PAGE_PATH);
      }
    });
  };

  const handleAction = (): void => {
    void dispatch(
      isRunning ? stopProjectFromSidebarThunk(projectId) : startProjectFromSidebarThunk(projectId),
    );
  };

  return (
    <li className={styles.row}>
      <div className={styles.line}>
        <button type="button" className={styles.name} onClick={openDetail} title="Open project">
          {project.name}
        </button>
        <div className={styles.dots}>
          {runtime.tiers.map((status) => (
            <TierDot key={status.tier} projectId={projectId} status={status} webUrl={project.webUrl} />
          ))}
        </div>
        <button
          type="button"
          className={isRunning ? styles.stop : styles.start}
          disabled={isRunning ? isActionBusy : startDisabled || isRunActive}
          title={!isRunning && isLaunchBusy ? 'Another run or setup is in progress' : undefined}
          onClick={handleAction}
        >
          {buttonLabel}
        </button>
      </div>
      {showFeedback && builder.actionError ? (
        <p className={styles.error}>{builder.actionError}</p>
      ) : null}
      {showFeedback && !builder.actionError && builder.actionMessage ? (
        <p className={styles.message}>{builder.actionMessage}</p>
      ) : null}
    </li>
  );
};

const styles = {
  row: `
    px-3 py-1.5 hover:bg-gray-900/70
  `,
  line: `
    flex items-center gap-2
  `,
  name: `
    min-w-0 flex-1 truncate text-left text-xs font-medium text-gray-200 hover:text-white cursor-pointer
  `,
  dots: `
    flex shrink-0 items-center gap-1
  `,
  start: `
    shrink-0 rounded border border-gray-700 px-2 py-0.5 text-[11px] font-medium text-gray-200
    hover:border-green-600 hover:text-green-300 cursor-pointer
    disabled:cursor-not-allowed disabled:opacity-60
  `,
  stop: `
    shrink-0 rounded border border-gray-700 px-2 py-0.5 text-[11px] font-medium text-gray-300
    hover:border-red-600 hover:text-red-300 cursor-pointer
    disabled:cursor-not-allowed disabled:opacity-60
  `,
  error: `
    mt-0.5 text-[11px] text-red-400
  `,
  message: `
    mt-0.5 text-[11px] text-gray-500
  `,
} as const;
