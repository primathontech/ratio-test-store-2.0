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
  /** Desktop image natural width */
  desktopWidth?: number;
  /** Desktop image natural height */
  desktopHeight?: number;
  /** Mobile image natural width */
  mobileWidth?: number;
  /** Mobile image natural height */
  mobileHeight?: number;
  /** Container max-width in px (default 1300) */
  containerMaxWidth?: number;
  /** Top margin in px (default 56) */
  marginTop?: number;
  /** Bottom padding in px (default 22) */
  paddingBottom?: number;
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
