'use client';

import { Star } from 'lucide-react';
import { useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { toggleProjectFavoriteThunk } from '@/store/thunks/projects/toggle-project-favorite-thunk';

type ProjectsToggleFavoriteActionProps = {
  projectId: string;
  iconSize?: 'sm' | 'md';
};

export const ProjectsToggleFavoriteAction = ({
  projectId,
  iconSize = 'sm',
}: ProjectsToggleFavoriteActionProps) => {
  const dispatch = useAppDispatch();
  const projectFavorites = useAppSelector((s) => s.projectFavorites);
  const isFavorite = useMemo(
    () => projectFavorites.ids.includes(projectId),
    [projectFavorites.ids, projectId],
  );
  const iconClass = iconSize === 'md' ? styles.iconMd : styles.iconSm;
  const label = isFavorite ? 'Remove from favorites' : 'Add to favorites';

  return (
    <button
      type="button"
      className={isFavorite ? styles.iconFavorited : styles.iconFavorite}
      aria-label={label}
      title={label}
      onClick={() => void dispatch(toggleProjectFavoriteThunk(projectId))}
    >
      <Star className={iconClass} fill={isFavorite ? 'currentColor' : 'none'} aria-hidden />
    </button>
  );
};

const styles = {
  iconFavorite: `
    inline-flex items-center justify-center rounded p-1 text-gray-400
    hover:bg-orange-50 hover:text-orange-500
  `,
  iconFavorited: `
    inline-flex items-center justify-center rounded p-1 text-orange-500
    hover:bg-orange-50 hover:text-orange-600
  `,
  iconSm: `h-3.5 w-3.5`,
  iconMd: `h-5 w-5`,
};
