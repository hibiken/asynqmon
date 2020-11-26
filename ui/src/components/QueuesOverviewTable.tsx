import React, { useState } from "react";
import clsx from "clsx";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableFooter from "@material-ui/core/TableFooter";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import IconButton from "@material-ui/core/IconButton";
import PauseCircleFilledIcon from "@material-ui/icons/PauseCircleFilled";
import PlayCircleFilledIcon from "@material-ui/icons/PlayCircleFilled";
import DeleteIcon from "@material-ui/icons/Delete";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import { Queue } from "../api";
import { queueDetailsPath } from "../paths";

const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 650,
  },
  linkCell: {
    textDecoration: "none",
  },
  footerCell: {
    fontWeight: 600,
    fontSize: "0.875rem",
    borderBottom: "none",
  },
  boldCell: {
    fontWeight: 600,
  },
  fixedCell: {
    position: "sticky",
    zIndex: 1,
    left: 0,
    background: theme.palette.common.white,
  },
  actionIconsContainer: {
    display: "flex",
    justifyContent: "center",
    width: "100px",
  },
}));

interface QueueWithMetadata extends Queue {
  pauseRequestPending: boolean; // indicates pause/resume request is pending for the queue.
}

interface Props {
  queues: QueueWithMetadata[];
  onPauseClick: (qname: string) => Promise<void>;
  onResumeClick: (qname: string) => Promise<void>;
}

enum SortBy {
  Queue,
  Size,
  Active,
  Pending,
  Scheduled,
  Retry,
  Dead,
  Processed,
  Succeeded,
  Failed,

  None, // no sort support
}

enum SortDirection {
  Asc = "asc",
  Desc = "desc",
}

interface ColumnConfig {
  label: string;
  key: string;
  sortBy: SortBy;
  align: "left" | "right" | "center";
}

const colConfigs: ColumnConfig[] = [
  { label: "Queue", key: "queue", sortBy: SortBy.Queue, align: "left" },
  { label: "Size", key: "size", sortBy: SortBy.Size, align: "right" },
  { label: "Active", key: "active", sortBy: SortBy.Active, align: "right" },
  { label: "Pending", key: "pending", sortBy: SortBy.Pending, align: "right" },
  {
    label: "Scheduled",
    key: "scheduled",
    sortBy: SortBy.Scheduled,
    align: "right",
  },
  { label: "Retry", key: "retry", sortBy: SortBy.Retry, align: "right" },
  { label: "Dead", key: "dead", sortBy: SortBy.Dead, align: "right" },
  {
    label: "Processed",
    key: "processed",
    sortBy: SortBy.Processed,
    align: "right",
  },
  {
    label: "Succeeded",
    key: "Succeeded",
    sortBy: SortBy.Succeeded,
    align: "right",
  },
  { label: "Failed", key: "failed", sortBy: SortBy.Failed, align: "right" },
  { label: "Actions", key: "actions", sortBy: SortBy.None, align: "center" },
];

// sortQueues takes a array of queues and return a sorted array.
// It returns a new array and leave the original array untouched.
function sortQueues(
  queues: QueueWithMetadata[],
  cmpFn: (first: QueueWithMetadata, second: QueueWithMetadata) => number
): QueueWithMetadata[] {
  let copy = [...queues];
  copy.sort(cmpFn);
  return copy;
}

