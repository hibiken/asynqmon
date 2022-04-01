import {
  CLOSE_SNACKBAR,
  SnackbarActionTypes,
} from "../actions/snackbarActions";
import {
  BATCH_CANCEL_ACTIVE_TASKS_SUCCESS,
  BATCH_DELETE_ARCHIVED_TASKS_SUCCESS,
  BATCH_DELETE_RETRY_TASKS_SUCCESS,
  BATCH_DELETE_SCHEDULED_TASKS_SUCCESS,
  BATCH_ARCHIVE_RETRY_TASKS_SUCCESS,
  BATCH_ARCHIVE_SCHEDULED_TASKS_SUCCESS,
  BATCH_RUN_ARCHIVED_TASKS_SUCCESS,
  BATCH_RUN_RETRY_TASKS_SUCCESS,
  BATCH_RUN_SCHEDULED_TASKS_SUCCESS,
  CANCEL_ALL_ACTIVE_TASKS_SUCCESS,
  DELETE_ALL_ARCHIVED_TASKS_SUCCESS,
  DELETE_ALL_RETRY_TASKS_SUCCESS,
  DELETE_ALL_SCHEDULED_TASKS_SUCCESS,
  DELETE_ARCHIVED_TASK_SUCCESS,
  DELETE_RETRY_TASK_SUCCESS,
  DELETE_SCHEDULED_TASK_SUCCESS,
  ARCHIVE_ALL_RETRY_TASKS_SUCCESS,
  ARCHIVE_ALL_SCHEDULED_TASKS_SUCCESS,
  ARCHIVE_RETRY_TASK_SUCCESS,
  ARCHIVE_SCHEDULED_TASK_SUCCESS,
  RUN_ALL_ARCHIVED_TASKS_SUCCESS,
  RUN_ALL_RETRY_TASKS_SUCCESS,
  RUN_ALL_SCHEDULED_TASKS_SUCCESS,
  RUN_ARCHIVED_TASK_SUCCESS,
  RUN_RETRY_TASK_SUCCESS,
  RUN_SCHEDULED_TASK_SUCCESS,
  TasksActionTypes,
  ARCHIVE_PENDING_TASK_SUCCESS,
  DELETE_PENDING_TASK_SUCCESS,
  BATCH_ARCHIVE_PENDING_TASKS_SUCCESS,
  BATCH_DELETE_PENDING_TASKS_SUCCESS,
  ARCHIVE_ALL_PENDING_TASKS_SUCCESS,
  DELETE_ALL_PENDING_TASKS_SUCCESS,
  DELETE_COMPLETED_TASK_SUCCESS,
  DELETE_ALL_COMPLETED_TASKS_SUCCESS,
  BATCH_DELETE_COMPLETED_TASKS_SUCCESS,
  RUN_AGGREGATING_TASK_SUCCESS,
  ARCHIVE_AGGREGATING_TASK_SUCCESS,
  DELETE_AGGREGATING_TASK_SUCCESS,
  BATCH_RUN_AGGREGATING_TASKS_SUCCESS,
  BATCH_ARCHIVE_AGGREGATING_TASKS_SUCCESS,
  BATCH_DELETE_AGGREGATING_TASKS_SUCCESS,
  RUN_ALL_AGGREGATING_TASKS_SUCCESS,
  ARCHIVE_ALL_AGGREGATING_TASKS_SUCCESS,
  DELETE_ALL_AGGREGATING_TASKS_SUCCESS,
} from "../actions/tasksActions";

interface SnackbarState {
  isOpen: boolean;
  message: string;
}

const initialState: SnackbarState = {
  isOpen: false,
  message: "",
};

