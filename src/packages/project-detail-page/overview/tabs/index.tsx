'use client';

import { useMemo, useState } from 'react';

import { useAppSelector } from '@/store';
import { SetupTab } from './setup';
import { SupabaseTab } from './supabase';
import { AiTab } from './ai';
import { GoogleMapsTab } from './google-maps';
import { EmailTab } from './email';

type ProjectDetailTabId = 'setup' | 'supabase' | 'ai' | 'google-maps' | 'email';

const EXPRESS_ENV_TAB_LABELS: Record<'ai' | 'google-maps' | 'email', string> = {
  ai: 'AI',
  'google-maps': 'Google Maps Scraper',
  email: 'Emailing',
};

/**
 * Project detail tabs — Setup, optional Supabase, and express env groups.
 */
export const ProjectDetailTabs = () => {
  const currentProject = useAppSelector((s) => s.currentProject);

  const tabs = useMemo(() => {
    const items: { id: ProjectDetailTabId; label: string }[] = [
      { id: 'setup', label: 'Setup' },
    ];
    if (currentProject.supabaseSupported) {
      items.push({ id: 'supabase', label: 'Supabase' });
    }
    for (const groupId of currentProject.expressEnvGroupIds) {
      if (groupId === 'ai' || groupId === 'google-maps' || groupId === 'email') {
        items.push({ id: groupId, label: EXPRESS_ENV_TAB_LABELS[groupId] });
      }
    }
    return items;
  }, [currentProject.supabaseSupported, currentProject.expressEnvGroupIds]);

  const [activeTabId, setActiveTabId] = useState<ProjectDetailTabId>('setup');

  const activeId = tabs.some((tab) => tab.id === activeTabId)
    ? activeTabId
    : 'setup';

  return (
    <div className={styles.root}>
      <div className={styles.tabList} role="tablist" aria-label="Project detail">
        {tabs.map((tab) => {
          const isActive = tab.id === activeId;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              className={isActive ? styles.tabActive : styles.tab}
              onClick={() => setActiveTabId(tab.id)}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
      <div className={styles.panel} role="tabpanel">
        {activeId === 'setup' ? <SetupTab /> : null}
        {activeId === 'supabase' ? <SupabaseTab /> : null}
        {activeId === 'ai' ? <AiTab /> : null}
        {activeId === 'google-maps' ? <GoogleMapsTab /> : null}
        {activeId === 'email' ? <EmailTab /> : null}
      </div>
    </div>
  );
};

const styles = {
  root: `space-y-3 min-w-0 w-full`,
  tabList: `flex flex-wrap gap-1`,
  tab: `
    rounded px-2.5 py-1 text-xs font-medium text-gray-600 bg-white border border-gray-300
    hover:bg-gray-50 cursor-pointer
  `,
  tabActive: `
    rounded px-2.5 py-1 text-xs font-medium text-gray-900 bg-gray-100 border border-gray-400
    cursor-pointer
  `,
  panel: `min-w-0`,
};
