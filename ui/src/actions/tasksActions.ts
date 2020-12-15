import {
  batchDeleteDeadTasks,
  BatchDeleteTasksResponse,
  batchRunDeadTasks,
  BatchRunTasksResponse,
  cancelActiveTask,
  deleteDeadTask,
  deleteRetryTask,
  deleteScheduledTask,
  listActiveTasks,
  ListActiveTasksResponse,
  listDeadTasks,
  ListDeadTasksResponse,
  listPendingTasks,
  ListPendingTasksResponse,
  listRetryTasks,
  ListRetryTasksResponse,
  listScheduledTasks,
  ListScheduledTasksResponse,
  PaginationOptions,
  runDeadTask,
} from "../api";
import { Dispatch } from "redux";

// List of tasks related action types.
export const LIST_ACTIVE_TASKS_BEGIN = "LIST_ACTIVE_TASKS_BEGIN";
export const LIST_ACTIVE_TASKS_SUCCESS = "LIST_ACTIVE_TASKS_SUCCESS";
export const LIST_ACTIVE_TASKS_ERROR = "LIST_ACTIVE_TASKS_ERROR";
export const LIST_PENDING_TASKS_BEGIN = "LIST_PENDING_TASKS_BEGIN";
export const LIST_PENDING_TASKS_SUCCESS = "LIST_PENDING_TASKS_SUCCESS";
export const LIST_PENDING_TASKS_ERROR = "LIST_PENDING_TASKS_ERROR";
export const LIST_SCHEDULED_TASKS_BEGIN = "LIST_SCHEDULED_TASKS_BEGIN";
export const LIST_SCHEDULED_TASKS_SUCCESS = "LIST_SCHEDULED_TASKS_SUCCESS";
export const LIST_SCHEDULED_TASKS_ERROR = "LIST_SCHEDULED_TASKS_ERROR";
export const LIST_RETRY_TASKS_BEGIN = "LIST_RETRY_TASKS_BEGIN";
export const LIST_RETRY_TASKS_SUCCESS = "LIST_RETRY_TASKS_SUCCESS";
export const LIST_RETRY_TASKS_ERROR = "LIST_RETRY_TASKS_ERROR";
export const LIST_DEAD_TASKS_BEGIN = "LIST_DEAD_TASKS_BEGIN";
export const LIST_DEAD_TASKS_SUCCESS = "LIST_DEAD_TASKS_SUCCESS";
export const LIST_DEAD_TASKS_ERROR = "LIST_DEAD_TASKS_ERROR";
export const CANCEL_ACTIVE_TASK_BEGIN = "CANCEL_ACTIVE_TASK_BEGIN";
export const CANCEL_ACTIVE_TASK_SUCCESS = "CANCEL_ACTIVE_TASK_SUCCESS";
export const CANCEL_ACTIVE_TASK_ERROR = "CANCEL_ACTIVE_TASK_ERROR";
export const RUN_DEAD_TASK_BEGIN = "RUN_DEAD_TASK_BEGIN";
export const RUN_DEAD_TASK_SUCCESS = "RUN_DEAD_TASK_SUCCESS";
export const RUN_DEAD_TASK_ERROR = "RUN_DEAD_TASK_ERROR";
export const DELETE_SCHEDULED_TASK_BEGIN = "DELETE_SCHEDULED_TASK_BEGIN";
export const DELETE_SCHEDULED_TASK_SUCCESS = "DELETE_SCHEDULED_TASK_SUCCESS";
export const DELETE_SCHEDULED_TASK_ERROR = "DELETE_SCHEDULED_TASK_ERROR";
export const DELETE_RETRY_TASK_BEGIN = "DELETE_RETRY_TASK_BEGIN";
export const DELETE_RETRY_TASK_SUCCESS = "DELETE_RETRY_TASK_SUCCESS";
export const DELETE_RETRY_TASK_ERROR = "DELETE_RETRY_TASK_ERROR";
export const DELETE_DEAD_TASK_BEGIN = "DELETE_DEAD_TASK_BEGIN";
export const DELETE_DEAD_TASK_SUCCESS = "DELETE_DEAD_TASK_SUCCESS";
export const DELETE_DEAD_TASK_ERROR = "DELETE_DEAD_TASK_ERROR";
export const BATCH_RUN_DEAD_TASKS_BEGIN = "BATCH_RUN_DEAD_TASKS_BEGIN";
export const BATCH_RUN_DEAD_TASKS_SUCCESS = "BATCH_RUN_DEAD_TASKS_SUCCESS";
export const BATCH_RUN_DEAD_TASKS_ERROR = "BATCH_RUN_DEAD_TASKS_ERROR";
export const BATCH_DELETE_DEAD_TASKS_BEGIN = "BATCH_DELETE_DEAD_TASKS_BEGIN";
export const BATCH_DELETE_DEAD_TASKS_SUCCESS =
  "BATCH_DELETE_DEAD_TASKS_SUCCESS";
