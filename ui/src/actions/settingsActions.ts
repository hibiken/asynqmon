import { ThemePreference } from "../reducers/settingsReducer";

// List of settings related action types.
export const POLL_INTERVAL_CHANGE = "POLL_INTERVAL_CHANGE";
export const THEME_PREFERENCE_CHANGE = "THEME_PREFERENCE_CHANGE";

interface PollIntervalChangeAction {
  type: typeof POLL_INTERVAL_CHANGE;
  value: number; // new poll interval value in seconds
}

interface ToggleDarkThemeAction {
  type: typeof THEME_PREFERENCE_CHANGE;
  value: ThemePreference;
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

export function selectTheme(value: ThemePreference) {
  return {
    type: THEME_PREFERENCE_CHANGE,
    value,
  };
}
