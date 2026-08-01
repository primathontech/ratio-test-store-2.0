import { WidgetProps } from "@/widgets/types";

/**
 * VideoAndBrandValues widget settings
 */
export interface VideoAndBrandValuesSettings {
  /** Widget variant @default "v1" */
  variant?: string;
}

/**
 * A single brand value feature
 */
export interface BrandFeature {
  /** Unique ID */
  id: number;
  /** Feature label text */
  label: string;
}

/**
 * VideoAndBrandValues widget data
 */
export interface VideoAndBrandValuesData {
  /** Desktop heading text */
  heading?: string;
  /** Mobile heading text */
  mobileHeading?: string;
  /** Brand mission description paragraph */
  description?: string;
  /** Array of brand value features */
  features?: BrandFeature[];
  /** Video source URL */
  videoSrc?: string;
  /** Video poster image URL */
  videoPoster?: string;
}

/**
 * Combined props for the VideoAndBrandValues widget
 */
export type VideoAndBrandValuesProps = WidgetProps<
  VideoAndBrandValuesData,
  VideoAndBrandValuesSettings
>;

/**
 * Default heading text
 */
export const DEFAULT_HEADING = "What We Stand For";

/**
 * Default mobile heading text
 */
export const DEFAULT_MOBILE_HEADING = "Watch it in Action";

/**
 * Default description paragraph
 */
export const DEFAULT_DESCRIPTION =
  "At Nintara Baby, we are committed to develop innovative ways to make everyday products more functional and delightful. We design each product with babies and their caregivers front and center, and aim to make simple acts of parenting and caregiving easy and joyful.";

/**
 * Default brand value features
 */
export const DEFAULT_FEATURES: BrandFeature[] = [
  { id: 1, label: "Thoughtful Product Design" },
  { id: 2, label: "Uncompromising Quality & Safety" },
  { id: 3, label: "Effortless Simplicity" },
  { id: 4, label: "Sustainably Sourced Materials" },
  { id: 5, label: "Accessible Excellence" },
];

/**
 * Default video source
 */
export const DEFAULT_VIDEO_SRC =
  "https://cdn.shopify.com/videos/c/o/v/e0832e14a7384d5a831c86b0e313bb1b.mp4";

/**
 * Default video poster
 */
export const DEFAULT_VIDEO_POSTER =
  "https://nintarababy.in/cdn/shop/files/thumbnail_36812c62-0cce-4805-a3c2-8315538ed392.webp?v=6898403806378853594";

/**
 * Image paths for the widget (relative to /public)
 */
export const IMAGE_PATHS = {
  playButton: "/nintarababy/VideoAndBrandValues/images/play-button.png",
  bulletIcon: "/nintarababy/VideoAndBrandValues/images/bullet-icon.png",
};
