import React, { useState, useCallback } from "react";
import { connect, ConnectedProps } from "react-redux";
import { makeStyles, useTheme, Theme } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import Alert from "@material-ui/lab/Alert";
import AlertTitle from "@material-ui/lab/AlertTitle";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableFooter from "@material-ui/core/TableFooter";
import TablePagination from "@material-ui/core/TablePagination";
import Tooltip from "@material-ui/core/Tooltip";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Checkbox from "@material-ui/core/Checkbox";
import Collapse from "@material-ui/core/Collapse";
import IconButton from "@material-ui/core/IconButton";
import CancelIcon from "@material-ui/icons/Cancel";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import Typography from "@material-ui/core/Typography";
import SyntaxHighlighter from "./SyntaxHighlighter";
import {
  listActiveTasksAsync,
  cancelActiveTaskAsync,
  batchCancelActiveTasksAsync,
  cancelAllActiveTasksAsync,
} from "../actions/tasksActions";
import { AppState } from "../store";
import TablePaginationActions, {
  rowsPerPageOptions,
  defaultPageSize,
} from "./TablePaginationActions";
import TableActions from "./TableActions";
import { usePolling } from "../hooks";
import { ActiveTaskExtended } from "../reducers/tasksReducer";
import { timeAgo, uuidPrefix } from "../utils";
import { TableColumn } from "../types/table";

const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 650,
  },
  stickyHeaderCell: {
    background: theme.palette.background.paper,
  },
  iconCell: {
    width: "70px",
  },
}));

function mapStateToProps(state: AppState) {
  return {
    loading: state.tasks.activeTasks.loading,
    error: state.tasks.activeTasks.error,
    tasks: state.tasks.activeTasks.data,
    batchActionPending: state.tasks.activeTasks.batchActionPending,
    allActionPending: state.tasks.activeTasks.allActionPending,
    pollInterval: state.settings.pollInterval,
  };
}

const mapDispatchToProps = {
  listActiveTasksAsync,
  cancelActiveTaskAsync,
  batchCancelActiveTasksAsync,
  cancelAllActiveTasksAsync,
};

const columns: TableColumn[] = [
  { key: "id", label: "ID", align: "left" },
  { key: "type", label: "Type", align: "left" },
  { key: "status", label: "Status", align: "left" },
  { key: "start-time", label: "Started", align: "left" },
  { key: "actions", label: "Actions", align: "center" },
];

const connector = connect(mapStateToProps, mapDispatchToProps);

type ReduxProps = ConnectedProps<typeof connector>;

interface Props {
  queue: string; // name of the queue
}

