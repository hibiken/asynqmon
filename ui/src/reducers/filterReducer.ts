import {
  ARCHIVE_AGGREGATING_TASK_SUCCESS,
  ARCHIVE_PENDING_TASK_SUCCESS,
  ARCHIVE_RETRY_TASK_SUCCESS,
  ARCHIVE_SCHEDULED_TASK_SUCCESS,
  BATCH_ARCHIVE_AGGREGATING_TASKS_SUCCESS,
  BATCH_ARCHIVE_PENDING_TASKS_SUCCESS,
  BATCH_ARCHIVE_RETRY_TASKS_SUCCESS,
  BATCH_ARCHIVE_SCHEDULED_TASKS_SUCCESS,
  BATCH_DELETE_AGGREGATING_TASKS_SUCCESS,
  BATCH_DELETE_ARCHIVED_TASKS_SUCCESS,
  BATCH_DELETE_COMPLETED_TASKS_SUCCESS,
  BATCH_DELETE_PENDING_TASKS_SUCCESS,
  BATCH_DELETE_RETRY_TASKS_SUCCESS,
  BATCH_DELETE_SCHEDULED_TASKS_SUCCESS,
  BATCH_RUN_AGGREGATING_TASKS_SUCCESS,
  BATCH_RUN_ARCHIVED_TASKS_SUCCESS,
  BATCH_RUN_RETRY_TASKS_SUCCESS,
  BATCH_RUN_SCHEDULED_TASKS_SUCCESS,
  DELETE_AGGREGATING_TASK_SUCCESS,
  DELETE_ARCHIVED_TASK_SUCCESS,
  DELETE_COMPLETED_TASK_SUCCESS,
  DELETE_PENDING_TASK_SUCCESS,
  DELETE_RETRY_TASK_SUCCESS,
  DELETE_SCHEDULED_TASK_SUCCESS,
  FILTER_TASKS_BEGIN,
  FILTER_TASKS_CANCEL,
  FILTER_TASKS_PROGRESS,
  FILTER_TASKS_SUCCESS,
  RUN_AGGREGATING_TASK_SUCCESS,
  RUN_ARCHIVED_TASK_SUCCESS,
  RUN_RETRY_TASK_SUCCESS,
  RUN_SCHEDULED_TASK_SUCCESS,
  TasksActionTypes,
} from "../actions/tasksActions";
import { TasksState } from "./tasksReducer";
import { TaskInfo } from "../api";

function modifyFilterResults(
  state: TasksState,
  action: (tasks: TaskInfo[]) => TaskInfo[]
): TasksState {
  const filterOp = state.filterOp;
  if (filterOp == null || !filterOp.done) return state;

  return {
    ...state,
    filterOp: {
      ...filterOp,
      result: action(filterOp.result),
    },
  };
}

export function filterReducer(
  state: TasksState,
  action: TasksActionTypes
): TasksState {
  switch (action.type) {
    case FILTER_TASKS_BEGIN:
      return {
        ...state,
        filterOp: {
          done: false,
          processedTasks: 0,
          result: [],
        },
      };

    case FILTER_TASKS_PROGRESS: {
      const filterOp = state.filterOp;
      if (filterOp == null) return state;
      return {
        ...state,
        filterOp: {
          done: false,
          processedTasks: filterOp.processedTasks + action.processedTasks,
          result: filterOp.result.concat(action.filterResults),
        },
      };
    }

    case FILTER_TASKS_SUCCESS: {
      const filterOp = state.filterOp;
      if (filterOp == null) return state;
      return {
        ...state,
        filterOp: {
          ...filterOp,
          done: true,
        },
      };
    }

    case FILTER_TASKS_CANCEL: {
      const { filterOp, ...newState } = state;
      return newState;
    }

    // Replicate actions made to queues to filter results

    case ARCHIVE_PENDING_TASK_SUCCESS:
    case DELETE_PENDING_TASK_SUCCESS:
    case DELETE_COMPLETED_TASK_SUCCESS:
    case RUN_SCHEDULED_TASK_SUCCESS:
    case ARCHIVE_SCHEDULED_TASK_SUCCESS:
    case DELETE_SCHEDULED_TASK_SUCCESS:
    case RUN_AGGREGATING_TASK_SUCCESS:
    case ARCHIVE_AGGREGATING_TASK_SUCCESS:
    case DELETE_AGGREGATING_TASK_SUCCESS:
    case RUN_RETRY_TASK_SUCCESS:
    case ARCHIVE_RETRY_TASK_SUCCESS:
    case DELETE_RETRY_TASK_SUCCESS:
    case RUN_ARCHIVED_TASK_SUCCESS:
    case DELETE_ARCHIVED_TASK_SUCCESS:
      return modifyFilterResults(state, (tasks) =>
        tasks.filter((task) => task.id !== action.taskId)
      );

    case BATCH_ARCHIVE_PENDING_TASKS_SUCCESS:
    case BATCH_ARCHIVE_SCHEDULED_TASKS_SUCCESS:
    case BATCH_ARCHIVE_AGGREGATING_TASKS_SUCCESS:
    case BATCH_ARCHIVE_RETRY_TASKS_SUCCESS:
      return modifyFilterResults(state, (tasks) =>
        tasks.filter((task) => !action.payload.archived_ids.includes(task.id))
      );

    case BATCH_DELETE_COMPLETED_TASKS_SUCCESS:
    case BATCH_DELETE_PENDING_TASKS_SUCCESS:
    case BATCH_DELETE_SCHEDULED_TASKS_SUCCESS:
    case BATCH_DELETE_AGGREGATING_TASKS_SUCCESS:
    case BATCH_DELETE_RETRY_TASKS_SUCCESS:
    case BATCH_DELETE_ARCHIVED_TASKS_SUCCESS:
      return modifyFilterResults(state, (tasks) =>
        tasks.filter((task) => !action.payload.deleted_ids.includes(task.id))
      );

    case BATCH_RUN_SCHEDULED_TASKS_SUCCESS:
    case BATCH_RUN_AGGREGATING_TASKS_SUCCESS:
    case BATCH_RUN_RETRY_TASKS_SUCCESS:
    case BATCH_RUN_ARCHIVED_TASKS_SUCCESS:
      return modifyFilterResults(state, (tasks) =>
        tasks.filter((task) => !action.payload.pending_ids.includes(task.id))
      );

    default:
      return state;
  }
}
