'use client';

import { detailPageStyles } from '@/components/detail-page-styles';
import { useAppDispatch, useAppSelector } from '@/store';
import { ProjectDetailBuilderActions } from '@/store/builders';

type KeyFieldProps = {
  sectionId: string;
  envKey: string;
  secret: boolean;
  present: boolean;
  placeholder?: string;
  disabled: boolean;
};

export const EnvKeyField = ({
  sectionId,
  envKey,
  secret,
  present,
  placeholder,
  disabled,
}: KeyFieldProps) => {
  const dispatch = useAppDispatch();
  const { envSectionForms } = useAppSelector((s) => s.projectDetailBuilder);
  const value = envSectionForms[sectionId]?.values[envKey] ?? '';
  const inputId = `env-${sectionId}-${envKey}`;

  return (
    <div className={styles.field}>
      <div className={styles.labelRow}>
        <label htmlFor={inputId} className={styles.label}>
          {envKey}
        </label>
        <span className={present ? styles.badgeSet : styles.badgeMissing}>
          {present ? 'Set' : 'Missing'}
        </span>
      </div>
      <input
        id={inputId}
        name={inputId}
        type={secret ? 'password' : 'text'}
        autoComplete="off"
        data-1p-ignore
        data-lpignore="true"
        data-form-type="other"
        className={detailPageStyles.textInput}
        placeholder={
          secret
            ? present
              ? 'Replace — leave blank to keep'
              : 'Enter value'
            : (placeholder ?? '')
        }
        value={value}
        disabled={disabled}
        onChange={(event) =>
          dispatch(
            ProjectDetailBuilderActions.setEnvSectionValue({
              sectionId,
              key: envKey,
              value: event.target.value,
            }),
          )
        }
      />
    </div>
  );
};

const styles = {
  field: `flex flex-col gap-1.5`,
  labelRow: `flex items-center justify-between gap-2`,
  label: `font-mono text-xs font-semibold text-gray-800`,
  badgeSet: `
    rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide
    bg-green-50 text-green-700 border border-green-200
  `,
  badgeMissing: `
    rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide
    bg-gray-100 text-gray-600 border border-gray-200
  `,
};
