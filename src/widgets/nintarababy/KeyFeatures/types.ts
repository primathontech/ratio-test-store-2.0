import { WidgetProps } from "@/widgets/types";

/**
 * KeyFeatures widget settings
 */
export interface KeyFeaturesSettings {
  /** Widget variant @default "v1" */
  variant?: string;
  /** Section heading text (supports t: keys) */
  heading?: string;
  /** Array of feature items (supports t: keys) */
  features?: FeatureItem[];
}

/**
 * A single feature item (icon + label)
 */
export interface FeatureItem {
  /** Display label */
  label?: string;
  /** Image path */
  image: string;
  /** Alt text for the icon */
  alt?: string;
}

/**
 * KeyFeatures widget data
 */
export interface KeyFeaturesData {
  /** Section heading text */
  heading?: string;
  /** Array of feature items */
  features?: FeatureItem[];
}

/**
 * Props for the KeyFeatures component
 */
export type KeyFeaturesProps = WidgetProps<
  KeyFeaturesData,
  KeyFeaturesSettings
>;

/**
 * Design tokens extracted from nintarababy.in KeyFeatures section
 * Source: https://nintarababy.in/products/ergopod-feeding-pillow-lucky-clover
 * Section selector: #shopify-section-template--24784210329906__feature_columns_QCWGpj
 * Rendered height: 244px | topOffset: 942px
 */
export const DESIGN_TOKENS = {
  colors: {
    heading: "#092a33",
    label: "#092a33",
    background: "transparent",
  },
  typography: {
    fontFamily: "Figtree, sans-serif",
    heading: {
      fontSize: "32px",
      fontWeight: "700",
      lineHeight: "34px",
    },
    label: {
      fontSize: "20px",
      fontSizeMobile: "14px",
      fontWeight: "400",
      lineHeight: "22px",
    },
  },
  spacing: {
    sectionPaddingDesktop: "30px 0 0 0",
    sectionPaddingTablet: "24px 0",
    sectionPaddingMobile: "24px 0",
    headingMarginBottom: "30px",
    gridMaxWidth: "1200px",
    columnPadding: "1px 6px",
    labelPaddingTop: "16px",
    labelMaxWidth: "200px",
    iconWidth: "64px",
    iconHeight: "63px",
    mobileIconWidth: "30px",
    mobileGridGap: "10px",
    mobileGridColumns: "30px auto",
  },
  grid: {
    columns: 4,
    columnsMobile: 2,
    columnsTablet: 2,
  },
  animation: {
    reveal: {
      duration: "0.6s",
      easing: "cubic-bezier(0, 0, 0.3, 1)",
      translateY: "2rem",
      opacityFrom: "0.01",
    },
    observerRootMargin: "0px 0px -50px 0px",
  },
} as const;

/**
 * Icon paths for downloaded SVG assets
 */
export const ICON_PATHS = {
  featureVector: "/nintarababy/KeyFeatures/icons/key-feature-vector.svg",
} as const;

/**
 * Image paths for downloaded assets
 */
export const IMAGE_PATHS = {
  backgroundDesktop: "/nintarababy/KeyFeatures/images/key-features-bg.webp",
} as const;

/**
 * Default heading text matching the source
 */
export const DEFAULT_HEADING = "The Little Details That Matter";

/**
 * Default feature items matching the source product page
 */
export const DEFAULT_FEATURES: FeatureItem[] = [
  { alt: "Ergonomic Design", image: "pdp-key-fe-1" },
  { alt: "Built-in Lumbar Support", image: "pdp-key-fe-2" },
  { alt: "Removable & Washable Cover", image: "pdp-key-fe-3" },
  { alt: "Waterproof Top Layer", image: "pdp-key-fe-4" },
];
