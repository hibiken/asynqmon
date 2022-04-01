import {
  batchCancelActiveTasks,
  BatchCancelTasksResponse,
  batchDeleteArchivedTasks,
  batchDeleteRetryTasks,
  batchDeleteScheduledTasks,
  batchDeleteCompletedTasks,
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
  deleteAllCompletedTasks,
  deleteArchivedTask,
  deleteRetryTask,
  deleteScheduledTask,
  deleteCompletedTask,
  archiveAllRetryTasks,
  archiveAllScheduledTasks,
  archiveRetryTask,
  archiveScheduledTask,
  listActiveTasks,
  listArchivedTasks,
  listPendingTasks,
  ListTasksResponse,
  listRetryTasks,
  listScheduledTasks,
  listCompletedTasks,
  listAggregatingTasks,
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
  TaskInfo,
  getTaskInfo,
  deleteAllAggregatingTasks,
  archiveAllAggregatingTasks,
  runAllAggregatingTasks,
  batchDeleteAggregatingTasks,
  batchArchiveAggregatingTasks,
  batchRunAggregatingTasks,
  deleteAggregatingTask,
  runAggregatingTask,
  archiveAggregatingTask,
  ListAggregatingTasksResponse,
} from "../api";
import { Dispatch } from "redux";
import { toErrorString, toErrorStringWithHttpStatus } from "../utils";

// List of tasks related action types.
export const GET_TASK_INFO_BEGIN = "GET_TASK_INFO_BEGIN";
export const GET_TASK_INFO_SUCCESS = "GET_TASK_INFO_SUCCESS";
export const GET_TASK_INFO_ERROR = "GET_TASK_INFO_ERROR";
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
export const LIST_COMPLETED_TASKS_BEGIN = "LIST_COMPLETED_TASKS_BEGIN";
export const LIST_COMPLETED_TASKS_SUCCESS = "LIST_COMPLETED_TASKS_SUCCESS";
export const LIST_COMPLETED_TASKS_ERROR = "LIST_COMPLETED_TASKS_ERROR";
export const LIST_AGGREGATING_TASKS_BEGIN = "LIST_AGGREGATING_TASKS_BEGIN";
export const LIST_AGGREGATING_TASKS_SUCCESS = "LIST_AGGREGATING_TASKS_SUCCESS";
export const LIST_AGGREGATING_TASKS_ERROR = "LIST_AGGREGATING_TASKS_ERROR";
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
export const RUN_SCHEDULED_TASK_BEGIN = "RUN_SCHEDULED_TASK_BEGIN";
export const RUN_SCHEDULED_TASK_SUCCESS = "RUN_SCHEDULED_TASK_SUCCESS";
export const RUN_SCHEDULED_TASK_ERROR = "RUN_SCHEDULED_TASK_ERROR";
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
export const RUN_AGGREGATING_TASK_BEGIN = "RUN_AGGREGATING_TASK_BEGIN";
export const RUN_AGGREGATING_TASK_SUCCESS = "RUN_AGGREGATING_TASK_SUCCESS";
export const RUN_AGGREGATING_TASK_ERROR = "RUN_AGGREGATING_TASK_ERROR";
export const DELETE_AGGREGATING_TASK_BEGIN = "DELETE_AGGREGATING_TASK_BEGIN";
export const DELETE_AGGREGATING_TASK_SUCCESS =
  "DELETE_AGGREGATING_TASK_SUCCESS";
export const DELETE_AGGREGATING_TASK_ERROR = "DELETE_AGGREGATING_TASK_ERROR";
export const ARCHIVE_AGGREGATING_TASK_BEGIN = "ARCHIVE_AGGREGATING_TASK_BEGIN";
export const ARCHIVE_AGGREGATING_TASK_SUCCESS =
  "ARCHIVE_AGGREGATING_TASK_SUCCESS";
export const ARCHIVE_AGGREGATING_TASK_ERROR = "ARCHIVE_AGGREGATING_TASK_ERROR";
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
export const DELETE_COMPLETED_TASK_BEGIN = "DELETE_COMPLETED_TASK_BEGIN";
export const DELETE_COMPLETED_TASK_SUCCESS = "DELETE_COMPLETED_TASK_SUCCESS";
export const DELETE_COMPLETED_TASK_ERROR = "DELETE_COMPLETED_TASK_ERROR";
export const DELETE_ALL_COMPLETED_TASKS_BEGIN =
  "DELETE_ALL_COMPLETED_TASKS_BEGIN";
export const DELETE_ALL_COMPLETED_TASKS_SUCCESS =
  "DELETE_ALL_COMPLETED_TASKS_SUCCESS";
export const DELETE_ALL_COMPLETED_TASKS_ERROR =
  "DELETE_ALL_COMPLETED_TASKS_ERROR";
export const BATCH_DELETE_COMPLETED_TASKS_BEGIN =
  "BATCH_DELETE_COMPLETED_TASKS_BEGIN";
export const BATCH_DELETE_COMPLETED_TASKS_SUCCESS =
  "BATCH_DELETE_COMPLETED_TASKS_SUCCESS";
export const BATCH_DELETE_COMPLETED_TASKS_ERROR =
  "BATCH_DELETE_COMPLETED_TASKS_ERROR";
export const BATCH_RUN_AGGREGATING_TASKS_BEGIN =
  "BATCH_RUN_AGGREGATING_TASKS_BEGIN";
export const BATCH_RUN_AGGREGATING_TASKS_SUCCESS =
  "BATCH_RUN_AGGREGATING_TASKS_SUCCESS";
export const BATCH_RUN_AGGREGATING_TASKS_ERROR =
  "BATCH_RUN_AGGREGATING_TASKS_ERROR";
export const BATCH_ARCHIVE_AGGREGATING_TASKS_BEGIN =
  "BATCH_ARCHIVE_AGGREGATING_TASKS_BEGIN";
export const BATCH_ARCHIVE_AGGREGATING_TASKS_SUCCESS =
  "BATCH_ARCHIVE_AGGREGATING_TASKS_SUCCESS";
export const BATCH_ARCHIVE_AGGREGATING_TASKS_ERROR =
  "BATCH_RUN_AGGREGATING_TASKS_ERROR";
export const BATCH_DELETE_AGGREGATING_TASKS_BEGIN =
  "BATCH_DELETE_AGGREGATING_TASKS_BEGIN";
export const BATCH_DELETE_AGGREGATING_TASKS_SUCCESS =
  "BATCH_DELETE_AGGREGATING_TASKS_SUCCESS";
export const BATCH_DELETE_AGGREGATING_TASKS_ERROR =
  "BATCH_DELETE_AGGREGATING_TASKS_ERROR";
export const RUN_ALL_AGGREGATING_TASKS_BEGIN =
  "RUN_ALL_AGGREGATING_TASKS_BEGIN";
export const RUN_ALL_AGGREGATING_TASKS_SUCCESS =
  "RUN_ALL_AGGREGATING_TASKS_SUCCESS";
