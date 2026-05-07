import { WidgetProps } from "@/widgets/types";
import type { CarouselBreakpoint } from "@/ui/components/SwipeCarousel";

/**
 * A single testimonial card
 */
export interface TestimonialItem {
  heading: string;
  reviewText: string;
  authorName: string;
  avatarSrc: string;
  stars: number;
}

/**
 * Testimonials widget settings
 */
export interface TestimonialsSettings {
  /** Widget variant */
  variant?: string;
  /** Section heading (rich HTML — supports <strong>, <em>, etc.) */
  heading?: string;
  /** Array of testimonial cards */
  testimonials?: TestimonialItem[];
  /** Card background colour */
  cardBackground?: string;
  /** Star fill colour */
  starColor?: string;
  /**
   * Optional override for the SwipeCarousel breakpoints. Set from the
   * template to tune cards/gap per viewport bucket. Falls back to the
   * widget's built-in default when omitted.
   */
  carouselBreakpoints?: CarouselBreakpoint[];
}

/**
 * Testimonials widget data (static section, no API data needed)
 */
export interface TestimonialsData {
  // Static content section -- no dynamic data
}

/**
 * Props for the Testimonials component
 */
export type TestimonialsProps = WidgetProps<
  TestimonialsData,
  TestimonialsSettings
>;
