import { WidgetProps } from "@/widgets/types";

/**
 * A single slide in the hero banner carousel
 */
export interface HeroBannerSlide {
  /** Slide type: image or video */
  type: "image" | "video";
  /** Link URL for the entire slide */
  href?: string;
  /** Desktop image path (>=768px) */
  desktopImage?: string;
  /** Mobile image path (<768px) */
  mobileImage?: string;
  /** Alt text for the slide */
  alt?: string;
  /** Desktop video source URL (for video slides) */
  desktopVideoSrc?: string;
  /** Mobile video source URL (for video slides) */
  mobileVideoSrc?: string;
  /** Desktop video poster image */
  desktopPoster?: string;
  /** Mobile video poster image */
  mobilePoster?: string;
  /** Indicator heading text (shown in media indicators) */
  indicatorHeading?: string;
  /** Indicator sub-heading text (shown in media indicators) */
  indicatorSubHeading?: string;
}

/**
 * HeroBannerCarousel widget settings
 */
export interface HeroBannerCarouselSettings {
  /** Widget variant */
  variant?: string;
  /** Array of slides to display */
  slides?: HeroBannerSlide[];
  /** Auto-play interval in ms (0 = disabled) */
  autoPlayInterval?: number;
  /** Whether to loop the carousel */
  loop?: boolean;
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
 * HeroBannerCarousel widget data (static -- no API data needed)
 */
export interface HeroBannerCarouselData {
  // Static carousel -- no dynamic data
}

/**
 * Props for the HeroBannerCarousel component
 */
export type HeroBannerCarouselProps = WidgetProps<
  HeroBannerCarouselData,
  HeroBannerCarouselSettings
>;
