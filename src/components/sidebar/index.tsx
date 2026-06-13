'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useMemo, useState } from 'react';
import { PanelLeft, PanelLeftClose, Rows3 } from 'lucide-react';
import { PROJECTS_PATH } from '@/config/routes';
import { getHubSidebarSections } from './get-hub-sidebar-sections';

export const Sidebar = () => {
  const pathname = usePathname();
  const sections = useMemo(() => getHubSidebarSections(), []);
  const [collapsed, setCollapsed] = useState(false);

  const isActiveHref = useCallback(
    (href: string) => {
      if (href === PROJECTS_PATH) {
        return pathname === PROJECTS_PATH || pathname.startsWith(`${PROJECTS_PATH}/`);
      }
      return pathname === href || pathname.startsWith(`${href}/`);
    },
    [pathname],
  );

  return (
    <aside className={styles.sidebar(collapsed)}>
      <div className={styles.logoArea}>
        <Link href={PROJECTS_PATH} className={styles.logoLink}>
          <span className={styles.logoMark}>LH</span>
          {!collapsed ? <span className={styles.logoText}>Luckee Dev Hub</span> : null}
        </Link>
        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          className={styles.collapseBtn}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <PanelLeft className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
        </button>
      </div>

      <nav className={styles.nav}>
        {sections.map((section) => (
          <div key={section.title || 'nav'} className={styles.navGroup}>
            {!collapsed && section.title.trim() ? (
              <p className={styles.navGroupTitle}>{section.title}</p>
            ) : null}
            <div className={styles.navGroupItems}>
              {section.links.map((link) => {
                const leafActive = isActiveHref(link.href);
                return (
                  <div key={link.href} className={styles.parentRow(leafActive)}>
                    <Link href={link.href} className={styles.parentLink(collapsed)} title={link.name}>
                      <Rows3 className={styles.icon(leafActive)} />
                      {!collapsed ? <span className={styles.linkLabel}>{link.name}</span> : null}
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
};

const styles = {
  sidebar: (collapsed: boolean) =>
    `${collapsed ? 'w-16' : 'w-56'} flex flex-col border-r border-zinc-800 bg-zinc-900 text-zinc-100 transition-all duration-200 min-h-0 shrink-0 self-stretch`,
  logoArea: `flex items-center justify-between px-3 py-4 border-b border-zinc-800 shrink-0`,
  logoLink: `flex items-center gap-2.5 min-w-0`,
  logoMark: `flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-orange-500 text-sm font-bold text-white`,
  logoText: `truncate text-sm font-semibold text-zinc-100`,
  collapseBtn: `rounded-md p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100`,
  nav: `flex-1 overflow-y-auto px-2 py-3`,
  navGroup: `mb-4`,
  navGroupTitle: `px-2 mb-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-500`,
  navGroupItems: `space-y-0.5`,
  parentRow: (active: boolean) =>
    `rounded-md ${active ? 'bg-zinc-800/80' : 'hover:bg-zinc-800/50'}`,
  parentLink: (collapsed: boolean) =>
    `flex items-center gap-2.5 px-2.5 py-2 text-sm text-zinc-300 hover:text-white ${collapsed ? 'justify-center' : ''}`,
  icon: (active: boolean) => `h-4 w-4 shrink-0 ${active ? 'text-orange-400' : 'text-zinc-500'}`,
  linkLabel: `truncate`,
};
