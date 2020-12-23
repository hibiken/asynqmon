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
  DELETE_SCHEDULED_TASK_BEGIN,
  DELETE_SCHEDULED_TASK_SUCCESS,
  DELETE_SCHEDULED_TASK_ERROR,
  DELETE_DEAD_TASK_BEGIN,
  DELETE_DEAD_TASK_SUCCESS,
  DELETE_DEAD_TASK_ERROR,
  BATCH_DELETE_DEAD_TASKS_BEGIN,
  BATCH_DELETE_DEAD_TASKS_SUCCESS,
  BATCH_DELETE_DEAD_TASKS_ERROR,
  RUN_DEAD_TASK_BEGIN,
  RUN_DEAD_TASK_SUCCESS,
  RUN_DEAD_TASK_ERROR,
  BATCH_RUN_DEAD_TASKS_BEGIN,
  BATCH_RUN_DEAD_TASKS_ERROR,
  BATCH_RUN_DEAD_TASKS_SUCCESS,
  DELETE_ALL_DEAD_TASKS_BEGIN,
  DELETE_ALL_DEAD_TASKS_SUCCESS,
  DELETE_ALL_DEAD_TASKS_ERROR,
  RUN_ALL_DEAD_TASKS_BEGIN,
  RUN_ALL_DEAD_TASKS_ERROR,
  RUN_ALL_DEAD_TASKS_SUCCESS,
  BATCH_DELETE_RETRY_TASKS_ERROR,
  BATCH_RUN_RETRY_TASKS_ERROR,
  BATCH_DELETE_RETRY_TASKS_SUCCESS,
  BATCH_RUN_RETRY_TASKS_SUCCESS,
  BATCH_DELETE_RETRY_TASKS_BEGIN,
  BATCH_RUN_RETRY_TASKS_BEGIN,
  DELETE_ALL_RETRY_TASKS_ERROR,
  RUN_ALL_RETRY_TASKS_ERROR,
  DELETE_ALL_RETRY_TASKS_SUCCESS,
  RUN_ALL_RETRY_TASKS_SUCCESS,
  DELETE_ALL_RETRY_TASKS_BEGIN,
  RUN_ALL_RETRY_TASKS_BEGIN,
  BATCH_DELETE_SCHEDULED_TASKS_ERROR,
  BATCH_RUN_SCHEDULED_TASKS_ERROR,
  BATCH_DELETE_SCHEDULED_TASKS_SUCCESS,
  BATCH_RUN_SCHEDULED_TASKS_SUCCESS,
  BATCH_DELETE_SCHEDULED_TASKS_BEGIN,
  BATCH_RUN_SCHEDULED_TASKS_BEGIN,
  DELETE_ALL_SCHEDULED_TASKS_ERROR,
  RUN_ALL_SCHEDULED_TASKS_ERROR,
  DELETE_ALL_SCHEDULED_TASKS_SUCCESS,
  RUN_ALL_SCHEDULED_TASKS_SUCCESS,
  DELETE_ALL_SCHEDULED_TASKS_BEGIN,
  RUN_ALL_SCHEDULED_TASKS_BEGIN,
  RUN_RETRY_TASK_BEGIN,
  RUN_RETRY_TASK_SUCCESS,
  RUN_RETRY_TASK_ERROR,
  RUN_SCHEDULED_TASK_BEGIN,
  RUN_SCHEDULED_TASK_SUCCESS,
  RUN_SCHEDULED_TASK_ERROR,
  KILL_SCHEDULED_TASK_BEGIN,
  KILL_SCHEDULED_TASK_SUCCESS,
  KILL_SCHEDULED_TASK_ERROR,
  KILL_ALL_SCHEDULED_TASKS_BEGIN,
  KILL_ALL_SCHEDULED_TASKS_SUCCESS,
  KILL_ALL_SCHEDULED_TASKS_ERROR,
  BATCH_KILL_SCHEDULED_TASKS_BEGIN,
  BATCH_KILL_SCHEDULED_TASKS_ERROR,
  BATCH_KILL_SCHEDULED_TASKS_SUCCESS,
  KILL_RETRY_TASK_BEGIN,
  KILL_RETRY_TASK_SUCCESS,
  KILL_RETRY_TASK_ERROR,
  KILL_ALL_RETRY_TASKS_BEGIN,
  KILL_ALL_RETRY_TASKS_SUCCESS,
  KILL_ALL_RETRY_TASKS_ERROR,
  BATCH_KILL_RETRY_TASKS_SUCCESS,
  BATCH_KILL_RETRY_TASKS_BEGIN,
  BATCH_KILL_RETRY_TASKS_ERROR,
  BATCH_CANCEL_ACTIVE_TASKS_BEGIN,
  BATCH_CANCEL_ACTIVE_TASKS_SUCCESS,
  BATCH_CANCEL_ACTIVE_TASKS_ERROR,
  CANCEL_ALL_ACTIVE_TASKS_BEGIN,
  CANCEL_ALL_ACTIVE_TASKS_SUCCESS,
  CANCEL_ALL_ACTIVE_TASKS_ERROR,
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

