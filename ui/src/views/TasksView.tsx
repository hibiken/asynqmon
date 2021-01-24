import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import TasksTable from "../components/TasksTable";
import QueueInfoBanner from "../components/QueueInfoBanner";
import { useParams, useLocation } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  container: {
    paddingTop: theme.spacing(2),
  },
  bannerContainer: {
    marginBottom: theme.spacing(2),
  },
  taskTableContainer: {
    marginBottom: theme.spacing(4),
  },
}));

function useQuery(): URLSearchParams {
  return new URLSearchParams(useLocation().search);
}

interface RouteParams {
  qname: string;
}

const validStatus = ["active", "pending", "scheduled", "retry", "archived"];
const defaultStatus = "active";

function TasksView() {
  const classes = useStyles();
  const { qname } = useParams<RouteParams>();
  const query = useQuery();
  let selected = query.get("status");
  if (!selected || !validStatus.includes(selected)) {
    selected = defaultStatus;
  }

  return (
    <Container maxWidth="lg">
      <Grid container spacing={0} className={classes.container}>
        <Grid item xs={12} className={classes.bannerContainer}>
          <QueueInfoBanner qname={qname} />
        </Grid>
        <Grid item xs={12} className={classes.taskTableContainer}>
          <TasksTable queue={qname} selected={selected} />
        </Grid>
      </Grid>
    </Container>
  );
}

export default TasksView;
