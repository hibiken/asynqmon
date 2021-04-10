import { ThemePreference } from "../reducers/settingsReducer";
import { DailyStatsKey } from "../views/DashboardView";
// List of settings related action types.
export const POLL_INTERVAL_CHANGE = "POLL_INTERVAL_CHANGE";
export const THEME_PREFERENCE_CHANGE = "THEME_PREFERENCE_CHANGE";
export const TOGGLE_DRAWER = "TOGGLE_DRAWER";
export const TASK_ROWS_PER_PAGE_CHANGE = "TASK_ROWS_PER_PAGE_CHANGE";
export const DAILY_STATS_KEY_CHANGE = "DAILY_STATS_KEY_CHANGE";

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

interface DailyStatsKeyChange {
  type: typeof DAILY_STATS_KEY_CHANGE;
  value: DailyStatsKey;
}

// Union of all settings related action types.
export type SettingsActionTypes =
  | PollIntervalChangeAction
  | ThemePreferenceChangeAction
  | ToggleDrawerAction
  | TaskRowsPerPageChange
  | DailyStatsKeyChange;

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

export function dailyStatsKeyChange(value: DailyStatsKey) {
  return {
    type: DAILY_STATS_KEY_CHANGE,
    value,
  }
}
