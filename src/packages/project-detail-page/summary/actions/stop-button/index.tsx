'use client';

import { Loader2, Square } from 'lucide-react';
import { useMemo, useState } from 'react';

import { detailPageStyles } from '@/components/detail-page-styles';
import { useAppDispatch, useAppSelector } from '@/store';
import { closeProjectTerminalsThunk } from '@/store/thunks/projects';

/**
 * Stop the project's hub terminals (and Postgres it started), when anything is running.
 */
export const StopButton = () => {
  const dispatch = useAppDispatch();
  const { id } = useAppSelector((s) => s.currentProject);
  const projects = useAppSelector((s) => s.projects);
  const terminalSessions = useAppSelector((s) => s.terminalSessions);
  const [isStopping, setIsStopping] = useState(false);

  const canStop = useMemo(
    () =>
      Object.values(terminalSessions).some((session) => session.projectId === id) ||
      Boolean(projects[id]?.postgresActiveConsumer),
    [terminalSessions, projects, id],
  );

  const handleStop = async () => {
    setIsStopping(true);
    try {
      await dispatch(closeProjectTerminalsThunk(id));
    } finally {
      setIsStopping(false);
    }
  };

  return (
    <button
      type="button"
      className={detailPageStyles.secondaryButton}
      disabled={!canStop || isStopping}
      title={canStop ? 'Stop hub terminals for this project' : 'Nothing running'}
      onClick={() => void handleStop()}
    >
      {isStopping ? (
        <Loader2 className={styles.iconSpin} aria-hidden />
      ) : (
        <Square className={styles.icon} aria-hidden />
      )}
      {isStopping ? 'Stopping…' : 'Stop'}
    </button>
  );
};

const styles = {
  icon: `h-3.5 w-3.5`,
  iconSpin: `h-3.5 w-3.5 animate-spin`,
};
