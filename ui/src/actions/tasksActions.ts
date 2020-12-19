import {
  batchDeleteDeadTasks,
  batchDeleteRetryTasks,
  batchDeleteScheduledTasks,
  BatchDeleteTasksResponse,
  batchKillRetryTasks,
  batchKillScheduledTasks,
  BatchKillTasksResponse,
  batchRunDeadTasks,
  batchRunRetryTasks,
  batchRunScheduledTasks,
  BatchRunTasksResponse,
  cancelActiveTask,
  deleteAllDeadTasks,
  deleteAllRetryTasks,
  deleteAllScheduledTasks,
  deleteDeadTask,
  deleteRetryTask,
  deleteScheduledTask,
  killAllRetryTasks,
  killAllScheduledTasks,
  killRetryTask,
  killScheduledTask,
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
  runAllDeadTasks,
  runAllRetryTasks,
  runAllScheduledTasks,
  runDeadTask,
  runRetryTask,
  runScheduledTask,
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
export const RUN_SCHEDULED_TASK_BEGIN = "RUN_DEAD_TASK_BEGIN";
export const RUN_SCHEDULED_TASK_SUCCESS = "RUN_DEAD_TASK_SUCCESS";
export const RUN_SCHEDULED_TASK_ERROR = "RUN_DEAD_TASK_ERROR";
export const RUN_RETRY_TASK_BEGIN = "RUN_RETRY_TASK_BEGIN";
export const RUN_RETRY_TASK_SUCCESS = "RUN_RETRY_TASK_SUCCESS";
export const RUN_RETRY_TASK_ERROR = "RUN_RETRY_TASK_ERROR";
export const RUN_DEAD_TASK_BEGIN = "RUN_DEAD_TASK_BEGIN";
export const RUN_DEAD_TASK_SUCCESS = "RUN_DEAD_TASK_SUCCESS";
export const RUN_DEAD_TASK_ERROR = "RUN_DEAD_TASK_ERROR";
export const DELETE_SCHEDULED_TASK_BEGIN = "DELETE_SCHEDULED_TASK_BEGIN";
export const DELETE_SCHEDULED_TASK_SUCCESS = "DELETE_SCHEDULED_TASK_SUCCESS";
export const DELETE_SCHEDULED_TASK_ERROR = "DELETE_SCHEDULED_TASK_ERROR";
export const KILL_SCHEDULED_TASK_BEGIN = "KILL_DEAD_TASK_BEGIN";
export const KILL_SCHEDULED_TASK_SUCCESS = "KILL_DEAD_TASK_SUCCESS";
export const KILL_SCHEDULED_TASK_ERROR = "KILL_DEAD_TASK_ERROR";
export const KILL_RETRY_TASK_BEGIN = "KILL_RETRY_TASK_BEGIN";
export const KILL_RETRY_TASK_SUCCESS = "KILL_RETRY_TASK_SUCCESS";
export const KILL_RETRY_TASK_ERROR = "KILL_RETRY_TASK_ERROR";
export const BATCH_RUN_SCHEDULED_TASKS_BEGIN =
  "BATCH_RUN_SCHEDULED_TASKS_BEGIN";
export const BATCH_RUN_SCHEDULED_TASKS_SUCCESS =
  "BATCH_RUN_SCHEDULED_TASKS_SUCCESS";
export const BATCH_RUN_SCHEDULED_TASKS_ERROR =
  "BATCH_RUN_SCHEDULED_TASKS_ERROR";
export const BATCH_KILL_SCHEDULED_TASKS_BEGIN =
  "BATCH_KILL_SCHEDULED_TASKS_BEGIN";
export const BATCH_KILL_SCHEDULED_TASKS_SUCCESS =
  "BATCH_KILL_SCHEDULED_TASKS_SUCCESS";
export const BATCH_KILL_SCHEDULED_TASKS_ERROR =
  "BATCH_RUN_SCHEDULED_TASKS_ERROR";
export const BATCH_DELETE_SCHEDULED_TASKS_BEGIN =
  "BATCH_DELETE_SCHEDULED_TASKS_BEGIN";
export const BATCH_DELETE_SCHEDULED_TASKS_SUCCESS =
  "BATCH_DELETE_SCHEDULED_TASKS_SUCCESS";
export const BATCH_DELETE_SCHEDULED_TASKS_ERROR =
  "BATCH_DELETE_SCHEDULED_TASKS_ERROR";
export const RUN_ALL_SCHEDULED_TASKS_BEGIN = "RUN_ALL_SCHEDULED_TASKS_BEGIN";
export const RUN_ALL_SCHEDULED_TASKS_SUCCESS =
  "RUN_ALL_SCHEDULED_TASKS_SUCCESS";
export const RUN_ALL_SCHEDULED_TASKS_ERROR = "RUN_ALL_SCHEDULED_TASKS_ERROR";
export const KILL_ALL_SCHEDULED_TASKS_BEGIN = "KILL_ALL_SCHEDULED_TASKS_BEGIN";
export const KILL_ALL_SCHEDULED_TASKS_SUCCESS =
  "KILL_ALL_SCHEDULED_TASKS_SUCCESS";
export const KILL_ALL_SCHEDULED_TASKS_ERROR = "KILL_ALL_SCHEDULED_TASKS_ERROR";
export const DELETE_ALL_SCHEDULED_TASKS_BEGIN =
  "DELETE_ALL_SCHEDULED_TASKS_BEGIN";
export const DELETE_ALL_SCHEDULED_TASKS_SUCCESS =
  "DELETE_ALL_SCHEDULED_TASKS_SUCCESS";
export const DELETE_ALL_SCHEDULED_TASKS_ERROR =
  "DELETE_ALL_SCHEDULED_TASKS_ERROR";
export const DELETE_RETRY_TASK_BEGIN = "DELETE_RETRY_TASK_BEGIN";
export const DELETE_RETRY_TASK_SUCCESS = "DELETE_RETRY_TASK_SUCCESS";
export const DELETE_RETRY_TASK_ERROR = "DELETE_RETRY_TASK_ERROR";
export const BATCH_RUN_RETRY_TASKS_BEGIN = "BATCH_RUN_RETRY_TASKS_BEGIN";
export const BATCH_RUN_RETRY_TASKS_SUCCESS = "BATCH_RUN_RETRY_TASKS_SUCCESS";
export const BATCH_RUN_RETRY_TASKS_ERROR = "BATCH_RUN_RETRY_TASKS_ERROR";
export const BATCH_KILL_RETRY_TASKS_BEGIN = "BATCH_KILL_RETRY_TASKS_BEGIN";
export const BATCH_KILL_RETRY_TASKS_SUCCESS = "BATCH_KILL_RETRY_TASKS_SUCCESS";
export const BATCH_KILL_RETRY_TASKS_ERROR = "BATCH_KILL_RETRY_TASKS_ERROR";
export const BATCH_DELETE_RETRY_TASKS_BEGIN = "BATCH_DELETE_RETRY_TASKS_BEGIN";
export const BATCH_DELETE_RETRY_TASKS_SUCCESS =
  "BATCH_DELETE_RETRY_TASKS_SUCCESS";
export const BATCH_DELETE_RETRY_TASKS_ERROR = "BATCH_DELETE_RETRY_TASKS_ERROR";
export const RUN_ALL_RETRY_TASKS_BEGIN = "RUN_ALL_RETRY_TASKS_BEGIN";
export const RUN_ALL_RETRY_TASKS_SUCCESS = "RUN_ALL_RETRY_TASKS_SUCCESS";
export const RUN_ALL_RETRY_TASKS_ERROR = "RUN_ALL_RETRY_TASKS_ERROR";
export const KILL_ALL_RETRY_TASKS_BEGIN = "KILL_ALL_RETRY_TASKS_BEGIN";
export const KILL_ALL_RETRY_TASKS_SUCCESS = "KILL_ALL_RETRY_TASKS_SUCCESS";
export const KILL_ALL_RETRY_TASKS_ERROR = "KILL_ALL_RETRY_TASKS_ERROR";
export const DELETE_ALL_RETRY_TASKS_BEGIN = "DELETE_ALL_RETRY_TASKS_BEGIN";
export const DELETE_ALL_RETRY_TASKS_SUCCESS = "DELETE_ALL_RETRY_TASKS_SUCCESS";
export const DELETE_ALL_RETRY_TASKS_ERROR = "DELETE_ALL_RETRY_TASKS_ERROR";
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
export const RUN_ALL_DEAD_TASKS_BEGIN = "RUN_ALL_DEAD_TASKS_BEGIN";
export const RUN_ALL_DEAD_TASKS_SUCCESS = "RUN_ALL_DEAD_TASKS_SUCCESS";
export const RUN_ALL_DEAD_TASKS_ERROR = "RUN_ALL_DEAD_TASKS_ERROR";
export const DELETE_ALL_DEAD_TASKS_BEGIN = "DELETE_ALL_DEAD_TASKS_BEGIN";
export const DELETE_ALL_DEAD_TASKS_SUCCESS = "DELETE_ALL_DEAD_TASKS_SUCCESS";
export const DELETE_ALL_DEAD_TASKS_ERROR = "DELETE_ALL_DEAD_TASKS_ERROR";

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

interface RunScheduledTaskBeginAction {
  type: typeof RUN_SCHEDULED_TASK_BEGIN;
  queue: string;
  taskKey: string;
}

interface RunScheduledTaskSuccessAction {
  type: typeof RUN_SCHEDULED_TASK_SUCCESS;
  queue: string;
  taskKey: string;
}

interface RunScheduledTaskErrorAction {
  type: typeof RUN_SCHEDULED_TASK_ERROR;
  queue: string;
  taskKey: string;
  error: string;
}

interface KillScheduledTaskBeginAction {
  type: typeof KILL_SCHEDULED_TASK_BEGIN;
  queue: string;
  taskKey: string;
}

interface KillScheduledTaskSuccessAction {
  type: typeof KILL_SCHEDULED_TASK_SUCCESS;
  queue: string;
  taskKey: string;
}

interface KillScheduledTaskErrorAction {
  type: typeof KILL_SCHEDULED_TASK_ERROR;
  queue: string;
  taskKey: string;
  error: string;
}

interface RunRetryTaskBeginAction {
  type: typeof RUN_RETRY_TASK_BEGIN;
  queue: string;
  taskKey: string;
}

interface RunRetryTaskSuccessAction {
  type: typeof RUN_RETRY_TASK_SUCCESS;
  queue: string;
  taskKey: string;
}

interface RunRetryTaskErrorAction {
  type: typeof RUN_RETRY_TASK_ERROR;
  queue: string;
  taskKey: string;
  error: string;
}

interface KillRetryTaskBeginAction {
  type: typeof KILL_RETRY_TASK_BEGIN;
  queue: string;
  taskKey: string;
}

interface KillRetryTaskSuccessAction {
  type: typeof KILL_RETRY_TASK_SUCCESS;
  queue: string;
  taskKey: string;
}

interface KillRetryTaskErrorAction {
  type: typeof KILL_RETRY_TASK_ERROR;
  queue: string;
  taskKey: string;
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

interface BatchDeleteScheduledTasksBeginAction {
  type: typeof BATCH_DELETE_SCHEDULED_TASKS_BEGIN;
  queue: string;
  taskKeys: string[];
}

interface BatchDeleteScheduledTasksSuccessAction {
  type: typeof BATCH_DELETE_SCHEDULED_TASKS_SUCCESS;
  queue: string;
  payload: BatchDeleteTasksResponse;
}

interface BatchDeleteScheduledTasksErrorAction {
  type: typeof BATCH_DELETE_SCHEDULED_TASKS_ERROR;
  queue: string;
  taskKeys: string[];
  error: string;
}

interface BatchRunScheduledTasksBeginAction {
  type: typeof BATCH_RUN_SCHEDULED_TASKS_BEGIN;
  queue: string;
  taskKeys: string[];
}

interface BatchRunScheduledTasksSuccessAction {
  type: typeof BATCH_RUN_SCHEDULED_TASKS_SUCCESS;
  queue: string;
  payload: BatchRunTasksResponse;
}

interface BatchRunScheduledTasksErrorAction {
  type: typeof BATCH_RUN_SCHEDULED_TASKS_ERROR;
  queue: string;
  taskKeys: string[];
  error: string;
}

interface RunAllScheduledTasksBeginAction {
  type: typeof RUN_ALL_SCHEDULED_TASKS_BEGIN;
  queue: string;
}

interface RunAllScheduledTasksSuccessAction {
  type: typeof RUN_ALL_SCHEDULED_TASKS_SUCCESS;
  queue: string;
}

interface RunAllScheduledTasksErrorAction {
  type: typeof RUN_ALL_SCHEDULED_TASKS_ERROR;
  queue: string;
  error: string;
}

interface BatchKillScheduledTasksBeginAction {
  type: typeof BATCH_KILL_SCHEDULED_TASKS_BEGIN;
  queue: string;
  taskKeys: string[];
}

interface BatchKillScheduledTasksSuccessAction {
  type: typeof BATCH_KILL_SCHEDULED_TASKS_SUCCESS;
  queue: string;
  payload: BatchKillTasksResponse;
}

interface BatchKillScheduledTasksErrorAction {
  type: typeof BATCH_KILL_SCHEDULED_TASKS_ERROR;
  queue: string;
  taskKeys: string[];
  error: string;
}

interface KillAllScheduledTasksBeginAction {
  type: typeof KILL_ALL_SCHEDULED_TASKS_BEGIN;
  queue: string;
}

interface KillAllScheduledTasksSuccessAction {
  type: typeof KILL_ALL_SCHEDULED_TASKS_SUCCESS;
  queue: string;
}

interface KillAllScheduledTasksErrorAction {
  type: typeof KILL_ALL_SCHEDULED_TASKS_ERROR;
  queue: string;
  error: string;
}

interface DeleteAllScheduledTasksBeginAction {
  type: typeof DELETE_ALL_SCHEDULED_TASKS_BEGIN;
  queue: string;
}

interface DeleteAllScheduledTasksSuccessAction {
  type: typeof DELETE_ALL_SCHEDULED_TASKS_SUCCESS;
  queue: string;
}

interface DeleteAllScheduledTasksErrorAction {
  type: typeof DELETE_ALL_SCHEDULED_TASKS_ERROR;
  queue: string;
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

interface BatchDeleteRetryTasksBeginAction {
  type: typeof BATCH_DELETE_RETRY_TASKS_BEGIN;
  queue: string;
  taskKeys: string[];
}

interface BatchDeleteRetryTasksSuccessAction {
  type: typeof BATCH_DELETE_RETRY_TASKS_SUCCESS;
  queue: string;
  payload: BatchDeleteTasksResponse;
}

interface BatchDeleteRetryTasksErrorAction {
  type: typeof BATCH_DELETE_RETRY_TASKS_ERROR;
  queue: string;
  taskKeys: string[];
  error: string;
}

interface BatchRunRetryTasksBeginAction {
  type: typeof BATCH_RUN_RETRY_TASKS_BEGIN;
  queue: string;
  taskKeys: string[];
}

interface BatchRunRetryTasksSuccessAction {
  type: typeof BATCH_RUN_RETRY_TASKS_SUCCESS;
  queue: string;
  payload: BatchRunTasksResponse;
}

interface BatchRunRetryTasksErrorAction {
  type: typeof BATCH_RUN_RETRY_TASKS_ERROR;
  queue: string;
  taskKeys: string[];
  error: string;
}

interface RunAllRetryTasksBeginAction {
  type: typeof RUN_ALL_RETRY_TASKS_BEGIN;
  queue: string;
}

interface RunAllRetryTasksSuccessAction {
  type: typeof RUN_ALL_RETRY_TASKS_SUCCESS;
  queue: string;
}

interface RunAllRetryTasksErrorAction {
  type: typeof RUN_ALL_RETRY_TASKS_ERROR;
  queue: string;
  error: string;
}

interface BatchKillRetryTasksBeginAction {
  type: typeof BATCH_KILL_RETRY_TASKS_BEGIN;
  queue: string;
  taskKeys: string[];
}

interface BatchKillRetryTasksSuccessAction {
  type: typeof BATCH_KILL_RETRY_TASKS_SUCCESS;
  queue: string;
  payload: BatchKillTasksResponse;
}

interface BatchKillRetryTasksErrorAction {
  type: typeof BATCH_KILL_RETRY_TASKS_ERROR;
  queue: string;
  taskKeys: string[];
  error: string;
}

interface KillAllRetryTasksBeginAction {
  type: typeof KILL_ALL_RETRY_TASKS_BEGIN;
  queue: string;
}

interface KillAllRetryTasksSuccessAction {
  type: typeof KILL_ALL_RETRY_TASKS_SUCCESS;
  queue: string;
}

interface KillAllRetryTasksErrorAction {
  type: typeof KILL_ALL_RETRY_TASKS_ERROR;
  queue: string;
  error: string;
}

interface DeleteAllRetryTasksBeginAction {
  type: typeof DELETE_ALL_RETRY_TASKS_BEGIN;
  queue: string;
}

interface DeleteAllRetryTasksSuccessAction {
  type: typeof DELETE_ALL_RETRY_TASKS_SUCCESS;
  queue: string;
}

interface DeleteAllRetryTasksErrorAction {
  type: typeof DELETE_ALL_RETRY_TASKS_ERROR;
  queue: string;
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

interface RunAllDeadTasksBeginAction {
  type: typeof RUN_ALL_DEAD_TASKS_BEGIN;
  queue: string;
}

interface RunAllDeadTasksSuccessAction {
  type: typeof RUN_ALL_DEAD_TASKS_SUCCESS;
  queue: string;
}

interface RunAllDeadTasksErrorAction {
  type: typeof RUN_ALL_DEAD_TASKS_ERROR;
  queue: string;
  error: string;
}

interface DeleteAllDeadTasksBeginAction {
  type: typeof DELETE_ALL_DEAD_TASKS_BEGIN;
  queue: string;
}

interface DeleteAllDeadTasksSuccessAction {
  type: typeof DELETE_ALL_DEAD_TASKS_SUCCESS;
  queue: string;
}

interface DeleteAllDeadTasksErrorAction {
  type: typeof DELETE_ALL_DEAD_TASKS_ERROR;
  queue: string;
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
  | RunScheduledTaskBeginAction
  | RunScheduledTaskSuccessAction
  | RunScheduledTaskErrorAction
  | RunRetryTaskBeginAction
  | RunRetryTaskSuccessAction
  | RunRetryTaskErrorAction
  | RunDeadTaskBeginAction
  | RunDeadTaskSuccessAction
  | RunDeadTaskErrorAction
  | KillScheduledTaskBeginAction
  | KillScheduledTaskSuccessAction
  | KillScheduledTaskErrorAction
  | KillRetryTaskBeginAction
  | KillRetryTaskSuccessAction
  | KillRetryTaskErrorAction
  | DeleteScheduledTaskBeginAction
  | DeleteScheduledTaskSuccessAction
  | DeleteScheduledTaskErrorAction
  | BatchDeleteScheduledTasksBeginAction
  | BatchDeleteScheduledTasksSuccessAction
  | BatchDeleteScheduledTasksErrorAction
  | BatchRunScheduledTasksBeginAction
  | BatchRunScheduledTasksSuccessAction
  | BatchRunScheduledTasksErrorAction
  | RunAllScheduledTasksBeginAction
  | RunAllScheduledTasksSuccessAction
  | RunAllScheduledTasksErrorAction
  | BatchKillScheduledTasksBeginAction
  | BatchKillScheduledTasksSuccessAction
  | BatchKillScheduledTasksErrorAction
  | KillAllScheduledTasksBeginAction
  | KillAllScheduledTasksSuccessAction
  | KillAllScheduledTasksErrorAction
  | DeleteAllScheduledTasksBeginAction
  | DeleteAllScheduledTasksSuccessAction
  | DeleteAllScheduledTasksErrorAction
  | DeleteRetryTaskBeginAction
  | DeleteRetryTaskSuccessAction
  | DeleteRetryTaskErrorAction
  | BatchDeleteRetryTasksBeginAction
  | BatchDeleteRetryTasksSuccessAction
  | BatchDeleteRetryTasksErrorAction
  | BatchRunRetryTasksBeginAction
  | BatchRunRetryTasksSuccessAction
  | BatchRunRetryTasksErrorAction
  | RunAllRetryTasksBeginAction
  | RunAllRetryTasksSuccessAction
  | RunAllRetryTasksErrorAction
  | BatchKillRetryTasksBeginAction
  | BatchKillRetryTasksSuccessAction
  | BatchKillRetryTasksErrorAction
  | KillAllRetryTasksBeginAction
  | KillAllRetryTasksSuccessAction
  | KillAllRetryTasksErrorAction
  | DeleteAllRetryTasksBeginAction
  | DeleteAllRetryTasksSuccessAction
  | DeleteAllRetryTasksErrorAction
  | DeleteDeadTaskBeginAction
  | DeleteDeadTaskSuccessAction
  | DeleteDeadTaskErrorAction
  | BatchDeleteDeadTasksBeginAction
  | BatchDeleteDeadTasksSuccessAction
  | BatchDeleteDeadTasksErrorAction
  | BatchRunDeadTasksBeginAction
  | BatchRunDeadTasksSuccessAction
  | BatchRunDeadTasksErrorAction
  | RunAllDeadTasksBeginAction
  | RunAllDeadTasksSuccessAction
  | RunAllDeadTasksErrorAction
  | DeleteAllDeadTasksBeginAction
  | DeleteAllDeadTasksSuccessAction
  | DeleteAllDeadTasksErrorAction;

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

export function runScheduledTaskAsync(queue: string, taskKey: string) {
  return async (dispatch: Dispatch<TasksActionTypes>) => {
    dispatch({ type: RUN_SCHEDULED_TASK_BEGIN, queue, taskKey });
    try {
      await runScheduledTask(queue, taskKey);
      dispatch({ type: RUN_SCHEDULED_TASK_SUCCESS, queue, taskKey });
    } catch (error) {
      console.error("runScheduledTaskAsync: ", error);
      dispatch({
        type: RUN_SCHEDULED_TASK_ERROR,
        error: `Could not run task: ${taskKey}`,
        queue,
        taskKey,
      });
    }
  };
}

export function runRetryTaskAsync(queue: string, taskKey: string) {
  return async (dispatch: Dispatch<TasksActionTypes>) => {
    dispatch({ type: RUN_RETRY_TASK_BEGIN, queue, taskKey });
    try {
      await runRetryTask(queue, taskKey);
      dispatch({ type: RUN_RETRY_TASK_SUCCESS, queue, taskKey });
    } catch (error) {
      console.error("runRetryTaskAsync: ", error);
      dispatch({
        type: RUN_RETRY_TASK_ERROR,
        error: `Could not run task: ${taskKey}`,
        queue,
        taskKey,
      });
    }
  };
}

export function killScheduledTaskAsync(queue: string, taskKey: string) {
  return async (dispatch: Dispatch<TasksActionTypes>) => {
    dispatch({ type: KILL_SCHEDULED_TASK_BEGIN, queue, taskKey });
    try {
      await killScheduledTask(queue, taskKey);
      dispatch({ type: KILL_SCHEDULED_TASK_SUCCESS, queue, taskKey });
    } catch (error) {
      console.error("killScheduledTaskAsync: ", error);
      dispatch({
        type: KILL_SCHEDULED_TASK_ERROR,
        error: `Could not kill task: ${taskKey}`,
        queue,
        taskKey,
      });
    }
  };
}

export function killRetryTaskAsync(queue: string, taskKey: string) {
  return async (dispatch: Dispatch<TasksActionTypes>) => {
    dispatch({ type: KILL_RETRY_TASK_BEGIN, queue, taskKey });
    try {
      await killRetryTask(queue, taskKey);
      dispatch({ type: KILL_RETRY_TASK_SUCCESS, queue, taskKey });
    } catch (error) {
      console.error("killRetryTaskAsync: ", error);
      dispatch({
        type: KILL_RETRY_TASK_ERROR,
        error: `Could not kill task: ${taskKey}`,
        queue,
        taskKey,
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

export function batchDeleteScheduledTasksAsync(
  queue: string,
  taskKeys: string[]
) {
  return async (dispatch: Dispatch<TasksActionTypes>) => {
    dispatch({ type: BATCH_DELETE_SCHEDULED_TASKS_BEGIN, queue, taskKeys });
    try {
      const response = await batchDeleteScheduledTasks(queue, taskKeys);
      dispatch({
        type: BATCH_DELETE_SCHEDULED_TASKS_SUCCESS,
        queue: queue,
        payload: response,
      });
    } catch (error) {
      console.error("batchDeleteScheduledTasksAsync: ", error);
      dispatch({
        type: BATCH_DELETE_SCHEDULED_TASKS_ERROR,
        error: `Could not batch delete tasks: ${taskKeys}`,
        queue,
        taskKeys,
      });
    }
  };
}

export function batchRunScheduledTasksAsync(queue: string, taskKeys: string[]) {
  return async (dispatch: Dispatch<TasksActionTypes>) => {
    dispatch({ type: BATCH_RUN_SCHEDULED_TASKS_BEGIN, queue, taskKeys });
    try {
      const response = await batchRunScheduledTasks(queue, taskKeys);
      dispatch({
        type: BATCH_RUN_SCHEDULED_TASKS_SUCCESS,
        queue: queue,
        payload: response,
      });
    } catch (error) {
      console.error("batchRunScheduledTasksAsync: ", error);
      dispatch({
        type: BATCH_RUN_SCHEDULED_TASKS_ERROR,
        error: `Could not batch run tasks: ${taskKeys}`,
        queue,
        taskKeys,
      });
    }
  };
}

export function batchKillScheduledTasksAsync(
  queue: string,
  taskKeys: string[]
) {
  return async (dispatch: Dispatch<TasksActionTypes>) => {
    dispatch({ type: BATCH_KILL_SCHEDULED_TASKS_BEGIN, queue, taskKeys });
    try {
      const response = await batchKillScheduledTasks(queue, taskKeys);
      dispatch({
        type: BATCH_KILL_SCHEDULED_TASKS_SUCCESS,
        queue: queue,
        payload: response,
      });
    } catch (error) {
      console.error("batchKillScheduledTasksAsync: ", error);
      dispatch({
        type: BATCH_KILL_SCHEDULED_TASKS_ERROR,
        error: `Could not batch kill tasks: ${taskKeys}`,
        queue,
        taskKeys,
      });
    }
  };
}

export function deleteAllScheduledTasksAsync(queue: string) {
  return async (dispatch: Dispatch<TasksActionTypes>) => {
    dispatch({ type: DELETE_ALL_SCHEDULED_TASKS_BEGIN, queue });
    try {
      await deleteAllScheduledTasks(queue);
      dispatch({ type: DELETE_ALL_SCHEDULED_TASKS_SUCCESS, queue });
    } catch (error) {
      console.error("deleteAllScheduledTasksAsync: ", error);
      dispatch({
        type: DELETE_ALL_SCHEDULED_TASKS_ERROR,
        error: `Could not delete all scheduled tasks`,
        queue,
      });
    }
  };
}

export function runAllScheduledTasksAsync(queue: string) {
  return async (dispatch: Dispatch<TasksActionTypes>) => {
    dispatch({ type: RUN_ALL_SCHEDULED_TASKS_BEGIN, queue });
    try {
      await runAllScheduledTasks(queue);
      dispatch({ type: RUN_ALL_SCHEDULED_TASKS_SUCCESS, queue });
    } catch (error) {
      console.error("runAllScheduledTasksAsync: ", error);
      dispatch({
        type: RUN_ALL_SCHEDULED_TASKS_ERROR,
        error: `Could not run all scheduled tasks`,
        queue,
      });
    }
  };
}

export function killAllScheduledTasksAsync(queue: string) {
  return async (dispatch: Dispatch<TasksActionTypes>) => {
    dispatch({ type: RUN_ALL_SCHEDULED_TASKS_BEGIN, queue });
    try {
      await killAllScheduledTasks(queue);
      dispatch({ type: RUN_ALL_SCHEDULED_TASKS_SUCCESS, queue });
    } catch (error) {
      console.error("killAllScheduledTasksAsync: ", error);
      dispatch({
        type: RUN_ALL_SCHEDULED_TASKS_ERROR,
        error: `Could not kill all scheduled tasks`,
        queue,
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

export function batchDeleteRetryTasksAsync(queue: string, taskKeys: string[]) {
  return async (dispatch: Dispatch<TasksActionTypes>) => {
    dispatch({ type: BATCH_DELETE_RETRY_TASKS_BEGIN, queue, taskKeys });
    try {
      const response = await batchDeleteRetryTasks(queue, taskKeys);
      dispatch({
        type: BATCH_DELETE_RETRY_TASKS_SUCCESS,
        queue: queue,
        payload: response,
      });
    } catch (error) {
      console.error("batchDeleteRetryTasksAsync: ", error);
      dispatch({
        type: BATCH_DELETE_RETRY_TASKS_ERROR,
        error: `Could not batch delete tasks: ${taskKeys}`,
        queue,
        taskKeys,
      });
    }
  };
}

export function batchRunRetryTasksAsync(queue: string, taskKeys: string[]) {
  return async (dispatch: Dispatch<TasksActionTypes>) => {
    dispatch({ type: BATCH_RUN_RETRY_TASKS_BEGIN, queue, taskKeys });
    try {
      const response = await batchRunRetryTasks(queue, taskKeys);
      dispatch({
        type: BATCH_RUN_RETRY_TASKS_SUCCESS,
        queue: queue,
        payload: response,
      });
    } catch (error) {
      console.error("batchRunRetryTasksAsync: ", error);
      dispatch({
        type: BATCH_RUN_RETRY_TASKS_ERROR,
        error: `Could not batch run tasks: ${taskKeys}`,
        queue,
        taskKeys,
      });
    }
  };
}

export function batchKillRetryTasksAsync(queue: string, taskKeys: string[]) {
  return async (dispatch: Dispatch<TasksActionTypes>) => {
    dispatch({ type: BATCH_KILL_RETRY_TASKS_BEGIN, queue, taskKeys });
    try {
      const response = await batchKillRetryTasks(queue, taskKeys);
      dispatch({
        type: BATCH_KILL_RETRY_TASKS_SUCCESS,
        queue: queue,
        payload: response,
      });
    } catch (error) {
      console.error("batchKillRetryTasksAsync: ", error);
      dispatch({
        type: BATCH_KILL_RETRY_TASKS_ERROR,
        error: `Could not batch kill tasks: ${taskKeys}`,
        queue,
        taskKeys,
      });
    }
  };
}

export function deleteAllRetryTasksAsync(queue: string) {
  return async (dispatch: Dispatch<TasksActionTypes>) => {
    dispatch({ type: DELETE_ALL_RETRY_TASKS_BEGIN, queue });
    try {
      await deleteAllRetryTasks(queue);
      dispatch({ type: DELETE_ALL_RETRY_TASKS_SUCCESS, queue });
    } catch (error) {
      console.error("deleteAllRetryTasksAsync: ", error);
      dispatch({
        type: DELETE_ALL_RETRY_TASKS_ERROR,
        error: `Could not delete all retry tasks`,
        queue,
      });
    }
  };
}

export function runAllRetryTasksAsync(queue: string) {
  return async (dispatch: Dispatch<TasksActionTypes>) => {
    dispatch({ type: RUN_ALL_RETRY_TASKS_BEGIN, queue });
    try {
      await runAllRetryTasks(queue);
      dispatch({ type: RUN_ALL_RETRY_TASKS_SUCCESS, queue });
    } catch (error) {
      console.error("runAllRetryTasksAsync: ", error);
      dispatch({
        type: RUN_ALL_RETRY_TASKS_ERROR,
        error: `Could not run all retry tasks`,
        queue,
      });
    }
  };
}

export function killAllRetryTasksAsync(queue: string) {
  return async (dispatch: Dispatch<TasksActionTypes>) => {
    dispatch({ type: KILL_ALL_RETRY_TASKS_BEGIN, queue });
    try {
      await killAllRetryTasks(queue);
      dispatch({ type: KILL_ALL_RETRY_TASKS_SUCCESS, queue });
    } catch (error) {
      console.error("killAllRetryTasksAsync: ", error);
      dispatch({
        type: KILL_ALL_RETRY_TASKS_ERROR,
        error: `Could not kill all retry tasks`,
        queue,
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

export function deleteAllDeadTasksAsync(queue: string) {
  return async (dispatch: Dispatch<TasksActionTypes>) => {
    dispatch({ type: DELETE_ALL_DEAD_TASKS_BEGIN, queue });
    try {
      await deleteAllDeadTasks(queue);
      dispatch({ type: DELETE_ALL_DEAD_TASKS_SUCCESS, queue });
    } catch (error) {
      console.error("deleteAllDeadTasksAsync: ", error);
      dispatch({
        type: DELETE_ALL_DEAD_TASKS_ERROR,
        error: `Could not delete all dead tasks`,
        queue,
      });
    }
  };
}

export function runAllDeadTasksAsync(queue: string) {
  return async (dispatch: Dispatch<TasksActionTypes>) => {
    dispatch({ type: RUN_ALL_DEAD_TASKS_BEGIN, queue });
    try {
      await runAllDeadTasks(queue);
      dispatch({ type: RUN_ALL_DEAD_TASKS_SUCCESS, queue });
    } catch (error) {
      console.error("runAllDeadTasksAsync: ", error);
      dispatch({
        type: RUN_ALL_DEAD_TASKS_ERROR,
        error: `Could not run all dead tasks`,
        queue,
      });
    }
  };
}
