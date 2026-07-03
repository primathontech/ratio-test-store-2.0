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
  /**
   * Nav-menu handle this header renders, from `@shopkit/navigation`.
   * @default "main-menu"
   *
   * The menu CONTENT (links, columns, mega panels) is managed by the merchant in
   * the admin panel — this setting only selects WHICH menu to show. When the menu
   * can't be fetched (no env/backend/handle), the header degrades gracefully.
   */
  menuHandle?: string;
  /**
   * Brand text shown at the left of the header. Replace with your logo when you
   * restyle this reference.
   * @default "Store"
   */
  brandName?: string;
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
