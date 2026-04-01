import { WidgetProps } from "@/widgets/types";

/**
 * Footer widget settings
 */
export interface FooterSettings {
  /**
   * Widget variant
   * @default 'v1'
   */
  variant?: string;
}

/**
 * Footer widget data
 */
export interface FooterData {
  // Static content — data is hardcoded in the V1 component
}

/**
 * Props for the Footer component
 */
export type FooterProps = WidgetProps<FooterData, FooterSettings>;
