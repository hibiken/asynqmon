import { Dispatch } from "redux";
import { listQueueStats, ListQueueStatsResponse } from "../api";
import { toErrorString, toErrorStringWithHttpStatus } from "../utils";

export const LIST_QUEUE_STATS_BEGIN = "LIST_QUEUE_STATS_BEGIN";
export const LIST_QUEUE_STATS_SUCCESS = "LIST_QUEUE_STATS_SUCCESS";
export const LIST_QUEUE_STATS_ERROR = "LIST_QUEUE_STATS_ERROR";

interface ListQueueStatsBeginAction {
  type: typeof LIST_QUEUE_STATS_BEGIN;
}

interface ListQueueStatsSuccessAction {
  type: typeof LIST_QUEUE_STATS_SUCCESS;
  payload: ListQueueStatsResponse;
}

interface ListQueueStatsErrorAction {
  type: typeof LIST_QUEUE_STATS_ERROR;
  error: string;
}

// Union of all queue stats related action types.
export type QueueStatsActionTypes =
  | ListQueueStatsBeginAction
  | ListQueueStatsSuccessAction
  | ListQueueStatsErrorAction;

export function listQueueStatsAsync() {
  return async (dispatch: Dispatch<QueueStatsActionTypes>) => {
    dispatch({ type: LIST_QUEUE_STATS_BEGIN });
    try {
      const response = await listQueueStats();
      dispatch({
        type: LIST_QUEUE_STATS_SUCCESS,
        payload: response,
      });
    } catch (error) {
      console.error(
        "listQueueStatsAsync: ",
        toErrorStringWithHttpStatus(error)
      );
      dispatch({
        type: LIST_QUEUE_STATS_ERROR,
        error: toErrorString(error),
      });
    }
  };
}
