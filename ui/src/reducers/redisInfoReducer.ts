import {
  GET_REDIS_INFO_BEGIN,
  GET_REDIS_INFO_ERROR,
  GET_REDIS_INFO_SUCCESS,
  RedisInfoActionTypes,
} from "../actions/redisInfoActions";
import { QueueLocation, RedisInfo } from "../api";

interface RedisInfoState {
  loading: boolean;
  error: string;
  address: string;
  data: RedisInfo | null;
  rawData: string | null;
  cluster: boolean;
  rawClusterNodes: string | null;
  queueLocations: QueueLocation[] | null;
}

const initialState: RedisInfoState = {
  loading: false,
  error: "",
  address: "",
  data: null,
  rawData: null,
  cluster: false,
  rawClusterNodes: null,
  queueLocations: null,
};

export default function redisInfoReducer(
  state = initialState,
  action: RedisInfoActionTypes
): RedisInfoState {
  switch (action.type) {
    case GET_REDIS_INFO_BEGIN:
      return {
        ...state,
        loading: true,
      };

    case GET_REDIS_INFO_ERROR:
      return {
        ...state,
        loading: false,
        error: action.error,
      };

    case GET_REDIS_INFO_SUCCESS:
      return {
        loading: false,
        error: "",
        address: action.payload.address,
        data: action.payload.info,
        rawData: action.payload.raw_info,
        cluster: action.payload.cluster,
        rawClusterNodes: action.payload.raw_cluster_nodes,
        queueLocations: action.payload.queue_locations,
      };

    default:
      return state;
  }
}
