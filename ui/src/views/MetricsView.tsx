import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { getMetricsAsync } from "../actions/metricsActions";
import { AppState } from "../store";
import QueueSizeMetricsChart from "../components/QueueSizeMetricsChart";
import { currentUnixtime } from "../utils";
import MetricsFetchControls from "../components/MetricsFetchControls";

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

function MetricsView(props: Props) {
  const classes = useStyles();
  const { pollInterval, getMetricsAsync, data } = props;

  const [endTimeSec, setEndTimeSec] = React.useState(currentUnixtime());
  const [durationSec, setDurationSec] = React.useState(60 * 60); // 1h

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
              onEndTimeChange={setEndTimeSec}
              durationSec={durationSec}
              onDurationChange={setDurationSec}
            />
          </div>
        </Grid>
        <Grid item xs={12}>
          <Typography>Queue Size</Typography>
          <QueueSizeMetricsChart
            data={data?.data.result || []}
            endTime={endTimeSec}
            startTime={endTimeSec - durationSec}
          />
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Typography>Queue Latency</Typography>
        <div>TODO: Queue latency chart here</div>
      </Grid>
    </Container>
  );
}

export default connector(MetricsView);
