import { WidgetProps } from "@/widgets/types";

/**
 * ProductTabs widget settings
 */
export interface ProductTabsSettings {
  /** Widget variant @default "v1" */
  variant?: string;
  /** Product detail entries (supports t: keys) */
  details?: DetailEntry[];
  /** Description intro paragraph (supports t: keys) */
  descriptionIntro?: string;
  /** Description list items (supports t: keys) */
  descriptionItems?: DescriptionListItem[];
  /** Description image URL (supports t: keys) */
  descriptionImageUrl?: string;
  /** Description image alt text (supports t: keys) */
  descriptionImageAlt?: string;
  /** Delivery & Returns paragraphs (supports t: keys) */
  deliveryReturns?: string[];
}

/**
 * A single detail entry (label + value)
 */
export interface DetailEntry {
  /** Bold label, e.g. "Material:" */
  label: string;
  /** Value text, e.g. "100% cotton, removable foam insert" */
  value: string;
}

/**
 * A description list item (bold prefix + body)
 */
export interface DescriptionListItem {
  /** Bold feature name */
  title: string;
  /** Body text */
  body: string;
}

/**
 * ProductTabs widget data
 */
export interface ProductTabsData {
  /** Product detail entries (Material, Care, Manufacturer, etc.) */
  details?: DetailEntry[];
  /** Description intro paragraph */
  descriptionIntro?: string;
  /** Description list items (feature bullet points) */
  descriptionItems?: DescriptionListItem[];
  /** Description image URL */
  descriptionImageUrl?: string;
  /** Description image alt text */
  descriptionImageAlt?: string;
  /** Delivery & Returns paragraphs */
  deliveryReturns?: string[];
}

/**
 * Props for the ProductTabs component
 */
export type ProductTabsProps = WidgetProps<
  ProductTabsData,
  ProductTabsSettings
>;

/**
 * Tab identifiers
 */
export type TabId =
  | "description-tab"
  | "manufacturing-details"
  | "caution-storage";

/**
 * Tab definition
 */
export interface TabDefinition {
  id: TabId;
  label: string;
}

/**
 * Design tokens extracted from nintarababy.in ProductTabs section
 * Source: https://nintarababy.in/products/ergopod-feeding-pillow-lucky-clover
 * Section: #shopify-section-template--24784210329906__pdp_tab_desc_bCFk8b
 * Rendered height: 489px | topOffset: 1208px
 */
export const DESIGN_TOKENS = {
  colors: {
    accent: "#C49330",
    textPrimary: "#092a33",
    textSecondary: "#2D4B48",
    tabInactive: "rgba(9, 42, 51, 0.40)",
    background: "#ffffff",
    accordionBorder: "#EBE6E6",
  },
  typography: {
    fontFamily: "Figtree, sans-serif",
    tab: {
      fontSize: "24px",
      fontWeight: "700",
      lineHeight: "26.4px",
    },
    label: {
      fontSize: "20px",
      fontWeight: "600",
      lineHeight: "17.6px",
    },
    body: {
      fontSize: "16px",
      fontWeight: "300",
      lineHeight: "24px",
    },
    accordion: {
      fontSize: "16px",
      fontWeight: "500",
    },
  },
  spacing: {
    sectionPadding: "40px",
    sectionMargin: "22px 80px 50px 80px",
    tabPadding: "0 20px 10px",
    tabListMarginBottom: "20px",
    tabContentPadding: "20px",
    tabContentsMaxWidth: "90%",
    accordionPadding: "16px 0",
    accordionPanelPadding: "0 18px",
    sectionPaddingMobile: "24px",
  },
  borders: {
    section: "1.5px solid #C49330",
    sectionRadius: "24px",
    activeTab: "2px solid #C49330",
    accordionSeparator: "1px solid #EBE6E6",
  },
  breakpoints: {
    desktop: "1025px",
    mobile: "1024px",
  },
} as const;

/**
 * Default tab definitions
 */
export const DEFAULT_TABS: TabDefinition[] = [
  { id: "description-tab", label: "Description" },
  { id: "manufacturing-details", label: "Manufacturing Details" },
  { id: "caution-storage", label: "Caution & Storage" },
];

/**
 * Default product detail entries
 */
export const DEFAULT_DETAILS: DetailEntry[] = [
  {
    label: "Material:",
    value: "100% cotton, removable foam insert",
  },
  {
    label: "Care:",
    value:
      "Machine wash cold, gentle cycle with like colours. Do not bleach. Tumble dry low. Do not dry clean.",
  },
  {
    label: "Manufacturer:",
    value: "Grasper Global Private Limited",
  },
  {
    label: "Address:",
    value:
      "222A, Poddar Chambers, 109 SA Brelvi Rd, Fort, Kalaghoda Mumbai, Colaba, Mumbai City (Fort-Colaba) Zone 1, Maharashtra, 400001",
  },
  {
    label: "Country of Origin:",
    value: "India",
  },
  {
    label: "Note:",
    value:
      "Due to variations in screen settings, lighting conditions, and device resolution, the fabric color in the image may slightly differ from the actual product.",
  },
];

/**
 * Default description intro
 */
export const DEFAULT_DESCRIPTION_INTRO =
  "The Ergopod Feeding Pillow- Lucky Clover is designed to make every feed calmer, closer, and more comfortable for you and your baby.";

/**
 * Default description list items
 */
export const DEFAULT_DESCRIPTION_ITEMS: DescriptionListItem[] = [
  {
    title: "Ergonomic Wrap-Around Design:",
    body: "Ergopod Feeding Pillow- Lucky Clover wraps fully around your waist to provide a secure fit. The curved front supports your baby's torso while the wings hug your sides, so you don't need to hunch or keep repositioning.",
  },
  {
    title: "Built-In Lumbar Support:",
    body: "A structured lumbar panel sits at the lower back to encourage neutral spine alignment. You'll feel gentle, even pressure that discourages slouching during long feeds or cluster feeding.",
  },
  {
    title: "Adjustable Velcro Strap for a Custom Fit:",
    body: "The wide velcro strap of the Ergopod Feeding Pillow- Lucky Clover lets you adjust the size to you in seconds, even one-handed.",
  },
  {
    title: "Waterproof Lining:",
    body: "The waterproof upper lining blocks spills from soaking into the fabric, stopping stains and damp patches from setting in. It also helps curb odour build-up, keeping the cover feeling fresher for longer between washes.",
  },
];

/**
 * Default description image
 */
export const DEFAULT_DESCRIPTION_IMAGE = {
  url: "/nintarababy/ProductTabs/images/description-product.webp",
  alt: "Product Image",
};

/**
 * Default delivery & returns text
 */
export const DEFAULT_DELIVERY_RETURNS: string[] = [
  "Once we receive your order, it can take between 2-5 business days to arrive, based on your location.",
  "10 day returns as long as the product is in original packaging.",
];
