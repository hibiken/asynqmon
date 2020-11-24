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
} from "../actions/tasksActions";
import {
  ActiveTask,
  DeadTask,
  PendingTask,
  RetryTask,
  ScheduledTask,
} from "../api";

interface TasksState {
  activeTasks: {
    loading: boolean;
    error: string;
    data: ActiveTask[];
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
    data: RetryTask[];
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
          data: action.payload.tasks,
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
          data: action.payload.tasks,
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

    default:
      return state;
  }
}

export default tasksReducer;
