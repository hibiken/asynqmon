import { combineReducers, configureStore } from "@reduxjs/toolkit";
import settingsReducer from "./reducers/settingsReducer";
import queuesReducer from "./reducers/queuesReducer";
import tasksReducer from "./reducers/tasksReducer";

const rootReducer = combineReducers({
  settings: settingsReducer,
  queues: queuesReducer,
  tasks: tasksReducer,
});

// AppState is the top-level application state maintained by redux store.
export type AppState = ReturnType<typeof rootReducer>;

export default configureStore({
  reducer: rootReducer,
});
