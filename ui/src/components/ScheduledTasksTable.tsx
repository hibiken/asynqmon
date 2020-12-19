import React, { useState, useCallback } from "react";
import { connect, ConnectedProps } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import Button from "@material-ui/core/Button";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableFooter from "@material-ui/core/TableFooter";
import TablePagination from "@material-ui/core/TablePagination";
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";
import Checkbox from "@material-ui/core/Checkbox";
import Collapse from "@material-ui/core/Collapse";
import IconButton from "@material-ui/core/IconButton";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import Typography from "@material-ui/core/Typography";
import Alert from "@material-ui/lab/Alert";
import AlertTitle from "@material-ui/lab/AlertTitle";
import SyntaxHighlighter from "react-syntax-highlighter";
import syntaxHighlightStyle from "react-syntax-highlighter/dist/esm/styles/hljs/github";
import {
  batchDeleteScheduledTasksAsync,
  batchRunScheduledTasksAsync,
  batchKillScheduledTasksAsync,
  deleteAllScheduledTasksAsync,
  runAllScheduledTasksAsync,
  killAllScheduledTasksAsync,
  listScheduledTasksAsync,
  deleteScheduledTaskAsync,
  runScheduledTaskAsync,
  killScheduledTaskAsync,
} from "../actions/tasksActions";
import { AppState } from "../store";
import TablePaginationActions, {
  defaultPageSize,
  rowsPerPageOptions,
} from "./TablePaginationActions";
import TableActions from "./TableActions";
import { durationBefore } from "../timeutil";
import { usePolling } from "../hooks";
import { ScheduledTaskExtended } from "../reducers/tasksReducer";

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

function mapStateToProps(state: AppState) {
  return {
    loading: state.tasks.scheduledTasks.loading,
    tasks: state.tasks.scheduledTasks.data,
    batchActionPending: state.tasks.scheduledTasks.batchActionPending,
    allActionPending: state.tasks.scheduledTasks.allActionPending,
    pollInterval: state.settings.pollInterval,
  };
}

const mapDispatchToProps = {
  listScheduledTasksAsync,
  batchDeleteScheduledTasksAsync,
  batchRunScheduledTasksAsync,
  batchKillScheduledTasksAsync,
  deleteAllScheduledTasksAsync,
  runAllScheduledTasksAsync,
  killAllScheduledTasksAsync,
  deleteScheduledTaskAsync,
  runScheduledTaskAsync,
  killScheduledTaskAsync,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type ReduxProps = ConnectedProps<typeof connector>;

interface Props {
  queue: string; // name of the queue.
  totalTaskCount: number; // totoal number of scheduled tasks.
}

function ScheduledTasksTable(props: Props & ReduxProps) {
  const { pollInterval, listScheduledTasksAsync, queue } = props;
  const classes = useStyles();
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);

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
    props.runAllScheduledTasksAsync(queue);
  };

  const handleDeleteAllClick = () => {
    props.deleteAllScheduledTasksAsync(queue);
  };

  const handleKillAllClick = () => {
    props.killAllScheduledTasksAsync(queue);
  };

  const handleBatchRunClick = () => {
    props
      .batchRunScheduledTasksAsync(queue, selectedKeys)
      .then(() => setSelectedKeys([]));
  };

  const handleBatchDeleteClick = () => {
    props
      .batchDeleteScheduledTasksAsync(queue, selectedKeys)
      .then(() => setSelectedKeys([]));
  };

  const handleBatchKillClick = () => {
    props
      .batchKillScheduledTasksAsync(queue, selectedKeys)
      .then(() => setSelectedKeys([]));
  };

  const fetchData = useCallback(() => {
    const pageOpts = { page: page + 1, size: pageSize };
    listScheduledTasksAsync(queue, pageOpts);
  }, [page, pageSize, queue, listScheduledTasksAsync]);

  usePolling(fetchData, pollInterval);

  if (props.tasks.length === 0) {
    return (
      <Alert severity="info">
        <AlertTitle>Info</AlertTitle>
        No scheduled tasks at this time.
      </Alert>
    );
  }

  const columns = [
    { label: "" },
    { label: "ID" },
    { label: "Type" },
    { label: "Process In" },
    { label: "Actions" },
  ];

  const rowCount = props.tasks.length;
  const numSelected = selectedKeys.length;
  return (
    <div>
      <TableActions
        allActionPending={props.allActionPending}
        batchActionPending={props.batchActionPending}
        showBatchActions={numSelected > 0}
        onRunAllClick={handleRunAllClick}
        onKillAllClick={handleKillAllClick}
        onDeleteAllClick={handleDeleteAllClick}
        onBatchRunClick={handleBatchRunClick}
        onBatchDeleteClick={handleBatchDeleteClick}
        onBatchKillClick={handleBatchKillClick}
      />
      <TableContainer component={Paper}>
        <Table
          stickyHeader={true}
          className={classes.table}
          aria-label="scheduled tasks table"
          size="small"
        >
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
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
                <TableCell key={col.label}>{col.label}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {props.tasks.map((task) => (
              <Row
                key={task.id}
                task={task}
                allActionPending={props.allActionPending}
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
                  props.runScheduledTaskAsync(queue, task.key);
                }}
                onDeleteClick={() => {
                  props.deleteScheduledTaskAsync(queue, task.key);
                }}
                onKillClick={() => {
                  props.killScheduledTaskAsync(queue, task.key);
                }}
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
    "& > *": {
      borderBottom: "unset",
    },
  },
});

interface RowProps {
  task: ScheduledTaskExtended;
  isSelected: boolean;
  onSelectChange: (checked: boolean) => void;
  onRunClick: () => void;
  onDeleteClick: () => void;
  onKillClick: () => void;
  allActionPending: boolean;
}

function Row(props: RowProps) {
  const { task } = props;
  const [open, setOpen] = React.useState(false);
  const classes = useRowStyles();
  return (
    <React.Fragment>
      <TableRow key={task.id} className={classes.root}>
        <TableCell padding="checkbox">
          <Checkbox
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              props.onSelectChange(event.target.checked)
            }
            checked={props.isSelected}
          />
        </TableCell>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {task.id}
        </TableCell>
        <TableCell>{task.type}</TableCell>
        <TableCell>{durationBefore(task.next_process_at)}</TableCell>
        <TableCell>
          <Button
            onClick={props.onRunClick}
            disabled={task.requestPending || props.allActionPending}
          >
            Run
          </Button>
          <Button
            onClick={props.onKillClick}
            disabled={task.requestPending || props.allActionPending}
          >
            Kill
          </Button>
          <Button
            onClick={props.onDeleteClick}
            disabled={task.requestPending || props.allActionPending}
          >
            Delete
          </Button>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <Typography variant="h6" gutterBottom component="div">
                Payload
              </Typography>
              <SyntaxHighlighter language="json" style={syntaxHighlightStyle}>
                {JSON.stringify(task.payload, null, 2)}
              </SyntaxHighlighter>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}
export default connector(ScheduledTasksTable);
