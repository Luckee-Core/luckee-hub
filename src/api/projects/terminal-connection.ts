import { getTerminalWebSocketUrl } from './terminal';

export type TerminalConnection = {
  sendInput: (data: string) => void;
  resize: (cols: number, rows: number) => void;
  close: () => void;
};

type ConnectHandlers = {
  onData: (data: string) => void;
  onOpen?: () => void;
  onClose?: () => void;
  onError?: () => void;
};

const RETRY_DELAYS_MS = [400, 800, 1600];

/**
 * Open a WebSocket to stream PTY I/O for a terminal session.
 * Unexpected closes retry a few times; `close()` is silent.
 */
export const connectTerminalWebSocket = (
  sessionId: string,
  handlers: ConnectHandlers,
): TerminalConnection => {
  let ws: WebSocket;
  let intentional = false;
  let retryCount = 0;
  let retryTimer: ReturnType<typeof setTimeout> | null = null;

  const clearRetryTimer = (): void => {
    if (retryTimer !== null) {
      clearTimeout(retryTimer);
      retryTimer = null;
    }
  };

  const attach = (): void => {
    ws = new WebSocket(getTerminalWebSocketUrl(sessionId));

    ws.onopen = () => {
      retryCount = 0;
      handlers.onOpen?.();
    };

    ws.onmessage = (event) => {
      handlers.onData(typeof event.data === 'string' ? event.data : String(event.data));
    };

    ws.onclose = () => {
      if (intentional) {
        return;
      }
      if (retryCount < RETRY_DELAYS_MS.length) {
        const delay = RETRY_DELAYS_MS[retryCount] ?? 1600;
        retryCount += 1;
        retryTimer = setTimeout(() => {
          attach();
        }, delay);
        return;
      }
      handlers.onClose?.();
    };

    ws.onerror = () => {
      // Browser follows with onclose.
    };
  };

  attach();

  return {
    sendInput: (data: string) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(data);
      }
    },
    resize: (cols: number, rows: number) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: 'resize', cols, rows }));
      }
    },
    close: () => {
      intentional = true;
      clearRetryTimer();
      ws.close();
    },
  };
};
