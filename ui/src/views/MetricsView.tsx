import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { useHistory } from "react-router-dom";
import queryString from "query-string";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { getMetricsAsync } from "../actions/metricsActions";
import { AppState } from "../store";
import QueueMetricsChart from "../components/QueueMetricsChart";
import { currentUnixtime } from "../utils";
import MetricsFetchControls from "../components/MetricsFetchControls";
import { useQuery } from "../hooks";

const useStyles = makeStyles((theme) => ({
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  controlsContainer: {
    display: "flex",
    justifyContent: "flex-end",
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

  const handleEndTimeChange = (endTime: number) => {
    const urlQuery = {
      [ENDTIME_URL_PARAM_KEY]: endTime,
      [DURATION_URL_PARAM_KEY]: durationSec,
    };
    history.push({
      ...history.location,
      search: queryString.stringify(urlQuery),
    });
    setEndTimeSec(endTime);
  };

  const handleDurationChange = (duration: number) => {
    const urlQuery = {
      [ENDTIME_URL_PARAM_KEY]: endTimeSec,
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
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <div className={classes.controlsContainer}>
            <MetricsFetchControls
              endTimeSec={endTimeSec}
              onEndTimeChange={handleEndTimeChange}
              durationSec={durationSec}
              onDurationChange={handleDurationChange}
            />
          </div>
        </Grid>
        <Grid item xs={12}>
          <Typography>Queue Size</Typography>
          {/* TODO: show error message if data.queue_size.status === "error" */}
          <QueueMetricsChart
            data={data?.queue_size.data?.result || []}
            endTime={endTimeSec}
            startTime={endTimeSec - durationSec}
          />
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Typography>Queue Latency</Typography>
        <div>TODO: Queue latency chart here</div>
      </Grid>
      <Grid item xs={12}>
        <Typography>Pending Tasks</Typography>
        <QueueMetricsChart
          data={data?.pending_tasks_by_queue.data?.result || []}
          endTime={endTimeSec}
          startTime={endTimeSec - durationSec}
        />
      </Grid>
      <Grid item xs={12}>
        <Typography>Retry Tasks</Typography>
        <QueueMetricsChart
          data={data?.retry_tasks_by_queue.data?.result || []}
          endTime={endTimeSec}
          startTime={endTimeSec - durationSec}
        />
      </Grid>
      <Grid item xs={12}>
        <Typography>Archived Tasks</Typography>
        <QueueMetricsChart
          data={data?.archived_tasks_by_queue.data?.result || []}
          endTime={endTimeSec}
          startTime={endTimeSec - durationSec}
        />
      </Grid>
    </Container>
  );
}

export default connector(MetricsView);
