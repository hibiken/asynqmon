import React, { useState, useCallback } from "react";
import { connect, ConnectedProps } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import Alert from "@material-ui/lab/Alert";
import AlertTitle from "@material-ui/lab/AlertTitle";
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
import CancelIcon from "@material-ui/icons/Cancel";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import Typography from "@material-ui/core/Typography";
import SyntaxHighlighter from "react-syntax-highlighter";
import syntaxHighlightStyle from "react-syntax-highlighter/dist/esm/styles/hljs/github";
import {
  listActiveTasksAsync,
  cancelActiveTaskAsync,
} from "../actions/tasksActions";
import { AppState } from "../store";
import TablePaginationActions, {
  rowsPerPageOptions,
  defaultPageSize,
} from "./TablePaginationActions";
import TableActions from "./TableActions";
import { usePolling } from "../hooks";
import { ActiveTaskExtended } from "../reducers/tasksReducer";
import { uuidPrefix } from "../utils";

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

function mapStateToProps(state: AppState) {
  return {
    loading: state.tasks.activeTasks.loading,
    tasks: state.tasks.activeTasks.data,
    pollInterval: state.settings.pollInterval,
  };
}

const mapDispatchToProps = { listActiveTasksAsync, cancelActiveTaskAsync };

const connector = connect(mapStateToProps, mapDispatchToProps);

type ReduxProps = ConnectedProps<typeof connector>;

interface Props {
  queue: string; // name of the queue
}

function ActiveTasksTable(props: Props & ReduxProps) {
  const { pollInterval, listActiveTasksAsync, queue } = props;
  const classes = useStyles();
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

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
      const newSelected = props.tasks.map((t) => t.id);
      setSelectedIds(newSelected);
    } else {
      setSelectedIds([]);
    }
  };

  const fetchData = useCallback(() => {
    const pageOpts = { page: page + 1, size: pageSize };
    listActiveTasksAsync(queue, pageOpts);
  }, [page, pageSize, queue, listActiveTasksAsync]);

  usePolling(fetchData, pollInterval);

  if (props.tasks.length === 0) {
    return (
      <Alert severity="info">
        <AlertTitle>Info</AlertTitle>
        No active tasks at this time.
      </Alert>
    );
  }

  const columns: { label: string; align: "left" | "center" | "right" }[] = [
    { label: "", align: "left" },
    { label: "ID", align: "left" },
    { label: "Type", align: "left" },
    { label: "Actions", align: "center" },
  ];

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
            onClick: () => console.log("TODO"),
            disabled: false,
          },
        ]}
        menuItemActions={[
          {
            label: "Cancel All",
            onClick: () => console.log("TODO"),
            disabled: false,
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
                <TableCell key={col.label} align={col.align}>
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
              />
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={rowsPerPageOptions}
                colSpan={columns.length}
                count={props.tasks.length}
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
  task: ActiveTaskExtended;
  isSelected: boolean;
  onSelectChange: (checked: boolean) => void;
  onCancelClick: () => void;
}

function Row(props: RowProps) {
  const { task } = props;
  const [open, setOpen] = React.useState(false);
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
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {uuidPrefix(task.id)}
        </TableCell>
        <TableCell>{task.type}</TableCell>
        <TableCell align="center">
          <Button
            color="primary"
            onClick={props.onCancelClick}
            disabled={task.requestPending || task.canceling}
          >
            {task.canceling ? "Canceling..." : "Cancel"}
          </Button>
        </TableCell>
      </TableRow>
      <TableRow selected={props.isSelected}>
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

export default connector(ActiveTasksTable);
