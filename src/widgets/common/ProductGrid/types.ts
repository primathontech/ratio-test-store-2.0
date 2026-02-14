import { WidgetProps } from "../../types";

/**
 * ProductGrid widget settings - strongly typed based on widget registry
 * Only includes settings defined in the widget registry schema
 */
export interface ProductGridSettings {
  /**
   * Widget variant
   * @default 'v1'
   */
  variant?: string;

  /**
   * Widget heading
   * @default 'Bestseller'
   */
  heading: string;

  /**
   * Show action button on product cards
   * @default true
   */
  showActionButton?: boolean;

  /**
   * Text for the action button
   * @default 'Add to cart'
   */
  actionButtonText?: string;

  /**
   * Text for the Mobile action button
   * @default 'Add to cart'
   */
  actionButtonTextMobile?: string;

  /**
   * Text for the action button
   * @default 'Add to cart'
   */
  actionButtonTextColor?: string;

  /**
   * Text for the action button
   * @default 'Sold out'
   */
  soldOutText?: string;

  /**
   * Text for the Mobile Sold Out button
   * @default 'Sold out'
   */
  soldOutTextMobile?: string;

  /**
   * Show badge on product cards
   * @default true
   */
  showBadge?: boolean;

  /**
   * Show rating on product cards
   * @default true
   */
  showRating?: boolean;

  /**
   * Number of slides to show at once
   * @default 4
   */
  slidesToShow?: number;

  /**
   * Number of slides to scroll at once
   * @default 1
   */
  slidesToScroll?: number;

  /**
   * Enable autoplay for carousel
   * @default false
   */
  autoplay?: boolean;

  /**
   * Autoplay interval in milliseconds
   * @default 3000
   */
  autoplayInterval?: number;

  /**
   * Show navigation arrows
   * @default true
   */
  showArrows?: boolean;

  /**
   * Show navigation dots
   * @default false
   */
  showDots?: boolean;

  /**
   * Enable infinite scrolling
   * @default true
   */
  infinite?: boolean;

  /**
   * Navigation icon style
   * @default 'arrow'
   */
  iconStyle?: "arrow" | "chevron" | "caret" | "circle";

  /**
   * Custom class name for the carousel
   */
  className?: string;

  /**
   * Custom class name for the carousel container
   */
  containerClassName?: string;

  /**
   * Custom class name for each slide
   */
  slideClassName?: string;

  /**
   * Responsive breakpoint settings
   */
  responsive?: Array<{
    breakpoint: number;
    settings: { slidesToShow?: number; slidesToScroll?: number };
  }>;

  /**
   * Navigation position
   * @default 'outside'
   */
  navigationPosition?: "inside" | "outside";

  /**
   * Custom left navigation icon
   */
  customLeftIcon?: React.ReactNode;

  /**
   * Custom right navigation icon
   */
  customRightIcon?: React.ReactNode;

  /**
   * Show navigation icons only on hover
   * @default false
   */
  showNavigationIconOnHover?: boolean;

  /**
   * Navigation button variant
   * @default 'outline'
   */
  navigationButtonVariant?: "outline" | "solid" | "ghost" | "primary";

  // View All button
  /**
   * view all button text
   * @default 'View all'
   */
  viewAllButtonText?: string;

  /**
   * view all button redirection
   * @default '/collections/bestseller'
   */
  redirectionLink?: string;

  // Collection Tabs (V2 only)
  /**
   * Array of collections for tabbed navigation
   * If only one collection is provided, tabs won't be shown
   */
  collections?: CollectionTab[];

  // Styling Options
  /**
   * Background color or gradient for the whole section
   * Can be a solid color (e.g., '#ffffff') or gradient (e.g., 'linear-gradient(45deg, #ff6b6b, #4ecdc4)')
   * @default 'white'
   */
  sectionBackgroundColor?: string;

  /**
   * Background color for product cards
   * @default 'white'
   */
  productCardBackgroundColor?: string;

  /**
   * Background image URL for the whole section Desktop
   * If provided, will be used as background image for the section
   * Optional field - if not provided, no background image will be shown
   */
  sectionBackgroundDesktopImage?: string;

  /**
   * Background image URL for the whole section Mobile
   * If provided, will be used as background image for the section
   * Optional field - if not provided, no background image will be shown
   */
  sectionBackgroundMobileImage?: string;

  /**
   * Text color for the entire section
   * If provided, will be applied as the text color for this section
   * Optional field - if not provided, default text color will be used
   */
  sectionTextColor?: string;
}

export interface CollectionTab {
  label: string;
  handle: string;
}

/**
 * Product data expected by the ProductGrid widget
 */
export interface ProductResponse {
  id: string;
  title: string;
  handle: string;
  status: string;
  tags: any;
  productType: string;
  price: number;
  compare_at_price: number | null;
  image_url: string;
  images: ProductImage[];
  product_availability: boolean;
  availableForSale: boolean;
  variant: ProductVariant;
  average_rating: string;
  rating_count: string;
  metadata: any;
}

export interface ProductImage {
  url: string;
  is_main: boolean;
  alt: string | null;
}

export interface ProductVariant {
  id: string;
  title: string;
  price: number;
  compare_at_price: number;
  sku: string;
  barcode: string;
  inventory_quantity: number;
  requires_shipping: boolean;
  weight: string;
  weight_unit: string;
  hs_code: string;
  cost_per_item: number;
  metadata: Record<string, any>;
  continue_selling_out_of_stock: boolean;
  availableForSale: boolean;
  availableQuantity: number;
}

export type ProductGridProps = WidgetProps<any, ProductGridSettings>;
