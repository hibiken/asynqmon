import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import IconButton from "@material-ui/core/IconButton";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";

const useStyles = makeStyles({
  actionsContainer: {
    padding: "4px",
  },
  moreIcon: {
    marginRight: "8px",
  },
});

interface Props {
  allActionPending: boolean;
  onRunAllClick: () => void;
  onDeleteAllClick: () => void;
  showBatchActions: boolean;
  batchActionPending: boolean;
  onBatchRunClick: () => void;
  onBatchDeleteClick: () => void;
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
      <IconButton
        aria-label="actions"
        className={classes.moreIcon}
        onClick={handleMenuClick}
      >
        <MoreHorizIcon />
      </IconButton>
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
        <ButtonGroup
          variant="text"
          color="primary"
          aria-label="text primary button group"
        >
          <Button
            disabled={props.batchActionPending}
            onClick={props.onBatchRunClick}
          >
            Run
          </Button>
          <Button>Kill</Button>
          <Button
            disabled={props.batchActionPending}
            onClick={props.onBatchDeleteClick}
          >
            Delete
          </Button>
        </ButtonGroup>
      )}
    </div>
  );
}
