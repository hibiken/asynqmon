import { createMuiTheme, Theme } from "@material-ui/core/styles";

export function makeTheme(isDarkTheme: boolean): Theme {
  return createMuiTheme({
    // Got color palette from https://htmlcolors.com/palette/31/stripe
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
      type: isDarkTheme ? "dark" : "light",
    },
  });
}
