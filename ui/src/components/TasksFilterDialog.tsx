import React, {
  ChangeEventHandler,
  KeyboardEventHandler,
  useState,
} from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import { TasksFilter } from "../actions/tasksActions";
import DialogContentText from "@material-ui/core/DialogContentText";

interface TasksFilterDialogProps {
  open: boolean;
  onClose?: () => void;
  onFilter?: (filter: TasksFilter) => void;
}

function TasksFilterDialog(props: TasksFilterDialogProps) {
  const [customJs, setCustomJs] = useState("");
  const [payloadQuery, setPayloadQuery] = useState("");
  const [resultQuery, setResultQuery] = useState("");
  const [payloadRegex, setPayloadRegex] = useState("");
  const [resultRegex, setResultRegex] = useState("");
  const [resultLimitStr, setResultLimitStr] = useState("");
  const [resultLimit, setResultLimit] = useState(-1);
  const [resultLimitError, setResultLimitError] = useState<string | null>(null);

  const buildFilter = () => {
    if (resultLimitError != null) return null;

    const filter: TasksFilter = {};
    if (payloadQuery.trim().length > 0) filter.payloadQuery = payloadQuery;
    if (resultQuery.trim().length > 0) filter.resultQuery = resultQuery;
    if (payloadRegex.trim().length > 0)
      filter.payloadRegex = RegExp(payloadRegex);
    if (resultRegex.trim().length > 0) filter.resultRegex = RegExp(resultRegex);
    if (customJs.trim().length > 0) filter.customJs = customJs;
    if (resultLimit >= 0) filter.resultLimit = resultLimit;
    return filter;
  };

  const handleRunFilter = () => {
    const filter = buildFilter();
    if (filter != null) {
      if (props.onClose != null) props.onClose();
      if (props.onFilter != null) props.onFilter(filter);
    }
  };

  const handleKeyDown: KeyboardEventHandler = (event) => {
    if (event.key === "Enter") {
      handleRunFilter();
    }
  };

  const handleResultLimitChange: ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    const value = event.target.value;
    setResultLimitStr(value);
    const trimmedValue = value.trim();
    if (trimmedValue.length === 0) {
      setResultLimit(-1);
      setResultLimitError(null);
    } else {
      const parsed = parseInt(trimmedValue, 10);
      if (isNaN(parsed) || parsed < 0) {
        setResultLimit(-1);
        setResultLimitError("Please enter a valid positive number.");
      } else {
        setResultLimit(parsed);
        setResultLimitError(null);
      }
    }
  };

  return (
    <Dialog open={props.open} onClose={props.onClose}>
      <DialogTitle>Filter tasks</DialogTitle>
      <DialogContent>
        <DialogContentText>
          <p style={{ marginTop: 0 }}>
            Filter results are stored in browser memory, please ensure that your
            filter does not return too many results.
          </p>
          <p>
            This feature may not behave correctly if the payload or result are
            truncated due to <code>MaxPayloadLength</code> or{" "}
            <code>MaxResultLength</code> being misconfigured.
          </p>
        </DialogContentText>
        <TextField
          label="Payload keyword"
          placeholder="Search for tasks with payloads containing the specified text"
          value={payloadQuery}
          fullWidth
          variant="filled"
          onChange={(e) => setPayloadQuery(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <TextField
          label="Result keyword"
          placeholder="Search for tasks with results containing the specified text"
          value={resultQuery}
          fullWidth
          variant="filled"
          onChange={(e) => setResultQuery(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <TextField
          label="Payload regex"
          placeholder="Search for tasks with payloads matching the specified regex"
          value={payloadRegex}
          fullWidth
          variant="filled"
          onChange={(e) => setPayloadRegex(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <TextField
          label="Query regex"
          placeholder="Search for tasks with results matching the specified regex"
          value={resultRegex}
          fullWidth
          variant="filled"
          onChange={(e) => setResultRegex(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <TextField
          label="JavaScript expression"
          placeholder={
            "Example:\npayload.auth.user_id === 'f094d054-64c0-42a3-a413-3f5a4eae0088'\n\nAvailable variables: " +
            "id, queue, type, state, start_time, max_retry, retried, last_failed_at, error_message, next_process_at, " +
            "timeout_seconds, deadline, group, completed_at, ttl_seconds, is_orphaned, payload, result"
          }
          value={customJs}
          multiline
          minRows={7}
          fullWidth
          variant="filled"
          onChange={(e) => setCustomJs(e.target.value)}
        />
        <TextField
          label={"Limit number of results"}
          placeholder={"Leave blank for no limit"}
          variant="filled"
          fullWidth
          value={resultLimitStr}
          onKeyDown={handleKeyDown}
          onChange={handleResultLimitChange}
          error={resultLimitError != null}
          helperText={resultLimitError}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onClose}>Cancel</Button>
        <Button onClick={handleRunFilter}>Run</Button>
      </DialogActions>
    </Dialog>
  );
}

export default TasksFilterDialog;
