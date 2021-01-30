import React, { useCallback, useState } from "react";
import clsx from "clsx";
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
  defaultPageSize,
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
import { AppState } from "../store";
import { usePolling } from "../hooks";
import { uuidPrefix } from "../utils";
import { TableColumn } from "../types/table";
import { PendingTaskExtended } from "../reducers/tasksReducer";

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
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type ReduxProps = ConnectedProps<typeof connector>;

interface Props {
  queue: string;
  totalTaskCount: number; // total number of pending tasks
}

function PendingTasksTable(props: Props & ReduxProps) {
  const { pollInterval, listPendingTasksAsync, queue } = props;
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

  const handleDeleteAllClick = () => {
    props.deleteAllPendingTasksAsync(queue);
  };

  const handleArchiveAllClick = () => {
    props.archiveAllPendingTasksAsync(queue);
  };

  const handleBatchDeleteClick = () => {
    props
      .batchDeletePendingTasksAsync(queue, selectedKeys)
      .then(() => setSelectedKeys([]));
  };

  const handleBatchArchiveClick = () => {
    props
      .batchArchivePendingTasksAsync(queue, selectedKeys)
      .then(() => setSelectedKeys([]));
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
                allActionPending={props.allActionPending}
                onDeleteClick={() =>
                  props.deletePendingTaskAsync(queue, task.key)
                }
                onArchiveClick={() => {
                  props.archivePendingTaskAsync(queue, task.key);
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
  actionCell: {
    width: "96px",
  },
  activeActionCell: {
    display: "flex",
    justifyContent: "space-between",
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
  return (
    <TableRow key={task.id} selected={props.isSelected}>
      <TableCell padding="checkbox">
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
          {JSON.stringify(task.payload)}
        </SyntaxHighlighter>
      </TableCell>
      <TableCell align="right">{task.retried}</TableCell>
      <TableCell align="right">{task.max_retry}</TableCell>
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
