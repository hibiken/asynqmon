import {
  POLL_INTERVAL_CHANGE,
  SettingsActionTypes,
  THEME_PREFERENCE_CHANGE,
} from "../actions/settingsActions";

export enum ThemePreference {
  SystemDefault,
  Always,
  Never,
}
interface SettingsState {
  pollInterval: number;
  themePreference: ThemePreference;
}

const initialState: SettingsState = {
  pollInterval: 8,
  themePreference: ThemePreference.SystemDefault,
};

function settingsReducer(
  state = initialState,
  action: SettingsActionTypes
): SettingsState {
  switch (action.type) {
    case POLL_INTERVAL_CHANGE:
      return { ...state, pollInterval: action.value };
    case THEME_PREFERENCE_CHANGE:
      return {
        ...state,
        themePreference: action.value,
      };
    default:
      return state;
  }
}

export default settingsReducer;
