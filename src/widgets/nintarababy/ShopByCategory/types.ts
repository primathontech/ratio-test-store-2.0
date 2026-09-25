import { WidgetProps } from "@/widgets/types";

/**
 * A single category card
 */
export interface CategoryCard {
  /** Display label for the category */
  label: string;
  /** Optional superscript text (e.g., "TM") appended after label */
  superscript?: string;
  /** Link href for the category */
  href: string;
  /** Image filename (relative to basePath) */
  image: string;
  /** Whether this card displays the "NEW" badge */
  hasNewBadge: boolean;
}

/**
 * ShopByCategory widget data
 */
export interface ShopByCategoryData {
  categories?: CategoryCard[];
}

/**
 * ShopByCategory widget settings
 */
export interface ShopByCategorySettings {
  /** Widget variant @default "v1" */
  variant?: string;
  /** Section heading */
  heading?: string;
  /** Section subtitle */
  subtitle?: string;
  /** Category cards (flat: label, image as full path, href, hasNewBadge) */
  categories?: Array<{
    label: string;
    image: string;
    href: string;
    hasNewBadge?: string;
    superscript?: string;
  }>;
}

/**
 * Props for the ShopByCategory component
 */
export type ShopByCategoryProps = WidgetProps<
  ShopByCategoryData,
  ShopByCategorySettings
>;

/**
 * Design tokens extracted from nintarababy.in Shop by Category section
 */
export const DESIGN_TOKENS = {
  colors: {
    primary: "#092a33",
    cardText: "#ffffff",
    badgeBg: "#C6D4F6",
    badgeText: "#092A33",
    overlayGradient:
      "linear-gradient(180deg, rgba(0, 0, 0, 0.25), rgba(0, 0, 0, 0.6))",
  },
  typography: {
    fontFamily: "Figtree, sans-serif",
    heading: {
      fontSize: "clamp(28px, 3vw, 40px)",
      fontWeight: "700",
    },
    subtitle: {
      fontSize: "clamp(16px, 3vw, 20px)",
      fontWeight: "400",
    },
    cardTitle: {
      fontSize: "clamp(16px, 3vw, 28px)",
      fontWeight: "700",
      lineHeight: "1.2",
      textShadow: "0 2px 10px rgba(0, 0, 0, 0.45)",
    },
  },
  spacing: {
    sectionPadding: "2%",
    gridGap: "34px",
    gridGapMobile: "12px",
    gridMaxWidth: "1135px",
    cardTitlePadding: "16px",
    subtitleMarginBottom: "5%",
  },
  borders: {
    cardRadius: "12px",
  },
  layout: {
    desktopColumns: 3,
    tabletColumns: 2,
    mobileColumns: 2,
    desktopBreakpoint: "1025px",
    mobileBreakpoint: "767px",
    desktopAspectRatio: "4 / 3",
    mobileAspectRatio: "1 / 1",
  },
  animations: {
    imageHoverScale: "1.1",
    imageHoverDuration: "0.6s",
    overlayHoverOpacity: "0.5",
    overlayHoverDuration: "0.4s",
  },
} as const;

/**
 * Image paths relative to /assets/nintarababy/shop-by-category/
 */
export const IMAGE_PATHS = {
  backgroundDesktop: "bg-desktop.webp",
  backgroundMobile: "bg-mobile.webp",
} as const;

/**
 * Default categories matching the source site
 */
export const DEFAULT_CATEGORIES: CategoryCard[] = [
  {
    label: "The Landing Mat",
    href: "/collections/baby-sleeping-mats-waterproof",
    image: "landing-mat.webp",
    hasNewBadge: true,
  },
  {
    label: "Wake Me Not Swaddles",
    superscript: "TM",
    href: "/collections/wake-me-not-swaddle-blankets",
    image: "wake-me-not-swaddles.webp",
    hasNewBadge: false,
  },
  {
    label: "Swaddles",
    href: "/collections/muslin-baby-swaddles-wraps",
    image: "swaddles.webp",
    hasNewBadge: false,
  },
  {
    label: "Hooded Towels",
    href: "/collections/baby-hooded-towels",
    image: "hooded-towels.webp",
    hasNewBadge: false,
  },
];
