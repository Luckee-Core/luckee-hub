'use client';

import { LuckeeFolderSetting } from './luckee-folder';

export const Settings = () => (
  <div className={styles.page}>
    <div className={styles.intro}>
      <h1 className={styles.title}>Settings</h1>
      <p className={styles.subtitle}>Machine settings for this hub, saved on this computer.</p>
    </div>
    <LuckeeFolderSetting />
  </div>
);

const styles = {
  page: `
    w-full max-w-3xl space-y-3
  `,
  intro: `
    flex flex-col gap-0.5
  `,
  title: `
    text-lg font-semibold text-gray-900
  `,
  subtitle: `
    text-sm text-gray-600
  `,
};
