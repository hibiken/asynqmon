import { createMuiTheme, Theme } from "@material-ui/core/styles";
import { themeKind } from "./reducers/settingsReducer";
import useMediaQuery from "@material-ui/core/useMediaQuery";

export function makeTheme(themePreference: themeKind): Theme {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  let prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  if (themePreference === "ALWAYS") {
    prefersDarkMode = true;
  } else if (themePreference === "NEVER") {
    prefersDarkMode = false;
  }
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
      type: prefersDarkMode ? "dark" : "light",
    },
  });
}
