import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Popover from "@material-ui/core/Popover";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import TextField from "@material-ui/core/TextField";
import { getMetricsAsync } from "../actions/metricsActions";
import { AppState } from "../store";
import QueueSizeMetricsChart from "../components/QueueSizeMetricsChart";
import { currentUnixtime, parseDuration } from "../utils";

const useStyles = makeStyles((theme) => ({
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  controlsContainer: {
    display: "flex",
    justifyContent: "flex-end",
  },
  controls: {},
  controlSelectorBox: {
    display: "flex",
    minWidth: 490,
    padding: theme.spacing(2),
  },
  controlEndTimeSelector: {
    width: "50%",
  },
  controlDurationSelector: {
    width: "50%",
    marginLeft: theme.spacing(2),
  },
  radioButtonRoot: {
    paddingTop: theme.spacing(0.5),
    paddingBottom: theme.spacing(0.5),
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
  },
  radioButtonLabel: {
    fontSize: 14,
  },
  buttonLabel: {
    textTransform: "none",
  },
  formControlRoot: {
    width: "100%",
  },
}));

function mapStateToProps(state: AppState) {
  return {
    loading: state.metrics.loading,
    error: state.metrics.error,
    data: state.metrics.data,
    pollInterval: state.settings.pollInterval,
  };
}

const connector = connect(mapStateToProps, { getMetricsAsync });
type Props = ConnectedProps<typeof connector>;

