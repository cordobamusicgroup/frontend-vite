"use client";

import { createTheme } from "@mui/material/styles";

declare module "@mui/material/styles" {
  interface Palette {
    inverted: Palette["primary"];
  }
  interface PaletteOptions {
    inverted?: PaletteOptions["primary"];
  }
}

const theme = createTheme({
  palette: {
    primary: {
      main: "#09365F", // Color primario
    },
    secondary: {
      main: "#001B33", // Color secundario
    },
    inverted: {
      main: "#ffffff", // Blanco como fondo para el modo invertido
      contrastText: "#09365F", // Texto primario en el modo invertido
    },
  },
  typography: {
    fontFamily: "Roboto, Arial, sans-serif",
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
  },
});

const isMobile = () => {
  if (typeof window !== "undefined") {
    return window.innerWidth < theme.breakpoints.values.sm;
  }
  return false;
};

theme.typography.h1 = {
  fontSize: "2rem",
  "@media (min-width:600px)": {
    fontSize: "2.5rem",
  },
  [theme.breakpoints.up("md")]: {
    fontSize: "3rem",
  },
  fontWeight: 400,
};

theme.typography.h2 = {
  fontSize: "1.75rem",
  "@media (min-width:600px)": {
    fontSize: "2rem",
  },
  [theme.breakpoints.up("md")]: {
    fontSize: "2.5rem",
  },
  fontWeight: 500,
};

theme.typography.h3 = {
  fontSize: "1.5rem",
  "@media (min-width:600px)": {
    fontSize: "1.75rem",
  },
  [theme.breakpoints.up("md")]: {
    fontSize: "2rem",
  },
  fontWeight: 500,
};

theme.typography.h6 = {
  fontSize: "18px",
  fontWeight: 500,
};

export { isMobile };

export default theme;
