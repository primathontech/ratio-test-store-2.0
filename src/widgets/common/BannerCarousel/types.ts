import { WidgetProps } from "@/widgets/types";
import { VariantType } from "./variants";

export enum MediaContentType {
  IMAGE = "IMAGE",
  VIDEO = "VIDEO",
}

/**
 * Banner carousel item interface.
 *
 * Field requirements (what merchants MUST fill in the editor):
 *
 *   id                Required.  Unique React key + indicator mapping.
 *   href              Recommended.  Where the slide navigates on click.
 *
 *   Image slide       Required:  at least one of `desktopImage` / `mobileImage`.
 *                                 If only one is set the widget uses it at both
 *                                 breakpoints.
 *
 *   Video slide       Required:  at least one of `desktopVideo` / `mobileVideo`.
 *                     Strongly   `posterSrc` — used as
 *                     recommended:    (a) the still thumbnail in the media
 *                                         indicator pill (otherwise the
 *                                         indicator falls back to an inline
 *                                         <video> which is heavier), and
 *                                     (b) the `poster=` attribute on the
 *                                         <video> while it buffers.
 *
 *   indicatorHeading  Required when `indicatorType: "media"` (default) — used
 *   indicatorSubHeading             as the text inside the active indicator
 *                                   pill. Ignored when `indicatorType: "simple"`.
 *
 *   alt               Recommended for accessibility on image slides.
 *
 *   type              Optional — kept for backward compat. The widget infers
 *                     slide kind from which media URL is filled.
 */
export interface IBannerCarouselItem {
  /** Unique identifier */
  id: number;

  /**
   * Optional explicit content type ("IMAGE" / "VIDEO").
   * When omitted, the widget infers the slide kind from which media URL is
   * filled: any `desktopVideo` / `mobileVideo` present → video, else image.
   * The editor exposes this as a text input inside the slides objectArray;
   * merchants don't need to fill it as long as they upload via the
   * correct Browse Library picker (image: for image slides, video: for video).
   */
  type?: MediaContentType;

  /** Desktop image URL. Editor: image picker. */
  desktopImage?: string;
  /** Mobile image URL. Editor: image picker. */
  mobileImage?: string;
  /** Desktop video URL. Editor: video picker. */
  desktopVideo?: string;
  /** Mobile video URL. Editor: video picker. */
  mobileVideo?: string;

  /** Legacy combined desktop URL (image or video). Used as fallback when the typed field is empty. */
  desktopSrc?: string;
  /** Legacy combined mobile URL (image or video). Used as fallback when the typed field is empty. */
  mobileSrc?: string;

  /**
   * Poster image URL for video slides — strongly recommended.
   * Used as the still thumbnail in the carousel's media-indicator pill and
   * as the `<video poster="…">` while the video buffers. Without it, the
   * indicator falls back to rendering an inline <video> for the preview.
   */
  posterSrc?: string;

  /** Indicator heading text */
  indicatorHeading: string;

  /** Indicator sub-heading text */
  indicatorSubHeading: string;

  /** Link destination URL */
  href: string;

  /** Alt text for accessibility (optional) */
  alt?: string;

  /** Link target (optional, defaults to _self) */
  target?: "_self" | "_blank" | "_parent" | "_top";
}

/**
 * Banner carousel settings
 */
export interface Settings {
  /** Widget variant */
  variant: VariantType;

  /** Array of banner carousel items */
  bannerCarousel: IBannerCarouselItem[];

  /** Auto-play interval in milliseconds (default: 5000) */
  autoplayInterval?: number;

  /** Enable auto-play (default: true) */
  autoplay?: boolean;

  /** Enable loop (default: true) */
  loop?: boolean;

  /** Pause on hover (default: true) */
  pauseOnHover?: boolean;

  /** Enable drag/swipe (default: true) */
  draggable?: boolean;

  /** Show indicators (default: true) */
  showIndicators?: boolean;

  /** Indicator type - 'media' shows image/video previews, 'simple' shows dots/bars (default: 'media') */
  indicatorType?: "media" | "simple";

  /** Additional CSS classes */
  className?: string;

  /** Inline styles */
  style?: React.CSSProperties;

  /** Aspect ratio for mobile devices. Format: 'width/height' or number. Example: '16/9', '4/3', 1.5 */
  mobileAspectRatio?: string | number;

  /** Aspect ratio for desktop devices. Format: 'width/height' or number. Example: '16/9', '4/3', 1.5 */
  desktopAspectRatio?: string | number;
}

/**
 * Collection banners structure from API
 */
interface CollectionBannerItem {
  id: string;
  type: string;
  handle: string;
  status: string;
  fields: {
    desktop_image?: {
      value: string[];
      data_type: string;
    };
    mobile_image?: {
      value: string[];
      data_type: string;
    };
    redirection_link?: {
      value: string[];
      data_type: string;
    };
    redirect_in_new_tab?: {
      value: boolean;
      data_type: string;
    };
  };
}

/**
 * Collection metadata structure for banners
 */
interface CollectionMetadata {
  collection_banners?: {
    value: CollectionBannerItem[];
    data_type: string;
  };
  mobile_banner?: {
    value: string[];
    data_type: string;
  };
  collection_banner_image?: {
    value: string[];
    data_type: string;
  };
  collection_redirection?: {
    value: string;
    data_type: string;
  };
}

/**
 * Banner carousel data - content from data sources
 */
export interface Data {
  /** Collection data from API */
  data?: {
    data?: {
      collectionByHandle?: {
        metadata?: CollectionMetadata;
      };
    };
  };
}

export type Props = WidgetProps<Data, Settings>;
