import {
  CLOSE_SNACKBAR,
  SnackbarActionTypes,
} from "../actions/snackbarActions";
import {
  BATCH_DELETE_DEAD_TASKS_SUCCESS,
  BATCH_DELETE_RETRY_TASKS_SUCCESS,
  BATCH_DELETE_SCHEDULED_TASKS_SUCCESS,
  BATCH_KILL_RETRY_TASKS_SUCCESS,
  BATCH_KILL_SCHEDULED_TASKS_SUCCESS,
  BATCH_RUN_DEAD_TASKS_SUCCESS,
  BATCH_RUN_RETRY_TASKS_SUCCESS,
  BATCH_RUN_SCHEDULED_TASKS_SUCCESS,
  DELETE_ALL_DEAD_TASKS_SUCCESS,
  DELETE_ALL_RETRY_TASKS_SUCCESS,
  DELETE_ALL_SCHEDULED_TASKS_SUCCESS,
  DELETE_DEAD_TASK_SUCCESS,
  DELETE_RETRY_TASK_SUCCESS,
  DELETE_SCHEDULED_TASK_SUCCESS,
  KILL_ALL_RETRY_TASKS_SUCCESS,
  KILL_ALL_SCHEDULED_TASKS_SUCCESS,
  KILL_RETRY_TASK_SUCCESS,
  KILL_SCHEDULED_TASK_SUCCESS,
  RUN_ALL_DEAD_TASKS_SUCCESS,
  RUN_ALL_RETRY_TASKS_SUCCESS,
  RUN_ALL_SCHEDULED_TASKS_SUCCESS,
  RUN_DEAD_TASK_SUCCESS,
  RUN_RETRY_TASK_SUCCESS,
  RUN_SCHEDULED_TASK_SUCCESS,
  TasksActionTypes,
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

    case RUN_DEAD_TASK_SUCCESS:
      return {
        isOpen: true,
        message: `Dead task is now pending`,
      };

    case KILL_SCHEDULED_TASK_SUCCESS:
      return {
        isOpen: true,
        message: `Scheduled task is now dead`,
      };

    case KILL_RETRY_TASK_SUCCESS:
      return {
        isOpen: true,
        message: `Retry task is now dead`,
      };

    case DELETE_SCHEDULED_TASK_SUCCESS:
      return {
        isOpen: true,
        message: `Scheduled task deleted`,
      };

    case BATCH_RUN_SCHEDULED_TASKS_SUCCESS: {
      const n = action.payload.pending_keys.length;
      return {
        isOpen: true,
        message: `${n} scheduled ${
          n === 1 ? "task is" : "tasks are"
        } now pending`,
      };
    }

    case BATCH_KILL_SCHEDULED_TASKS_SUCCESS: {
      const n = action.payload.dead_keys.length;
      return {
        isOpen: true,
        message: `${n} scheduled ${n === 1 ? "task is" : "tasks are"} now dead`,
      };
    }

    case BATCH_DELETE_SCHEDULED_TASKS_SUCCESS: {
      const n = action.payload.deleted_keys.length;
      return {
        isOpen: true,
        message: `${n} scheduled ${n === 1 ? "task" : "tasks"} deleted`,
      };
    }

    case RUN_ALL_SCHEDULED_TASKS_SUCCESS:
      return {
        isOpen: true,
        message: "All scheduled tasks are now pending",
      };

    case KILL_ALL_SCHEDULED_TASKS_SUCCESS:
      return {
        isOpen: true,
        message: "All scheduled tasks are now dead",
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
      const n = action.payload.pending_keys.length;
      return {
        isOpen: true,
        message: `${n} retry ${n === 1 ? "task is" : "tasks are"} now pending`,
      };
    }

    case BATCH_KILL_RETRY_TASKS_SUCCESS: {
      const n = action.payload.dead_keys.length;
      return {
        isOpen: true,
        message: `${n} retry ${n === 1 ? "task is" : "tasks are"} now dead`,
      };
    }

    case BATCH_DELETE_RETRY_TASKS_SUCCESS: {
      const n = action.payload.deleted_keys.length;
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

    case KILL_ALL_RETRY_TASKS_SUCCESS:
      return {
        isOpen: true,
        message: "All retry tasks are now dead",
      };

    case DELETE_ALL_RETRY_TASKS_SUCCESS:
      return {
        isOpen: true,
        message: "All retry tasks deleted",
      };

    case DELETE_DEAD_TASK_SUCCESS:
      return {
        isOpen: true,
        message: `Dead task deleted`,
      };

    case BATCH_RUN_DEAD_TASKS_SUCCESS: {
      const n = action.payload.pending_keys.length;
      return {
        isOpen: true,
        message: `${n} dead ${n === 1 ? "task is" : "tasks are"} now pending`,
      };
    }

    case BATCH_DELETE_DEAD_TASKS_SUCCESS: {
      const n = action.payload.deleted_keys.length;
      return {
        isOpen: true,
        message: `${n} dead ${n === 1 ? "task" : "tasks"} deleted`,
      };
    }

    case RUN_ALL_DEAD_TASKS_SUCCESS:
      return {
        isOpen: true,
        message: "All dead tasks are now pending",
      };

    case DELETE_ALL_DEAD_TASKS_SUCCESS:
      return {
        isOpen: true,
        message: "All dead tasks deleted",
      };

    default:
      return state;
  }
}

export default snackbarReducer;
