import { Dispatch } from "redux";
import {
  deleteQueue,
  listQueues,
  ListQueuesResponse,
  pauseQueue,
  resumeQueue,
} from "../api";
import { toErrorString, toErrorStringWithHttpStatus } from "../utils";

// List of queue related action types.
export const LIST_QUEUES_BEGIN = "LIST_QUEUES_BEGIN";
export const LIST_QUEUES_SUCCESS = "LIST_QUEUES_SUCCESS";
export const LIST_QUEUES_ERROR = "LIST_QUEUES_ERROR";
export const DELETE_QUEUE_BEGIN = "DELETE_QUEUE_BEGIN";
export const DELETE_QUEUE_SUCCESS = "DELETE_QUEUE_SUCCESS";
export const DELETE_QUEUE_ERROR = "DELETE_QUEUE_ERROR";
export const PAUSE_QUEUE_BEGIN = "PAUSE_QUEUE_BEGIN";
export const PAUSE_QUEUE_SUCCESS = "PAUSE_QUEUE_SUCCESS";
export const PAUSE_QUEUE_ERROR = "PAUSE_QUEUE_ERROR";
export const RESUME_QUEUE_BEGIN = "RESUME_QUEUE_BEGIN";
export const RESUME_QUEUE_SUCCESS = "RESUME_QUEUE_SUCCESS";
export const RESUME_QUEUE_ERROR = "RESUME_QUEUE_ERROR";

interface ListQueuesBeginAction {
  type: typeof LIST_QUEUES_BEGIN;
}

interface ListQueuesSuccessAction {
  type: typeof LIST_QUEUES_SUCCESS;
  payload: ListQueuesResponse;
}

interface ListQueuesErrorAction {
  type: typeof LIST_QUEUES_ERROR;
  error: string;
}

interface DeleteQueueBeginAction {
  type: typeof DELETE_QUEUE_BEGIN;
  queue: string; // name of the queue
}

interface DeleteQueueSuccessAction {
  type: typeof DELETE_QUEUE_SUCCESS;
  queue: string; // name of the queue
}

interface DeleteQueueErrorAction {
  type: typeof DELETE_QUEUE_ERROR;
  queue: string; // name of the queue
  error: string; // error description
}

interface PauseQueueBeginAction {
  type: typeof PAUSE_QUEUE_BEGIN;
  queue: string; // name of the queue
}

interface PauseQueueSuccessAction {
  type: typeof PAUSE_QUEUE_SUCCESS;
  queue: string; // name of the queue
}

interface PauseQueueErrorAction {
  type: typeof PAUSE_QUEUE_ERROR;
  queue: string; // name of the queue
  error: string; // error description
}

interface ResumeQueueBeginAction {
  type: typeof RESUME_QUEUE_BEGIN;
  queue: string; // name of the queue
}

interface ResumeQueueSuccessAction {
  type: typeof RESUME_QUEUE_SUCCESS;
  queue: string; // name of the queue
}

interface ResumeQueueErrorAction {
  type: typeof RESUME_QUEUE_ERROR;
  queue: string; // name of the queue
  error: string; // error description
}

// Union of all queues related action types.
export type QueuesActionTypes =
  | ListQueuesBeginAction
  | ListQueuesSuccessAction
  | ListQueuesErrorAction
  | DeleteQueueBeginAction
  | DeleteQueueSuccessAction
  | DeleteQueueErrorAction
  | PauseQueueBeginAction
  | PauseQueueSuccessAction
  | PauseQueueErrorAction
  | ResumeQueueBeginAction
  | ResumeQueueSuccessAction
  | ResumeQueueErrorAction;

export function listQueuesAsync() {
  return async (dispatch: Dispatch<QueuesActionTypes>) => {
    dispatch({ type: LIST_QUEUES_BEGIN });
    try {
      const response = await listQueues();
      dispatch({
        type: LIST_QUEUES_SUCCESS,
        payload: response,
      });
    } catch (error) {
      console.error(`listQueuesAsync: ${toErrorStringWithHttpStatus(error)}`);
      dispatch({
        type: LIST_QUEUES_ERROR,
        error: toErrorString(error),
      });
    }
  };
}

export function deleteQueueAsync(qname: string) {
  return async (dispatch: Dispatch<QueuesActionTypes>) => {
    dispatch({
      type: DELETE_QUEUE_BEGIN,
      queue: qname,
    });
    try {
      await deleteQueue(qname);
      // FIXME: this action doesn't get dispatched when server stalls
      dispatch({
        type: DELETE_QUEUE_SUCCESS,
        queue: qname,
      });
    } catch (error) {
      console.error(error);
      dispatch({
        type: DELETE_QUEUE_ERROR,
        queue: qname,
        error: toErrorString(error),
      });
    }
  };
}

export function pauseQueueAsync(qname: string) {
  return async (dispatch: Dispatch<QueuesActionTypes>) => {
    dispatch({ type: PAUSE_QUEUE_BEGIN, queue: qname });
    try {
      await pauseQueue(qname);
      dispatch({ type: PAUSE_QUEUE_SUCCESS, queue: qname });
    } catch (error) {
      console.error("pauseQueueAsynq: ", toErrorStringWithHttpStatus(error));
      dispatch({
        type: PAUSE_QUEUE_ERROR,
        queue: qname,
        error: toErrorString(error),
      });
    }
  };
}

export function resumeQueueAsync(qname: string) {
  return async (dispatch: Dispatch<QueuesActionTypes>) => {
    dispatch({ type: RESUME_QUEUE_BEGIN, queue: qname });
    try {
      await resumeQueue(qname);
      dispatch({ type: RESUME_QUEUE_SUCCESS, queue: qname });
    } catch (error) {
      console.error("resumeQueueAsync: ", toErrorStringWithHttpStatus(error));
      dispatch({
        type: RESUME_QUEUE_ERROR,
        queue: qname,
        error: toErrorString(error),
      });
    }
  };
}
