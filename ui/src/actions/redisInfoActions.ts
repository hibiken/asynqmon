import { Dispatch } from "redux";
import { getRedisInfo, RedisInfoResponse } from "../api";
import { toErrorString, toErrorStringWithHttpStatus } from "../utils";

// List of redis-info related action types.
export const GET_REDIS_INFO_BEGIN = "GET_REDIS_INFO_BEGIN";
export const GET_REDIS_INFO_SUCCESS = "GET_REDIS_INFO_SUCCESS";
export const GET_REDIS_INFO_ERROR = "GET_REDIS_INFO_ERROR";

interface GetRedisInfoBeginAction {
  type: typeof GET_REDIS_INFO_BEGIN;
}

interface GetRedisInfoSuccessAction {
  type: typeof GET_REDIS_INFO_SUCCESS;
  payload: RedisInfoResponse;
}

interface GetRedisInfoErrorAction {
  type: typeof GET_REDIS_INFO_ERROR;
  error: string;
}

// Union of all redis-info related actions.
export type RedisInfoActionTypes =
  | GetRedisInfoBeginAction
  | GetRedisInfoErrorAction
  | GetRedisInfoSuccessAction;

export function getRedisInfoAsync() {
  return async (dispatch: Dispatch<RedisInfoActionTypes>) => {
    dispatch({ type: GET_REDIS_INFO_BEGIN });
    try {
      const response = await getRedisInfo();
      dispatch({ type: GET_REDIS_INFO_SUCCESS, payload: response });
    } catch (error) {
      console.error(`getRedisInfoAsync: ${toErrorStringWithHttpStatus(error)}`);
      dispatch({
        type: GET_REDIS_INFO_ERROR,
        error: toErrorString(error),
      });
    }
  };
}
