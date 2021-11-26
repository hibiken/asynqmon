import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";

const useStyles = makeStyles((theme) => ({
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
}));

function MetricsView() {
  const classes = useStyles();

  useEffect(() => {
    console.log("TODO: Get metrics data!");
  }, []);

  return (
    <Container maxWidth="lg" className={classes.container}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          Hello Metrics
        </Grid>
      </Grid>
    </Container>
  );
}

export default MetricsView;
