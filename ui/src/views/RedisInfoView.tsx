import React from "react";
import { connect, ConnectedProps } from "react-redux";
import Container from "@material-ui/core/Container";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { getRedisInfoAsync } from "../actions/redisInfoActions";
import { usePolling } from "../hooks";
import { AppState } from "../store";

const useStyles = makeStyles((theme) => ({
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
  },
}));

function mapStateToProps(state: AppState) {
  return {
    loading: state.redis.loading,
    redisInfo: state.redis.data,
    redisAddress: state.redis.address,
    pollInterval: state.settings.pollInterval,
  };
}

const connector = connect(mapStateToProps, { getRedisInfoAsync });
type Props = ConnectedProps<typeof connector>;

function RedisInfoView(props: Props) {
  const classes = useStyles();
  const { pollInterval, getRedisInfoAsync } = props;

  usePolling(getRedisInfoAsync, pollInterval);

  console.log("DEBUG: redisInfo", props.redisInfo);

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
        <Grid item xs={12}>
          <Typography variant="h5">Redis Info</Typography>
          <Typography variant="subtitle1" color="textSecondary">
            Connected to: {props.redisAddress}
          </Typography>
        </Grid>
      </Grid>
    </Container>
  );
}

export default connector(RedisInfoView);
