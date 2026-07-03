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
  /**
   * Nav-menu handle this footer renders, from `@shopkit/navigation`.
   * @default "footer"
   *
   * Same model as the header: the merchant manages the footer menu's content in
   * admin; this only selects which menu. Degrades gracefully when unavailable.
   */
  menuHandle?: string;
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
