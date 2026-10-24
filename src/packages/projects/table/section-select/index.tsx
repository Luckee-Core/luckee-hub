'use client';

import { useMemo } from 'react';
import {
  PROJECT_CATALOG_TIER_LABELS,
  PROJECT_CATALOG_TIER_OPTIONS,
  type ProjectCatalogTier,
  getProjectCatalogTier,
} from '@/config/project-catalog-tier';
import { useAppDispatch, useAppSelector } from '@/store';
import { setProjectCatalogTierThunk } from '@/store/thunks/projects/set-project-catalog-tier-thunk';

type ProjectsTableSectionSelectProps = {
  projectId: string;
};

export const ProjectsTableSectionSelect = ({ projectId }: ProjectsTableSectionSelectProps) => {
  const dispatch = useAppDispatch();
  const projectSectionOverrides = useAppSelector((s) => s.projectSectionOverrides);
  const tier = useMemo(
    () => getProjectCatalogTier(projectId, projectSectionOverrides.byProjectId),
    [projectId, projectSectionOverrides.byProjectId],
  );

  return (
    <select
      className={styles.select}
      value={tier}
      aria-label="Launcher section"
      title="Temp admin: change launcher section"
      onClick={(event) => event.stopPropagation()}
      onChange={(event) => {
        const nextTier = event.target.value as ProjectCatalogTier;
        void dispatch(setProjectCatalogTierThunk(projectId, nextTier));
      }}
    >
      {PROJECT_CATALOG_TIER_OPTIONS.map((option) => (
        <option key={option} value={option}>
          {PROJECT_CATALOG_TIER_LABELS[option]}
        </option>
      ))}
    </select>
  );
};

const styles = {
  select: `
    max-w-[9.5rem] px-1.5 py-0.5 text-[10px] border border-gray-300 rounded bg-white
    focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500
  `,
};