export const RUN_ALL_AGGREGATING_TASKS_ERROR =
  "RUN_ALL_AGGREGATING_TASKS_ERROR";
export const ARCHIVE_ALL_AGGREGATING_TASKS_BEGIN =
  "ARCHIVE_ALL_AGGREGATING_TASKS_BEGIN";
export const ARCHIVE_ALL_AGGREGATING_TASKS_SUCCESS =
  "ARCHIVE_ALL_AGGREGATING_TASKS_SUCCESS";
export const ARCHIVE_ALL_AGGREGATING_TASKS_ERROR =
  "ARCHIVE_ALL_AGGREGATING_TASKS_ERROR";
export const DELETE_ALL_AGGREGATING_TASKS_BEGIN =
  "DELETE_ALL_AGGREGATING_TASKS_BEGIN";
export const DELETE_ALL_AGGREGATING_TASKS_SUCCESS =
  "DELETE_ALL_AGGREGATING_TASKS_SUCCESS";
export const DELETE_ALL_AGGREGATING_TASKS_ERROR =
  "DELETE_ALL_AGGREGATING_TASKS_ERROR";

interface GetTaskInfoBeginAction {
  type: typeof GET_TASK_INFO_BEGIN;
}

interface GetTaskInfoErrorAction {
  type: typeof GET_TASK_INFO_ERROR;
  error: string; // error description
}

interface GetTaskInfoSuccessAction {
  type: typeof GET_TASK_INFO_SUCCESS;
  payload: TaskInfo;
}

interface ListActiveTasksBeginAction {
  type: typeof LIST_ACTIVE_TASKS_BEGIN;
  queue: string;
}

interface ListActiveTasksSuccessAction {
  type: typeof LIST_ACTIVE_TASKS_SUCCESS;
  queue: string;
  payload: ListTasksResponse;
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
  payload: ListTasksResponse;
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
  payload: ListTasksResponse;
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
  payload: ListTasksResponse;
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
  payload: ListTasksResponse;
}

interface ListArchivedTasksErrorAction {
  type: typeof LIST_ARCHIVED_TASKS_ERROR;
  queue: string;
  error: string; // error description
}

interface ListCompletedTasksBeginAction {
  type: typeof LIST_COMPLETED_TASKS_BEGIN;
  queue: string;
}

interface ListCompletedTasksSuccessAction {
  type: typeof LIST_COMPLETED_TASKS_SUCCESS;
  queue: string;
  payload: ListTasksResponse;
}

interface ListCompletedTasksErrorAction {
  type: typeof LIST_COMPLETED_TASKS_ERROR;
  queue: string;
  error: string; // error description
}

interface ListAggregatingTasksBeginAction {
  type: typeof LIST_AGGREGATING_TASKS_BEGIN;
  queue: string;
  group: string;
}

interface ListAggregatingTasksSuccessAction {
  type: typeof LIST_AGGREGATING_TASKS_SUCCESS;
  queue: string;
  group: string;
  payload: ListAggregatingTasksResponse;
}

interface ListAggregatingTasksErrorAction {
  type: typeof LIST_AGGREGATING_TASKS_ERROR;
  queue: string;
  group: string;
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
  taskId: string;
}

interface DeletePendingTaskSuccessAction {
  type: typeof DELETE_PENDING_TASK_SUCCESS;
  queue: string;
  taskId: string;
}

interface DeletePendingTaskErrorAction {
  type: typeof DELETE_PENDING_TASK_ERROR;
  queue: string;
  taskId: string;
  error: string;
}

interface BatchDeletePendingTasksBeginAction {
  type: typeof BATCH_DELETE_PENDING_TASKS_BEGIN;
  queue: string;
  taskIds: string[];
}

interface BatchDeletePendingTasksSuccessAction {
  type: typeof BATCH_DELETE_PENDING_TASKS_SUCCESS;
  queue: string;
  payload: BatchDeleteTasksResponse;
}

interface BatchDeletePendingTasksErrorAction {
  type: typeof BATCH_DELETE_PENDING_TASKS_ERROR;
  queue: string;
  taskIds: string[];
  error: string;
}

interface DeleteAllPendingTasksBeginAction {
  type: typeof DELETE_ALL_PENDING_TASKS_BEGIN;
  queue: string;
}

interface DeleteAllPendingTasksSuccessAction {
  type: typeof DELETE_ALL_PENDING_TASKS_SUCCESS;
  queue: string;
  deleted: number;
}

interface DeleteAllPendingTasksErrorAction {
  type: typeof DELETE_ALL_PENDING_TASKS_ERROR;
  queue: string;
  error: string;
}

interface ArchivePendingTaskBeginAction {
  type: typeof ARCHIVE_PENDING_TASK_BEGIN;
  queue: string;
  taskId: string;
}

interface ArchivePendingTaskSuccessAction {
  type: typeof ARCHIVE_PENDING_TASK_SUCCESS;
  queue: string;
  taskId: string;
}

interface ArchivePendingTaskErrorAction {
  type: typeof ARCHIVE_PENDING_TASK_ERROR;
  queue: string;
  taskId: string;
  error: string;
}

interface BatchArchivePendingTasksBeginAction {
  type: typeof BATCH_ARCHIVE_PENDING_TASKS_BEGIN;
  queue: string;
  taskIds: string[];
}

interface BatchArchivePendingTasksSuccessAction {
  type: typeof BATCH_ARCHIVE_PENDING_TASKS_SUCCESS;
  queue: string;
  payload: BatchArchiveTasksResponse;
}

interface BatchArchivePendingTasksErrorAction {
  type: typeof BATCH_ARCHIVE_PENDING_TASKS_ERROR;
  queue: string;
  taskIds: string[];
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
  taskId: string;
}

interface RunScheduledTaskSuccessAction {
  type: typeof RUN_SCHEDULED_TASK_SUCCESS;
  queue: string;
  taskId: string;
}

interface RunScheduledTaskErrorAction {
  type: typeof RUN_SCHEDULED_TASK_ERROR;
  queue: string;
  taskId: string;
  error: string;
}

interface ArchiveScheduledTaskBeginAction {
  type: typeof ARCHIVE_SCHEDULED_TASK_BEGIN;
  queue: string;
  taskId: string;
}

interface ArchiveScheduledTaskSuccessAction {
  type: typeof ARCHIVE_SCHEDULED_TASK_SUCCESS;
  queue: string;
  taskId: string;
}

interface ArchiveScheduledTaskErrorAction {
  type: typeof ARCHIVE_SCHEDULED_TASK_ERROR;
  queue: string;
  taskId: string;
  error: string;
}

interface RunRetryTaskBeginAction {
  type: typeof RUN_RETRY_TASK_BEGIN;
  queue: string;
  taskId: string;
}

interface RunRetryTaskSuccessAction {
  type: typeof RUN_RETRY_TASK_SUCCESS;
  queue: string;
  taskId: string;
}

