import React, { useCallback, useState } from "react";
import clsx from "clsx";
import { connect, ConnectedProps } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import Checkbox from "@material-ui/core/Checkbox";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Tooltip from "@material-ui/core/Tooltip";
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";
import Collapse from "@material-ui/core/Collapse";
import IconButton from "@material-ui/core/IconButton";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import DeleteIcon from "@material-ui/icons/Delete";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import Typography from "@material-ui/core/Typography";
import TableFooter from "@material-ui/core/TableFooter";
import TablePagination from "@material-ui/core/TablePagination";
import Alert from "@material-ui/lab/Alert";
import AlertTitle from "@material-ui/lab/AlertTitle";
import SyntaxHighlighter from "./SyntaxHighlighter";
import { AppState } from "../store";
import {
  batchDeleteArchivedTasksAsync,
  batchRunArchivedTasksAsync,
  deleteArchivedTaskAsync,
  deleteAllArchivedTasksAsync,
  listArchivedTasksAsync,
  runArchivedTaskAsync,
  runAllArchivedTasksAsync,
} from "../actions/tasksActions";
import TablePaginationActions, {
  defaultPageSize,
  rowsPerPageOptions,
} from "./TablePaginationActions";
import TableActions from "./TableActions";
import { timeAgo, uuidPrefix } from "../utils";
import { usePolling } from "../hooks";
import { ArchivedTaskExtended } from "../reducers/tasksReducer";
import { TableColumn } from "../types/table";

const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 650,
  },
  stickyHeaderCell: {
    background: theme.palette.background.paper,
  },
}));

const useRowStyles = makeStyles({
  root: {
    "& > *": {
      borderBottom: "unset",
    },
  },
  actionCell: {
    width: "96px",
  },
  activeActionCell: {
    display: "flex",
    justifyContent: "space-between",
  },
});

function mapStateToProps(state: AppState) {
  return {
    loading: state.tasks.archivedTasks.loading,
    tasks: state.tasks.archivedTasks.data,
    batchActionPending: state.tasks.archivedTasks.batchActionPending,
    allActionPending: state.tasks.archivedTasks.allActionPending,
    pollInterval: state.settings.pollInterval,
  };
}

const mapDispatchToProps = {
  listArchivedTasksAsync,
  runArchivedTaskAsync,
  runAllArchivedTasksAsync,
  deleteArchivedTaskAsync,
  deleteAllArchivedTasksAsync,
  batchRunArchivedTasksAsync,
  batchDeleteArchivedTasksAsync,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type ReduxProps = ConnectedProps<typeof connector>;

interface Props {
  queue: string; // name of the queue.
  totalTaskCount: number; // totoal number of archived tasks.
}

function ArchivedTasksTable(props: Props & ReduxProps) {
  const { pollInterval, listArchivedTasksAsync, queue } = props;
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
    props.runAllArchivedTasksAsync(queue);
  };

  const handleDeleteAllClick = () => {
    props.deleteAllArchivedTasksAsync(queue);
  };

  const handleBatchRunClick = () => {
    props
      .batchRunArchivedTasksAsync(queue, selectedKeys)
      .then(() => setSelectedKeys([]));
  };

  const handleBatchDeleteClick = () => {
    props
      .batchDeleteArchivedTasksAsync(queue, selectedKeys)
      .then(() => setSelectedKeys([]));
  };

  const fetchData = useCallback(() => {
    const pageOpts = { page: page + 1, size: pageSize };
    listArchivedTasksAsync(queue, pageOpts);
  }, [page, pageSize, queue, listArchivedTasksAsync]);

  usePolling(fetchData, pollInterval);

  if (props.tasks.length === 0) {
    return (
      <Alert severity="info">
        <AlertTitle>Info</AlertTitle>
        No archived tasks at this time.
      </Alert>
    );
  }

  const columns: TableColumn[] = [
    { key: "icon", label: "", align: "left" },
    { key: "id", label: "ID", align: "left" },
    { key: "type", label: "Type", align: "left" },
    { key: "last_failed", label: "Last Failed", align: "left" },
    { key: "last_error", label: "Last Error", align: "left" },
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
          aria-label="archived tasks table"
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
                key={task.key}
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
                onRunClick={() => {
                  props.runArchivedTaskAsync(queue, task.key);
                }}
                onDeleteClick={() => {
                  props.deleteArchivedTaskAsync(queue, task.key);
                }}
                allActionPending={props.allActionPending}
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
                colSpan={columns.length + 1 /* checkbox col */}
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

interface RowProps {
  task: ArchivedTaskExtended;
  isSelected: boolean;
  onSelectChange: (checked: boolean) => void;
  onRunClick: () => void;
  onDeleteClick: () => void;
  allActionPending: boolean;
  showActions: boolean;
  onActionCellEnter: () => void;
  onActionCellLeave: () => void;
}

function Row(props: RowProps) {
  const { task } = props;
  const [open, setOpen] = useState(false);
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
        <TableCell>{timeAgo(task.last_failed_at)}</TableCell>
        <TableCell>{task.error_message}</TableCell>
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
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
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

export default connector(ArchivedTasksTable);
