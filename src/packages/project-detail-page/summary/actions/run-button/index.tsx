'use client';

import { ChevronDown, Loader2, Play } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';

import type { ProjectRunTarget } from '@/model';
import { useAppDispatch, useAppSelector } from '@/store';
import { runProjectThunk } from '@/store/thunks/projects';
import {
  hasActiveRunOperation,
  isProjectRunActive,
  projectHasExpressRepo,
  projectHasWebRepo,
} from '@/utils/projects';

type RunMenuOption = {
  key: 'all' | ProjectRunTarget;
  label: string;
};

type RunButtonProps = {
  disabled: boolean;
};

/**
 * Labeled Run split button — main runs all servers, the chevron picks a subset.
 */
export const RunButton = ({ disabled }: RunButtonProps) => {
  const dispatch = useAppDispatch();
  const { id } = useAppSelector((s) => s.currentProject);
  const runningJobs = useAppSelector((s) => s.runningJobs);
  const projectsBuilder = useAppSelector((s) => s.projectsBuilder);
  const projectRepos = useAppSelector((s) => s.projectRepos);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const jobState = useMemo(
    () => ({ runningJobs, projectsBuilder }),
    [runningJobs, projectsBuilder],
  );
  const isRunning = useMemo(() => isProjectRunActive(jobState, id), [jobState, id]);
  const isBusy = useMemo(() => hasActiveRunOperation(jobState), [jobState]);

  const menuOptions = useMemo((): RunMenuOption[] => {
    const hasExpress = projectHasExpressRepo(projectRepos, id);
    const hasWeb = projectHasWebRepo(projectRepos, id);
    const options: RunMenuOption[] = [];
    if (hasExpress && hasWeb) {
      options.push({ key: 'all', label: 'All servers' });
    }
    if (hasExpress) {
      options.push({ key: 'express', label: 'Express API only' });
    }
    if (hasWeb) {
      options.push({ key: 'web', label: 'Web only' });
    }
    return options;
  }, [projectRepos, id]);

  useEffect(() => {
    if (!menuOpen) {
      return;
    }
    const onDocumentMouseDown = (event: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', onDocumentMouseDown);
    return () => document.removeEventListener('mousedown', onDocumentMouseDown);
  }, [menuOpen]);

  const run = (key: RunMenuOption['key']) => {
    setMenuOpen(false);
    void dispatch(runProjectThunk(id, key === 'all' ? undefined : [key]));
  };

  const isDisabled = disabled || isBusy;
  const showSplit = menuOptions.length > 1;

  return (
    <div ref={wrapRef} className={styles.wrap}>
      <button
        type="button"
        className={showSplit ? styles.mainSplit : styles.main}
        disabled={isDisabled}
        onClick={() => run('all')}
      >
        {isRunning ? (
          <Loader2 className={styles.iconSpin} aria-hidden />
        ) : (
          <Play className={styles.icon} aria-hidden />
        )}
        {isRunning ? 'Running…' : 'Run'}
      </button>
      {showSplit ? (
        <button
          type="button"
          className={styles.chevron}
          disabled={isDisabled}
          aria-label="Choose servers to run"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <ChevronDown className={styles.icon} aria-hidden />
        </button>
      ) : null}
      {menuOpen ? (
        <div className={styles.menu} role="menu">
          {menuOptions.map((option) => (
            <button
              key={option.key}
              type="button"
              role="menuitem"
              className={styles.menuItem}
              onClick={() => run(option.key)}
            >
              {option.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
};

const styles = {
  wrap: `relative inline-flex`,
  main: `
    inline-flex items-center gap-1.5 text-xs font-medium text-white bg-blue-600
    px-3 py-1.5 rounded border border-blue-600 hover:bg-blue-700 cursor-pointer
    disabled:opacity-50 disabled:cursor-not-allowed
  `,
  mainSplit: `
    inline-flex items-center gap-1.5 text-xs font-medium text-white bg-blue-600
    px-3 py-1.5 rounded-l border border-blue-600 border-r-blue-500 hover:bg-blue-700 cursor-pointer
    disabled:opacity-50 disabled:cursor-not-allowed
  `,
  chevron: `
    inline-flex items-center px-1.5 text-white bg-blue-600 rounded-r border border-l-0 border-blue-600
    hover:bg-blue-700 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed
  `,
  icon: `h-3.5 w-3.5`,
  iconSpin: `h-3.5 w-3.5 animate-spin`,
  menu: `
    absolute right-0 top-full z-50 mt-1 min-w-[10.5rem] rounded border border-gray-200
    bg-white py-1 shadow-lg
  `,
  menuItem: `
    block w-full px-3 py-1.5 text-left text-xs text-gray-800 hover:bg-gray-100 cursor-pointer
  `,
};
