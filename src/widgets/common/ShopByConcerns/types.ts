import { WidgetProps } from "../../types";

/**
 * Configuration options for the ShopByConcerns widget
 */
export interface ShopByConcernsItem {
  imageUrl: string;
  /** Unique id */
  id?: string | number;

  /** Image URL to use on desktop */
  desktopSrc: string;

  /** Image URL to use on mobile. Optional — if not present desktopSrc will be used */
  mobileSrc?: string;

  /** alt text for accessibility */
  alt?: string;

  /** Title text to display on the card */
  title: string;

  /**
   * Destination URL when the item is clicked
   */
  href: string;

  /** target for link navigation, e.g. '_self' or '_blank' (default: '_self') */
  target?: "_self" | "_blank" | "_parent" | "_top";
}

export interface ShopByConcernsSettings {
  /**
   * Widget variant
   * @default 'v1'
   */
  variant?: string;

  /**
   * Heading for the section (supports rich text formatting)
   */
  heading?: string;

  /**
   * Array of concern items to display
   */
  items: ShopByConcernsItem[];

  /**
   * Arrow icon SVG path
   */
  arrowIconSrc?: string;
}

export type ShopByConcernsProps = WidgetProps<any, ShopByConcernsSettings>;
