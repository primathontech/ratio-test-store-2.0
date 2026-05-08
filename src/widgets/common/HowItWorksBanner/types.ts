import { WidgetProps } from "@/widgets/types";

/**
 * HowItWorksBanner widget settings
 */
export interface HowItWorksBannerSettings {
  /** Widget variant */
  variant?: string;
  /** Desktop banner image path (shown at >=768px) */
  desktopImage?: string;
  /** Mobile banner image path (shown at <768px) */
  mobileImage?: string;
  /** Alt text for the banner images */
  alt?: string;
  /** Mobile aspect ratio (e.g. "1500/1167") — controls image height on mobile */
  mobileAspectRatio?: string;
  /** Desktop aspect ratio (e.g. "5692/692") — controls image height on desktop */
  desktopAspectRatio?: string;
}

/**
 * HowItWorksBanner widget data (static image section -- no API data needed)
 */
export interface HowItWorksBannerData {
  // Pure image-based banner -- no dynamic data
}

/**
 * Props for the HowItWorksBanner component
 */
export type HowItWorksBannerProps = WidgetProps<
  HowItWorksBannerData,
  HowItWorksBannerSettings
>;
