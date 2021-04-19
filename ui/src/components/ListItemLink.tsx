import React, { ReactElement } from "react";
import clsx from "clsx";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Tooltip from "@material-ui/core/Tooltip";
import { makeStyles } from "@material-ui/core/styles";
import {
  useRouteMatch,
  Link as RouterLink,
  LinkProps as RouterLinkProps,
} from "react-router-dom";
import { isDarkTheme } from "../theme";

const useStyles = makeStyles((theme) => ({
  listItem: {
    borderTopRightRadius: "24px",
    borderBottomRightRadius: "24px",
  },
  selected: {
    backgroundColor: isDarkTheme(theme)
      ? `${theme.palette.secondary.main}30`
      : `${theme.palette.primary.main}30`,
  },
  selectedText: {
    fontWeight: 600,
    color: isDarkTheme(theme)
      ? theme.palette.secondary.main
      : theme.palette.primary.main,
  },
  selectedIcon: {
    color: isDarkTheme(theme)
      ? theme.palette.secondary.main
      : theme.palette.primary.main,
  },
}));

interface Props {
  to: string;
  primary: string;
  icon?: ReactElement;
}

// Note: See https://material-ui.com/guides/composition/ for details.
function ListItemLink(props: Props): ReactElement {
  const classes = useStyles();
  const { icon, primary, to } = props;
  const isMatch = useRouteMatch({
    path: to,
    strict: true,
    sensitive: true,
    exact: true,
  });
  const renderLink = React.useMemo(
    () =>
      React.forwardRef<any, Omit<RouterLinkProps, "to">>((itemProps, ref) => (
        <RouterLink to={to} ref={ref} {...itemProps} />
      )),
    [to]
  );
  return (
    <li>
      <Tooltip title={primary} placement="right">
        <ListItem
          button
          component={renderLink}
          className={clsx(classes.listItem, isMatch && classes.selected)}
        >
          {icon && (
            <ListItemIcon className={clsx(isMatch && classes.selectedIcon)}>
              {icon}
            </ListItemIcon>
          )}
          <ListItemText
            primary={primary}
            classes={{
              primary: isMatch ? classes.selectedText : undefined,
            }}
          />
        </ListItem>
      </Tooltip>
    </li>
  );
}

export default ListItemLink;