interface RunRetryTaskErrorAction {
  type: typeof RUN_RETRY_TASK_ERROR;
  queue: string;
  taskId: string;
  error: string;
}

interface ArchiveRetryTaskBeginAction {
  type: typeof ARCHIVE_RETRY_TASK_BEGIN;
  queue: string;
  taskId: string;
}

interface ArchiveRetryTaskSuccessAction {
  type: typeof ARCHIVE_RETRY_TASK_SUCCESS;
  queue: string;
  taskId: string;
}

interface ArchiveRetryTaskErrorAction {
  type: typeof ARCHIVE_RETRY_TASK_ERROR;
  queue: string;
  taskId: string;
  error: string;
}

interface RunArchivedTaskBeginAction {
  type: typeof RUN_ARCHIVED_TASK_BEGIN;
  queue: string;
  taskId: string;
}

interface RunArchivedTaskSuccessAction {
  type: typeof RUN_ARCHIVED_TASK_SUCCESS;
  queue: string;
  taskId: string;
}

interface RunArchivedTaskErrorAction {
  type: typeof RUN_ARCHIVED_TASK_ERROR;
  queue: string;
  taskId: string;
  error: string;
}

interface DeleteScheduledTaskBeginAction {
  type: typeof DELETE_SCHEDULED_TASK_BEGIN;
  queue: string;
  taskId: string;
}

interface DeleteScheduledTaskSuccessAction {
  type: typeof DELETE_SCHEDULED_TASK_SUCCESS;
  queue: string;
  taskId: string;
}

interface DeleteScheduledTaskErrorAction {
  type: typeof DELETE_SCHEDULED_TASK_ERROR;
  queue: string;
  taskId: string;
  error: string;
}

interface BatchDeleteScheduledTasksBeginAction {
  type: typeof BATCH_DELETE_SCHEDULED_TASKS_BEGIN;
  queue: string;
  taskIds: string[];
}

interface BatchDeleteScheduledTasksSuccessAction {
  type: typeof BATCH_DELETE_SCHEDULED_TASKS_SUCCESS;
  queue: string;
  payload: BatchDeleteTasksResponse;
}

interface BatchDeleteScheduledTasksErrorAction {
  type: typeof BATCH_DELETE_SCHEDULED_TASKS_ERROR;
  queue: string;
  taskIds: string[];
  error: string;
}

interface BatchRunScheduledTasksBeginAction {
  type: typeof BATCH_RUN_SCHEDULED_TASKS_BEGIN;
  queue: string;
  taskIds: string[];
}

interface BatchRunScheduledTasksSuccessAction {
  type: typeof BATCH_RUN_SCHEDULED_TASKS_SUCCESS;
  queue: string;
  payload: BatchRunTasksResponse;
}

interface BatchRunScheduledTasksErrorAction {
  type: typeof BATCH_RUN_SCHEDULED_TASKS_ERROR;
  queue: string;
  taskIds: string[];
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
  taskIds: string[];
}

interface BatchArchiveScheduledTasksSuccessAction {
  type: typeof BATCH_ARCHIVE_SCHEDULED_TASKS_SUCCESS;
  queue: string;
  payload: BatchArchiveTasksResponse;
}

interface BatchArchiveScheduledTasksErrorAction {
  type: typeof BATCH_ARCHIVE_SCHEDULED_TASKS_ERROR;
  queue: string;
  taskIds: string[];
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
  deleted: number;
}

interface DeleteAllScheduledTasksErrorAction {
  type: typeof DELETE_ALL_SCHEDULED_TASKS_ERROR;
  queue: string;
  error: string;
}

interface DeleteRetryTaskBeginAction {
  type: typeof DELETE_RETRY_TASK_BEGIN;
  queue: string;
  taskId: string;
}

interface DeleteRetryTaskSuccessAction {
  type: typeof DELETE_RETRY_TASK_SUCCESS;
  queue: string;
  taskId: string;
}

interface DeleteRetryTaskErrorAction {
  type: typeof DELETE_RETRY_TASK_ERROR;
  queue: string;
  taskId: string;
  error: string;
}

interface BatchDeleteRetryTasksBeginAction {
  type: typeof BATCH_DELETE_RETRY_TASKS_BEGIN;
  queue: string;
  taskIds: string[];
}

interface BatchDeleteRetryTasksSuccessAction {
  type: typeof BATCH_DELETE_RETRY_TASKS_SUCCESS;
  queue: string;
  payload: BatchDeleteTasksResponse;
}

interface BatchDeleteRetryTasksErrorAction {
  type: typeof BATCH_DELETE_RETRY_TASKS_ERROR;
  queue: string;
  taskIds: string[];
  error: string;
}

interface BatchRunRetryTasksBeginAction {
  type: typeof BATCH_RUN_RETRY_TASKS_BEGIN;
  queue: string;
  taskIds: string[];
}

interface BatchRunRetryTasksSuccessAction {
  type: typeof BATCH_RUN_RETRY_TASKS_SUCCESS;
  queue: string;
  payload: BatchRunTasksResponse;
}

interface BatchRunRetryTasksErrorAction {
  type: typeof BATCH_RUN_RETRY_TASKS_ERROR;
  queue: string;
  taskIds: string[];
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
  taskIds: string[];
}

interface BatchArchiveRetryTasksSuccessAction {
  type: typeof BATCH_ARCHIVE_RETRY_TASKS_SUCCESS;
  queue: string;
  payload: BatchArchiveTasksResponse;
}

interface BatchArchiveRetryTasksErrorAction {
  type: typeof BATCH_ARCHIVE_RETRY_TASKS_ERROR;
  queue: string;
  taskIds: string[];
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
  deleted: number;
}

interface DeleteAllRetryTasksErrorAction {
  type: typeof DELETE_ALL_RETRY_TASKS_ERROR;
  queue: string;
  error: string;
}

interface DeleteArchivedTaskBeginAction {
  type: typeof DELETE_ARCHIVED_TASK_BEGIN;
  queue: string;
  taskId: string;
}

interface DeleteArchivedTaskSuccessAction {
  type: typeof DELETE_ARCHIVED_TASK_SUCCESS;
  queue: string;
  taskId: string;
}

interface DeleteArchivedTaskErrorAction {
  type: typeof DELETE_ARCHIVED_TASK_ERROR;
  queue: string;
  taskId: string;
  error: string;
}

interface BatchDeleteArchivedTasksBeginAction {
  type: typeof BATCH_DELETE_ARCHIVED_TASKS_BEGIN;
  queue: string;
  taskIds: string[];
}

interface BatchDeleteArchivedTasksSuccessAction {
  type: typeof BATCH_DELETE_ARCHIVED_TASKS_SUCCESS;
  queue: string;
  payload: BatchDeleteTasksResponse;
}

interface BatchDeleteArchivedTasksErrorAction {
  type: typeof BATCH_DELETE_ARCHIVED_TASKS_ERROR;
  queue: string;
  taskIds: string[];
  error: string;
}

