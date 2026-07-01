const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://127.0.0.1:3001';

/**
 * Base URL for luckee-hub-express-server project APIs (no trailing slash).
 * Reads `NEXT_PUBLIC_API_URL`; defaults to `http://127.0.0.1:3001` when unset.
 */
export const projectsApiBase = API_BASE.replace(/\/$/, '');
