import { WidgetProps } from "@/widgets/types";

/**
 * A single category tile in the carousel
 */
export interface CategoryTile {
  /** Category label text (visible on mobile, hidden on desktop) */
  label: string;
  /** Link href to the collection page */
  href: string;
  /** Desktop image path (wider crop, used at >= 768px) */
  desktopImage: string;
  /** Mobile image path (taller crop, used at < 768px) */
  mobileImage: string;
}

/**
 * ShopByCategories widget settings
 */
export interface ShopByCategoriesSettings {
  /** Widget variant */
  variant?: string;
  /** Section heading (rich HTML — supports <strong>, <em>, etc.) */
  heading?: string;
  /** Array of category tiles */
  tiles?: CategoryTile[];
}

/**
 * ShopByCategories widget data (static — no API data needed)
 */
export interface ShopByCategoriesData {
  // Static carousel — no dynamic data
}

/**
 * Props for the ShopByCategories component
 */
export type ShopByCategoriesProps = WidgetProps<
  ShopByCategoriesData,
  ShopByCategoriesSettings
>;
