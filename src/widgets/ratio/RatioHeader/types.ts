import { WidgetProps } from "@/widgets/types";

/**
 * A single navigation link inside a dropdown menu
 */
export interface NavDropdownItem {
  label: string;
  href: string;
  /** When true, render as an external link (opens a new tab). Maps from the
   *  useNav leaf/column `isExternal` flag. */
  isExternal?: boolean;
}

/**
 * A group of dropdown items (e.g., "Product Type", "Shop By Concern")
 */
export interface NavDropdownGroup {
  heading?: string;
  items: NavDropdownItem[];
}

/**
 * Top-level navigation item
 */
export interface NavItem {
  label: string;
  href: string;
  /** When true, the top-level trigger/link is external (opens a new tab). Maps
   *  from the useNav entry `isExternal` flag (kind "external", or a
   *  dropdown/mega trigger with `isExternal`). */
  isExternal?: boolean;
  dropdown?: NavDropdownGroup[];
}

/**
 * Header widget settings
 */
export interface HeaderSettings {
  /** Widget variant */
  variant?: string;
  /** Logo image — `{ src, alt }` shape for editor image picker */
  logoSrc?: { src: string; alt: string } | string;
  /** Logo alt text (legacy fallback — prefer logoSrc.alt) */
  logoAlt?: string;
  /** Search placeholder text */
  searchPlaceholder?: string;
  /** Rotating search input suggestions (typing animation) */
  searchSuggestions?: string[];
  /** Header background color (hex). */
  backgroundColor?: string;

  /* ── Flat navigation keys (editor-friendly — dropdowns are flat lists) ── */
  product_label?: string;
  product_href?: string;
  product_items?: NavDropdownItem[];

  hair_care_label?: string;
  hair_care_href?: string;
  hair_care_type_label?: string;
  hair_care_type_href?: string;
  hair_care_type_items?: NavDropdownItem[];
  hair_care_concern_label?: string;
  hair_care_concern_href?: string;
  hair_care_concern_items?: NavDropdownItem[];

  hair_colour_label?: string;
  hair_colour_href?: string;
  hair_colour_items?: NavDropdownItem[];

  hair_styling_label?: string;
  hair_styling_href?: string;
  hair_styling_items?: NavDropdownItem[];

  salon_label?: string;
  salon_href?: string;
  salon_items?: NavDropdownItem[];

  /** Mobile drawer "Get this App" banner — flat keys for editor compatibility */
  getApp_title?: string;
  getApp_description?: string;
  getApp_button_text?: string;
  getApp_logo_alt?: string;
  getApp_logo_url?: { src: string; alt: string } | string;
  getApp_app_url?: string;
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
  cartCount?: number;
}

/**
 * Props for the Header component
 */
export type HeaderProps = WidgetProps<HeaderData, HeaderSettings>;
