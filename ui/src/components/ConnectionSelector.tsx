import React, { useEffect, useState } from "react";
import { connect, ConnectedProps } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import AddIcon from "@material-ui/icons/Add";
import { AppState } from "../store";
import {
  createConnectionAsync,
  listConnectionsAsync,
  selectConnection,
} from "../actions/connectionsActions";
import { setSelectedConnectionName } from "../api";

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
    marginRight: theme.spacing(1),
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
  createConnectionAsync,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type Props = ConnectedProps<typeof connector>;

function ConnectionSelector(props: Props) {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [addr, setAddr] = useState("");
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

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
    if (value === "__add__") {
      setOpen(true);
      return;
    }
    props.selectConnection(value);
  };

  const handleCreate = async () => {
    setFormError("");
    setSaving(true);
    try {
      await props.createConnectionAsync(name.trim(), addr.trim());
      setOpen(false);
      setName("");
      setAddr("");
    } catch (err) {
      setFormError(err instanceof Error ? err.message : String(err));
    } finally {
      setSaving(false);
    }
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
          <MenuItem value="__add__">
            <AddIcon fontSize="small" style={{ marginRight: 8 }} />
            Add connection
          </MenuItem>
        </Select>
      </FormControl>
      <Button
        size="small"
        color="primary"
        startIcon={<AddIcon />}
        onClick={() => setOpen(true)}
      >
        Add
      </Button>

      <Dialog open={open} onClose={() => !saving && setOpen(false)}>
        <DialogTitle>Add Redis connection</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Name"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="redis-a"
          />
          <TextField
            margin="dense"
            label="Address"
            fullWidth
            value={addr}
            onChange={(e) => setAddr(e.target.value)}
            placeholder="redis-a:6379"
          />
          {formError && (
            <Typography color="error" variant="body2">
              {formError}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} disabled={saving}>
            Cancel
          </Button>
          <Button
            onClick={handleCreate}
            color="primary"
            disabled={saving || !name.trim() || !addr.trim()}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default connector(ConnectionSelector);
