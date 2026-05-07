import { WidgetProps } from "@/widgets/types";

/**
 * A single concern tile in the carousel
 */
export interface ConcernTile {
  /** Label for accessibility / alt text */
  label: string;
  /** Link href (null if no link) */
  href: string | null;
  /** Image path relative to public/ */
  image: string;
}

/**
 * ShopByConcerns widget settings
 */
export interface ShopByConcernsSettings {
  /** Widget variant */
  variant?: string;
  /** Section heading (rich HTML — supports <strong>, <em>, etc.) */
  heading?: string;
  /** Array of concern tiles */
  tiles?: ConcernTile[];
}

/**
 * ShopByConcerns widget data (static — no API data needed)
 */
export interface ShopByConcernsData {
  // Static carousel — no dynamic data
}

/**
 * Props for the ShopByConcerns component
 */
export type ShopByConcernsProps = WidgetProps<
  ShopByConcernsData,
  ShopByConcernsSettings
>;
