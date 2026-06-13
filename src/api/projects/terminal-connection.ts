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

/**
 * Open a WebSocket to stream PTY I/O for a terminal session.
 */
export const connectTerminalWebSocket = (
  sessionId: string,
  handlers: ConnectHandlers,
): TerminalConnection => {
  const ws = new WebSocket(getTerminalWebSocketUrl(sessionId));

  ws.onopen = () => {
    handlers.onOpen?.();
  };

  ws.onmessage = (event) => {
    handlers.onData(typeof event.data === 'string' ? event.data : String(event.data));
  };

  ws.onclose = () => {
    handlers.onClose?.();
  };

  ws.onerror = () => {
    handlers.onError?.();
  };

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
      ws.close();
    },
  };
};
