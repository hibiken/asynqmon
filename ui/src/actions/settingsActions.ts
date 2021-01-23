import { ThemePreference } from "../reducers/settingsReducer";
// List of settings related action types.
export const POLL_INTERVAL_CHANGE = "POLL_INTERVAL_CHANGE";
export const THEME_PREFERENCE_CHANGE = "THEME_PREFERENCE_CHANGE";
export const TOGGLE_DRAWER = "TOGGLE_DRAWER";

interface PollIntervalChangeAction {
  type: typeof POLL_INTERVAL_CHANGE;
  value: number; // new poll interval value in seconds
}

interface ThemePreferenceChangeAction {
  type: typeof THEME_PREFERENCE_CHANGE;
  value: ThemePreference;
}

interface ToggleDrawerAction {
  type: typeof TOGGLE_DRAWER;
}

// Union of all settings related action types.
export type SettingsActionTypes =
  | PollIntervalChangeAction
  | ThemePreferenceChangeAction
  | ToggleDrawerAction;

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

export function toggleDrawer() {
  return { type: TOGGLE_DRAWER };
}