export default function QueuesOverviewTable(props: Props) {
  const classes = useStyles();
  const [sortBy, setSortBy] = useState<SortBy>(SortBy.Queue);
  const [sortDir, setSortDir] = useState<SortDirection>(SortDirection.Asc);
  const [activeRowIndex, setActiveRowIndex] = useState<number>(-1);
  const total = getAggregateCounts(props.queues);

  const createSortClickHandler = (sortKey: SortBy) => (e: React.MouseEvent) => {
    if (sortKey === sortBy) {
      // Toggle sort direction.
      const nextSortDir =
        sortDir === SortDirection.Asc ? SortDirection.Desc : SortDirection.Asc;
      setSortDir(nextSortDir);
    } else {
      // Change the sort key.
      setSortBy(sortKey);
    }
  };

  const cmpFunc = (q1: QueueWithMetadata, q2: QueueWithMetadata): number => {
    let isQ1Smaller: boolean;
    switch (sortBy) {
      case SortBy.Queue:
        if (q1.queue === q2.queue) return 0;
        isQ1Smaller = q1.queue < q2.queue;
        break;
      case SortBy.Size:
        if (q1.size === q2.size) return 0;
        isQ1Smaller = q1.size < q2.size;
        break;
      case SortBy.Active:
        if (q1.active === q2.active) return 0;
        isQ1Smaller = q1.active < q2.active;
        break;
      case SortBy.Pending:
        if (q1.pending === q2.pending) return 0;
        isQ1Smaller = q1.pending < q2.pending;
        break;
      case SortBy.Scheduled:
        if (q1.scheduled === q2.scheduled) return 0;
        isQ1Smaller = q1.scheduled < q2.scheduled;
        break;
      case SortBy.Retry:
        if (q1.retry === q2.retry) return 0;
        isQ1Smaller = q1.retry < q2.retry;
        break;
      case SortBy.Dead:
        if (q1.dead === q2.dead) return 0;
        isQ1Smaller = q1.dead < q2.dead;
        break;
      case SortBy.Processed:
        if (q1.processed === q2.processed) return 0;
        isQ1Smaller = q1.processed < q2.processed;
        break;
      case SortBy.Succeeded:
        const q1Succeeded = q1.processed - q1.failed;
        const q2Succeeded = q2.processed - q2.failed;
        if (q1Succeeded === q2Succeeded) return 0;
        isQ1Smaller = q1Succeeded < q2Succeeded;
        break;
      case SortBy.Failed:
        if (q1.failed === q2.failed) return 0;
        isQ1Smaller = q1.failed < q2.failed;
        break;
      default:
        // eslint-disable-next-line no-throw-literal
        throw `Unexpected order by value: ${sortBy}`;
    }
    if (sortDir === SortDirection.Asc) {
      return isQ1Smaller ? -1 : 1;
    } else {
      return isQ1Smaller ? 1 : -1;
    }
  };

  return (
    <TableContainer>
      <Table className={classes.table} aria-label="queues overview table">
        <TableHead>
          <TableRow>
            {colConfigs.map((cfg, i) => (
              <TableCell
                key={cfg.key}
                align={cfg.align}
                className={clsx(i === 0 && classes.fixedCell)}
              >
                {cfg.sortBy !== SortBy.None ? (
                  <TableSortLabel
                    active={sortBy === cfg.sortBy}
                    direction={sortDir}
                    onClick={createSortClickHandler(cfg.sortBy)}
                  >
                    {cfg.label}
                  </TableSortLabel>
                ) : (
                  <div>{cfg.label}</div>
                )}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {sortQueues(props.queues, cmpFunc).map((q, i) => (
            <TableRow
              key={q.queue}
              onMouseEnter={() => setActiveRowIndex(i)}
              onMouseLeave={() => setActiveRowIndex(-1)}
            >
              <TableCell
                component="th"
                scope="row"
                className={clsx(classes.boldCell, classes.fixedCell)}
              >
                <Link to={queueDetailsPath(q.queue)}>
                  {q.queue}
                  {q.paused ? " (paused)" : ""}
                </Link>
              </TableCell>
              <TableCell align="right" className={classes.boldCell}>
                {q.size}
              </TableCell>
              <TableCell align="right">
                <Link
                  to={queueDetailsPath(q.queue, "active")}
                  className={classes.linkCell}
                >
                  {q.active}
                </Link>
              </TableCell>
              <TableCell align="right">
                <Link
                  to={queueDetailsPath(q.queue, "pending")}
                  className={classes.linkCell}
                >
                  {q.pending}
                </Link>
              </TableCell>
              <TableCell align="right">
                <Link
                  to={queueDetailsPath(q.queue, "scheduled")}
                  className={classes.linkCell}
                >
                  {q.scheduled}
                </Link>
              </TableCell>
              <TableCell align="right">
                <Link
                  to={queueDetailsPath(q.queue, "retry")}
                  className={classes.linkCell}
                >
                  {q.retry}
                </Link>
              </TableCell>
              <TableCell align="right">
                <Link
                  to={queueDetailsPath(q.queue, "dead")}
                  className={classes.linkCell}
                >
                  {q.dead}
                </Link>
              </TableCell>
              <TableCell align="right" className={classes.boldCell}>
                {q.processed}
              </TableCell>
              <TableCell align="right">{q.processed - q.failed}</TableCell>
              <TableCell align="right">{q.failed}</TableCell>
              <TableCell align="center">
                <div className={classes.actionIconsContainer}>
                  {activeRowIndex === i ? (
                    <React.Fragment>
                      {q.paused ? (
                        <IconButton
                          color="secondary"
                          onClick={() => props.onResumeClick(q.queue)}
                          disabled={q.pauseRequestPending}
                        >
                          <PlayCircleFilledIcon />
                        </IconButton>
                      ) : (
                        <IconButton
                          color="primary"
                          onClick={() => props.onPauseClick(q.queue)}
                          disabled={q.pauseRequestPending}
                        >
                          <PauseCircleFilledIcon />
                        </IconButton>
                      )}
                      <IconButton
                        onClick={() => console.log("TODO: delete this queue")}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </React.Fragment>
                  ) : (
                    <IconButton>
                      <MoreHorizIcon />
                    </IconButton>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell className={clsx(classes.fixedCell, classes.footerCell)}>
              Total
            </TableCell>
            <TableCell className={classes.footerCell} align="right">
              {total.size}
            </TableCell>
            <TableCell className={classes.footerCell} align="right">
              {total.active}
            </TableCell>
            <TableCell className={classes.footerCell} align="right">
              {total.pending}
            </TableCell>
            <TableCell className={classes.footerCell} align="right">
              {total.scheduled}
            </TableCell>
            <TableCell className={classes.footerCell} align="right">
              {total.retry}
            </TableCell>
            <TableCell className={classes.footerCell} align="right">
              {total.dead}
            </TableCell>
            <TableCell className={classes.footerCell} align="right">
              {total.processed}
            </TableCell>
            <TableCell className={classes.footerCell} align="right">
              {total.succeeded}
            </TableCell>
            <TableCell className={classes.footerCell} align="right">
              {total.failed}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
}

interface AggregateCounts {
  size: number;
  active: number;
  pending: number;
  scheduled: number;
  retry: number;
  dead: number;
  processed: number;
  succeeded: number;
  failed: number;
}

function getAggregateCounts(queues: Queue[]): AggregateCounts {
  let total = {
    size: 0,
    active: 0,
    pending: 0,
    scheduled: 0,
    retry: 0,
    dead: 0,
    processed: 0,
    succeeded: 0,
    failed: 0,
  };
  queues.forEach((q) => {
    total.size += q.size;
    total.active += q.active;
    total.pending += q.pending;
    total.scheduled += q.scheduled;
    total.retry += q.retry;
    total.dead += q.dead;
    total.processed += q.processed;
    total.succeeded += q.processed - q.failed;
    total.failed += q.failed;
  });
  return total;
}
