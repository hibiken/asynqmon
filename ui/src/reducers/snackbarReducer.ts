import {
  CLOSE_SNACKBAR,
  SnackbarActionTypes,
} from "../actions/snackbarActions";
import {
  DELETE_DEAD_TASK_SUCCESS,
  DELETE_RETRY_TASK_SUCCESS,
  DELETE_SCHEDULED_TASK_SUCCESS,
  TasksActionTypes,
} from "../actions/tasksActions";

interface SnackbarState {
  isOpen: boolean;
  message: string;
}

const initialState: SnackbarState = {
  isOpen: false,
  message: "",
};

function snackbarReducer(
  state = initialState,
  action: TasksActionTypes | SnackbarActionTypes
): SnackbarState {
  switch (action.type) {
    case CLOSE_SNACKBAR:
      return {
        // Note: We keep the message state unchanged for
        // smoother transition animation.
        ...state,
        isOpen: false,
      };

    case DELETE_SCHEDULED_TASK_SUCCESS:
      return {
        isOpen: true,
        // TODO: show only task id
        message: `Scheduled task ${action.taskKey} deleted`,
      };

    case DELETE_RETRY_TASK_SUCCESS:
      return {
        isOpen: true,
        // TODO: show only task id
        message: `Retry task ${action.taskKey} deleted`,
      };

    case DELETE_DEAD_TASK_SUCCESS:
      return {
        isOpen: true,
        // TODO: show only task id
        message: `Dead task ${action.taskKey} deleted`,
      };

    default:
      return state;
  }
}

export default snackbarReducer;
