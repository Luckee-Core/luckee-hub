/**
 * Hub catalog projects shown in the Available section.
 * All other registry projects appear under Coming soon.
 * Coming soon projects can still use Setup / Run.
 */
export const HUB_AVAILABLE_PROJECT_IDS = [
  'app-store-manager',
  'code-commit-summaries',
  'code-control',
  'code-your-resume',
  'design-prompter',
  'innertube',
  'lead-studio',
  'local-scheduler',
  'mac-manager',
  'my-ai-threads',
  'my-fundraise',
  'my-gmail-manager',
  'my-health',
  'my-nonprofit',
  'my-ops-tracker',
  'personal-finances',
  'qr-code-generator',
  'website-site-scraper',
] as const;

const HUB_AVAILABLE_PROJECT_ID_SET = new Set<string>(HUB_AVAILABLE_PROJECT_IDS);

/**
 * True when a catalog project is in the Available launcher section.
 */
export const isHubProjectAvailable = (projectId: string): boolean =>
  HUB_AVAILABLE_PROJECT_ID_SET.has(projectId);
