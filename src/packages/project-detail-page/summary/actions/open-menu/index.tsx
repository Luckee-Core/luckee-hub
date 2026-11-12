'use client';

import { ChevronDown, Globe, SquareTerminal } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';

import { detailPageStyles } from '@/components/detail-page-styles';
import { useAppDispatch, useAppSelector } from '@/store';
import { openProjectChromeThunk, openProjectCursorThunk } from '@/store/thunks/projects';
import { projectHasWebRepo } from '@/utils/projects';

type OpenMenuProps = {
  disabled: boolean;
};

/**
 * "Open" dropdown — open the project in Cursor or the web app in Chrome.
 */
export const OpenMenu = ({ disabled }: OpenMenuProps) => {
  const dispatch = useAppDispatch();
  const { id } = useAppSelector((s) => s.currentProject);
  const projectRepos = useAppSelector((s) => s.projectRepos);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const hasWeb = useMemo(() => projectHasWebRepo(projectRepos, id), [projectRepos, id]);

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

  return (
    <div ref={wrapRef} className={styles.wrap}>
      <button
        type="button"
        className={detailPageStyles.secondaryButton}
        disabled={disabled}
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen((open) => !open)}
      >
        Open
        <ChevronDown className={styles.icon} aria-hidden />
      </button>
      {menuOpen ? (
        <div className={styles.menu} role="menu">
          <button
            type="button"
            role="menuitem"
            className={styles.menuItem}
            onClick={() => {
              setMenuOpen(false);
              void dispatch(openProjectCursorThunk(id));
            }}
          >
            <SquareTerminal className={styles.icon} aria-hidden />
            Open in Cursor
          </button>
          <button
            type="button"
            role="menuitem"
            className={styles.menuItem}
            disabled={!hasWeb}
            onClick={() => {
              setMenuOpen(false);
              void dispatch(openProjectChromeThunk(id));
            }}
          >
            <Globe className={styles.icon} aria-hidden />
            Open web in Chrome
          </button>
        </div>
      ) : null}
    </div>
  );
};

const styles = {
  wrap: `relative inline-flex`,
  icon: `h-3.5 w-3.5`,
  menu: `
    absolute right-0 top-full z-50 mt-1 min-w-[11rem] rounded border border-gray-200
    bg-white py-1 shadow-lg
  `,
  menuItem: `
    flex w-full items-center gap-2 px-3 py-1.5 text-left text-xs text-gray-800
    hover:bg-gray-100 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed
  `,
};