interface BatchRunArchivedTasksBeginAction {
  type: typeof BATCH_RUN_ARCHIVED_TASKS_BEGIN;
  queue: string;
  taskIds: string[];
}

interface BatchRunArchivedTasksSuccessAction {
  type: typeof BATCH_RUN_ARCHIVED_TASKS_SUCCESS;
  queue: string;
  payload: BatchRunTasksResponse;
}

interface BatchRunArchivedTasksErrorAction {
  type: typeof BATCH_RUN_ARCHIVED_TASKS_ERROR;
  queue: string;
  taskIds: string[];
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
  deleted: number;
}

interface DeleteAllArchivedTasksErrorAction {
  type: typeof DELETE_ALL_ARCHIVED_TASKS_ERROR;
  queue: string;
  error: string;
}

interface DeleteCompletedTaskBeginAction {
  type: typeof DELETE_COMPLETED_TASK_BEGIN;
  queue: string;
  taskId: string;
}

interface DeleteCompletedTaskSuccessAction {
  type: typeof DELETE_COMPLETED_TASK_SUCCESS;
  queue: string;
  taskId: string;
}

interface DeleteCompletedTaskErrorAction {
  type: typeof DELETE_COMPLETED_TASK_ERROR;
  queue: string;
  taskId: string;
  error: string;
}

interface BatchDeleteCompletedTasksBeginAction {
  type: typeof BATCH_DELETE_COMPLETED_TASKS_BEGIN;
  queue: string;
  taskIds: string[];
}

interface BatchDeleteCompletedTasksSuccessAction {
  type: typeof BATCH_DELETE_COMPLETED_TASKS_SUCCESS;
  queue: string;
  payload: BatchDeleteTasksResponse;
}

interface BatchDeleteCompletedTasksErrorAction {
  type: typeof BATCH_DELETE_COMPLETED_TASKS_ERROR;
  queue: string;
  taskIds: string[];
  error: string;
}

interface DeleteAllCompletedTasksBeginAction {
  type: typeof DELETE_ALL_COMPLETED_TASKS_BEGIN;
  queue: string;
}

interface DeleteAllCompletedTasksSuccessAction {
  type: typeof DELETE_ALL_COMPLETED_TASKS_SUCCESS;
  queue: string;
  deleted: number;
}

interface DeleteAllCompletedTasksErrorAction {
  type: typeof DELETE_ALL_COMPLETED_TASKS_ERROR;
  queue: string;
  error: string;
}

interface DeleteAggregatingTaskBeginAction {
  type: typeof DELETE_AGGREGATING_TASK_BEGIN;
  queue: string;
  taskId: string;
}

interface DeleteAggregatingTaskSuccessAction {
  type: typeof DELETE_AGGREGATING_TASK_SUCCESS;
  queue: string;
  taskId: string;
}

interface DeleteAggregatingTaskErrorAction {
  type: typeof DELETE_AGGREGATING_TASK_ERROR;
  queue: string;
  taskId: string;
  error: string;
}

interface RunAggregatingTaskBeginAction {
  type: typeof RUN_AGGREGATING_TASK_BEGIN;
  queue: string;
  taskId: string;
}

interface RunAggregatingTaskSuccessAction {
  type: typeof RUN_AGGREGATING_TASK_SUCCESS;
  queue: string;
  taskId: string;
}

interface RunAggregatingTaskErrorAction {
  type: typeof RUN_AGGREGATING_TASK_ERROR;
  queue: string;
  taskId: string;
  error: string;
}

interface ArchiveAggregatingTaskBeginAction {
  type: typeof ARCHIVE_AGGREGATING_TASK_BEGIN;
  queue: string;
  taskId: string;
}

interface ArchiveAggregatingTaskSuccessAction {
  type: typeof ARCHIVE_AGGREGATING_TASK_SUCCESS;
  queue: string;
  taskId: string;
}

interface ArchiveAggregatingTaskErrorAction {
  type: typeof ARCHIVE_AGGREGATING_TASK_ERROR;
  queue: string;
  taskId: string;
  error: string;
}

interface BatchDeleteAggregatingTasksBeginAction {
  type: typeof BATCH_DELETE_AGGREGATING_TASKS_BEGIN;
  queue: string;
  group: string;
  taskIds: string[];
}

interface BatchDeleteAggregatingTasksSuccessAction {
  type: typeof BATCH_DELETE_AGGREGATING_TASKS_SUCCESS;
  queue: string;
  group: string;
  payload: BatchDeleteTasksResponse;
}

interface BatchDeleteAggregatingTasksErrorAction {
  type: typeof BATCH_DELETE_AGGREGATING_TASKS_ERROR;
  queue: string;
  group: string;
  taskIds: string[];
  error: string;
}

interface BatchRunAggregatingTasksBeginAction {
  type: typeof BATCH_RUN_AGGREGATING_TASKS_BEGIN;
  queue: string;
  group: string;
  taskIds: string[];
}

interface BatchRunAggregatingTasksSuccessAction {
  type: typeof BATCH_RUN_AGGREGATING_TASKS_SUCCESS;
  queue: string;
  group: string;
  payload: BatchRunTasksResponse;
}

interface BatchRunAggregatingTasksErrorAction {
  type: typeof BATCH_RUN_AGGREGATING_TASKS_ERROR;
  queue: string;
  group: string;
  taskIds: string[];
  error: string;
}

interface RunAllAggregatingTasksBeginAction {
  type: typeof RUN_ALL_AGGREGATING_TASKS_BEGIN;
  queue: string;
  group: string;
}

interface RunAllAggregatingTasksSuccessAction {
  type: typeof RUN_ALL_AGGREGATING_TASKS_SUCCESS;
  scheduled: number;
  queue: string;
  group: string;
}

interface RunAllAggregatingTasksErrorAction {
  type: typeof RUN_ALL_AGGREGATING_TASKS_ERROR;
  queue: string;
  group: string;
  error: string;
}

interface BatchArchiveAggregatingTasksBeginAction {
  type: typeof BATCH_ARCHIVE_AGGREGATING_TASKS_BEGIN;
  queue: string;
  group: string;
  taskIds: string[];
}

interface BatchArchiveAggregatingTasksSuccessAction {
  type: typeof BATCH_ARCHIVE_AGGREGATING_TASKS_SUCCESS;
  queue: string;
  group: string;
  payload: BatchArchiveTasksResponse;
}

interface BatchArchiveAggregatingTasksErrorAction {
  type: typeof BATCH_ARCHIVE_AGGREGATING_TASKS_ERROR;
  queue: string;
  group: string;
  taskIds: string[];
  error: string;
}

interface ArchiveAllAggregatingTasksBeginAction {
  type: typeof ARCHIVE_ALL_AGGREGATING_TASKS_BEGIN;
  queue: string;
  group: string;
}

