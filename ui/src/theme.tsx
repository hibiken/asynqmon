import { createMuiTheme } from "@material-ui/core/styles";

// Got color palette from https://htmlcolors.com/palette/31/stripe
const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#4379FF",
    },
    secondary: {
      main: "#97FBD1",
    },
    background: {
      default: "#f5f7f9",
    },
  },
});

export default theme;
