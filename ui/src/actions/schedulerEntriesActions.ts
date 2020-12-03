import { Dispatch } from "@reduxjs/toolkit";
import { listSchedulerEntries, ListSchedulerEntriesResponse } from "../api";

// List of scheduler-entry related action types.
export const LIST_SCHEDULER_ENTRIES_BEGIN = "LIST_SCHEDULER_ENTRIES_BEGIN";
export const LIST_SCHEDULER_ENTRIES_SUCCESS = "LIST_SCHEDULER_ENTRIES_SUCCESS";
export const LIST_SCHEDULER_ENTRIES_ERROR = "LIST_SCHEDULER_ENTRIES_ERROR";

interface ListSchedulerEntriesBeginAction {
  type: typeof LIST_SCHEDULER_ENTRIES_BEGIN;
}

interface ListSchedulerEntriesSuccessAction {
  type: typeof LIST_SCHEDULER_ENTRIES_SUCCESS;
  payload: ListSchedulerEntriesResponse;
}

interface ListSchedulerEntriesErrorAction {
  type: typeof LIST_SCHEDULER_ENTRIES_ERROR;
  error: string; // error description
}

// Union of all scheduler-entry related actions.
export type SchedulerEntriesActionTypes =
  | ListSchedulerEntriesBeginAction
  | ListSchedulerEntriesSuccessAction
  | ListSchedulerEntriesErrorAction;

export function listSchedulerEntriesAsync() {
  return async (dispatch: Dispatch<SchedulerEntriesActionTypes>) => {
    dispatch({ type: LIST_SCHEDULER_ENTRIES_BEGIN });
    try {
      const response = await listSchedulerEntries();
      dispatch({
        type: LIST_SCHEDULER_ENTRIES_SUCCESS,
        payload: response,
      });
    } catch (error) {
      console.error(error);
      dispatch({
        type: LIST_SCHEDULER_ENTRIES_ERROR,
        error: "Could not retrieve scheduler entries",
      });
    }
  };
}
