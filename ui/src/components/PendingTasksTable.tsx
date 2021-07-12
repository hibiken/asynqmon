import React, { useCallback, useState } from "react";
import { useHistory } from "react-router-dom";
import { connect, ConnectedProps } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import Alert from "@material-ui/lab/Alert";
import AlertTitle from "@material-ui/lab/AlertTitle";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Tooltip from "@material-ui/core/Tooltip";
import Paper from "@material-ui/core/Paper";
import Checkbox from "@material-ui/core/Checkbox";
import IconButton from "@material-ui/core/IconButton";
import TableFooter from "@material-ui/core/TableFooter";
import TablePagination from "@material-ui/core/TablePagination";
import DeleteIcon from "@material-ui/icons/Delete";
import ArchiveIcon from "@material-ui/icons/Archive";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import SyntaxHighlighter from "./SyntaxHighlighter";
import TablePaginationActions, {
  rowsPerPageOptions,
} from "./TablePaginationActions";
import TableActions from "./TableActions";
import {
  listPendingTasksAsync,
  deletePendingTaskAsync,
  batchDeletePendingTasksAsync,
  deleteAllPendingTasksAsync,
  archivePendingTaskAsync,
  batchArchivePendingTasksAsync,
  archiveAllPendingTasksAsync,
} from "../actions/tasksActions";
import { taskRowsPerPageChange } from "../actions/settingsActions";
import { AppState } from "../store";
import { usePolling } from "../hooks";
import { uuidPrefix } from "../utils";
import { TableColumn } from "../types/table";
import { PendingTaskExtended } from "../reducers/tasksReducer";
import { taskDetailsPath } from "../paths";

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

function mapStateToProps(state: AppState) {
  return {
    loading: state.tasks.pendingTasks.loading,
    error: state.tasks.pendingTasks.error,
    tasks: state.tasks.pendingTasks.data,
    batchActionPending: state.tasks.pendingTasks.batchActionPending,
    allActionPending: state.tasks.pendingTasks.allActionPending,
    pollInterval: state.settings.pollInterval,
    pageSize: state.settings.taskRowsPerPage,
  };
}

const mapDispatchToProps = {
  listPendingTasksAsync,
  deletePendingTaskAsync,
  batchDeletePendingTasksAsync,
  deleteAllPendingTasksAsync,
  archivePendingTaskAsync,
  batchArchivePendingTasksAsync,
  archiveAllPendingTasksAsync,
  taskRowsPerPageChange,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type ReduxProps = ConnectedProps<typeof connector>;

interface Props {
  queue: string;
  totalTaskCount: number; // total number of pending tasks
}

function PendingTasksTable(props: Props & ReduxProps) {
  const { pollInterval, listPendingTasksAsync, queue, pageSize } = props;
  const classes = useStyles();
  const [page, setPage] = useState(0);
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

  const handleDeleteAllClick = () => {
    props.deleteAllPendingTasksAsync(queue);
  };

  const handleArchiveAllClick = () => {
    props.archiveAllPendingTasksAsync(queue);
  };

  const handleBatchDeleteClick = () => {
    props
      .batchDeletePendingTasksAsync(queue, selectedIds)
      .then(() => setSelectedIds([]));
  };

  const handleBatchArchiveClick = () => {
    props
      .batchArchivePendingTasksAsync(queue, selectedIds)
      .then(() => setSelectedIds([]));
  };

  const fetchData = useCallback(() => {
    const pageOpts = { page: page + 1, size: pageSize };
    listPendingTasksAsync(queue, pageOpts);
  }, [page, pageSize, queue, listPendingTasksAsync]);

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
        No pending tasks at this time.
      </Alert>
    );
  }

  const columns: TableColumn[] = [
    { key: "id", label: "ID", align: "left" },
    { key: "type", label: "Type", align: "left" },
    { key: "paylod", label: "Payload", align: "left" },
    { key: "retried", label: "Retried", align: "right" },
    { key: "max_retry", label: "Max Retry", align: "right" },
    { key: "actions", label: "Actions", align: "center" },
  ];

  const rowCount = props.tasks.length;
  const numSelected = selectedIds.length;
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
        ]}
      />
      <TableContainer component={Paper}>
        <Table
          stickyHeader={true}
          className={classes.table}
          aria-label="pending tasks table"
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
                  key={col.key}
                  align={col.align}
                  classes={{
                    stickyHeader: classes.stickyHeaderCell,
                  }}
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
                isSelected={selectedIds.includes(task.id)}
                onSelectChange={(checked: boolean) => {
                  if (checked) {
                    setSelectedIds(selectedIds.concat(task.id));
                  } else {
                    setSelectedIds(selectedIds.filter((id) => id !== task.id));
                  }
                }}
                allActionPending={props.allActionPending}
                onDeleteClick={() =>
                  props.deletePendingTaskAsync(queue, task.id)
                }
                onArchiveClick={() => {
                  props.archivePendingTaskAsync(queue, task.id);
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
                className={classes.pagination}
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
    cursor: "pointer",
  },
  actionCell: {
    width: "96px",
  },
  actionButton: {
    marginLeft: 3,
    marginRight: 3,
  },
});

interface RowProps {
  task: PendingTaskExtended;
  isSelected: boolean;
  onSelectChange: (checked: boolean) => void;
  onDeleteClick: () => void;
  onArchiveClick: () => void;
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
      <TableCell padding="checkbox" onClick={(e) => e.stopPropagation()}>
        <Checkbox
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            props.onSelectChange(event.target.checked)
          }
          checked={props.isSelected}
        />
      </TableCell>
      <TableCell component="th" scope="row">
        {uuidPrefix(task.id)}
      </TableCell>
      <TableCell>{task.type}</TableCell>
      <TableCell>
        <SyntaxHighlighter
          language="json"
          customStyle={{ margin: 0, maxWidth: 400 }}
        >
          {task.payload}
        </SyntaxHighlighter>
      </TableCell>
      <TableCell align="right">{task.retried}</TableCell>
      <TableCell align="right">{task.max_retry}</TableCell>
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
          </React.Fragment>
        ) : (
          <IconButton size="small" onClick={props.onActionCellEnter}>
            <MoreHorizIcon fontSize="small" />
          </IconButton>
        )}
      </TableCell>
    </TableRow>
  );
}

export default connector(PendingTasksTable);
