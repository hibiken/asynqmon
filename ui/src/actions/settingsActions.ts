import { ThemePreference } from "../reducers/settingsReducer";
// List of settings related action types.
export const POLL_INTERVAL_CHANGE = "POLL_INTERVAL_CHANGE";
export const THEME_PREFERENCE_CHANGE = "THEME_PREFERENCE_CHANGE";
export const TOGGLE_DRAWER = "TOGGLE_DRAWER";
export const TASK_ROWS_PER_PAGE_CHANGE = "TASK_ROWS_PER_PAGE_CHANGE";

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

interface TaskRowsPerPageChange {
  type: typeof TASK_ROWS_PER_PAGE_CHANGE;
  value: number;
}

// Union of all settings related action types.
export type SettingsActionTypes =
  | PollIntervalChangeAction
  | ThemePreferenceChangeAction
  | ToggleDrawerAction
  | TaskRowsPerPageChange;

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

export function taskRowsPerPageChange(value: number) {
  return {
    type: TASK_ROWS_PER_PAGE_CHANGE,
    value,
  };
}
