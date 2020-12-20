import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Tooltip from "@material-ui/core/Tooltip";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import DeleteIcon from "@material-ui/icons/Delete";
import ArchiveIcon from "@material-ui/icons/Archive";
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

interface Props {
  allActionPending: boolean;
  onRunAllClick: () => void;
  onDeleteAllClick: () => void;
  onKillAllClick?: () => void;
  showBatchActions: boolean;
  batchActionPending: boolean;
  onBatchRunClick: () => void;
  onBatchDeleteClick: () => void;
  onBatchKillClick?: () => void;
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
        <MenuItem
          onClick={() => {
            props.onRunAllClick();
            closeMenu();
          }}
          disabled={props.allActionPending}
        >
          Run All
        </MenuItem>
        {props.onKillAllClick && (
          <MenuItem
            onClick={() => {
              if (!props.onKillAllClick) return;
              props.onKillAllClick();
              closeMenu();
            }}
            disabled={props.allActionPending}
          >
            Kill All
          </MenuItem>
        )}
        <MenuItem
          onClick={() => {
            props.onDeleteAllClick();
            closeMenu();
          }}
          disabled={props.allActionPending}
        >
          Delete All
        </MenuItem>
      </Menu>
      {props.showBatchActions && (
        <div className={classes.iconGroup}>
          {props.onBatchKillClick && (
            <Tooltip title="Kill">
              <IconButton
                disabled={props.batchActionPending}
                onClick={() => {
                  if (!props.onBatchKillClick) return;
                  props.onBatchKillClick();
                }}
              >
                <ArchiveIcon />
              </IconButton>
            </Tooltip>
          )}
          <Tooltip title="Delete">
            <IconButton
              disabled={props.batchActionPending}
              onClick={props.onBatchDeleteClick}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Run">
            <IconButton
              disabled={props.batchActionPending}
              onClick={props.onBatchRunClick}
            >
              <PlayArrowIcon />
            </IconButton>
          </Tooltip>
        </div>
      )}
    </div>
  );
}
