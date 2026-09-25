import { WidgetProps } from "@/widgets/types";

/**
 * CollectionHeader widget settings
 */
export interface CollectionHeaderSettings {
  /** Widget variant @default "v1" */
  variant?: string;
  /** H1 collection heading */
  heading?: string;
  /** Subtitle paragraph below the heading */
  subtitle?: string;
}

/**
 * Breadcrumb item shape
 */
export interface BreadcrumbItem {
  /** Display text */
  text: string;
  /** Link URL (if navigable) */
  href?: string;
  /** Whether this is the current page */
  current?: boolean;
}

/**
 * CollectionHeader widget data
 */
export interface CollectionHeaderData {
  /** H1 collection heading */
  heading?: string;
  /** Subtitle paragraph below the heading */
  subtitle?: string;
  /** Breadcrumb trail items */
  breadcrumbs?: BreadcrumbItem[];
}

/**
 * Props for the CollectionHeader component
 */
export type CollectionHeaderProps = WidgetProps<
  CollectionHeaderData,
  CollectionHeaderSettings
>;

/**
 * Design tokens extracted from nintarababy.in collection header
 *
 * Section: white background with 54% overlay pseudo-element.
 * Breadcrumb: 14px Figtree, #092a33, chevron SVG 9x9px separator.
 * H1: 37px/600 desktop, 18px/600 mobile, centered, #092a33.
 * Subtitle: 14px/400, centered, #092a33.
 * Container: 1200px max-width, 15px horizontal padding.
 * Section padding: 20px top/bottom desktop, 15px mobile.
 */
export const DESIGN_TOKENS = {
  colors: {
    primary: "#092a33",
    breadcrumbMuted: "#aaaaaa",
    background: "#ffffff",
    overlayOpacity: 0.54,
  },
  typography: {
    fontFamily: "Figtree",
    h1: {
      desktop: { fontSize: "37px", fontWeight: "600", lineHeight: "51.8px" },
      mobile: { fontSize: "18px", fontWeight: "600", lineHeight: "25.2px" },
    },
    subtitle: { fontSize: "14px", fontWeight: "400", lineHeight: "23.8px" },
    breadcrumb: { fontSize: "14px", fontWeight: "400", lineHeight: "23.8px" },
  },
  spacing: {
    sectionPaddingDesktop: "20px",
    sectionPaddingMobile: "15px",
    containerMaxWidth: "1200px",
    containerPaddingX: "15px",
    breadcrumbMarginBottom: "20px",
    breadcrumbItemMargin: "3px",
    svgMarginLeft: "3px",
  },
  svg: {
    arrowViewBox: "0 0 100 100",
    arrowPath: "M 10,50 L 60,100 L 70,90 L 30,50 L 70,10 L 60,0 Z",
    arrowTransform: "translate(100, 100) rotate(180)",
    arrowSize: "9px",
  },
} as const;

/**
 * Default content from the source site
 */
export const DEFAULT_CONTENT: {
  heading: string;
  subtitle: string;
  breadcrumbs: BreadcrumbItem[];
} = {
  heading: "Shop All",
  subtitle: "Our collection, trusted by parents.",
  breadcrumbs: [
    { text: "Home", href: "/" },
    { text: "Shop All", current: true },
  ],
};
