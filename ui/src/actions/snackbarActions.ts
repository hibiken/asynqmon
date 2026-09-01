export const CLOSE_SNACKBAR = "CLOSE_SNACKBAR";
export const SHOW_SNACKBAR = "SHOW_SNACKBAR";

interface CloseSnakbarAction {
  type: typeof CLOSE_SNACKBAR;
}

interface ShowSnackbarAction {
  type: typeof SHOW_SNACKBAR;
  message: string;
}

// Union of all snackbar related action types
export type SnackbarActionTypes = CloseSnakbarAction | ShowSnackbarAction;

export function closeSnackbar() {
  return { type: CLOSE_SNACKBAR };
}

export function showSnackbar(message: string): ShowSnackbarAction {
  return { type: SHOW_SNACKBAR, message };
}
