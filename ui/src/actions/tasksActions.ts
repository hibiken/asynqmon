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
  deletePendingTask,
  batchDeletePendingTasks,
  deleteAllPendingTasks,
  archivePendingTask,
  batchArchivePendingTasks,
  archiveAllPendingTasks,
} from "../api";
import { Dispatch } from "redux";
import { toErrorString, toErrorStringWithHttpStatus } from "../utils";

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
export const DELETE_PENDING_TASK_BEGIN = "DELETE_PENDING_TASK_BEGIN";
export const DELETE_PENDING_TASK_SUCCESS = "DELETE_PENDING_TASK_SUCCESS";
export const DELETE_PENDING_TASK_ERROR = "DELETE_PENDING_TASK_ERROR";
export const ARCHIVE_PENDING_TASK_BEGIN = "ARCHIVE_PENDING_TASK_BEGIN";
export const ARCHIVE_PENDING_TASK_SUCCESS = "ARCHIVE_PENDING_TASK_SUCCESS";
export const ARCHIVE_PENDING_TASK_ERROR = "ARCHIVE_PENDING_TASK_ERROR";
export const DELETE_SCHEDULED_TASK_BEGIN = "DELETE_SCHEDULED_TASK_BEGIN";
export const DELETE_SCHEDULED_TASK_SUCCESS = "DELETE_SCHEDULED_TASK_SUCCESS";
export const DELETE_SCHEDULED_TASK_ERROR = "DELETE_SCHEDULED_TASK_ERROR";
export const ARCHIVE_SCHEDULED_TASK_BEGIN = "ARCHIVE_SCHEDULED_TASK_BEGIN";
export const ARCHIVE_SCHEDULED_TASK_SUCCESS = "ARCHIVE_SCHEDULED_TASK_SUCCESS";
export const ARCHIVE_SCHEDULED_TASK_ERROR = "ARCHIVE_SCHEDULED_TASK_ERROR";
export const ARCHIVE_RETRY_TASK_BEGIN = "ARCHIVE_RETRY_TASK_BEGIN";
export const ARCHIVE_RETRY_TASK_SUCCESS = "ARCHIVE_RETRY_TASK_SUCCESS";
export const ARCHIVE_RETRY_TASK_ERROR = "ARCHIVE_RETRY_TASK_ERROR";
export const BATCH_ARCHIVE_PENDING_TASKS_BEGIN =
  "BATCH_ARCHIVE_PENDING_TASKS_BEGIN";
export const BATCH_ARCHIVE_PENDING_TASKS_SUCCESS =
  "BATCH_ARCHIVE_PENDING_TASKS_SUCCESS";
export const BATCH_ARCHIVE_PENDING_TASKS_ERROR =
  "BATCH_RUN_PENDING_TASKS_ERROR";
export const BATCH_DELETE_PENDING_TASKS_BEGIN =
  "BATCH_DELETE_PENDING_TASKS_BEGIN";
export const BATCH_DELETE_PENDING_TASKS_SUCCESS =
  "BATCH_DELETE_PENDING_TASKS_SUCCESS";
export const BATCH_DELETE_PENDING_TASKS_ERROR =
  "BATCH_DELETE_PENDING_TASKS_ERROR";
export const DELETE_ALL_PENDING_TASKS_BEGIN = "DELETE_ALL_PENDING_TASKS_BEGIN";
export const DELETE_ALL_PENDING_TASKS_SUCCESS =
  "DELETE_ALL_PENDING_TASKS_SUCCESS";
export const DELETE_ALL_PENDING_TASKS_ERROR = "DELETE_ALL_PENDING_TASKS_ERROR";
export const ARCHIVE_ALL_PENDING_TASKS_BEGIN =
  "ARCHIVE_ALL_PENDING_TASKS_BEGIN";
export const ARCHIVE_ALL_PENDING_TASKS_SUCCESS =
  "ARCHIVE_ALL_PENDING_TASKS_SUCCESS";
export const ARCHIVE_ALL_PENDING_TASKS_ERROR =
  "ARCHIVE_ALL_PENDING_TASKS_ERROR";
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

interface DeletePendingTaskBeginAction {
  type: typeof DELETE_PENDING_TASK_BEGIN;
  queue: string;
  taskKey: string;
}

