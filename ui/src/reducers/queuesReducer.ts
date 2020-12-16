import {
  LIST_QUEUES_SUCCESS,
  LIST_QUEUES_BEGIN,
  QueuesActionTypes,
  PAUSE_QUEUE_BEGIN,
  PAUSE_QUEUE_SUCCESS,
  PAUSE_QUEUE_ERROR,
  RESUME_QUEUE_BEGIN,
  RESUME_QUEUE_ERROR,
  RESUME_QUEUE_SUCCESS,
  GET_QUEUE_SUCCESS,
  DELETE_QUEUE_BEGIN,
  DELETE_QUEUE_ERROR,
  DELETE_QUEUE_SUCCESS,
} from "../actions/queuesActions";
import {
  BATCH_DELETE_DEAD_TASKS_SUCCESS,
  BATCH_RUN_DEAD_TASKS_SUCCESS,
  DELETE_ALL_DEAD_TASKS_SUCCESS,
  DELETE_DEAD_TASK_SUCCESS,
  DELETE_RETRY_TASK_SUCCESS,
  DELETE_SCHEDULED_TASK_SUCCESS,
  LIST_ACTIVE_TASKS_SUCCESS,
  LIST_DEAD_TASKS_SUCCESS,
  LIST_PENDING_TASKS_SUCCESS,
  LIST_RETRY_TASKS_SUCCESS,
  LIST_SCHEDULED_TASKS_SUCCESS,
  RUN_DEAD_TASK_SUCCESS,
  TasksActionTypes,
} from "../actions/tasksActions";
import { DailyStat, Queue } from "../api";

interface QueuesState {
  loading: boolean;
  data: QueueInfo[];
}

export interface QueueInfo {
  name: string; // name of the queue.
  currentStats: Queue;
  history: DailyStat[];
  requestPending: boolean; // indicates pause/resume/delete action is pending on this queue
}

const initialState: QueuesState = { data: [], loading: false };

