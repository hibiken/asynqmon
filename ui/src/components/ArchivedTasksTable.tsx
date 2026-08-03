import Checkbox from "@material-ui/core/Checkbox";
import IconButton from "@material-ui/core/IconButton";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import Tooltip from "@material-ui/core/Tooltip";
import DeleteIcon from "@material-ui/icons/Delete";
import FileCopyOutlinedIcon from "@material-ui/icons/FileCopyOutlined";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { useHistory } from "react-router-dom";
import { taskRowsPerPageChange } from "../actions/settingsActions";
import {
  batchDeleteArchivedTasksAsync,
  batchRunArchivedTasksAsync,
  deleteAllArchivedTasksAsync,
  deleteArchivedTaskAsync,
  listArchivedTasksAsync,
  runAllArchivedTasksAsync,
  runArchivedTaskAsync,
} from "../actions/tasksActions";
import { taskDetailsPath } from "../paths";
import { AppState } from "../store";
import { TableColumn } from "../types/table";
import { prettifyPayload, timeAgo, uuidPrefix } from "../utils";
import SyntaxHighlighter from "./SyntaxHighlighter";
import TasksTable, { RowProps, useRowStyles } from "./TasksTable";

function mapStateToProps(state: AppState) {
  return {
    loading: state.tasks.archivedTasks.loading,
    error: state.tasks.archivedTasks.error,
    tasks: state.tasks.archivedTasks.data,
    batchActionPending: state.tasks.archivedTasks.batchActionPending,
    allActionPending: state.tasks.archivedTasks.allActionPending,
    pollInterval: state.settings.pollInterval,
    pageSize: state.settings.taskRowsPerPage,
  };
}

const mapDispatchToProps = {
  listTasks: listArchivedTasksAsync,
  runTask: runArchivedTaskAsync,
  runAllTasks: runAllArchivedTasksAsync,
  deleteTask: deleteArchivedTaskAsync,
  deleteAllTasks: deleteAllArchivedTasksAsync,
  batchRunTasks: batchRunArchivedTasksAsync,
  batchDeleteTasks: batchDeleteArchivedTasksAsync,
  taskRowsPerPageChange,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type ReduxProps = ConnectedProps<typeof connector>;

interface Props {
  queue: string; // name of the queue.
  totalTaskCount: number; // totoal number of archived tasks.
}

const columns: TableColumn[] = [
  { key: "id", label: "ID", align: "left" },
  { key: "type", label: "Type", align: "left" },
  { key: "payload", label: "Payload", align: "left" },
  { key: "last_failed", label: "Last Failed", align: "left" },
  { key: "last_error", label: "Last Error", align: "left" },
  { key: "actions", label: "Actions", align: "center" },
];

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
      <TableCell>{timeAgo(task.last_failed_at)}</TableCell>
      <TableCell>{task.error_message}</TableCell>
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
                  className={classes.actionButton}
                  onClick={props.onDeleteClick}
                  disabled={task.requestPending || props.allActionPending}
                  size="small"
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Run">
                <IconButton
                  className={classes.actionButton}
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
      )}
    </TableRow>
  );
}

function ArchivedTasksTable(props: Props & ReduxProps) {
  return (
    <TasksTable
      taskState="archived"
      columns={columns}
      renderRow={(rowProps: RowProps) => <Row {...rowProps} />}
      {...props}
    />
  );
}

export default connector(ArchivedTasksTable);
