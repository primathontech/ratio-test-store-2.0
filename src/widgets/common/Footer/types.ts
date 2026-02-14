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
  // Define the data structure your widget receives from dataSources
}

/**
 * Props for the Footer component
 */
export type FooterProps = WidgetProps<FooterData, FooterSettings>;
