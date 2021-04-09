import {
  POLL_INTERVAL_CHANGE,
  SettingsActionTypes,
  TASK_ROWS_PER_PAGE_CHANGE,
  THEME_PREFERENCE_CHANGE,
  TOGGLE_DRAWER,
} from "../actions/settingsActions";
import { defaultPageSize } from "../components/TablePaginationActions"

export enum ThemePreference {
  SystemDefault,
  Always,
  Never,
}

export interface SettingsState {
  pollInterval: number;
  themePreference: ThemePreference;
  isDrawerOpen: boolean;
  taskRowsPerPage: number,
}

export const initialState: SettingsState = {
  pollInterval: 8,
  themePreference: ThemePreference.SystemDefault,
  isDrawerOpen: true,
  taskRowsPerPage: defaultPageSize,
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

    case TASK_ROWS_PER_PAGE_CHANGE:
      return {
        ...state,
        taskRowsPerPage: action.value,
      }

    default:
      return state;
  }
}

export default settingsReducer;
