import { WidgetProps } from "@/widgets/types";

/**
 * CollectionHeroBanner widget settings
 */
export interface CollectionHeroBannerSettings {
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
  /** Desktop image natural width */
  desktopWidth?: number;
  /** Desktop image natural height */
  desktopHeight?: number;
  /** Mobile image natural width */
  mobileWidth?: number;
  /** Mobile image natural height */
  mobileHeight?: number;
}

/**
 * CollectionHeroBanner widget data (static section -- no API data needed)
 */
export interface CollectionHeroBannerData {
  // Static image banner -- no dynamic data
}

/**
 * Props for the CollectionHeroBanner component
 */
export type CollectionHeroBannerProps = WidgetProps<
  CollectionHeroBannerData,
  CollectionHeroBannerSettings
>;
