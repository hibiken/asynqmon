import { makeStyles } from "@material-ui/core/styles";
import Alert from "@material-ui/lab/Alert";
import AlertTitle from "@material-ui/lab/AlertTitle";
import React, { useCallback, useState } from "react";
import { connect, ConnectedProps } from "react-redux";
import { listGroupsAsync } from "../actions/groupsActions";
import { GroupInfo } from "../api";
import { usePolling } from "../hooks";
import { AppState } from "../store";
import AggregatingTasksTable from "./AggregatingTasksTable";
import GroupSelect from "./GroupSelect";

const useStyles = makeStyles((theme) => ({
  groupSelector: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
  alert: {
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
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

function AggregatingTasksTableContainer(
  props: Props & ConnectedProps<typeof connector>
) {
  const [selectedGroup, setSelectedGroup] = useState<GroupInfo | null>(null);
  const { pollInterval, listGroupsAsync, queue } = props;
  const classes = useStyles();

  const fetchGroups = useCallback(() => {
    listGroupsAsync(queue);
  }, [listGroupsAsync, queue]);

  usePolling(fetchGroups, pollInterval);

  if (props.groupsError.length > 0) {
    return (
      <Alert severity="error" className={classes.alert}>
        <AlertTitle>Error</AlertTitle>
        {props.groupsError}
      </Alert>
    );
  }
  if (props.groups.length === 0) {
    return (
      <Alert severity="info" className={classes.alert}>
        <AlertTitle>Info</AlertTitle>
        No aggregating tasks at this time.
      </Alert>
    );
  }

  return (
    <div>
      <div className={classes.groupSelector}>
        <GroupSelect
          selected={selectedGroup}
          onSelect={setSelectedGroup}
          groups={props.groups}
          error={props.groupsError}
        />
      </div>
      {selectedGroup !== null ? (
        <AggregatingTasksTable
          queue={props.queue}
          totalTaskCount={selectedGroup.size}
          selectedGroup={selectedGroup.group}
        />
      ) : (
        <Alert severity="info" className={classes.alert}>
          <AlertTitle>Info</AlertTitle>
          <div>Please select group</div>
        </Alert>
      )}
    </div>
  );
}

export default connector(AggregatingTasksTableContainer);
