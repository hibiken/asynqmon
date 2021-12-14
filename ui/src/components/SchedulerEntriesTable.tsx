import React, { useState } from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Modal from "@material-ui/core/Modal";
import Typography from "@material-ui/core/Typography";
import Tooltip from "@material-ui/core/Tooltip";
import HistoryIcon from "@material-ui/icons/History";
import Alert from "@material-ui/lab/Alert";
import AlertTitle from "@material-ui/lab/AlertTitle";
import { SortDirection, SortableTableColumn } from "../types/table";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import SyntaxHighlighter from "./SyntaxHighlighter";
import { SchedulerEntry } from "../api";
import { timeAgo, durationBefore, prettifyPayload } from "../utils";
import SchedulerEnqueueEventsTable from "./SchedulerEnqueueEventsTable";

const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 650,
  },
  noBorder: {
    border: "none",
  },
  fixedCell: {
    position: "sticky",
    zIndex: 1,
    left: 0,
    background: theme.palette.background.paper,
  },
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  modalContent: {
    background: theme.palette.background.paper,
    padding: theme.spacing(2),
    width: "540px",
    outline: "none",
    borderRadius: theme.shape.borderRadius,
  },
  eventsTable: {
    maxHeight: "80vh",
  },
}));

enum SortBy {
  EntryId,
  Spec,
  Type,
  Payload,
  Options,
  NextEnqueue,
  PrevEnqueue,

  None,
}

const colConfigs: SortableTableColumn<SortBy>[] = [
  {
    label: "Entry ID",
    key: "entry_id",
    sortBy: SortBy.EntryId,
    align: "left",
  },
  {
    label: "Spec",
    key: "spec",
    sortBy: SortBy.Spec,
    align: "left",
  },
  {
    label: "Type",
    key: "type",
    sortBy: SortBy.Type,
    align: "left",
  },
  {
    label: "Payload",
    key: "task_payload",
    sortBy: SortBy.Payload,
    align: "left",
  },
  {
    label: "Options",
    key: "options",
    sortBy: SortBy.Options,
    align: "left",
  },
  {
    label: "Next Enqueue",
    key: "next_enqueue",
    sortBy: SortBy.NextEnqueue,
    align: "left",
  },
  {
    label: "Prev Enqueue",
    key: "prev_enqueue",
    sortBy: SortBy.PrevEnqueue,
    align: "left",
  },
  {
    label: "",
    key: "show_history",
    sortBy: SortBy.None,
    align: "left",
  },
];

// sortEntries takes a array of entries and return a sorted array.
// It returns a new array and leave the original array untouched.
function sortEntries(
  entries: SchedulerEntry[],
  cmpFn: (first: SchedulerEntry, second: SchedulerEntry) => number
): SchedulerEntry[] {
  let copy = [...entries];
  copy.sort(cmpFn);
  return copy;
}

interface Props {
  entries: SchedulerEntry[];
}

