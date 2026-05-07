import { WidgetProps } from "@/widgets/types";
import { VariantType } from "./variants";

export enum MediaContentType {
  IMAGE = "IMAGE",
  VIDEO = "VIDEO",
}

/**
 * Banner carousel item interface
 */
export interface IBannerCarouselItem {
  /** Unique identifier */
  id: number;

  /** Content type - IMAGE or VIDEO */
  type: MediaContentType;

  /** Mobile image/video URL */
  mobileSrc: string;

  /** Desktop image/video URL */
  desktopSrc: string;

  /** Poster image URL for videos (optional) */
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
