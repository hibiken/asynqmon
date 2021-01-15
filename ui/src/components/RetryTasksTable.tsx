import React, { useCallback, useState } from "react";
import { connect, ConnectedProps } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableFooter from "@material-ui/core/TableFooter";
import TablePagination from "@material-ui/core/TablePagination";
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";
import Tooltip from "@material-ui/core/Tooltip";
import Checkbox from "@material-ui/core/Checkbox";
import Collapse from "@material-ui/core/Collapse";
import IconButton from "@material-ui/core/IconButton";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import DeleteIcon from "@material-ui/icons/Delete";
import ArchiveIcon from "@material-ui/icons/Archive";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import Typography from "@material-ui/core/Typography";
import Alert from "@material-ui/lab/Alert";
import AlertTitle from "@material-ui/lab/AlertTitle";
import SyntaxHighlighter from "react-syntax-highlighter";
import {
  batchDeleteRetryTasksAsync,
  batchRunRetryTasksAsync,
  batchArchiveRetryTasksAsync,
  deleteAllRetryTasksAsync,
  runAllRetryTasksAsync,
  archiveAllRetryTasksAsync,
  listRetryTasksAsync,
  deleteRetryTaskAsync,
  runRetryTaskAsync,
  archiveRetryTaskAsync,
} from "../actions/tasksActions";
import { AppState } from "../store";
import TablePaginationActions, {
  defaultPageSize,
  rowsPerPageOptions,
} from "./TablePaginationActions";
import TableActions from "./TableActions";
import { durationBefore, uuidPrefix } from "../utils";
import { usePolling } from "../hooks";
import { RetryTaskExtended } from "../reducers/tasksReducer";
import clsx from "clsx";
import { TableColumn } from "../types/table";

const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 650,
  },
  stickyHeaderCell: {
    background: theme.palette.background.paper,
  },
}));

function mapStateToProps(state: AppState) {
  return {
    loading: state.tasks.retryTasks.loading,
    tasks: state.tasks.retryTasks.data,
    batchActionPending: state.tasks.retryTasks.batchActionPending,
    allActionPending: state.tasks.retryTasks.allActionPending,
    pollInterval: state.settings.pollInterval,
  };
}

