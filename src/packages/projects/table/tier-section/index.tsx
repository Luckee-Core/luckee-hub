'use client';

import type { DragEvent } from 'react';
import type { HubProject } from '@/model';
import type { ProjectCatalogTier } from '@/config';
import {
  ProjectsTableSectionHeaderRow,
  type ProjectsTableSectionVariant,
} from '../section-header-row';
import { ProjectsTableProjectRow } from '../project-row';

type ProjectsTableTierSectionProps = {
  tier: ProjectCatalogTier;
  title: string;
  variant: ProjectsTableSectionVariant;
  projects: HubProject[];
  /** Keep the section visible with no projects (e.g. while a row is being dragged). */
  showWhenEmpty: boolean;
  draggingProjectId: string | null;
  isDropTarget: boolean;
  onDragOverTier: (tier: ProjectCatalogTier) => void;
  onDragLeaveTier: (tier: ProjectCatalogTier) => void;
  onDropOnTier: (tier: ProjectCatalogTier) => void;
  onRowDragStart: (projectId: string) => void;
  onRowDragEnd: () => void;
  onRowClick: (projectId: string) => void;
};

export const ProjectsTableTierSection = ({
  tier,
  title,
  variant,
  projects,
  showWhenEmpty,
  draggingProjectId,
  isDropTarget,
  onDragOverTier,
  onDragLeaveTier,
  onDropOnTier,
  onRowDragStart,
  onRowDragEnd,
  onRowClick,
}: ProjectsTableTierSectionProps) => {
  if (projects.length === 0 && !showWhenEmpty) {
    return null;
  }

  const handleDragOver = (event: DragEvent<HTMLTableSectionElement>) => {
    if (!draggingProjectId) {
      return;
    }
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
    onDragOverTier(tier);
  };

  const handleDragLeave = (event: DragEvent<HTMLTableSectionElement>) => {
    if (event.currentTarget.contains(event.relatedTarget as Node | null)) {
      return;
    }
    onDragLeaveTier(tier);
  };

  const handleDrop = (event: DragEvent<HTMLTableSectionElement>) => {
    event.preventDefault();
    onDropOnTier(tier);
  };

  return (
    <tbody onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}>
      <ProjectsTableSectionHeaderRow
        title={title}
        count={projects.length}
        variant={variant}
        isDropTarget={isDropTarget}
      />
      {projects.map((project) => (
        <ProjectsTableProjectRow
          key={project.id}
          project={project}
          onRowClick={onRowClick}
          draggable
          isDragging={draggingProjectId === project.id}
          onDragStart={onRowDragStart}
          onDragEnd={onRowDragEnd}
        />
      ))}
      {projects.length === 0 && draggingProjectId ? (
        <tr>
          <td colSpan={5} className={isDropTarget ? styles.placeholderActive : styles.placeholder}>
            Drop a project here
          </td>
        </tr>
      ) : null}
    </tbody>
  );
};

const styles = {
  placeholder: `
    px-3 py-3 text-center text-[11px] text-gray-400 border-b border-dashed border-gray-200
  `,
  placeholderActive: `
    px-3 py-3 text-center text-[11px] font-medium text-blue-700 bg-blue-50 border-b border-dashed border-blue-300
  `,
};
