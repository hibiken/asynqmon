interface Window {
  // Root URL path for asynqmon app.
  // ROOT_PATH should not have the tailing slash.
  ROOT_PATH: string;

  // Prometheus server address to query time series data.
  // This field is set to empty string by default. Use this field only if it's set.
  PROMETHEUS_SERVER_ADDRESS: string;
}
