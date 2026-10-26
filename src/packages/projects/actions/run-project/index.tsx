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

type ProjectsRunActionProps = {
  projectId: string;
  disabled?: boolean;
  iconOnly?: boolean;
  /** `sm` for projects table (default); `md` for detail header */
  iconSize?: 'sm' | 'md';
};

export const ProjectsRunAction = ({
  projectId,
  disabled,
  iconOnly,
  iconSize = 'sm',
}: ProjectsRunActionProps) => {
  const dispatch = useAppDispatch();
  const runningJobs = useAppSelector((s) => s.runningJobs);
  const projectsBuilder = useAppSelector((s) => s.projectsBuilder);
  const projectRepos = useAppSelector((s) => s.projectRepos);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const runState = useMemo(
    () => ({ runningJobs, projectsBuilder }),
    [runningJobs, projectsBuilder],
  );
  const isRunning = useMemo(() => isProjectRunActive(runState, projectId), [runState, projectId]);
  const isRunBusy = useMemo(() => hasActiveRunOperation(runState), [runState]);
  const label = isRunning ? 'Running…' : 'Run';

  const menuOptions = useMemo((): RunMenuOption[] => {
    const hasExpress = projectHasExpressRepo(projectRepos, projectId);
    const hasWeb = projectHasWebRepo(projectRepos, projectId);
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
  }, [projectRepos, projectId]);

  const showSplit = menuOptions.length > 1;

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
    const targets = key === 'all' ? undefined : [key];
    void dispatch(runProjectThunk(projectId, targets));
  };

  const iconClass = iconSize === 'md' ? styles.iconMd : styles.iconSm;
  const buttonBusy = disabled || isRunBusy;
  const playIcon = isRunning ? (
    <Loader2 className={`${iconClass} animate-spin`} aria-hidden />
  ) : (
    <Play className={iconClass} aria-hidden />
  );

  if (!iconOnly) {
    return (
      <button
        type="button"
        className={styles.primary}
        disabled={buttonBusy}
        onClick={() => run('all')}
      >
        {label}
      </button>
    );
  }

  if (!showSplit) {
    return (
      <button
        type="button"
        className={iconSize === 'md' ? styles.iconPrimaryMd : styles.iconPrimarySm}
        disabled={buttonBusy}
        aria-label={label}
        title={label}
        onClick={() => run('all')}
      >
        {playIcon}
      </button>
    );
  }

  return (
    <div ref={wrapRef} className={styles.splitWrap}>
      <div className={iconSize === 'md' ? styles.splitGroupMd : styles.splitGroupSm}>
        <button
          type="button"
          className={iconSize === 'md' ? styles.splitMainMd : styles.splitMainSm}
          disabled={buttonBusy}
          aria-label={label}
          title={label}
          onClick={() => run('all')}
        >
          {playIcon}
        </button>
        <button
          type="button"
          className={iconSize === 'md' ? styles.splitMenuMd : styles.splitMenuSm}
          disabled={buttonBusy}
          aria-label="Choose servers to run"
          aria-expanded={menuOpen}
          title="Choose servers to run"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <ChevronDown className={iconClass} aria-hidden />
        </button>
      </div>
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
  primary: `
    rounded px-2.5 py-1 text-xs font-medium text-white bg-orange-500
    hover:bg-orange-600 disabled:opacity-50
  `,
  iconPrimarySm: `
    inline-flex items-center justify-center rounded p-1 text-white bg-orange-500
    hover:bg-orange-600 disabled:opacity-50
  `,
  iconPrimaryMd: `
    inline-flex items-center justify-center rounded p-1.5 text-white bg-orange-500
    hover:bg-orange-600 disabled:opacity-50
  `,
  iconSm: `h-3.5 w-3.5`,
  iconMd: `h-5 w-5`,
  splitWrap: `relative inline-flex`,
  splitGroupSm: `
    inline-flex overflow-hidden rounded
  `,
  splitGroupMd: `
    inline-flex overflow-hidden rounded-md
  `,
  splitMainSm: `
    inline-flex items-center justify-center p-1 text-white bg-orange-500
    hover:bg-orange-600 disabled:opacity-50 border-r border-orange-400/80
  `,
  splitMainMd: `
    inline-flex items-center justify-center p-1.5 text-white bg-orange-500
    hover:bg-orange-600 disabled:opacity-50 border-r border-orange-400/80
  `,
  splitMenuSm: `
    inline-flex items-center justify-center px-0.5 text-white bg-orange-500
    hover:bg-orange-600 disabled:opacity-50
  `,
  splitMenuMd: `
    inline-flex items-center justify-center px-1 text-white bg-orange-500
    hover:bg-orange-600 disabled:opacity-50
  `,
  menu: `
    absolute right-0 top-full z-50 mt-1 min-w-[10.5rem] rounded border border-gray-200
    bg-white py-1 shadow-lg
  `,
  menuItem: `
    block w-full px-3 py-1.5 text-left text-xs text-gray-800 hover:bg-gray-100
  `,
};
