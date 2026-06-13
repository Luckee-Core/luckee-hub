'use client';

import { useCallback, useEffect, useRef } from 'react';
import { FitAddon } from '@xterm/addon-fit';
import { Terminal } from '@xterm/xterm';
import '@xterm/xterm/css/xterm.css';

import { connectTerminalWebSocket } from '@/api/projects';

type TerminalSessionPanelProps = {
  sessionId: string;
  isActive: boolean;
  dockOpen: boolean;
};

/**
 * One xterm + WebSocket per session so tab switches preserve scrollback.
 */
export const TerminalSessionPanel = ({
  sessionId,
  isActive,
  dockOpen,
}: TerminalSessionPanelProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const terminalRef = useRef<Terminal | null>(null);
  const fitRef = useRef<FitAddon | null>(null);
  const connectionRef = useRef<ReturnType<typeof connectTerminalWebSocket> | null>(null);

  const safeFit = useCallback((): void => {
    const container = containerRef.current;
    const fitAddon = fitRef.current;
    const terminal = terminalRef.current;
    if (!container || !fitAddon || !terminal) {
      return;
    }
    if (container.clientWidth < 2 || container.clientHeight < 2) {
      return;
    }
    try {
      fitAddon.fit();
      connectionRef.current?.resize(terminal.cols, terminal.rows);
    } catch {
      // Container not ready for xterm layout yet.
    }
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    const terminal = new Terminal({
      cursorBlink: true,
      fontSize: 13,
      fontFamily: 'Menlo, Monaco, "Courier New", monospace',
      theme: {
        background: '#0a0a0a',
        foreground: '#e5e5e5',
      },
      scrollback: 5000,
    });
    const fitAddon = new FitAddon();
    terminal.loadAddon(fitAddon);
    terminal.open(container);

    terminalRef.current = terminal;
    fitRef.current = fitAddon;

    const connection = connectTerminalWebSocket(sessionId, {
      onOpen: () => {
        requestAnimationFrame(() => safeFit());
      },
      onData: (data) => {
        terminal.write(data);
      },
      onClose: () => {
        terminal.writeln('\r\n\r\n[session disconnected]');
      },
      onError: () => {
        terminal.writeln('\r\n\r\n[connection error]');
      },
    });
    connectionRef.current = connection;

    const inputDisposable = terminal.onData((data) => {
      connection.sendInput(data);
    });

    const resizeObserver = new ResizeObserver(() => {
      safeFit();
    });
    resizeObserver.observe(container);

    const onWindowResize = (): void => {
      safeFit();
    };
    window.addEventListener('resize', onWindowResize);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => safeFit());
    });

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', onWindowResize);
      inputDisposable.dispose();
      connection.close();
      connectionRef.current = null;
      terminal.dispose();
      terminalRef.current = null;
      fitRef.current = null;
    };
  }, [sessionId, safeFit]);

  useEffect(() => {
    if (isActive && dockOpen) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => safeFit());
      });
    }
  }, [isActive, dockOpen, safeFit]);

  return (
    <div
      ref={containerRef}
      className={isActive && dockOpen ? styles.panelActive : styles.panelInactive}
      aria-hidden={!isActive}
    />
  );
};

const styles = {
  panelActive: `
    absolute inset-0 h-full w-full p-1
    [&_.xterm]:h-full [&_.xterm]:w-full
  `,
  panelInactive: `
    absolute inset-0 h-full w-full p-1 invisible pointer-events-none
    [&_.xterm]:h-full [&_.xterm]:w-full
  `,
};