export const BATCH_DELETE_DEAD_TASKS_ERROR = "BATCH_DELETE_DEAD_TASKS_ERROR";

interface ListActiveTasksBeginAction {
  type: typeof LIST_ACTIVE_TASKS_BEGIN;
  queue: string;
}

interface ListActiveTasksSuccessAction {
  type: typeof LIST_ACTIVE_TASKS_SUCCESS;
  queue: string;
  payload: ListActiveTasksResponse;
}

interface ListActiveTasksErrorAction {
  type: typeof LIST_ACTIVE_TASKS_ERROR;
  queue: string;
  error: string; // error description
}

interface ListPendingTasksBeginAction {
  type: typeof LIST_PENDING_TASKS_BEGIN;
  queue: string;
}

interface ListPendingTasksSuccessAction {
  type: typeof LIST_PENDING_TASKS_SUCCESS;
  queue: string;
  payload: ListPendingTasksResponse;
}

interface ListPendingTasksErrorAction {
  type: typeof LIST_PENDING_TASKS_ERROR;
  queue: string;
  error: string; // error description
}

interface ListScheduledTasksBeginAction {
  type: typeof LIST_SCHEDULED_TASKS_BEGIN;
  queue: string;
}

interface ListScheduledTasksSuccessAction {
  type: typeof LIST_SCHEDULED_TASKS_SUCCESS;
  queue: string;
  payload: ListScheduledTasksResponse;
}

interface ListScheduledTasksErrorAction {
  type: typeof LIST_SCHEDULED_TASKS_ERROR;
  queue: string;
  error: string; // error description
}

interface ListRetryTasksBeginAction {
  type: typeof LIST_RETRY_TASKS_BEGIN;
  queue: string;
}

interface ListRetryTasksSuccessAction {
  type: typeof LIST_RETRY_TASKS_SUCCESS;
  queue: string;
  payload: ListRetryTasksResponse;
}

interface ListRetryTasksErrorAction {
  type: typeof LIST_RETRY_TASKS_ERROR;
  queue: string;
  error: string; // error description
}

interface ListDeadTasksBeginAction {
  type: typeof LIST_DEAD_TASKS_BEGIN;
  queue: string;
}

interface ListDeadTasksSuccessAction {
  type: typeof LIST_DEAD_TASKS_SUCCESS;
  queue: string;
  payload: ListDeadTasksResponse;
}

interface ListDeadTasksErrorAction {
  type: typeof LIST_DEAD_TASKS_ERROR;
  queue: string;
  error: string; // error description
}

interface CancelActiveTaskBeginAction {
  type: typeof CANCEL_ACTIVE_TASK_BEGIN;
  queue: string;
  taskId: string;
}

interface CancelActiveTaskSuccessAction {
  type: typeof CANCEL_ACTIVE_TASK_SUCCESS;
  queue: string;
  taskId: string;
}

interface CancelActiveTaskErrorAction {
  type: typeof CANCEL_ACTIVE_TASK_ERROR;
  queue: string;
  taskId: string;
  error: string;
}

interface RunDeadTaskBeginAction {
  type: typeof RUN_DEAD_TASK_BEGIN;
  queue: string;
  taskKey: string;
}

interface RunDeadTaskSuccessAction {
  type: typeof RUN_DEAD_TASK_SUCCESS;
  queue: string;
  taskKey: string;
}

interface RunDeadTaskErrorAction {
  type: typeof RUN_DEAD_TASK_ERROR;
  queue: string;
  taskKey: string;
  error: string;
}

