import React from "react";
import Container from "@material-ui/core/Container";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles((theme) => ({
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  headingText: {
    fontWeight: "bold",
  },
}));

export default function PageNotFoundView() {
  const classes = useStyles();
  return (
    <Container maxWidth="lg" className={classes.container}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography
            variant="h5"
            align="center"
            className={classes.headingText}
          >
            Oops!
          </Typography>
          <Typography variant="subtitle1" color="textSecondary" align="center">
            404 - Page Not Found
          </Typography>
        </Grid>
      </Grid>
    </Container>
  );
}
