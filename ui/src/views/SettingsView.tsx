import React, { useState } from "react";
import { connect, ConnectedProps } from "react-redux";
import Container from "@material-ui/core/Container";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Slider from "@material-ui/core/Slider";
import { pollIntervalChange, selectTheme } from "../actions/settingsActions";
import { AppState } from "../store";
import FormControl from "@material-ui/core/FormControl/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import { themeKind } from "../reducers/settingsReducer";

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
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

function mapStateToProps(state: AppState) {
  return {
    pollInterval: state.settings.pollInterval,
    themePreference: state.settings.themePreference,
  };
}

const mapDispatchToProps = { pollIntervalChange, selectTheme };

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

  const handleThemeChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    props.selectTheme(event.target.value as themeKind);
  };
  return (
    <Container maxWidth="lg" className={classes.container}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h5" color="textPrimary">
            Settings
          </Typography>
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
        <FormControl variant="outlined" className={classes.formControl}>
          <InputLabel id="demo-simple-select-outlined-label">
            Dark theme
          </InputLabel>
          <Select
            labelId="demo-simple-select-outlined-label"
            id="demo-simple-select-outlined"
            value={props.themePreference}
            onChange={handleThemeChange}
            label="theme preference"
          >
            <MenuItem value={themeKind.SystemDefault}>System Default</MenuItem>
            <MenuItem value={themeKind.Always}>Always</MenuItem>
            <MenuItem value={themeKind.Never}>Never</MenuItem>
          </Select>
        </FormControl>
      </Grid>
    </Container>
  );
}

export default connector(SettingsView);
