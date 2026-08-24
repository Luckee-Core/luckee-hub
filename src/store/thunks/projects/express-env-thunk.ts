import { probeExpressEnvGroupApi, saveExpressEnvGroupApi } from '@/api/projects';
import type { AppThunk } from '@/store/store';
import { ProjectsBuilderActions } from '@/store/builders/projectsBuilder';
import {
  buildExpressEnvProbeKey,
  ExpressEnvProbesActions,
} from '@/store/dumps/expressEnvProbes';

/**
 * Probe express env group key presence for the current project.
 */
export const probeExpressEnvGroupThunk =
  (groupId: string): AppThunk<Promise<200 | 400 | 500>> =>
  async (dispatch, getState) => {
    const projectId = getState().currentProject.id;
    if (!projectId) {
      return 400;
    }

    const probeKey = buildExpressEnvProbeKey(projectId, groupId);
    const hasProbe = Boolean(getState().expressEnvProbes[probeKey]);
    if (!hasProbe) {
      dispatch(ProjectsBuilderActions.setExpressEnvLoadStatus('loading'));
    }
    dispatch(ProjectsBuilderActions.setExpressEnvError(null));

    const result = await probeExpressEnvGroupApi(projectId, groupId);
    if (!result.success || !result.data) {
      dispatch(ProjectsBuilderActions.setExpressEnvLoadStatus('error'));
      dispatch(
        ProjectsBuilderActions.setExpressEnvError(result.error ?? 'Express env probe failed'),
      );
      return result.httpStatus === 400 ? 400 : 500;
    }

    dispatch(
      ExpressEnvProbesActions.upsertProbe({
        projectId,
        groupId,
        probe: result.data,
      }),
    );
    dispatch(ProjectsBuilderActions.setExpressEnvLoadStatus('loaded'));
    if (result.data.configured) {
      if (groupId === 'ai') {
        dispatch(ProjectsBuilderActions.setAiEnvEditing(false));
      } else if (groupId === 'google-maps') {
        dispatch(ProjectsBuilderActions.setGoogleMapsEnvEditing(false));
      } else if (groupId === 'email') {
        dispatch(ProjectsBuilderActions.setEmailEnvEditing(false));
      }
    }
    return 200;
  };

/**
 * Save Anthropic API key from projectsBuilder to express .env, then re-probe.
 */
export const saveAiEnvThunk =
  (): AppThunk<Promise<200 | 400 | 500>> =>
  async (dispatch, getState) => {
    const projectId = getState().currentProject.id;
    if (!projectId) {
      dispatch(ProjectsBuilderActions.setExpressEnvError('No project selected'));
      return 400;
    }

    const anthropicKey = getState().projectsBuilder.anthropicApiKey.trim();
    if (!anthropicKey) {
      dispatch(ProjectsBuilderActions.setExpressEnvError('ANTHROPIC_API_KEY is required'));
      return 400;
    }

    dispatch(ProjectsBuilderActions.setExpressEnvLoadStatus('loading'));
    dispatch(ProjectsBuilderActions.setExpressEnvError(null));
    dispatch(ProjectsBuilderActions.setExpressEnvSaveMessage(null));

    const result = await saveExpressEnvGroupApi(projectId, 'ai', {
      ANTHROPIC_API_KEY: anthropicKey,
    });
    if (!result.success || !result.data) {
      dispatch(ProjectsBuilderActions.setExpressEnvLoadStatus('error'));
      dispatch(
        ProjectsBuilderActions.setExpressEnvError(result.error ?? 'Failed to save AI env'),
      );
      return result.httpStatus === 400 ? 400 : 500;
    }

    dispatch(ProjectsBuilderActions.setExpressEnvSaveMessage(result.data.message));
    dispatch(ProjectsBuilderActions.setAnthropicApiKey(''));
    await dispatch(probeExpressEnvGroupThunk('ai'));
    return 200;
  };