export default function SchedulerEntriesTable(props: Props) {
  const classes = useStyles();
  const [sortBy, setSortBy] = useState<SortBy>(SortBy.EntryId);
  const [sortDir, setSortDir] = useState<SortDirection>(SortDirection.Asc);
  const [activeEntryId, setActiveEntryId] = useState<string>("");

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

  const cmpFunc = (e1: SchedulerEntry, e2: SchedulerEntry): number => {
    let isE1Smaller: boolean;
    switch (sortBy) {
      case SortBy.EntryId:
        if (e1.id === e2.id) return 0;
        isE1Smaller = e1.id < e2.id;
        break;
      case SortBy.Spec:
        if (e1.spec === e2.spec) return 0;
        isE1Smaller = e1.spec < e2.spec;
        break;
      case SortBy.Type:
        if (e1.task_type === e2.task_type) return 0;
        isE1Smaller = e1.task_type < e2.task_type;
        break;
      case SortBy.Payload:
        if (e1.task_payload === e2.task_payload) return 0;
        isE1Smaller = e1.task_payload < e2.task_payload;
        break;
      case SortBy.Options:
        if (e1.options === e2.options) return 0;
        isE1Smaller = e1.options < e2.options;
        break;
      case SortBy.NextEnqueue:
        if (e1.next_enqueue_at === e2.next_enqueue_at) return 0;
        isE1Smaller = e1.next_enqueue_at < e2.next_enqueue_at;
        break;
      case SortBy.PrevEnqueue:
        const e1PrevEnqueueAt = e1.prev_enqueue_at || "";
        const e2PrevEnqueueAt = e2.prev_enqueue_at || "";
        if (e1PrevEnqueueAt === e2PrevEnqueueAt) return 0;
        isE1Smaller = e1PrevEnqueueAt < e2PrevEnqueueAt;
        break;
      default:
        // eslint-disable-next-line no-throw-literal
        throw `Unexpected order by value: ${sortBy}`;
    }
    if (sortDir === SortDirection.Asc) {
      return isE1Smaller ? -1 : 1;
    } else {
      return isE1Smaller ? 1 : -1;
    }
  };

  if (props.entries.length === 0) {
    return (
      <Alert severity="info">
        <AlertTitle>Info</AlertTitle>
        No entries found at this time.
      </Alert>
    );
  }

  return (
    <>
      <TableContainer>
        <Table className={classes.table} aria-label="scheduler entries table">
          <TableHead>
            <TableRow>
              {colConfigs.map((cfg, i) => (
                <TableCell
                  key={cfg.key}
                  align={cfg.align}
                  className={clsx(i === 0 && classes.fixedCell)}
                >
                  <TableSortLabel
                    active={cfg.sortBy === sortBy}
                    direction={sortDir}
                    onClick={createSortClickHandler(cfg.sortBy)}
                  >
                    {cfg.label}
                  </TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {sortEntries(props.entries, cmpFunc).map((entry, idx) => (
              <Row
                key={entry.id}
                entry={entry}
                isLastRow={idx === props.entries.length - 1}
                onShowHistoryClick={() => setActiveEntryId(entry.id)}
              />
            ))}
          </TableBody>
        </Table>
        <Modal
          open={activeEntryId !== ""}
          onClose={() => setActiveEntryId("")}
          className={classes.modal}
        >
          <div className={classes.modalContent}>
            <Typography variant="h6" gutterBottom color="textPrimary">
              Recent History
            </Typography>
            <SchedulerEnqueueEventsTable entryId={activeEntryId} />
          </div>
        </Modal>
      </TableContainer>
    </>
  );
}

interface RowProps {
  entry: SchedulerEntry;
  isLastRow: boolean;
  onShowHistoryClick: () => void;
}

const useRowStyles = makeStyles((theme) => ({
  rowRoot: {
    "& > *": {
      borderBottom: "unset",
    },
  },
  noBorder: {
    border: "none",
  },
}));

function Row(props: RowProps) {
  const { entry, isLastRow } = props;
  const classes = useRowStyles();
  return (
    <TableRow className={classes.rowRoot}>
      <TableCell
        component="th"
        scope="row"
        className={clsx(isLastRow && classes.noBorder)}
      >
        {entry.id}
      </TableCell>
      <TableCell className={clsx(isLastRow && classes.noBorder)}>
        {entry.spec}
      </TableCell>
      <TableCell className={clsx(isLastRow && classes.noBorder)}>
        {entry.task_type}
      </TableCell>
      <TableCell className={clsx(isLastRow && classes.noBorder)}>
        <SyntaxHighlighter language="json">
          {prettifyPayload(entry.task_payload)}
        </SyntaxHighlighter>
      </TableCell>
      <TableCell className={clsx(isLastRow && classes.noBorder)}>
        <SyntaxHighlighter language="go">
          {entry.options.length > 0 ? entry.options.join(", ") : "No options"}
        </SyntaxHighlighter>
      </TableCell>
      <TableCell className={clsx(isLastRow && classes.noBorder)}>
        {durationBefore(entry.next_enqueue_at)}
      </TableCell>
      <TableCell className={clsx(isLastRow && classes.noBorder)}>
        {entry.prev_enqueue_at ? timeAgo(entry.prev_enqueue_at) : "N/A"}
      </TableCell>
      <TableCell>
        <Tooltip title="See History">
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={props.onShowHistoryClick}
          >
            <HistoryIcon />
          </IconButton>
        </Tooltip>
      </TableCell>
    </TableRow>
  );
}
