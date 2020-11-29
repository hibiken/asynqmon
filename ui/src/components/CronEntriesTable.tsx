import React, { useState } from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import SyntaxHighlighter from "react-syntax-highlighter";
import syntaxHighlightStyle from "react-syntax-highlighter/dist/esm/styles/hljs/github";
import { SortDirection, ColumnConfig } from "../types/table";
import TableSortLabel from "@material-ui/core/TableSortLabel";

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
    background: theme.palette.common.white,
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
}

const colConfigs: ColumnConfig<SortBy>[] = [
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
    key: "payload",
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
];

function createData(
  id: string,
  spec: string,
  type: string,
  payload: any,
  options: string,
  nextEnqueue: string,
  prevEnqueue: string
) {
  return { id, spec, type, payload, options, nextEnqueue, prevEnqueue };
}

const rows = [
  createData(
    "da0e15bb-3649-45de-9c36-90b9db744b8a",
    "*/5 * * * *",
    "email:welcome",
    { user_id: 42 },
    "[Queue('email')]",
    "In 29s",
    "4m31s ago"
  ),
  createData(
    "fi0e10bb-3649-45de-9c36-90b9db744b8a",
    "* 1 * * *",
    "email:daily_digest",
    {},
    "[Queue('email')]",
    "In 23h",
    "1h ago"
  ),
  createData(
    "ca0e17bv-3649-45de-9c36-90b9db744b8a",
    "@every 10m",
    "search:reindex",
    {},
    "[Queue('index')]",
    "In 2m",
    "8m ago"
  ),
  createData(
    "we4e15bb-3649-45de-9c36-90b9db744b8a",
    "*/5 * * * *",
    "janitor",
    { user_id: 42 },
    "[Queue('low')]",
    "In 29s",
    "4m31s ago"
  ),
];

interface Entry {
  id: string;
  spec: string;
  type: string;
  payload: any;
  options: string;
  nextEnqueue: string;
  prevEnqueue: string;
}

// sortEntries takes a array of entries and return a sorted array.
// It returns a new array and leave the original array untouched.
function sortEntries(
  entries: Entry[],
  cmpFn: (first: Entry, second: Entry) => number
): Entry[] {
  let copy = [...entries];
  copy.sort(cmpFn);
  return copy;
}

export default function CronEntriesTable() {
  const classes = useStyles();
  const [sortBy, setSortBy] = useState<SortBy>(SortBy.EntryId);
  const [sortDir, setSortDir] = useState<SortDirection>(SortDirection.Asc);

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

  const cmpFunc = (e1: Entry, q2: Entry): number => {
    let isE1Smaller: boolean;
    switch (sortBy) {
      case SortBy.EntryId:
        if (e1.id === q2.id) return 0;
        isE1Smaller = e1.id < q2.id;
        break;
      case SortBy.Spec:
        if (e1.spec === q2.spec) return 0;
        isE1Smaller = e1.spec < q2.spec;
        break;
      case SortBy.Type:
        if (e1.type === q2.type) return 0;
        isE1Smaller = e1.type < q2.type;
        break;
      case SortBy.Payload:
        if (e1.payload === q2.payload) return 0;
        isE1Smaller = e1.payload < q2.payload;
        break;
      case SortBy.Options:
        if (e1.options === q2.options) return 0;
        isE1Smaller = e1.options < q2.options;
        break;
      case SortBy.NextEnqueue:
        if (e1.nextEnqueue === q2.nextEnqueue) return 0;
        isE1Smaller = e1.nextEnqueue < q2.nextEnqueue;
        break;
      case SortBy.PrevEnqueue:
        if (e1.prevEnqueue === q2.prevEnqueue) return 0;
        isE1Smaller = e1.prevEnqueue < q2.prevEnqueue;
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

  return (
    <TableContainer>
      <Table className={classes.table} aria-label="simple table">
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
          {sortEntries(rows, cmpFunc).map((row, idx) => {
            const isLastRow = idx === rows.length - 1;
            return (
              <TableRow key={row.id}>
                <TableCell
                  component="th"
                  scope="row"
                  className={clsx(isLastRow && classes.noBorder)}
                >
                  {row.id}
                </TableCell>
                <TableCell className={clsx(isLastRow && classes.noBorder)}>
                  {row.spec}
                </TableCell>
                <TableCell className={clsx(isLastRow && classes.noBorder)}>
                  {row.type}
                </TableCell>
                <TableCell className={clsx(isLastRow && classes.noBorder)}>
                  <SyntaxHighlighter
                    language="json"
                    style={syntaxHighlightStyle}
                  >
                    {JSON.stringify(row.payload)}
                  </SyntaxHighlighter>
                </TableCell>
                <TableCell className={clsx(isLastRow && classes.noBorder)}>
                  <SyntaxHighlighter language="go" style={syntaxHighlightStyle}>
                    {row.options}
                  </SyntaxHighlighter>
                </TableCell>
                <TableCell className={clsx(isLastRow && classes.noBorder)}>
                  {row.nextEnqueue}
                </TableCell>
                <TableCell className={clsx(isLastRow && classes.noBorder)}>
                  {row.prevEnqueue}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
