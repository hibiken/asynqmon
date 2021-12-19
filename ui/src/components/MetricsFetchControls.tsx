import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { makeStyles, Theme } from "@material-ui/core/styles";
import Button, { ButtonProps } from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import IconButton from "@material-ui/core/IconButton";
import Popover from "@material-ui/core/Popover";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormGroup from "@material-ui/core/FormGroup";
import FormLabel from "@material-ui/core/FormLabel";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import ArrowLeftIcon from "@material-ui/icons/ArrowLeft";
import ArrowRightIcon from "@material-ui/icons/ArrowRight";
import FilterListIcon from "@material-ui/icons/FilterList";
import dayjs from "dayjs";
import { currentUnixtime, parseDuration } from "../utils";
import { AppState } from "../store";
import { isDarkTheme } from "../theme";

function mapStateToProps(state: AppState) {
  return { pollInterval: state.settings.pollInterval };
}

const connector = connect(mapStateToProps);
type ReduxProps = ConnectedProps<typeof connector>;

interface Props extends ReduxProps {
  // Specifies the endtime in Unix time seconds.
  endTimeSec: number;
  onEndTimeChange: (t: number, isEndTimeFixed: boolean) => void;

  // Specifies the duration in seconds.
  durationSec: number;
  onDurationChange: (d: number, isEndTimeFixed: boolean) => void;

  // All available queues.
  queues: string[];
  // Selected queues.
  selectedQueues: string[];
  addQueue: (qname: string) => void;
  removeQueue: (qname: string) => void;
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
  shiftButtons: {
    marginLeft: theme.spacing(1),
  },
  buttonGroupRoot: {
    height: 29,
    position: "relative",
    top: 1,
  },
  endTimeShiftControls: {
    padding: theme.spacing(1),
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderBottomColor: theme.palette.divider,
    borderBottomWidth: 1,
    borderBottomStyle: "solid",
  },
  leftShiftButtons: {
    display: "flex",
    alignItems: "center",
    marginRight: theme.spacing(2),
  },
  rightShiftButtons: {
    display: "flex",
    alignItems: "center",
    marginLeft: theme.spacing(2),
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
  },
  radioButtonRoot: {
    paddingTop: theme.spacing(0.5),
    paddingBottom: theme.spacing(0.5),
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
  },
  formControlLabel: {
    fontSize: 14,
  },
  buttonLabel: {
    textTransform: "none",
    fontSize: 12,
  },
  formControlRoot: {
    width: "100%",
    margin: 0,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: 500,
    marginBottom: theme.spacing(1),
  },
  customInputField: {
    marginTop: theme.spacing(1),
  },
  filterButton: {
    marginLeft: theme.spacing(1),
  },
  queueFilters: {
    padding: theme.spacing(2),
    maxHeight: 400,
  },
  checkbox: {
    padding: 6,
  },
}));

