import { combineReducers, configureStore } from "@reduxjs/toolkit";
import settingsReducer from "./reducers/settingsReducer";
import queuesReducer from "./reducers/queuesReducer";
import tasksReducer from "./reducers/tasksReducer";
import serversReducer from "./reducers/serversReducer";
import schedulerEntriesReducer from "./reducers/schedulerEntriesReducer";
import snackbarReducer from "./reducers/snackbarReducer";
import queueStatsReducer from "./reducers/queueStatsReducer";
import redisInfoReducer from "./reducers/redisInfoReducer";
import { loadState } from "./localStorage";

const rootReducer = combineReducers({
  settings: settingsReducer,
  queues: queuesReducer,
  tasks: tasksReducer,
  servers: serversReducer,
  schedulerEntries: schedulerEntriesReducer,
  snackbar: snackbarReducer,
  queueStats: queueStatsReducer,
  redis: redisInfoReducer,
});

const preloadedState = loadState();

// AppState is the top-level application state maintained by redux store.
export type AppState = ReturnType<typeof rootReducer>;

const store = configureStore({
  reducer: rootReducer,
  preloadedState,
});

export default store;