interface ArchiveAllAggregatingTasksSuccessAction {
  type: typeof ARCHIVE_ALL_AGGREGATING_TASKS_SUCCESS;
  queue: string;
  group: string;
  archived: number;
}

interface ArchiveAllAggregatingTasksErrorAction {
  type: typeof ARCHIVE_ALL_AGGREGATING_TASKS_ERROR;
  queue: string;
  group: string;
  error: string;
}

interface DeleteAllAggregatingTasksBeginAction {
  type: typeof DELETE_ALL_AGGREGATING_TASKS_BEGIN;
  queue: string;
  group: string;
}

interface DeleteAllAggregatingTasksSuccessAction {
  type: typeof DELETE_ALL_AGGREGATING_TASKS_SUCCESS;
  queue: string;
  group: string;
  deleted: number;
}

interface DeleteAllAggregatingTasksErrorAction {
  type: typeof DELETE_ALL_AGGREGATING_TASKS_ERROR;
  queue: string;
  group: string;
  error: string;
}

// Union of all tasks related action types.
export type TasksActionTypes =
  | GetTaskInfoBeginAction
  | GetTaskInfoErrorAction
  | GetTaskInfoSuccessAction
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
  | ListCompletedTasksBeginAction
  | ListCompletedTasksSuccessAction
  | ListCompletedTasksErrorAction
  | ListAggregatingTasksBeginAction
  | ListAggregatingTasksSuccessAction
  | ListAggregatingTasksErrorAction
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
  | DeleteAllArchivedTasksErrorAction
  | DeleteCompletedTaskBeginAction
  | DeleteCompletedTaskSuccessAction
  | DeleteCompletedTaskErrorAction
  | BatchDeleteCompletedTasksBeginAction
  | BatchDeleteCompletedTasksSuccessAction
  | BatchDeleteCompletedTasksErrorAction
  | DeleteAllCompletedTasksBeginAction
  | DeleteAllCompletedTasksSuccessAction
  | DeleteAllCompletedTasksErrorAction
  | BatchDeleteAggregatingTasksBeginAction
  | BatchDeleteAggregatingTasksSuccessAction
  | BatchDeleteAggregatingTasksErrorAction
  | BatchRunAggregatingTasksBeginAction
  | BatchRunAggregatingTasksSuccessAction
  | BatchRunAggregatingTasksErrorAction
  | RunAllAggregatingTasksBeginAction
  | RunAllAggregatingTasksSuccessAction
  | RunAllAggregatingTasksErrorAction
  | BatchArchiveAggregatingTasksBeginAction
  | BatchArchiveAggregatingTasksSuccessAction
  | BatchArchiveAggregatingTasksErrorAction
  | ArchiveAllAggregatingTasksBeginAction
  | ArchiveAllAggregatingTasksSuccessAction
  | ArchiveAllAggregatingTasksErrorAction
  | DeleteAllAggregatingTasksBeginAction
  | DeleteAllAggregatingTasksSuccessAction
  | DeleteAllAggregatingTasksErrorAction
  | DeleteAggregatingTaskBeginAction
  | DeleteAggregatingTaskSuccessAction
  | DeleteAggregatingTaskErrorAction
  | RunAggregatingTaskBeginAction
  | RunAggregatingTaskSuccessAction
  | RunAggregatingTaskErrorAction
  | ArchiveAggregatingTaskBeginAction
  | ArchiveAggregatingTaskSuccessAction
  | ArchiveAggregatingTaskErrorAction;

export function getTaskInfoAsync(qname: string, id: string) {
  return async (dispatch: Dispatch<TasksActionTypes>) => {
    dispatch({ type: GET_TASK_INFO_BEGIN });
    try {
      const response = await getTaskInfo(qname, id);
      dispatch({
        type: GET_TASK_INFO_SUCCESS,
        payload: response,
      });
    } catch (error) {
      console.error("getTaskInfoAsync: ", toErrorStringWithHttpStatus(error));
      dispatch({
        type: GET_TASK_INFO_ERROR,
        error: toErrorString(error),
      });
    }
  };
}

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

export function listCompletedTasksAsync(
  qname: string,
  pageOpts?: PaginationOptions
) {
  return async (dispatch: Dispatch<TasksActionTypes>) => {
    try {
      dispatch({ type: LIST_COMPLETED_TASKS_BEGIN, queue: qname });
      const response = await listCompletedTasks(qname, pageOpts);
      dispatch({
        type: LIST_COMPLETED_TASKS_SUCCESS,
        queue: qname,
        payload: response,
      });
    } catch (error) {
      console.error(
        "listCompletedTasksAsync: ",
        toErrorStringWithHttpStatus(error)
      );
      dispatch({
        type: LIST_COMPLETED_TASKS_ERROR,
        queue: qname,
        error: toErrorString(error),
      });
    }
  };
}

