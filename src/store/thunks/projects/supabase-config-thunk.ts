import {
  probeSupabaseConfigApi,
  saveSupabaseConfigApi,
  seedSupabaseSchemaApi,
} from '@/api/projects';
import type { AppThunk } from '@/store/store';
import { ProjectsBuilderActions } from '@/store/builders/projectsBuilder';
import { SupabaseProbesActions } from '@/store/dumps/supabaseProbes';

/**
 * Probe Supabase env presence for the current project (booleans only).
 */
export const probeSupabaseConfigThunk =
  (projectId: string): AppThunk<Promise<200 | 400 | 500>> =>
  async (dispatch, getState) => {
    const hasProbe = Boolean(getState().supabaseProbes[projectId]);
    // Avoid "Checking…" flash when we already know status — refresh in background.
    if (!hasProbe) {
      dispatch(ProjectsBuilderActions.setSupabaseLoadStatus('loading'));
    }
    dispatch(ProjectsBuilderActions.setSupabaseError(null));

    const result = await probeSupabaseConfigApi(projectId);
    if (!result.success || !result.data) {
      dispatch(ProjectsBuilderActions.setSupabaseLoadStatus('error'));
      dispatch(
        ProjectsBuilderActions.setSupabaseError(result.error ?? 'Supabase probe failed'),
      );
      return result.httpStatus === 400 ? 400 : 500;
    }

    dispatch(
      SupabaseProbesActions.upsertSupabaseProbe({
        projectId,
        probe: result.data,
      }),
    );
    dispatch(ProjectsBuilderActions.setSupabaseLoadStatus('loaded'));
    if (result.data.configured) {
      dispatch(ProjectsBuilderActions.setSupabaseEditing(false));
    }
    return 200;
  };

/**
 * Save Supabase keys from projectsBuilder form fields to express .env, then re-probe.
 */
export const saveSupabaseConfigThunk =
  (): AppThunk<Promise<200 | 400 | 500>> =>
  async (dispatch, getState) => {
    const projectId = getState().currentProject.id;
    if (!projectId) {
      dispatch(ProjectsBuilderActions.setSupabaseError('No project selected'));
      return 400;
    }

    const { supabaseUrl, supabaseServiceKey, supabaseDatabasePassword } =
      getState().projectsBuilder;

    const url = supabaseUrl.trim();
    const serviceKey = supabaseServiceKey.trim();
    const databasePassword = supabaseDatabasePassword.trim();
    if (!url || !serviceKey || !databasePassword) {
      dispatch(ProjectsBuilderActions.setSupabaseError('All three Supabase values are required'));
      return 400;
    }

    dispatch(ProjectsBuilderActions.setSupabaseOperation('save'));
    dispatch(ProjectsBuilderActions.setSupabaseLoadStatus('loading'));
    dispatch(ProjectsBuilderActions.setSupabaseError(null));
    dispatch(ProjectsBuilderActions.setSupabaseSaveMessage(null));

    const result = await saveSupabaseConfigApi(projectId, {
      supabaseUrl: url,
      serviceKey,
      databasePassword,
    });
    if (!result.success || !result.data) {
      dispatch(ProjectsBuilderActions.setSupabaseOperation(null));
      dispatch(ProjectsBuilderActions.setSupabaseLoadStatus('error'));
      dispatch(
        ProjectsBuilderActions.setSupabaseError(result.error ?? 'Failed to save Supabase config'),
      );
      return result.httpStatus === 400 ? 400 : 500;
    }

    dispatch(ProjectsBuilderActions.setSupabaseSaveMessage(result.data.message));
    dispatch(ProjectsBuilderActions.setSupabaseServiceKey(''));
    dispatch(ProjectsBuilderActions.setSupabaseDatabasePassword(''));
    dispatch(ProjectsBuilderActions.setSupabaseEditing(false));
    dispatch(ProjectsBuilderActions.setSupabaseOperation(null));
    await dispatch(probeSupabaseConfigThunk(projectId));
    return 200;
  };

/**
 * Apply bootstrap SQL to Supabase Postgres via hub-express (psql + DATABASE_URL).
 */
export const seedSupabaseSchemaThunk =
  (): AppThunk<Promise<200 | 400 | 500>> =>
  async (dispatch, getState) => {
    const projectId = getState().currentProject.id;
    if (!projectId) {
      dispatch(ProjectsBuilderActions.setSupabaseError('No project selected'));
      return 400;
    }

    dispatch(ProjectsBuilderActions.setSupabaseOperation('seed'));
    dispatch(ProjectsBuilderActions.setSupabaseLoadStatus('loading'));
    dispatch(ProjectsBuilderActions.setSupabaseError(null));
    dispatch(ProjectsBuilderActions.setSupabaseSaveMessage(null));

    const result = await seedSupabaseSchemaApi(projectId);
    if (!result.success || !result.data) {
      dispatch(ProjectsBuilderActions.setSupabaseOperation(null));
      dispatch(ProjectsBuilderActions.setSupabaseLoadStatus('error'));
      dispatch(
        ProjectsBuilderActions.setSupabaseError(result.error ?? 'Failed to seed table schema'),
      );
      return result.httpStatus === 400 ? 400 : 500;
    }

    dispatch(ProjectsBuilderActions.setSupabaseSaveMessage(result.data.message));
    dispatch(ProjectsBuilderActions.setSupabaseOperation(null));
    await dispatch(probeSupabaseConfigThunk(projectId));
    return 200;
  };
