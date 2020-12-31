import React from "react";
import { connect, ConnectedProps } from "react-redux";
import Container from "@material-ui/core/Container";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import ServersTable from "../components/ServersTable";
import { listServersAsync } from "../actions/serversActions";
import { AppState } from "../store";
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
    loading: state.servers.loading,
    servers: state.servers.data,
    pollInterval: state.settings.pollInterval,
  };
}

const connector = connect(mapStateToProps, { listServersAsync });

type Props = ConnectedProps<typeof connector>;

function ServersView(props: Props) {
  const { pollInterval, listServersAsync } = props;
  const classes = useStyles();

  usePolling(listServersAsync, pollInterval);

  return (
    <Container maxWidth="lg" className={classes.container}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper className={classes.paper} variant="outlined">
            <Typography variant="h6" className={classes.heading}>
              Servers
            </Typography>
            <ServersTable servers={props.servers} />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default connector(ServersView);
