'use client';

import { useCallback, useState } from 'react';

import type { HubProjectRepoType } from '@/model';
import { buildGitCloneCommand } from '@/utils/projects/build-git-clone-command';

type RepoLinkRowProps = {
  repoType: HubProjectRepoType;
  repoName: string;
  repoUrl: string;
};

const repoTypeLabel = (repoType: HubProjectRepoType): string =>
  repoType === 'nextjs' ? 'Web (Next.js)' : 'API (Express)';

export const RepoLinkRow = ({ repoType, repoName, repoUrl }: RepoLinkRowProps) => {
  const [copied, setCopied] = useState(false);
  const cloneCommand = buildGitCloneCommand(repoUrl);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(cloneCommand);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }, [cloneCommand]);

  return (
    <div className={styles.row}>
      <span className={styles.badge}>{repoTypeLabel(repoType)}</span>
      <code className={styles.repoName}>{repoName}</code>
      <div className={styles.actions}>
        <a
          href={repoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.linkButton}
        >
          GitHub
        </a>
        <button type="button" onClick={() => void handleCopy()} className={styles.copyButton}>
          {copied ? 'Copied' : 'Copy clone'}
        </button>
      </div>
      <code className={styles.cloneCommand}>{cloneCommand}</code>
    </div>
  );
};

const styles = {
  row: `
    flex flex-col gap-2 rounded border border-gray-200 bg-gray-50 p-3
  `,
  badge: `
    inline-flex w-fit rounded px-2 py-0.5 text-xs font-medium uppercase tracking-wide
    text-gray-700 bg-white border border-gray-300
  `,
  repoName: `
    text-sm font-mono text-gray-900 break-all
  `,
  actions: `
    flex flex-wrap gap-2
  `,
  linkButton: `
    rounded px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300
    hover:bg-gray-100
  `,
  copyButton: `
    rounded px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300
    hover:bg-gray-100 cursor-pointer
  `,
  cloneCommand: `
    text-xs font-mono text-gray-500 break-all
  `,
};
