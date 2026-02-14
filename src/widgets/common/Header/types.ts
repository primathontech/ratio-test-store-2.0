import { WidgetProps } from "@/widgets/types";

/**
 * Header widget settings
 */
export interface HeaderSettings {
  /**
   * Widget variant
   * @default 'v1'
   */
  variant?: string;
}

/**
 * Header widget data
 */
export interface HeaderData {
  // Define the data structure your widget receives from dataSources
}

/**
 * Props for the Header component
 */
export type HeaderProps = WidgetProps<HeaderData, HeaderSettings>;
