// List of settings related action types.
export const POLL_INTERVAL_CHANGE = 'POLL_INTERVAL_CHANGE';
export const TOGGLE_DARK_THEME = 'TOGGLE_DARK_THEME';

interface PollIntervalChangeAction {
  type: typeof POLL_INTERVAL_CHANGE;
  value: number; // new poll interval value in seconds
}

interface ToggleDarkThemeAction {
  type: typeof TOGGLE_DARK_THEME;
}

// Union of all settings related action types.
export type SettingsActionTypes = PollIntervalChangeAction | ToggleDarkThemeAction;

export function pollIntervalChange(value: number) {
  return {
    type: POLL_INTERVAL_CHANGE,
    value,
  };
}

export function toggleDarkTheme() {
  return {
    type: TOGGLE_DARK_THEME
  }
}

