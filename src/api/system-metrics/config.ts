const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://127.0.0.1:3001';

/**
 * Base URL for luckee-hub-express-server (no trailing slash).
 */
export const systemMetricsApiBase = API_BASE.replace(/\/$/, '');
