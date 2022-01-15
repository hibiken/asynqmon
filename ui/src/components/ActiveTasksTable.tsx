import Checkbox from "@material-ui/core/Checkbox";
import IconButton from "@material-ui/core/IconButton";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableFooter from "@material-ui/core/TableFooter";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import Tooltip from "@material-ui/core/Tooltip";
import CancelIcon from "@material-ui/icons/Cancel";
import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined';
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import Alert from "@material-ui/lab/Alert";
import AlertTitle from "@material-ui/lab/AlertTitle";
import React, { useCallback, useState } from "react";
import { connect, ConnectedProps } from "react-redux";
import { useHistory } from "react-router-dom";
import { taskRowsPerPageChange } from "../actions/settingsActions";
import { batchCancelActiveTasksAsync, cancelActiveTaskAsync, cancelAllActiveTasksAsync, listActiveTasksAsync } from "../actions/tasksActions";
import { usePolling } from "../hooks";
import { taskDetailsPath } from "../paths";
import { ActiveTaskExtended } from "../reducers/tasksReducer";
import { AppState } from "../store";
import { TableColumn } from "../types/table";
import { durationBefore, prettifyPayload, timeAgo, uuidPrefix } from "../utils";
import SyntaxHighlighter from "./SyntaxHighlighter";
import TableActions from "./TableActions";
import TablePaginationActions, { rowsPerPageOptions } from "./TablePaginationActions";

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
    loading: state.tasks.activeTasks.loading,
    error: state.tasks.activeTasks.error,
    tasks: state.tasks.activeTasks.data,
    batchActionPending: state.tasks.activeTasks.batchActionPending,
    allActionPending: state.tasks.activeTasks.allActionPending,
    pollInterval: state.settings.pollInterval,
    pageSize: state.settings.taskRowsPerPage,
  };
}

const mapDispatchToProps = {
  listActiveTasksAsync,
  cancelActiveTaskAsync,
  batchCancelActiveTasksAsync,
  cancelAllActiveTasksAsync,
  taskRowsPerPageChange,
};

const columns: TableColumn[] = [
  { key: "id", label: "ID", align: "left" },
  { key: "type", label: "Type", align: "left" },
  { key: "payload", label: "Payload", align: "left" },
  { key: "status", label: "Status", align: "left" },
  { key: "start-time", label: "Started", align: "left" },
  { key: "deadline", label: "Deadline", align: "left" },
  { key: "actions", label: "Actions", align: "center" },
];

const connector = connect(mapStateToProps, mapDispatchToProps);

type ReduxProps = ConnectedProps<typeof connector>;

interface Props {
  queue: string; // name of the queue
}

function ActiveTasksTable(props: Props & ReduxProps) {
  const { pollInterval, listActiveTasksAsync, queue, pageSize } = props;
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
                colSpan={columns.length + 1}
                count={props.tasks.length}
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
    
    "&:hover": {
      boxShadow: theme.shadows[2],
      copyButton: {
        display: "inline-block"
      },
    },
    "&:hover .MuiTableCell-root": {
      borderBottomColor: theme.palette.background.paper,
    },
  },
  idCell: {
    width: "200px",
  },
  copyButton: {
    display: "none"
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
        <IconButton>
          <Checkbox
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              props.onSelectChange(event.target.checked)
            }
            checked={props.isSelected}
          />
        </IconButton>
      </TableCell>
      <TableCell component="th" scope="row" className={classes.idCell} >
        {uuidPrefix(task.id)}
        <Tooltip title="Copy text to clipboard">
          <IconButton
            onClick={(e) => {
              e.stopPropagation()
              navigator.clipboard.writeText(task.id)
            }
            }
            size="small"
            className={classes.copyButton}
          >
            <FileCopyOutlinedIcon fontSize="small" style={{ height: "12px", width: "12px" }} />
          </IconButton>
        </Tooltip>
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
      <TableCell>{task.canceling ? "Canceling" : "Running"}</TableCell>
      <TableCell>
        {task.start_time === "-" ? "just now" : timeAgo(task.start_time)}
      </TableCell>
      <TableCell>
        {task.deadline === "-" ? "-" : durationBefore(task.deadline)}
      </TableCell>
      <TableCell
        align="center"
        onMouseEnter={props.onActionCellEnter}
        onMouseLeave={props.onActionCellLeave}
        onClick={(e) => e.stopPropagation()}
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
  );
}

export default connector(ActiveTasksTable);
