import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import prettyBytes from "pretty-bytes";
import { AppState } from "../store";
import { percentage } from "../utils";

const useStyles = makeStyles((theme) => ({
  banner: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    display: "flex",
  },
  bannerItem: {
    flexGrow: 1,
    borderLeft: `1px solid ${theme.palette.divider}`,
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
}));

interface Props {
  qname: string;
}

function mapStateToProps(state: AppState, ownProps: Props) {
  const queueInfo = state.queues.data.find((q) => q.name === ownProps.qname);
  return {
    queue: queueInfo?.currentStats,
  };
}

const connector = connect(mapStateToProps);

type ReduxProps = ConnectedProps<typeof connector>;

function QueueInfoBanner(props: Props & ReduxProps) {
  const classes = useStyles();
  const { queue, qname } = props;
  return (
    <div className={classes.banner}>
      <div className={classes.bannerItem}>
        <Typography variant="subtitle2" color="textPrimary" gutterBottom>
          Queue name
        </Typography>
        <Typography color="textSecondary">{qname}</Typography>
      </div>

      <div className={classes.bannerItem}>
        <Typography variant="subtitle2" color="textPrimary" gutterBottom>
          Queue state
        </Typography>
        <Typography color="textSecondary">
          {queue ? (queue.paused ? "paused" : "run") : "-"}
        </Typography>
      </div>

      <div className={classes.bannerItem}>
        <Typography variant="subtitle2" color="textPrimary" gutterBottom>
          Queue size
        </Typography>
        <Typography color="textSecondary">
          {queue ? queue.size : "-"}
        </Typography>
      </div>

      <div className={classes.bannerItem}>
        <Typography variant="subtitle2" color="textPrimary" gutterBottom>
          Task groups
        </Typography>
        <Typography color="textSecondary">
          {queue ? queue.groups : "-"}
        </Typography>
      </div>

      <div className={classes.bannerItem}>
        <Typography variant="subtitle2" color="textPrimary" gutterBottom>
          Memory usage
        </Typography>
        <Typography color="textSecondary">
          {queue ? prettyBytes(queue.memory_usage_bytes) : "-"}
        </Typography>
      </div>

      <div className={classes.bannerItem}>
        <Typography variant="subtitle2" color="textPrimary" gutterBottom>
          Latency
        </Typography>
        <Typography color="textSecondary">
          {queue ? queue.display_latency : "-"}
        </Typography>
      </div>

      <div className={classes.bannerItem}>
        <Typography variant="subtitle2" color="textPrimary" gutterBottom>
          Processed
        </Typography>
        <Typography color="textSecondary">
          {queue ? queue.processed : "-"}
        </Typography>
      </div>

      <div className={classes.bannerItem}>
        <Typography variant="subtitle2" color="textPrimary" gutterBottom>
          Failed
        </Typography>
        <Typography color="textSecondary">
          {queue ? queue.failed : "-"}
        </Typography>
      </div>

      <div className={classes.bannerItem}>
        <Typography variant="subtitle2" color="textPrimary" gutterBottom>
          Error rate
        </Typography>
        <Typography color="textSecondary">
          {queue ? percentage(queue.failed, queue.processed) : "-"}
        </Typography>
      </div>
    </div>
  );
}

export default connector(QueueInfoBanner);
