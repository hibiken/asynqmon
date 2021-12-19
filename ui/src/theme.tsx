import { createTheme, Theme } from "@material-ui/core/styles";
import { ThemePreference } from "./reducers/settingsReducer";
import useMediaQuery from "@material-ui/core/useMediaQuery";

export function useTheme(themePreference: ThemePreference): Theme {
  let prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  if (themePreference === ThemePreference.Always) {
    prefersDarkMode = true;
  } else if (themePreference === ThemePreference.Never) {
    prefersDarkMode = false;
  }
  return createTheme({
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

export function isDarkTheme(theme: Theme): boolean {
  return theme.palette.type === "dark";
}