function snackbarReducer(
  state = initialState,
  action: TasksActionTypes | SnackbarActionTypes
): SnackbarState {
  switch (action.type) {
    case CLOSE_SNACKBAR:
      return {
        // Note: We keep the message state unchanged for
        // smoother transition animation.
        ...state,
        isOpen: false,
      };

    case BATCH_CANCEL_ACTIVE_TASKS_SUCCESS: {
      const n = action.payload.canceled_ids.length;
      return {
        isOpen: true,
        message: `Cancelation signal sent to ${n} ${
          n === 1 ? "task" : "tasks"
        }`,
      };
    }

    case CANCEL_ALL_ACTIVE_TASKS_SUCCESS:
      return {
        isOpen: true,
        message: `Cancelation signal sent to all tasks in ${action.queue} queue`,
      };

    case RUN_SCHEDULED_TASK_SUCCESS:
      return {
        isOpen: true,
        message: `Scheduled task is now pending`,
      };

    case RUN_RETRY_TASK_SUCCESS:
      return {
        isOpen: true,
        message: `Retry task is now pending`,
      };

    case RUN_ARCHIVED_TASK_SUCCESS:
      return {
        isOpen: true,
        message: `Archived task is now pending`,
      };

    case RUN_AGGREGATING_TASK_SUCCESS:
      return {
        isOpen: true,
        message: `Aggregating task is now pending`,
      };

    case ARCHIVE_PENDING_TASK_SUCCESS:
      return {
        isOpen: true,
        message: `Pending task is now archived`,
      };

    case ARCHIVE_SCHEDULED_TASK_SUCCESS:
      return {
        isOpen: true,
        message: `Scheduled task is now archived`,
      };

    case ARCHIVE_RETRY_TASK_SUCCESS:
      return {
        isOpen: true,
        message: `Retry task is now archived`,
      };

    case ARCHIVE_AGGREGATING_TASK_SUCCESS:
      return {
        isOpen: true,
        message: `Aggregating task is now archived`,
      };

    case DELETE_PENDING_TASK_SUCCESS:
      return {
        isOpen: true,
        message: `Pending task deleted`,
      };

    case DELETE_SCHEDULED_TASK_SUCCESS:
      return {
        isOpen: true,
        message: `Scheduled task deleted`,
      };

    case DELETE_AGGREGATING_TASK_SUCCESS:
      return {
        isOpen: true,
        message: `Aggregating task deleted`,
      };

    case BATCH_RUN_SCHEDULED_TASKS_SUCCESS: {
      const n = action.payload.pending_ids.length;
      return {
        isOpen: true,
        message: `${n} scheduled ${
          n === 1 ? "task is" : "tasks are"
        } now pending`,
      };
    }

    case BATCH_RUN_AGGREGATING_TASKS_SUCCESS: {
      const n = action.payload.pending_ids.length;
      return {
        isOpen: true,
        message: `${n} aggregating ${
          n === 1 ? "task is" : "tasks are"
        } now pending`,
      };
    }

    case BATCH_ARCHIVE_AGGREGATING_TASKS_SUCCESS: {
      const n = action.payload.archived_ids.length;
      return {
        isOpen: true,
        message: `${n} aggregating ${
          n === 1 ? "task is" : "tasks are"
        } now archived`,
      };
    }

    case BATCH_DELETE_AGGREGATING_TASKS_SUCCESS: {
      const n = action.payload.deleted_ids.length;
      return {
        isOpen: true,
        message: `${n} aggregating ${n === 1 ? "task" : "tasks"} deleted`,
      };
    }

    case BATCH_ARCHIVE_PENDING_TASKS_SUCCESS: {
      const n = action.payload.archived_ids.length;
      return {
        isOpen: true,
        message: `${n} pending ${
          n === 1 ? "task is" : "tasks are"
        } now archived`,
      };
    }

    case BATCH_DELETE_PENDING_TASKS_SUCCESS: {
      const n = action.payload.deleted_ids.length;
      return {
        isOpen: true,
        message: `${n} pending ${n === 1 ? "task" : "tasks"} deleted`,
      };
    }

    case BATCH_ARCHIVE_SCHEDULED_TASKS_SUCCESS: {
      const n = action.payload.archived_ids.length;
      return {
        isOpen: true,
        message: `${n} scheduled ${
          n === 1 ? "task is" : "tasks are"
        } now archived`,
      };
    }

    case BATCH_DELETE_SCHEDULED_TASKS_SUCCESS: {
      const n = action.payload.deleted_ids.length;
      return {
        isOpen: true,
        message: `${n} scheduled ${n === 1 ? "task" : "tasks"} deleted`,
      };
    }

    case ARCHIVE_ALL_PENDING_TASKS_SUCCESS:
      return {
        isOpen: true,
        message: "All pending tasks are now archived",
      };

    case DELETE_ALL_PENDING_TASKS_SUCCESS:
      return {
        isOpen: true,
        message: "All pending tasks deleted",
      };

    case RUN_ALL_AGGREGATING_TASKS_SUCCESS:
      return {
        isOpen: true,
        message: `All tasks in group ${action.group}  are now pending`,
      };

    case ARCHIVE_ALL_AGGREGATING_TASKS_SUCCESS:
      return {
        isOpen: true,
        message: `All tasks in group ${action.group} are now archived`,
      };

    case DELETE_ALL_AGGREGATING_TASKS_SUCCESS:
      return {
        isOpen: true,
        message: `All tasks in group ${action.group} deleted`,
      };

    case RUN_ALL_SCHEDULED_TASKS_SUCCESS:
      return {
        isOpen: true,
        message: "All scheduled tasks are now pending",
      };

    case ARCHIVE_ALL_SCHEDULED_TASKS_SUCCESS:
      return {
        isOpen: true,
        message: "All scheduled tasks are now archived",
      };

    case DELETE_ALL_SCHEDULED_TASKS_SUCCESS:
      return {
        isOpen: true,
        message: "All scheduled tasks deleted",
      };

    case DELETE_RETRY_TASK_SUCCESS:
      return {
        isOpen: true,
        message: `Retry task deleted`,
      };

    case BATCH_RUN_RETRY_TASKS_SUCCESS: {
      const n = action.payload.pending_ids.length;
      return {
        isOpen: true,
        message: `${n} retry ${n === 1 ? "task is" : "tasks are"} now pending`,
      };
    }

    case BATCH_ARCHIVE_RETRY_TASKS_SUCCESS: {
      const n = action.payload.archived_ids.length;
      return {
        isOpen: true,
        message: `${n} retry ${n === 1 ? "task is" : "tasks are"} now archived`,
      };
    }

    case BATCH_DELETE_RETRY_TASKS_SUCCESS: {
      const n = action.payload.deleted_ids.length;
      return {
        isOpen: true,
        message: `${n} retry ${n === 1 ? "task" : "tasks"} deleted`,
      };
    }

    case RUN_ALL_RETRY_TASKS_SUCCESS:
      return {
        isOpen: true,
        message: "All retry tasks are now pending",
      };

    case ARCHIVE_ALL_RETRY_TASKS_SUCCESS:
      return {
        isOpen: true,
        message: "All retry tasks are now archived",
      };

    case DELETE_ALL_RETRY_TASKS_SUCCESS:
      return {
        isOpen: true,
        message: "All retry tasks deleted",
      };

    case DELETE_ARCHIVED_TASK_SUCCESS:
      return {
        isOpen: true,
        message: `Archived task deleted`,
      };

    case BATCH_RUN_ARCHIVED_TASKS_SUCCESS: {
      const n = action.payload.pending_ids.length;
      return {
        isOpen: true,
        message: `${n} archived ${
          n === 1 ? "task is" : "tasks are"
        } now pending`,
      };
    }

    case BATCH_DELETE_ARCHIVED_TASKS_SUCCESS: {
      const n = action.payload.deleted_ids.length;
      return {
        isOpen: true,
        message: `${n} archived ${n === 1 ? "task" : "tasks"} deleted`,
      };
    }

    case RUN_ALL_ARCHIVED_TASKS_SUCCESS:
      return {
        isOpen: true,
        message: "All archived tasks are now pending",
      };

    case DELETE_ALL_ARCHIVED_TASKS_SUCCESS:
      return {
        isOpen: true,
        message: "All archived tasks deleted",
      };

    case DELETE_COMPLETED_TASK_SUCCESS:
      return {
        isOpen: true,
        message: `Completed task deleted`,
      };

    case DELETE_ALL_COMPLETED_TASKS_SUCCESS:
      return {
        isOpen: true,
        message: "All completed tasks deleted",
      };

    case BATCH_DELETE_COMPLETED_TASKS_SUCCESS:
      const n = action.payload.deleted_ids.length;
      return {
        isOpen: true,
        message: `${n} completed ${n === 1 ? "task" : "tasks"} deleted`,
      };

    default:
      return state;
  }
}

export default snackbarReducer;
