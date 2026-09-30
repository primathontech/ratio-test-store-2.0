import { WidgetProps } from "@/widgets/types";

/**
 * CollectionHeading widget settings
 */
export interface CollectionHeadingSettings {
  /** Widget variant */
  variant?: string;
  /** Collection title text (e.g. "Shampoo") */
  title?: string;
  /** Whether to show the bottom divider line */
  showDivider?: boolean;
  /** Divider color (default: rgb(217,217,217)) */
  dividerColor?: string;
}

/**
 * CollectionHeading widget data (static section -- no API data needed)
 */
export interface CollectionHeadingData {
  // Static heading section -- no dynamic data
}

/**
 * Props for the CollectionHeading component
 */
export type CollectionHeadingProps = WidgetProps<
  CollectionHeadingData,
  CollectionHeadingSettings
>;