interface DeleteScheduledTaskBeginAction {
  type: typeof DELETE_SCHEDULED_TASK_BEGIN;
  queue: string;
  taskKey: string;
}

interface DeleteScheduledTaskSuccessAction {
  type: typeof DELETE_SCHEDULED_TASK_SUCCESS;
  queue: string;
  taskKey: string;
}

interface DeleteScheduledTaskErrorAction {
  type: typeof DELETE_SCHEDULED_TASK_ERROR;
  queue: string;
  taskKey: string;
  error: string;
}

interface DeleteRetryTaskBeginAction {
  type: typeof DELETE_RETRY_TASK_BEGIN;
  queue: string;
  taskKey: string;
}

interface DeleteRetryTaskSuccessAction {
  type: typeof DELETE_RETRY_TASK_SUCCESS;
  queue: string;
  taskKey: string;
}

interface DeleteRetryTaskErrorAction {
  type: typeof DELETE_RETRY_TASK_ERROR;
  queue: string;
  taskKey: string;
  error: string;
}

interface DeleteDeadTaskBeginAction {
  type: typeof DELETE_DEAD_TASK_BEGIN;
  queue: string;
  taskKey: string;
}

interface DeleteDeadTaskSuccessAction {
  type: typeof DELETE_DEAD_TASK_SUCCESS;
  queue: string;
  taskKey: string;
}

interface DeleteDeadTaskErrorAction {
  type: typeof DELETE_DEAD_TASK_ERROR;
  queue: string;
  taskKey: string;
  error: string;
}

interface BatchDeleteDeadTasksBeginAction {
  type: typeof BATCH_DELETE_DEAD_TASKS_BEGIN;
  queue: string;
  taskKeys: string[];
}

interface BatchDeleteDeadTasksSuccessAction {
  type: typeof BATCH_DELETE_DEAD_TASKS_SUCCESS;
  queue: string;
  payload: BatchDeleteTasksResponse;
}

interface BatchDeleteDeadTasksErrorAction {
  type: typeof BATCH_DELETE_DEAD_TASKS_ERROR;
  queue: string;
  taskKeys: string[];
  error: string;
}

interface BatchRunDeadTasksBeginAction {
  type: typeof BATCH_RUN_DEAD_TASKS_BEGIN;
  queue: string;
  taskKeys: string[];
}

interface BatchRunDeadTasksSuccessAction {
  type: typeof BATCH_RUN_DEAD_TASKS_SUCCESS;
  queue: string;
  payload: BatchRunTasksResponse;
}

interface BatchRunDeadTasksErrorAction {
  type: typeof BATCH_RUN_DEAD_TASKS_ERROR;
  queue: string;
  taskKeys: string[];
  error: string;
}

// Union of all tasks related action types.
export type TasksActionTypes =
  | ListActiveTasksBeginAction
  | ListActiveTasksSuccessAction
  | ListActiveTasksErrorAction
  | ListPendingTasksBeginAction
  | ListPendingTasksSuccessAction
  | ListPendingTasksErrorAction
  | ListScheduledTasksBeginAction
  | ListScheduledTasksSuccessAction
  | ListScheduledTasksErrorAction
  | ListRetryTasksBeginAction
  | ListRetryTasksSuccessAction
  | ListRetryTasksErrorAction
  | ListDeadTasksBeginAction
  | ListDeadTasksSuccessAction
  | ListDeadTasksErrorAction
  | CancelActiveTaskBeginAction
  | CancelActiveTaskSuccessAction
  | CancelActiveTaskErrorAction
  | RunDeadTaskBeginAction
  | RunDeadTaskSuccessAction
  | RunDeadTaskErrorAction
  | DeleteScheduledTaskBeginAction
  | DeleteScheduledTaskSuccessAction
  | DeleteScheduledTaskErrorAction
  | DeleteRetryTaskBeginAction
  | DeleteRetryTaskSuccessAction
  | DeleteRetryTaskErrorAction
  | DeleteDeadTaskBeginAction
  | DeleteDeadTaskSuccessAction
  | DeleteDeadTaskErrorAction
  | BatchDeleteDeadTasksBeginAction
  | BatchDeleteDeadTasksSuccessAction
  | BatchDeleteDeadTasksErrorAction
  | BatchRunDeadTasksBeginAction
  | BatchRunDeadTasksSuccessAction
  | BatchRunDeadTasksErrorAction;

