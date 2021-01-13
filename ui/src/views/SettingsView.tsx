import React, { useState } from "react";
import { connect, ConnectedProps } from "react-redux";
import Container from "@material-ui/core/Container";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Switch from "@material-ui/core/Switch";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormGroup from "@material-ui/core/FormGroup";
import Slider from "@material-ui/core/Slider";
import {
  pollIntervalChange,
  toggleDarkTheme,
} from "../actions/settingsActions";
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
    pollInterval: state.settings.pollInterval,
    isDarkTheme: state.settings.isDarkTheme,
  };
}

const mapDispatchToProps = { pollIntervalChange, toggleDarkTheme };

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

function SettingsView(props: PropsFromRedux) {
  const classes = useStyles();

  const [sliderValue, setSliderValue] = useState(props.pollInterval);
  const handleSliderValueChange = (event: any, val: number | number[]) => {
    setSliderValue(val as number);
  };

  const handleSliderValueCommited = (event: any, val: number | number[]) => {
    props.pollIntervalChange(val as number);
  };

  const handleThemeChange = (event: React.ChangeEvent<HTMLElement>) => {
    props.toggleDarkTheme();
  };
  return (
    <Container maxWidth="lg" className={classes.container}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h5">Settings</Typography>
        </Grid>
        <Grid item xs={5}>
          <Paper className={classes.paper} variant="outlined">
            <Typography color="textPrimary">Polling Interval</Typography>
            <Typography gutterBottom color="textSecondary" variant="subtitle1">
              Web UI will fetch live data with the specified interval
            </Typography>
            <Typography gutterBottom color="textSecondary" variant="subtitle1">
              Currently: Every{" "}
              {sliderValue === 1 ? "second" : `${sliderValue} seconds`}
            </Typography>
            <Slider
              value={sliderValue}
              onChange={handleSliderValueChange}
              onChangeCommitted={handleSliderValueCommited}
              aria-labelledby="continuous-slider"
              valueLabelDisplay="auto"
              step={1}
              marks={true}
              min={2}
              max={20}
            />
          </Paper>
        </Grid>
        <Grid item xs={5}>
          <Paper>
            <Typography color="textPrimary">theme switch</Typography>
            <FormGroup row>
              <FormControlLabel
                control={
                  <Switch
                    checked={props.isDarkTheme}
                    onChange={handleThemeChange}
                    name="DarkTheme"
                  />
                }
                label="🌛"
              />
            </FormGroup>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default connector(SettingsView);
