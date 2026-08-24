'use client';

import { useAppDispatch, useAppSelector } from '@/store';
import { ProjectsBuilderActions } from '@/store/builders';

const GOOGLE_CLOUD_CONSOLE_URL = 'https://console.cloud.google.com/apis/credentials';
const MAPS_PLATFORM_URL = 'https://developers.google.com/maps/documentation/javascript/get-api-key';

export const GoogleMapsApiKeyInput = () => {
  const dispatch = useAppDispatch();
  const projectsBuilder = useAppSelector((s) => s.projectsBuilder);

  return (
    <div className={styles.section}>
      <div className={styles.left}>
        <label className={styles.label} htmlFor="hub-google-maps-api-key">
          Google Maps API key
        </label>
        <input
          id="hub-google-maps-api-key"
          name="hub-google-maps-api-key"
          type="text"
          autoComplete="off"
          data-1p-ignore
          data-lpignore="true"
          data-form-type="other"
          spellCheck={false}
          placeholder="AIza…"
          value={projectsBuilder.googleMapsApiKey}
          onChange={(e) => dispatch(ProjectsBuilderActions.setGoogleMapsApiKey(e.target.value))}
          className={styles.input}
        />
      </div>
      <ol className={styles.steps}>
        <li className={styles.step}>
          Open{' '}
          <a
            href={GOOGLE_CLOUD_CONSOLE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.link}
          >
            Google Cloud Console
          </a>
        </li>
        <li className={styles.step}>
          Enable Maps APIs and create an API key — see{' '}
          <a href={MAPS_PLATFORM_URL} target="_blank" rel="noopener noreferrer" className={styles.link}>
            Maps docs
          </a>
        </li>
        <li className={styles.step}>Restrict the key to your server IPs when possible</li>
      </ol>
    </div>
  );
};

const styles = {
  section: `
    grid gap-4 items-start rounded border border-gray-300 bg-white p-4
    md:grid-cols-2
  `,
  left: `flex flex-col gap-1.5 min-w-0`,
  label: `text-sm font-medium text-gray-700`,
  input: `
    w-full rounded border border-gray-300 px-3 py-2 text-sm text-gray-900 font-mono
    focus:outline-none focus:ring-2 focus:ring-orange-400/40
  `,
  steps: `
    list-decimal list-outside pl-4 space-y-1
    text-xs text-gray-500 leading-relaxed
  `,
  step: `pl-0.5`,
  link: `text-orange-700 underline underline-offset-2 hover:text-orange-800`,
};
