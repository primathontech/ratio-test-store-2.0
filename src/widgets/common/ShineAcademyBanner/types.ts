import { WidgetProps } from "@/widgets/types";

/**
 * ShineAcademyBanner widget settings
 */
export interface ShineAcademyBannerSettings {
  /** Widget variant */
  variant?: string;
  /** Logo image — `{ src, alt }` shape for editor image picker */
  logoSrc?: { src: string; alt: string } | string;
  /** Logo alt text (legacy fallback — prefer logoSrc.alt) */
  logoAlt?: string;
  /** Tagline text displayed below the logo */
  tagline?: string;
  /** Mosaic collage image path (fallback) */
  mosaicSrc?: { src: string; alt: string } | string;
  /** Mosaic collage image (mobile) — `{ src, alt }` shape */
  mosaicSrcMobile?: { src: string; alt: string } | string;
  /** Mosaic collage image (desktop) — `{ src, alt }` shape */
  mosaicSrcDesktop?: { src: string; alt: string } | string;
  /** Mosaic alt text (legacy fallback — prefer mosaicSrcDesktop.alt) */
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
