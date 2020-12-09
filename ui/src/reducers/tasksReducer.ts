import {
  LIST_ACTIVE_TASKS_BEGIN,
  LIST_ACTIVE_TASKS_SUCCESS,
  LIST_ACTIVE_TASKS_ERROR,
  TasksActionTypes,
  LIST_PENDING_TASKS_BEGIN,
  LIST_PENDING_TASKS_SUCCESS,
  LIST_PENDING_TASKS_ERROR,
  LIST_SCHEDULED_TASKS_BEGIN,
  LIST_SCHEDULED_TASKS_SUCCESS,
  LIST_SCHEDULED_TASKS_ERROR,
  LIST_RETRY_TASKS_BEGIN,
  LIST_RETRY_TASKS_SUCCESS,
  LIST_RETRY_TASKS_ERROR,
  LIST_DEAD_TASKS_BEGIN,
  LIST_DEAD_TASKS_SUCCESS,
  LIST_DEAD_TASKS_ERROR,
  CANCEL_ACTIVE_TASK_BEGIN,
  CANCEL_ACTIVE_TASK_SUCCESS,
  CANCEL_ACTIVE_TASK_ERROR,
  DELETE_RETRY_TASK_BEGIN,
  DELETE_RETRY_TASK_SUCCESS,
  DELETE_RETRY_TASK_ERROR,
} from "../actions/tasksActions";
import {
  ActiveTask,
  DeadTask,
  PendingTask,
  RetryTask,
  ScheduledTask,
} from "../api";

export interface ActiveTaskExtended extends ActiveTask {
  // Indicates that a request has been sent for this
  // task and awaiting for a response.
  requestPending: boolean;

  // Incidates that a cancelation signal has been
  // published for this task.
  canceling: boolean;
}

export interface RetryTaskExtended extends RetryTask {
  // Indicates that a request has been sent for this
  // task and awaiting for a response.
  requestPending: boolean;
}

interface TasksState {
  activeTasks: {
    loading: boolean;
    error: string;
    data: ActiveTaskExtended[];
  };
  pendingTasks: {
    loading: boolean;
    error: string;
    data: PendingTask[];
  };
  scheduledTasks: {
    loading: boolean;
    error: string;
    data: ScheduledTask[];
  };
  retryTasks: {
    loading: boolean;
    error: string;
    data: RetryTaskExtended[];
  };
  deadTasks: {
    loading: boolean;
    error: string;
    data: DeadTask[];
  };
}

const initialState: TasksState = {
  activeTasks: {
    loading: false,
    error: "",
    data: [],
  },
  pendingTasks: {
    loading: false,
    error: "",
    data: [],
  },
  scheduledTasks: {
    loading: false,
    error: "",
    data: [],
  },
  retryTasks: {
    loading: false,
    error: "",
    data: [],
  },
  deadTasks: {
    loading: false,
    error: "",
    data: [],
  },
};

