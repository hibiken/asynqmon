import React, { useEffect } from "react";
import { connect, ConnectedProps } from "react-redux";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Typography from "@material-ui/core/Typography";
import { AppState } from "../store";
import {
  listConnectionsAsync,
  selectConnection,
} from "../actions/connectionsActions";
import { setSelectedConnectionName } from "../api";
import { paths } from "../paths";

const useStyles = makeStyles((theme) => ({
  root: {
    marginLeft: "auto",
    display: "flex",
    alignItems: "center",
  },
  label: {
    marginRight: theme.spacing(1),
    color: theme.palette.text.secondary,
  },
  select: {
    minWidth: 180,
  },
}));

function mapStateToProps(state: AppState) {
  return {
    connections: state.connections.connections,
    selected: state.connections.selected,
    loading: state.connections.loading,
  };
}

const mapDispatchToProps = {
  listConnectionsAsync,
  selectConnection,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type Props = ConnectedProps<typeof connector>;

function ConnectionSelector(props: Props) {
  const classes = useStyles();
  const history = useHistory();

  useEffect(() => {
    props.listConnectionsAsync();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setSelectedConnectionName(props.selected);
  }, [props.selected]);

  const handleSelect = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    const value = event.target.value as string;
    if (value === props.selected) {
      return;
    }
    props.selectConnection(value);
    history.push(paths().HOME);
  };

  return (
    <div className={classes.root}>
      <Typography variant="body2" className={classes.label}>
        Redis
      </Typography>
      <FormControl size="small">
        <Select
          className={classes.select}
          value={props.selected || ""}
          displayEmpty
          onChange={handleSelect}
          disabled={props.loading && props.connections.length === 0}
        >
          {props.connections.length === 0 && (
            <MenuItem value="" disabled>
              No connections
            </MenuItem>
          )}
          {props.connections.map((c) => (
            <MenuItem key={c.name} value={c.name}>
              {c.name} ({c.addr})
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}

export default connector(ConnectionSelector);
