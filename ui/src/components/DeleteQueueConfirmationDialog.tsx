import React from "react";
import { connect, ConnectedProps } from "react-redux";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { Queue } from "../api";
import { AppState } from "../store";
import { deleteQueueAsync } from "../actions/queuesActions";

interface Props {
  queue: Queue | null; // queue to delete
  onClose: () => void;
}

function mapStateToProps(state: AppState, ownProps: Props) {
  let requestPending = false;
  if (ownProps.queue !== null) {
    const q = state.queues.data.find((q) => q.name === ownProps.queue?.queue);
    if (q !== undefined) {
      requestPending = q.requestPending;
    }
  }
  return {
    requestPending,
  };
}

const connector = connect(mapStateToProps, { deleteQueueAsync });

type ReduxProps = ConnectedProps<typeof connector>;

function DeleteQueueConfirmationDialog(props: Props & ReduxProps) {
  const handleDeleteClick = () => {
    if (!props.queue) {
      return;
    }
    props.deleteQueueAsync(props.queue.queue);
    props.onClose();
  };
  return (
    <Dialog
      open={props.queue !== null}
      onClose={props.onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      {props.queue !== null &&
        (props.queue.size > 0 ? (
          <>
            <DialogTitle id="alert-dialog-title">
              Queue is not empty
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                You are trying to delete a non-emtpy queue "{props.queue.queue}
                ". Please empty the queue first before deleting.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={props.onClose} color="primary">
                OK
              </Button>
            </DialogActions>
          </>
        ) : (
          <>
            <DialogTitle id="alert-dialog-title">
              Are you sure you want to delete "{props.queue.queue}"?
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                You can't undo this action.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={props.onClose}
                disabled={props.requestPending}
                color="primary"
              >
                Cancel
              </Button>
              <Button
                onClick={handleDeleteClick}
                disabled={props.requestPending}
                color="primary"
                autoFocus
              >
                Delete
              </Button>
            </DialogActions>
          </>
        ))}
    </Dialog>
  );
}

export default connector(DeleteQueueConfirmationDialog);
