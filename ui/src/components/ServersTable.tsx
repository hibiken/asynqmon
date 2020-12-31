import React, { useState } from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import Alert from "@material-ui/lab/Alert";
import AlertTitle from "@material-ui/lab/AlertTitle";
import { ServerInfo } from "../api";
import { SortDirection, SortableTableColumn } from "../types/table";
import { timeAgo } from "../utils";

const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 650,
  },
  fixedCell: {
    position: "sticky",
    zIndex: 1,
    left: 0,
    background: theme.palette.common.white,
  },
}));

enum SortBy {
  Host,
  PID,
  Status,
  ActiveWorkers,
  Queues,
  Started,
}
const colConfigs: SortableTableColumn<SortBy>[] = [
  {
    label: "Host",
    key: "host",
    sortBy: SortBy.Host,
    align: "left",
  },
  {
    label: "PID",
    key: "pid",
    sortBy: SortBy.PID,
    align: "left",
  },
  {
    label: "Status",
    key: "status",
    sortBy: SortBy.Status,
    align: "left",
  },
  {
    label: "Active Workers",
    key: "workers",
    sortBy: SortBy.ActiveWorkers,
    align: "left",
  },
  {
    label: "Queues",
    key: "queues",
    sortBy: SortBy.Queues,
    align: "left",
  },
  {
    label: "Started",
    key: "started",
    sortBy: SortBy.Started,
    align: "left",
  },
];

// sortServers takes a array of server-infos and return a sorted array.
// It returns a new array and leave the original array untouched.
function sortServerInfos(
  entries: ServerInfo[],
  cmpFn: (first: ServerInfo, second: ServerInfo) => number
): ServerInfo[] {
  let copy = [...entries];
  copy.sort(cmpFn);
  return copy;
}

interface Props {
  servers: ServerInfo[];
}

export default function ServersTable(props: Props) {
  const classes = useStyles();
  const [sortBy, setSortBy] = useState<SortBy>(SortBy.Host);
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

  const cmpFunc = (s1: ServerInfo, s2: ServerInfo): number => {
    return 0; // TODO: implement this
  };

  if (props.servers.length === 0) {
    return (
      <Alert severity="info">
        <AlertTitle>Info</AlertTitle>
        No servers found at this time.
      </Alert>
    );
  }

  return (
    <TableContainer>
      <Table className={classes.table} aria-label="server info table">
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
          {sortServerInfos(props.servers, cmpFunc).map((srv) => (
            <Row key={srv.id} server={srv} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
interface RowProps {
  server: ServerInfo;
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
  const classes = useRowStyles();
  const { server } = props;
  return (
    <TableRow className={classes.rowRoot}>
      <TableCell>{server.host}</TableCell>
      <TableCell>{server.pid}</TableCell>
      <TableCell>{server.status}</TableCell>
      <TableCell>
        {server.active_workers.length}/{server.concurrency}
      </TableCell>
      <TableCell>{JSON.stringify(server.queue_priorities)}</TableCell>
      <TableCell>{timeAgo(server.start_time)}</TableCell>
    </TableRow>
  );
}
