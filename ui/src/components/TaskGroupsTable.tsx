import React, { useCallback } from "react";
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
import FileCopyOutlinedIcon from "@material-ui/icons/FileCopyOutlined";
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
    pollInterval: state.settings.pollInterval,
  };
}

const mapDispatchToProps = {
  listGroupsAsync,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

interface Props {
  queue: string;
}

const columns: TableColumn[] = [
  { key: "id", label: "ID", align: "left" },
  { key: "type", label: "Type", align: "left" },
  { key: "paylod", label: "Payload", align: "left" },
  { key: "actions", label: "Actions", align: "center" },
];

// TODO: remove this once we read the real data.
const dummyTasks: TaskInfoExtended[] = [];

function TaskGroupsTable(props: Props & ConnectedProps<typeof connector>) {
  const [selectedGroup, setSelectedGroup] = React.useState<GroupInfo | null>(
    null
  );
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);
  const { pollInterval, listGroupsAsync, queue } = props;
  const classes = useStyles();

  const fetchGroups = useCallback(() => {
    listGroupsAsync(queue);
  }, [listGroupsAsync, queue]);

  usePolling(fetchGroups, pollInterval);

  const rowCount = 0; // TODO: props.tasks.length;
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
              onClick: () => {}, // TODO: handleBatchDeleteClick,
              disabled: false, //TODO: props.batchActionPending,
            },
            {
              tooltip: "Archive",
              icon: <ArchiveIcon />,
              onClick: () => {}, //TODO: handleBatchArchiveClick,
              disabled: false, //TODO: props.batchActionPending,
            },
          ]}
          menuItemActions={[
            {
              label: "Delete All",
              onClick: () => {}, //TODO: handleDeleteAllClick,
              disabled: false, // TODO: props.allActionPending,
            },
            {
              label: "Archive All",
              onClick: () => {}, // TODO: handleArchiveAllClick,
              disabled: false, // TODO: props.allActionPending,
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
                      onChange={() => {} /*TODO: handleSelectAllClick*/}
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
            {
              /*props.tasks */ dummyTasks.map((task) => (
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
                  allActionPending={false /* TODO: props.allActionPending */}
                  onDeleteClick={
                    () => {}
                    //TODO: props.deletePendingTaskAsync(queue, task.id)
                  }
                  onArchiveClick={() => {
                    // TODO: props.archivePendingTaskAsync(queue, task.id);
                  }}
                  onActionCellEnter={() => {} /*setActiveTaskId(task.id) */}
                  onActionCellLeave={() => {} /*setActiveTaskId("")*/}
                  showActions={false /*activeTaskId === task.id*/}
                />
              ))
            }
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={rowsPerPageOptions}
                colSpan={columns.length + 1}
                count={0 /* props.totalTaskCount */}
                rowsPerPage={20 /*pageSize*/}
                page={0 /*page*/}
                SelectProps={{
                  inputProps: { "aria-label": "rows per page" },
                  native: true,
                }}
                onPageChange={() => {} /* handlePageChange */}
                onRowsPerPageChange={() => {} /* handleRowsPerPageChange */}
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
      <TableCell align="right">{task.retried}</TableCell>
      <TableCell align="right">{task.max_retry}</TableCell>
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

export default connector(TaskGroupsTable);
