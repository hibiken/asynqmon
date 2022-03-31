import React, { useCallback, useState } from "react";
import { connect, ConnectedProps } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import Checkbox from "@material-ui/core/Checkbox";
import IconButton from "@material-ui/core/IconButton";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableFooter from "@material-ui/core/TableFooter";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import Tooltip from "@material-ui/core/Tooltip";
import ArchiveIcon from "@material-ui/icons/Archive";
import DeleteIcon from "@material-ui/icons/Delete";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import FileCopyOutlinedIcon from "@material-ui/icons/FileCopyOutlined";
import Alert from "@material-ui/lab/Alert";
import AlertTitle from "@material-ui/lab/AlertTitle";
import { useHistory } from "react-router-dom";
import { listGroupsAsync } from "../actions/groupsActions";
import GroupSelect from "./GroupSelect";
import TableActions from "./TableActions";
import SyntaxHighlighter from "./SyntaxHighlighter";
import { prettifyPayload, uuidPrefix } from "../utils";
import { usePolling } from "../hooks";
import { taskDetailsPath } from "../paths";
import { AppState } from "../store";
import { TaskInfoExtended } from "../reducers/tasksReducer";
import { GroupInfo } from "../api";
import { TableColumn } from "../types/table";
import TablePaginationActions, {
  rowsPerPageOptions,
} from "./TablePaginationActions";
import {
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
} from "../actions/tasksActions";
import { taskRowsPerPageChange } from "../actions/settingsActions";

const useStyles = makeStyles((theme) => ({
  groupSelector: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
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
  listGroupsAsync,
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

interface Props {
  queue: string;
}

const columns: TableColumn[] = [
  { key: "id", label: "ID", align: "left" },
  { key: "type", label: "Type", align: "left" },
  { key: "paylod", label: "Payload", align: "left" },
  { key: "group", label: "Group", align: "left" },
  { key: "actions", label: "Actions", align: "center" },
];

function AggregatingTasksTable(
  props: Props & ConnectedProps<typeof connector>
) {
  const [selectedGroup, setSelectedGroup] = useState<GroupInfo | null>(null);
  const [page, setPage] = useState(0);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [activeTaskId, setActiveTaskId] = useState<string>("");
  const {
    pollInterval,
    listGroupsAsync,
    listAggregatingTasksAsync,
    queue,
    pageSize,
  } = props;
  const classes = useStyles();

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

  const handleDeleteAllClick = () => {
    if (selectedGroup === null) {
      return;
    }
    props.deleteAllAggregatingTasksAsync(queue, selectedGroup.group);
  };

  const handleArchiveAllClick = () => {
    if (selectedGroup === null) {
      return;
    }
    props.archiveAllAggregatingTasksAsync(queue, selectedGroup.group);
  };

  const handleRunAllClick = () => {
    if (selectedGroup === null) {
      return;
    }
    props.runAllAggregatingTasksAsync(queue, selectedGroup.group);
  };

  const handleBatchRunClick = () => {
    if (selectedGroup === null) {
      return;
    }
    props
      .batchRunAggregatingTasksAsync(queue, selectedGroup.group, selectedIds)
      .then(() => setSelectedIds([]));
  };

  const handleBatchDeleteClick = () => {
    if (selectedGroup === null) {
      return;
    }
    props
      .batchDeleteAggregatingTasksAsync(queue, selectedGroup.group, selectedIds)
      .then(() => setSelectedIds([]));
  };

  const handleBatchArchiveClick = () => {
    if (selectedGroup === null) {
      return;
    }
    props
      .batchArchiveAggregatingTasksAsync(
        queue,
        selectedGroup.group,
        selectedIds
      )
      .then(() => setSelectedIds([]));
  };

  const fetchGroups = useCallback(() => {
    listGroupsAsync(queue);
  }, [listGroupsAsync, queue]);

  const fetchTasks = useCallback(() => {
    const pageOpts = { page: page + 1, size: pageSize };
    if (selectedGroup !== null) {
      listAggregatingTasksAsync(queue, selectedGroup.group, pageOpts);
    }
  }, [page, pageSize, queue, selectedGroup, listAggregatingTasksAsync]);

  usePolling(fetchGroups, pollInterval);
  usePolling(fetchTasks, pollInterval);

  if (props.error.length > 0) {
    return (
      <Alert severity="error" className={classes.alert}>
        <AlertTitle>Error</AlertTitle>
        {props.error}
      </Alert>
    );
  }
  if (props.groups.length === 0) {
    return (
      <Alert severity="info" className={classes.alert}>
        <AlertTitle>Info</AlertTitle>
        No aggregating tasks at this time.
      </Alert>
    );
  }

  const rowCount = props.tasks.length;
  const numSelected = selectedIds.length;
  return (
    <div>
      <div className={classes.groupSelector}>
        <GroupSelect
          selected={selectedGroup}
          onSelect={setSelectedGroup}
          groups={props.groups}
          error={props.groupsError}
        />
      </div>
      {!window.READ_ONLY && (
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
      )}
      <TableContainer component={Paper}>
        <Table
          stickyHeader={true}
          className={classes.table}
          aria-label="pending tasks table"
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
              {columns
                .filter((col) => {
                  // Filter out actions column in readonly mode.
                  return !window.READ_ONLY || col.key !== "actions";
                })
                .map((col) => (
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
            {props.group === selectedGroup?.group &&
              props.tasks.map((task) => (
                <Row
                  key={task.id}
                  task={task}
                  isSelected={selectedIds.includes(task.id)}
                  onSelectChange={(checked: boolean) => {
                    if (checked) {
                      setSelectedIds(selectedIds.concat(task.id));
                    } else {
                      setSelectedIds(
                        selectedIds.filter((id) => id !== task.id)
                      );
                    }
                  }}
                  allActionPending={props.allActionPending}
                  onDeleteClick={() => {
                    if (selectedGroup === null) return;
                    props.deleteAggregatingTaskAsync(
                      queue,
                      selectedGroup.group,
                      task.id
                    );
                  }}
                  onArchiveClick={() => {
                    if (selectedGroup === null) return;
                    props.archiveAggregatingTaskAsync(
                      queue,
                      selectedGroup.group,
                      task.id
                    );
                  }}
                  onRunClick={() => {
                    if (selectedGroup === null) return;
                    props.runAggregatingTaskAsync(
                      queue,
                      selectedGroup.group,
                      task.id
                    );
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
                count={selectedGroup === null ? 0 : selectedGroup.size}
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
    width: "96px",
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
  onDeleteClick: () => void;
  onArchiveClick: () => void;
  onRunClick: () => void;
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

export default connector(AggregatingTasksTable);
