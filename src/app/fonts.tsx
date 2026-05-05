/**
 * Font configuration for the app.
 *
 * Imported by `layout.tsx` and applied to <html> via the `.variable` class.
 * Centralized here so individual components never need to set `font-family` —
 * Tailwind's `font-body` (in `tailwind.config.ts`) is wired to `--font-gotham`,
 * which is set on `<html>` from this file's exports.
 *
 * Path notes for `next/font/local`:
 *   `path` is resolved relative to THIS file (`src/app/fonts.tsx`).
 *   `../../public/...` walks up to the project root, then into `public/`.
 */

import { Inter, Open_Sans } from "next/font/google";
import localFont from "next/font/local";

/**
 * Inter — primary Google sans-serif. Exposed as `--font-inter`.
 */
export const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

/**
 * Open Sans — secondary Google sans-serif. Exposed as `--font-opensans`.
 */
export const openSans = Open_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-opensans",
});

/**
 * Gotham — primary brand body font, loaded as a local font with all weights.
 * Exposed as `--font-gotham` and wired to Tailwind's `font-body` so we don't
 * need to set `font-family` per-element.
 */
export const gotham = localFont({
  src: [
    {
      path: "../../public/bblunt-2/fonts/Gotham-Light.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../public/bblunt-2/fonts/Gotham-Book.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/bblunt-2/fonts/Gotham-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/bblunt-2/fonts/Gotham-Medium-Extra-Bold.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../public/bblunt-2/fonts/Gotham-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-gotham",
  display: "swap",
  fallback: ["system-ui", "sans-serif"],
  adjustFontFallback: "Arial",
});

/**
 * Combined CSS variable class string to spread onto `<html className=...>`.
 * Adding new fonts? Add them above and append the variable here.
 */
export const fontVariables = `${inter.variable} ${openSans.variable} ${gotham.variable}`;
