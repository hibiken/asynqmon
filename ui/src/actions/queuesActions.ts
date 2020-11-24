import {
  getQueue,
  GetQueueResponse,
  listQueues,
  ListQueuesResponse,
  pauseQueue,
  resumeQueue,
} from "../api";
import { Dispatch } from "redux";

// List of queue related action types.
export const LIST_QUEUES_BEGIN = "LIST_QUEUES_BEGIN";
export const LIST_QUEUES_SUCCESS = "LIST_QUEUES_SUCCESS";
export const GET_QUEUE_BEGIN = "GET_QUEUE_BEGIN";
export const GET_QUEUE_SUCCESS = "GET_QUEUE_SUCCESS";
export const GET_QUEUE_ERROR = "GET_QUEUE_ERROR";
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

interface GetQueueBeginAction {
  type: typeof GET_QUEUE_BEGIN;
  queue: string; // name of the queue
}

interface GetQueueSuccessAction {
  type: typeof GET_QUEUE_SUCCESS;
  queue: string; // name of the queue
  payload: GetQueueResponse;
}

interface GetQueueErrorAction {
  type: typeof GET_QUEUE_ERROR;
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
  | GetQueueBeginAction
  | GetQueueSuccessAction
  | GetQueueErrorAction
  | PauseQueueBeginAction
  | PauseQueueSuccessAction
  | PauseQueueErrorAction
  | ResumeQueueBeginAction
  | ResumeQueueSuccessAction
  | ResumeQueueErrorAction;

export function listQueuesAsync() {
  return async (dispatch: Dispatch<QueuesActionTypes>) => {
    dispatch({ type: LIST_QUEUES_BEGIN });
    // TODO: try/catch and dispatch error action on failure
    const response = await listQueues();
    dispatch({
      type: LIST_QUEUES_SUCCESS,
      payload: response,
    });
  };
}

export function getQueueAsync(qname: string) {
  return async (dispatch: Dispatch<QueuesActionTypes>) => {
    dispatch({ type: GET_QUEUE_BEGIN, queue: qname });
    try {
      const response = await getQueue(qname);
      dispatch({
        type: GET_QUEUE_SUCCESS,
        queue: qname,
        payload: response,
      });
    } catch {
      dispatch({
        type: GET_QUEUE_ERROR,
        queue: qname,
        error: `Could not retrieve queue data for queue: ${qname}`,
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
    } catch {
      dispatch({
        type: PAUSE_QUEUE_ERROR,
        queue: qname,
        error: `Could not pause queue: ${qname}`,
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
    } catch {
      dispatch({
        type: RESUME_QUEUE_ERROR,
        queue: qname,
        error: `Could not resume queue: ${qname}`,
      });
    }
  };
}
