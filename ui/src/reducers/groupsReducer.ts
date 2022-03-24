import {
  GroupsActionTypes,
  LIST_GROUPS_BEGIN,
  LIST_GROUPS_ERROR,
  LIST_GROUPS_SUCCESS,
} from "../actions/groupsActions";
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
  action: GroupsActionTypes
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

    default:
      return state;
  }
}

export default groupsReducer;
