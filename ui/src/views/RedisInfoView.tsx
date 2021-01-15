import React from "react";
import { connect, ConnectedProps } from "react-redux";
import Container from "@material-ui/core/Container";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Alert from "@material-ui/lab/Alert";
import AlertTitle from "@material-ui/lab/AlertTitle";
import SyntaxHighlighter from "../components/SyntaxHighlighter";
import { getRedisInfoAsync } from "../actions/redisInfoActions";
import { usePolling } from "../hooks";
import { AppState } from "../store";
import { timeAgoUnix } from "../utils";

const useStyles = makeStyles((theme) => ({
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
}));

function mapStateToProps(state: AppState) {
  return {
    loading: state.redis.loading,
    error: state.redis.error,
    redisInfo: state.redis.data,
    redisAddress: state.redis.address,
    redisInfoRaw: state.redis.rawData,
    pollInterval: state.settings.pollInterval,
    themePreference: state.settings.themePreference,
  };
}

const connector = connect(mapStateToProps, { getRedisInfoAsync });
type Props = ConnectedProps<typeof connector>;

function RedisInfoView(props: Props) {
  const classes = useStyles();
  const { pollInterval, getRedisInfoAsync, redisInfo, redisInfoRaw } = props;
  usePolling(getRedisInfoAsync, pollInterval);

  // Metrics to show
  // - Used Memory
  // - Memory Fragmentation Ratio
  // - Connected Clients
  // - Connected Replicas (slaves)
  // - Persistence (rdb_last_save_time, rdb_changes_since_last_save)
  // - Errors (rejected_connections)

  return (
    <Container maxWidth="lg" className={classes.container}>
      <Grid container spacing={3}>
        {props.error === "" ? (
          <>
            <Grid item xs={12}>
              <Typography variant="h5" color="textPrimary">
                Redis Info
              </Typography>
              <Typography variant="subtitle1" color="textSecondary">
                Connected to: {props.redisAddress}
              </Typography>
            </Grid>
            {redisInfo !== null && (
              <>
                <Grid item xs={12}>
                  <Typography variant="h6" color="textSecondary">
                    Server
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <MetricCard
                    title="Version"
                    content={redisInfo.redis_version}
                  />
                </Grid>
                <Grid item xs={3}>
                  <MetricCard
                    title="Uptime"
                    content={`${redisInfo.uptime_in_days} days`}
                  />
                </Grid>
                <Grid item xs={6} />
                <Grid item xs={12}>
                  <Typography variant="h6" color="textSecondary">
                    Memory
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <MetricCard
                    title="Used Memory"
                    content={redisInfo.used_memory_human}
                  />
                </Grid>
                <Grid item xs={3}>
                  <MetricCard
                    title="Peak Memory Used"
                    content={redisInfo.used_memory_peak_human}
                  />
                </Grid>
                <Grid item xs={3}>
                  <MetricCard
                    title="Memory Fragmentation Ratio"
                    content={redisInfo.mem_fragmentation_ratio}
                  />
                </Grid>
                <Grid item xs={3} />
                <Grid item xs={12}>
                  <Typography variant="h6" color="textSecondary">
                    Connections
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <MetricCard
                    title="Connected Clients"
                    content={redisInfo.connected_clients}
                  />
                </Grid>
                <Grid item xs={3}>
                  <MetricCard
                    title="Connected Replicas"
                    content={redisInfo.connected_slaves}
                  />
                </Grid>
                <Grid item xs={6} />
                <Grid item xs={12}>
                  <Typography variant="h6" color="textSecondary">
                    Persistence
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <MetricCard
                    title="Last Save to Disk"
                    content={timeAgoUnix(
                      parseInt(redisInfo.rdb_last_save_time)
                    )}
                  />
                </Grid>
                <Grid item xs={3}>
                  <MetricCard
                    title="Number of Changes Since Last Dump"
                    content={redisInfo.rdb_changes_since_last_save}
                  />
                </Grid>
                <Grid item xs={6} />
              </>
            )}
            {redisInfoRaw !== null && (
              <>
                <Grid item xs={6}>
                  <Typography variant="h6" color="textSecondary">
                    INFO Command Output
                  </Typography>
                  <SyntaxHighlighter language="yaml">
                    {redisInfoRaw}
                  </SyntaxHighlighter>
                </Grid>
              </>
            )}
          </>
        ) : (
          <Grid item xs={12}>
            <Alert severity="error">
              <AlertTitle>Error</AlertTitle>
              Could not retreive redis live data —{" "}
              <strong>See the logs for details</strong>
            </Alert>
          </Grid>
        )}
      </Grid>
    </Container>
  );
}

interface MetricCardProps {
  title: string;
  content: string;
}

function MetricCard(props: MetricCardProps) {
  return (
    <Card variant="outlined">
      <CardContent>
        <Typography
          gutterBottom
          color="textPrimary"
          variant="h5"
          align="center"
        >
          {props.content}
        </Typography>
        <Typography color="textSecondary" variant="subtitle2" align="center">
          {props.title}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default connector(RedisInfoView);
