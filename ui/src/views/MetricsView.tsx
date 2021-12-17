import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { useHistory } from "react-router-dom";
import queryString from "query-string";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import WarningIcon from "@material-ui/icons/Warning";
import prettyBytes from "pretty-bytes";
import { getMetricsAsync } from "../actions/metricsActions";
import { AppState } from "../store";
import QueueMetricsChart from "../components/QueueMetricsChart";
import { currentUnixtime } from "../utils";
import MetricsFetchControls from "../components/MetricsFetchControls";
import { useQuery } from "../hooks";
import { PrometheusMetricsResponse } from "../api";

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: 30,
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  controlsContainer: {
    display: "flex",
    justifyContent: "flex-end",
    position: "fixed",
    background: theme.palette.background.paper,
    zIndex: theme.zIndex.appBar,
    right: 0,
    top: 64, // app-bar height
    width: "100%",
    padding: theme.spacing(2),
  },
  chartInfo: {
    display: "flex",
    alignItems: "center",
  },
  errorMessage: {
    marginLeft: "auto",
    display: "flex",
    alignItems: "center",
  },
  warningIcon: {
    color: "#ff6700",
    marginRight: 6,
  },
}));

function mapStateToProps(state: AppState) {
  return {
    loading: state.metrics.loading,
    error: state.metrics.error,
    data: state.metrics.data,
    pollInterval: state.settings.pollInterval,
  };
}

const connector = connect(mapStateToProps, { getMetricsAsync });
type Props = ConnectedProps<typeof connector>;

const ENDTIME_URL_PARAM_KEY = "end";
const DURATION_URL_PARAM_KEY = "duration";

function MetricsView(props: Props) {
  const classes = useStyles();
  const history = useHistory();
  const query = useQuery();

  const endTimeStr = query.get(ENDTIME_URL_PARAM_KEY);
  const endTime = endTimeStr ? parseFloat(endTimeStr) : currentUnixtime(); // default to now

  const durationStr = query.get(DURATION_URL_PARAM_KEY);
  const duration = durationStr ? parseFloat(durationStr) : 60 * 60; // default to 1h

  const { pollInterval, getMetricsAsync, data } = props;

  const [endTimeSec, setEndTimeSec] = React.useState(endTime);
  const [durationSec, setDurationSec] = React.useState(duration);

  const handleEndTimeChange = (endTime: number, isEndTimeFixed: boolean) => {
    const urlQuery = isEndTimeFixed
      ? {
          [ENDTIME_URL_PARAM_KEY]: endTime,
          [DURATION_URL_PARAM_KEY]: durationSec,
        }
      : {
          [DURATION_URL_PARAM_KEY]: durationSec,
        };
    history.push({
      ...history.location,
      search: queryString.stringify(urlQuery),
    });
    setEndTimeSec(endTime);
  };

  const handleDurationChange = (duration: number, isEndTimeFixed: boolean) => {
    const urlQuery = isEndTimeFixed
      ? {
          [ENDTIME_URL_PARAM_KEY]: endTimeSec,
          [DURATION_URL_PARAM_KEY]: duration,
        }
      : {
          [DURATION_URL_PARAM_KEY]: duration,
        };
    history.push({
      ...history.location,
      search: queryString.stringify(urlQuery),
    });
    setDurationSec(duration);
  };

  React.useEffect(() => {
    getMetricsAsync(endTimeSec, durationSec);
  }, [pollInterval, getMetricsAsync, durationSec, endTimeSec]);

  return (
    <Container maxWidth="lg" className={classes.container}>
      <div className={classes.controlsContainer}>
        <MetricsFetchControls
          endTimeSec={endTimeSec}
          onEndTimeChange={handleEndTimeChange}
          durationSec={durationSec}
          onDurationChange={handleDurationChange}
        />
      </div>
      <Grid container spacing={3}>
        {data?.tasks_processed_per_second && (
          <Grid item xs={12}>
            <ChartRow
              title="Tasks Processed"
              metrics={data.tasks_processed_per_second}
              endTime={endTimeSec}
              startTime={endTimeSec - durationSec}
            />
          </Grid>
        )}
        {data?.tasks_failed_per_second && (
          <Grid item xs={12}>
            <ChartRow
              title="Tasks Failed"
              metrics={data.tasks_failed_per_second}
              endTime={endTimeSec}
              startTime={endTimeSec - durationSec}
            />
          </Grid>
        )}
        {data?.error_rate && (
          <Grid item xs={12}>
            <ChartRow
              title="Error Rate"
              metrics={data.error_rate}
              endTime={endTimeSec}
              startTime={endTimeSec - durationSec}
            />
          </Grid>
        )}
        {data?.queue_size && (
          <Grid item xs={12}>
            <ChartRow
              title="Queue Size"
              metrics={data.queue_size}
              endTime={endTimeSec}
              startTime={endTimeSec - durationSec}
            />
          </Grid>
        )}
        {data?.queue_latency_seconds && (
          <Grid item xs={12}>
            <ChartRow
              title="Queue Latency"
              metrics={data.queue_latency_seconds}
              endTime={endTimeSec}
              startTime={endTimeSec - durationSec}
              yAxisTickFormatter={(val: number) => val + "s"}
            />
          </Grid>
        )}
        {data?.queue_size && (
          <Grid item xs={12}>
            <ChartRow
              title="Queue Memory Usage (approx)"
              metrics={data.queue_memory_usage_approx_bytes}
              endTime={endTimeSec}
              startTime={endTimeSec - durationSec}
              yAxisTickFormatter={(val: number) => {
                try {
                  return prettyBytes(val);
                } catch (error) {
                  return val + "B";
                }
              }}
            />
          </Grid>
        )}
        {data?.pending_tasks_by_queue && (
          <Grid item xs={12}>
            <ChartRow
              title="Pending Tasks"
              metrics={data.pending_tasks_by_queue}
              endTime={endTimeSec}
              startTime={endTimeSec - durationSec}
            />
          </Grid>
        )}
        {data?.retry_tasks_by_queue && (
          <Grid item xs={12}>
            <ChartRow
              title="Retry Tasks"
              metrics={data.retry_tasks_by_queue}
              endTime={endTimeSec}
              startTime={endTimeSec - durationSec}
            />
          </Grid>
        )}
        {data?.archived_tasks_by_queue && (
          <Grid item xs={12}>
            <ChartRow
              title="Archived Tasks"
              metrics={data.archived_tasks_by_queue}
              endTime={endTimeSec}
              startTime={endTimeSec - durationSec}
            />
          </Grid>
        )}
      </Grid>
    </Container>
  );
}

export default connector(MetricsView);

/******** Helper components ********/

interface ChartRowProps {
  title: string;
  metrics: PrometheusMetricsResponse;
  endTime: number;
  startTime: number;
  yAxisTickFormatter?: (val: number) => string;
}

function ChartRow(props: ChartRowProps) {
  const classes = useStyles();
  return (
    <>
      <div className={classes.chartInfo}>
        <Typography>{props.title}</Typography>
        {props.metrics.status === "error" && (
          <div className={classes.errorMessage}>
            <WarningIcon fontSize="small" className={classes.warningIcon} />
            <Typography color="textSecondary">
              Failed to get metrics data: {props.metrics.error}
            </Typography>
          </div>
        )}
      </div>
      <QueueMetricsChart
        data={
          props.metrics.status === "error"
            ? []
            : props.metrics.data?.result || []
        }
        endTime={props.endTime}
        startTime={props.startTime}
        yAxisTickFormatter={props.yAxisTickFormatter}
      />
    </>
  );
}
