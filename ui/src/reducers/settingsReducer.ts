import {
  POLL_INTERVAL_CHANGE,
  SettingsActionTypes,
  SELECT_THEME,
} from "../actions/settingsActions";

export enum themeKind {
  SystemDefault = "SYETEM DEFAULT",
  Always = "ALWAYS",
  Never = "NEVER",
}
interface SettingsState {
  pollInterval: number;
  themePreference: themeKind;
}

const initialState: SettingsState = {
  pollInterval: 8,
  themePreference: themeKind.SystemDefault,
};

function settingsReducer(
  state = initialState,
  action: SettingsActionTypes
): SettingsState {
  switch (action.type) {
    case POLL_INTERVAL_CHANGE:
      return { ...state, pollInterval: action.value };
    case SELECT_THEME:
      return {
        ...state,
        themePreference: action.value,
      };
    default:
      return state;
  }
}

export default settingsReducer;