function queuesReducer(
  state = initialState,
  action: QueuesActionTypes | TasksActionTypes
): QueuesState {
  switch (action.type) {
    case LIST_QUEUES_BEGIN:
      return { ...state, loading: true };

    case LIST_QUEUES_SUCCESS:
      const { queues } = action.payload;
      return {
        ...state,
        loading: false,
        data: queues.map((q: Queue) => ({
          name: q.queue,
          currentStats: q,
          history: [],
          requestPending: false,
        })),
      };

    case GET_QUEUE_SUCCESS:
      const newData = state.data
        .filter((queueInfo) => queueInfo.name !== action.queue)
        .concat({
          name: action.queue,
          currentStats: action.payload.current,
          history: action.payload.history,
          requestPending: false,
        });
      return { ...state, data: newData };

    case DELETE_QUEUE_BEGIN:
    case PAUSE_QUEUE_BEGIN:
    case RESUME_QUEUE_BEGIN: {
      const newData = state.data.map((queueInfo) => {
        if (queueInfo.name !== action.queue) {
          return queueInfo;
        }
        return { ...queueInfo, requestPending: true };
      });
      return { ...state, data: newData };
    }

    case DELETE_QUEUE_SUCCESS: {
      const newData = state.data.filter(
        (queueInfo) => queueInfo.name !== action.queue
      );
      return { ...state, data: newData };
    }

    case PAUSE_QUEUE_SUCCESS: {
      const newData = state.data.map((queueInfo) => {
        if (queueInfo.name !== action.queue) {
          return queueInfo;
        }
        return {
          ...queueInfo,
          requestPending: false,
          currentStats: { ...queueInfo.currentStats, paused: true },
        };
      });
      return { ...state, data: newData };
    }

    case RESUME_QUEUE_SUCCESS: {
      const newData = state.data.map((queueInfo) => {
        if (queueInfo.name !== action.queue) {
          return queueInfo;
        }
        return {
          ...queueInfo,
          requestPending: false,
          currentStats: { ...queueInfo.currentStats, paused: false },
        };
      });
      return { ...state, data: newData };
    }

    case DELETE_QUEUE_ERROR:
    case PAUSE_QUEUE_ERROR:
    case RESUME_QUEUE_ERROR: {
      const newData = state.data.map((queueInfo) => {
        if (queueInfo.name !== action.queue) {
          return queueInfo;
        }
        return {
          ...queueInfo,
          requestPending: false,
        };
      });
      return { ...state, data: newData };
    }

    case LIST_ACTIVE_TASKS_SUCCESS:
    case LIST_PENDING_TASKS_SUCCESS:
    case LIST_SCHEDULED_TASKS_SUCCESS:
    case LIST_RETRY_TASKS_SUCCESS:
    case LIST_DEAD_TASKS_SUCCESS: {
      const newData = state.data
        .filter((queueInfo) => queueInfo.name !== action.queue)
        .concat({
          name: action.queue,
          currentStats: action.payload.stats,
          history: [],
          requestPending: false,
        });
      return { ...state, data: newData };
    }

    case RUN_DEAD_TASK_SUCCESS: {
      const newData = state.data.map((queueInfo) => {
        if (queueInfo.name !== action.queue) {
          return queueInfo;
        }
        return {
          ...queueInfo,
          currentStats: {
            ...queueInfo.currentStats,
            pending: queueInfo.currentStats.pending + 1,
            dead: queueInfo.currentStats.dead - 1,
          },
        };
      });
      return { ...state, data: newData };
    }

    case DELETE_SCHEDULED_TASK_SUCCESS: {
      const newData = state.data.map((queueInfo) => {
        if (queueInfo.name !== action.queue) {
          return queueInfo;
        }
        return {
          ...queueInfo,
          currentStats: {
            ...queueInfo.currentStats,
            scheduled: queueInfo.currentStats.scheduled - 1,
          },
        };
      });
      return { ...state, data: newData };
    }

    case DELETE_RETRY_TASK_SUCCESS: {
      const newData = state.data.map((queueInfo) => {
        if (queueInfo.name !== action.queue) {
          return queueInfo;
        }
        return {
          ...queueInfo,
          currentStats: {
            ...queueInfo.currentStats,
            retry: queueInfo.currentStats.retry - 1,
          },
        };
      });
      return { ...state, data: newData };
    }

    case DELETE_DEAD_TASK_SUCCESS: {
      const newData = state.data.map((queueInfo) => {
        if (queueInfo.name !== action.queue) {
          return queueInfo;
        }
        return {
          ...queueInfo,
          currentStats: {
            ...queueInfo.currentStats,
            dead: queueInfo.currentStats.dead - 1,
          },
        };
      });
      return { ...state, data: newData };
    }

    case BATCH_RUN_DEAD_TASKS_SUCCESS: {
      const newData = state.data.map((queueInfo) => {
        if (queueInfo.name !== action.queue) {
          return queueInfo;
        }
        return {
          ...queueInfo,
          currentStats: {
            ...queueInfo.currentStats,
            pending:
              queueInfo.currentStats.pending +
              action.payload.pending_keys.length,
            dead:
              queueInfo.currentStats.dead - action.payload.pending_keys.length,
          },
        };
      });
      return { ...state, data: newData };
    }

    case BATCH_DELETE_DEAD_TASKS_SUCCESS: {
      const newData = state.data.map((queueInfo) => {
        if (queueInfo.name !== action.queue) {
          return queueInfo;
        }
        return {
          ...queueInfo,
          currentStats: {
            ...queueInfo.currentStats,
            dead:
              queueInfo.currentStats.dead - action.payload.deleted_keys.length,
          },
        };
      });
      return { ...state, data: newData };
    }

    case DELETE_ALL_DEAD_TASKS_SUCCESS: {
      const newData = state.data.map((queueInfo) => {
        if (queueInfo.name !== action.queue) {
          return queueInfo;
        }
        return {
          ...queueInfo,
          currentStats: {
            ...queueInfo.currentStats,
            dead: 0,
          },
        };
      });
      return { ...state, data: newData };
    }

    default:
      return state;
  }
}

export default queuesReducer;
