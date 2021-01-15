import React, { useEffect } from "react";
import { connect, ConnectedProps } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { AppState } from "../store";
import { getEnqueueEventsEntry } from "../reducers/schedulerEntriesReducer";
import { listSchedulerEnqueueEventsAsync } from "../actions/schedulerEntriesActions";
import { timeAgo } from "../utils";

const useStyles = makeStyles((theme) => ({
  table: {
    height: "80vh",
  },
  stickyHeaderCell: {
    background: theme.palette.background.paper,
  },
}));

function mapStateToProps(state: AppState, ownProps: Props) {
  return {
    events: getEnqueueEventsEntry(state.schedulerEntries, ownProps.entryId),
  };
}

const connector = connect(mapStateToProps, { listSchedulerEnqueueEventsAsync });

type ReduxProps = ConnectedProps<typeof connector>;

interface Props {
  entryId: string; // Scheduler Entry ID
}

function SchedulerEnqueueEventsTable(props: Props & ReduxProps) {
  const classes = useStyles();
  const { listSchedulerEnqueueEventsAsync, entryId, events } = props;

  useEffect(() => {
    listSchedulerEnqueueEventsAsync(entryId);
  }, [entryId, listSchedulerEnqueueEventsAsync]);

  // TODO: loading state UI

  // TODO: "Load More" button OR infinite scroll

  return (
    <TableContainer className={classes.table}>
      <Table
        stickyHeader
        aria-label="scheduler enqueue events table"
        size="small"
      >
        <TableHead>
          <TableRow>
            <TableCell classes={{ stickyHeader: classes.stickyHeaderCell }}>
              Enqueued
            </TableCell>
            <TableCell classes={{ stickyHeader: classes.stickyHeaderCell }}>
              Task ID
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {events.data.map((e) => (
            <TableRow key={e.task_id}>
              <TableCell component="th" scope="row">
                {timeAgo(e.enqueued_at)}
              </TableCell>
              <TableCell>{e.task_id}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default connector(SchedulerEnqueueEventsTable);
