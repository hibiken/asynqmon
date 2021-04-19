import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Chip from "@material-ui/core/Chip";
import ActiveTasksTable from "./ActiveTasksTable";
import PendingTasksTable from "./PendingTasksTable";
import ScheduledTasksTable from "./ScheduledTasksTable";
import RetryTasksTable from "./RetryTasksTable";
import ArchivedTasksTable from "./ArchivedTasksTable";
import { useHistory } from "react-router-dom";
import { queueDetailsPath } from "../paths";
import { QueueInfo } from "../reducers/queuesReducer";
import { AppState } from "../store";
import { isDarkTheme } from "../theme";

interface TabPanelProps {
  children?: React.ReactNode;
  selected: string; // currently selected value
  value: string; // tab panel will be shown if selected value equals to the value
}

function TabPanel(props: TabPanelProps) {
  const { children, value, selected, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== selected}
      id={`scrollable-auto-tabpanel-${selected}`}
      aria-labelledby={`scrollable-auto-tab-${selected}`}
      style={{ flex: 1, overflowY: "scroll" }}
      {...other}
    >
      {value === selected && children}
    </div>
  );
}

function mapStatetoProps(state: AppState, ownProps: Props) {
  // TODO: Add loading state for each queue.
  const queueInfo = state.queues.data.find(
    (q: QueueInfo) => q.name === ownProps.queue
  );
  const currentStats = queueInfo
    ? queueInfo.currentStats
    : {
        queue: ownProps.queue,
        paused: false,
        size: 0,
        active: 0,
        pending: 0,
        scheduled: 0,
        retry: 0,
        archived: 0,
        processed: 0,
        failed: 0,
        timestamp: "n/a",
      };
  return { currentStats };
}

const connector = connect(mapStatetoProps);

type ReduxProps = ConnectedProps<typeof connector>;

interface Props {
  queue: string;
  selected: string;
}

const useStyles = makeStyles((theme) => ({
  container: {
    width: "100%",
    height: "100%",
    background: theme.palette.background.paper,
  },
  header: {
    display: "flex",
    alignItems: "center",
    paddingTop: theme.spacing(1),
  },
  heading: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
  chip: {
    marginLeft: theme.spacing(1),
  },
  taskcount: {
    fontSize: "12px",
    color: theme.palette.text.secondary,
    background: isDarkTheme(theme)
      ? "#303030"
      : theme.palette.background.default,
    textAlign: "center",
    padding: "3px 6px",
    borderRadius: "10px",
    marginLeft: "2px",
  },
}));

function TasksTable(props: Props & ReduxProps) {
  const { currentStats } = props;
  const classes = useStyles();
  const history = useHistory();
  const chips = [
    { key: "active", label: "Active", count: currentStats.active },
    { key: "pending", label: "Pending", count: currentStats.pending },
    { key: "scheduled", label: "Scheduled", count: currentStats.scheduled },
    { key: "retry", label: "Retry", count: currentStats.retry },
    { key: "archived", label: "Archived", count: currentStats.archived },
  ];

  return (
    <Paper variant="outlined" className={classes.container}>
      <div className={classes.header}>
        <Typography color="textPrimary" className={classes.heading}>
          Tasks
        </Typography>
        <div>
          {chips.map((c) => (
            <Chip
              key={c.key}
              className={classes.chip}
              label={
                <div>
                  {c.label} <span className={classes.taskcount}>{c.count}</span>
                </div>
              }
              variant="outlined"
              color={props.selected === c.key ? "primary" : "default"}
              onClick={() => history.push(queueDetailsPath(props.queue, c.key))}
            />
          ))}
        </div>
      </div>
      <TabPanel value="active" selected={props.selected}>
        <ActiveTasksTable queue={props.queue} />
      </TabPanel>
      <TabPanel value="pending" selected={props.selected}>
        <PendingTasksTable
          queue={props.queue}
          totalTaskCount={currentStats.pending}
        />
      </TabPanel>
      <TabPanel value="scheduled" selected={props.selected}>
        <ScheduledTasksTable
          queue={props.queue}
          totalTaskCount={currentStats.scheduled}
        />
      </TabPanel>
      <TabPanel value="retry" selected={props.selected}>
        <RetryTasksTable
          queue={props.queue}
          totalTaskCount={currentStats.retry}
        />
      </TabPanel>
      <TabPanel value="archived" selected={props.selected}>
        <ArchivedTasksTable
          queue={props.queue}
          totalTaskCount={currentStats.archived}
        />
      </TabPanel>
    </Paper>
  );
}

export default connector(TasksTable);
