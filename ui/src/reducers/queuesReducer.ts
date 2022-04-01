import {
  GroupsActionTypes,
  LIST_GROUPS_SUCCESS,
} from "../actions/groupsActions";
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
  DELETE_QUEUE_BEGIN,
  DELETE_QUEUE_ERROR,
  DELETE_QUEUE_SUCCESS,
  LIST_QUEUES_ERROR,
} from "../actions/queuesActions";
import {
  BATCH_DELETE_ARCHIVED_TASKS_SUCCESS,
  BATCH_DELETE_RETRY_TASKS_SUCCESS,
  BATCH_DELETE_SCHEDULED_TASKS_SUCCESS,
  BATCH_ARCHIVE_RETRY_TASKS_SUCCESS,
  BATCH_ARCHIVE_SCHEDULED_TASKS_SUCCESS,
  BATCH_RUN_ARCHIVED_TASKS_SUCCESS,
  BATCH_RUN_RETRY_TASKS_SUCCESS,
  BATCH_RUN_SCHEDULED_TASKS_SUCCESS,
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
  LIST_ACTIVE_TASKS_SUCCESS,
  LIST_ARCHIVED_TASKS_SUCCESS,
  LIST_PENDING_TASKS_SUCCESS,
  LIST_RETRY_TASKS_SUCCESS,
  LIST_SCHEDULED_TASKS_SUCCESS,
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
  DELETE_ALL_AGGREGATING_TASKS_SUCCESS,
  ARCHIVE_ALL_AGGREGATING_TASKS_SUCCESS,
  RUN_ALL_AGGREGATING_TASKS_SUCCESS,
  BATCH_DELETE_AGGREGATING_TASKS_SUCCESS,
  BATCH_RUN_AGGREGATING_TASKS_SUCCESS,
  BATCH_ARCHIVE_AGGREGATING_TASKS_SUCCESS,
  DELETE_AGGREGATING_TASK_SUCCESS,
  RUN_AGGREGATING_TASK_SUCCESS,
  ARCHIVE_AGGREGATING_TASK_SUCCESS,
  LIST_AGGREGATING_TASKS_SUCCESS,
} from "../actions/tasksActions";
import { Queue } from "../api";

interface QueuesState {
  loading: boolean;
  data: QueueInfo[];
  error: string;
}

export interface QueueInfo {
  name: string; // name of the queue.
  currentStats: Queue;
  requestPending: boolean; // indicates pause/resume/delete action is pending on this queue
}

const initialState: QueuesState = { data: [], loading: false, error: "" };