interface DeletePendingTaskSuccessAction {
  type: typeof DELETE_PENDING_TASK_SUCCESS;
  queue: string;
  taskKey: string;
}

interface DeletePendingTaskErrorAction {
  type: typeof DELETE_PENDING_TASK_ERROR;
  queue: string;
  taskKey: string;
  error: string;
}

interface BatchDeletePendingTasksBeginAction {
  type: typeof BATCH_DELETE_PENDING_TASKS_BEGIN;
  queue: string;
  taskKeys: string[];
}

interface BatchDeletePendingTasksSuccessAction {
  type: typeof BATCH_DELETE_PENDING_TASKS_SUCCESS;
  queue: string;
  payload: BatchDeleteTasksResponse;
}

interface BatchDeletePendingTasksErrorAction {
  type: typeof BATCH_DELETE_PENDING_TASKS_ERROR;
  queue: string;
  taskKeys: string[];
  error: string;
}

interface DeleteAllPendingTasksBeginAction {
  type: typeof DELETE_ALL_PENDING_TASKS_BEGIN;
  queue: string;
}

interface DeleteAllPendingTasksSuccessAction {
  type: typeof DELETE_ALL_PENDING_TASKS_SUCCESS;
  queue: string;
}

interface DeleteAllPendingTasksErrorAction {
  type: typeof DELETE_ALL_PENDING_TASKS_ERROR;
  queue: string;
  error: string;
}

interface ArchivePendingTaskBeginAction {
  type: typeof ARCHIVE_PENDING_TASK_BEGIN;
  queue: string;
  taskKey: string;
}

interface ArchivePendingTaskSuccessAction {
  type: typeof ARCHIVE_PENDING_TASK_SUCCESS;
  queue: string;
  taskKey: string;
}

interface ArchivePendingTaskErrorAction {
  type: typeof ARCHIVE_PENDING_TASK_ERROR;
  queue: string;
  taskKey: string;
  error: string;
}

interface BatchArchivePendingTasksBeginAction {
  type: typeof BATCH_ARCHIVE_PENDING_TASKS_BEGIN;
  queue: string;
  taskKeys: string[];
}

interface BatchArchivePendingTasksSuccessAction {
  type: typeof BATCH_ARCHIVE_PENDING_TASKS_SUCCESS;
  queue: string;
  payload: BatchArchiveTasksResponse;
}

interface BatchArchivePendingTasksErrorAction {
  type: typeof BATCH_ARCHIVE_PENDING_TASKS_ERROR;
  queue: string;
  taskKeys: string[];
  error: string;
}

interface ArchiveAllPendingTasksBeginAction {
  type: typeof ARCHIVE_ALL_PENDING_TASKS_BEGIN;
  queue: string;
}

interface ArchiveAllPendingTasksSuccessAction {
  type: typeof ARCHIVE_ALL_PENDING_TASKS_SUCCESS;
  queue: string;
}

