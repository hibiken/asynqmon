import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import { getMetricsAsync } from "../actions/metricsActions";
import { AppState } from "../store";
import { usePolling } from "../hooks";
import Typography from "@material-ui/core/Typography";
import QueueSizeMetricsChart from "../components/QueueSizeMetricsChart";

const useStyles = makeStyles((theme) => ({
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
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

  usePolling(getMetricsAsync, pollInterval);

  return (
    <Container maxWidth="lg" className={classes.container}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography>Queue Size</Typography>
          <QueueSizeMetricsChart data={data?.data.result || []} />
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
