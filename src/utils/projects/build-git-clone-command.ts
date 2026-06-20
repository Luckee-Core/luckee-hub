/**
 * Build a `git clone` shell command from a GitHub repository URL.
 */
export const buildGitCloneCommand = (repoUrl: string): string => {
  const normalized = repoUrl.replace(/\/$/, '');
  const cloneUrl = normalized.endsWith('.git') ? normalized : `${normalized}.git`;
  return `git clone ${cloneUrl}`;
};
