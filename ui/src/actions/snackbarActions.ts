export const CLOSE_SNACKBAR = "CLOSE_SNACKBAR";

interface CloseSnakbarAction {
  type: typeof CLOSE_SNACKBAR;
}

// Union of all snackbar related action types
export type SnackbarActionTypes = CloseSnakbarAction;

export function closeSnackbar() {
  return { type: CLOSE_SNACKBAR };
}
