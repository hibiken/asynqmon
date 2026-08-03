import { initialState as settingsInitialState } from "./reducers/settingsReducer"
import { initialState as connectionsInitialState } from "./reducers/connectionsReducer"
import { AppState } from "./store";
import { setSelectedConnectionName } from "./api";

const LOCAL_STORAGE_KEY = "asynqmon:state";

export function loadState(): Partial<AppState> {
  try {
    const serializedState = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (serializedState === null) {
      return {};
    }
    const savedState = JSON.parse(serializedState);
    const selected = savedState.connections?.selected || "";
    if (selected) {
      setSelectedConnectionName(selected);
    }
    return {
      settings: {
        ...settingsInitialState,
        ...(savedState.settings || {}),
      },
      connections: {
        ...connectionsInitialState,
        selected,
      },
    }
  } catch (err) {
    console.log("loadState: could not load state ", err)
    return {};
  }
}

export function saveState(state: AppState) {
  try {
    const serializedState = JSON.stringify({
      settings: state.settings,
      connections: { selected: state.connections.selected },
    });
    localStorage.setItem(LOCAL_STORAGE_KEY, serializedState);
  } catch (err) {
    console.error("saveState: could not save state: ", err);
  }
}
