'use client';

import { useCallback, useState } from 'react';
import { Copy, Check, Github } from 'lucide-react';

import type { HubProjectRepoType } from '@/model';
import { buildGitCloneCommand } from '@/utils/projects/build-git-clone-command';

type RepoLinkRowProps = {
  repoType: HubProjectRepoType;
  repoUrl: string;
};

const repoTypeLabel = (repoType: HubProjectRepoType): string =>
  repoType === 'nextjs' ? 'Web' : 'Express';

/**
 * Inline repo controls: label + clone (copy) icon + GitHub icon.
 */
export const RepoLinkRow = ({ repoType, repoUrl }: RepoLinkRowProps) => {
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
    <span className={styles.group}>
      <span className={styles.label}>{repoTypeLabel(repoType)}</span>
      <button
        type="button"
        onClick={() => void handleCopy()}
        className={styles.iconButton}
        aria-label={copied ? 'Copied clone command' : `Copy ${repoTypeLabel(repoType)} clone command`}
        title={copied ? 'Copied' : 'Copy git clone'}
      >
        {copied ? (
          <Check className={styles.icon} aria-hidden />
        ) : (
          <Copy className={styles.icon} aria-hidden />
        )}
      </button>
      <a
        href={repoUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.iconButton}
        aria-label={`Open ${repoTypeLabel(repoType)} on GitHub`}
        title="Open GitHub"
      >
        <Github className={styles.icon} aria-hidden />
      </a>
    </span>
  );
};

const styles = {
  group: `inline-flex items-center gap-1`,
  label: `text-xs font-medium text-gray-700`,
  iconButton: `
    inline-flex items-center justify-center rounded p-1 text-gray-600
    hover:bg-gray-100 hover:text-gray-900 cursor-pointer border-none bg-transparent
  `,
  icon: `h-3.5 w-3.5`,
};