function tasksReducer(
  state = initialState,
  action: TasksActionTypes
): TasksState {
  switch (action.type) {
    case LIST_ACTIVE_TASKS_BEGIN:
      return {
        ...state,
        activeTasks: {
          ...state.activeTasks,
          error: "",
          loading: true,
        },
      };

    case LIST_ACTIVE_TASKS_SUCCESS:
      return {
        ...state,
        activeTasks: {
          loading: false,
          error: "",
          data: action.payload.tasks.map((task) => ({
            ...task,
            canceling: false,
            requestPending: false,
          })),
        },
      };

    case LIST_ACTIVE_TASKS_ERROR:
      return {
        ...state,
        activeTasks: {
          ...state.activeTasks,
          loading: false,
          error: action.error,
        },
      };

    case LIST_PENDING_TASKS_BEGIN:
      return {
        ...state,
        pendingTasks: {
          ...state.pendingTasks,
          error: "",
          loading: true,
        },
      };

    case LIST_PENDING_TASKS_SUCCESS:
      return {
        ...state,
        pendingTasks: {
          loading: false,
          error: "",
          data: action.payload.tasks,
        },
      };

    case LIST_PENDING_TASKS_ERROR:
      return {
        ...state,
        pendingTasks: {
          ...state.pendingTasks,
          loading: false,
          error: action.error,
        },
      };

    case LIST_SCHEDULED_TASKS_BEGIN:
      return {
        ...state,
        scheduledTasks: {
          ...state.scheduledTasks,
          error: "",
          loading: true,
        },
      };

    case LIST_SCHEDULED_TASKS_SUCCESS:
      return {
        ...state,
        scheduledTasks: {
          loading: false,
          error: "",
          data: action.payload.tasks,
        },
      };

    case LIST_SCHEDULED_TASKS_ERROR:
      return {
        ...state,
        scheduledTasks: {
          ...state.scheduledTasks,
          loading: false,
          error: action.error,
        },
      };

    case LIST_RETRY_TASKS_BEGIN:
      return {
        ...state,
        retryTasks: {
          ...state.retryTasks,
          error: "",
          loading: true,
        },
      };

    case LIST_RETRY_TASKS_SUCCESS:
      return {
        ...state,
        retryTasks: {
          loading: false,
          error: "",
          data: action.payload.tasks.map((task) => ({
            ...task,
            requestPending: false,
          })),
        },
      };

    case LIST_RETRY_TASKS_ERROR:
      return {
        ...state,
        retryTasks: {
          ...state.retryTasks,
          loading: false,
          error: action.error,
        },
      };

    case LIST_DEAD_TASKS_BEGIN:
      return {
        ...state,
        deadTasks: {
          ...state.deadTasks,
          error: "",
          loading: true,
        },
      };

    case LIST_DEAD_TASKS_SUCCESS:
      return {
        ...state,
        deadTasks: {
          loading: false,
          error: "",
          data: action.payload.tasks,
        },
      };

    case LIST_DEAD_TASKS_ERROR:
      return {
        ...state,
        deadTasks: {
          ...state.deadTasks,
          loading: false,
          error: action.error,
        },
      };

    case CANCEL_ACTIVE_TASK_BEGIN: {
      const newData = state.activeTasks.data.map((task) => {
        if (task.id !== action.taskId) {
          return task;
        }
        return { ...task, requestPending: true };
      });
      return {
        ...state,
        activeTasks: {
          ...state.activeTasks,
          data: newData,
        },
      };
    }

    case CANCEL_ACTIVE_TASK_SUCCESS: {
      const newData = state.activeTasks.data.map((task) => {
        if (task.id !== action.taskId) {
          return task;
        }
        return { ...task, requestPending: false, canceling: true };
      });
      return {
        ...state,
        activeTasks: {
          ...state.activeTasks,
          data: newData,
        },
      };
    }

    case CANCEL_ACTIVE_TASK_ERROR:
      const newData = state.activeTasks.data.map((task) => {
        if (task.id !== action.taskId) {
          return task;
        }
        return { ...task, requestPending: false };
      });
      return {
        ...state,
        activeTasks: {
          ...state.activeTasks,
          data: newData,
        },
      };

    case DELETE_RETRY_TASK_BEGIN:
      return {
        ...state,
        retryTasks: {
          ...state.retryTasks,
          data: state.retryTasks.data.map((task) => {
            if (task.key !== action.taskKey) {
              return task;
            }
            return { ...task, requestPending: true };
          }),
        },
      };

    case DELETE_RETRY_TASK_SUCCESS:
      return {
        ...state,
        retryTasks: {
          ...state.retryTasks,
          data: state.retryTasks.data.filter(
            (task) => task.key !== action.taskKey
          ),
        },
      };

    case DELETE_RETRY_TASK_ERROR:
      return {
        ...state,
        retryTasks: {
          ...state.retryTasks,
          data: state.retryTasks.data.map((task) => {
            if (task.key !== action.taskKey) {
              return task;
            }
            return { ...task, requestPending: false };
          }),
        },
      };

    default:
      return state;
  }
}

export default tasksReducer;
