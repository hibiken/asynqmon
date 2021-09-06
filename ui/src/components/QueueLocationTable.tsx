import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { QueueLocation } from "../api";

const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 650,
  },
}));

interface Props {
  queueLocations: QueueLocation[];
}

export default function QueueLocationTable(props: Props) {
  const classes = useStyles();

  return (
    <TableContainer>
      <Table className={classes.table} aria-label="queue location table">
        <TableHead>
          <TableRow>
            <TableCell>Queue</TableCell>
            <TableCell>KeySlot</TableCell>
            <TableCell>Node Addresses</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.queueLocations.map((loc) => (
            <TableRow key={loc.queue}>
              <TableCell component="th" scope="row">
                {loc.queue}
              </TableCell>
              <TableCell>{loc.keyslot}</TableCell>
              <TableCell>{loc.nodes.join(", ")}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
