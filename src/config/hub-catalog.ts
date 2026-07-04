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
 * Preferred ports: hub 3000/3001; projects 3010+ (API even, web +1).
 */
export const HUB_CATALOG: HubCatalogProject[] = [
  {
    id: 'blog-studio',
    name: 'Blog Studio',
    description: 'Blog authoring and distribution',
    localDatabaseSupported: false,
    repos: [
      {
        repoType: 'express',
        repoName: 'blog-studio-open-source-express-server',
        defaultApiPort: 3010,
        healthPath: '/api/health',
      },
      {
        repoType: 'nextjs',
        repoName: 'blog-studio-open-source-web',
        defaultWebPortStart: 3011,
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
        defaultApiPort: 3012,
        healthPath: '/api/health',
      },
      {
        repoType: 'nextjs',
        repoName: 'code-control',
        defaultWebPortStart: 3013,
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
        defaultApiPort: 3014,
        healthPath: '/api/health',
      },
      {
        repoType: 'nextjs',
        repoName: 'code-your-resume-open-source',
        defaultWebPortStart: 3015,
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
        defaultApiPort: 3016,
        healthPath: '/api/health',
      },
      {
        repoType: 'nextjs',
        repoName: 'instagram-studio-open-source',
        defaultWebPortStart: 3017,
      },
    ],
  },
  {
    id: 'innertube',
    name: 'Innertube',
    description: 'YouTube video library with InnerTube transcript fetch and persistence',
    localDatabaseSupported: false,
    repos: [
      {
        repoType: 'express',
        repoName: 'innertube-retriever-express-server',
        defaultApiPort: 3048,
        healthPath: '/api/health',
      },
      {
        repoType: 'nextjs',
        repoName: 'innertube-web',
        defaultWebPortStart: 3049,
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
        defaultApiPort: 3018,
        healthPath: '/api/health',
      },
      {
        repoType: 'nextjs',
        repoName: 'knowledge-studio-open-source',
        defaultWebPortStart: 3019,
      },
    ],
  },
  {
    id: 'lead-studio',
    name: 'Lead Studio',
    description: 'Lead CRM, research workers, email queue',
    localDatabaseSupported: false,
    repos: [
      {
        repoType: 'express',
        repoName: 'lead-studio-express-server',
        defaultApiPort: 3020,
        healthPath: '/api/health',
      },
      {
        repoType: 'nextjs',
        repoName: 'lead-studio-web-open-source',
        defaultWebPortStart: 3021,
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
        defaultApiPort: 3022,
        healthPath: '/api/health',
      },
      {
        repoType: 'nextjs',
        repoName: 'local-scheduler-web',
        defaultWebPortStart: 3023,
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
        defaultApiPort: 3024,
        healthPath: '/api/health',
      },
      {
        repoType: 'nextjs',
        repoName: 'luckee-blueprints',
        defaultWebPortStart: 3025,
      },
    ],
  },
  {
    id: 'luckee-open-source',
    name: 'Luckee Open Source',
    description: 'Leads, contacts, and outbound email pipeline',
    localDatabaseSupported: false,
    repos: [
      {
        repoType: 'express',
        repoName: 'luckee-open-source-express-server',
        defaultApiPort: 3026,
        healthPath: '/api/health',
      },
      {
        repoType: 'nextjs',
        repoName: 'luckee-open-source',
        defaultWebPortStart: 3027,
      },
    ],
  },
  {
    id: 'my-ai-threads',
    name: 'My AI Threads',
    description: 'Search, browse, and Ask over local Cursor agent transcripts',
    localDatabaseSupported: false,
    repos: [
      {
        repoType: 'express',
        repoName: 'my-ai-threads-express-server',
        defaultApiPort: 3028,
        healthPath: '/api/health',
      },
      {
        repoType: 'nextjs',
        repoName: 'my-ai-threads-console',
        defaultWebPortStart: 3029,
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
        defaultApiPort: 3030,
        healthPath: '/api/health',
      },
      {
        repoType: 'nextjs',
        repoName: 'my-fundraise-web',
        defaultWebPortStart: 3031,
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
        defaultApiPort: 3032,
        healthPath: '/api/health',
      },
      {
        repoType: 'nextjs',
        repoName: 'my-health-open-source',
        defaultWebPortStart: 3033,
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
        defaultApiPort: 3034,
        healthPath: '/api/health',
      },
      {
        repoType: 'nextjs',
        repoName: 'my-nonprofit-console',
        defaultWebPortStart: 3035,
      },
    ],
  },
  {
    id: 'my-ops-tracker',
    name: 'My Ops Tracker',
    description: 'Customers, projects, tickets, and time tracking',
    localDatabaseSupported: false,
    repos: [
      {
        repoType: 'express',
        repoName: 'my-ops-tracker-express-server',
        defaultApiPort: 3036,
        healthPath: '/api/health',
      },
      {
        repoType: 'nextjs',
        repoName: 'my-ops-tracker-web',
        defaultWebPortStart: 3037,
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
        defaultApiPort: 3038,
        healthPath: '/api/health',
      },
      {
        repoType: 'nextjs',
        repoName: 'personal-finances',
        defaultWebPortStart: 3039,
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
        defaultApiPort: 3040,
        healthPath: '/api/health',
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
        defaultApiPort: 3041,
        healthPath: '/api/health',
      },
      {
        repoType: 'nextjs',
        repoName: 'tiktok-studio',
        defaultWebPortStart: 3042,
      },
    ],
  },
  {
    id: 'website-site-scraper',
    name: 'Website Site Scraper',
    description: 'Playwright scrape and extract API',
    localDatabaseSupported: false,
    repos: [
      {
        repoType: 'express',
        repoName: 'website-site-scraper-open-source-express-server',
        defaultApiPort: 3043,
        healthPath: '/api/health',
      },
    ],
  },
  {
    id: 'app-store-manager',
    name: 'App Store Manager',
    description: 'App Store listing copy, TSX screenshot studio, and device frame assets',
    localDatabaseSupported: false,
    repos: [
      {
        repoType: 'express',
        repoName: 'app-store-manager-express-server',
        defaultApiPort: 3044,
        healthPath: '/api/health',
      },
      {
        repoType: 'nextjs',
        repoName: 'app-store-manager-console',
        defaultWebPortStart: 3045,
      },
    ],
  },
  {
    id: 'code-commit-summaries',
    name: 'Code Commit Summaries',
    description: 'GitHub commit dashboards and AI-generated daily and repo summaries',
    localDatabaseSupported: true,
    repos: [
      {
        repoType: 'express',
        repoName: 'code-commit-summaries-express-server',
        defaultApiPort: 3046,
        healthPath: '/api/health',
      },
      {
        repoType: 'nextjs',
        repoName: 'code-commit-summaries-web',
        defaultWebPortStart: 3047,
      },
    ],
  },
  {
    id: 'my-substack-manager',
    name: 'My Substack Manager',
    description: 'Substack Notes scraper and engagement performance dashboard',
    localDatabaseSupported: false,
    repos: [
      {
        repoType: 'express',
        repoName: 'my-substack-manager-express-server',
        defaultApiPort: 3050,
        healthPath: '/api/health',
      },
      {
        repoType: 'nextjs',
        repoName: 'my-substack-manager-web',
        defaultWebPortStart: 3051,
      },
    ],
  },
];
