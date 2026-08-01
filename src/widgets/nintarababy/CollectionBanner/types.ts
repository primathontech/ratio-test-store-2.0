import { WidgetProps } from "@/widgets/types";

/**
 * CollectionBanner widget settings
 */
export interface CollectionBannerSettings {
  /** Widget variant @default "v1" */
  variant?: string;
  /** Desktop banner image URL */
  desktopImageUrl?: string;
  /** Mobile banner image URL */
  mobileImageUrl?: string;
  /** Alt text for the banner image */
  altText?: string;
}

/**
 * CollectionBanner widget data
 */
export interface CollectionBannerData {
  /** Desktop banner image URL */
  desktopImageUrl?: string;
  /** Mobile banner image URL */
  mobileImageUrl?: string;
  /** Alt text for the banner image */
  altText?: string;
}

/**
 * Props for the CollectionBanner component
 */
export type CollectionBannerProps = WidgetProps<
  CollectionBannerData,
  CollectionBannerSettings
>;

/**
 * Design tokens extracted from nintarababy.in collection banner
 *
 * Desktop: 1600x349px natural image, renders at full viewport width.
 * Mobile (<=767px): 450x300px image with CSS aspect-ratio: 3/2.
 * No overlays. Sleep/Feeding/Bath labels are painted into the image.
 * No hover, no animations, no interactions. Purely a static banner.
 */
export const DESIGN_TOKENS = {
  desktop: {
    naturalWidth: 1600,
    naturalHeight: 349,
    aspectRatio: "1600 / 349",
  },
  mobile: {
    naturalWidth: 450,
    naturalHeight: 300,
    aspectRatio: "3 / 2",
    breakpoint: "767px",
  },
} as const;

/**
 * Default image URLs from the source site
 */
export const DEFAULT_IMAGES = {
  desktop:
    "https://nintarababy.in/cdn/shop/files/Desktop-Collection_Page_1600x.webp?v=1763531349",
  mobile:
    "https://nintarababy.in/cdn/shop/files/Mobile_-_Collection_page_banner_1_450x.webp?v=1735904870",
} as const;
