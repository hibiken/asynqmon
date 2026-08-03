import Checkbox from "@material-ui/core/Checkbox";
import IconButton from "@material-ui/core/IconButton";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import Tooltip from "@material-ui/core/Tooltip";
import ArchiveIcon from "@material-ui/icons/Archive";
import DeleteIcon from "@material-ui/icons/Delete";
import FileCopyOutlinedIcon from "@material-ui/icons/FileCopyOutlined";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { useHistory } from "react-router-dom";
import { taskRowsPerPageChange } from "../actions/settingsActions";
import {
  archiveAggregatingTaskAsync,
  archiveAllAggregatingTasksAsync,
  batchArchiveAggregatingTasksAsync,
  batchDeleteAggregatingTasksAsync,
  batchRunAggregatingTasksAsync,
  deleteAggregatingTaskAsync,
  deleteAllAggregatingTasksAsync,
  listAggregatingTasksAsync,
  runAggregatingTaskAsync,
  runAllAggregatingTasksAsync,
} from "../actions/tasksActions";
import { PaginationOptions } from "../api";
import { taskDetailsPath } from "../paths";
import { AppState } from "../store";
import { TableColumn } from "../types/table";
import { prettifyPayload, uuidPrefix } from "../utils";
import SyntaxHighlighter from "./SyntaxHighlighter";
import TasksTable, { RowProps, useRowStyles } from "./TasksTable";

function mapStateToProps(state: AppState) {
  return {
    groups: state.groups.data,
    groupsError: state.groups.error,
    loading: state.tasks.aggregatingTasks.loading,
    allActionPending: state.tasks.aggregatingTasks.allActionPending,
    batchActionPending: state.tasks.aggregatingTasks.batchActionPending,
    error: state.tasks.aggregatingTasks.error,
    group: state.tasks.aggregatingTasks.group,
    tasks: state.tasks.aggregatingTasks.data,
    pollInterval: state.settings.pollInterval,
    pageSize: state.settings.taskRowsPerPage,
  };
}

const mapDispatchToProps = {
  listAggregatingTasksAsync,
  deleteAllAggregatingTasksAsync,
  archiveAllAggregatingTasksAsync,
  runAllAggregatingTasksAsync,
  batchDeleteAggregatingTasksAsync,
  batchRunAggregatingTasksAsync,
  batchArchiveAggregatingTasksAsync,
  deleteAggregatingTaskAsync,
  runAggregatingTaskAsync,
  archiveAggregatingTaskAsync,
  taskRowsPerPageChange,
};

const connector = connect(mapStateToProps, mapDispatchToProps);
type ReduxProps = ConnectedProps<typeof connector>;

interface Props {
  queue: string;
  selectedGroup: string;
  totalTaskCount: number; // total number of tasks in the group
}

const columns: TableColumn[] = [
  { key: "id", label: "ID", align: "left" },
  { key: "type", label: "Type", align: "left" },
  { key: "paylod", label: "Payload", align: "left" },
  { key: "group", label: "Group", align: "left" },
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
      <TableCell>{task.group}</TableCell>
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

function AggregatingTasksTable(props: Props & ReduxProps) {
  const listTasks = (qname: string, pgn?: PaginationOptions) =>
    props.listAggregatingTasksAsync(qname, props.selectedGroup, pgn);

  const deleteAllTasks = (qname: string) =>
    props.deleteAllAggregatingTasksAsync(qname, props.selectedGroup);

  const archiveAllTasks = (qname: string) =>
    props.archiveAllAggregatingTasksAsync(qname, props.selectedGroup);

  const runAllTasks = (qname: string) =>
    props.runAllAggregatingTasksAsync(qname, props.selectedGroup);

  const batchDeleteTasks = (qname: string, taskIds: string[]) =>
    props.batchDeleteAggregatingTasksAsync(qname, props.selectedGroup, taskIds);

  const batchArchiveTasks = (qname: string, taskIds: string[]) =>
    props.batchArchiveAggregatingTasksAsync(
      qname,
      props.selectedGroup,
      taskIds
    );

  const batchRunTasks = (qname: string, taskIds: string[]) =>
    props.batchRunAggregatingTasksAsync(qname, props.selectedGroup, taskIds);

  const deleteTask = (qname: string, taskId: string) =>
    props.deleteAggregatingTaskAsync(qname, props.selectedGroup, taskId);

  const archiveTask = (qname: string, taskId: string) =>
    props.archiveAggregatingTaskAsync(qname, props.selectedGroup, taskId);

  const runTask = (qname: string, taskId: string) =>
    props.runAggregatingTaskAsync(qname, props.selectedGroup, taskId);

  return (
    <TasksTable
      queue={props.queue}
      totalTaskCount={props.totalTaskCount}
      taskState="aggregating"
      loading={props.loading}
      error={props.error}
      tasks={props.tasks}
      batchActionPending={props.batchActionPending}
      allActionPending={props.allActionPending}
      pollInterval={props.pollInterval}
      pageSize={props.pageSize}
      listTasks={listTasks}
      deleteAllTasks={deleteAllTasks}
      archiveAllTasks={archiveAllTasks}
      runAllTasks={runAllTasks}
      batchDeleteTasks={batchDeleteTasks}
      batchArchiveTasks={batchArchiveTasks}
      batchRunTasks={batchRunTasks}
      deleteTask={deleteTask}
      archiveTask={archiveTask}
      runTask={runTask}
      taskRowsPerPageChange={props.taskRowsPerPageChange}
      columns={columns}
      renderRow={(rowProps: RowProps) => <Row {...rowProps} />}
    />
  );
}

export default connector(AggregatingTasksTable);
