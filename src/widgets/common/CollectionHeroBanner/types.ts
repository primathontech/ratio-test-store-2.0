import { WidgetProps } from "@/widgets/types";
import type { IBannerCarouselItem } from "../BannerCarousel/types";

/**
 * Collection banner item shape from the v2 collection metadata
 */
export interface CollectionBannerItem {
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
 * Sale promo banner metaobject (collection metadata → `sale_promo_banner`).
 * Drives the SalePageBanner override on collection pages that opt in.
 */
export interface SalePromoBannerItem {
  id: string;
  type: string;
  handle: string;
  status: string;
  fields: {
    title?: { value: string; data_type: string };
    subtitle?: { value: string; data_type: string };
    desktop_image?: { value: string; data_type: string };
    image?: { value: string; data_type: string };
    discount_code?: { value: string; data_type: string };
    price_text?: { value: string; data_type: string };
    end_sale_date?: { value: string; data_type: string };
    expire_text?: { value: string | string[]; data_type: string };
  };
}

/**
 * Rich-text node shape used by the `how_to_shop` metadata field.
 */
export interface HowToShopRichTextNode {
  type: string;
  value?: string;
  bold?: boolean;
  listType?: string;
  children?: HowToShopRichTextNode[];
}

/**
 * Collection metadata fields the banner reads from
 */
export interface CollectionBannerMetadata {
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
  sale_promo_banner?: {
    value: SalePromoBannerItem[];
    data_type: string;
  };
  how_to_shop?: {
    value: HowToShopRichTextNode;
    data_type: string;
  };
}

/**
 * CollectionHeroBanner widget settings — proxy to BannerCarousel
 */
export interface CollectionHeroBannerSettings {
  variant?: string;

  /** Fallback banner items when API returns no banners */
  bannerCarousel?: IBannerCarouselItem[];

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

  /** Indicator type — `media` shows previews, `simple` shows dots/bars (default: simple) */
  indicatorType?: "media" | "simple";

  /** Additional CSS classes */
  className?: string;

  /** Inline styles */
  style?: React.CSSProperties;

  /** Aspect ratio for mobile (e.g. "1/1") */
  mobileAspectRatio?: string | number;

  /** Aspect ratio for desktop (e.g. "182/57") */
  desktopAspectRatio?: string | number;
}

/**
 * CollectionHeroBanner widget data — collection data from `collectionData` source
 */
export interface CollectionHeroBannerData {
  data?: {
    data?: {
      collectionByHandle?: {
        metadata?: CollectionBannerMetadata;
      };
    };
  };
}

/**
 * Props for the CollectionHeroBanner component
 */
export type CollectionHeroBannerProps = WidgetProps<
  CollectionHeroBannerData,
  CollectionHeroBannerSettings
>;
