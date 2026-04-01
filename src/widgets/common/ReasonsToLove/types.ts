import { WidgetProps } from "@/widgets/types";

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
 * ReasonsToLove widget data (static section, no API data needed)
 */
export interface ReasonsToLoveData {
  // Static content section — no dynamic data
}

/**
 * Props for the ReasonsToLove component
 */
export type ReasonsToLoveProps = WidgetProps<
  ReasonsToLoveData,
  ReasonsToLoveSettings
>;
