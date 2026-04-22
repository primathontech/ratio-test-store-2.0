import { WidgetProps } from "@/widgets/types";

/**
 * ShineAcademyBanner widget settings
 */
export interface ShineAcademyBannerSettings {
  /** Widget variant */
  variant?: string;
  /** Logo image path */
  logoSrc?: string;
  /** Logo alt text */
  logoAlt?: string;
  /** Tagline text displayed below the logo */
  tagline?: string;
  /** Mosaic collage image path (fallback) */
  mosaicSrc?: string;
  /** Mosaic collage image path for mobile */
  mosaicSrcMobile?: string;
  /** Mosaic collage image path for desktop */
  mosaicSrcDesktop?: string;
  /** Mosaic alt text */
  mosaicAlt?: string;
  /** Section background color */
  backgroundColor?: string;
}

/**
 * ShineAcademyBanner widget data (static section, no API data needed)
 */
export interface ShineAcademyBannerData {
  // Static content section -- no dynamic data
}

/**
 * Props for the ShineAcademyBanner component
 */
export type ShineAcademyBannerProps = WidgetProps<
  ShineAcademyBannerData,
  ShineAcademyBannerSettings
>;
