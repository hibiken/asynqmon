import {
  POLL_INTERVAL_CHANGE,
  SettingsActionTypes,
  TOGGLE_DARK_THEME,
} from "../actions/settingsActions";

interface SettingsState {
  pollInterval: number;
  isDarkTheme: boolean;
}

const initialState: SettingsState = {
  pollInterval: 8,
  isDarkTheme: true,
};

function settingsReducer(
  state = initialState,
  action: SettingsActionTypes
): SettingsState {
  switch (action.type) {
    case POLL_INTERVAL_CHANGE:
      return { ...state, pollInterval: action.value };
    case TOGGLE_DARK_THEME:
      return {
        ...state,
        isDarkTheme: !state.isDarkTheme,
      };
    default:
      return state;
  }
}

export default settingsReducer;