export function listActiveTasksAsync(
  qname: string,
  pageOpts?: PaginationOptions
) {
  return async (dispatch: Dispatch<TasksActionTypes>) => {
    dispatch({ type: LIST_ACTIVE_TASKS_BEGIN, queue: qname });
    try {
      const response = await listActiveTasks(qname, pageOpts);
      dispatch({
        type: LIST_ACTIVE_TASKS_SUCCESS,
        queue: qname,
        payload: response,
      });
    } catch {
      dispatch({
        type: LIST_ACTIVE_TASKS_ERROR,
        queue: qname,
        error: `Could not retreive active tasks data for queue: ${qname}`,
      });
    }
  };
}

export function listPendingTasksAsync(
  qname: string,
  pageOpts?: PaginationOptions
) {
  return async (dispatch: Dispatch<TasksActionTypes>) => {
    dispatch({ type: LIST_PENDING_TASKS_BEGIN, queue: qname });
    try {
      const response = await listPendingTasks(qname, pageOpts);
      dispatch({
        type: LIST_PENDING_TASKS_SUCCESS,
        queue: qname,
        payload: response,
      });
    } catch {
      dispatch({
        type: LIST_PENDING_TASKS_ERROR,
        queue: qname,
        error: `Could not retreive pending tasks data for queue: ${qname}`,
      });
    }
  };
}

export function listScheduledTasksAsync(
  qname: string,
  pageOpts?: PaginationOptions
) {
  return async (dispatch: Dispatch<TasksActionTypes>) => {
    dispatch({ type: LIST_SCHEDULED_TASKS_BEGIN, queue: qname });
    try {
      const response = await listScheduledTasks(qname, pageOpts);
      dispatch({
        type: LIST_SCHEDULED_TASKS_SUCCESS,
        queue: qname,
        payload: response,
      });
    } catch {
      dispatch({
        type: LIST_SCHEDULED_TASKS_ERROR,
        queue: qname,
        error: `Could not retreive scheduled tasks data for queue: ${qname}`,
      });
    }
  };
}

export function listRetryTasksAsync(
  qname: string,
  pageOpts?: PaginationOptions
) {
  return async (dispatch: Dispatch<TasksActionTypes>) => {
    dispatch({ type: LIST_RETRY_TASKS_BEGIN, queue: qname });
    try {
      const response = await listRetryTasks(qname, pageOpts);
      dispatch({
        type: LIST_RETRY_TASKS_SUCCESS,
        queue: qname,
        payload: response,
      });
    } catch {
      dispatch({
        type: LIST_RETRY_TASKS_ERROR,
        queue: qname,
        error: `Could not retreive retry tasks data for queue: ${qname}`,
      });
    }
  };
}

export function listDeadTasksAsync(
  qname: string,
  pageOpts?: PaginationOptions
) {
  return async (dispatch: Dispatch<TasksActionTypes>) => {
    dispatch({ type: LIST_DEAD_TASKS_BEGIN, queue: qname });
    try {
      const response = await listDeadTasks(qname, pageOpts);
      dispatch({
        type: LIST_DEAD_TASKS_SUCCESS,
        queue: qname,
        payload: response,
      });
    } catch {
      dispatch({
        type: LIST_DEAD_TASKS_ERROR,
        queue: qname,
        error: `Could not retreive dead tasks data for queue: ${qname}`,
      });
    }
  };
}

export function cancelActiveTaskAsync(queue: string, taskId: string) {
  return async (dispatch: Dispatch<TasksActionTypes>) => {
    dispatch({ type: CANCEL_ACTIVE_TASK_BEGIN, queue, taskId });
    try {
      await cancelActiveTask(queue, taskId);
      dispatch({ type: CANCEL_ACTIVE_TASK_SUCCESS, queue, taskId });
    } catch {
      dispatch({
        type: CANCEL_ACTIVE_TASK_ERROR,
        error: `Could not cancel task: ${taskId}`,
        queue,
        taskId,
      });
    }
  };
}

