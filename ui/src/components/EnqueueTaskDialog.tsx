import React, { FormEvent, useEffect, useState } from "react";
import Alert from "@material-ui/lab/Alert";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";

export interface EnqueueTaskDialogProps {
  open: boolean;
  queue: string;
  loading: boolean;
  error?: string | null;
  onClose: () => void;
  onEnqueue: (type: string, payload: string) => Promise<void> | void;
}

const initialValue = "";

export default function EnqueueTaskDialog(props: EnqueueTaskDialogProps) {
  const [taskType, setTaskType] = useState(initialValue);
  const [payload, setPayload] = useState(initialValue);

  const reset = () => {
    setTaskType(initialValue);
    setPayload(initialValue);
  };

  // Reset the form when the parent closes the dialog without going through
  // the dialog's own close handler (for example, after a successful enqueue).
  useEffect(() => {
    if (!props.open) {
      setTaskType(initialValue);
      setPayload(initialValue);
    }
  }, [props.open]);

  const handleClose = () => {
    if (props.loading) {
      return;
    }
    reset();
    props.onClose();
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const type = taskType.trim();
    if (!type || props.loading) {
      return;
    }
    await props.onEnqueue(type, payload);
  };

  return (
    <Dialog
      open={props.open}
      onClose={handleClose}
      aria-labelledby="enqueue-task-dialog-title"
      maxWidth="sm"
      fullWidth
    >
      <form onSubmit={handleSubmit} noValidate>
        <DialogTitle id="enqueue-task-dialog-title">Enqueue task</DialogTitle>
        <DialogContent>
          <Typography color="textSecondary" variant="body2" gutterBottom>
            Queue: {props.queue}
          </Typography>
          <TextField
            autoFocus
            required
            fullWidth
            margin="normal"
            variant="outlined"
            label="Task type"
            value={taskType}
            onChange={(event) => setTaskType(event.target.value)}
            disabled={props.loading}
            inputProps={{ "aria-label": "Task type" }}
          />
          <TextField
            fullWidth
            multiline
            rows={8}
            margin="normal"
            variant="outlined"
            label="Payload"
            value={payload}
            onChange={(event) => setPayload(event.target.value)}
            disabled={props.loading}
            InputProps={{
              style: { fontFamily: "monospace" },
            }}
            inputProps={{ "aria-label": "Payload" }}
          />
          {props.error && (
            <Alert severity="error" role="alert">
              {props.error}
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={props.loading}>
            Cancel
          </Button>
          <Button
            type="submit"
            color="primary"
            variant="contained"
            disabled={props.loading || taskType.trim().length === 0}
          >
            {props.loading ? (
              <CircularProgress size={20} aria-label="Enqueuing task" />
            ) : (
              "Enqueue"
            )}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
