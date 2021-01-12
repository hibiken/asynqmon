import React from "react";
import { connect, ConnectedProps } from "react-redux";
import styled from "styled-components";
import { makeStyles } from "@material-ui/core/styles";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import ActiveTasksTable from "./ActiveTasksTable";
import PendingTasksTable from "./PendingTasksTable";
import ScheduledTasksTable from "./ScheduledTasksTable";
import RetryTasksTable from "./RetryTasksTable";
import ArchivedTasksTable from "./ArchivedTasksTable";
import { useHistory } from "react-router-dom";
import { queueDetailsPath } from "../paths";
import { Typography } from "@material-ui/core";
import Paper from "@material-ui/core/Paper/Paper";
import { QueueInfo } from "../reducers/queuesReducer";
import { AppState } from "../store";

interface TabPanelProps {
  children?: React.ReactNode;
  selected: string; // currently selected value
  value: string; // tab panel will be shown if selected value equals to the value
}

const TabPanelRoot = styled.div`
  flex: 1;
  overflow-y: scroll;
`;

function TabPanel(props: TabPanelProps) {
  const { children, value, selected, ...other } = props;

  return (
    <TabPanelRoot
      role="tabpanel"
      hidden={value !== selected}
      id={`scrollable-auto-tabpanel-${selected}`}
      aria-labelledby={`scrollable-auto-tab-${selected}`}
      {...other}
    >
      {value === selected && children}
    </TabPanelRoot>
  );
}

function a11yProps(value: string) {
  return {
    id: `scrollable-auto-tab-${value}`,
    "aria-controls": `scrollable-auto-tabpanel-${value}`,
  };
}

const Container = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
`;

const TaskCount = styled.div`
  font-size: 2rem;
  font-weight: 600;
  margin: 0;
`;

const Heading = styled.div`
  opacity: 0.7;
  font-size: 1.7rem;
  font-weight: 500;
  background: #f5f7f9;
  padding-left: 28px;
  padding-top: 28px;
  padding-bottom: 28px;
`;

const PanelContainer = styled.div`
  padding: 24px;
  background: #ffffff;
`;

const TabsContainer = styled.div`
  background: #f5f7f9;
`;

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
    display: "flex",
    justifyContent: "space-between",
  },
  heading: {
    padingLeft: theme.spacing(2),
  },
  tabsRoot: {
    paddingLeft: theme.spacing(2),
    background: theme.palette.background.default,
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
  },
  tabSelected: {
    background: theme.palette.common.white,
    boxShadow: theme.shadows[1],
  },
}));

function PanelHeading(props: {
  queue: string;
  processed: number;
  failed: number;
  paused: boolean;
}) {
  const classes = useStyles();
  return (
    <Paper className={classes.paper}>
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

function TasksTable(props: Props & ReduxProps) {
  const { currentStats } = props;
  const classes = useStyles();
  const history = useHistory();

  return (
    <Container>
      <TabsContainer>
        <Heading>Tasks</Heading>
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
            icon={<TaskCount>{currentStats.active}</TaskCount>}
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
            icon={<TaskCount>{currentStats.pending}</TaskCount>}
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
            icon={<TaskCount>{currentStats.scheduled}</TaskCount>}
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
            icon={<TaskCount>{currentStats.retry}</TaskCount>}
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
            icon={<TaskCount>{currentStats.archived}</TaskCount>}
            classes={{
              root: classes.tabroot,
              wrapper: classes.tabwrapper,
              selected: classes.tabSelected,
            }}
            {...a11yProps("archived")}
          />
        </Tabs>
      </TabsContainer>
      <TabPanel value="active" selected={props.selected}>
        <PanelContainer>
          <PanelHeading
            queue={props.queue}
            processed={currentStats.processed}
            failed={currentStats.failed}
            paused={currentStats.paused}
          />
          <ActiveTasksTable queue={props.queue} />
        </PanelContainer>
      </TabPanel>
      <TabPanel value="pending" selected={props.selected}>
        <PanelContainer>
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
        </PanelContainer>
      </TabPanel>
      <TabPanel value="scheduled" selected={props.selected}>
        <PanelContainer>
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
        </PanelContainer>
      </TabPanel>
      <TabPanel value="retry" selected={props.selected}>
        <PanelContainer>
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
        </PanelContainer>
      </TabPanel>
      <TabPanel value="archived" selected={props.selected}>
        <PanelContainer>
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
        </PanelContainer>
      </TabPanel>
    </Container>
  );
}

export default connector(TasksTable);
