'use client';

import { Check, Copy } from 'lucide-react';
import { useState } from 'react';

import { buildGitCloneCommand } from '@/utils/projects';

type CloneCopyButtonProps = {
  repoUrl: string;
  className: string;
  iconClassName: string;
};

/**
 * Copies `git clone <url>` to the clipboard; shows a check for 2s.
 */
export const CloneCopyButton = ({ repoUrl, className, iconClassName }: CloneCopyButtonProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(buildGitCloneCommand(repoUrl));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <button
      type="button"
      className={className}
      title={copied ? 'Copied' : 'Copy git clone command'}
      aria-label={copied ? 'Copied clone command' : 'Copy git clone command'}
      onClick={() => void handleCopy()}
    >
      {copied ? (
        <Check className={`${iconClassName} text-green-600`} aria-hidden />
      ) : (
        <Copy className={iconClassName} aria-hidden />
      )}
    </button>
  );
};
