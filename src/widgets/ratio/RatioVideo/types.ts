import { WidgetProps } from "@/widgets/types";

/**
 * Inner product payload — only the fields RatioVideo cares about.
 */
export interface RatioVideoProductData {
  id?: string | number;
}

/**
 * Standard data-aggregator envelope that ratio.0 emits for
 * `dataSourceKey: "productData"`. Same shape as FBT.
 *
 * On home (no productData), the widget receives no data and falls
 * back to `productId = "homepage"` for the SDK call.
 */
export interface RatioVideoProductResponse {
  success?: boolean;
  message?: string;
  data?: RatioVideoProductData | null;
  error?: unknown;
  meta?: Record<string, unknown>;
}

export type RatioVideoData = RatioVideoProductData | RatioVideoProductResponse;

/** RatioVideo widget settings — passed straight through to the SDK config. */
export interface RatioVideoSettings {
  /** Widget variant */
  variant?: string;
  /** Section heading rendered by the SDK header. */
  title?: string;
  /** Layout the SDK should render. */
  layout?: "grid" | "carousel" | "slider" | "stories";
  /** Items per row in `grid` layout. */
  itemsPerRow?: number;
  /** Autoplay videos. */
  autoplay?: boolean;
  /** Start videos muted. */
  muteByDefault?: boolean;
  /** Show native video controls. */
  showVideoControls?: boolean;
  /** Render CTA button on each video card. */
  enableCtaButton?: boolean;
  /** Label for the CTA button when shown. */
  buttonText?: string;
  /** CTA button text color (hex). */
  ctaButtonTextColor?: string;
  /** CTA button background color (hex). */
  ctaButtonBackgroundColor?: string;
  /** Destination URL when SDK's "More info" or CTA click fires. */
  destinationUrl?: string;
}

/** Props for the RatioVideo component */
export type RatioVideoProps = WidgetProps<RatioVideoData, RatioVideoSettings>;