export function listAggregatingTasksAsync(
  qname: string,
  gname: string,
  pageOpts?: PaginationOptions
) {
  return async (dispatch: Dispatch<TasksActionTypes>) => {
    try {
      dispatch({
        type: LIST_AGGREGATING_TASKS_BEGIN,
        queue: qname,
        group: gname,
      });
      const response = await listAggregatingTasks(qname, gname, pageOpts);
      dispatch({
        type: LIST_AGGREGATING_TASKS_SUCCESS,
        queue: qname,
        group: gname,
        payload: response,
      });
    } catch (error) {
      console.error(
        "listAggregatingTasksAsync: ",
        toErrorStringWithHttpStatus(error)
      );
      dispatch({
        type: LIST_AGGREGATING_TASKS_ERROR,
        queue: qname,
        group: gname,
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

export function runScheduledTaskAsync(queue: string, taskId: string) {
  return async (dispatch: Dispatch<TasksActionTypes>) => {
    dispatch({ type: RUN_SCHEDULED_TASK_BEGIN, queue, taskId });
    try {
      await runScheduledTask(queue, taskId);
      dispatch({ type: RUN_SCHEDULED_TASK_SUCCESS, queue, taskId });
    } catch (error) {
      console.error(
        "runScheduledTaskAsync: ",
        toErrorStringWithHttpStatus(error)
      );
      dispatch({
        type: RUN_SCHEDULED_TASK_ERROR,
        error: toErrorString(error),
        queue,
        taskId,
      });
    }
  };
}

export function runRetryTaskAsync(queue: string, taskId: string) {
  return async (dispatch: Dispatch<TasksActionTypes>) => {
    dispatch({ type: RUN_RETRY_TASK_BEGIN, queue, taskId });
    try {
      await runRetryTask(queue, taskId);
      dispatch({ type: RUN_RETRY_TASK_SUCCESS, queue, taskId });
    } catch (error) {
      console.error("runRetryTaskAsync: ", toErrorStringWithHttpStatus(error));
      dispatch({
        type: RUN_RETRY_TASK_ERROR,
        error: toErrorString(error),
        queue,
        taskId,
      });
    }
  };
}

export function archivePendingTaskAsync(queue: string, taskId: string) {
  return async (dispatch: Dispatch<TasksActionTypes>) => {
    dispatch({ type: ARCHIVE_PENDING_TASK_BEGIN, queue, taskId });
    try {
      await archivePendingTask(queue, taskId);
      dispatch({ type: ARCHIVE_PENDING_TASK_SUCCESS, queue, taskId });
    } catch (error) {
      console.error(
        "archivePendingTaskAsync: ",
        toErrorStringWithHttpStatus(error)
      );
      dispatch({
        type: ARCHIVE_PENDING_TASK_ERROR,
        error: toErrorString(error),
        queue,
        taskId,
      });
    }
  };
}

export function archiveScheduledTaskAsync(queue: string, taskId: string) {
  return async (dispatch: Dispatch<TasksActionTypes>) => {
    dispatch({ type: ARCHIVE_SCHEDULED_TASK_BEGIN, queue, taskId });
    try {
      await archiveScheduledTask(queue, taskId);
      dispatch({ type: ARCHIVE_SCHEDULED_TASK_SUCCESS, queue, taskId });
    } catch (error) {
      console.error(
        "archiveScheduledTaskAsync: ",
        toErrorStringWithHttpStatus(error)
      );
      dispatch({
        type: ARCHIVE_SCHEDULED_TASK_ERROR,
        error: toErrorString(error),
        queue,
        taskId,
      });
    }
  };
}

export function archiveRetryTaskAsync(queue: string, taskId: string) {
  return async (dispatch: Dispatch<TasksActionTypes>) => {
    dispatch({ type: ARCHIVE_RETRY_TASK_BEGIN, queue, taskId });
    try {
      await archiveRetryTask(queue, taskId);
      dispatch({ type: ARCHIVE_RETRY_TASK_SUCCESS, queue, taskId });
    } catch (error) {
      console.error(
        "archiveRetryTaskAsync: ",
        toErrorStringWithHttpStatus(error)
      );
      dispatch({
        type: ARCHIVE_RETRY_TASK_ERROR,
        error: toErrorString(error),
        queue,
        taskId,
      });
    }
  };
}

export function runArchivedTaskAsync(queue: string, taskId: string) {
  return async (dispatch: Dispatch<TasksActionTypes>) => {
    dispatch({ type: RUN_ARCHIVED_TASK_BEGIN, queue, taskId });
    try {
      await runArchivedTask(queue, taskId);
      dispatch({ type: RUN_ARCHIVED_TASK_SUCCESS, queue, taskId });
    } catch (error) {
      console.error(
        "runArchivedTaskAsync: ",
        toErrorStringWithHttpStatus(error)
      );
      dispatch({
        type: RUN_ARCHIVED_TASK_ERROR,
        error: toErrorString(error),
        queue,
        taskId,
      });
    }
  };
}

export function deletePendingTaskAsync(queue: string, taskId: string) {
  return async (dispatch: Dispatch<TasksActionTypes>) => {
    dispatch({ type: DELETE_PENDING_TASK_BEGIN, queue, taskId });
    try {
      await deletePendingTask(queue, taskId);
      dispatch({ type: DELETE_PENDING_TASK_SUCCESS, queue, taskId });
    } catch (error) {
      console.error(
        "deletePendingTaskAsync: ",
        toErrorStringWithHttpStatus(error)
      );
      dispatch({
        type: DELETE_PENDING_TASK_ERROR,
        error: toErrorString(error),
        queue,
        taskId,
      });
    }
  };
}

export function batchDeletePendingTasksAsync(queue: string, taskIds: string[]) {
  return async (dispatch: Dispatch<TasksActionTypes>) => {
    dispatch({ type: BATCH_DELETE_PENDING_TASKS_BEGIN, queue, taskIds });
    try {
      const response = await batchDeletePendingTasks(queue, taskIds);
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
        taskIds,
      });
    }
  };
}

export function deleteScheduledTaskAsync(queue: string, taskId: string) {
  return async (dispatch: Dispatch<TasksActionTypes>) => {
    dispatch({ type: DELETE_SCHEDULED_TASK_BEGIN, queue, taskId });
    try {
      await deleteScheduledTask(queue, taskId);
      dispatch({ type: DELETE_SCHEDULED_TASK_SUCCESS, queue, taskId });
    } catch (error) {
      console.error(
        "deleteScheduledTaskAsync: ",
        toErrorStringWithHttpStatus(error)
      );
      dispatch({
        type: DELETE_SCHEDULED_TASK_ERROR,
        error: toErrorString(error),
        queue,
        taskId,
      });
    }
  };
}

export function batchDeleteScheduledTasksAsync(
  queue: string,
  taskIds: string[]
) {
  return async (dispatch: Dispatch<TasksActionTypes>) => {
    dispatch({ type: BATCH_DELETE_SCHEDULED_TASKS_BEGIN, queue, taskIds });
    try {
      const response = await batchDeleteScheduledTasks(queue, taskIds);
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
        taskIds,
      });
    }
  };
}

export function batchRunScheduledTasksAsync(queue: string, taskIds: string[]) {
  return async (dispatch: Dispatch<TasksActionTypes>) => {
    dispatch({ type: BATCH_RUN_SCHEDULED_TASKS_BEGIN, queue, taskIds });
    try {
      const response = await batchRunScheduledTasks(queue, taskIds);
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
        taskIds,
      });
    }
  };
}

export function batchArchiveScheduledTasksAsync(
  queue: string,
  taskIds: string[]
) {
  return async (dispatch: Dispatch<TasksActionTypes>) => {
    dispatch({ type: BATCH_ARCHIVE_SCHEDULED_TASKS_BEGIN, queue, taskIds });
    try {
      const response = await batchArchiveScheduledTasks(queue, taskIds);
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
        taskIds,
      });
    }
  };
}

export function batchArchivePendingTasksAsync(
  queue: string,
  taskIds: string[]
) {
  return async (dispatch: Dispatch<TasksActionTypes>) => {
    dispatch({ type: BATCH_ARCHIVE_PENDING_TASKS_BEGIN, queue, taskIds });
    try {
      const response = await batchArchivePendingTasks(queue, taskIds);
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
        taskIds,
      });
    }
  };
}

export function deleteAggregatingTaskAsync(
  queue: string,
  group: string,
  taskId: string
) {
  return async (dispatch: Dispatch<TasksActionTypes>) => {
    dispatch({ type: DELETE_AGGREGATING_TASK_BEGIN, queue, taskId });
    try {
      await deleteAggregatingTask(queue, group, taskId);
      dispatch({ type: DELETE_AGGREGATING_TASK_SUCCESS, queue, taskId });
    } catch (error) {
      console.error(
        "deleteAggregatingTaskAsync: ",
        toErrorStringWithHttpStatus(error)
      );
      dispatch({
        type: DELETE_AGGREGATING_TASK_ERROR,
        error: toErrorString(error),
        queue,
        taskId,
      });
    }
  };
}

