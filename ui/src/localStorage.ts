import { AppState } from "./store";

const LOCAL_STORAGE_KEY = "asynqmon:state";

export function loadState(): AppState | undefined {
  try {
    const serializedState = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return undefined;
  }
}

export function saveState(state: AppState) {
  try {
    const serializedState = JSON.stringify({ settings: state.settings });
    localStorage.setItem(LOCAL_STORAGE_KEY, serializedState);
  } catch (err) {
    console.error("saveState: could not save state: ", err);
  }
}