// minute, hour, day in seconds
const minute = 60;
const hour = 60 * minute;
const day = 24 * hour;

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
    case 1 * hour:
      durationOption = "1h";
      break;
    case 6 * hour:
      durationOption = "6h";
      break;
    case 1 * day:
      durationOption = "1d";
      break;
    case 8 * day:
      durationOption = "8d";
      break;
    case 30 * day:
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
  const [timePopoverAnchorElem, setTimePopoverAnchorElem] =
    React.useState<HTMLButtonElement | null>(null);

  const [queuePopoverAnchorElem, setQueuePopoverAnchorElem] =
    React.useState<HTMLButtonElement | null>(null);

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
        props.onEndTimeChange(currentUnixtime(), /*isEndTimeFixed=*/ false);
        break;
      case "freeze_at_now":
        props.onEndTimeChange(currentUnixtime(), /*isEndTimeFixed=*/ true);
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
    const isEndTimeFixed = state.endTimeOption !== "real_time";
    switch (selectedOpt) {
      case "1h":
        props.onDurationChange(1 * hour, isEndTimeFixed);
        break;
      case "6h":
        props.onDurationChange(6 * hour, isEndTimeFixed);
        break;
      case "1d":
        props.onDurationChange(1 * day, isEndTimeFixed);
        break;
      case "8d":
        props.onDurationChange(8 * day, isEndTimeFixed);
        break;
      case "30d":
        props.onDurationChange(30 * day, isEndTimeFixed);
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
        props.onDurationChange(d, state.endTimeOption !== "real_time");
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
      props.onEndTimeChange(
        Math.floor(timeUsecOrNaN / 1000),
        /* isEndTimeFixed= */ true
      );
    }
  };

  const handleOpenTimePopover = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    setTimePopoverAnchorElem(event.currentTarget);
  };

  const handleCloseTimePopover = () => {
    setTimePopoverAnchorElem(null);
  };

  const handleOpenQueuePopover = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    setQueuePopoverAnchorElem(event.currentTarget);
  };

  const handleCloseQueuePopover = () => {
    setQueuePopoverAnchorElem(null);
  };

  const isTimePopoverOpen = Boolean(timePopoverAnchorElem);
  const isQueuePopoverOpen = Boolean(queuePopoverAnchorElem);

  React.useEffect(() => {
    if (state.endTimeOption === "real_time") {
      const id = setInterval(() => {
        props.onEndTimeChange(currentUnixtime(), /*isEndTimeFixed=*/ false);
      }, props.pollInterval * 1000);
      return () => clearInterval(id);
    }
  });

  const shiftBy = (deltaSec: number) => {
    return () => {
      const now = currentUnixtime();
      const endTime = props.endTimeSec + deltaSec;
      if (now <= endTime) {
        setState((prevState) => ({
          ...prevState,
          customEndTime: "",
          endTimeOption: "real_time",
        }));
        props.onEndTimeChange(now, /*isEndTimeFixed=*/ false);
        return;
      }
      setState((prevState) => ({
        ...prevState,
        endTimeOption: "custom",
        customEndTime: new Date(endTime * 1000).toISOString(),
      }));
      props.onEndTimeChange(endTime, /*isEndTimeFixed=*/ true);
    };
  };

  return (
    <div className={classes.root}>
      <Typography
        variant="caption"
        color="textPrimary"
        className={classes.endTimeCaption}
      >
        {formatTime(props.endTimeSec)}
      </Typography>
      <div>
        <Button
          aria-describedby={isTimePopoverOpen ? "time-popover" : undefined}
          variant="outlined"
          color="primary"
          onClick={handleOpenTimePopover}
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
          id={isTimePopoverOpen ? "time-popover" : undefined}
          open={isTimePopoverOpen}
          anchorEl={timePopoverAnchorElem}
          onClose={handleCloseTimePopover}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
        >
          <div className={classes.endTimeShiftControls}>
            <div className={classes.leftShiftButtons}>
              <ShiftButton
                direction="left"
                text="2h"
                onClick={shiftBy(-2 * hour)}
                dense={true}
              />
              <ShiftButton
                direction="left"
                text="1h"
                onClick={shiftBy(-1 * hour)}
                dense={true}
              />
              <ShiftButton
                direction="left"
                text="30m"
                onClick={shiftBy(-30 * minute)}
                dense={true}
              />
              <ShiftButton
                direction="left"
                text="15m"
                onClick={shiftBy(-15 * minute)}
                dense={true}
              />
              <ShiftButton
                direction="left"
                text="5m"
                onClick={shiftBy(-5 * minute)}
                dense={true}
              />
            </div>
            <div className={classes.rightShiftButtons}>
              <ShiftButton
                direction="right"
                text="5m"
                onClick={shiftBy(5 * minute)}
                dense={true}
              />
              <ShiftButton
                direction="right"
                text="15m"
                onClick={shiftBy(15 * minute)}
                dense={true}
              />
              <ShiftButton
                direction="right"
                text="30m"
                onClick={shiftBy(30 * minute)}
                dense={true}
              />
              <ShiftButton
                direction="right"
                text="1h"
                onClick={shiftBy(1 * hour)}
                dense={true}
              />
              <ShiftButton
                direction="right"
                text="2h"
                onClick={shiftBy(2 * hour)}
                dense={true}
              />
            </div>
          </div>
          <div className={classes.controlSelectorBox}>
            <div className={classes.controlEndTimeSelector}>
              <FormControl
                component="fieldset"
                margin="dense"
                classes={{ root: classes.formControlRoot }}
              >
                <FormLabel className={classes.formLabel} component="legend">
                  End Time
                </FormLabel>
                <RadioGroup
                  aria-label="end_time"
                  name="end_time"
                  value={state.endTimeOption}
                  onChange={handleEndTimeOptionChange}
                >
                  <RadioInput value="real_time" label="Real Time" />
                  <RadioInput value="freeze_at_now" label="Freeze at now" />
                  <RadioInput value="custom" label="Custom End Time" />
                </RadioGroup>
                <div className={classes.customInputField}>
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
                <FormLabel className={classes.formLabel} component="legend">
                  Duration
                </FormLabel>
                <RadioGroup
                  aria-label="duration"
                  name="duration"
                  value={state.durationOption}
                  onChange={handleDurationOptionChange}
                >
                  <RadioInput value="1h" label="1h" />
                  <RadioInput value="6h" label="6h" />
                  <RadioInput value="1d" label="1 day" />
                  <RadioInput value="8d" label="8 days" />
                  <RadioInput value="30d" label="30 days" />
                  <RadioInput value="custom" label="Custom Duration" />
                </RadioGroup>
                <div className={classes.customInputField}>
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
      <div className={classes.shiftButtons}>
        <ButtonGroup
          classes={{ root: classes.buttonGroupRoot }}
          size="small"
          color="primary"
          aria-label="shift buttons"
        >
          <ShiftButton
            direction="left"
            text={
              state.durationOption === "custom" ? "1h" : state.durationOption
            }
            color="primary"
            onClick={
              state.durationOption === "custom"
                ? shiftBy(-1 * hour)
                : shiftBy(-props.durationSec)
            }
          />
          <ShiftButton
            direction="right"
            text={
              state.durationOption === "custom" ? "1h" : state.durationOption
            }
            color="primary"
            onClick={
              state.durationOption === "custom"
                ? shiftBy(1 * hour)
                : shiftBy(props.durationSec)
            }
          />
        </ButtonGroup>
      </div>
      <div className={classes.filterButton}>
        <IconButton
          aria-label="filter"
          size="small"
          onClick={handleOpenQueuePopover}
        >
          <FilterListIcon />
        </IconButton>
        <Popover
          id={isQueuePopoverOpen ? "queue-popover" : undefined}
          open={isQueuePopoverOpen}
          anchorEl={queuePopoverAnchorElem}
          onClose={handleCloseQueuePopover}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
        >
          <FormControl className={classes.queueFilters}>
            <FormLabel className={classes.formLabel} component="legend">
              Queues
            </FormLabel>
            <FormGroup>
              {props.queues.map((qname) => (
                <FormControlLabel
                  key={qname}
                  control={
                    <Checkbox
                      size="small"
                      checked={props.selectedQueues.includes(qname)}
                      onChange={() => {
                        if (props.selectedQueues.includes(qname)) {
                          props.removeQueue(qname);
                        } else {
                          props.addQueue(qname);
                        }
                      }}
                      name={qname}
                      className={classes.checkbox}
                    />
                  }
                  label={qname}
                  classes={{ label: classes.formControlLabel }}
                />
              ))}
            </FormGroup>
          </FormControl>
        </Popover>
      </div>
    </div>
  );
}