function queuesReducer(
  state = initialState,
  action: QueuesActionTypes | TasksActionTypes | GroupsActionTypes
): QueuesState {
  switch (action.type) {
    case LIST_QUEUES_BEGIN:
      return { ...state, loading: true };

    case LIST_QUEUES_SUCCESS:
      const { queues } = action.payload;
      return {
        ...state,
        loading: false,
        error: "",
        data: queues.map((q: Queue) => ({
          name: q.queue,
          currentStats: q,
          requestPending: false,
        })),
      };

    case LIST_QUEUES_ERROR:
      return {
        ...state,
        loading: false,
        error: action.error,
      };

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
    case LIST_AGGREGATING_TASKS_SUCCESS:
    case LIST_SCHEDULED_TASKS_SUCCESS:
    case LIST_RETRY_TASKS_SUCCESS:
    case LIST_ARCHIVED_TASKS_SUCCESS: {
      const newData = state.data
        .filter((queueInfo) => queueInfo.name !== action.queue)
        .concat({
          name: action.queue,
          currentStats: action.payload.stats,
          requestPending: false,
        });
      return { ...state, data: newData };
    }

    case RUN_AGGREGATING_TASK_SUCCESS: {
      const newData = state.data.map((queueInfo) => {
        if (queueInfo.name !== action.queue) {
          return queueInfo;
        }
        return {
          ...queueInfo,
          currentStats: {
            ...queueInfo.currentStats,
            pending: queueInfo.currentStats.pending + 1,
            aggregating: queueInfo.currentStats.aggregating - 1,
          },
        };
      });
      return { ...state, data: newData };
    }

    case RUN_SCHEDULED_TASK_SUCCESS: {
      const newData = state.data.map((queueInfo) => {
        if (queueInfo.name !== action.queue) {
          return queueInfo;
        }
        return {
          ...queueInfo,
          currentStats: {
            ...queueInfo.currentStats,
            pending: queueInfo.currentStats.pending + 1,
            scheduled: queueInfo.currentStats.scheduled - 1,
          },
        };
      });
      return { ...state, data: newData };
    }

    case RUN_RETRY_TASK_SUCCESS: {
      const newData = state.data.map((queueInfo) => {
        if (queueInfo.name !== action.queue) {
          return queueInfo;
        }
        return {
          ...queueInfo,
          currentStats: {
            ...queueInfo.currentStats,
            pending: queueInfo.currentStats.pending + 1,
            retry: queueInfo.currentStats.retry - 1,
          },
        };
      });
      return { ...state, data: newData };
    }

    case RUN_ARCHIVED_TASK_SUCCESS: {
      const newData = state.data.map((queueInfo) => {
        if (queueInfo.name !== action.queue) {
          return queueInfo;
        }
        return {
          ...queueInfo,
          currentStats: {
            ...queueInfo.currentStats,
            pending: queueInfo.currentStats.pending + 1,
            archived: queueInfo.currentStats.archived - 1,
          },
        };
      });
      return { ...state, data: newData };
    }

    case ARCHIVE_PENDING_TASK_SUCCESS: {
      const newData = state.data.map((queueInfo) => {
        if (queueInfo.name !== action.queue) {
          return queueInfo;
        }
        return {
          ...queueInfo,
          currentStats: {
            ...queueInfo.currentStats,
            archived: queueInfo.currentStats.archived + 1,
            pending: queueInfo.currentStats.pending - 1,
          },
        };
      });
      return { ...state, data: newData };
    }

    case ARCHIVE_AGGREGATING_TASK_SUCCESS: {
      const newData = state.data.map((queueInfo) => {
        if (queueInfo.name !== action.queue) {
          return queueInfo;
        }
        return {
          ...queueInfo,
          currentStats: {
            ...queueInfo.currentStats,
            archived: queueInfo.currentStats.archived + 1,
            aggregating: queueInfo.currentStats.aggregating - 1,
          },
        };
      });
      return { ...state, data: newData };
    }

    case ARCHIVE_SCHEDULED_TASK_SUCCESS: {
      const newData = state.data.map((queueInfo) => {
        if (queueInfo.name !== action.queue) {
          return queueInfo;
        }
        return {
          ...queueInfo,
          currentStats: {
            ...queueInfo.currentStats,
            archived: queueInfo.currentStats.archived + 1,
            scheduled: queueInfo.currentStats.scheduled - 1,
          },
        };
      });
      return { ...state, data: newData };
    }

    case ARCHIVE_RETRY_TASK_SUCCESS: {
      const newData = state.data.map((queueInfo) => {
        if (queueInfo.name !== action.queue) {
          return queueInfo;
        }
        return {
          ...queueInfo,
          currentStats: {
            ...queueInfo.currentStats,
            archived: queueInfo.currentStats.archived + 1,
            retry: queueInfo.currentStats.retry - 1,
          },
        };
      });
      return { ...state, data: newData };
    }

    case DELETE_PENDING_TASK_SUCCESS: {
      const newData = state.data.map((queueInfo) => {
        if (queueInfo.name !== action.queue) {
          return queueInfo;
        }
        return {
          ...queueInfo,
          currentStats: {
            ...queueInfo.currentStats,
            size: queueInfo.currentStats.size - 1,
            pending: queueInfo.currentStats.pending - 1,
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
            size: queueInfo.currentStats.size - 1,
            scheduled: queueInfo.currentStats.scheduled - 1,
          },
        };
      });
      return { ...state, data: newData };
    }

    case DELETE_AGGREGATING_TASK_SUCCESS: {
      const newData = state.data.map((queueInfo) => {
        if (queueInfo.name !== action.queue) {
          return queueInfo;
        }
        return {
          ...queueInfo,
          currentStats: {
            ...queueInfo.currentStats,
            size: queueInfo.currentStats.size - 1,
            aggregating: queueInfo.currentStats.aggregating - 1,
          },
        };
      });
      return { ...state, data: newData };
    }

    case BATCH_ARCHIVE_PENDING_TASKS_SUCCESS: {
      const newData = state.data.map((queueInfo) => {
        if (queueInfo.name !== action.queue) {
          return queueInfo;
        }
        return {
          ...queueInfo,
          currentStats: {
            ...queueInfo.currentStats,
            archived:
              queueInfo.currentStats.archived +
              action.payload.archived_ids.length,
            pending:
              queueInfo.currentStats.pending -
              action.payload.archived_ids.length,
          },
        };
      });
      return { ...state, data: newData };
    }

    case BATCH_DELETE_PENDING_TASKS_SUCCESS: {
      const newData = state.data.map((queueInfo) => {
        if (queueInfo.name !== action.queue) {
          return queueInfo;
        }
        return {
          ...queueInfo,
          currentStats: {
            ...queueInfo.currentStats,
            size:
              queueInfo.currentStats.size - action.payload.deleted_ids.length,
            pending:
              queueInfo.currentStats.pending -
              action.payload.deleted_ids.length,
          },
        };
      });
      return { ...state, data: newData };
    }

    case ARCHIVE_ALL_PENDING_TASKS_SUCCESS: {
      const newData = state.data.map((queueInfo) => {
        if (queueInfo.name !== action.queue) {
          return queueInfo;
        }
        return {
          ...queueInfo,
          currentStats: {
            ...queueInfo.currentStats,
            archived:
              queueInfo.currentStats.archived + queueInfo.currentStats.pending,
            pending: 0,
          },
        };
      });
      return { ...state, data: newData };
    }

    case ARCHIVE_ALL_AGGREGATING_TASKS_SUCCESS: {
      const newData = state.data.map((queueInfo) => {
        if (queueInfo.name !== action.queue) {
          return queueInfo;
        }
        return {
          ...queueInfo,
          currentStats: {
            ...queueInfo.currentStats,
            groups: queueInfo.currentStats.groups - 1,
            archived: queueInfo.currentStats.archived + action.archived,
            aggregating: queueInfo.currentStats.aggregating - action.archived,
          },
        };
      });
      return { ...state, data: newData };
    }

    case DELETE_ALL_PENDING_TASKS_SUCCESS: {
      const newData = state.data.map((queueInfo) => {
        if (queueInfo.name !== action.queue) {
          return queueInfo;
        }
        return {
          ...queueInfo,
          currentStats: {
            ...queueInfo.currentStats,
            size: queueInfo.currentStats.size - action.deleted,
            pending: 0,
          },
        };
      });
      return { ...state, data: newData };
    }

    case BATCH_RUN_SCHEDULED_TASKS_SUCCESS: {
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
              action.payload.pending_ids.length,
            scheduled:
              queueInfo.currentStats.scheduled -
              action.payload.pending_ids.length,
          },
        };
      });
      return { ...state, data: newData };
    }

    case BATCH_ARCHIVE_SCHEDULED_TASKS_SUCCESS: {
      const newData = state.data.map((queueInfo) => {
        if (queueInfo.name !== action.queue) {
          return queueInfo;
        }
        return {
          ...queueInfo,
          currentStats: {
            ...queueInfo.currentStats,
            archived:
              queueInfo.currentStats.archived +
              action.payload.archived_ids.length,
            scheduled:
              queueInfo.currentStats.scheduled -
              action.payload.archived_ids.length,
          },
        };
      });
      return { ...state, data: newData };
    }

    case BATCH_DELETE_SCHEDULED_TASKS_SUCCESS: {
      const newData = state.data.map((queueInfo) => {
        if (queueInfo.name !== action.queue) {
          return queueInfo;
        }
        return {
          ...queueInfo,
          currentStats: {
            ...queueInfo.currentStats,
            size:
              queueInfo.currentStats.size - action.payload.deleted_ids.length,
            scheduled:
              queueInfo.currentStats.scheduled -
              action.payload.deleted_ids.length,
          },
        };
      });
      return { ...state, data: newData };
    }

    case RUN_ALL_AGGREGATING_TASKS_SUCCESS: {
      const newData = state.data.map((queueInfo) => {
        if (queueInfo.name !== action.queue) {
          return queueInfo;
        }
        return {
          ...queueInfo,
          currentStats: {
            ...queueInfo.currentStats,
            groups: queueInfo.currentStats.groups - 1,
            pending: queueInfo.currentStats.pending + action.scheduled,
            aggregating: queueInfo.currentStats.aggregating - action.scheduled,
          },
        };
      });
      return { ...state, data: newData };
    }

    case RUN_ALL_SCHEDULED_TASKS_SUCCESS: {
      const newData = state.data.map((queueInfo) => {
        if (queueInfo.name !== action.queue) {
          return queueInfo;
        }
        return {
          ...queueInfo,
          currentStats: {
            ...queueInfo.currentStats,
            pending:
              queueInfo.currentStats.pending + queueInfo.currentStats.scheduled,
            scheduled: 0,
          },
        };
      });
      return { ...state, data: newData };
    }

    case ARCHIVE_ALL_SCHEDULED_TASKS_SUCCESS: {
      const newData = state.data.map((queueInfo) => {
        if (queueInfo.name !== action.queue) {
          return queueInfo;
        }
        return {
          ...queueInfo,
          currentStats: {
            ...queueInfo.currentStats,
            archived:
              queueInfo.currentStats.archived +
              queueInfo.currentStats.scheduled,
            scheduled: 0,
          },
        };
      });
      return { ...state, data: newData };
    }

    case DELETE_ALL_AGGREGATING_TASKS_SUCCESS: {
      const newData = state.data.map((queueInfo) => {
        if (queueInfo.name !== action.queue) {
          return queueInfo;
        }
        return {
          ...queueInfo,
          currentStats: {
            ...queueInfo.currentStats,
            size: queueInfo.currentStats.size - action.deleted,
            groups: queueInfo.currentStats.groups - 1,
            aggregating: queueInfo.currentStats.aggregating - action.deleted,
          },
        };
      });
      return { ...state, data: newData };
    }

    case DELETE_ALL_SCHEDULED_TASKS_SUCCESS: {
      const newData = state.data.map((queueInfo) => {
        if (queueInfo.name !== action.queue) {
          return queueInfo;
        }
        return {
          ...queueInfo,
          currentStats: {
            ...queueInfo.currentStats,
            size: queueInfo.currentStats.size - action.deleted,
            scheduled: 0,
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
            size: queueInfo.currentStats.size - 1,
            retry: queueInfo.currentStats.retry - 1,
          },
        };
      });
      return { ...state, data: newData };
    }

    case BATCH_RUN_RETRY_TASKS_SUCCESS: {
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
              action.payload.pending_ids.length,
            retry:
              queueInfo.currentStats.retry - action.payload.pending_ids.length,
          },
        };
      });
      return { ...state, data: newData };
    }

    case BATCH_ARCHIVE_RETRY_TASKS_SUCCESS: {
      const newData = state.data.map((queueInfo) => {
        if (queueInfo.name !== action.queue) {
          return queueInfo;
        }
        return {
          ...queueInfo,
          currentStats: {
            ...queueInfo.currentStats,
            archived:
              queueInfo.currentStats.pending +
              action.payload.archived_ids.length,
            retry:
              queueInfo.currentStats.retry - action.payload.archived_ids.length,
          },
        };
      });
      return { ...state, data: newData };
    }

    case BATCH_DELETE_RETRY_TASKS_SUCCESS: {
      const newData = state.data.map((queueInfo) => {
        if (queueInfo.name !== action.queue) {
          return queueInfo;
        }
        return {
          ...queueInfo,
          currentStats: {
            ...queueInfo.currentStats,
            size:
              queueInfo.currentStats.size - action.payload.deleted_ids.length,
            retry:
              queueInfo.currentStats.retry - action.payload.deleted_ids.length,
          },
        };
      });
      return { ...state, data: newData };
    }

    case BATCH_RUN_AGGREGATING_TASKS_SUCCESS: {
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
              action.payload.pending_ids.length,
            aggregating:
              queueInfo.currentStats.aggregating -
              action.payload.pending_ids.length,
          },
        };
      });
      return { ...state, data: newData };
    }

    case BATCH_ARCHIVE_AGGREGATING_TASKS_SUCCESS: {
      const newData = state.data.map((queueInfo) => {
        if (queueInfo.name !== action.queue) {
          return queueInfo;
        }
        return {
          ...queueInfo,
          currentStats: {
            ...queueInfo.currentStats,
            archived:
              queueInfo.currentStats.archived +
              action.payload.archived_ids.length,
            aggregating:
              queueInfo.currentStats.aggregating -
              action.payload.archived_ids.length,
          },
        };
      });
      return { ...state, data: newData };
    }

    case BATCH_DELETE_AGGREGATING_TASKS_SUCCESS: {
      const newData = state.data.map((queueInfo) => {
        if (queueInfo.name !== action.queue) {
          return queueInfo;
        }
        return {
          ...queueInfo,
          currentStats: {
            ...queueInfo.currentStats,
            size:
              queueInfo.currentStats.size - action.payload.deleted_ids.length,
            aggregating:
              queueInfo.currentStats.aggregating -
              action.payload.deleted_ids.length,
          },
        };
      });
      return { ...state, data: newData };
    }

    case RUN_ALL_RETRY_TASKS_SUCCESS: {
      const newData = state.data.map((queueInfo) => {
        if (queueInfo.name !== action.queue) {
          return queueInfo;
        }
        return {
          ...queueInfo,
          currentStats: {
            ...queueInfo.currentStats,
            pending:
              queueInfo.currentStats.pending + queueInfo.currentStats.retry,
            retry: 0,
          },
        };
      });
      return { ...state, data: newData };
    }

    case ARCHIVE_ALL_RETRY_TASKS_SUCCESS: {
      const newData = state.data.map((queueInfo) => {
        if (queueInfo.name !== action.queue) {
          return queueInfo;
        }
        return {
          ...queueInfo,
          currentStats: {
            ...queueInfo.currentStats,
            archived:
              queueInfo.currentStats.archived + queueInfo.currentStats.retry,
            retry: 0,
          },
        };
      });
      return { ...state, data: newData };
    }

    case DELETE_ALL_RETRY_TASKS_SUCCESS: {
      const newData = state.data.map((queueInfo) => {
        if (queueInfo.name !== action.queue) {
          return queueInfo;
        }
        return {
          ...queueInfo,
          currentStats: {
            ...queueInfo.currentStats,
            size: queueInfo.currentStats.size - action.deleted,
            retry: 0,
          },
        };
      });
      return { ...state, data: newData };
    }

    case DELETE_ARCHIVED_TASK_SUCCESS: {
      const newData = state.data.map((queueInfo) => {
        if (queueInfo.name !== action.queue) {
          return queueInfo;
        }
        return {
          ...queueInfo,
          currentStats: {
            ...queueInfo.currentStats,
            size: queueInfo.currentStats.size - 1,
            archived: queueInfo.currentStats.archived - 1,
          },
        };
      });
      return { ...state, data: newData };
    }

    case DELETE_COMPLETED_TASK_SUCCESS: {
      const newData = state.data.map((queueInfo) => {
        if (queueInfo.name !== action.queue) {
          return queueInfo;
        }
        return {
          ...queueInfo,
          currentStats: {
            ...queueInfo.currentStats,
            size: queueInfo.currentStats.size - 1,
            completed: queueInfo.currentStats.completed - 1,
          },
        };
      });
      return { ...state, data: newData };
    }

    case BATCH_RUN_ARCHIVED_TASKS_SUCCESS: {
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
              action.payload.pending_ids.length,
            archived:
              queueInfo.currentStats.archived -
              action.payload.pending_ids.length,
          },
        };
      });
      return { ...state, data: newData };
    }

    case BATCH_DELETE_ARCHIVED_TASKS_SUCCESS: {
      const newData = state.data.map((queueInfo) => {
        if (queueInfo.name !== action.queue) {
          return queueInfo;
        }
        return {
          ...queueInfo,
          currentStats: {
            ...queueInfo.currentStats,
            size:
              queueInfo.currentStats.size - action.payload.deleted_ids.length,
            archived:
              queueInfo.currentStats.archived -
              action.payload.deleted_ids.length,
          },
        };
      });
      return { ...state, data: newData };
    }

    case BATCH_DELETE_COMPLETED_TASKS_SUCCESS: {
      const newData = state.data.map((queueInfo) => {
        if (queueInfo.name !== action.queue) {
          return queueInfo;
        }
        return {
          ...queueInfo,
          currentStats: {
            ...queueInfo.currentStats,
            size:
              queueInfo.currentStats.size - action.payload.deleted_ids.length,
            completed:
              queueInfo.currentStats.completed -
              action.payload.deleted_ids.length,
          },
        };
      });
      return { ...state, data: newData };
    }

    case RUN_ALL_ARCHIVED_TASKS_SUCCESS: {
      const newData = state.data.map((queueInfo) => {
        if (queueInfo.name !== action.queue) {
          return queueInfo;
        }
        return {
          ...queueInfo,
          currentStats: {
            ...queueInfo.currentStats,
            pending:
              queueInfo.currentStats.pending + queueInfo.currentStats.archived,
            archived: 0,
          },
        };
      });
      return { ...state, data: newData };
    }

    case DELETE_ALL_ARCHIVED_TASKS_SUCCESS: {
      const newData = state.data.map((queueInfo) => {
        if (queueInfo.name !== action.queue) {
          return queueInfo;
        }
        return {
          ...queueInfo,
          currentStats: {
            ...queueInfo.currentStats,
            size: queueInfo.currentStats.size - action.deleted,
            archived: 0,
          },
        };
      });
      return { ...state, data: newData };
    }

    case DELETE_ALL_COMPLETED_TASKS_SUCCESS: {
      const newData = state.data.map((queueInfo) => {
        if (queueInfo.name !== action.queue) {
          return queueInfo;
        }
        return {
          ...queueInfo,
          currentStats: {
            ...queueInfo.currentStats,
            size: queueInfo.currentStats.size - action.deleted,
            completed: 0,
          },
        };
      });
      return { ...state, data: newData };
    }

    case LIST_GROUPS_SUCCESS: {
      const newData = state.data.map((queueInfo) => {
        if (queueInfo.name !== action.queue) {
          return queueInfo;
        }
        return {
          ...queueInfo,
          currentStats: action.payload.stats,
        };
      });
      return { ...state, data: newData };
    }

    default:
      return state;
  }
}

export default queuesReducer;