export function runAggregatingTaskAsync(
  queue: string,
  group: string,
  taskId: string
) {
  return async (dispatch: Dispatch<TasksActionTypes>) => {
    dispatch({ type: RUN_AGGREGATING_TASK_BEGIN, queue, taskId });
    try {
      await runAggregatingTask(queue, group, taskId);
      dispatch({ type: RUN_AGGREGATING_TASK_SUCCESS, queue, taskId });
    } catch (error) {
      console.error(
        "runAggregatingTaskAsync: ",
        toErrorStringWithHttpStatus(error)
      );
      dispatch({
        type: RUN_AGGREGATING_TASK_ERROR,
        error: toErrorString(error),
        queue,
        taskId,
      });
    }
  };
}

export function archiveAggregatingTaskAsync(
  queue: string,
  group: string,
  taskId: string
) {
  return async (dispatch: Dispatch<TasksActionTypes>) => {
    dispatch({ type: ARCHIVE_AGGREGATING_TASK_BEGIN, queue, taskId });
    try {
      await archiveAggregatingTask(queue, group, taskId);
      dispatch({ type: ARCHIVE_AGGREGATING_TASK_SUCCESS, queue, taskId });
    } catch (error) {
      console.error(
        "archiveAggregatingTaskAsync: ",
        toErrorStringWithHttpStatus(error)
      );
      dispatch({
        type: ARCHIVE_AGGREGATING_TASK_ERROR,
        error: toErrorString(error),
        queue,
        taskId,
      });
    }
  };
}

