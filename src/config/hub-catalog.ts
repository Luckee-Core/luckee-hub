import type { HubProjectRepoType } from '@/model';

export const HUB_GITHUB_ORG = 'Luckee-Core';

export type HubCatalogRepo = {
  repoType: HubProjectRepoType;
  repoName: string;
  defaultApiPort?: number;
  defaultWebPortStart?: number;
  healthPath?: string;
};

export type HubCatalogProject = {
  id: string;
  name: string;
  description: string;
  localDatabaseSupported: boolean;
  repos: HubCatalogRepo[];
};

/**
 * Luckee Hub project catalog — source of truth in this repo.
 * Express probes hub.local.json against these ids on refresh.
 */
export const HUB_CATALOG: HubCatalogProject[] = [
  {
    id: 'lead-studio',
    name: 'Lead Studio',
    description: 'Lead CRM, research workers, email queue',
    localDatabaseSupported: false,
    repos: [
      {
        repoType: 'express',
        repoName: 'lead-studio-express-server',
        defaultApiPort: 3032,
        healthPath: '/api/health',
      },
      {
        repoType: 'nextjs',
        repoName: 'lead-studio-web-open-source',
        defaultWebPortStart: 3033,
      },
    ],
  },
  {
    id: 'my-health',
    name: 'My Health',
    description: 'Self-hosted health dashboard',
    localDatabaseSupported: true,
    repos: [
      {
        repoType: 'express',
        repoName: 'my-health-open-source-express-server',
        defaultApiPort: 3009,
        healthPath: '/api/health',
      },
      {
        repoType: 'nextjs',
        repoName: 'my-health-open-source',
        defaultWebPortStart: 3010,
      },
    ],
  },
  {
    id: 'my-fundraise',
    name: 'My Fundraise',
    description: 'Investors CRM, graphics studio (TSX preview), and pitch deck slide coach',
    localDatabaseSupported: false,
    repos: [
      {
        repoType: 'express',
        repoName: 'my-fundraise-express-server',
        defaultApiPort: 3090,
        healthPath: '/api/health',
      },
      {
        repoType: 'nextjs',
        repoName: 'my-fundraise-web',
        defaultWebPortStart: 3091,
      },
    ],
  },
  {
    id: 'my-nonprofit',
    name: 'My Nonprofit',
    description: 'PA/Philadelphia nonprofit formation wizard with AI document drafts',
    localDatabaseSupported: false,
    repos: [
      {
        repoType: 'express',
        repoName: 'my-nonprofit-express-server',
        defaultApiPort: 3080,
        healthPath: '/api/health',
      },
      {
        repoType: 'nextjs',
        repoName: 'my-nonprofit-console',
        defaultWebPortStart: 3081,
      },
    ],
  },
  {
    id: 'personal-finances',
    name: 'Personal Finances',
    description: 'Money dashboard with CSV imports and AI prompts',
    localDatabaseSupported: false,
    repos: [
      {
        repoType: 'express',
        repoName: 'personal-finances-express-server',
        defaultApiPort: 3011,
        healthPath: '/api/health',
      },
      {
        repoType: 'nextjs',
        repoName: 'personal-finances',
        defaultWebPortStart: 3012,
      },
    ],
  },
  {
    id: 'knowledge-studio',
    name: 'Knowledge Studio',
    description: 'YouTube and knowledge workflows',
    localDatabaseSupported: false,
    repos: [
      {
        repoType: 'express',
        repoName: 'knowledge-studio-express-server',
        defaultApiPort: 3020,
        healthPath: '/api/health',
      },
      {
        repoType: 'nextjs',
        repoName: 'knowledge-studio-open-source',
        defaultWebPortStart: 3021,
      },
    ],
  },
  {
    id: 'blog-studio',
    name: 'Blog Studio',
    description: 'Blog authoring and distribution',
    localDatabaseSupported: false,
    repos: [
      {
        repoType: 'express',
        repoName: 'blog-studio-open-source-express-server',
        defaultApiPort: 3025,
        healthPath: '/api/health',
      },
      {
        repoType: 'nextjs',
        repoName: 'blog-studio-open-source-web',
        defaultWebPortStart: 3026,
      },
    ],
  },
  {
    id: 'code-control',
    name: 'Code Control',
    description: 'Schema, conventions, and guided codegen into customer repos',
    localDatabaseSupported: false,
    repos: [
      {
        repoType: 'express',
        repoName: 'code-control-express-server',
        defaultApiPort: 3074,
        healthPath: '/api/health',
      },
      {
        repoType: 'nextjs',
        repoName: 'code-control',
        defaultWebPortStart: 3075,
      },
    ],
  },
  {
    id: 'code-your-resume',
    name: 'Code Your Resume',
    description: 'Job-search CRM and resume studios',
    localDatabaseSupported: false,
    repos: [
      {
        repoType: 'express',
        repoName: 'code-your-resume-open-source-express-server',
        defaultApiPort: 3053,
        healthPath: '/api/health',
      },
      {
        repoType: 'nextjs',
        repoName: 'code-your-resume-open-source',
        defaultWebPortStart: 3054,
      },
    ],
  },
  {
    id: 'luckee-blueprints',
    name: 'Luckee Blueprints',
    description: 'Workforce training and certifications',
    localDatabaseSupported: false,
    repos: [
      {
        repoType: 'express',
        repoName: 'luckee-blueprints-express-server',
        defaultApiPort: 3040,
        healthPath: '/api/health',
      },
      {
        repoType: 'nextjs',
        repoName: 'luckee-blueprints',
        defaultWebPortStart: 3041,
      },
    ],
  },
  {
    id: 'luckee-open-source',
    name: 'Luckee Open Source',
    description: 'Lead and ops CRM-style modular dashboard',
    localDatabaseSupported: false,
    repos: [
      {
        repoType: 'nextjs',
        repoName: 'luckee-open-source',
        defaultWebPortStart: 3031,
      },
    ],
  },
  {
    id: 'local-scheduler',
    name: 'Local Scheduler',
    description: 'Local cron studio for worker Express APIs (email queue, etc.)',
    localDatabaseSupported: false,
    repos: [
      {
        repoType: 'express',
        repoName: 'local-scheduler-express-server',
        defaultApiPort: 4120,
        healthPath: '/api/health',
      },
      {
        repoType: 'nextjs',
        repoName: 'local-scheduler-web',
        defaultWebPortStart: 4121,
      },
    ],
  },
  {
    id: 'qr-code-generator',
    name: 'QR Code Generator',
    description: 'QR generation API utilities',
    localDatabaseSupported: false,
    repos: [
      {
        repoType: 'express',
        repoName: 'qr-code-generator-open-source-express-server',
        defaultApiPort: 3060,
        healthPath: '/api/health',
      },
    ],
  },
  {
    id: 'instagram-studio',
    name: 'Instagram Studio',
    description: 'Instagram carousel content and Graph publishing',
    localDatabaseSupported: false,
    repos: [
      {
        repoType: 'express',
        repoName: 'instagram-studio-open-source-express-server',
        defaultApiPort: 3070,
        healthPath: '/api/health',
      },
      {
        repoType: 'nextjs',
        repoName: 'instagram-studio-open-source',
        defaultWebPortStart: 3071,
      },
    ],
  },
  {
    id: 'tiktok-studio',
    name: 'TikTok Studio',
    description: 'TikTok carousel content and publishing',
    localDatabaseSupported: false,
    repos: [
      {
        repoType: 'express',
        repoName: 'tiktok-studio-express-server',
        defaultApiPort: 3072,
        healthPath: '/api/health',
      },
      {
        repoType: 'nextjs',
        repoName: 'tiktok-studio',
        defaultWebPortStart: 3073,
      },
    ],
  },
];
