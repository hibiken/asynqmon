import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Popover from "@material-ui/core/Popover";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import dayjs from "dayjs";
import { currentUnixtime, parseDuration } from "../utils";
import { AppState } from "../store";

function mapStateToProps(state: AppState) {
  return { pollInterval: state.settings.pollInterval };
}

const connector = connect(mapStateToProps);
type ReduxProps = ConnectedProps<typeof connector>;

interface Props extends ReduxProps {
  // Specifies the endtime in Unix time seconds.
  endTimeSec: number;
  onEndTimeChange: (t: number) => void;

  // Specifies the duration in seconds.
  durationSec: number;
  onDurationChange: (d: number) => void;
}

interface State {
  endTimeOption: EndTimeOption;
  durationOption: DurationOption;
  customEndTime: string; // text shown in input field
  customDuration: string; // text shown in input field
  customEndTimeError: string;
  customDurationError: string;
}

type EndTimeOption = "real_time" | "freeze_at_now" | "custom";
type DurationOption = "1h" | "6h" | "1d" | "8d" | "30d" | "custom";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    alignItems: "center",
  },
  endTimeCaption: {
    marginRight: theme.spacing(1),
  },
  controlsContainer: {
    display: "flex",
    justifyContent: "flex-end",
  },
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

function getInitialState(endTimeSec: number, durationSec: number): State {
  let endTimeOption: EndTimeOption = "real_time";
  let customEndTime = "";
  let durationOption: DurationOption = "1h";
  let customDuration = "";

  const now = currentUnixtime();
  // Account for 1s difference, may just happen to elapse 1s
  // between the parent component's render and this component's render.
  if (now <= endTimeSec && endTimeSec <= now + 1) {
    endTimeOption = "real_time";
  } else {
    endTimeOption = "custom";
    customEndTime = new Date(endTimeSec * 1000).toISOString();
  }

  switch (durationSec) {
    case 60 * 60:
      durationOption = "1h";
      break;
    case 6 * 60 * 60:
      durationOption = "6h";
      break;
    case 24 * 60 * 60:
      durationOption = "1d";
      break;
    case 8 * 24 * 60 * 60:
      durationOption = "8d";
      break;
    case 30 * 24 * 60 * 60:
      durationOption = "30d";
      break;
    default:
      durationOption = "custom";
      customDuration = durationSec + "s";
  }

  return {
    endTimeOption,
    customEndTime,
    customEndTimeError: "",
    durationOption,
    customDuration,
    customDurationError: "",
  };
}

function MetricsFetchControls(props: Props) {
  const classes = useStyles();

  const [state, setState] = React.useState<State>(
    getInitialState(props.endTimeSec, props.durationSec)
  );
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );

  const handleEndTimeOptionChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedOpt = (event.target as HTMLInputElement)
      .value as EndTimeOption;
    setState((prevState) => ({
      ...prevState,
      endTimeOption: selectedOpt,
      customEndTime: "",
      customEndTimeError: "",
    }));
    switch (selectedOpt) {
      case "real_time":
        props.onEndTimeChange(currentUnixtime());
        break;
      case "freeze_at_now":
        props.onEndTimeChange(currentUnixtime());
        break;
      case "custom":
      // No-op
    }
  };

  const handleDurationOptionChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedOpt = (event.target as HTMLInputElement)
      .value as DurationOption;
    setState((prevState) => ({
      ...prevState,
      durationOption: selectedOpt,
      customDuration: "",
      customDurationError: "",
    }));
    switch (selectedOpt) {
      case "1h":
        props.onDurationChange(60 * 60);
        break;
      case "6h":
        props.onDurationChange(6 * 60 * 60);
        break;
      case "1d":
        props.onDurationChange(24 * 60 * 60);
        break;
      case "8d":
        props.onDurationChange(8 * 24 * 60 * 60);
        break;
      case "30d":
        props.onDurationChange(30 * 24 * 60 * 60);
        break;
      case "custom":
      // No-op
    }
  };

  const handleCustomDurationChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    event.persist(); // https://reactjs.org/docs/legacy-event-pooling.html
    setState((prevState) => ({
      ...prevState,
      customDuration: event.target.value,
    }));
  };

  const handleCustomEndTimeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    event.persist(); // https://reactjs.org/docs/legacy-event-pooling.html
    setState((prevState) => ({
      ...prevState,
      customEndTime: event.target.value,
    }));
  };

  const handleCustomDurationKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter") {
      try {
        const d = parseDuration(state.customDuration);
        setState((prevState) => ({
          ...prevState,
          durationOption: "custom",
          customDurationError: "",
        }));
        props.onDurationChange(d);
      } catch (error) {
        setState((prevState) => ({
          ...prevState,
          customDurationError: "Duration invalid",
        }));
      }
    }
  };

  const handleCustomEndTimeKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter") {
      const timeUsecOrNaN = Date.parse(state.customEndTime);
      if (isNaN(timeUsecOrNaN)) {
        setState((prevState) => ({
          ...prevState,
          customEndTimeError: "End time invalid",
        }));
        return;
      }
      setState((prevState) => ({
        ...prevState,
        endTimeOption: "custom",
        customEndTimeError: "",
      }));
      props.onEndTimeChange(Math.floor(timeUsecOrNaN / 1000));
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
    if (state.endTimeOption === "real_time") {
      const id = setInterval(() => {
        props.onEndTimeChange(currentUnixtime());
      }, props.pollInterval * 1000);
      return () => clearInterval(id);
    }
  });

  return (
    <div className={classes.root}>
      <Typography variant="caption" className={classes.endTimeCaption}>
        {formatTime(props.endTimeSec)}
      </Typography>
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
        {state.endTimeOption === "real_time" ? "Realtime" : "Historical"}:{" "}
        {state.durationOption === "custom"
          ? state.customDuration
          : state.durationOption}
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
                value={state.endTimeOption}
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
                  value={state.customEndTime}
                  onKeyDown={handleCustomEndTimeKeyDown}
                  error={state.customEndTimeError !== ""}
                  helperText={state.customEndTimeError}
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
                value={state.durationOption}
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
                  value={state.customDuration}
                  onKeyDown={handleCustomDurationKeyDown}
                  error={state.customDurationError !== ""}
                  helperText={state.customDurationError}
                />
              </div>
            </FormControl>
          </div>
        </div>
      </Popover>
    </div>
  );
}

function formatTime(unixtime: number): string {
  const tz = new Date(unixtime * 1000)
    .toLocaleTimeString("en-us", { timeZoneName: "short" })
    .split(" ")[2];
  return dayjs.unix(unixtime).format("ddd, DD MMM YYYY HH:mm:ss ") + tz;
}

export default connect(mapStateToProps)(MetricsFetchControls);
