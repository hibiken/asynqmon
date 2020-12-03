import {
  LIST_SCHEDULER_ENTRIES_BEGIN,
  LIST_SCHEDULER_ENTRIES_ERROR,
  LIST_SCHEDULER_ENTRIES_SUCCESS,
  SchedulerEntriesActionTypes,
} from "../actions/schedulerEntriesActions";
import { SchedulerEntry } from "../api";

interface SchedulerEntriesState {
  loading: boolean;
  data: SchedulerEntry[];
  error: string; // error description
}

const initialState: SchedulerEntriesState = {
  loading: false,
  data: [],
  error: "",
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
        error: "",
        loading: false,
        data: action.payload.entries,
      };
    case LIST_SCHEDULER_ENTRIES_ERROR:
      // TODO: set error state
      return {
        ...state,
        loading: false,
        error: action.error,
      };
    default:
      return state;
  }
}

export default schedulerEntriesReducer;
