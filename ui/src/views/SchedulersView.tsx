import React from "react";
import { connect, ConnectedProps } from "react-redux";
import Container from "@material-ui/core/Container";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import SchedulerEntriesTable from "../components/SchedulerEntriesTable";
import Typography from "@material-ui/core/Typography";
import { AppState } from "../store";
import { listSchedulerEntriesAsync } from "../actions/schedulerEntriesActions";
import { usePolling } from "../hooks";

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
  heading: {
    paddingLeft: theme.spacing(2),
    marginBottom: theme.spacing(1),
  },
}));

function mapStateToProps(state: AppState) {
  return {
    loading: state.schedulerEntries.loading,
    entries: state.schedulerEntries.data,
    pollInterval: state.settings.pollInterval,
  };
}

const connector = connect(mapStateToProps, { listSchedulerEntriesAsync });

type Props = ConnectedProps<typeof connector>;

function SchedulersView(props: Props) {
  const { pollInterval, listSchedulerEntriesAsync } = props;
  const classes = useStyles();

  usePolling(listSchedulerEntriesAsync, pollInterval);

  return (
    <Container maxWidth="lg" className={classes.container}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper className={classes.paper} variant="outlined">
            <Typography variant="h6" className={classes.heading}>
              Scheduler Entries
            </Typography>
            <SchedulerEntriesTable entries={props.entries} />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default connector(SchedulersView);
