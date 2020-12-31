import {
  LIST_SERVERS_BEGIN,
  LIST_SERVERS_ERROR,
  LIST_SERVERS_SUCCESS,
  ServersActionTypes,
} from "../actions/serversActions";
import { ServerInfo } from "../api";

interface ServersState {
  loading: boolean;
  data: ServerInfo[];
}

const initialState: ServersState = {
  loading: false,
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
        data: action.payload.servers,
      };

    case LIST_SERVERS_ERROR:
      return {
        ...state,
        loading: false,
      };

    default:
      return state;
  }
}