interface ArchiveAllPendingTasksErrorAction {
  type: typeof ARCHIVE_ALL_PENDING_TASKS_ERROR;
  queue: string;
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
  | DeletePendingTaskBeginAction
  | DeletePendingTaskSuccessAction
  | DeletePendingTaskErrorAction
  | BatchDeletePendingTasksBeginAction
  | BatchDeletePendingTasksSuccessAction
  | BatchDeletePendingTasksErrorAction
  | DeleteAllPendingTasksBeginAction
  | DeleteAllPendingTasksSuccessAction
  | DeleteAllPendingTasksErrorAction
  | ArchivePendingTaskBeginAction
  | ArchivePendingTaskSuccessAction
  | ArchivePendingTaskErrorAction
  | BatchArchivePendingTasksBeginAction
  | BatchArchivePendingTasksSuccessAction
  | BatchArchivePendingTasksErrorAction
  | ArchiveAllPendingTasksBeginAction
  | ArchiveAllPendingTasksSuccessAction
  | ArchiveAllPendingTasksErrorAction
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
    } catch (error) {
      console.error(
        "listActiveTasksAsync: ",
        toErrorStringWithHttpStatus(error)
      );
      dispatch({
        type: LIST_ACTIVE_TASKS_ERROR,
        queue: qname,
        error: toErrorString(error),
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
    } catch (error) {
      console.error(
        "listPendingTasksAsync: ",
        toErrorStringWithHttpStatus(error)
      );
      dispatch({
        type: LIST_PENDING_TASKS_ERROR,
        queue: qname,
        error: toErrorString(error),
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
    } catch (error) {
      console.error(
        "listScheduledTasksAsync: ",
        toErrorStringWithHttpStatus(error)
      );
      dispatch({
        type: LIST_SCHEDULED_TASKS_ERROR,
        queue: qname,
        error: toErrorString(error),
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
    } catch (error) {
      console.error(
        "listRetryTasksAsync: ",
        toErrorStringWithHttpStatus(error)
      );
      dispatch({
        type: LIST_RETRY_TASKS_ERROR,
        queue: qname,
        error: toErrorString(error),
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
    } catch (error) {
      console.error(
        "listArchivedTasksAsync: ",
        toErrorStringWithHttpStatus(error)
      );
      dispatch({
        type: LIST_ARCHIVED_TASKS_ERROR,
        queue: qname,
        error: toErrorString(error),
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
    } catch (error) {
      console.error(
        "cancelActiveTaskAsync: ",
        toErrorStringWithHttpStatus(error)
      );
      dispatch({
        type: CANCEL_ACTIVE_TASK_ERROR,
        error: toErrorString(error),
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
      console.error(
        "cancelAllActiveTasksAsync: ",
        toErrorStringWithHttpStatus(error)
      );
      dispatch({
        type: CANCEL_ALL_ACTIVE_TASKS_ERROR,
        error: toErrorString(error),
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
      console.error(
        "batchCancelActiveTasksAsync: ",
        toErrorStringWithHttpStatus(error)
      );
      dispatch({
        type: BATCH_CANCEL_ACTIVE_TASKS_ERROR,
        error: toErrorString(error),
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
      console.error(
        "runScheduledTaskAsync: ",
        toErrorStringWithHttpStatus(error)
      );
      dispatch({
        type: RUN_SCHEDULED_TASK_ERROR,
        error: toErrorString(error),
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
      console.error("runRetryTaskAsync: ", toErrorStringWithHttpStatus(error));
      dispatch({
        type: RUN_RETRY_TASK_ERROR,
        error: toErrorString(error),
        queue,
        taskKey,
      });
    }
  };
}

export function archivePendingTaskAsync(queue: string, taskKey: string) {
  return async (dispatch: Dispatch<TasksActionTypes>) => {
    dispatch({ type: ARCHIVE_PENDING_TASK_BEGIN, queue, taskKey });
    try {
      await archivePendingTask(queue, taskKey);
      dispatch({ type: ARCHIVE_PENDING_TASK_SUCCESS, queue, taskKey });
    } catch (error) {
      console.error(
        "archivePendingTaskAsync: ",
        toErrorStringWithHttpStatus(error)
      );
      dispatch({
        type: ARCHIVE_PENDING_TASK_ERROR,
        error: toErrorString(error),
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
      console.error(
        "archiveScheduledTaskAsync: ",
        toErrorStringWithHttpStatus(error)
      );
      dispatch({
        type: ARCHIVE_SCHEDULED_TASK_ERROR,
        error: toErrorString(error),
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
      console.error(
        "archiveRetryTaskAsync: ",
        toErrorStringWithHttpStatus(error)
      );
      dispatch({
        type: ARCHIVE_RETRY_TASK_ERROR,
        error: toErrorString(error),
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
      console.error(
        "runArchivedTaskAsync: ",
        toErrorStringWithHttpStatus(error)
      );
      dispatch({
        type: RUN_ARCHIVED_TASK_ERROR,
        error: toErrorString(error),
        queue,
        taskKey,
      });
    }
  };
}

export function deletePendingTaskAsync(queue: string, taskKey: string) {
  return async (dispatch: Dispatch<TasksActionTypes>) => {
    dispatch({ type: DELETE_PENDING_TASK_BEGIN, queue, taskKey });
    try {
      await deletePendingTask(queue, taskKey);
      dispatch({ type: DELETE_PENDING_TASK_SUCCESS, queue, taskKey });
    } catch (error) {
      console.error(
        "deletePendingTaskAsync: ",
        toErrorStringWithHttpStatus(error)
      );
      dispatch({
        type: DELETE_PENDING_TASK_ERROR,
        error: toErrorString(error),
        queue,
        taskKey,
      });
    }
  };
}

export function batchDeletePendingTasksAsync(
  queue: string,
  taskKeys: string[]
) {
  return async (dispatch: Dispatch<TasksActionTypes>) => {
    dispatch({ type: BATCH_DELETE_PENDING_TASKS_BEGIN, queue, taskKeys });
    try {
      const response = await batchDeletePendingTasks(queue, taskKeys);
      dispatch({
        type: BATCH_DELETE_PENDING_TASKS_SUCCESS,
        queue: queue,
        payload: response,
      });
    } catch (error) {
      console.error(
        "batchDeletePendingTasksAsync: ",
        toErrorStringWithHttpStatus(error)
      );
      dispatch({
        type: BATCH_DELETE_PENDING_TASKS_ERROR,
        error: toErrorString(error),
        queue,
        taskKeys,
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
      console.error(
        "deleteScheduledTaskAsync: ",
        toErrorStringWithHttpStatus(error)
      );
      dispatch({
        type: DELETE_SCHEDULED_TASK_ERROR,
        error: toErrorString(error),
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
      console.error(
        "batchDeleteScheduledTasksAsync: ",
        toErrorStringWithHttpStatus(error)
      );
      dispatch({
        type: BATCH_DELETE_SCHEDULED_TASKS_ERROR,
        error: toErrorString(error),
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
      console.error(
        "batchRunScheduledTasksAsync: ",
        toErrorStringWithHttpStatus(error)
      );
      dispatch({
        type: BATCH_RUN_SCHEDULED_TASKS_ERROR,
        error: toErrorString(error),
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
      console.error(
        "batchArchiveScheduledTasksAsync: ",
        toErrorStringWithHttpStatus(error)
      );
      dispatch({
        type: BATCH_ARCHIVE_SCHEDULED_TASKS_ERROR,
        error: toErrorString(error),
        queue,
        taskKeys,
      });
    }
  };
}

export function batchArchivePendingTasksAsync(
  queue: string,
  taskKeys: string[]
) {
  return async (dispatch: Dispatch<TasksActionTypes>) => {
    dispatch({ type: BATCH_ARCHIVE_PENDING_TASKS_BEGIN, queue, taskKeys });
    try {
      const response = await batchArchivePendingTasks(queue, taskKeys);
      dispatch({
        type: BATCH_ARCHIVE_PENDING_TASKS_SUCCESS,
        queue: queue,
        payload: response,
      });
    } catch (error) {
      console.error(
        "batchArchivePendingTasksAsync: ",
        toErrorStringWithHttpStatus(error)
      );
      dispatch({
        type: BATCH_ARCHIVE_PENDING_TASKS_ERROR,
        error: toErrorString(error),
        queue,
        taskKeys,
      });
    }
  };
}

export function archiveAllPendingTasksAsync(queue: string) {
  return async (dispatch: Dispatch<TasksActionTypes>) => {
    dispatch({ type: ARCHIVE_ALL_PENDING_TASKS_BEGIN, queue });
    try {
      await archiveAllPendingTasks(queue);
      dispatch({ type: ARCHIVE_ALL_PENDING_TASKS_SUCCESS, queue });
    } catch (error) {
      console.error(
        "archiveAllPendingTasksAsync: ",
        toErrorStringWithHttpStatus(error)
      );
      dispatch({
        type: ARCHIVE_ALL_PENDING_TASKS_ERROR,
        error: toErrorString(error),
        queue,
      });
    }
  };
}

export function deleteAllPendingTasksAsync(queue: string) {
  return async (dispatch: Dispatch<TasksActionTypes>) => {
    dispatch({ type: DELETE_ALL_PENDING_TASKS_BEGIN, queue });
    try {
      await deleteAllPendingTasks(queue);
      dispatch({ type: DELETE_ALL_PENDING_TASKS_SUCCESS, queue });
    } catch (error) {
      console.error(
        "deleteAllPendingTasksAsync: ",
        toErrorStringWithHttpStatus(error)
      );
      dispatch({
        type: DELETE_ALL_PENDING_TASKS_ERROR,
        error: toErrorString(error),
        queue,
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
      console.error(
        "deleteAllScheduledTasksAsync: ",
        toErrorStringWithHttpStatus(error)
      );
      dispatch({
        type: DELETE_ALL_SCHEDULED_TASKS_ERROR,
        error: toErrorString(error),
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
      console.error(
        "runAllScheduledTasksAsync: ",
        toErrorStringWithHttpStatus(error)
      );
      dispatch({
        type: RUN_ALL_SCHEDULED_TASKS_ERROR,
        error: toErrorString(error),
        queue,
      });
    }
  };
}

export function archiveAllScheduledTasksAsync(queue: string) {
  return async (dispatch: Dispatch<TasksActionTypes>) => {
    dispatch({ type: ARCHIVE_ALL_SCHEDULED_TASKS_BEGIN, queue });
    try {
      await archiveAllScheduledTasks(queue);
      dispatch({ type: ARCHIVE_ALL_SCHEDULED_TASKS_SUCCESS, queue });
    } catch (error) {
      console.error(
        "archiveAllScheduledTasksAsync: ",
        toErrorStringWithHttpStatus(error)
      );
      dispatch({
        type: ARCHIVE_ALL_SCHEDULED_TASKS_ERROR,
        error: toErrorString(error),
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
      console.error(
        "deleteRetryTaskAsync: ",
        toErrorStringWithHttpStatus(error)
      );
      dispatch({
        type: DELETE_RETRY_TASK_ERROR,
        error: toErrorString(error),
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
      console.error(
        "batchDeleteRetryTasksAsync: ",
        toErrorStringWithHttpStatus(error)
      );
      dispatch({
        type: BATCH_DELETE_RETRY_TASKS_ERROR,
        error: toErrorString(error),
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
      console.error(
        "batchRunRetryTasksAsync: ",
        toErrorStringWithHttpStatus(error)
      );
      dispatch({
        type: BATCH_RUN_RETRY_TASKS_ERROR,
        error: toErrorString(error),
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
      console.error(
        "batchArchiveRetryTasksAsync: ",
        toErrorStringWithHttpStatus(error)
      );
      dispatch({
        type: BATCH_ARCHIVE_RETRY_TASKS_ERROR,
        error: toErrorString(error),
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
      console.error(
        "deleteAllRetryTasksAsync: ",
        toErrorStringWithHttpStatus(error)
      );
      dispatch({
        type: DELETE_ALL_RETRY_TASKS_ERROR,
        error: toErrorString(error),
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
      console.error(
        "runAllRetryTasksAsync: ",
        toErrorStringWithHttpStatus(error)
      );
      dispatch({
        type: RUN_ALL_RETRY_TASKS_ERROR,
        error: toErrorString(error),
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
      console.error(
        "archiveAllRetryTasksAsync: ",
        toErrorStringWithHttpStatus(error)
      );
      dispatch({
        type: ARCHIVE_ALL_RETRY_TASKS_ERROR,
        error: toErrorString(error),
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
      console.error(
        "deleteArchivedTaskAsync: ",
        toErrorStringWithHttpStatus(error)
      );
      dispatch({
        type: DELETE_ARCHIVED_TASK_ERROR,
        error: toErrorString(error),
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
      console.error(
        "batchDeleteArchivedTasksAsync: ",
        toErrorStringWithHttpStatus(error)
      );
      dispatch({
        type: BATCH_DELETE_ARCHIVED_TASKS_ERROR,
        error: toErrorString(error),
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
      console.error(
        "batchRunArchivedTasksAsync: ",
        toErrorStringWithHttpStatus(error)
      );
      dispatch({
        type: BATCH_RUN_ARCHIVED_TASKS_ERROR,
        error: toErrorString(error),
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
      console.error(
        "deleteAllArchivedTasksAsync: ",
        toErrorStringWithHttpStatus(error)
      );
      dispatch({
        type: DELETE_ALL_ARCHIVED_TASKS_ERROR,
        error: toErrorString(error),
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
      console.error(
        "runAllArchivedTasksAsync: ",
        toErrorStringWithHttpStatus(error)
      );
      dispatch({
        type: RUN_ALL_ARCHIVED_TASKS_ERROR,
        error: toErrorString(error),
        queue,
      });
    }
  };
}
