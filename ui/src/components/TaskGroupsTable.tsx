import React, { useCallback } from "react";
import { connect, ConnectedProps } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import { listGroupsAsync } from "../actions/groupsActions";
import GroupSelect from "./GroupSelect";
import { usePolling } from "../hooks";
import { AppState } from "../store";

const useStyles = makeStyles((theme) => ({
  groupSelector: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
}));

function mapStateToProps(state: AppState) {
  return {
    groups: state.groups.data,
    groupsError: state.groups.error,
    pollInterval: state.settings.pollInterval,
  };
}

const mapDispatchToProps = {
  listGroupsAsync,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

interface Props {
  queue: string;
}

function TaskGroupsTable(props: Props & ConnectedProps<typeof connector>) {
  const { pollInterval, listGroupsAsync, queue } = props;
  const classes = useStyles();

  const fetchGroups = useCallback(() => {
    listGroupsAsync(queue);
  }, [listGroupsAsync, queue]);

  usePolling(fetchGroups, pollInterval);

  return (
    <div>
      <div className={classes.groupSelector}>
        <GroupSelect groups={props.groups} error={props.groupsError} />
      </div>
    </div>
  );
}

export default connector(TaskGroupsTable);
