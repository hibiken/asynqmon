import { Dispatch } from "redux";
import {
  createConnection,
  deleteConnection,
  listConnections,
  RedisConnection,
  setSelectedConnectionName,
} from "../api";
import { toErrorString } from "../utils";

export const LIST_CONNECTIONS_BEGIN = "LIST_CONNECTIONS_BEGIN";
export const LIST_CONNECTIONS_SUCCESS = "LIST_CONNECTIONS_SUCCESS";
export const LIST_CONNECTIONS_ERROR = "LIST_CONNECTIONS_ERROR";
export const SELECT_CONNECTION = "SELECT_CONNECTION";
export const CREATE_CONNECTION_BEGIN = "CREATE_CONNECTION_BEGIN";
export const CREATE_CONNECTION_SUCCESS = "CREATE_CONNECTION_SUCCESS";
export const CREATE_CONNECTION_ERROR = "CREATE_CONNECTION_ERROR";
export const DELETE_CONNECTION_SUCCESS = "DELETE_CONNECTION_SUCCESS";
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

interface CreateConnectionBeginAction {
  type: typeof CREATE_CONNECTION_BEGIN;
}

interface CreateConnectionSuccessAction {
  type: typeof CREATE_CONNECTION_SUCCESS;
  connection: RedisConnection;
}

interface CreateConnectionErrorAction {
  type: typeof CREATE_CONNECTION_ERROR;
  error: string;
}

interface DeleteConnectionSuccessAction {
  type: typeof DELETE_CONNECTION_SUCCESS;
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
  | CreateConnectionBeginAction
  | CreateConnectionSuccessAction
  | CreateConnectionErrorAction
  | DeleteConnectionSuccessAction
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

export function createConnectionAsync(name: string, addr: string) {
  return async (dispatch: Dispatch) => {
    dispatch({ type: CREATE_CONNECTION_BEGIN });
    try {
      const connection = await createConnection(name, addr);
      setSelectedConnectionName(connection.name);
      dispatch({ type: CREATE_CONNECTION_SUCCESS, connection });
      dispatch({ type: SELECT_CONNECTION, name: connection.name });
      dispatch({ type: CONNECTION_SWITCHED });
      return connection;
    } catch (error) {
      const message = toErrorString(error);
      dispatch({ type: CREATE_CONNECTION_ERROR, error: message });
      throw new Error(message);
    }
  };
}

export function deleteConnectionAsync(name: string) {
  return async (dispatch: Dispatch) => {
    await deleteConnection(name);
    dispatch({ type: DELETE_CONNECTION_SUCCESS, name });
  };
}
