/**
 * Hub catalog projects shown in the Almost ready section.
 * Work in progress and Coming soon tiers are listed below.
 */
export const HUB_ALMOST_READY_PROJECT_IDS = [
  'app-store-manager',
  'code-commit-summaries',
  'code-control',
  'code-your-resume',
  'design-prompter',
  'extract-text',
  'innertube',
  'lead-studio',
  'local-scheduler',
  'mac-manager',
  'make-it-sound-like-me',
  'my-ai-threads',
  'my-fundraise',
  'my-gmail-manager',
  'my-health',
  'my-local-postgres',
  'my-nonprofit',
  'my-ops-tracker',
  'my-vercel-analytics',
  'on-device-dispatcher',
  'personal-finances',
  'qr-code-generator',
  'reddit-scraper',
  'speech-therapy-tracker',
  'trade-stocks',
  'upwork-manager',
  'website-site-scraper',
] as const;

/**
 * Catalog projects in the Work in progress section.
 * Empty by default — assign via the table Section dropdown (or add ids here).
 */
export const HUB_WORK_IN_PROGRESS_PROJECT_IDS = [] as const;

/** Catalog projects in the Active launcher section (not the Running / terminals section). */
export const HUB_ACTIVE_PROJECT_IDS = [] as const;

/** Catalog projects in Final steps before Active. */
export const HUB_FINAL_STEPS_PROJECT_IDS = [] as const;

/** Catalog projects that are cancelled / shelved in the hub. */
export const HUB_CANCELLED_PROJECT_IDS = [] as const;

/** @deprecated Use `HUB_ALMOST_READY_PROJECT_IDS`. */
export const HUB_AVAILABLE_PROJECT_IDS = HUB_ALMOST_READY_PROJECT_IDS;

const HUB_ALMOST_READY_PROJECT_ID_SET = new Set<string>(HUB_ALMOST_READY_PROJECT_IDS);
const HUB_WORK_IN_PROGRESS_PROJECT_ID_SET = new Set<string>(HUB_WORK_IN_PROGRESS_PROJECT_IDS);
const HUB_ACTIVE_PROJECT_ID_SET = new Set<string>(HUB_ACTIVE_PROJECT_IDS);
const HUB_FINAL_STEPS_PROJECT_ID_SET = new Set<string>(HUB_FINAL_STEPS_PROJECT_IDS);
const HUB_CANCELLED_PROJECT_ID_SET = new Set<string>(HUB_CANCELLED_PROJECT_IDS);

export const isHubProjectAlmostReady = (projectId: string): boolean =>
  HUB_ALMOST_READY_PROJECT_ID_SET.has(projectId);

export const isHubProjectWorkInProgress = (projectId: string): boolean =>
  HUB_WORK_IN_PROGRESS_PROJECT_ID_SET.has(projectId);

export const isHubProjectActive = (projectId: string): boolean =>
  HUB_ACTIVE_PROJECT_ID_SET.has(projectId);

export const isHubProjectFinalSteps = (projectId: string): boolean =>
  HUB_FINAL_STEPS_PROJECT_ID_SET.has(projectId);

export const isHubProjectCancelled = (projectId: string): boolean =>
  HUB_CANCELLED_PROJECT_ID_SET.has(projectId);

/** @deprecated Use `isHubProjectAlmostReady`. */
export const isHubProjectAvailable = isHubProjectAlmostReady;