function ActiveTasksTable(props: Props & ReduxProps) {
  const { pollInterval, listActiveTasksAsync, queue } = props;
  const classes = useStyles();
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [activeTaskId, setActiveTaskId] = useState<string>("");

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setPageSize(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = props.tasks.map((t) => t.id);
      setSelectedIds(newSelected);
    } else {
      setSelectedIds([]);
    }
  };

  const handleCancelAllClick = () => {
    props.cancelAllActiveTasksAsync(queue);
  };

  const handleBatchCancelClick = () => {
    props
      .batchCancelActiveTasksAsync(queue, selectedIds)
      .then(() => setSelectedIds([]));
  };

  const fetchData = useCallback(() => {
    const pageOpts = { page: page + 1, size: pageSize };
    listActiveTasksAsync(queue, pageOpts);
  }, [page, pageSize, queue, listActiveTasksAsync]);

  usePolling(fetchData, pollInterval);

  if (props.error.length > 0) {
    return (
      <Alert severity="error">
        <AlertTitle>Error</AlertTitle>
        {props.error}
      </Alert>
    );
  }

  if (props.tasks.length === 0) {
    return (
      <Alert severity="info">
        <AlertTitle>Info</AlertTitle>
        No active tasks at this time.
      </Alert>
    );
  }

  const rowCount = props.tasks.length;
  const numSelected = selectedIds.length;
  return (
    <div>
      <TableActions
        showIconButtons={numSelected > 0}
        iconButtonActions={[
          {
            tooltip: "Cancel",
            icon: <CancelIcon />,
            onClick: handleBatchCancelClick,
            disabled: props.batchActionPending,
          },
        ]}
        menuItemActions={[
          {
            label: "Cancel All",
            onClick: handleCancelAllClick,
            disabled: props.allActionPending,
          },
        ]}
      />
      <TableContainer component={Paper}>
        <Table
          stickyHeader={true}
          className={classes.table}
          aria-label="active tasks table"
          size="small"
        >
          <TableHead>
            <TableRow>
              <TableCell
                padding="checkbox"
                classes={{ stickyHeader: classes.stickyHeaderCell }}
              >
                <Checkbox
                  indeterminate={numSelected > 0 && numSelected < rowCount}
                  checked={rowCount > 0 && numSelected === rowCount}
                  onChange={handleSelectAllClick}
                  inputProps={{
                    "aria-label": "select all tasks shown in the table",
                  }}
                />
              </TableCell>
              <TableCell
                classes={{
                  root: classes.iconCell,
                  stickyHeader: classes.stickyHeaderCell,
                }}
              />
              {columns.map((col) => (
                <TableCell
                  key={col.key}
                  align={col.align}
                  classes={{ stickyHeader: classes.stickyHeaderCell }}
                >
                  {col.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {/* TODO: loading and empty state */}
            {props.tasks.map((task) => (
              <Row
                key={task.id}
                task={task}
                isSelected={selectedIds.includes(task.id)}
                onSelectChange={(checked: boolean) => {
                  if (checked) {
                    setSelectedIds(selectedIds.concat(task.id));
                  } else {
                    setSelectedIds(selectedIds.filter((id) => id !== task.id));
                  }
                }}
                onCancelClick={() => {
                  props.cancelActiveTaskAsync(queue, task.id);
                }}
                onActionCellEnter={() => setActiveTaskId(task.id)}
                onActionCellLeave={() => setActiveTaskId("")}
                showActions={activeTaskId === task.id}
              />
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={rowsPerPageOptions}
                colSpan={columns.length + 2}
                count={props.tasks.length}
                rowsPerPage={pageSize}
                page={page}
                SelectProps={{
                  inputProps: { "aria-label": "rows per page" },
                  native: true,
                }}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
                ActionsComponent={TablePaginationActions}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </div>
  );
}

const useRowStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      borderBottom: "unset",
    },
  },
  taskDetails: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
  detailHeading: {
    paddingLeft: theme.spacing(1),
  },
  payloadContainer: {
    paddingRight: theme.spacing(2),
  },
  noBottomBorder: {
    borderBottom: "none",
  },
}));

interface RowProps {
  task: ActiveTaskExtended;
  isSelected: boolean;
  onSelectChange: (checked: boolean) => void;
  onCancelClick: () => void;
  showActions: boolean;
  onActionCellEnter: () => void;
  onActionCellLeave: () => void;
}

function Row(props: RowProps) {
  const { task } = props;
  const [open, setOpen] = React.useState(false);
  const theme = useTheme<Theme>();
  const classes = useRowStyles();
  return (
    <React.Fragment>
      <TableRow
        key={task.id}
        className={classes.root}
        selected={props.isSelected}
      >
        <TableCell padding="checkbox">
          <Checkbox
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              props.onSelectChange(event.target.checked)
            }
            checked={props.isSelected}
          />
        </TableCell>
        <TableCell>
          <Tooltip title={open ? "Hide Details" : "Show Details"}>
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => setOpen(!open)}
            >
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </Tooltip>
        </TableCell>
        <TableCell component="th" scope="row">
          {uuidPrefix(task.id)}
        </TableCell>
        <TableCell>{task.type}</TableCell>
        <TableCell>{task.canceling ? "Canceling" : "Running"}</TableCell>
        <TableCell>
          {task.start_time === "-" ? "just now" : timeAgo(task.start_time)}
        </TableCell>
        <TableCell
          align="center"
          onMouseEnter={props.onActionCellEnter}
          onMouseLeave={props.onActionCellLeave}
        >
          {props.showActions ? (
            <React.Fragment>
              <Tooltip title="Cancel">
                <IconButton
                  onClick={props.onCancelClick}
                  disabled={task.requestPending || task.canceling}
                  size="small"
                >
                  <CancelIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </React.Fragment>
          ) : (
            <IconButton size="small" onClick={props.onActionCellEnter}>
              <MoreHorizIcon fontSize="small" />
            </IconButton>
          )}
        </TableCell>
      </TableRow>
      <TableRow selected={props.isSelected}>
        <TableCell
          style={{ paddingBottom: 0, paddingTop: 0 }}
          colSpan={columns.length + 2}
        >
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Grid container className={classes.taskDetails}>
              <Grid item xs={8} className={classes.payloadContainer}>
                <Typography
                  variant="subtitle2"
                  color="textSecondary"
                  gutterBottom
                  component="div"
                  className={classes.detailHeading}
                >
                  Payload
                </Typography>
                <SyntaxHighlighter
                  language="json"
                  customStyle={{ borderRadius: theme.shape.borderRadius }}
                >
                  {JSON.stringify(task.payload, null, 2)}
                </SyntaxHighlighter>
              </Grid>
              <Grid item xs={4}>
                <Typography
                  variant="subtitle2"
                  color="textSecondary"
                  gutterBottom
                  component="div"
                  className={classes.detailHeading}
                >
                  Task Info
                </Typography>
                <Table size="small" aria-label="active workers">
                  <TableBody>
                    <TableRow>
                      <TableCell>Retry</TableCell>
                      <TableCell align="right">2/25</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Deadline</TableCell>
                      <TableCell align="right">In 30s</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className={classes.noBottomBorder}>
                        Unique
                      </TableCell>
                      <TableCell
                        align="right"
                        className={classes.noBottomBorder}
                      >
                        5m30s remaining
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </Grid>
            </Grid>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

export default connector(ActiveTasksTable);