/**
 * Save Google Maps env key from projectsBuilder to express .env, then re-probe.
 */
export const saveGoogleMapsEnvThunk =
  (): AppThunk<Promise<200 | 400 | 500>> =>
  async (dispatch, getState) => {
    const projectId = getState().currentProject.id;
    if (!projectId) {
      dispatch(ProjectsBuilderActions.setExpressEnvError('No project selected'));
      return 400;
    }

    const apiKey = getState().projectsBuilder.googleMapsApiKey.trim();
    if (!apiKey) {
      dispatch(ProjectsBuilderActions.setExpressEnvError('Google Maps API key is required'));
      return 400;
    }

    dispatch(ProjectsBuilderActions.setExpressEnvLoadStatus('loading'));
    dispatch(ProjectsBuilderActions.setExpressEnvError(null));
    dispatch(ProjectsBuilderActions.setExpressEnvSaveMessage(null));

    const result = await saveExpressEnvGroupApi(projectId, 'google-maps', {
      GOOGLE_MAPS_API_KEY: apiKey,
    });
    if (!result.success || !result.data) {
      dispatch(ProjectsBuilderActions.setExpressEnvLoadStatus('error'));
      dispatch(
        ProjectsBuilderActions.setExpressEnvError(
          result.error ?? 'Failed to save Google Maps env',
        ),
      );
      return result.httpStatus === 400 ? 400 : 500;
    }

    dispatch(ProjectsBuilderActions.setExpressEnvSaveMessage(result.data.message));
    dispatch(ProjectsBuilderActions.setGoogleMapsApiKey(''));
    await dispatch(probeExpressEnvGroupThunk('google-maps'));
    return 200;
  };

/**
 * Save email env keys from projectsBuilder to express .env, then re-probe.
 */
export const saveEmailEnvThunk =
  (): AppThunk<Promise<200 | 400 | 500>> =>
  async (dispatch, getState) => {
    const projectId = getState().currentProject.id;
    if (!projectId) {
      dispatch(ProjectsBuilderActions.setExpressEnvError('No project selected'));
      return 400;
    }

    const {
      gmailServiceAccountJsonPath,
      gmailSendAsEmail,
      gmailFromName,
      emailOpenTrackingBaseUrl,
    } = getState().projectsBuilder;

    const values: Record<string, string> = {};
    const jsonPath = gmailServiceAccountJsonPath.trim();
    const sendAs = gmailSendAsEmail.trim();
    const fromName = gmailFromName.trim();
    const trackingBase = emailOpenTrackingBaseUrl.trim();
    if (jsonPath) values.GMAIL_SERVICE_ACCOUNT_JSON_PATH = jsonPath;
    if (sendAs) values.GMAIL_SEND_AS_EMAIL = sendAs;
    if (fromName) values.GMAIL_FROM_NAME = fromName;
    if (trackingBase) values.EMAIL_OPEN_TRACKING_BASE_URL = trackingBase;

    if (Object.keys(values).length === 0) {
      dispatch(ProjectsBuilderActions.setExpressEnvError('Provide at least one email value to save'));
      return 400;
    }

    dispatch(ProjectsBuilderActions.setExpressEnvLoadStatus('loading'));
    dispatch(ProjectsBuilderActions.setExpressEnvError(null));
    dispatch(ProjectsBuilderActions.setExpressEnvSaveMessage(null));

    const result = await saveExpressEnvGroupApi(projectId, 'email', values);
    if (!result.success || !result.data) {
      dispatch(ProjectsBuilderActions.setExpressEnvLoadStatus('error'));
      dispatch(
        ProjectsBuilderActions.setExpressEnvError(result.error ?? 'Failed to save email env'),
      );
      return result.httpStatus === 400 ? 400 : 500;
    }

    dispatch(ProjectsBuilderActions.setExpressEnvSaveMessage(result.data.message));
    await dispatch(probeExpressEnvGroupThunk('email'));
    return 200;
  };
