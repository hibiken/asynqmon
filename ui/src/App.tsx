import React, { useState } from "react";
import clsx from "clsx";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Drawer from "@material-ui/core/Drawer";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import BarChartIcon from "@material-ui/icons/BarChart";
import LayersIcon from "@material-ui/icons/Layers";
import SettingsIcon from "@material-ui/icons/Settings";
import { paths } from "./paths";
import ListItemLink from "./components/ListItemLink";
import CronView from "./views/CronView";
import DashboardView from "./views/DashboardView";
import TasksView from "./views/TasksView";
import SettingsView from "./views/SettingsView";

const drawerWidth = 220;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: "0 8px",
    ...theme.mixins.toolbar,
  },
  appBar: {
    backgroundColor: theme.palette.background.paper,
    zIndex: theme.zIndex.drawer + 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
    color: theme.palette.grey[700],
  },
  menuButtonHidden: {
    display: "none",
  },
  title: {
    flexGrow: 1,
    color: theme.palette.grey[800],
  },
  drawerPaper: {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    border: "none",
  },
  drawerPaperClose: {
    overflowX: "hidden",
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing(9),
    },
  },
  appBarSpacer: theme.mixins.toolbar,
  mainContainer: {
    display: "flex",
    width: "100vw",
  },
  content: {
    flex: 1,
    height: "100vh",
    overflow: "hidden",
    background: "#ffffff",
  },
  contentWrapper: {
    height: "100%",
    display: "flex",
    paddingTop: "64px", // app-bar height
    overflow: "scroll",
  },
  sidebarContainer: {
    display: "flex",
    justifyContent: "space-between",
    height: "100%",
    flexDirection: "column",
  },
}));

function App() {
  const classes = useStyles();
  const [open, setOpen] = useState(true);
  const toggleDrawer = () => {
    setOpen(!open);
  };
  return (
    <Router>
      <div className={classes.root}>
        <AppBar
          position="absolute"
          className={classes.appBar}
          variant="outlined"
        >
          <Toolbar className={classes.toolbar}>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={toggleDrawer}
              className={classes.menuButton}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              className={classes.title}
            >
              Asynq Monitoring
            </Typography>
          </Toolbar>
        </AppBar>
        <div className={classes.mainContainer}>
          <Drawer
            variant="permanent"
            classes={{
              paper: clsx(
                classes.drawerPaper,
                !open && classes.drawerPaperClose
              ),
            }}
            open={open}
          >
            <div className={classes.appBarSpacer} />
            <div className={classes.sidebarContainer}>
              <List>
                <div>
                  <ListItemLink
                    to="/"
                    primary="Queues"
                    icon={<BarChartIcon />}
                  />
                  <ListItemLink
                    to="/cron"
                    primary="Cron"
                    icon={<LayersIcon />}
                  />
                </div>
              </List>
              <List>
                <ListItemLink
                  to="/settings"
                  primary="Settings"
                  icon={<SettingsIcon />}
                />
              </List>
            </div>
          </Drawer>
          <main className={classes.content}>
            <div className={classes.contentWrapper}>
              <Switch>
                <Route exact path={paths.QUEUE_DETAILS}>
                  <TasksView />
                </Route>
                <Route exact path={paths.CRON}>
                  <CronView />
                </Route>
                <Route exact path={paths.SETTINGS}>
                  <SettingsView />
                </Route>
                <Route path={paths.HOME}>
                  <DashboardView />
                </Route>
              </Switch>
            </div>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
