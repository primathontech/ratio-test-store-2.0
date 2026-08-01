import { WidgetProps } from "@/widgets/types";

/**
 * Breadcrumb widget settings
 */
export interface BreadcrumbSettings {
  /** Widget variant @default "v1" */
  variant?: string;
}

/**
 * A single breadcrumb item (link or current page)
 */
export interface BreadcrumbItem {
  /** Display label */
  label: string;
  /** URL to link to. If undefined, treated as current (non-linked) page */
  href?: string;
}

/**
 * Breadcrumb widget data
 */
export interface BreadcrumbData {
  /** Array of breadcrumb items. Last item is the current page. */
  items?: BreadcrumbItem[];
}

/**
 * Props for the Breadcrumb component
 */
export type BreadcrumbProps = WidgetProps<BreadcrumbData, BreadcrumbSettings>;

/**
 * Design tokens extracted from nintarababy.in breadcrumb section
 * Source: https://nintarababy.in/products/ergopod-feeding-pillow-lucky-clover
 * Section selector: #shopify-section-template--24784210329906__breadcrumb
 * Rendered height: 50px | topOffset: 175px
 */
export const DESIGN_TOKENS = {
  colors: {
    background: "#f5ead3",
    linkDefault: "#222222",
    linkHover: "#222222",
    currentPage: "#222222",
    currentPageOpacity: 0.6,
    svgSeparator: "#222222",
    bodyText: "#092a33",
  },
  typography: {
    fontFamily: "Figtree, sans-serif",
    fontSize: "12px",
    fontWeight: "400",
    lineHeight: "1",
    lineHeightWrapper: "18px",
    letterSpacing: "normal",
    hoverDecoration: "underline",
  },
  spacing: {
    wrapperPaddingDesktop: "16px 20px",
    wrapperPaddingBase: "16px 0px",
    colPaddingDesktop: "0px 90px",
    colPaddingMobile: "0px 32px",
    containerMaxWidth: "100%",
    containerWidth: "1400px",
    containerPaddingX: "15px",
    separatorMarginX: "5px",
    sectionHeight: "50px",
  },
  separator: {
    type: "svg-chevron",
    width: "10px",
    height: "16px",
    viewBox: "0 0 32 32",
    topOffset: "4px",
  },
  mobile: {
    navMaxWidth: "200px",
    truncateBreakpoint: "767px",
  },
} as const;

/**
 * SVG path for the chevron separator between breadcrumb crumbs
 */
export const CHEVRON_SVG_PATH =
  "M 12.96875 4.28125 L 11.53125 5.71875 L 21.8125 16 L 11.53125 26.28125 L 12.96875 27.71875 L 23.96875 16.71875 L 24.65625 16 L 23.96875 15.28125 Z";

/**
 * Default breadcrumb items matching the source product page
 */
export const DEFAULT_BREADCRUMB_ITEMS: BreadcrumbItem[] = [
  { label: "Home", href: "/" },
  { label: "Product" },
];
