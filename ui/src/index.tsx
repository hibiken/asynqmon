import React from "react";
import ReactDOM from "react-dom";
import CssBaseline from "@material-ui/core/CssBaseline";
import { Provider } from "react-redux";
import App from "./App";
import store from "./store";
import parseFlagsUnderWindow from "./parseFlags";
import * as serviceWorker from "./serviceWorker";
import { saveState } from "./localStorage";
import { SettingsState } from "./reducers/settingsReducer";
import { ConnectionsState } from "./reducers/connectionsReducer";

parseFlagsUnderWindow();

let currentSettings: SettingsState | undefined = undefined;
let currentConnections: ConnectionsState | undefined = undefined;
store.subscribe(() => {
  const prevSettings = currentSettings;
  const prevConnections = currentConnections;
  const state = store.getState();
  currentSettings = state.settings;
  currentConnections = state.connections;

  if (
    prevSettings !== currentSettings ||
    prevConnections !== currentConnections
  ) {
    saveState(state);
  }
});

ReactDOM.render(
  <React.StrictMode>
    <CssBaseline />
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// TODO(hibiken): Look into this.
serviceWorker.unregister();
