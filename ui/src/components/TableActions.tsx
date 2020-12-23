import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";

const useStyles = makeStyles((theme) => ({
  actionsContainer: {
    display: "flex",
    padding: "4px",
  },
  moreIcon: {
    marginRight: "8px",
  },
  iconGroup: {
    paddingLeft: theme.spacing(1),
    borderLeft: `1px solid ${theme.palette.grey[100]}`,
  },
}));

interface MenuItemAction {
  label: string;
  onClick: () => void;
  disabled: boolean;
}

interface IconButtonAction {
  icon: React.ReactElement;
  tooltip: string;
  onClick: () => void;
  disabled: boolean;
}

interface Props {
  menuItemActions: MenuItemAction[];
  iconButtonActions: IconButtonAction[];
  showIconButtons: boolean;
}

export default function TableActions(props: Props) {
  const classes = useStyles();
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setMenuAnchor(event.currentTarget);
  };

  const closeMenu = () => setMenuAnchor(null);

  return (
    <div className={classes.actionsContainer}>
      <Tooltip title="More Actions">
        <IconButton
          aria-label="actions"
          className={classes.moreIcon}
          onClick={handleMenuClick}
        >
          <MoreHorizIcon />
        </IconButton>
      </Tooltip>
      <Menu
        id="action-menu"
        keepMounted
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={closeMenu}
      >
        {props.menuItemActions.map((action) => (
          <MenuItem
            key={action.label}
            onClick={() => {
              action.onClick();
              closeMenu();
            }}
            disabled={action.disabled}
          >
            {action.label}
          </MenuItem>
        ))}
      </Menu>
      {props.showIconButtons && (
        <div className={classes.iconGroup}>
          {props.iconButtonActions.map((action) => (
            <Tooltip key={action.tooltip} title={action.tooltip}>
              <IconButton onClick={action.onClick} disabled={action.disabled}>
                {action.icon}
              </IconButton>
            </Tooltip>
          ))}
        </div>
      )}
    </div>
  );
}
