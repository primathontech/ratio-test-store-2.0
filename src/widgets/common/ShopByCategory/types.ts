import { WidgetProps } from "../../types";
import { VariantType } from "./variants";

/**
 * Shop by category item interface
 */
export interface IShopByCategoryItem {
  /** Unique identifier */
  id: number;

  /** Category name */
  name: string;

  /** Category image URL */
  image: string;

  /** Link destination URL */
  href: string;

  /** Alt text for accessibility */
  alt?: string;

  /** Link target (optional, defaults to _self) */
  target?: "_self" | "_blank" | "_parent" | "_top";

  /** Background color */
  backgroundColor?: string;

  mobileBackgroundColor?: string;

  mobileBorderColor?: string;
}

/**
 * Shop by category settings
 */
export interface Settings {
  /** Widget variant */
  variant: VariantType;

  /** Section title */
  title?: string;

  /** Array of category items */
  categories: IShopByCategoryItem[];

  /** Show category names (default: true) */
  showNames?: boolean;

  /** Category image aspect ratio. Format: 'width/height' or number. Example: '1/1', '4/3', 1.5 */
  imageAspectRatio?: string | number;

  /** Border radius for category images */
  imageBorderRadius?: number;

  /** Gap between category items in pixels */
  gap?: number;

  /** Additional CSS classes */
  className?: string;

  /** Inline styles */
  style?: React.CSSProperties;
}

/**
 * Shop by category data - content from data sources
 */
export interface Data {
  /** Categories data from API or static source */
  categories?: IShopByCategoryItem[];
}

export type Props = WidgetProps<Data, Settings>;
