import {
  POLL_INTERVAL_CHANGE,
  SettingsActionTypes,
  THEME_PREFERENCE_CHANGE,
  TOGGLE_DRAWER,
} from "../actions/settingsActions";

export enum ThemePreference {
  SystemDefault,
  Always,
  Never,
}

export interface SettingsState {
  pollInterval: number;
  themePreference: ThemePreference;
  isDrawerOpen: boolean;
}

const initialState: SettingsState = {
  pollInterval: 8,
  themePreference: ThemePreference.SystemDefault,
  isDrawerOpen: true,
};

function settingsReducer(
  state = initialState,
  action: SettingsActionTypes
): SettingsState {
  switch (action.type) {
    case POLL_INTERVAL_CHANGE:
      return {
        ...state,
        pollInterval: action.value,
      };

    case THEME_PREFERENCE_CHANGE:
      return {
        ...state,
        themePreference: action.value,
      };

    case TOGGLE_DRAWER:
      return {
        ...state,
        isDrawerOpen: !state.isDrawerOpen,
      };

    default:
      return state;
  }
}

export default settingsReducer;
