import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Grow from "@material-ui/core/Grow";
import Paper from "@material-ui/core/Paper";
import Popper from "@material-ui/core/Popper";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";
import { isDarkTheme } from "../theme";

interface Option {
  label: string;
  key: string;
}

interface Props {
  options: Option[];
  initialSelectedKey: string;
  onSelect: (key: string) => void;
}

const useStyles = makeStyles((theme) => ({
  popper: {
    zIndex: 2,
  },
  buttonContained: {
    backgroundColor: isDarkTheme(theme)
      ? "#303030"
      : theme.palette.background.default,
    color: theme.palette.text.primary,
    "&:hover": {
      backgroundColor: theme.palette.action.hover,
    },
  },
}));

export default function SplitButton(props: Props) {
  const classes = useStyles();
  const [open, setOpen] = React.useState<boolean>(false);
  const anchorRef = React.useRef<HTMLDivElement>(null);
  const [selectedKey, setSelectedKey] = React.useState<string>(
    props.initialSelectedKey
  );

  const handleMenuItemClick = (
    event: React.MouseEvent<HTMLLIElement, MouseEvent>,
    key: string
  ) => {
    setSelectedKey(key);
    setOpen(false);
    props.onSelect(key);
  };

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event: React.MouseEvent<Document, MouseEvent>) => {
    if (
      anchorRef.current &&
      anchorRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }
    setOpen(false);
  };

  const selectedOpt = props.options.find((opt) => opt.key === selectedKey);

  return (
    <>
      <ButtonGroup
        variant="contained"
        ref={anchorRef}
        aria-label="split button"
        size="small"
        disableElevation
      >
        <Button classes={{ contained: classes.buttonContained }}>
          {selectedOpt ? selectedOpt.label : "Select Option"}
        </Button>
        <Button
          size="small"
          aria-controls={open ? "split-button-menu" : undefined}
          aria-expanded={open ? "true" : undefined}
          aria-label="select option"
          aria-haspopup="menu"
          onClick={handleToggle}
          classes={{ contained: classes.buttonContained }}
        >
          <ArrowDropDownIcon />
        </Button>
      </ButtonGroup>
      <Popper
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        className={classes.popper}
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === "bottom" ? "center top" : "center bottom",
            }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList id="split-button-menu">
                  {props.options.map((opt) => (
                    <MenuItem
                      key={opt.key}
                      selected={opt.key === selectedKey}
                      onClick={(event) => handleMenuItemClick(event, opt.key)}
                    >
                      {opt.label}
                    </MenuItem>
                  ))}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </>
  );
}
