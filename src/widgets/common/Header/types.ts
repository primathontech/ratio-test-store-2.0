import { WidgetProps } from "@/widgets/types";

/**
 * A single navigation link inside a dropdown menu
 */
export interface NavDropdownItem {
  label: string;
  href: string;
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
  dropdown?: NavDropdownGroup[];
}

/**
 * Header widget settings
 */
export interface HeaderSettings {
  /** Widget variant */
  variant?: string;
  /** Logo image URL */
  logoSrc?: string;
  /** Logo alt text */
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

  /** Mobile drawer "Get this App" banner */
  getApp?: {
    title?: string;
    description?: string;
    button_text?: string;
    logo_alt?: string;
    logo_url?: string;
    app_url?: string;
  };
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