function MetricsView(props: Props) {
  const classes = useStyles();
  const { pollInterval, getMetricsAsync, data } = props;
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );

  const [endTimeOption, setEndTimeOption] = React.useState("real_time");
  const [endTimeSec, setEndTimeSec] = React.useState(currentUnixtime());
  const [durationOption, setDurationOption] = React.useState("1h");
  const [durationSec, setDurationSec] = React.useState(60 * 60); // 1h
  const [customDuration, setCustomDuration] = React.useState(""); // text shown in the input field
  const [customDurationError, setCustomDurationError] = React.useState("");
  const [customEndTime, setCustomEndTime] = React.useState(""); // text shown in the input field
  const [customEndTimeError, setCustomEndTimeError] = React.useState("");

  const handleEndTimeOptionChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selected = (event.target as HTMLInputElement).value;
    setEndTimeOption(selected);
    switch (selected) {
      case "real_time":
        setEndTimeSec(currentUnixtime());
        setCustomEndTime("");
        setCustomDurationError("");
        break;
      case "freeze_at_now":
        setEndTimeSec(currentUnixtime());
        setCustomEndTime("");
        setCustomDurationError("");
        break;
      case "custom":
      // No-op
    }
  };

  const handleDurationOptionChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selected = (event.target as HTMLInputElement).value;
    setDurationOption(selected);
    switch (selected) {
      case "1h":
        setDurationSec(60 * 60);
        setCustomDuration("");
        setCustomDurationError("");
        break;
      case "6h":
        setDurationSec(6 * 60 * 60);
        setCustomDuration("");
        setCustomDurationError("");
        break;
      case "1d":
        setDurationSec(24 * 60 * 60);
        setCustomDuration("");
        setCustomDurationError("");
        break;
      case "8d":
        setDurationSec(8 * 24 * 60 * 60);
        setCustomDuration("");
        setCustomDurationError("");
        break;
      case "30d":
        setDurationSec(30 * 24 * 60 * 60);
        setCustomDuration("");
        setCustomDurationError("");
        break;
      case "custom":
      // No-op
    }
  };

  const handleCustomDurationChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCustomDuration(event.target.value);
  };

  const handleCustomEndTimeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCustomEndTime(event.target.value);
  };

  const handleCustomDurationKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter") {
      try {
        const d = parseDuration(customDuration);
        setDurationOption("custom");
        setDurationSec(d);
        setCustomDurationError("");
      } catch (error) {
        setCustomDurationError("Duration invalid");
      }
    }
  };

  const handleCustomEndTimeKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter") {
      const timeUsecOrNaN = Date.parse(customEndTime);
      if (isNaN(timeUsecOrNaN)) {
        setCustomEndTimeError("End time invalid");
        return;
      }
      setEndTimeOption("custom");
      setEndTimeSec(Math.floor(timeUsecOrNaN / 1000));
      setCustomEndTimeError("");
    }
  };

  const handleButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "control-popover" : undefined;

  React.useEffect(() => {
    getMetricsAsync(endTimeSec, durationSec);
    // Only set up polling if end_time option is "real_time"
    if (endTimeOption === "real_time") {
      const id = setInterval(() => {
        getMetricsAsync(currentUnixtime(), durationSec);
      }, pollInterval * 1000);
      return () => clearInterval(id);
    }
  }, [pollInterval, getMetricsAsync, durationSec, endTimeSec, endTimeOption]);

  const now = currentUnixtime();

  return (
    <Container maxWidth="lg" className={classes.container}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <div className={classes.controlsContainer}>
            <div className={classes.controls}>
              <Button
                aria-describedby={id}
                variant="outlined"
                color="primary"
                onClick={handleButtonClick}
                size="small"
                classes={{
                  label: classes.buttonLabel,
                }}
              >
                {endTimeOption === "real_time" ? "Realtime" : "Historical"}:{" "}
                {durationOption === "custom" ? customDuration : durationOption}
              </Button>
              <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "center",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "center",
                }}
              >
                <div className={classes.controlSelectorBox}>
                  <div className={classes.controlEndTimeSelector}>
                    <FormControl
                      component="fieldset"
                      margin="dense"
                      classes={{ root: classes.formControlRoot }}
                    >
                      <FormLabel component="legend">End Time</FormLabel>
                      <RadioGroup
                        aria-label="end_time"
                        name="end_time"
                        value={endTimeOption}
                        onChange={handleEndTimeOptionChange}
                      >
                        <FormControlLabel
                          classes={{
                            label: classes.radioButtonLabel,
                          }}
                          value="real_time"
                          control={
                            <Radio
                              size="small"
                              classes={{ root: classes.radioButtonRoot }}
                            />
                          }
                          label="Real Time"
                        />
                        <FormControlLabel
                          classes={{
                            label: classes.radioButtonLabel,
                          }}
                          value="freeze_at_now"
                          control={
                            <Radio
                              size="small"
                              classes={{ root: classes.radioButtonRoot }}
                            />
                          }
                          label="Freeze at now"
                        />
                        <FormControlLabel
                          classes={{
                            label: classes.radioButtonLabel,
                          }}
                          value="custom"
                          control={
                            <Radio
                              size="small"
                              classes={{ root: classes.radioButtonRoot }}
                            />
                          }
                          label="Custom End Time"
                        />
                      </RadioGroup>
                      <div>
                        <TextField
                          id="custom-endtime"
                          label="yyyy-mm-dd hh:mm:ssz"
                          variant="outlined"
                          size="small"
                          onChange={handleCustomEndTimeChange}
                          value={customEndTime}
                          onKeyDown={handleCustomEndTimeKeyDown}
                          error={customEndTimeError !== ""}
                          helperText={customEndTimeError}
                        />
                      </div>
                    </FormControl>
                  </div>
                  <div className={classes.controlDurationSelector}>
                    <FormControl
                      component="fieldset"
                      margin="dense"
                      classes={{ root: classes.formControlRoot }}
                    >
                      <FormLabel component="legend">Duration</FormLabel>
                      <RadioGroup
                        aria-label="duration"
                        name="duration"
                        value={durationOption}
                        onChange={handleDurationOptionChange}
                      >
                        <FormControlLabel
                          classes={{
                            label: classes.radioButtonLabel,
                          }}
                          value="1h"
                          control={
                            <Radio
                              size="small"
                              classes={{ root: classes.radioButtonRoot }}
                            />
                          }
                          label="1h"
                        />
                        <FormControlLabel
                          classes={{
                            label: classes.radioButtonLabel,
                          }}
                          value="6h"
                          control={
                            <Radio
                              size="small"
                              classes={{ root: classes.radioButtonRoot }}
                            />
                          }
                          label="6h"
                        />
                        <FormControlLabel
                          classes={{
                            label: classes.radioButtonLabel,
                          }}
                          value="1d"
                          control={
                            <Radio
                              size="small"
                              classes={{ root: classes.radioButtonRoot }}
                            />
                          }
                          label="1 day"
                        />
                        <FormControlLabel
                          classes={{
                            label: classes.radioButtonLabel,
                          }}
                          value="8d"
                          control={
                            <Radio
                              size="small"
                              classes={{ root: classes.radioButtonRoot }}
                            />
                          }
                          label="8 days"
                        />
                        <FormControlLabel
                          classes={{
                            label: classes.radioButtonLabel,
                          }}
                          value="30d"
                          control={
                            <Radio
                              size="small"
                              classes={{ root: classes.radioButtonRoot }}
                            />
                          }
                          label="30 days"
                        />
                        <FormControlLabel
                          classes={{
                            label: classes.radioButtonLabel,
                          }}
                          value="custom"
                          control={
                            <Radio
                              size="small"
                              classes={{ root: classes.radioButtonRoot }}
                            />
                          }
                          label="Custom Duration"
                        />
                      </RadioGroup>
                      <div>
                        <TextField
                          id="custom-duration"
                          label="duration"
                          variant="outlined"
                          size="small"
                          onChange={handleCustomDurationChange}
                          value={customDuration}
                          onKeyDown={handleCustomDurationKeyDown}
                          error={customDurationError !== ""}
                          helperText={customDurationError}
                        />
                      </div>
                    </FormControl>
                  </div>
                </div>
              </Popover>
            </div>
          </div>
        </Grid>
        <Grid item xs={12}>
          <Typography>Queue Size</Typography>
          <QueueSizeMetricsChart
            data={data?.data.result || []}
            endTime={endTimeOption === "real_time" ? now : endTimeSec}
            startTime={
              endTimeOption === "real_time"
                ? now - durationSec
                : endTimeSec - durationSec
            }
          />
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Typography>Queue Latency</Typography>
        <div>TODO: Queue latency chart here</div>
      </Grid>
    </Container>
  );
}

export default connector(MetricsView);
