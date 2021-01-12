import {
  batchCancelActiveTasks,
  BatchCancelTasksResponse,
  batchDeleteArchivedTasks,
  batchDeleteRetryTasks,
  batchDeleteScheduledTasks,
  BatchDeleteTasksResponse,
  batchArchiveRetryTasks,
  batchArchiveScheduledTasks,
  BatchArchiveTasksResponse,
  batchRunArchivedTasks,
  batchRunRetryTasks,
  batchRunScheduledTasks,
  BatchRunTasksResponse,
  cancelActiveTask,
  cancelAllActiveTasks,
  deleteAllArchivedTasks,
  deleteAllRetryTasks,
  deleteAllScheduledTasks,
  deleteArchivedTask,
  deleteRetryTask,
  deleteScheduledTask,
  archiveAllRetryTasks,
  archiveAllScheduledTasks,
  archiveRetryTask,
  archiveScheduledTask,
  listActiveTasks,
  ListActiveTasksResponse,
  listArchivedTasks,
  ListArchivedTasksResponse,
  listPendingTasks,
  ListPendingTasksResponse,
  listRetryTasks,
  ListRetryTasksResponse,
  listScheduledTasks,
  ListScheduledTasksResponse,
  PaginationOptions,
  runAllArchivedTasks,
  runAllRetryTasks,
  runAllScheduledTasks,
  runArchivedTask,
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
export const LIST_ARCHIVED_TASKS_BEGIN = "LIST_ARCHIVED_TASKS_BEGIN";
export const LIST_ARCHIVED_TASKS_SUCCESS = "LIST_ARCHIVED_TASKS_SUCCESS";
export const LIST_ARCHIVED_TASKS_ERROR = "LIST_ARCHIVED_TASKS_ERROR";
export const CANCEL_ACTIVE_TASK_BEGIN = "CANCEL_ACTIVE_TASK_BEGIN";
export const CANCEL_ACTIVE_TASK_SUCCESS = "CANCEL_ACTIVE_TASK_SUCCESS";
export const CANCEL_ACTIVE_TASK_ERROR = "CANCEL_ACTIVE_TASK_ERROR";
export const CANCEL_ALL_ACTIVE_TASKS_BEGIN = "CANCEL_ALL_ACTIVE_TASKS_BEGIN";
export const CANCEL_ALL_ACTIVE_TASKS_SUCCESS =
  "CANCEL_ALL_ACTIVE_TASKS_SUCCESS";
export const CANCEL_ALL_ACTIVE_TASKS_ERROR = "CANCEL_ALL_ACTIVE_TASKS_ERROR";
export const BATCH_CANCEL_ACTIVE_TASKS_BEGIN =
  "BATCH_CANCEL_ACTIVE_TASKS_BEGIN";
export const BATCH_CANCEL_ACTIVE_TASKS_SUCCESS =
  "BATCH_CANCEL_ACTIVE_TASKS_SUCCESS";
export const BATCH_CANCEL_ACTIVE_TASKS_ERROR =
  "BATCH_CANCEL_ACTIVE_TASKS_ERROR";
export const RUN_SCHEDULED_TASK_BEGIN = "RUN_ARCHIVED_TASK_BEGIN";
export const RUN_SCHEDULED_TASK_SUCCESS = "RUN_ARCHIVED_TASK_SUCCESS";
export const RUN_SCHEDULED_TASK_ERROR = "RUN_ARCHIVED_TASK_ERROR";
export const RUN_RETRY_TASK_BEGIN = "RUN_RETRY_TASK_BEGIN";
export const RUN_RETRY_TASK_SUCCESS = "RUN_RETRY_TASK_SUCCESS";
export const RUN_RETRY_TASK_ERROR = "RUN_RETRY_TASK_ERROR";
export const RUN_ARCHIVED_TASK_BEGIN = "RUN_ARCHIVED_TASK_BEGIN";
export const RUN_ARCHIVED_TASK_SUCCESS = "RUN_ARCHIVED_TASK_SUCCESS";
export const RUN_ARCHIVED_TASK_ERROR = "RUN_ARCHIVED_TASK_ERROR";
export const DELETE_SCHEDULED_TASK_BEGIN = "DELETE_SCHEDULED_TASK_BEGIN";
export const DELETE_SCHEDULED_TASK_SUCCESS = "DELETE_SCHEDULED_TASK_SUCCESS";
export const DELETE_SCHEDULED_TASK_ERROR = "DELETE_SCHEDULED_TASK_ERROR";
export const ARCHIVE_SCHEDULED_TASK_BEGIN = "ARCHIVE_SCHEDULED_TASK_BEGIN";
export const ARCHIVE_SCHEDULED_TASK_SUCCESS = "ARCHIVE_SCHEDULED_TASK_SUCCESS";
export const ARCHIVE_SCHEDULED_TASK_ERROR = "ARCHIVE_SCHEDULED_TASK_ERROR";
export const ARCHIVE_RETRY_TASK_BEGIN = "ARCHIVE_RETRY_TASK_BEGIN";
export const ARCHIVE_RETRY_TASK_SUCCESS = "ARCHIVE_RETRY_TASK_SUCCESS";
export const ARCHIVE_RETRY_TASK_ERROR = "ARCHIVE_RETRY_TASK_ERROR";
export const BATCH_RUN_SCHEDULED_TASKS_BEGIN =
  "BATCH_RUN_SCHEDULED_TASKS_BEGIN";
export const BATCH_RUN_SCHEDULED_TASKS_SUCCESS =
  "BATCH_RUN_SCHEDULED_TASKS_SUCCESS";
export const BATCH_RUN_SCHEDULED_TASKS_ERROR =
  "BATCH_RUN_SCHEDULED_TASKS_ERROR";
export const BATCH_ARCHIVE_SCHEDULED_TASKS_BEGIN =
  "BATCH_ARCHIVE_SCHEDULED_TASKS_BEGIN";
export const BATCH_ARCHIVE_SCHEDULED_TASKS_SUCCESS =
  "BATCH_ARCHIVE_SCHEDULED_TASKS_SUCCESS";
export const BATCH_ARCHIVE_SCHEDULED_TASKS_ERROR =
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
export const ARCHIVE_ALL_SCHEDULED_TASKS_BEGIN =
  "ARCHIVE_ALL_SCHEDULED_TASKS_BEGIN";
export const ARCHIVE_ALL_SCHEDULED_TASKS_SUCCESS =
  "ARCHIVE_ALL_SCHEDULED_TASKS_SUCCESS";
export const ARCHIVE_ALL_SCHEDULED_TASKS_ERROR =
  "ARCHIVE_ALL_SCHEDULED_TASKS_ERROR";
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
export const BATCH_ARCHIVE_RETRY_TASKS_BEGIN =
  "BATCH_ARCHIVE_RETRY_TASKS_BEGIN";
export const BATCH_ARCHIVE_RETRY_TASKS_SUCCESS =
  "BATCH_ARCHIVE_RETRY_TASKS_SUCCESS";
export const BATCH_ARCHIVE_RETRY_TASKS_ERROR =
  "BATCH_ARCHIVE_RETRY_TASKS_ERROR";
export const BATCH_DELETE_RETRY_TASKS_BEGIN = "BATCH_DELETE_RETRY_TASKS_BEGIN";
export const BATCH_DELETE_RETRY_TASKS_SUCCESS =
  "BATCH_DELETE_RETRY_TASKS_SUCCESS";
export const BATCH_DELETE_RETRY_TASKS_ERROR = "BATCH_DELETE_RETRY_TASKS_ERROR";
export const RUN_ALL_RETRY_TASKS_BEGIN = "RUN_ALL_RETRY_TASKS_BEGIN";
export const RUN_ALL_RETRY_TASKS_SUCCESS = "RUN_ALL_RETRY_TASKS_SUCCESS";
export const RUN_ALL_RETRY_TASKS_ERROR = "RUN_ALL_RETRY_TASKS_ERROR";
export const ARCHIVE_ALL_RETRY_TASKS_BEGIN = "ARCHIVE_ALL_RETRY_TASKS_BEGIN";
export const ARCHIVE_ALL_RETRY_TASKS_SUCCESS =
  "ARCHIVE_ALL_RETRY_TASKS_SUCCESS";
export const ARCHIVE_ALL_RETRY_TASKS_ERROR = "ARCHIVE_ALL_RETRY_TASKS_ERROR";
export const DELETE_ALL_RETRY_TASKS_BEGIN = "DELETE_ALL_RETRY_TASKS_BEGIN";
export const DELETE_ALL_RETRY_TASKS_SUCCESS = "DELETE_ALL_RETRY_TASKS_SUCCESS";
export const DELETE_ALL_RETRY_TASKS_ERROR = "DELETE_ALL_RETRY_TASKS_ERROR";
export const DELETE_ARCHIVED_TASK_BEGIN = "DELETE_ARCHIVED_TASK_BEGIN";
export const DELETE_ARCHIVED_TASK_SUCCESS = "DELETE_ARCHIVED_TASK_SUCCESS";
export const DELETE_ARCHIVED_TASK_ERROR = "DELETE_ARCHIVED_TASK_ERROR";
export const BATCH_RUN_ARCHIVED_TASKS_BEGIN = "BATCH_RUN_ARCHIVED_TASKS_BEGIN";
export const BATCH_RUN_ARCHIVED_TASKS_SUCCESS =
  "BATCH_RUN_ARCHIVED_TASKS_SUCCESS";
export const BATCH_RUN_ARCHIVED_TASKS_ERROR = "BATCH_RUN_ARCHIVED_TASKS_ERROR";
export const BATCH_DELETE_ARCHIVED_TASKS_BEGIN =
  "BATCH_DELETE_ARCHIVED_TASKS_BEGIN";
export const BATCH_DELETE_ARCHIVED_TASKS_SUCCESS =
  "BATCH_DELETE_ARCHIVED_TASKS_SUCCESS";
export const BATCH_DELETE_ARCHIVED_TASKS_ERROR =
  "BATCH_DELETE_ARCHIVED_TASKS_ERROR";
export const RUN_ALL_ARCHIVED_TASKS_BEGIN = "RUN_ALL_ARCHIVED_TASKS_BEGIN";
export const RUN_ALL_ARCHIVED_TASKS_SUCCESS = "RUN_ALL_ARCHIVED_TASKS_SUCCESS";
export const RUN_ALL_ARCHIVED_TASKS_ERROR = "RUN_ALL_ARCHIVED_TASKS_ERROR";
export const DELETE_ALL_ARCHIVED_TASKS_BEGIN =
  "DELETE_ALL_ARCHIVED_TASKS_BEGIN";
export const DELETE_ALL_ARCHIVED_TASKS_SUCCESS =
  "DELETE_ALL_ARCHIVED_TASKS_SUCCESS";
export const DELETE_ALL_ARCHIVED_TASKS_ERROR =
  "DELETE_ALL_ARCHIVED_TASKS_ERROR";

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

interface ListArchivedTasksBeginAction {
  type: typeof LIST_ARCHIVED_TASKS_BEGIN;
  queue: string;
}

interface ListArchivedTasksSuccessAction {
  type: typeof LIST_ARCHIVED_TASKS_SUCCESS;
  queue: string;
  payload: ListArchivedTasksResponse;
}

interface ListArchivedTasksErrorAction {
  type: typeof LIST_ARCHIVED_TASKS_ERROR;
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

interface CancelAllActiveTasksBeginAction {
  type: typeof CANCEL_ALL_ACTIVE_TASKS_BEGIN;
  queue: string;
}

interface CancelAllActiveTasksSuccessAction {
  type: typeof CANCEL_ALL_ACTIVE_TASKS_SUCCESS;
  queue: string;
}

interface CancelAllActiveTasksErrorAction {
  type: typeof CANCEL_ALL_ACTIVE_TASKS_ERROR;
  queue: string;
  error: string;
}

interface BatchCancelActiveTasksBeginAction {
  type: typeof BATCH_CANCEL_ACTIVE_TASKS_BEGIN;
  queue: string;
  taskIds: string[];
}

interface BatchCancelActiveTasksSuccessAction {
  type: typeof BATCH_CANCEL_ACTIVE_TASKS_SUCCESS;
  queue: string;
  payload: BatchCancelTasksResponse;
}

interface BatchCancelActiveTasksErrorAction {
  type: typeof BATCH_CANCEL_ACTIVE_TASKS_ERROR;
  queue: string;
  taskIds: string[];
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

interface ArchiveScheduledTaskBeginAction {
  type: typeof ARCHIVE_SCHEDULED_TASK_BEGIN;
  queue: string;
  taskKey: string;
}

interface ArchiveScheduledTaskSuccessAction {
  type: typeof ARCHIVE_SCHEDULED_TASK_SUCCESS;
  queue: string;
  taskKey: string;
}

interface ArchiveScheduledTaskErrorAction {
  type: typeof ARCHIVE_SCHEDULED_TASK_ERROR;
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

interface ArchiveRetryTaskBeginAction {
  type: typeof ARCHIVE_RETRY_TASK_BEGIN;
  queue: string;
  taskKey: string;
}

interface ArchiveRetryTaskSuccessAction {
  type: typeof ARCHIVE_RETRY_TASK_SUCCESS;
  queue: string;
  taskKey: string;
}

interface ArchiveRetryTaskErrorAction {
  type: typeof ARCHIVE_RETRY_TASK_ERROR;
  queue: string;
  taskKey: string;
  error: string;
}

interface RunArchivedTaskBeginAction {
  type: typeof RUN_ARCHIVED_TASK_BEGIN;
  queue: string;
  taskKey: string;
}

interface RunArchivedTaskSuccessAction {
  type: typeof RUN_ARCHIVED_TASK_SUCCESS;
  queue: string;
  taskKey: string;
}

interface RunArchivedTaskErrorAction {
  type: typeof RUN_ARCHIVED_TASK_ERROR;
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

interface BatchArchiveScheduledTasksBeginAction {
  type: typeof BATCH_ARCHIVE_SCHEDULED_TASKS_BEGIN;
  queue: string;
  taskKeys: string[];
}

interface BatchArchiveScheduledTasksSuccessAction {
  type: typeof BATCH_ARCHIVE_SCHEDULED_TASKS_SUCCESS;
  queue: string;
  payload: BatchArchiveTasksResponse;
}

interface BatchArchiveScheduledTasksErrorAction {
  type: typeof BATCH_ARCHIVE_SCHEDULED_TASKS_ERROR;
  queue: string;
  taskKeys: string[];
  error: string;
}

interface ArchiveAllScheduledTasksBeginAction {
  type: typeof ARCHIVE_ALL_SCHEDULED_TASKS_BEGIN;
  queue: string;
}

interface ArchiveAllScheduledTasksSuccessAction {
  type: typeof ARCHIVE_ALL_SCHEDULED_TASKS_SUCCESS;
  queue: string;
}

interface ArchiveAllScheduledTasksErrorAction {
  type: typeof ARCHIVE_ALL_SCHEDULED_TASKS_ERROR;
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

interface BatchArchiveRetryTasksBeginAction {
  type: typeof BATCH_ARCHIVE_RETRY_TASKS_BEGIN;
  queue: string;
  taskKeys: string[];
}

interface BatchArchiveRetryTasksSuccessAction {
  type: typeof BATCH_ARCHIVE_RETRY_TASKS_SUCCESS;
  queue: string;
  payload: BatchArchiveTasksResponse;
}

interface BatchArchiveRetryTasksErrorAction {
  type: typeof BATCH_ARCHIVE_RETRY_TASKS_ERROR;
  queue: string;
  taskKeys: string[];
  error: string;
}

interface ArchiveAllRetryTasksBeginAction {
  type: typeof ARCHIVE_ALL_RETRY_TASKS_BEGIN;
  queue: string;
}

interface ArchiveAllRetryTasksSuccessAction {
  type: typeof ARCHIVE_ALL_RETRY_TASKS_SUCCESS;
  queue: string;
}

interface ArchiveAllRetryTasksErrorAction {
  type: typeof ARCHIVE_ALL_RETRY_TASKS_ERROR;
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

interface DeleteArchivedTaskBeginAction {
  type: typeof DELETE_ARCHIVED_TASK_BEGIN;
  queue: string;
  taskKey: string;
}

interface DeleteArchivedTaskSuccessAction {
  type: typeof DELETE_ARCHIVED_TASK_SUCCESS;
  queue: string;
  taskKey: string;
}

interface DeleteArchivedTaskErrorAction {
  type: typeof DELETE_ARCHIVED_TASK_ERROR;
  queue: string;
  taskKey: string;
  error: string;
}

interface BatchDeleteArchivedTasksBeginAction {
  type: typeof BATCH_DELETE_ARCHIVED_TASKS_BEGIN;
  queue: string;
  taskKeys: string[];
}

interface BatchDeleteArchivedTasksSuccessAction {
  type: typeof BATCH_DELETE_ARCHIVED_TASKS_SUCCESS;
  queue: string;
  payload: BatchDeleteTasksResponse;
}

interface BatchDeleteArchivedTasksErrorAction {
  type: typeof BATCH_DELETE_ARCHIVED_TASKS_ERROR;
  queue: string;
  taskKeys: string[];
  error: string;
}

interface BatchRunArchivedTasksBeginAction {
  type: typeof BATCH_RUN_ARCHIVED_TASKS_BEGIN;
  queue: string;
  taskKeys: string[];
}

interface BatchRunArchivedTasksSuccessAction {
  type: typeof BATCH_RUN_ARCHIVED_TASKS_SUCCESS;
  queue: string;
  payload: BatchRunTasksResponse;
}

interface BatchRunArchivedTasksErrorAction {
  type: typeof BATCH_RUN_ARCHIVED_TASKS_ERROR;
  queue: string;
  taskKeys: string[];
  error: string;
}

interface RunAllArchivedTasksBeginAction {
  type: typeof RUN_ALL_ARCHIVED_TASKS_BEGIN;
  queue: string;
}

interface RunAllArchivedTasksSuccessAction {
  type: typeof RUN_ALL_ARCHIVED_TASKS_SUCCESS;
  queue: string;
}

interface RunAllArchivedTasksErrorAction {
  type: typeof RUN_ALL_ARCHIVED_TASKS_ERROR;
  queue: string;
  error: string;
}

interface DeleteAllArchivedTasksBeginAction {
  type: typeof DELETE_ALL_ARCHIVED_TASKS_BEGIN;
  queue: string;
}

interface DeleteAllArchivedTasksSuccessAction {
  type: typeof DELETE_ALL_ARCHIVED_TASKS_SUCCESS;
  queue: string;
}

interface DeleteAllArchivedTasksErrorAction {
  type: typeof DELETE_ALL_ARCHIVED_TASKS_ERROR;
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
  | ListArchivedTasksBeginAction
  | ListArchivedTasksSuccessAction
  | ListArchivedTasksErrorAction
  | CancelActiveTaskBeginAction
  | CancelActiveTaskSuccessAction
  | CancelActiveTaskErrorAction
  | CancelAllActiveTasksBeginAction
  | CancelAllActiveTasksSuccessAction
  | CancelAllActiveTasksErrorAction
  | BatchCancelActiveTasksBeginAction
  | BatchCancelActiveTasksSuccessAction
  | BatchCancelActiveTasksErrorAction
  | RunScheduledTaskBeginAction
  | RunScheduledTaskSuccessAction
  | RunScheduledTaskErrorAction
  | RunRetryTaskBeginAction
  | RunRetryTaskSuccessAction
  | RunRetryTaskErrorAction
  | RunArchivedTaskBeginAction
  | RunArchivedTaskSuccessAction
  | RunArchivedTaskErrorAction
  | ArchiveScheduledTaskBeginAction
  | ArchiveScheduledTaskSuccessAction
  | ArchiveScheduledTaskErrorAction
  | ArchiveRetryTaskBeginAction
  | ArchiveRetryTaskSuccessAction
  | ArchiveRetryTaskErrorAction
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
  | BatchArchiveScheduledTasksBeginAction
  | BatchArchiveScheduledTasksSuccessAction
  | BatchArchiveScheduledTasksErrorAction
  | ArchiveAllScheduledTasksBeginAction
  | ArchiveAllScheduledTasksSuccessAction
  | ArchiveAllScheduledTasksErrorAction
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
  | BatchArchiveRetryTasksBeginAction
  | BatchArchiveRetryTasksSuccessAction
  | BatchArchiveRetryTasksErrorAction
  | ArchiveAllRetryTasksBeginAction
  | ArchiveAllRetryTasksSuccessAction
  | ArchiveAllRetryTasksErrorAction
  | DeleteAllRetryTasksBeginAction
  | DeleteAllRetryTasksSuccessAction
  | DeleteAllRetryTasksErrorAction
  | DeleteArchivedTaskBeginAction
  | DeleteArchivedTaskSuccessAction
  | DeleteArchivedTaskErrorAction
  | BatchDeleteArchivedTasksBeginAction
  | BatchDeleteArchivedTasksSuccessAction
  | BatchDeleteArchivedTasksErrorAction
  | BatchRunArchivedTasksBeginAction
  | BatchRunArchivedTasksSuccessAction
  | BatchRunArchivedTasksErrorAction
  | RunAllArchivedTasksBeginAction
  | RunAllArchivedTasksSuccessAction
  | RunAllArchivedTasksErrorAction
  | DeleteAllArchivedTasksBeginAction
  | DeleteAllArchivedTasksSuccessAction
  | DeleteAllArchivedTasksErrorAction;

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

export function listArchivedTasksAsync(
  qname: string,
  pageOpts?: PaginationOptions
) {
  return async (dispatch: Dispatch<TasksActionTypes>) => {
    dispatch({ type: LIST_ARCHIVED_TASKS_BEGIN, queue: qname });
    try {
      const response = await listArchivedTasks(qname, pageOpts);
      dispatch({
        type: LIST_ARCHIVED_TASKS_SUCCESS,
        queue: qname,
        payload: response,
      });
    } catch {
      dispatch({
        type: LIST_ARCHIVED_TASKS_ERROR,
        queue: qname,
        error: `Could not retreive archived tasks data for queue: ${qname}`,
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

export function cancelAllActiveTasksAsync(queue: string) {
  return async (dispatch: Dispatch<TasksActionTypes>) => {
    dispatch({ type: CANCEL_ALL_ACTIVE_TASKS_BEGIN, queue });
    try {
      await cancelAllActiveTasks(queue);
      dispatch({ type: CANCEL_ALL_ACTIVE_TASKS_SUCCESS, queue });
    } catch (error) {
      console.error("cancelAllActiveTasksAsync: ", error);
      dispatch({
        type: CANCEL_ALL_ACTIVE_TASKS_ERROR,
        error: "Could not cancel all tasks",
        queue,
      });
    }
  };
}

export function batchCancelActiveTasksAsync(queue: string, taskIds: string[]) {
  return async (dispatch: Dispatch<TasksActionTypes>) => {
    dispatch({ type: BATCH_CANCEL_ACTIVE_TASKS_BEGIN, queue, taskIds });
    try {
      const response = await batchCancelActiveTasks(queue, taskIds);
      dispatch({
        type: BATCH_CANCEL_ACTIVE_TASKS_SUCCESS,
        queue: queue,
        payload: response,
      });
    } catch (error) {
      console.error("batchCancelActiveTasksAsync: ", error);
      dispatch({
        type: BATCH_CANCEL_ACTIVE_TASKS_ERROR,
        error: `Could not batch cancel tasks: ${taskIds}`,
        queue,
        taskIds,
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

export function archiveScheduledTaskAsync(queue: string, taskKey: string) {
  return async (dispatch: Dispatch<TasksActionTypes>) => {
    dispatch({ type: ARCHIVE_SCHEDULED_TASK_BEGIN, queue, taskKey });
    try {
      await archiveScheduledTask(queue, taskKey);
      dispatch({ type: ARCHIVE_SCHEDULED_TASK_SUCCESS, queue, taskKey });
    } catch (error) {
      console.error("archiveScheduledTaskAsync: ", error);
      dispatch({
        type: ARCHIVE_SCHEDULED_TASK_ERROR,
        error: `Could not archive task: ${taskKey}`,
        queue,
        taskKey,
      });
    }
  };
}

export function archiveRetryTaskAsync(queue: string, taskKey: string) {
  return async (dispatch: Dispatch<TasksActionTypes>) => {
    dispatch({ type: ARCHIVE_RETRY_TASK_BEGIN, queue, taskKey });
    try {
      await archiveRetryTask(queue, taskKey);
      dispatch({ type: ARCHIVE_RETRY_TASK_SUCCESS, queue, taskKey });
    } catch (error) {
      console.error("archiveRetryTaskAsync: ", error);
      dispatch({
        type: ARCHIVE_RETRY_TASK_ERROR,
        error: `Could not archive task: ${taskKey}`,
        queue,
        taskKey,
      });
    }
  };
}

export function runArchivedTaskAsync(queue: string, taskKey: string) {
  return async (dispatch: Dispatch<TasksActionTypes>) => {
    dispatch({ type: RUN_ARCHIVED_TASK_BEGIN, queue, taskKey });
    try {
      await runArchivedTask(queue, taskKey);
      dispatch({ type: RUN_ARCHIVED_TASK_SUCCESS, queue, taskKey });
    } catch (error) {
      console.error("runArchivedTaskAsync: ", error);
      dispatch({
        type: RUN_ARCHIVED_TASK_ERROR,
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

export function batchArchiveScheduledTasksAsync(
  queue: string,
  taskKeys: string[]
) {
  return async (dispatch: Dispatch<TasksActionTypes>) => {
    dispatch({ type: BATCH_ARCHIVE_SCHEDULED_TASKS_BEGIN, queue, taskKeys });
    try {
      const response = await batchArchiveScheduledTasks(queue, taskKeys);
      dispatch({
        type: BATCH_ARCHIVE_SCHEDULED_TASKS_SUCCESS,
        queue: queue,
        payload: response,
      });
    } catch (error) {
      console.error("batchArchiveScheduledTasksAsync: ", error);
      dispatch({
        type: BATCH_ARCHIVE_SCHEDULED_TASKS_ERROR,
        error: `Could not batch archive tasks: ${taskKeys}`,
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

export function archiveAllScheduledTasksAsync(queue: string) {
  return async (dispatch: Dispatch<TasksActionTypes>) => {
    dispatch({ type: RUN_ALL_SCHEDULED_TASKS_BEGIN, queue });
    try {
      await archiveAllScheduledTasks(queue);
      dispatch({ type: RUN_ALL_SCHEDULED_TASKS_SUCCESS, queue });
    } catch (error) {
      console.error("archiveAllScheduledTasksAsync: ", error);
      dispatch({
        type: RUN_ALL_SCHEDULED_TASKS_ERROR,
        error: `Could not archive all scheduled tasks`,
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

export function batchArchiveRetryTasksAsync(queue: string, taskKeys: string[]) {
  return async (dispatch: Dispatch<TasksActionTypes>) => {
    dispatch({ type: BATCH_ARCHIVE_RETRY_TASKS_BEGIN, queue, taskKeys });
    try {
      const response = await batchArchiveRetryTasks(queue, taskKeys);
      dispatch({
        type: BATCH_ARCHIVE_RETRY_TASKS_SUCCESS,
        queue: queue,
        payload: response,
      });
    } catch (error) {
      console.error("batchArchiveRetryTasksAsync: ", error);
      dispatch({
        type: BATCH_ARCHIVE_RETRY_TASKS_ERROR,
        error: `Could not batch archive tasks: ${taskKeys}`,
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

export function archiveAllRetryTasksAsync(queue: string) {
  return async (dispatch: Dispatch<TasksActionTypes>) => {
    dispatch({ type: ARCHIVE_ALL_RETRY_TASKS_BEGIN, queue });
    try {
      await archiveAllRetryTasks(queue);
      dispatch({ type: ARCHIVE_ALL_RETRY_TASKS_SUCCESS, queue });
    } catch (error) {
      console.error("archiveAllRetryTasksAsync: ", error);
      dispatch({
        type: ARCHIVE_ALL_RETRY_TASKS_ERROR,
        error: `Could not archive all retry tasks`,
        queue,
      });
    }
  };
}

export function deleteArchivedTaskAsync(queue: string, taskKey: string) {
  return async (dispatch: Dispatch<TasksActionTypes>) => {
    dispatch({ type: DELETE_ARCHIVED_TASK_BEGIN, queue, taskKey });
    try {
      await deleteArchivedTask(queue, taskKey);
      dispatch({ type: DELETE_ARCHIVED_TASK_SUCCESS, queue, taskKey });
    } catch (error) {
      console.error("deleteArchivedTaskAsync: ", error);
      dispatch({
        type: DELETE_ARCHIVED_TASK_ERROR,
        error: `Could not delete task: ${taskKey}`,
        queue,
        taskKey,
      });
    }
  };
}

export function batchDeleteArchivedTasksAsync(
  queue: string,
  taskKeys: string[]
) {
  return async (dispatch: Dispatch<TasksActionTypes>) => {
    dispatch({ type: BATCH_DELETE_ARCHIVED_TASKS_BEGIN, queue, taskKeys });
    try {
      const response = await batchDeleteArchivedTasks(queue, taskKeys);
      dispatch({
        type: BATCH_DELETE_ARCHIVED_TASKS_SUCCESS,
        queue: queue,
        payload: response,
      });
    } catch (error) {
      console.error("batchDeleteArchivedTasksAsync: ", error);
      dispatch({
        type: BATCH_DELETE_ARCHIVED_TASKS_ERROR,
        error: `Could not batch delete tasks: ${taskKeys}`,
        queue,
        taskKeys,
      });
    }
  };
}

export function batchRunArchivedTasksAsync(queue: string, taskKeys: string[]) {
  return async (dispatch: Dispatch<TasksActionTypes>) => {
    dispatch({ type: BATCH_RUN_ARCHIVED_TASKS_BEGIN, queue, taskKeys });
    try {
      const response = await batchRunArchivedTasks(queue, taskKeys);
      dispatch({
        type: BATCH_RUN_ARCHIVED_TASKS_SUCCESS,
        queue: queue,
        payload: response,
      });
    } catch (error) {
      console.error("batchRunArchivedTasksAsync: ", error);
      dispatch({
        type: BATCH_RUN_ARCHIVED_TASKS_ERROR,
        error: `Could not batch run tasks: ${taskKeys}`,
        queue,
        taskKeys,
      });
    }
  };
}

export function deleteAllArchivedTasksAsync(queue: string) {
  return async (dispatch: Dispatch<TasksActionTypes>) => {
    dispatch({ type: DELETE_ALL_ARCHIVED_TASKS_BEGIN, queue });
    try {
      await deleteAllArchivedTasks(queue);
      dispatch({ type: DELETE_ALL_ARCHIVED_TASKS_SUCCESS, queue });
    } catch (error) {
      console.error("deleteAllArchivedTasksAsync: ", error);
      dispatch({
        type: DELETE_ALL_ARCHIVED_TASKS_ERROR,
        error: `Could not delete all archived tasks`,
        queue,
      });
    }
  };
}

export function runAllArchivedTasksAsync(queue: string) {
  return async (dispatch: Dispatch<TasksActionTypes>) => {
    dispatch({ type: RUN_ALL_ARCHIVED_TASKS_BEGIN, queue });
    try {
      await runAllArchivedTasks(queue);
      dispatch({ type: RUN_ALL_ARCHIVED_TASKS_SUCCESS, queue });
    } catch (error) {
      console.error("runAllArchivedTasksAsync: ", error);
      dispatch({
        type: RUN_ALL_ARCHIVED_TASKS_ERROR,
        error: `Could not run all archived tasks`,
        queue,
      });
    }
  };
}
