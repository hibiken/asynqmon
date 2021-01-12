import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import TasksTable from "../components/TasksTable";
import { useParams, useLocation } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  container: {
    paddingLeft: 0,
    marginLeft: 0,
    height: "100%",
  },
  gridContainer: {
    height: "100%",
    paddingBottom: 0,
  },
  gridItem: {
    height: "100%",
    paddingBottom: 0,
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
    <Container maxWidth="lg" className={classes.container}>
      <Grid container spacing={0} className={classes.gridContainer}>
        <Grid item xs={12} className={classes.gridItem}>
          <TasksTable queue={qname} selected={selected} />
        </Grid>
      </Grid>
    </Container>
  );
}

export default TasksView;
