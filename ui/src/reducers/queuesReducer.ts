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
} from "../actions/queuesActions";
import {
  LIST_ACTIVE_TASKS_SUCCESS,
  LIST_DEAD_TASKS_SUCCESS,
  LIST_PENDING_TASKS_SUCCESS,
  LIST_RETRY_TASKS_SUCCESS,
  LIST_SCHEDULED_TASKS_SUCCESS,
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
  pauseRequestPending: boolean; // indicates pause/resume action is pending on this queue
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
          pauseRequestPending: false,
        })),
      };

    case GET_QUEUE_SUCCESS:
      const newData = state.data
        .filter((queueInfo) => queueInfo.name !== action.queue)
        .concat({
          name: action.queue,
          currentStats: action.payload.current,
          history: action.payload.history,
          pauseRequestPending: false,
        });
      return { ...state, data: newData };

    case PAUSE_QUEUE_BEGIN:
    case RESUME_QUEUE_BEGIN: {
      const newData = state.data.map((queueInfo) => {
        if (queueInfo.name !== action.queue) {
          return queueInfo;
        }
        return { ...queueInfo, pauseRequestPending: true };
      });
      return { ...state, data: newData };
    }

    case PAUSE_QUEUE_SUCCESS: {
      const newData = state.data.map((queueInfo) => {
        if (queueInfo.name !== action.queue) {
          return queueInfo;
        }
        return {
          ...queueInfo,
          pauseRequestPending: false,
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
          pauseRequestPending: false,
          currentStats: { ...queueInfo.currentStats, paused: false },
        };
      });
      return { ...state, data: newData };
    }

    case PAUSE_QUEUE_ERROR:
    case RESUME_QUEUE_ERROR: {
      const newData = state.data.map((queueInfo) => {
        if (queueInfo.name !== action.queue) {
          return queueInfo;
        }
        return {
          ...queueInfo,
          pauseRequestPending: false,
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
          pauseRequestPending: false,
        });
      return { ...state, data: newData };
    }

    default:
      return state;
  }
}

export default queuesReducer;
