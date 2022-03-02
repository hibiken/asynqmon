import React from "react";
import { connect, ConnectedProps } from "react-redux";
import clsx from "clsx";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { makeStyles, Theme, ThemeProvider } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Drawer from "@material-ui/core/Drawer";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Snackbar from "@material-ui/core/Snackbar";
import SnackbarContent from "@material-ui/core/SnackbarContent";
import IconButton from "@material-ui/core/IconButton";
import Slide from "@material-ui/core/Slide";
import { TransitionProps } from "@material-ui/core/transitions";
import MenuIcon from "@material-ui/icons/Menu";
import BarChartIcon from "@material-ui/icons/BarChart";
import LayersIcon from "@material-ui/icons/Layers";
import SettingsIcon from "@material-ui/icons/Settings";
import ScheduleIcon from "@material-ui/icons/Schedule";
import FeedbackIcon from "@material-ui/icons/Feedback";
import TimelineIcon from "@material-ui/icons/Timeline";
import DoubleArrowIcon from "@material-ui/icons/DoubleArrow";
import CloseIcon from "@material-ui/icons/Close";
import { AppState } from "./store";
import { paths as getPaths } from "./paths";
import { isDarkTheme, useTheme } from "./theme";
import { closeSnackbar } from "./actions/snackbarActions";
import { toggleDrawer } from "./actions/settingsActions";
import ListItemLink from "./components/ListItemLink";
import SchedulersView from "./views/SchedulersView";
import DashboardView from "./views/DashboardView";
import TasksView from "./views/TasksView";
import TaskDetailsView from "./views/TaskDetailsView";
import SettingsView from "./views/SettingsView";
import ServersView from "./views/ServersView";
import RedisInfoView from "./views/RedisInfoView";
import MetricsView from "./views/MetricsView";
import PageNotFoundView from "./views/PageNotFoundView";
import { ReactComponent as Logo } from "./images/logo-color.svg";
import { ReactComponent as LogoDarkTheme } from "./images/logo-white.svg";

const drawerWidth = 220;

// FIXME: For some reason, the following code does not work:
//     makeStyles(theme => ({ /* use theme here */}));
// Using closure to work around this problem.
const useStyles = (theme: Theme) =>
  makeStyles({
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
      marginRight: theme.spacing(1),
      color: isDarkTheme(theme)
        ? theme.palette.grey[100]
        : theme.palette.grey[700],
    },
    menuButtonHidden: {
      display: "none",
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
    snackbar: {
      background: theme.palette.grey["A400"],
      color: "#ffffff",
    },
    snackbarCloseIcon: {
      color: theme.palette.grey[400],
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
      background: theme.palette.background.paper,
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
    listItem: {
      borderTopRightRadius: "24px",
      borderBottomRightRadius: "24px",
    },
  });

function mapStateToProps(state: AppState) {
  return {
    snackbar: state.snackbar,
    themePreference: state.settings.themePreference,
    isDrawerOpen: state.settings.isDrawerOpen,
  };
}

const mapDispatchToProps = {
  closeSnackbar,
  toggleDrawer,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

function SlideUpTransition(props: TransitionProps) {
  return <Slide {...props} direction="up" />;
}

function App(props: ConnectedProps<typeof connector>) {
  const theme = useTheme(props.themePreference);
  const classes = useStyles(theme)();
  const paths = getPaths();
  return (
    <ThemeProvider theme={theme}>
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
                onClick={props.toggleDrawer}
                className={classes.menuButton}
              >
                <MenuIcon />
              </IconButton>
              {isDarkTheme(theme) ? (
                <LogoDarkTheme width={200} height={48} />
              ) : (
                <Logo width={200} height={48} />
              )}
            </Toolbar>
          </AppBar>
          <div className={classes.mainContainer}>
            <Drawer
              variant="permanent"
              classes={{
                paper: clsx(
                  classes.drawerPaper,
                  !props.isDrawerOpen && classes.drawerPaperClose
                ),
              }}
              open={props.isDrawerOpen}
            >
              <Snackbar
                anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                open={props.snackbar.isOpen}
                autoHideDuration={6000}
                onClose={props.closeSnackbar}
                TransitionComponent={SlideUpTransition}
              >
                <SnackbarContent
                  message={props.snackbar.message}
                  className={classes.snackbar}
                  action={
                    <IconButton
                      size="small"
                      aria-label="close"
                      color="inherit"
                      onClick={props.closeSnackbar}
                    >
                      <CloseIcon
                        className={classes.snackbarCloseIcon}
                        fontSize="small"
                      />
                    </IconButton>
                  }
                />
              </Snackbar>
              <div className={classes.appBarSpacer} />
              <div className={classes.sidebarContainer}>
                <List>
                  <div>
                    <ListItemLink
                      to={paths.HOME}
                      primary="Queues"
                      icon={<BarChartIcon />}
                    />
                    <ListItemLink
                      to={paths.SERVERS}
                      primary="Servers"
                      icon={<DoubleArrowIcon />}
                    />
                    <ListItemLink
                      to={paths.SCHEDULERS}
                      primary="Schedulers"
                      icon={<ScheduleIcon />}
                    />
                    <ListItemLink
                      to={paths.REDIS}
                      primary="Redis"
                      icon={<LayersIcon />}
                    />
                    {window.PROMETHEUS_SERVER_ADDRESS && (
                      <ListItemLink
                        to={paths.QUEUE_METRICS}
                        primary="Metrics"
                        icon={<TimelineIcon />}
                      />
                    )}
                  </div>
                </List>
                <List>
                  <ListItemLink
                    to={paths.SETTINGS}
                    primary="Settings"
                    icon={<SettingsIcon />}
                  />
                  <ListItem
                    button
                    component="a"
                    className={classes.listItem}
                    href="https://github.com/hibiken/asynqmon/issues"
                    target="_blank"
                  >
                    <ListItemIcon>
                      <FeedbackIcon />
                    </ListItemIcon>
                    <ListItemText primary="Send Feedback" />
                  </ListItem>
                </List>
              </div>
            </Drawer>
            <main className={classes.content}>
              <div className={classes.contentWrapper}>
                <Switch>
                  <Route exact path={paths.TASK_DETAILS}>
                    <TaskDetailsView />
                  </Route>
                  <Route exact path={paths.QUEUE_DETAILS}>
                    <TasksView />
                  </Route>
                  <Route exact path={paths.SCHEDULERS}>
                    <SchedulersView />
                  </Route>
                  <Route exact path={paths.SERVERS}>
                    <ServersView />
                  </Route>
                  <Route exact path={paths.REDIS}>
                    <RedisInfoView />
                  </Route>
                  <Route exact path={paths.SETTINGS}>
                    <SettingsView />
                  </Route>
                  <Route exact path={paths.HOME}>
                    <DashboardView />
                  </Route>
                  <Route exact path={paths.QUEUE_METRICS}>
                    <MetricsView />
                  </Route>
                  <Route path="*">
                    <PageNotFoundView />
                  </Route>
                </Switch>
              </div>
            </main>
          </div>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default connector(App);
