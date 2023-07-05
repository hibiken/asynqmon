import DialogTitle from "@material-ui/core/DialogTitle";
import React from "react";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import LinearProgress from "@material-ui/core/LinearProgress";
import { AppState } from "../store";
import { connect, ConnectedProps } from "react-redux";
import DialogContentText from "@material-ui/core/DialogContentText";
import { cancelFilterTasks } from "../actions/tasksActions";

function mapStateToProps(state: AppState) {
  const filterOp = state.tasks.filterOp;
  return {
    open: filterOp != null && !filterOp.done,
    processedTasks: filterOp?.processedTasks ?? 0,
    matches: filterOp?.result?.length ?? 0,
  };
}

const mapDispatchToProps = {
  cancelFilterTasks,
};

const connector = connect(mapStateToProps, mapDispatchToProps);
type ReduxProps = ConnectedProps<typeof connector>;

interface TasksFilterDialogProps extends ReduxProps {
  totalTasks: number;
}

function TasksFilterDialog(props: TasksFilterDialogProps) {
  let progress;
  if (props.totalTasks > 0) progress = props.processedTasks / props.totalTasks;
  else progress = 0;

  return (
    <Dialog open={props.open} fullWidth>
      <DialogTitle>Running filter</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Processed {props.processedTasks} of {props.totalTasks} total tasks,{" "}
          {props.matches} matches so far.
        </DialogContentText>
        <LinearProgress variant="determinate" value={progress * 100} />
      </DialogContent>
      <DialogActions>
        <Button onClick={props.cancelFilterTasks}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
}

export default connector(TasksFilterDialog);
