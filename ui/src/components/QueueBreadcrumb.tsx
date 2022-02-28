import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { emphasize, withStyles, Theme } from "@material-ui/core/styles";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Chip from "@material-ui/core/Chip";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { paths as getPaths, queueDetailsPath } from "../paths";
import { isDarkTheme } from "../theme";

const StyledBreadcrumb = withStyles((theme: Theme) => ({
  root: {
    backgroundColor: isDarkTheme(theme)
      ? "#303030"
      : theme.palette.background.default,
    height: theme.spacing(3),
    color: theme.palette.text.secondary,
    fontWeight: 400,
    "&:hover, &:focus": {
      backgroundColor: theme.palette.action.hover,
    },
    "&:active": {
      boxShadow: theme.shadows[1],
      backgroundColor: emphasize(theme.palette.action.hover, 0.12),
    },
  },
}))(Chip) as typeof Chip; // Note: need a type cast here because https://github.com/Microsoft/TypeScript/issues/26591

interface Props {
  // All queue names.
  queues: string[];
  // Name of the queue currently selected.
  queueName: string;
  // ID of the task currently selected (optional).
  taskId?: string;
}

export default function QueueBreadcrumbs(props: Props) {
  const history = useHistory();
  const [anchorEl, setAnchorEl] = useState<null | Element>(null);
  const paths = getPaths();

  const handleClick = (event: React.MouseEvent<Element, MouseEvent>) => {
    event.preventDefault();
    setAnchorEl(event.currentTarget);
  };

  const closeMenu = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Breadcrumbs aria-label="breadcrumb">
        <StyledBreadcrumb
          component={Link}
          to={paths.HOME}
          label="Queues"
          onClick={() => history.push(paths.HOME)}
        />
        <StyledBreadcrumb
          label={props.queueName}
          deleteIcon={<ExpandMoreIcon />}
          onClick={handleClick}
          onDelete={handleClick}
        />
        {props.taskId && <StyledBreadcrumb label={`task:${props.taskId}`} />}
      </Breadcrumbs>
      <Menu
        id="queue-breadcrumb-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={closeMenu}
      >
        {props.queues.sort().map((qname) => (
          <MenuItem
            key={qname}
            onClick={() => {
              history.push(queueDetailsPath(qname));
              closeMenu();
            }}
          >
            {qname}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
