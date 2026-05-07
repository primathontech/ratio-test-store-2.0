import { WidgetProps } from "@/widgets/types";

/**
 * A single announcement item in the marquee
 */
export interface AnnouncementItem {
  text: string;
  href: string;
}

/**
 * AnnouncementBar widget settings
 */
export interface AnnouncementBarSettings {
  /**
   * Widget variant
   * @default 'v1'
   */
  variant?: string;

  /**
   * List of announcement items to display in the marquee
   */
  items: AnnouncementItem[];

  /**
   * Background color of the bar
   * @default '#000000'
   */
  backgroundColor?: string;

  /**
   * Text color of the announcements
   * @default '#ffffff'
   */
  textColor?: string;

  /**
   * Marquee scroll speed in pixels per frame
   * @default 0.5
   */
  speed?: number;

  /**
   * Whether to pause the marquee on hover
   * @default true
   */
  pauseOnHover?: boolean;
}

/**
 * AnnouncementBar widget data
 */
export interface AnnouncementBarData {
  // No dynamic data needed — content comes from settings/translations
}

/**
 * Props for the AnnouncementBar component
 */
export type AnnouncementBarProps = WidgetProps<
  AnnouncementBarData,
  AnnouncementBarSettings
>;
