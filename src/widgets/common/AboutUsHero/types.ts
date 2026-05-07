import { WidgetProps } from "@/widgets/types";

/**
 * AboutUsHero widget settings
 */
export interface AboutUsHeroSettings {
  /** Widget variant */
  variant?: string;
  /** Banner image URL */
  imageSrc?: string;
  /** Banner image alt text */
  imageAlt?: string;
  /** Link destination */
  href?: string;
  /** Natural image width for next/image */
  imageWidth?: number;
  /** Natural image height for next/image */
  imageHeight?: number;
}

/**
 * AboutUsHero widget data (static section, no API data needed)
 */
export interface AboutUsHeroData {
  // Static content section -- no dynamic data
}

/**
 * Props for the AboutUsHero component
 */
export type AboutUsHeroProps = WidgetProps<
  AboutUsHeroData,
  AboutUsHeroSettings
>;
