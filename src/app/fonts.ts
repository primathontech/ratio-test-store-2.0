import { Figtree, Inter, Open_Sans } from "next/font/google";
import localFont from "next/font/local";

// =============================================================================
// GOOGLE FONTS
// =============================================================================

export const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const openSans = Open_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-opensans",
});

export const figtree = Figtree({
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-figtree",
});

// =============================================================================
// LOCAL FONTS
// =============================================================================

export const gotham = localFont({
  src: [
    {
      path: "../../public/dawn/fonts/Gotham-Light.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../public/dawn/fonts/Gotham-Book.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/dawn/fonts/Gotham-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/dawn/fonts/Gotham-Medium-Extra-Bold.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../public/dawn/fonts/Gotham-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  display: "swap",
  variable: "--font-gotham",
});

export const avenir = localFont({
  src: [
    {
      path: "../../public/dawn/fonts/avenir-regular.woff2",
      weight: "400",
      style: "normal",
    },
  ],
  display: "swap",
  variable: "--font-avenir",
});
