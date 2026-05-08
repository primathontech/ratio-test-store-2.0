import { WidgetProps } from "@/widgets/types";

/**
 * HeroBanner widget settings
 */
export interface HeroBannerSettings {
  /** Widget variant */
  variant?: string;
  /** Desktop banner image path (used at >=768px) */
  desktopImage?: string;
  /** Mobile banner image path (used at <768px) */
  mobileImage?: string;
  /** Alt text for the banner image */
  alt?: string;
  /** Optional link URL wrapping the entire banner */
  href?: string;
  /** Mobile aspect ratio (e.g. "1/1") — controls image height on mobile */
  mobileAspectRatio?: string;
  /** Desktop aspect ratio (e.g. "1440/529") — controls image height on desktop */
  desktopAspectRatio?: string;
}

/**
 * HeroBanner widget data (static image section -- no API data needed)
 */
export interface HeroBannerData {
  // Static image banner -- no dynamic data
}

/**
 * Props for the HeroBanner component
 */
export type HeroBannerProps = WidgetProps<HeroBannerData, HeroBannerSettings>;
