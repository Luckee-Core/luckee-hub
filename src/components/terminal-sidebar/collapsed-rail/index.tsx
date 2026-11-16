'use client';

import { useMemo } from 'react';
import { PanelRightOpen } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store';
import {
  focusProjectTerminalThunk,
  setTerminalSidebarOpenThunk,
} from '@/store/thunks/terminal-sidebar';

/**
 * Collapsed sidebar: expand button, live terminal count, one dot per project with a terminal open.
 */
export const TerminalSidebarCollapsedRail = () => {
  const dispatch = useAppDispatch();
  const terminalSessions = useAppSelector((state) => state.terminalSessions);
  const projects = useAppSelector((state) => state.projects);

  const terminalCount = useMemo(() => Object.keys(terminalSessions).length, [terminalSessions]);
  const runningProjects = useMemo(() => {
    const ids = [...new Set(Object.values(terminalSessions).map((session) => session.projectId))];
    return ids
      .map((projectId) => ({ projectId, name: projects[projectId]?.name ?? projectId }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [terminalSessions, projects]);

  return (
    <aside className={styles.rail} aria-label="Terminals (collapsed)">
      <button
        type="button"
        className={styles.expand}
        aria-label="Open terminal sidebar (⌘J)"
        title="Open terminals (⌘J)"
        onClick={() => void dispatch(setTerminalSidebarOpenThunk(true))}
      >
        <PanelRightOpen className={styles.icon} aria-hidden />
      </button>
      {terminalCount > 0 ? <span className={styles.count}>{terminalCount}</span> : null}
      <div className={styles.dots}>
        {runningProjects.map((project) => (
          <button
            key={project.projectId}
            type="button"
            title={project.name}
            aria-label={`Show ${project.name} terminal`}
            className={styles.dot}
            onClick={() => void dispatch(focusProjectTerminalThunk(project.projectId))}
          />
        ))}
      </div>
    </aside>
  );
};

const styles = {
  rail: `
    flex h-screen w-11 shrink-0 flex-col items-center gap-2 border-l border-gray-300 bg-white py-2
  `,
  expand: `
    rounded-md p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-900 cursor-pointer
  `,
  icon: `
    h-4 w-4
  `,
  count: `
    rounded-full bg-blue-50 px-1.5 text-[10px] font-semibold text-blue-700
  `,
  dots: `
    mt-1 flex flex-col items-center gap-2
  `,
  dot: `
    h-2.5 w-2.5 rounded-full bg-green-500 cursor-pointer hover:ring-2 hover:ring-green-300
  `,
} as const;
