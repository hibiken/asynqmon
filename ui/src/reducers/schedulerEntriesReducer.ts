import uniqBy from "lodash.uniqby";
import {
  LIST_SCHEDULER_ENQUEUE_EVENTS_BEGIN,
  LIST_SCHEDULER_ENQUEUE_EVENTS_ERROR,
  LIST_SCHEDULER_ENQUEUE_EVENTS_SUCCESS,
  LIST_SCHEDULER_ENTRIES_BEGIN,
  LIST_SCHEDULER_ENTRIES_ERROR,
  LIST_SCHEDULER_ENTRIES_SUCCESS,
  SchedulerEntriesActionTypes,
} from "../actions/schedulerEntriesActions";
import { SchedulerEnqueueEvent, SchedulerEntry } from "../api";

interface SchedulerEntriesState {
  loading: boolean;
  data: SchedulerEntry[];
  error: string; // error description
  enqueueEventsByEntryId: {
    [entryId: string]: { data: SchedulerEnqueueEvent[]; loading: boolean };
  };
}

export function getEnqueueEventsEntry(
  state: SchedulerEntriesState,
  entryId: string
): { data: SchedulerEnqueueEvent[]; loading: boolean } {
  return state.enqueueEventsByEntryId[entryId] || { data: [], loading: false };
}

const initialState: SchedulerEntriesState = {
  loading: false,
  data: [],
  error: "",
  enqueueEventsByEntryId: {},
};

function schedulerEntriesReducer(
  state = initialState,
  action: SchedulerEntriesActionTypes
): SchedulerEntriesState {
  switch (action.type) {
    case LIST_SCHEDULER_ENTRIES_BEGIN:
      return {
        ...state,
        loading: true,
      };
    case LIST_SCHEDULER_ENTRIES_SUCCESS:
      return {
        ...state,
        error: "",
        loading: false,
        data: action.payload.entries,
      };
    case LIST_SCHEDULER_ENTRIES_ERROR:
      return {
        ...state,
        loading: false,
        error: action.error,
      };
    case LIST_SCHEDULER_ENQUEUE_EVENTS_BEGIN: {
      const entry = getEnqueueEventsEntry(state, action.entryId);
      return {
        ...state,
        enqueueEventsByEntryId: {
          ...state.enqueueEventsByEntryId,
          [action.entryId]: {
            ...entry,
            loading: true,
          },
        },
      };
    }
    case LIST_SCHEDULER_ENQUEUE_EVENTS_SUCCESS: {
      const sortByEnqueuedAt = (
        e1: SchedulerEnqueueEvent,
        e2: SchedulerEnqueueEvent
      ): number => {
        return Date.parse(e2.enqueued_at) - Date.parse(e1.enqueued_at);
      };
      const entry = getEnqueueEventsEntry(state, action.entryId);
      const newData = uniqBy(
        [...entry.data, ...action.payload.events],
        "task_id"
      ).sort(sortByEnqueuedAt);
      return {
        ...state,
        enqueueEventsByEntryId: {
          ...state.enqueueEventsByEntryId,
          [action.entryId]: {
            loading: false,
            data: newData,
          },
        },
      };
    }
    case LIST_SCHEDULER_ENQUEUE_EVENTS_ERROR: {
      const entry = getEnqueueEventsEntry(state, action.entryId);
      return {
        ...state,
        enqueueEventsByEntryId: {
          ...state.enqueueEventsByEntryId,
          [action.entryId]: {
            ...entry,
            loading: false,
          },
        },
      };
    }
    default:
      return state;
  }
}

export default schedulerEntriesReducer;
