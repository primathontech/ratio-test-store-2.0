import { WidgetProps } from "../../types";
import { VariantType } from "./variants";
import {
  TestimonialCardVariant,
  CardStyleConfig,
} from "./compounds/card-variants/types";

/**
 * Individual testimonial item
 */
export interface ITestimonial {
  /** Unique id (optional) */
  id?: string | number;

  /** Customer image URL */
  image: string;

  /** Customer name */
  name: string;

  /** Customer location (optional) */
  location?: string;

  /** Star rating (1-5) */
  stars: number;

  /** Review title/headline */
  title: string;

  /** Review description/content */
  description: string;

  /** Alt text for image accessibility */
  alt?: string;
}

/**
 * Position for indicators relative to the testimonials carousel.
 * Format: [vertical]-[horizontal]
 */
export type TIndicatorPosition =
  | "top-left"
  | "top-center"
  | "top-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";

/**
 * Settings for the Testimonials widget
 */
export interface Settings {
  variant: VariantType;

  /**
   * Layout width. 'container' uses parent/container width; 'full' stretches to 100vw.
   * You can also pass a CSS width string (eg. '1200px' or '100%').
   * Default: 'container'
   */
  width?: "container" | "full" | string;

  /** Testimonials to display (max length governed by maxTestimonials prop) */
  testimonials: ITestimonial[];

  /** Testimonial Card Background Color (legacy - use cardStyleConfig instead) */
  testimonialBackgroundColor?: string;

  /** Card variant to use for testimonials */
  cardVariant?: TestimonialCardVariant;

  /** Card style configuration */
  cardStyleConfig?: CardStyleConfig;

  /** Maximum allowed testimonials (default 10) */
  maxTestimonials?: number;

  /** Section heading (optional) */
  heading?: string;

  /** Section subheading (optional) */
  subheading?: string;

  /** Section heading (optional) */
  headingStyles: {
    fontSize: {
      desktop: string;
      mobile: string;
    };
    color: string;
  };
  subheadingStyles: {
    fontSize: {
      desktop: string;
      mobile: string;
    };
    color: string;
  };

  /** Interval between automatic slide changes in milliseconds. Default: 5000 (5s) */
  interval?: number;

  /** Whether autoplay is enabled. Default: true */
  autoplay?: boolean;

  /** Whether the carousel should loop when reaching the last slide. Default: true */
  loop?: boolean;

  /** Pause autoplay on mouse hover. Default: true */
  pauseOnHover?: boolean;

  /** Show left/right navigation arrows. Default: true */
  showArrows?: boolean;

  /** Arrow appearance & placement options */
  arrowShape?: "circle" | "square" | "rounded";
  arrowSize?: number;
  arrowLeftIcon?: string;
  arrowRightIcon?: string;
  arrowLeftHoverIcon?: string;
  arrowRightHoverIcon?: string;
  arrowOffsetX?: number | string;
  arrowOffsetY?: number | string;
  arrowBackgroundColor?: string;
  arrowActiveBackgroundColor?: string;
  arrowHoverBackgroundColor?: string;

  /** Show bottom indicators (dots). Default: true */
  showIndicators?: boolean;

  /** Position for the indicator. Default: 'bottom-center' */
  indicatorPosition?: TIndicatorPosition;

  /** Pixel offset for indicator when using above/below positions. Default: 10 */
  indicatorOffset?: number;

  /** Indicator customization */
  indicatorWidth?: number | string;
  indicatorActiveWidth?: number | string;
  indicatorHeight?: number | string;
  indicatorActiveColor?: string;
  indicatorInactiveColor?: string;
  indicatorActiveBorderColor?: string;
  indicatorInactiveBorderColor?: string;
  indicatorBorderWidth?: number | string;
  indicatorBorderRadius?: number | string;
  indicatorTransitionDuration?: number;
  isShowFocusRing?: boolean;
  gapBeetweenDots?: string;

  /** Whether touch swiping is enabled on mobile. Default: true */
  swipeable?: boolean;

  /** Number of slides to show per view on desktop. Default: 3 */
  slidesPerView?: number;

  /** Number of slides to show per view on mobile. Default: 1 */
  mobileSlidesPerView?: number;

  /** Spacing between slides in pixels. Default: 16 */
  spacing?: number;

  /** ARIA label for the carousel for accessibility */
  ariaLabel?: string;

  /** Additional className & style passthrough */
  className?: string;
  style?: React.CSSProperties;

  /** Pass-through props to the root container (div) */
  containerProps?: React.HTMLAttributes<HTMLDivElement>;

  /** Additional Background Image whole section */
  backgroundSrc?: string;
}

/**
 * Testimonials widget data - content that comes from data sources
 */
export interface Data {}

export type Props = WidgetProps<Data, Settings>;
