'use client';

import type { ProjectOverview } from '@/model';
import { InlineText } from '../../inline-text';

type ComponentApiProps = {
  api: NonNullable<ProjectOverview['components'][number]['api']>;
};

const METHOD_STYLES: Record<string, string> = {
  GET: 'bg-green-50 text-green-800 border-green-200',
  POST: 'bg-blue-50 text-blue-800 border-blue-200',
  PUT: 'bg-amber-50 text-amber-800 border-amber-200',
  PATCH: 'bg-amber-50 text-amber-800 border-amber-200',
  DELETE: 'bg-red-50 text-red-800 border-red-200',
  PAGE: 'bg-gray-50 text-gray-600 border-gray-200',
};

/**
 * Endpoints (or, for web apps, pages) one part of the project serves.
 */
export const ComponentApi = ({ api }: ComponentApiProps) => {
  const pagesOnly = api.length > 0 && api.every((e) => e.method === 'PAGE');

  return (
    <div className={styles.root}>
      <h4 className={styles.heading}>{pagesOnly ? 'Pages' : 'API'}</h4>
      {api.length === 0 ? (
        <p className={styles.empty}>No endpoints or pages yet.</p>
      ) : (
        <ul className={styles.list}>
          {api.map((endpoint) => (
            <li key={`${endpoint.method} ${endpoint.path}`} className={styles.row}>
              <span
                className={`${styles.method} ${METHOD_STYLES[endpoint.method] ?? METHOD_STYLES.PAGE}`}
              >
                {endpoint.method}
              </span>
              <div className={styles.text}>
                <code className={styles.path}>{endpoint.path}</code>
                <p className={styles.purpose}>
                  <InlineText text={endpoint.purpose} />
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const styles = {
  root: `min-w-0`,
  heading: `text-[10px] font-semibold uppercase tracking-wide text-gray-500`,
  empty: `text-xs text-gray-500 mt-1.5`,
  list: `mt-1.5 flex flex-col divide-y divide-gray-100 rounded border border-gray-200`,
  row: `flex items-start gap-2 px-2.5 py-1.5`,
  method: `
    w-12 shrink-0 rounded border px-1 py-0.5 text-center font-mono text-[10px] font-semibold
  `,
  text: `min-w-0`,
  path: `block font-mono text-xs text-gray-900 break-all`,
  purpose: `text-xs text-gray-500 leading-relaxed`,
};
