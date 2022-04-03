import React from "react";
import { connect, ConnectedProps } from "react-redux";
import TasksTable from "./TasksTable";
import {
  batchDeleteScheduledTasksAsync,
  batchRunScheduledTasksAsync,
  batchArchiveScheduledTasksAsync,
  deleteAllScheduledTasksAsync,
  runAllScheduledTasksAsync,
  archiveAllScheduledTasksAsync,
  listScheduledTasksAsync,
  deleteScheduledTaskAsync,
  runScheduledTaskAsync,
  archiveScheduledTaskAsync,
} from "../actions/tasksActions";
import { taskRowsPerPageChange } from "../actions/settingsActions";
import { AppState } from "../store";
import { TableColumn } from "../types/table";

function mapStateToProps(state: AppState) {
  return {
    loading: state.tasks.scheduledTasks.loading,
    error: state.tasks.scheduledTasks.error,
    tasks: state.tasks.scheduledTasks.data,
    batchActionPending: state.tasks.scheduledTasks.batchActionPending,
    allActionPending: state.tasks.scheduledTasks.allActionPending,
    pollInterval: state.settings.pollInterval,
    pageSize: state.settings.taskRowsPerPage,
  };
}

const mapDispatchToProps = {
  listTasks: listScheduledTasksAsync,
  batchDeleteTasks: batchDeleteScheduledTasksAsync,
  batchRunTasks: batchRunScheduledTasksAsync,
  batchArchiveTasks: batchArchiveScheduledTasksAsync,
  deleteAllTasks: deleteAllScheduledTasksAsync,
  runAllTasks: runAllScheduledTasksAsync,
  archiveAllTasks: archiveAllScheduledTasksAsync,
  deleteTask: deleteScheduledTaskAsync,
  runTask: runScheduledTaskAsync,
  archiveTask: archiveScheduledTaskAsync,
  taskRowsPerPageChange,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type ReduxProps = ConnectedProps<typeof connector>;

interface Props {
  queue: string; // name of the queue.
  totalTaskCount: number; // totoal number of scheduled tasks.
}

const columns: TableColumn[] = [
  { key: "id", label: "ID", align: "left" },
  { key: "type", label: "Type", align: "left" },
  { key: "payload", label: "Payload", align: "left" },
  { key: "process_in", label: "Process In", align: "left" },
  { key: "actions", label: "Actions", align: "center" },
];

function ScheduledTasksTable(props: Props & ReduxProps) {
  return <TasksTable taskState="scheduled" columns={columns} {...props} />;
}

export default connector(ScheduledTasksTable);
