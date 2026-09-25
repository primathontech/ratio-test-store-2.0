import { WidgetProps } from "@/widgets/types";

/**
 * BottomBar widget settings
 */
export interface BottomBarSettings {
  /** Widget variant @default "v1" */
  variant?: string;
  /** Copyright text */
  copyrightText?: string;
}

/**
 * BottomBar widget data
 */
export interface BottomBarData {
  /** Copyright text override */
  copyrightText?: string;
}

/**
 * Props for the BottomBar component
 */
export type BottomBarProps = WidgetProps<BottomBarData, BottomBarSettings>;

/**
 * Design tokens extracted from nintarababy.in bottom bar
 */
export const DESIGN_TOKENS = {
  colors: {
    background: "#f5ead3",
    text: "#092a33",
  },
  typography: {
    fontFamily: "Figtree, sans-serif",
    fontSize: "14px",
    fontWeight: "400",
    lineHeight: "19.6px",
  },
  spacing: {
    desktop: {
      paddingTop: "5px",
      paddingBottom: "40px",
    },
    mobile: {
      paddingTop: "28px",
      paddingBottom: "5px",
      marginBottom: "50px",
    },
  },
  layout: {
    containerMaxWidth: "1200px",
    containerPaddingX: "15px",
    textAlign: "center" as const,
  },
} as const;

/**
 * Default copyright text matching the source site
 */
export const DEFAULT_COPYRIGHT_TEXT = "\u00A9 The Momsco. All rights reserved.";
