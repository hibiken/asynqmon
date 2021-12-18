import { Dispatch } from "redux";
import { getMetrics, MetricsResponse } from "../api";
import { toErrorString, toErrorStringWithHttpStatus } from "../utils";

// List of metrics related action types.
export const GET_METRICS_BEGIN = "GET_METRICS_BEGIN";
export const GET_METRICS_SUCCESS = "GET_METRICS_SUCCESS";
export const GET_METRICS_ERROR = "GET_METRICS_ERROR";

interface GetMetricsBeginAction {
  type: typeof GET_METRICS_BEGIN;
}

interface GetMetricsSuccessAction {
  type: typeof GET_METRICS_SUCCESS;
  payload: MetricsResponse;
}

interface GetMetricsErrorAction {
  type: typeof GET_METRICS_ERROR;
  error: string;
}

// Union of all metrics related actions.
export type MetricsActionTypes =
  | GetMetricsBeginAction
  | GetMetricsSuccessAction
  | GetMetricsErrorAction;

export function getMetricsAsync(
  endTime: number,
  duration: number,
  queues: string[]
) {
  return async (dispatch: Dispatch<MetricsActionTypes>) => {
    dispatch({ type: GET_METRICS_BEGIN });
    try {
      const response = await getMetrics(endTime, duration, queues);
      dispatch({ type: GET_METRICS_SUCCESS, payload: response });
    } catch (error) {
      console.error(`getMetricsAsync: ${toErrorStringWithHttpStatus(error)}`);
      dispatch({
        type: GET_METRICS_ERROR,
        error: toErrorString(error),
      });
    }
  };
}
