'use client';

import { useMemo } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store';
import { setRunningSectionCollapsedThunk } from '@/store/thunks/terminal-sidebar';
import { NOT_SET_UP_HOOK_STATUSES } from '../terminal-sidebar-constants';
import { RunningServicesRow } from './row';

const NOT_SET_UP = new Set<string>(NOT_SET_UP_HOOK_STATUSES);

/**
 * Every set-up project with its API / web / storage status and Start or Stop all, running first.
 */
export const RunningServices = () => {
  const dispatch = useAppDispatch();
  const builder = useAppSelector((state) => state.terminalSidebarBuilder);
  const projects = useAppSelector((state) => state.projects);
  const terminalSessions = useAppSelector((state) => state.terminalSessions);

  const rows = useMemo(() => {
    const projectIdsWithTerminals = new Set(
      Object.values(terminalSessions).map((session) => session.projectId),
    );
    return Object.values(projects)
      .filter(
        (project) =>
          projectIdsWithTerminals.has(project.id) ||
          (project.enabled && !NOT_SET_UP.has(project.hookStatus)),
      )
      .map((project) => ({
        id: project.id,
        name: project.name,
        running:
          projectIdsWithTerminals.has(project.id) ||
          project.hookStatus === 'api_running' ||
          project.hookStatus === 'web_running' ||
          project.hookStatus === 'ready' ||
          Boolean(project.storageRunning),
      }))
      .sort((a, b) =>
        a.running === b.running ? a.name.localeCompare(b.name) : a.running ? -1 : 1,
      );
  }, [projects, terminalSessions]);

  const runningCount = useMemo(() => rows.filter((row) => row.running).length, [rows]);
  const collapsed = builder.isRunningSectionCollapsed;
  const Chevron = collapsed ? ChevronRight : ChevronDown;

  return (
    <section className={styles.section}>
      <button
        type="button"
        className={styles.toggle}
        aria-expanded={!collapsed}
        onClick={() => void dispatch(setRunningSectionCollapsedThunk(!collapsed))}
      >
        <Chevron className={styles.chevron} aria-hidden />
        Running
        <span className={styles.count}>
          {runningCount}/{rows.length}
        </span>
      </button>
      {builder.runtimeLastSyncError ? (
        <p className={styles.error}>{builder.runtimeLastSyncError}</p>
      ) : null}
      {collapsed ? null : (
        <ul className={styles.list}>
          {rows.length === 0 ? (
            <li className={styles.empty}>No set-up projects yet.</li>
          ) : (
            rows.map((row) => <RunningServicesRow key={row.id} projectId={row.id} />)
          )}
        </ul>
      )}
    </section>
  );
};

const styles = {
  section: `
    shrink-0 border-b border-gray-800
  `,
  toggle: `
    flex w-full items-center gap-1.5 px-3 py-2 text-xs font-semibold uppercase tracking-wide
    text-gray-400 hover:text-gray-200 cursor-pointer
  `,
  chevron: `
    h-3.5 w-3.5
  `,
  count: `
    ml-auto font-mono text-[11px] normal-case text-gray-500
  `,
  error: `
    px-3 pb-1 text-[11px] text-red-400
  `,
  list: `
    max-h-64 overflow-y-auto pb-1
  `,
  empty: `
    px-3 py-1.5 text-[11px] text-gray-500
  `,
} as const;
