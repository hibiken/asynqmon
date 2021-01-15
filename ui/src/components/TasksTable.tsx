import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import ActiveTasksTable from "./ActiveTasksTable";
import PendingTasksTable from "./PendingTasksTable";
import ScheduledTasksTable from "./ScheduledTasksTable";
import RetryTasksTable from "./RetryTasksTable";
import ArchivedTasksTable from "./ArchivedTasksTable";
import { useHistory } from "react-router-dom";
import { queueDetailsPath } from "../paths";
import { QueueInfo } from "../reducers/queuesReducer";
import { AppState } from "../store";

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

function a11yProps(value: string) {
  return {
    id: `scrollable-auto-tab-${value}`,
    "aria-controls": `scrollable-auto-tabpanel-${value}`,
  };
}

const usePanelHeadingStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
    display: "flex",
    justifyContent: "space-between",
  },
}));

function PanelHeading(props: {
  queue: string;
  processed: number;
  failed: number;
  paused: boolean;
}) {
  const classes = usePanelHeadingStyles();
  return (
    <Paper variant="outlined" className={classes.paper}>
      <div>
        <Typography variant="overline" display="block">
          Queue Name
        </Typography>
        <Typography variant="h5">{props.queue}</Typography>
      </div>

      <div>
        <Typography variant="overline" display="block">
          Processed Today (UTC)
        </Typography>
        <Typography variant="h5">{props.processed}</Typography>
      </div>
      <div>
        <Typography variant="overline" display="block">
          Failed Today (UTC)
        </Typography>
        <Typography variant="h5">{props.failed}</Typography>
      </div>
      <div>
        <Typography variant="overline" display="block">
          Paused
        </Typography>
        <Typography variant="h5">{props.paused ? "YES" : "No"}</Typography>
      </div>
    </Paper>
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
    display: "flex",
    width: "100%",
    height: "100%",
    background: theme.palette.background.paper,
  },
  heading: {
    fontSize: "1.7rem",
    fontWeight: 500,
    paddingLeft: "28px", // TODO: maybe use theme.spacing(3),
    paddingTop: "28px",
    paddingBottom: "28px",
    color: theme.palette.text.primary,
  },
  tabsContainer: {
    background:
      theme.palette.type === "dark"
        ? "#303030"
        : theme.palette.background.default,
  },
  tabsRoot: {
    paddingLeft: theme.spacing(2),
    background:
      theme.palette.type === "dark"
        ? "#303030"
        : theme.palette.background.default,
  },
  tabsIndicator: {
    right: "auto",
    left: "0",
  },
  tabroot: {
    width: "204px",
    textAlign: "left",
    padding: theme.spacing(2),
  },
  tabwrapper: {
    alignItems: "flex-start",
    color: theme.palette.text.primary,
  },
  tabSelected: {
    background: theme.palette.background.paper,
    boxShadow: theme.shadows[1],
  },
  panelContainer: {
    padding: "24px",
  },
  taskCount: {
    fontSize: "2rem",
    fontWeight: 600,
    margin: 0,
  },
}));

function TasksTable(props: Props & ReduxProps) {
  const { currentStats } = props;
  const classes = useStyles();
  const history = useHistory();

  return (
    <div className={classes.container}>
      <div className={classes.tabsContainer}>
        <div className={classes.heading}>Tasks</div>
        <Tabs
          value={props.selected}
          onChange={(_, value: string) =>
            history.push(queueDetailsPath(props.queue, value))
          }
          aria-label="tasks table"
          orientation="vertical"
          classes={{ root: classes.tabsRoot, indicator: classes.tabsIndicator }}
        >
          <Tab
            value="active"
            label="Active"
            icon={
              <div className={classes.taskCount}>{currentStats.active}</div>
            }
            classes={{
              root: classes.tabroot,
              wrapper: classes.tabwrapper,
              selected: classes.tabSelected,
            }}
            {...a11yProps("active")}
          />
          <Tab
            value="pending"
            label="Pending"
            icon={
              <div className={classes.taskCount}>{currentStats.pending}</div>
            }
            classes={{
              root: classes.tabroot,
              wrapper: classes.tabwrapper,
              selected: classes.tabSelected,
            }}
            {...a11yProps("pending")}
          />
          <Tab
            value="scheduled"
            label="Scheduled"
            icon={
              <div className={classes.taskCount}>{currentStats.scheduled}</div>
            }
            classes={{
              root: classes.tabroot,
              wrapper: classes.tabwrapper,
              selected: classes.tabSelected,
            }}
            {...a11yProps("scheduled")}
          />
          <Tab
            value="retry"
            label="Retry"
            icon={<div className={classes.taskCount}>{currentStats.retry}</div>}
            classes={{
              root: classes.tabroot,
              wrapper: classes.tabwrapper,
              selected: classes.tabSelected,
            }}
            {...a11yProps("retry")}
          />
          <Tab
            value="archived"
            label="Archived"
            icon={
              <div className={classes.taskCount}>{currentStats.archived}</div>
            }
            classes={{
              root: classes.tabroot,
              wrapper: classes.tabwrapper,
              selected: classes.tabSelected,
            }}
            {...a11yProps("archived")}
          />
        </Tabs>
      </div>
      <TabPanel value="active" selected={props.selected}>
        <div className={classes.panelContainer}>
          <PanelHeading
            queue={props.queue}
            processed={currentStats.processed}
            failed={currentStats.failed}
            paused={currentStats.paused}
          />
          <ActiveTasksTable queue={props.queue} />
        </div>
      </TabPanel>
      <TabPanel value="pending" selected={props.selected}>
        <div className={classes.panelContainer}>
          <PanelHeading
            queue={props.queue}
            processed={currentStats.processed}
            failed={currentStats.failed}
            paused={currentStats.paused}
          />
          <PendingTasksTable
            queue={props.queue}
            totalTaskCount={currentStats.pending}
          />
        </div>
      </TabPanel>
      <TabPanel value="scheduled" selected={props.selected}>
        <div className={classes.panelContainer}>
          <PanelHeading
            queue={props.queue}
            processed={currentStats.processed}
            failed={currentStats.failed}
            paused={currentStats.paused}
          />
          <ScheduledTasksTable
            queue={props.queue}
            totalTaskCount={currentStats.scheduled}
          />
        </div>
      </TabPanel>
      <TabPanel value="retry" selected={props.selected}>
        <div className={classes.panelContainer}>
          <PanelHeading
            queue={props.queue}
            processed={currentStats.processed}
            failed={currentStats.failed}
            paused={currentStats.paused}
          />
          <RetryTasksTable
            queue={props.queue}
            totalTaskCount={currentStats.retry}
          />
        </div>
      </TabPanel>
      <TabPanel value="archived" selected={props.selected}>
        <div className={classes.panelContainer}>
          <PanelHeading
            queue={props.queue}
            processed={currentStats.processed}
            failed={currentStats.failed}
            paused={currentStats.paused}
          />
          <ArchivedTasksTable
            queue={props.queue}
            totalTaskCount={currentStats.archived}
          />
        </div>
      </TabPanel>
    </div>
  );
}

export default connector(TasksTable);
