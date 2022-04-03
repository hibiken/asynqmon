import React, { useState, useCallback } from "react";
import { useHistory } from "react-router-dom";
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
import Tooltip from "@material-ui/core/Tooltip";
import Checkbox from "@material-ui/core/Checkbox";
import IconButton from "@material-ui/core/IconButton";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import DeleteIcon from "@material-ui/icons/Delete";
import ArchiveIcon from "@material-ui/icons/Archive";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import Alert from "@material-ui/lab/Alert";
import AlertTitle from "@material-ui/lab/AlertTitle";
import SyntaxHighlighter from "./SyntaxHighlighter";
import TablePaginationActions, {
  rowsPerPageOptions,
} from "./TablePaginationActions";
import TableActions from "./TableActions";
import { durationBefore, uuidPrefix, prettifyPayload } from "../utils";
import { usePolling } from "../hooks";
import { TaskInfoExtended } from "../reducers/tasksReducer";
import { TableColumn } from "../types/table";
import { taskDetailsPath } from "../paths";
import FileCopyOutlinedIcon from "@material-ui/icons/FileCopyOutlined";
import { PaginationOptions } from "../api";
import { TaskState } from "../types/taskState";

const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 650,
  },
  stickyHeaderCell: {
    background: theme.palette.background.paper,
  },
  alert: {
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
  pagination: {
    border: "none",
  },
}));

interface Props {
  queue: string; // name of the queue.
  totalTaskCount: number; // totoal number of tasks in the given state.
  taskState: TaskState;
  loading: boolean;
  error: string;
  tasks: TaskInfoExtended[];
  batchActionPending: boolean;
  allActionPending: boolean;
  pollInterval: number;
  pageSize: number;
  columns: TableColumn[];

  // actions
  listTasks: (qname: string, pgn: PaginationOptions) => void;
  batchDeleteTasks?: (qname: string, taskIds: string[]) => Promise<void>;
  batchRunTasks?: (qname: string, taskIds: string[]) => Promise<void>;
  batchArchiveTasks?: (qname: string, taskIds: string[]) => Promise<void>;
  deleteAllTasks?: (qname: string) => Promise<void>;
  runAllTasks?: (qname: string) => Promise<void>;
  archiveAllTasks?: (qname: string) => Promise<void>;
  deleteTask?: (qname: string, taskId: string) => Promise<void>;
  runTask?: (qname: string, taskId: string) => Promise<void>;
  archiveTask?: (qname: string, taskId: string) => Promise<void>;
  taskRowsPerPageChange: (n: number) => void;
}

export default function TasksTable(props: Props) {
  const { pollInterval, listTasks, queue, pageSize } = props;
  const classes = useStyles();
  const [page, setPage] = useState(0);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [activeTaskId, setActiveTaskId] = useState<string>("");

  const handlePageChange = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    props.taskRowsPerPageChange(parseInt(event.target.value, 10));
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

  function createAllTasksHandler(action: (qname: string) => Promise<void>) {
    return () => action(queue);
  }

  function createBatchTasksHandler(
    action: (qname: string, taskIds: string[]) => Promise<void>
  ) {
    return () => action(queue, selectedIds).then(() => setSelectedIds([]));
  }

  function createTaskAction(
    action: (qname: string, taskId: string) => Promise<void>,
    taskId: string
  ) {
    return () => action(queue, taskId);
  }

  let allActions = [];
  if (props.deleteAllTasks) {
    allActions.push({
      label: "Delete All",
      onClick: createAllTasksHandler(props.deleteAllTasks),
      disabled: props.allActionPending,
    });
  }
  if (props.archiveAllTasks) {
    allActions.push({
      label: "Archive All",
      onClick: createAllTasksHandler(props.archiveAllTasks),
      disabled: props.allActionPending,
    });
  }
  if (props.runAllTasks) {
    allActions.push({
      label: "Run All",
      onClick: createAllTasksHandler(props.runAllTasks),
      disabled: props.allActionPending,
    });
  }

  let batchActions = [];
  if (props.batchDeleteTasks) {
    batchActions.push({
      tooltip: "Delete",
      icon: <DeleteIcon />,
      disabled: props.batchActionPending,
      onClick: createBatchTasksHandler(props.batchDeleteTasks),
    });
  }
  if (props.batchArchiveTasks) {
    batchActions.push({
      tooltip: "Archive",
      icon: <ArchiveIcon />,
      disabled: props.batchActionPending,
      onClick: createBatchTasksHandler(props.batchArchiveTasks),
    });
  }
  if (props.batchRunTasks) {
    batchActions.push({
      tooltip: "Run",
      icon: <PlayArrowIcon />,
      disabled: props.batchActionPending,
      onClick: createBatchTasksHandler(props.batchRunTasks),
    });
  }

  const fetchData = useCallback(() => {
    const pageOpts = { page: page + 1, size: pageSize };
    listTasks(queue, pageOpts);
  }, [page, pageSize, queue, listTasks]);

  usePolling(fetchData, pollInterval);

  if (props.error.length > 0) {
    return (
      <Alert severity="error" className={classes.alert}>
        <AlertTitle>Error</AlertTitle>
        {props.error}
      </Alert>
    );
  }
  if (props.tasks.length === 0) {
    return (
      <Alert severity="info" className={classes.alert}>
        <AlertTitle>Info</AlertTitle>
        No {props.taskState} tasks at this time.
      </Alert>
    );
  }

  const rowCount = props.tasks.length;
  const numSelected = selectedIds.length;
  return (
    <div>
      {!window.READ_ONLY && (
        <TableActions
          showIconButtons={numSelected > 0}
          iconButtonActions={batchActions}
          menuItemActions={allActions}
        />
      )}
      <TableContainer component={Paper}>
        <Table
          stickyHeader={true}
          className={classes.table}
          aria-label={`${props.taskState} tasks table`}
          size="small"
        >
          <TableHead>
            <TableRow>
              {!window.READ_ONLY && (
                <TableCell
                  padding="checkbox"
                  classes={{ stickyHeader: classes.stickyHeaderCell }}
                >
                  <IconButton>
                    <Checkbox
                      indeterminate={numSelected > 0 && numSelected < rowCount}
                      checked={rowCount > 0 && numSelected === rowCount}
                      onChange={handleSelectAllClick}
                      inputProps={{
                        "aria-label": "select all tasks shown in the table",
                      }}
                    />
                  </IconButton>
                </TableCell>
              )}
              {props.columns
                .filter((col) => {
                  // Filter out actions column in readonly mode.
                  return !window.READ_ONLY || col.key !== "actions";
                })
                .map((col) => (
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
                isSelected={selectedIds.includes(task.id)}
                onSelectChange={(checked: boolean) => {
                  if (checked) {
                    setSelectedIds(selectedIds.concat(task.id));
                  } else {
                    setSelectedIds(selectedIds.filter((id) => id !== task.id));
                  }
                }}
                onRunClick={
                  props.runTask
                    ? createTaskAction(props.runTask, task.id)
                    : undefined
                }
                onDeleteClick={
                  props.deleteTask
                    ? createTaskAction(props.deleteTask, task.id)
                    : undefined
                }
                onArchiveClick={
                  props.archiveTask
                    ? createTaskAction(props.archiveTask, task.id)
                    : undefined
                }
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
                colSpan={props.columns.length + 1}
                count={props.totalTaskCount}
                rowsPerPage={pageSize}
                page={page}
                SelectProps={{
                  inputProps: { "aria-label": "rows per page" },
                  native: true,
                }}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleRowsPerPageChange}
                ActionsComponent={TablePaginationActions}
                className={classes.pagination}
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
    cursor: "pointer",
    "& #copy-button": {
      display: "none",
    },
    "&:hover": {
      boxShadow: theme.shadows[2],
      "& #copy-button": {
        display: "inline-block",
      },
    },
    "&:hover $copyButton": {
      display: "inline-block",
    },
    "&:hover .MuiTableCell-root": {
      borderBottomColor: theme.palette.background.paper,
    },
  },
  actionCell: {
    width: "140px",
  },
  actionButton: {
    marginLeft: 3,
    marginRight: 3,
  },
  idCell: {
    width: "200px",
  },
  copyButton: {
    display: "none",
  },
  IdGroup: {
    display: "flex",
    alignItems: "center",
  },
}));

