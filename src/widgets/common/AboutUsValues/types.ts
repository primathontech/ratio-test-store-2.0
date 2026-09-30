import { WidgetProps } from "@/widgets/types";

/**
 * A single value item: icon image, heading, and body text
 */
export interface AboutUsValuesItem {
  /** Path to the icon image (SVG) */
  iconSrc: string;
  /** Alt text for the icon (auto-filled by editor image picker). Falls back to iconAlt. */
  alt?: string;
  /** Legacy alt text — kept for backward compat. Prefer `alt`. */
  iconAlt?: string;
  /** Natural width of the icon */
  iconWidth: number;
  /** Natural height of the icon */
  iconHeight: number;
  /** Heading text */
  heading: string;
  /** Body/description text */
  body: string;
}

/**
 * AboutUsValues widget settings
 */
export interface AboutUsValuesSettings {
  /** Widget variant */
  variant?: string;
  /** Value items to display */
  items?: AboutUsValuesItem[];
  /** Heading text color */
  headingColor?: string;
  /** Body text color */
  bodyColor?: string;
}

/**
 * AboutUsValues widget data (static section, no API data needed)
 */
export interface AboutUsValuesData {
  // Static content section -- no dynamic data
}

/**
 * Props for the AboutUsValues component
 */
export type AboutUsValuesProps = WidgetProps<
  AboutUsValuesData,
  AboutUsValuesSettings
>;
