import { Dispatch } from "@reduxjs/toolkit";
import {
  listSchedulerEnqueueEvents,
  ListSchedulerEnqueueEventsResponse,
  listSchedulerEntries,
  ListSchedulerEntriesResponse,
} from "../api";
import { toErrorString, toErrorStringWithHttpStatus } from "../utils";

// List of scheduler-entry related action types.
export const LIST_SCHEDULER_ENTRIES_BEGIN = "LIST_SCHEDULER_ENTRIES_BEGIN";
export const LIST_SCHEDULER_ENTRIES_SUCCESS = "LIST_SCHEDULER_ENTRIES_SUCCESS";
export const LIST_SCHEDULER_ENTRIES_ERROR = "LIST_SCHEDULER_ENTRIES_ERROR";
export const LIST_SCHEDULER_ENQUEUE_EVENTS_BEGIN =
  "LIST_SCHEDULER_ENQUEUE_EVENTS_BEGIN";
export const LIST_SCHEDULER_ENQUEUE_EVENTS_SUCCESS =
  "LIST_SCHEDULER_ENQUEUE_EVENTS_SUCCESS";
export const LIST_SCHEDULER_ENQUEUE_EVENTS_ERROR =
  "LIST_SCHEDULER_ENQUEUE_EVENTS_ERROR";

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

interface ListSchedulerEnqueueEventBeginAction {
  type: typeof LIST_SCHEDULER_ENQUEUE_EVENTS_BEGIN;
  entryId: string;
}

interface ListSchedulerEnqueueEventSuccessAction {
  type: typeof LIST_SCHEDULER_ENQUEUE_EVENTS_SUCCESS;
  entryId: string;
  payload: ListSchedulerEnqueueEventsResponse;
}

interface ListSchedulerEnqueueEventErrorAction {
  type: typeof LIST_SCHEDULER_ENQUEUE_EVENTS_ERROR;
  entryId: string;
  error: string;
}

// Union of all scheduler-entry related actions.
export type SchedulerEntriesActionTypes =
  | ListSchedulerEntriesBeginAction
  | ListSchedulerEntriesSuccessAction
  | ListSchedulerEntriesErrorAction
  | ListSchedulerEnqueueEventBeginAction
  | ListSchedulerEnqueueEventSuccessAction
  | ListSchedulerEnqueueEventErrorAction;

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
      console.error(
        `listSchedulerEnqueueEventsAsync: ${toErrorStringWithHttpStatus(error)}`
      );
      dispatch({
        type: LIST_SCHEDULER_ENTRIES_ERROR,
        error: toErrorString(error),
      });
    }
  };
}

export function listSchedulerEnqueueEventsAsync(entryId: string) {
  return async (dispatch: Dispatch<SchedulerEntriesActionTypes>) => {
    dispatch({ type: LIST_SCHEDULER_ENQUEUE_EVENTS_BEGIN, entryId });
    try {
      const response = await listSchedulerEnqueueEvents(entryId);
      dispatch({
        type: LIST_SCHEDULER_ENQUEUE_EVENTS_SUCCESS,
        payload: response,
        entryId,
      });
    } catch (error) {
      console.error(
        "listSchedulerEnqueueEventsAsync: ",
        toErrorStringWithHttpStatus(error)
      );
      dispatch({
        type: LIST_SCHEDULER_ENQUEUE_EVENTS_ERROR,
        error: toErrorString(error),
        entryId,
      });
    }
  };
}