interface RowProps {
  task: TaskInfoExtended;
  isSelected: boolean;
  onSelectChange: (checked: boolean) => void;
  onRunClick?: () => void;
  onDeleteClick?: () => void;
  onArchiveClick?: () => void;
  allActionPending: boolean;
  showActions: boolean;
  onActionCellEnter: () => void;
  onActionCellLeave: () => void;
}

function Row(props: RowProps) {
  const { task } = props;
  const classes = useRowStyles();
  const history = useHistory();
  return (
    <TableRow
      key={task.id}
      className={classes.root}
      selected={props.isSelected}
      onClick={() => history.push(taskDetailsPath(task.queue, task.id))}
    >
      {!window.READ_ONLY && (
        <TableCell padding="checkbox" onClick={(e) => e.stopPropagation()}>
          <IconButton>
            <Checkbox
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                props.onSelectChange(event.target.checked)
              }
              checked={props.isSelected}
            />
          </IconButton>
        </TableCell>
      )}
      <TableCell component="th" scope="row" className={classes.idCell}>
        <div className={classes.IdGroup}>
          {uuidPrefix(task.id)}
          <Tooltip title="Copy full ID to clipboard">
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                navigator.clipboard.writeText(task.id);
              }}
              size="small"
              className={classes.copyButton}
            >
              <FileCopyOutlinedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </div>
      </TableCell>
      <TableCell>{task.type}</TableCell>
      <TableCell>
        <SyntaxHighlighter
          language="json"
          customStyle={{ margin: 0, maxWidth: 400 }}
        >
          {prettifyPayload(task.payload)}
        </SyntaxHighlighter>
      </TableCell>
      <TableCell>{durationBefore(task.next_process_at)}</TableCell>
      {!window.READ_ONLY && (
        <TableCell
          align="center"
          className={classes.actionCell}
          onMouseEnter={props.onActionCellEnter}
          onMouseLeave={props.onActionCellLeave}
          onClick={(e) => e.stopPropagation()}
        >
          {props.showActions ? (
            <React.Fragment>
              <Tooltip title="Delete">
                <IconButton
                  onClick={props.onDeleteClick}
                  disabled={task.requestPending || props.allActionPending}
                  size="small"
                  className={classes.actionButton}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Archive">
                <IconButton
                  onClick={props.onArchiveClick}
                  disabled={task.requestPending || props.allActionPending}
                  size="small"
                  className={classes.actionButton}
                >
                  <ArchiveIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Run">
                <IconButton
                  onClick={props.onRunClick}
                  disabled={task.requestPending || props.allActionPending}
                  size="small"
                  className={classes.actionButton}
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
      )}
    </TableRow>
  );
}