export interface ScheduledTaskExtended extends ScheduledTask {
  // Indicates that a request has been sent for this
  // task and awaiting for a response.
  requestPending: boolean;
}

export interface RetryTaskExtended extends RetryTask {
  // Indicates that a request has been sent for this
  // task and awaiting for a response.
  requestPending: boolean;
}

export interface DeadTaskExtended extends DeadTask {
  // Indicates that a request has been sent for this
  // task and awaiting for a response.
  requestPending: boolean;
}

interface TasksState {
  activeTasks: {
    loading: boolean;
    batchActionPending: boolean;
    allActionPending: boolean;
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
    batchActionPending: boolean;
    allActionPending: boolean;
    error: string;
    data: ScheduledTaskExtended[];
  };
  retryTasks: {
    loading: boolean;
    batchActionPending: boolean;
    allActionPending: boolean;
    error: string;
    data: RetryTaskExtended[];
  };
  deadTasks: {
    loading: boolean;
    batchActionPending: boolean;
    allActionPending: boolean;
    error: string;
    data: DeadTaskExtended[];
  };
}

const initialState: TasksState = {
  activeTasks: {
    loading: false,
    batchActionPending: false,
    allActionPending: false,
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
    batchActionPending: false,
    allActionPending: false,
    error: "",
    data: [],
  },
  retryTasks: {
    loading: false,
    batchActionPending: false,
    allActionPending: false,
    error: "",
    data: [],
  },
  deadTasks: {
    loading: false,
    batchActionPending: false,
    allActionPending: false,
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
          ...state.activeTasks,
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
          ...state.scheduledTasks,
          loading: false,
          error: "",
          data: action.payload.tasks.map((task) => ({
            ...task,
            requestPending: false,
          })),
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
          ...state.retryTasks,
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
          ...state.deadTasks,
          loading: false,
          error: "",
          data: action.payload.tasks.map((task) => ({
            ...task,
            requestPending: false,
          })),
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

    case BATCH_CANCEL_ACTIVE_TASKS_BEGIN: {
      const newData = state.activeTasks.data.map((task) => {
        if (!action.taskIds.includes(task.id)) {
          return task;
        }
        return { ...task, requestPending: true };
      });
      return {
        ...state,
        activeTasks: {
          ...state.activeTasks,
          batchActionPending: true,
          data: newData,
        },
      };
    }

    case BATCH_CANCEL_ACTIVE_TASKS_SUCCESS: {
      const newData = state.activeTasks.data.map((task) => {
        if (action.payload.canceled_ids.includes(task.id)) {
          return { ...task, canceling: true, requestPending: false };
        }
        if (action.payload.error_ids.includes(task.id)) {
          return { ...task, requestPending: false };
        }
        return task;
      });
      return {
        ...state,
        activeTasks: {
          ...state.activeTasks,
          batchActionPending: false,
          data: newData,
        },
      };
    }

    case BATCH_CANCEL_ACTIVE_TASKS_ERROR: {
      const newData = state.activeTasks.data.map((task) => {
        return { ...task, requestPending: false };
      });
      return {
        ...state,
        activeTasks: {
          ...state.activeTasks,
          batchActionPending: false,
          data: newData,
        },
      };
    }

    case CANCEL_ALL_ACTIVE_TASKS_BEGIN: {
      const newData = state.activeTasks.data.map((task) => ({
        ...task,
        requestPending: true,
      }));
      return {
        ...state,
        activeTasks: {
          ...state.activeTasks,
          allActionPending: true,
          data: newData,
        },
      };
    }

    case CANCEL_ALL_ACTIVE_TASKS_SUCCESS: {
      const newData = state.activeTasks.data.map((task) => ({
        ...task,
        requestPending: false,
        canceling: true,
      }));
      return {
        ...state,
        activeTasks: {
          ...state.activeTasks,
          allActionPending: false,
          data: newData,
        },
      };
    }

    case CANCEL_ALL_ACTIVE_TASKS_ERROR: {
      const newData = state.activeTasks.data.map((task) => ({
        ...task,
        requestPending: false,
      }));
      return {
        ...state,
        activeTasks: {
          ...state.activeTasks,
          allActionPending: false,
          data: newData,
        },
      };
    }

    case RUN_SCHEDULED_TASK_BEGIN:
    case KILL_SCHEDULED_TASK_BEGIN:
    case DELETE_SCHEDULED_TASK_BEGIN:
      return {
        ...state,
        scheduledTasks: {
          ...state.scheduledTasks,
          data: state.scheduledTasks.data.map((task) => {
            if (task.key !== action.taskKey) {
              return task;
            }
            return { ...task, requestPending: true };
          }),
        },
      };

    case RUN_SCHEDULED_TASK_SUCCESS:
    case KILL_SCHEDULED_TASK_SUCCESS:
    case DELETE_SCHEDULED_TASK_SUCCESS:
      return {
        ...state,
        scheduledTasks: {
          ...state.scheduledTasks,
          data: state.scheduledTasks.data.filter(
            (task) => task.key !== action.taskKey
          ),
        },
      };

    case RUN_SCHEDULED_TASK_ERROR:
    case KILL_SCHEDULED_TASK_ERROR:
    case DELETE_SCHEDULED_TASK_ERROR:
      return {
        ...state,
        scheduledTasks: {
          ...state.scheduledTasks,
          data: state.scheduledTasks.data.map((task) => {
            if (task.key !== action.taskKey) {
              return task;
            }
            return { ...task, requestPending: false };
          }),
        },
      };

    case RUN_ALL_SCHEDULED_TASKS_BEGIN:
    case KILL_ALL_SCHEDULED_TASKS_BEGIN:
    case DELETE_ALL_SCHEDULED_TASKS_BEGIN:
      return {
        ...state,
        scheduledTasks: {
          ...state.scheduledTasks,
          allActionPending: true,
        },
      };

    case RUN_ALL_SCHEDULED_TASKS_SUCCESS:
    case KILL_ALL_SCHEDULED_TASKS_SUCCESS:
    case DELETE_ALL_SCHEDULED_TASKS_SUCCESS:
      return {
        ...state,
        scheduledTasks: {
          ...state.scheduledTasks,
          allActionPending: false,
          data: [],
        },
      };

    case RUN_ALL_SCHEDULED_TASKS_ERROR:
    case KILL_ALL_SCHEDULED_TASKS_ERROR:
    case DELETE_ALL_SCHEDULED_TASKS_ERROR:
      return {
        ...state,
        scheduledTasks: {
          ...state.scheduledTasks,
          allActionPending: false,
        },
      };

    case BATCH_RUN_SCHEDULED_TASKS_BEGIN:
    case BATCH_KILL_SCHEDULED_TASKS_BEGIN:
    case BATCH_DELETE_SCHEDULED_TASKS_BEGIN:
      return {
        ...state,
        scheduledTasks: {
          ...state.scheduledTasks,
          batchActionPending: true,
          data: state.scheduledTasks.data.map((task) => {
            if (!action.taskKeys.includes(task.key)) {
              return task;
            }
            return {
              ...task,
              requestPending: true,
            };
          }),
        },
      };

    case BATCH_RUN_SCHEDULED_TASKS_SUCCESS: {
      const newData = state.scheduledTasks.data.filter(
        (task) => !action.payload.pending_keys.includes(task.key)
      );
      return {
        ...state,
        scheduledTasks: {
          ...state.scheduledTasks,
          batchActionPending: false,
          data: newData,
        },
      };
    }

    case BATCH_KILL_SCHEDULED_TASKS_SUCCESS: {
      const newData = state.scheduledTasks.data.filter(
        (task) => !action.payload.dead_keys.includes(task.key)
      );
      return {
        ...state,
        scheduledTasks: {
          ...state.scheduledTasks,
          batchActionPending: false,
          data: newData,
        },
      };
    }

    case BATCH_DELETE_SCHEDULED_TASKS_SUCCESS: {
      const newData = state.scheduledTasks.data.filter(
        (task) => !action.payload.deleted_keys.includes(task.key)
      );
      return {
        ...state,
        scheduledTasks: {
          ...state.scheduledTasks,
          batchActionPending: false,
          data: newData,
        },
      };
    }

    case BATCH_RUN_SCHEDULED_TASKS_ERROR:
    case BATCH_KILL_SCHEDULED_TASKS_ERROR:
    case BATCH_DELETE_SCHEDULED_TASKS_ERROR:
      return {
        ...state,
        scheduledTasks: {
          ...state.scheduledTasks,
          batchActionPending: false,
          data: state.scheduledTasks.data.map((task) => {
            if (!action.taskKeys.includes(task.key)) {
              return task;
            }
            return {
              ...task,
              requestPending: false,
            };
          }),
        },
      };

    case RUN_RETRY_TASK_BEGIN:
    case KILL_RETRY_TASK_BEGIN:
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

    case RUN_RETRY_TASK_SUCCESS:
    case KILL_RETRY_TASK_SUCCESS:
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

    case RUN_RETRY_TASK_ERROR:
    case KILL_RETRY_TASK_ERROR:
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

    case RUN_ALL_RETRY_TASKS_BEGIN:
    case KILL_ALL_RETRY_TASKS_BEGIN:
    case DELETE_ALL_RETRY_TASKS_BEGIN:
      return {
        ...state,
        retryTasks: {
          ...state.retryTasks,
          allActionPending: true,
        },
      };

    case RUN_ALL_RETRY_TASKS_SUCCESS:
    case KILL_ALL_RETRY_TASKS_SUCCESS:
    case DELETE_ALL_RETRY_TASKS_SUCCESS:
      return {
        ...state,
        retryTasks: {
          ...state.retryTasks,
          allActionPending: false,
          data: [],
        },
      };

    case RUN_ALL_RETRY_TASKS_ERROR:
    case KILL_ALL_RETRY_TASKS_ERROR:
    case DELETE_ALL_RETRY_TASKS_ERROR:
      return {
        ...state,
        retryTasks: {
          ...state.retryTasks,
          allActionPending: false,
        },
      };

    case BATCH_RUN_RETRY_TASKS_BEGIN:
    case BATCH_KILL_RETRY_TASKS_BEGIN:
    case BATCH_DELETE_RETRY_TASKS_BEGIN:
      return {
        ...state,
        retryTasks: {
          ...state.retryTasks,
          batchActionPending: true,
          data: state.retryTasks.data.map((task) => {
            if (!action.taskKeys.includes(task.key)) {
              return task;
            }
            return {
              ...task,
              requestPending: true,
            };
          }),
        },
      };

    case BATCH_RUN_RETRY_TASKS_SUCCESS: {
      const newData = state.retryTasks.data.filter(
        (task) => !action.payload.pending_keys.includes(task.key)
      );
      return {
        ...state,
        retryTasks: {
          ...state.retryTasks,
          batchActionPending: false,
          data: newData,
        },
      };
    }

    case BATCH_KILL_RETRY_TASKS_SUCCESS: {
      const newData = state.retryTasks.data.filter(
        (task) => !action.payload.dead_keys.includes(task.key)
      );
      return {
        ...state,
        retryTasks: {
          ...state.retryTasks,
          batchActionPending: false,
          data: newData,
        },
      };
    }

    case BATCH_DELETE_RETRY_TASKS_SUCCESS: {
      const newData = state.retryTasks.data.filter(
        (task) => !action.payload.deleted_keys.includes(task.key)
      );
      return {
        ...state,
        retryTasks: {
          ...state.retryTasks,
          batchActionPending: false,
          data: newData,
        },
      };
    }

    case BATCH_RUN_RETRY_TASKS_ERROR:
    case BATCH_KILL_RETRY_TASKS_ERROR:
    case BATCH_DELETE_RETRY_TASKS_ERROR:
      return {
        ...state,
        retryTasks: {
          ...state.retryTasks,
          batchActionPending: false,
          data: state.retryTasks.data.map((task) => {
            if (!action.taskKeys.includes(task.key)) {
              return task;
            }
            return {
              ...task,
              requestPending: false,
            };
          }),
        },
      };

    case RUN_DEAD_TASK_BEGIN:
    case DELETE_DEAD_TASK_BEGIN:
      return {
        ...state,
        deadTasks: {
          ...state.deadTasks,
          data: state.deadTasks.data.map((task) => {
            if (task.key !== action.taskKey) {
              return task;
            }
            return { ...task, requestPending: true };
          }),
        },
      };

    case RUN_DEAD_TASK_SUCCESS:
    case DELETE_DEAD_TASK_SUCCESS:
      return {
        ...state,
        deadTasks: {
          ...state.deadTasks,
          data: state.deadTasks.data.filter(
            (task) => task.key !== action.taskKey
          ),
        },
      };

    case RUN_DEAD_TASK_ERROR:
    case DELETE_DEAD_TASK_ERROR:
      return {
        ...state,
        deadTasks: {
          ...state.deadTasks,
          data: state.deadTasks.data.map((task) => {
            if (task.key !== action.taskKey) {
              return task;
            }
            return { ...task, requestPending: false };
          }),
        },
      };

    case RUN_ALL_DEAD_TASKS_BEGIN:
    case DELETE_ALL_DEAD_TASKS_BEGIN:
      return {
        ...state,
        deadTasks: {
          ...state.deadTasks,
          allActionPending: true,
        },
      };

    case RUN_ALL_DEAD_TASKS_SUCCESS:
    case DELETE_ALL_DEAD_TASKS_SUCCESS:
      return {
        ...state,
        deadTasks: {
          ...state.deadTasks,
          allActionPending: false,
          data: [],
        },
      };

    case RUN_ALL_DEAD_TASKS_ERROR:
    case DELETE_ALL_DEAD_TASKS_ERROR:
      return {
        ...state,
        deadTasks: {
          ...state.deadTasks,
          allActionPending: false,
        },
      };

    case BATCH_RUN_DEAD_TASKS_BEGIN:
    case BATCH_DELETE_DEAD_TASKS_BEGIN:
      return {
        ...state,
        deadTasks: {
          ...state.deadTasks,
          batchActionPending: true,
          data: state.deadTasks.data.map((task) => {
            if (!action.taskKeys.includes(task.key)) {
              return task;
            }
            return {
              ...task,
              requestPending: true,
            };
          }),
        },
      };

    case BATCH_RUN_DEAD_TASKS_SUCCESS: {
      const newData = state.deadTasks.data.filter(
        (task) => !action.payload.pending_keys.includes(task.key)
      );
      return {
        ...state,
        deadTasks: {
          ...state.deadTasks,
          batchActionPending: false,
          data: newData,
        },
      };
    }

    case BATCH_DELETE_DEAD_TASKS_SUCCESS: {
      const newData = state.deadTasks.data.filter(
        (task) => !action.payload.deleted_keys.includes(task.key)
      );
      return {
        ...state,
        deadTasks: {
          ...state.deadTasks,
          batchActionPending: false,
          data: newData,
        },
      };
    }

    case BATCH_RUN_DEAD_TASKS_ERROR:
    case BATCH_DELETE_DEAD_TASKS_ERROR:
      return {
        ...state,
        deadTasks: {
          ...state.deadTasks,
          batchActionPending: false,
          data: state.deadTasks.data.map((task) => {
            if (!action.taskKeys.includes(task.key)) {
              return task;
            }
            return {
              ...task,
              requestPending: false,
            };
          }),
        },
      };

    default:
      return state;
  }
}

export default tasksReducer;
