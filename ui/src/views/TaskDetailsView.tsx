import React, { useMemo, useEffect } from "react";
import { connect, ConnectedProps } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import { useParams } from "react-router-dom";
import QueueBreadCrumb from "../components/QueueBreadcrumb";
import { AppState } from "../store";
import { getTaskInfoAsync } from "../actions/tasksActions";
import { TaskDetailsRouteParams } from "../paths";
import { usePolling } from "../hooks";
import { listQueuesAsync } from "../actions/queuesActions";

function mapStateToProps(state: AppState) {
  return {
    loading: state.tasks.taskInfo.loading,
    error: state.tasks.taskInfo.error,
    taskInfo: state.tasks.taskInfo.data,
    pollInterval: state.settings.pollInterval,
    queues: state.queues.data.map((q) => q.name), // FIXME: This data may not be available
  };
}

const connector = connect(mapStateToProps, {
  getTaskInfoAsync,
  listQueuesAsync,
});

const useStyles = makeStyles((theme) => ({
  container: {
    paddingTop: theme.spacing(2),
  },
  paper: {
    padding: theme.spacing(2),
    marginTop: theme.spacing(2),
  },
  breadcrumbs: {
    marginBottom: theme.spacing(2),
  },
  infoRow: {
    display: "flex",
    alignItems: "center",
    paddingTop: theme.spacing(1),
  },
  infoKeyCell: {
    width: "140px",
  },
  infoValueCell: {
    width: "auto",
  },
}));

type Props = ConnectedProps<typeof connector>;

function TaskDetailsView(props: Props) {
  const classes = useStyles();
  const { qname, taskId } = useParams<TaskDetailsRouteParams>();
  const { getTaskInfoAsync, pollInterval, listQueuesAsync, taskInfo } = props;

  const fetchTaskInfo = useMemo(() => {
    return () => {
      getTaskInfoAsync(qname, taskId);
    };
  }, [qname, taskId, getTaskInfoAsync]);

  usePolling(fetchTaskInfo, pollInterval);

  // Fetch queues data to populate props.queues
  useEffect(() => {
    listQueuesAsync();
  }, [listQueuesAsync]);

  return (
    <Container maxWidth="lg" className={classes.container}>
      <Grid container spacing={0}>
        <Grid item xs={12} className={classes.breadcrumbs}>
          <QueueBreadCrumb
            queues={props.queues}
            queueName={qname}
            taskId={taskId}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper className={classes.paper} variant="outlined">
            <Typography variant="h6">Task Info</Typography>
            <div>
              <div className={classes.infoRow}>
                <Typography variant="subtitle2" className={classes.infoKeyCell}>
                  ID:{" "}
                </Typography>
                <Typography className={classes.infoValueCell}>
                  {taskInfo?.id}
                </Typography>
              </div>
              <div className={classes.infoRow}>
                <Typography variant="subtitle2" className={classes.infoKeyCell}>
                  Type:{" "}
                </Typography>
                <Typography className={classes.infoValueCell}>
                  {taskInfo?.type}
                </Typography>
              </div>
              <div className={classes.infoRow}>
                <Typography variant="subtitle2" className={classes.infoKeyCell}>
                  State:{" "}
                </Typography>
                <Typography className={classes.infoValueCell}>
                  {taskInfo?.state}
                </Typography>
              </div>
              <div className={classes.infoRow}>
                <Typography variant="subtitle2" className={classes.infoKeyCell}>
                  Queue:{" "}
                </Typography>
                <Typography className={classes.infoValueCell}>
                  {taskInfo?.queue}
                </Typography>
              </div>
              <div className={classes.infoRow}>
                <Typography variant="subtitle2" className={classes.infoKeyCell}>
                  Retry:{" "}
                </Typography>
                <Typography className={classes.infoValueCell}>
                  {taskInfo?.retried}/{taskInfo?.max_retry}
                </Typography>
              </div>
              <div className={classes.infoRow}>
                <Typography variant="subtitle2" className={classes.infoKeyCell}>
                  Last Failure:{" "}
                </Typography>
                <Typography className={classes.infoValueCell}>
                  {taskInfo?.last_failed_at ? (
                    <Typography>
                      {taskInfo?.error_message} ({taskInfo?.last_failed_at})
                    </Typography>
                  ) : (
                    <Typography>n/a</Typography>
                  )}
                </Typography>
              </div>
              <div className={classes.infoRow}>
                <Typography variant="subtitle2" className={classes.infoKeyCell}>
                  Next Process Time:{" "}
                </Typography>
                {taskInfo?.next_process_at ? (
                  <Typography>{taskInfo?.next_process_at}</Typography>
                ) : (
                  <Typography>n/a</Typography>
                )}
              </div>
            </div>
            <div className={classes.infoRow}>
              <Typography variant="subtitle2" className={classes.infoKeyCell}>
                Timeout:{" "}
              </Typography>
              <Typography className={classes.infoValueCell}>
                {taskInfo?.timeout_seconds ? (
                  <Typography>{taskInfo?.timeout_seconds} seconds</Typography>
                ) : (
                  <Typography>n/a</Typography>
                )}
              </Typography>
            </div>
            <div className={classes.infoRow}>
              <Typography variant="subtitle2" className={classes.infoKeyCell}>
                Deadline:{" "}
              </Typography>
              <Typography className={classes.infoValueCell}>
                {taskInfo?.deadline ? (
                  <Typography>{taskInfo?.deadline}</Typography>
                ) : (
                  <Typography>n/a</Typography>
                )}
              </Typography>
            </div>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default connector(TaskDetailsView);
