import {
  GroupsActionTypes,
  LIST_GROUPS_BEGIN,
  LIST_GROUPS_ERROR,
  LIST_GROUPS_SUCCESS,
} from "../actions/groupsActions";
import {
  LIST_AGGREGATING_TASKS_SUCCESS,
  TasksActionTypes,
} from "../actions/tasksActions";
import { GroupInfo } from "../api";

interface GroupsState {
  loading: boolean;
  data: GroupInfo[];
  error: string;
}

const initialState: GroupsState = {
  data: [],
  loading: false,
  error: "",
};

function groupsReducer(
  state = initialState,
  action: GroupsActionTypes | TasksActionTypes
): GroupsState {
  switch (action.type) {
    case LIST_GROUPS_BEGIN:
      return { ...state, loading: true };

    case LIST_GROUPS_ERROR:
      return { ...state, loading: false, error: action.error };

    case LIST_GROUPS_SUCCESS:
      return {
        ...state,
        loading: false,
        error: "",
        data: action.payload.groups,
      };

    case LIST_AGGREGATING_TASKS_SUCCESS:
      return {
        ...state,
        data: action.payload.groups,
      };

    default:
      return state;
  }
}

export default groupsReducer;
