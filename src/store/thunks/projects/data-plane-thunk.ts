import { getDataPlaneApi, setDataPlaneApi } from '@/api/projects/client';
import type { AppThunk } from '@/store/store';
import { DataPlaneProbesActions } from '@/store/dumps/dataPlaneProbes';
import { probeRepoEnvThunk } from './project-env-thunk';

export const probeDataPlaneThunk =
  (projectId: string): AppThunk<Promise<200 | 400 | 500>> => async (dispatch) => {
    const res = await getDataPlaneApi(projectId);
    if (!res.success || !res.data) {
      return res.httpStatus === 400 ? 400 : 500;
    }
    dispatch(DataPlaneProbesActions.setProbe({ projectId, probe: res.data }));
    return 200;
  };

export const setDataPlaneThunk =
  (optionId: string): AppThunk<Promise<200 | 400 | 500>> => async (dispatch, getState) => {
    const projectId = getState().currentProject.id;
    if (!projectId) {
      return 400;
    }
    const res = await setDataPlaneApi(projectId, optionId);
    if (!res.success) {
      return res.httpStatus === 400 ? 400 : 500;
    }
    if (res.data?.probe) {
      dispatch(DataPlaneProbesActions.setProbe({ projectId, probe: res.data.probe }));
    }
    await dispatch(probeRepoEnvThunk());
    return 200;
  };