export function runDeadTaskAsync(queue: string, taskKey: string) {
  return async (dispatch: Dispatch<TasksActionTypes>) => {
    dispatch({ type: RUN_DEAD_TASK_BEGIN, queue, taskKey });
    try {
      await runDeadTask(queue, taskKey);
      dispatch({ type: RUN_DEAD_TASK_SUCCESS, queue, taskKey });
    } catch (error) {
      console.error("runDeadTaskAsync: ", error);
      dispatch({
        type: RUN_DEAD_TASK_ERROR,
        error: `Could not run task: ${taskKey}`,
        queue,
        taskKey,
      });
    }
  };
}

export function deleteScheduledTaskAsync(queue: string, taskKey: string) {
  return async (dispatch: Dispatch<TasksActionTypes>) => {
    dispatch({ type: DELETE_SCHEDULED_TASK_BEGIN, queue, taskKey });
    try {
      await deleteScheduledTask(queue, taskKey);
      dispatch({ type: DELETE_SCHEDULED_TASK_SUCCESS, queue, taskKey });
    } catch (error) {
      console.error("deleteScheduledTaskAsync: ", error);
      dispatch({
        type: DELETE_SCHEDULED_TASK_ERROR,
        error: `Could not delete task: ${taskKey}`,
        queue,
        taskKey,
      });
    }
  };
}

export function deleteRetryTaskAsync(queue: string, taskKey: string) {
  return async (dispatch: Dispatch<TasksActionTypes>) => {
    dispatch({ type: DELETE_RETRY_TASK_BEGIN, queue, taskKey });
    try {
      await deleteRetryTask(queue, taskKey);
      dispatch({ type: DELETE_RETRY_TASK_SUCCESS, queue, taskKey });
    } catch (error) {
      console.error("deleteRetryTaskAsync: ", error);
      dispatch({
        type: DELETE_RETRY_TASK_ERROR,
        error: `Could not delete task: ${taskKey}`,
        queue,
        taskKey,
      });
    }
  };
}

export function deleteDeadTaskAsync(queue: string, taskKey: string) {
  return async (dispatch: Dispatch<TasksActionTypes>) => {
    dispatch({ type: DELETE_DEAD_TASK_BEGIN, queue, taskKey });
    try {
      await deleteDeadTask(queue, taskKey);
      dispatch({ type: DELETE_DEAD_TASK_SUCCESS, queue, taskKey });
    } catch (error) {
      console.error("deleteDeadTaskAsync: ", error);
      dispatch({
        type: DELETE_DEAD_TASK_ERROR,
        error: `Could not delete task: ${taskKey}`,
        queue,
        taskKey,
      });
    }
  };
}

export function batchDeleteDeadTasksAsync(queue: string, taskKeys: string[]) {
  return async (dispatch: Dispatch<TasksActionTypes>) => {
    dispatch({ type: BATCH_DELETE_DEAD_TASKS_BEGIN, queue, taskKeys });
    try {
      const response = await batchDeleteDeadTasks(queue, taskKeys);
      dispatch({
        type: BATCH_DELETE_DEAD_TASKS_SUCCESS,
        queue: queue,
        payload: response,
      });
    } catch (error) {
      console.error("batchDeleteDeadTasksAsync: ", error);
      dispatch({
        type: BATCH_DELETE_DEAD_TASKS_ERROR,
        error: `Could not batch delete tasks: ${taskKeys}`,
        queue,
        taskKeys,
      });
    }
  };
}

export function batchRunDeadTasksAsync(queue: string, taskKeys: string[]) {
  return async (dispatch: Dispatch<TasksActionTypes>) => {
    dispatch({ type: BATCH_RUN_DEAD_TASKS_BEGIN, queue, taskKeys });
    try {
      const response = await batchRunDeadTasks(queue, taskKeys);
      dispatch({
        type: BATCH_RUN_DEAD_TASKS_SUCCESS,
        queue: queue,
        payload: response,
      });
    } catch (error) {
      console.error("batchRunDeadTasksAsync: ", error);
      dispatch({
        type: BATCH_RUN_DEAD_TASKS_ERROR,
        error: `Could not batch run tasks: ${taskKeys}`,
        queue,
        taskKeys,
      });
    }
  };
}
