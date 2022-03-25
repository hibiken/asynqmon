import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { GroupInfo } from "../api";
import { isDarkTheme } from "../theme";

const useStyles = makeStyles((theme) => ({
  groupSelectOption: {
    display: "flex",
    justifyContent: "space-between",
    width: "100%",
  },
  groupSize: {
    fontSize: "12px",
    color: theme.palette.text.secondary,
    background: isDarkTheme(theme)
      ? "#303030"
      : theme.palette.background.default,
    textAlign: "center",
    padding: "3px 6px",
    borderRadius: "10px",
    marginRight: "2px",
  },
}));

interface Props {
  groups: GroupInfo[];
  error: string;
}

export default function GroupSelect(props: Props) {
  const classes = useStyles();
  return (
    <Autocomplete
      id="task-group-selector"
      options={props.groups}
      getOptionLabel={(option: GroupInfo) => option.group}
      style={{ width: 300 }}
      renderOption={(option: GroupInfo) => (
        <div className={classes.groupSelectOption}>
          <span>{option.group}</span>
          <span className={classes.groupSize}>{option.size}</span>
        </div>
      )}
      renderInput={(params) => (
        <TextField {...params} label="Select group" variant="outlined" />
      )}
    />
  );
}
