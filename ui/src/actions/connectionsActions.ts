import { Dispatch } from "redux";
import {
  listConnections,
  RedisConnection,
  setSelectedConnectionName,
} from "../api";
import { toErrorString } from "../utils";

export const LIST_CONNECTIONS_BEGIN = "LIST_CONNECTIONS_BEGIN";
export const LIST_CONNECTIONS_SUCCESS = "LIST_CONNECTIONS_SUCCESS";
export const LIST_CONNECTIONS_ERROR = "LIST_CONNECTIONS_ERROR";
export const SELECT_CONNECTION = "SELECT_CONNECTION";
export const CONNECTION_SWITCHED = "CONNECTION_SWITCHED";

interface ListConnectionsBeginAction {
  type: typeof LIST_CONNECTIONS_BEGIN;
}

interface ListConnectionsSuccessAction {
  type: typeof LIST_CONNECTIONS_SUCCESS;
  connections: RedisConnection[];
  defaultName: string;
}

interface ListConnectionsErrorAction {
  type: typeof LIST_CONNECTIONS_ERROR;
  error: string;
}

interface SelectConnectionAction {
  type: typeof SELECT_CONNECTION;
  name: string;
}

interface ConnectionSwitchedAction {
  type: typeof CONNECTION_SWITCHED;
}

export type ConnectionsActionTypes =
  | ListConnectionsBeginAction
  | ListConnectionsSuccessAction
  | ListConnectionsErrorAction
  | SelectConnectionAction
  | ConnectionSwitchedAction;

export function listConnectionsAsync() {
  return async (dispatch: Dispatch) => {
    dispatch({ type: LIST_CONNECTIONS_BEGIN });
    try {
      const resp = await listConnections();
      dispatch({
        type: LIST_CONNECTIONS_SUCCESS,
        connections: resp.connections || [],
        defaultName: resp.default || "",
      });
    } catch (error) {
      dispatch({
        type: LIST_CONNECTIONS_ERROR,
        error: toErrorString(error),
      });
    }
  };
}

export function selectConnection(name: string) {
  return (dispatch: Dispatch) => {
    setSelectedConnectionName(name);
    dispatch({ type: SELECT_CONNECTION, name });
    dispatch({ type: CONNECTION_SWITCHED });
  };
}
