import { WidgetProps } from "../../types";

/**
 * Header widget settings - strongly typed based on widget registry
 * Only includes settings defined in the widget registry schema
 */
export interface HeaderSettings {
  /**
   * Widget variant
   * @default 'v1'
   */
  variant?: string;

  /**
   * Fixed header position
   * @default false
   */
  isFixed?: boolean;

  /**
   * Header height in pixels
   * @default 70
   */
  height?: number;

  /**
   * Logo width in pixels
   * @default 140
   */
  logoWidth?: number;

  /**
   * Show cart icon in header
   * @default true
   */
  showCartIcon?: boolean;

  /**
   * Show language switcher
   * @default false
   */
  showLanguageSwitcher?: boolean;

  // Global Configuration For Header
  textColor?: string;
  backgroundColor?: string;

  /**
   * Navigation translations
   */
  navigation?: any;

  /**
   * Search translations
   */
  search?: any;

  /**
   * User actions translations
   */
  userActions?: any;

  /**
   * Cart translations
   */
  cart?: any;

  /**
   * Mobile menu translations
   */
  mobileMenu?: any;

  /**
   * Accessibility translations
   */
  accessibility?: any;

  /**
   * Tooltips translations
   */
  tooltips?: any;

  /**
   * Connect With Us translations
   */
  connectWithUs?: any;

  /**
   * Get App translations
   */
  getApp?: any;
}

/**
 * Header widget data - content that comes from data sources
 */
export interface HeaderData {
  [key: string]: any;
}

export type HeaderProps = WidgetProps<HeaderData, HeaderSettings>;
