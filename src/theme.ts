"use client";

import { createTheme } from "@mantine/core";

export const theme = createTheme({
  /* Put your mantine theme override here */
  primaryColor: "teal",
  activeClassName:
    "bg-background-light dark:bg-background-dark font-display text-text-light dark:text-text-dark",
  fontFamily: "Geist Sans, sans-serif",
  // forceColorScheme: "dark",
  headings: { fontFamily: "Geist Mono, monospace" },
});
