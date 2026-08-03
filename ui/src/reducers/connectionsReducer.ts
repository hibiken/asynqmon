import {
  ConnectionsActionTypes,
  LIST_CONNECTIONS_BEGIN,
  LIST_CONNECTIONS_ERROR,
  LIST_CONNECTIONS_SUCCESS,
  SELECT_CONNECTION,
} from "../actions/connectionsActions";
import { RedisConnection } from "../api";

export interface ConnectionsState {
  loading: boolean;
  error: string;
  connections: RedisConnection[];
  selected: string;
}

export const initialState: ConnectionsState = {
  loading: false,
  error: "",
  connections: [],
  selected: "",
};

function connectionsReducer(
  state = initialState,
  action: ConnectionsActionTypes
): ConnectionsState {
  switch (action.type) {
    case LIST_CONNECTIONS_BEGIN:
      return { ...state, loading: true, error: "" };

    case LIST_CONNECTIONS_SUCCESS: {
      const names = action.connections.map((c) => c.name);
      let selected = state.selected;
      if (!selected || !names.includes(selected)) {
        selected =
          (action.defaultName && names.includes(action.defaultName)
            ? action.defaultName
            : names[0]) || "";
      }
      return {
        ...state,
        loading: false,
        connections: action.connections,
        selected,
        error: "",
      };
    }

    case LIST_CONNECTIONS_ERROR:
      return { ...state, loading: false, error: action.error };

    case SELECT_CONNECTION:
      return { ...state, selected: action.name };

    default:
      return state;
  }
}

export default connectionsReducer;
