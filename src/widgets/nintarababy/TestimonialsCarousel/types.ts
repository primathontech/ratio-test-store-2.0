import { WidgetProps } from "@/widgets/types";

/**
 * TestimonialsCarousel widget settings
 */
export interface TestimonialsCarouselSettings {
  /** Widget variant @default "v1" */
  variant?: string;
}

/**
 * A single testimonial review
 */
export interface TestimonialReview {
  /** Unique ID */
  id: number;
  /** Number of stars (1-5) */
  stars: number;
  /** Review body text (wrapped in quotes in UI) */
  text: string;
  /** Reviewer display name */
  author: string;
}

/**
 * TestimonialsCarousel widget data
 */
export interface TestimonialsCarouselData {
  /** Section heading */
  heading?: string;
  /** Section subheading */
  subheading?: string;
  /** Array of testimonial reviews */
  reviews?: TestimonialReview[];
}

/**
 * Combined props for the TestimonialsCarousel widget
 */
export type TestimonialsCarouselProps = WidgetProps<
  TestimonialsCarouselData,
  TestimonialsCarouselSettings
>;

/**
 * Default heading text
 */
export const DEFAULT_HEADING = "Testimonials";

/**
 * Default subheading text
 */
export const DEFAULT_SUBHEADING = "Hear it from our Nintara parents";

/**
 * Default testimonial reviews
 */
export const DEFAULT_REVIEWS: TestimonialReview[] = [
  {
    id: 1,
    stars: 5,
    text: "\u201CThis feeding pillow sits just right and the cotton cover feels soft and breathable.\u201D",
    author: "Prajakta",
  },
  {
    id: 2,
    stars: 4,
    text: "\u201CThe silent buckle is genius. I can slip the pillow off after a feed without waking my daughter. Cleaning is easy thanks to the waterproof layer.\u201D",
    author: "Megha S",
  },
  {
    id: 3,
    stars: 5,
    text: "\u201CFirm but comfy is exactly right. My son doesn\u2019t sink, and the latch stays consistent. My wrists and shoulders feel less tired.\u201D",
    author: "Samah",
  },
  {
    id: 4,
    stars: 4,
    text: "\u201CBottle feeds are smoother now. I keep the bottle in the pocket, and we settle in quickly. The whole setup feels thoughtfully designed.\u201D",
    author: "Shamali B",
  },
  {
    id: 5,
    stars: 5,
    text: "\u201CThe wrap fit is so secure. My baby stays at the perfect height and I\u2019m not juggling cushions anymore. The pocket for the burp cloth is a lifesaver.\u201D",
    author: "Navni P",
  },
  {
    id: 6,
    stars: 5,
    text: "\u201CI finally feed without slouching. The lumbar support keeps my back happy even during long, sleepy sessions. I didn\u2019t realise how much I needed this until I used it.\u201D",
    author: "Ambuja K",
  },
];

/**
 * Image paths for the widget (relative to /public)
 */
export const IMAGE_PATHS = {
  starIcon: "/nintarababy/TestimonialsCarousel/images/star-icon.png",
  cardBottomDecoration:
    "/nintarababy/TestimonialsCarousel/images/card-bottom-decoration.png",
};
