import { WidgetProps } from "@/widgets/types";

/**
 * CategoryTabBar widget settings
 */
export interface CategoryTabBarSettings {
  /** Widget variant @default "v1" */
  variant?: string;
  /** The active collection handle — used to highlight the current pill */
  activeHandle?: string;
  /** Array of category pill items */
  categories?: CategoryPillItem[];
}

/**
 * Single category pill item
 */
export interface CategoryPillItem {
  /** Display label (e.g. "Sleep", "Bedding") */
  label: string;
  /** URL path to the collection (e.g. "/collections/baby-sleep-products") */
  href: string;
}

/**
 * CategoryTabBar widget data
 */
export interface CategoryTabBarData {
  /** Array of category pill items */
  categories?: CategoryPillItem[];
}

/**
 * Props for the CategoryTabBar component
 */
export type CategoryTabBarProps = WidgetProps<
  CategoryTabBarData,
  CategoryTabBarSettings
>;

/**
 * Design tokens extracted from nintarababy.in collection page
 *
 * Section: horizontal pill strip for collection category navigation.
 * Desktop: centered row of 6 pills within 1170px container, gap 10px.
 * Mobile: left-aligned, horizontal scroll, hidden scrollbar, 14px font.
 * Pills: border 1px solid #01464f, 4px radius, 5px 20px padding, 42px min-height.
 * Active: border 2px solid #C49330 (gold), black text.
 * No hover effect defined in source — transition: 0.25s exists but no hover rule.
 */
export const DESIGN_TOKENS = {
  colors: {
    pillBorder: "#01464f",
    pillText: "#01464f",
    pillBackground: "transparent",
    pillActiveBorder: "#c49330",
    pillActiveText: "#000000",
    pillActiveBackground: "transparent",
  },
  typography: {
    fontFamily: "Figtree",
    pill: {
      desktop: { fontSize: "16px", fontWeight: "500", lineHeight: "normal" },
      mobile: { fontSize: "14px", fontWeight: "500" },
    },
  },
  spacing: {
    pillPaddingDesktop: "5px 20px",
    pillGap: "10px",
    pillMinHeight: "42px",
    pillBorderRadius: "4px",
    wrapperMarginDesktop: "20px 0 30px",
    wrapperMarginMobile: "0 0 20px",
    scrollPaddingBottomMobile: "5px",
  },
  borders: {
    pillDefault: "1px solid #01464f",
    pillActive: "2px solid #c49330",
  },
  transitions: {
    pill: "0.25s",
  },
} as const;

/**
 * Default categories from the source site (nintarababy.in)
 */
export const DEFAULT_CATEGORIES: CategoryPillItem[] = [
  { label: "Sleep", href: "/collections/baby-sleep-products" },
  { label: "Bedding", href: "/collections/baby-bedding-sets" },
  { label: "Feeding", href: "/collections/baby-feeding-products" },
  { label: "Bath", href: "/collections/baby-bath-products" },
  { label: "Accessories", href: "/collections/baby-accessories" },
  { label: "Gifting", href: "/collections/best-baby-gifts" },
];
