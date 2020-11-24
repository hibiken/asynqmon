import {
  POLL_INTERVAL_CHANGE,
  SettingsActionTypes,
} from "../actions/settingsActions";

interface SettingsState {
  pollInterval: number;
}

const initialState: SettingsState = {
  pollInterval: 8,
};

function settingsReducer(
  state = initialState,
  action: SettingsActionTypes
): SettingsState {
  switch (action.type) {
    case POLL_INTERVAL_CHANGE:
      return { ...state, pollInterval: action.value };
    default:
      return state;
  }
}

export default settingsReducer;