const mapDispatchToProps = {
  batchDeleteRetryTasksAsync,
  batchRunRetryTasksAsync,
  batchArchiveRetryTasksAsync,
  deleteAllRetryTasksAsync,
  runAllRetryTasksAsync,
  archiveAllRetryTasksAsync,
  listRetryTasksAsync,
  deleteRetryTaskAsync,
  runRetryTaskAsync,
  archiveRetryTaskAsync,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type ReduxProps = ConnectedProps<typeof connector>;

interface Props {
  queue: string; // name of the queue.
  totalTaskCount: number; // totoal number of scheduled tasks.
}

function RetryTasksTable(props: Props & ReduxProps) {
  const { pollInterval, listRetryTasksAsync, queue } = props;
  const classes = useStyles();
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
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
      const newSelected = props.tasks.map((t) => t.key);
      setSelectedKeys(newSelected);
    } else {
      setSelectedKeys([]);
    }
  };

  const handleRunAllClick = () => {
    props.runAllRetryTasksAsync(queue);
  };

  const handleDeleteAllClick = () => {
    props.deleteAllRetryTasksAsync(queue);
  };

  const handleArchiveAllClick = () => {
    props.archiveAllRetryTasksAsync(queue);
  };

  const handleBatchRunClick = () => {
    props
      .batchRunRetryTasksAsync(queue, selectedKeys)
      .then(() => setSelectedKeys([]));
  };

  const handleBatchDeleteClick = () => {
    props
      .batchDeleteRetryTasksAsync(queue, selectedKeys)
      .then(() => setSelectedKeys([]));
  };

  const handleBatchArchiveClick = () => {
    props
      .batchArchiveRetryTasksAsync(queue, selectedKeys)
      .then(() => setSelectedKeys([]));
  };

  const fetchData = useCallback(() => {
    const pageOpts = { page: page + 1, size: pageSize };
    listRetryTasksAsync(queue, pageOpts);
  }, [page, pageSize, queue, listRetryTasksAsync]);

  usePolling(fetchData, pollInterval);

  if (props.tasks.length === 0) {
    return (
      <Alert severity="info">
        <AlertTitle>Info</AlertTitle>
        No retry tasks at this time.
      </Alert>
    );
  }

  const columns: TableColumn[] = [
    { key: "icon", label: "", align: "left" },
    { key: "id", label: "ID", align: "left" },
    { key: "type", label: "Type", align: "left" },
    { key: "retry_in", label: "Retry In", align: "left" },
    { key: "last_error", label: "Last Error", align: "left" },
    { key: "retried", label: "Retried", align: "left" },
    { key: "max_retry", label: "Max Retry", align: "left" },
    { key: "actions", label: "Actions", align: "center" },
  ];

  const rowCount = props.tasks.length;
  const numSelected = selectedKeys.length;
  return (
    <div>
      <TableActions
        showIconButtons={numSelected > 0}
        iconButtonActions={[
          {
            tooltip: "Delete",
            icon: <DeleteIcon />,
            onClick: handleBatchDeleteClick,
            disabled: props.batchActionPending,
          },
          {
            tooltip: "Archive",
            icon: <ArchiveIcon />,
            onClick: handleBatchArchiveClick,
            disabled: props.batchActionPending,
          },
          {
            tooltip: "Run",
            icon: <PlayArrowIcon />,
            onClick: handleBatchRunClick,
            disabled: props.batchActionPending,
          },
        ]}
        menuItemActions={[
          {
            label: "Delete All",
            onClick: handleDeleteAllClick,
            disabled: props.allActionPending,
          },
          {
            label: "Archive All",
            onClick: handleArchiveAllClick,
            disabled: props.allActionPending,
          },
          {
            label: "Run All",
            onClick: handleRunAllClick,
            disabled: props.allActionPending,
          },
        ]}
      />
      <TableContainer component={Paper}>
        <Table
          stickyHeader={true}
          className={classes.table}
          aria-label="retry tasks table"
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
              {columns.map((col) => (
                <TableCell
                  key={col.label}
                  align={col.align}
                  classes={{ stickyHeader: classes.stickyHeaderCell }}
                >
                  {col.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {props.tasks.map((task) => (
              <Row
                key={task.id}
                task={task}
                allActionPending={props.allActionPending}
                isSelected={selectedKeys.includes(task.key)}
                onSelectChange={(checked: boolean) => {
                  if (checked) {
                    setSelectedKeys(selectedKeys.concat(task.key));
                  } else {
                    setSelectedKeys(
                      selectedKeys.filter((key) => key !== task.key)
                    );
                  }
                }}
                onRunClick={() => {
                  props.runRetryTaskAsync(task.queue, task.key);
                }}
                onDeleteClick={() => {
                  props.deleteRetryTaskAsync(task.queue, task.key);
                }}
                onArchiveClick={() => {
                  props.archiveRetryTaskAsync(task.queue, task.key);
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
                colSpan={columns.length + 1}
                count={props.totalTaskCount}
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

const useRowStyles = makeStyles({
  root: {
    "& > *": {
      borderBottom: "unset",
    },
  },
  actionCell: {
    width: "140px",
  },
  activeActionCell: {
    display: "flex",
    justifyContent: "space-between",
  },
});

interface RowProps {
  task: RetryTaskExtended;
  isSelected: boolean;
  onSelectChange: (checked: boolean) => void;
  onDeleteClick: () => void;
  onRunClick: () => void;
  onArchiveClick: () => void;
  allActionPending: boolean;
  showActions: boolean;
  onActionCellEnter: () => void;
  onActionCellLeave: () => void;
}

function Row(props: RowProps) {
  const { task } = props;
  const [open, setOpen] = React.useState(false);
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
        <TableCell>{durationBefore(task.next_process_at)}</TableCell>
        <TableCell>{task.error_message}</TableCell>
        <TableCell>{task.retried}</TableCell>
        <TableCell>{task.max_retry}</TableCell>
        <TableCell
          align="center"
          className={clsx(
            classes.actionCell,
            props.showActions && classes.activeActionCell
          )}
          onMouseEnter={props.onActionCellEnter}
          onMouseLeave={props.onActionCellLeave}
        >
          {props.showActions ? (
            <React.Fragment>
              <Tooltip title="Delete">
                <IconButton
                  onClick={props.onDeleteClick}
                  disabled={task.requestPending || props.allActionPending}
                  size="small"
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Archive">
                <IconButton
                  onClick={props.onArchiveClick}
                  disabled={task.requestPending || props.allActionPending}
                  size="small"
                >
                  <ArchiveIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Run">
                <IconButton
                  onClick={props.onRunClick}
                  disabled={task.requestPending || props.allActionPending}
                  size="small"
                >
                  <PlayArrowIcon fontSize="small" />
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
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={10}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <Typography variant="h6" gutterBottom component="div">
                Payload
              </Typography>
              <SyntaxHighlighter language="json">
                {JSON.stringify(task.payload, null, 2)}
              </SyntaxHighlighter>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

export default connector(RetryTasksTable);
