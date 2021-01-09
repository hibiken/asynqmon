import {
  LIST_SERVERS_BEGIN,
  LIST_SERVERS_ERROR,
  LIST_SERVERS_SUCCESS,
  ServersActionTypes,
} from "../actions/serversActions";
import { ServerInfo } from "../api";

interface ServersState {
  loading: boolean;
  error: string;
  data: ServerInfo[];
}

const initialState: ServersState = {
  loading: false,
  error: "",
  data: [],
};

export default function serversReducer(
  state = initialState,
  action: ServersActionTypes
): ServersState {
  switch (action.type) {
    case LIST_SERVERS_BEGIN:
      return {
        ...state,
        loading: true,
      };

    case LIST_SERVERS_SUCCESS:
      return {
        loading: false,
        error: "",
        data: action.payload.servers,
      };

    case LIST_SERVERS_ERROR:
      return {
        ...state,
        error: action.error,
        loading: false,
      };

    default:
      return state;
  }
}
