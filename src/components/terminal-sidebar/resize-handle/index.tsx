'use client';

import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import {
  persistTerminalSidebarWidthThunk,
  resetTerminalSidebarWidthThunk,
  setTerminalSidebarWidthThunk,
} from '@/store/thunks/terminal-sidebar';

/**
 * Drag the sidebar's left edge to resize; double-click to reset.
 */
export const TerminalSidebarResizeHandle = () => {
  const dispatch = useAppDispatch();
  const builder = useAppSelector((state) => state.terminalSidebarBuilder);

  const handlePointerDown = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      event.preventDefault();
      const startX = event.clientX;
      const startWidth = builder.width;

      const handlePointerMove = (moveEvent: PointerEvent): void => {
        void dispatch(setTerminalSidebarWidthThunk(startWidth + (startX - moveEvent.clientX)));
      };
      const handlePointerUp = (): void => {
        document.removeEventListener('pointermove', handlePointerMove);
        document.removeEventListener('pointerup', handlePointerUp);
        document.body.classList.remove('select-none');
        void dispatch(persistTerminalSidebarWidthThunk());
      };

      document.body.classList.add('select-none');
      document.addEventListener('pointermove', handlePointerMove);
      document.addEventListener('pointerup', handlePointerUp);
    },
    [builder.width, dispatch],
  );

  return (
    <div
      className={styles.handle}
      role="separator"
      aria-orientation="vertical"
      aria-label="Resize terminal sidebar"
      onPointerDown={handlePointerDown}
      onDoubleClick={() => void dispatch(resetTerminalSidebarWidthThunk())}
    />
  );
};

const styles = {
  handle: `
    absolute inset-y-0 left-0 z-10 w-1.5 -translate-x-1/2 cursor-ew-resize
    bg-transparent transition-colors hover:bg-blue-500/70 active:bg-blue-500
  `,
} as const;
