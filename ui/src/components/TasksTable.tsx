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
  heading: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  tabsContainer: {
    // background:
    //   theme.palette.type === "dark"
    //     ? "#303030"
    //     : theme.palette.background.default,
  },
  tabsRoot: {
    // background:
    //   theme.palette.type === "dark"
    //     ? "#303030"
    //     : theme.palette.background.default,
  },
  tabsIndicator: {
    right: "auto",
    left: "0",
  },
  tabroot: {
    flexGrow: 1,
    textAlign: "center",
    padding: theme.spacing(2),
  },
  tabwrapper: {
    alignItems: "center",
    color: theme.palette.text.primary,
  },
  tabSelected: {
    background: theme.palette.background.paper,
  },
  panelContainer: {},
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
    <Paper variant="outlined" className={classes.container}>
      <Typography color="textPrimary" className={classes.heading}>
        Tasks list
      </Typography>
      <div className={classes.tabsContainer}>
        <Tabs
          value={props.selected}
          onChange={(_, value: string) =>
            history.push(queueDetailsPath(props.queue, value))
          }
          aria-label="tasks table"
          classes={{ root: classes.tabsRoot, indicator: classes.tabsIndicator }}
        >
          <Tab
            value="active"
            label={`Active (${currentStats.active})`}
            classes={{
              root: classes.tabroot,
              wrapper: classes.tabwrapper,
              selected: classes.tabSelected,
            }}
            {...a11yProps("active")}
          />
          <Tab
            value="pending"
            label={`Pending (${currentStats.pending})`}
            classes={{
              root: classes.tabroot,
              wrapper: classes.tabwrapper,
              selected: classes.tabSelected,
            }}
            {...a11yProps("pending")}
          />
          <Tab
            value="scheduled"
            label={`Scheduled (${currentStats.scheduled})`}
            classes={{
              root: classes.tabroot,
              wrapper: classes.tabwrapper,
              selected: classes.tabSelected,
            }}
            {...a11yProps("scheduled")}
          />
          <Tab
            value="retry"
            label={`Retry (${currentStats.retry})`}
            classes={{
              root: classes.tabroot,
              wrapper: classes.tabwrapper,
              selected: classes.tabSelected,
            }}
            {...a11yProps("retry")}
          />
          <Tab
            value="archived"
            label={`Archived (${currentStats.archived})`}
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
          <ActiveTasksTable queue={props.queue} />
        </div>
      </TabPanel>
      <TabPanel value="pending" selected={props.selected}>
        <div className={classes.panelContainer}>
          <PendingTasksTable
            queue={props.queue}
            totalTaskCount={currentStats.pending}
          />
        </div>
      </TabPanel>
      <TabPanel value="scheduled" selected={props.selected}>
        <div className={classes.panelContainer}>
          <ScheduledTasksTable
            queue={props.queue}
            totalTaskCount={currentStats.scheduled}
          />
        </div>
      </TabPanel>
      <TabPanel value="retry" selected={props.selected}>
        <div className={classes.panelContainer}>
          <RetryTasksTable
            queue={props.queue}
            totalTaskCount={currentStats.retry}
          />
        </div>
      </TabPanel>
      <TabPanel value="archived" selected={props.selected}>
        <div className={classes.panelContainer}>
          <ArchivedTasksTable
            queue={props.queue}
            totalTaskCount={currentStats.archived}
          />
        </div>
      </TabPanel>
    </Paper>
  );
}

export default connector(TasksTable);
