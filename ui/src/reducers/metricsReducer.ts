import {
  GET_METRICS_BEGIN,
  GET_METRICS_ERROR,
  GET_METRICS_SUCCESS,
  MetricsActionTypes,
} from "../actions/metricsActions";
import { MetricsResponse } from "../api";

interface MetricsState {
  loading: boolean;
  error: string;
  data: MetricsResponse | null;
}

const initialState: MetricsState = {
  loading: false,
  error: "",
  data: null,
};

export default function metricsReducer(
  state = initialState,
  action: MetricsActionTypes
): MetricsState {
  switch (action.type) {
    case GET_METRICS_BEGIN:
      return {
        ...state,
        loading: true,
      };

    case GET_METRICS_ERROR:
      return {
        ...state,
        loading: false,
        error: action.error,
      };

    case GET_METRICS_SUCCESS:
      return {
        loading: false,
        error: "",
        data: action.payload,
      };

    default:
      return state;
  }
}
