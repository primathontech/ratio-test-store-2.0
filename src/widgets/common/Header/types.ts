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
  /** Navigation items */
  navigation?: NavItem[];
  /** Search placeholder text */
  searchPlaceholder?: string;
  /** Cart link href */
  cartHref?: string;
  /** Account link href */
  accountHref?: string;
  /** Header background color (hex). Defaults to #ffffff — when white, applies a frosted-glass blur. */
  backgroundColor?: string;
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