export function batchArchiveAggregatingTasksAsync(
  queue: string,
  group: string,
  taskIds: string[]
) {
  return async (dispatch: Dispatch<TasksActionTypes>) => {
    dispatch({
      type: BATCH_ARCHIVE_AGGREGATING_TASKS_BEGIN,
      queue,
      group,
      taskIds,
    });
    try {
      const response = await batchArchiveAggregatingTasks(
        queue,
        group,
        taskIds
      );
      dispatch({
        type: BATCH_ARCHIVE_AGGREGATING_TASKS_SUCCESS,
        payload: response,
        queue,
        group,
      });
    } catch (error) {
      console.error(
        "batchArchiveAggregatingTasksAsync: ",
        toErrorStringWithHttpStatus(error)
      );
      dispatch({
        type: BATCH_ARCHIVE_AGGREGATING_TASKS_ERROR,
        error: toErrorString(error),
        queue,
        group,
        taskIds,
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
      const response = await deleteAllPendingTasks(queue);
      dispatch({
        type: DELETE_ALL_PENDING_TASKS_SUCCESS,
        deleted: response.deleted,
        queue,
      });
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

export function deleteAllAggregatingTasksAsync(queue: string, group: string) {
  return async (dispatch: Dispatch<TasksActionTypes>) => {
    dispatch({ type: DELETE_ALL_AGGREGATING_TASKS_BEGIN, queue, group });
    try {
      const response = await deleteAllAggregatingTasks(queue, group);
      dispatch({
        type: DELETE_ALL_AGGREGATING_TASKS_SUCCESS,
        deleted: response.deleted,
        queue,
        group,
      });
    } catch (error) {
      console.error(
        "deleteAllAggregatingTasksAsync: ",
        toErrorStringWithHttpStatus(error)
      );
      dispatch({
        type: DELETE_ALL_AGGREGATING_TASKS_ERROR,
        error: toErrorString(error),
        queue,
        group,
      });
    }
  };
}

export function deleteAllScheduledTasksAsync(queue: string) {
  return async (dispatch: Dispatch<TasksActionTypes>) => {
    dispatch({ type: DELETE_ALL_SCHEDULED_TASKS_BEGIN, queue });
    try {
      const response = await deleteAllScheduledTasks(queue);
      dispatch({
        type: DELETE_ALL_SCHEDULED_TASKS_SUCCESS,
        deleted: response.deleted,
        queue,
      });
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

export function archiveAllAggregatingTasksAsync(queue: string, group: string) {
  return async (dispatch: Dispatch<TasksActionTypes>) => {
    dispatch({ type: ARCHIVE_ALL_AGGREGATING_TASKS_BEGIN, queue, group });
    try {
      const response = await archiveAllAggregatingTasks(queue, group);
      dispatch({
        type: ARCHIVE_ALL_AGGREGATING_TASKS_SUCCESS,
        archived: response.archived,
        queue,
        group,
      });
    } catch (error) {
      console.error(
        "archiveAllAggregatingTasksAsync: ",
        toErrorStringWithHttpStatus(error)
      );
      dispatch({
        type: ARCHIVE_ALL_AGGREGATING_TASKS_ERROR,
        error: toErrorString(error),
        queue,
        group,
      });
    }
  };
}

export function runAllAggregatingTasksAsync(queue: string, group: string) {
  return async (dispatch: Dispatch<TasksActionTypes>) => {
    dispatch({ type: RUN_ALL_AGGREGATING_TASKS_BEGIN, queue, group });
    try {
      const resp = await runAllAggregatingTasks(queue, group);
      dispatch({
        type: RUN_ALL_AGGREGATING_TASKS_SUCCESS,
        scheduled: resp.scheduled,
        queue,
        group,
      });
    } catch (error) {
      console.error(
        "runAllAggregatingTasksAsync: ",
        toErrorStringWithHttpStatus(error)
      );
      dispatch({
        type: RUN_ALL_AGGREGATING_TASKS_ERROR,
        error: toErrorString(error),
        queue,
        group,
      });
    }
  };
}

export function deleteRetryTaskAsync(queue: string, taskId: string) {
  return async (dispatch: Dispatch<TasksActionTypes>) => {
    dispatch({ type: DELETE_RETRY_TASK_BEGIN, queue, taskId });
    try {
      await deleteRetryTask(queue, taskId);
      dispatch({ type: DELETE_RETRY_TASK_SUCCESS, queue, taskId });
    } catch (error) {
      console.error(
        "deleteRetryTaskAsync: ",
        toErrorStringWithHttpStatus(error)
      );
      dispatch({
        type: DELETE_RETRY_TASK_ERROR,
        error: toErrorString(error),
        queue,
        taskId,
      });
    }
  };
}

export function batchDeleteRetryTasksAsync(queue: string, taskIds: string[]) {
  return async (dispatch: Dispatch<TasksActionTypes>) => {
    dispatch({ type: BATCH_DELETE_RETRY_TASKS_BEGIN, queue, taskIds });
    try {
      const response = await batchDeleteRetryTasks(queue, taskIds);
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
        taskIds,
      });
    }
  };
}

export function batchRunRetryTasksAsync(queue: string, taskIds: string[]) {
  return async (dispatch: Dispatch<TasksActionTypes>) => {
    dispatch({ type: BATCH_RUN_RETRY_TASKS_BEGIN, queue, taskIds });
    try {
      const response = await batchRunRetryTasks(queue, taskIds);
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
        taskIds,
      });
    }
  };
}

export function batchRunAggregatingTasksAsync(
  queue: string,
  group: string,
  taskIds: string[]
) {
  return async (dispatch: Dispatch<TasksActionTypes>) => {
    dispatch({
      type: BATCH_RUN_AGGREGATING_TASKS_BEGIN,
      queue,
      group,
      taskIds,
    });
    try {
      const response = await batchRunAggregatingTasks(queue, group, taskIds);
      dispatch({
        type: BATCH_RUN_AGGREGATING_TASKS_SUCCESS,
        payload: response,
        queue,
        group,
      });
    } catch (error) {
      console.error(
        "batchRunAggregatingTasksAsync: ",
        toErrorStringWithHttpStatus(error)
      );
      dispatch({
        type: BATCH_RUN_AGGREGATING_TASKS_ERROR,
        error: toErrorString(error),
        queue,
        group,
        taskIds,
      });
    }
  };
}

export function batchArchiveRetryTasksAsync(queue: string, taskIds: string[]) {
  return async (dispatch: Dispatch<TasksActionTypes>) => {
    dispatch({ type: BATCH_ARCHIVE_RETRY_TASKS_BEGIN, queue, taskIds });
    try {
      const response = await batchArchiveRetryTasks(queue, taskIds);
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
        taskIds,
      });
    }
  };
}

export function deleteAllRetryTasksAsync(queue: string) {
  return async (dispatch: Dispatch<TasksActionTypes>) => {
    dispatch({ type: DELETE_ALL_RETRY_TASKS_BEGIN, queue });
    try {
      const response = await deleteAllRetryTasks(queue);
      dispatch({
        type: DELETE_ALL_RETRY_TASKS_SUCCESS,
        deleted: response.deleted,
        queue,
      });
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

export function deleteArchivedTaskAsync(queue: string, taskId: string) {
  return async (dispatch: Dispatch<TasksActionTypes>) => {
    dispatch({ type: DELETE_ARCHIVED_TASK_BEGIN, queue, taskId });
    try {
      await deleteArchivedTask(queue, taskId);
      dispatch({ type: DELETE_ARCHIVED_TASK_SUCCESS, queue, taskId });
    } catch (error) {
      console.error(
        "deleteArchivedTaskAsync: ",
        toErrorStringWithHttpStatus(error)
      );
      dispatch({
        type: DELETE_ARCHIVED_TASK_ERROR,
        error: toErrorString(error),
        queue,
        taskId,
      });
    }
  };
}

export function batchDeleteArchivedTasksAsync(
  queue: string,
  taskIds: string[]
) {
  return async (dispatch: Dispatch<TasksActionTypes>) => {
    dispatch({ type: BATCH_DELETE_ARCHIVED_TASKS_BEGIN, queue, taskIds });
    try {
      const response = await batchDeleteArchivedTasks(queue, taskIds);
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
        taskIds,
      });
    }
  };
}

export function batchRunArchivedTasksAsync(queue: string, taskIds: string[]) {
  return async (dispatch: Dispatch<TasksActionTypes>) => {
    dispatch({ type: BATCH_RUN_ARCHIVED_TASKS_BEGIN, queue, taskIds });
    try {
      const response = await batchRunArchivedTasks(queue, taskIds);
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
        taskIds,
      });
    }
  };
}

export function deleteAllArchivedTasksAsync(queue: string) {
  return async (dispatch: Dispatch<TasksActionTypes>) => {
    dispatch({ type: DELETE_ALL_ARCHIVED_TASKS_BEGIN, queue });
    try {
      const response = await deleteAllArchivedTasks(queue);
      dispatch({
        type: DELETE_ALL_ARCHIVED_TASKS_SUCCESS,
        deleted: response.deleted,
        queue,
      });
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

export function deleteCompletedTaskAsync(queue: string, taskId: string) {
  return async (dispatch: Dispatch<TasksActionTypes>) => {
    dispatch({ type: DELETE_COMPLETED_TASK_BEGIN, queue, taskId });
    try {
      await deleteCompletedTask(queue, taskId);
      dispatch({ type: DELETE_COMPLETED_TASK_SUCCESS, queue, taskId });
    } catch (error) {
      console.error(
        "deleteCompletedTaskAsync: ",
        toErrorStringWithHttpStatus(error)
      );
      dispatch({
        type: DELETE_COMPLETED_TASK_ERROR,
        error: toErrorString(error),
        queue,
        taskId,
      });
    }
  };
}

export function batchDeleteCompletedTasksAsync(
  queue: string,
  taskIds: string[]
) {
  return async (dispatch: Dispatch<TasksActionTypes>) => {
    dispatch({ type: BATCH_DELETE_COMPLETED_TASKS_BEGIN, queue, taskIds });
    try {
      const response = await batchDeleteCompletedTasks(queue, taskIds);
      dispatch({
        type: BATCH_DELETE_COMPLETED_TASKS_SUCCESS,
        queue: queue,
        payload: response,
      });
    } catch (error) {
      console.error(
        "batchDeleteCompletedTasksAsync: ",
        toErrorStringWithHttpStatus(error)
      );
      dispatch({
        type: BATCH_DELETE_COMPLETED_TASKS_ERROR,
        error: toErrorString(error),
        queue,
        taskIds,
      });
    }
  };
}

export function batchDeleteAggregatingTasksAsync(
  queue: string,
  group: string,
  taskIds: string[]
) {
  return async (dispatch: Dispatch<TasksActionTypes>) => {
    dispatch({
      type: BATCH_DELETE_AGGREGATING_TASKS_BEGIN,
      queue,
      group,
      taskIds,
    });
    try {
      const response = await batchDeleteAggregatingTasks(queue, group, taskIds);
      dispatch({
        type: BATCH_DELETE_AGGREGATING_TASKS_SUCCESS,
        payload: response,
        queue,
        group,
      });
    } catch (error) {
      console.error(
        "batchDeleteAggregatingTasksAsync: ",
        toErrorStringWithHttpStatus(error)
      );
      dispatch({
        type: BATCH_DELETE_AGGREGATING_TASKS_ERROR,
        error: toErrorString(error),
        queue,
        group,
        taskIds,
      });
    }
  };
}

export function deleteAllCompletedTasksAsync(queue: string) {
  return async (dispatch: Dispatch<TasksActionTypes>) => {
    dispatch({ type: DELETE_ALL_COMPLETED_TASKS_BEGIN, queue });
    try {
      const response = await deleteAllCompletedTasks(queue);
      dispatch({
        type: DELETE_ALL_COMPLETED_TASKS_SUCCESS,
        deleted: response.deleted,
        queue,
      });
    } catch (error) {
      console.error(
        "deleteAllCompletedTasksAsync: ",
        toErrorStringWithHttpStatus(error)
      );
      dispatch({
        type: DELETE_ALL_COMPLETED_TASKS_ERROR,
        error: toErrorString(error),
        queue,
      });
    }
  };
}
