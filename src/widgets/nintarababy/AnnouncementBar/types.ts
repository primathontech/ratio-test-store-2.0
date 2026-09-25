import { WidgetProps } from "@/widgets/types";

/**
 * A single announcement message
 */
export interface AnnouncementMessage {
  id: string;
  text: string;
  href?: string;
}

/**
 * AnnouncementBar widget settings
 */
export interface AnnouncementBarSettings {
  variant?: string;
  autoPlayInterval?: number;
  pauseOnHover?: boolean;
  transitionDuration?: number;
  messages?: AnnouncementMessage[];
}

/**
 * AnnouncementBar widget data
 */
export interface AnnouncementBarData {
  messages?: AnnouncementMessage[];
}

/**
 * Props for the AnnouncementBar component
 */
export type AnnouncementBarProps = WidgetProps<
  AnnouncementBarData,
  AnnouncementBarSettings
>;

/**
 * Design tokens extracted from nintarababy.in announcement bar
 */
export const DESIGN_TOKENS = {
  colors: {
    background: "#c6d4f6",
    text: "#092a33",
  },
  typography: {
    fontFamily: "Figtree, sans-serif",
    fontSize: "14px",
    fontWeight: {
      normal: "400",
      bold: "600",
    },
    lineHeight: "23.8px",
  },
  spacing: {
    paddingY: "5px",
    paddingX: "10px",
    containerPaddingX: "15px",
    messageGap: "4px",
  },
  dimensions: {
    minHeight: "21px",
    totalHeight: "34px",
  },
  animation: {
    autoPlayInterval: 4500,
    transitionDuration: 600,
    transitionEasing: "cubic-bezier(0.16, 1, 0.3, 1)",
  },
} as const;

export const DEFAULT_MESSAGES: AnnouncementMessage[] = [
  {
    id: "b_announcement_qrkVxH",
    text: "Get 10% off on your first order!",
  },
];
