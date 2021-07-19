import React, { useMemo } from "react";
import { connect, ConnectedProps } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { useParams } from "react-router-dom";
import { AppState } from "../store";
import { getTaskInfoAsync } from "../actions/tasksActions";
import { TaskDetailsRouteParams } from "../paths";
import { usePolling } from "../hooks";

function mapStateToProps(state: AppState) {
  return {
    loading: state.tasks.taskInfo.loading,
    error: state.tasks.taskInfo.error,
    taskInfo: state.tasks.taskInfo.data,
    pollInterval: state.settings.pollInterval,
  };
}

const connector = connect(mapStateToProps, { getTaskInfoAsync });

const useStyles = makeStyles((theme) => ({
  container: {
    paddingTop: theme.spacing(2),
  },
}));

type Props = ConnectedProps<typeof connector>;

function TaskDetailsView(props: Props) {
  const classes = useStyles();
  const { qname, taskId } = useParams<TaskDetailsRouteParams>();
  const { getTaskInfoAsync, pollInterval } = props;

  const fetchTaskInfo = useMemo(() => {
    return () => {
      getTaskInfoAsync(qname, taskId);
    };
  }, [qname, taskId, getTaskInfoAsync]);

  usePolling(fetchTaskInfo, pollInterval);

  return (
    <Container maxWidth="lg" className={classes.container}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography>
            Task Details View Queue: {qname} TaskID: {taskId}
          </Typography>
        </Grid>
      </Grid>
    </Container>
  );
}

export default connector(TaskDetailsView);
