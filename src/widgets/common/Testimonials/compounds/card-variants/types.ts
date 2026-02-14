import { ITestimonial } from "../../types";

/**
 * Available card variant types
 */
export type TestimonialCardVariant =
  | "default"
  | "bblunt"
  | "thederma"
  | "aqualogica";

/**
 * Card styling configuration
 */
export interface CardStyleConfig {
  /** Background color */
  backgroundColor?: string;

  /** Border configuration */
  border?: {
    width?: string;
    color?: string;
    radius?: string;
  };

  /** Shadow configuration */
  shadow?: string;

  /** Padding */
  padding?: string;

  /** Text colors */
  textColors?: {
    name?: string;
    location?: string;
    title?: string;
    description?: string;
  };

  /** Star rating color */
  starColor?: string;
  starEmptyColor?: string;

  /** Image configuration */
  image?: {
    size?: string;
    borderWidth?: string;
    borderColor?: string;
    borderRadius?: string;
  };

  /** Layout configuration */
  layout?: "vertical" | "horizontal";

  /** Custom CSS classes */
  customClasses?: string;

  /** Custom inline styles */
  customStyles?: React.CSSProperties;
}

/**
 * Props for card variant components
 */
export interface CardVariantProps {
  testimonial: ITestimonial;
  styleConfig?: CardStyleConfig;
}

/**
 * Card variant component type
 */
export type CardVariantComponent = React.FC<CardVariantProps>;
