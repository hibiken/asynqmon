import { themeKind } from "../reducers/settingsReducer";

// List of settings related action types.
export const POLL_INTERVAL_CHANGE = "POLL_INTERVAL_CHANGE";
export const SELECT_THEME = "SELECT_THEME";

interface PollIntervalChangeAction {
  type: typeof POLL_INTERVAL_CHANGE;
  value: number; // new poll interval value in seconds
}

interface ToggleDarkThemeAction {
  type: typeof SELECT_THEME;
  value: themeKind;
}

// Union of all settings related action types.
export type SettingsActionTypes =
  | PollIntervalChangeAction
  | ToggleDarkThemeAction;

export function pollIntervalChange(value: number) {
  return {
    type: POLL_INTERVAL_CHANGE,
    value,
  };
}

export function selectTheme(value: themeKind) {
  return {
    type: SELECT_THEME,
    value,
  };
}
