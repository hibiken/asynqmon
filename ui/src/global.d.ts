interface Window {
  // FLAG values are assigned by server under the window object.
  // parseFlagsUnderWindow function parses these values and assigns the interpretted value under the window.
  FLAG_ROOT_PATH: string;
  FLAG_PROMETHEUS_SERVER_ADDRESS: string;
  FLAG_READ_ONLY: string;

  // Root URL path for asynqmon app.
  // ROOT_PATH should not have the tailing slash.
  ROOT_PATH: string;

  // Prometheus server address to query time series data.
  // This field is set to empty string by default. Use this field only if it's set.
  PROMETHEUS_SERVER_ADDRESS: string;

  // If true, app hides buttons/links to make non-GET requests to the API server.
  READ_ONLY: boolean;
}