/****************** Helper functions/components *******************/

function formatTime(unixtime: number): string {
  const tz = new Date(unixtime * 1000)
    .toLocaleTimeString("en-us", { timeZoneName: "short" })
    .split(" ")[2];
  return dayjs.unix(unixtime).format("ddd, DD MMM YYYY HH:mm:ss ") + tz;
}

interface RadioInputProps {
  value: string;
  label: string;
}

function RadioInput(props: RadioInputProps) {
  const classes = useStyles();
  return (
    <FormControlLabel
      classes={{ label: classes.formControlLabel }}
      value={props.value}
      control={
        <Radio size="small" classes={{ root: classes.radioButtonRoot }} />
      }
      label={props.label}
    />
  );
}

interface ShiftButtonProps extends ButtonProps {
  text: string;
  onClick: () => void;
  direction: "left" | "right";
  dense?: boolean;
}

const useShiftButtonStyles = makeStyles((theme: Theme) => ({
  root: {
    minWidth: 40,
    fontWeight: (props: ShiftButtonProps) => (props.dense ? 400 : 500),
  },
  label: { fontSize: 12, textTransform: "none" },
  iconRoot: {
    marginRight: (props: ShiftButtonProps) =>
      props.direction === "left" ? (props.dense ? -8 : -4) : 0,
    marginLeft: (props: ShiftButtonProps) =>
      props.direction === "right" ? (props.dense ? -8 : -4) : 0,
    color: (props: ShiftButtonProps) =>
      props.color
        ? props.color
        : theme.palette.grey[isDarkTheme(theme) ? 200 : 700],
  },
}));

function ShiftButton(props: ShiftButtonProps) {
  const classes = useShiftButtonStyles(props);
  return (
    <Button
      {...props}
      classes={{
        root: classes.root,
        label: classes.label,
      }}
      size="small"
    >
      {props.direction === "left" && (
        <ArrowLeftIcon classes={{ root: classes.iconRoot }} />
      )}
      {props.text}
      {props.direction === "right" && (
        <ArrowRightIcon classes={{ root: classes.iconRoot }} />
      )}
    </Button>
  );
}

ShiftButton.defaultProps = {
  dense: false,
};

export default connect(mapStateToProps)(MetricsFetchControls);
