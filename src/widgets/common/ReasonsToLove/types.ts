import { WidgetProps } from "@/widgets/types";
import type { ApiProduct } from "@/widgets/common/ProductDetail/types";

/**
 * ReasonsToLove widget settings
 */
export interface ReasonsToLoveSettings {
  /** Widget variant */
  variant?: string;

  /** Section heading text */
  heading?: string;

  /** Main image source */
  imageSrc?: string;

  /** Image alt text */
  imageAlt?: string;

  /** Image natural width (for next/image) */
  imageWidth?: number;

  /** Image natural height (for next/image) */
  imageHeight?: number;
}

/**
 * ReasonsToLove widget data — IResponse from DATA_SOURCE_TYPES.PRODUCT
 */
export interface ReasonsToLoveData {
  success?: boolean;
  data?: ApiProduct | null;
}

/**
 * Props for the ReasonsToLove component
 */
export type ReasonsToLoveProps = WidgetProps<
  ReasonsToLoveData,
  ReasonsToLoveSettings
>;
