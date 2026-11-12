import type { ProjectEnvSection } from '@/model';

/**
 * An env section is complete when every non-optional key (uncommented in `.env.example`) has a value.
 */
export const isEnvSectionComplete = (section: ProjectEnvSection): boolean =>
  section.keys.every((key) => key.optional || key.present);
