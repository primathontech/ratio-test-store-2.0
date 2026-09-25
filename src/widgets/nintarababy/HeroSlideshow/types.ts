import { WidgetProps } from "@/widgets/types";

/**
 * A single slide in the hero slideshow
 */
export interface HeroSlide {
  /** Unique index of the slide */
  index: number;
  /** Link destination for the slide */
  href: string;
  /** Desktop image path (landscape, 1440x480) */
  desktopImage: string;
  /** Mobile image path (portrait, ~720x970) */
  mobileImage: string;
  /** Alt text for the slide image */
  alt?: string;
  /** Loading strategy for the image */
  loading?: "eager" | "lazy";
}

/**
 * HeroSlideshow widget settings
 */
export interface HeroSlideshowSettings {
  /** Widget variant @default "v1" */
  variant?: string;
  /** Autoplay interval in milliseconds @default 7000 */
  autoplayMs?: number;
  /** Mobile breakpoint for image swap in pixels @default 550 */
  mobileBreakpoint?: number;
  /** Slides — each with full image paths, href, and alt text.
   *  When provided, overrides data.slides and DEFAULT_SLIDES. */
  slides?: Array<{
    desktopImage: string;
    mobileImage: string;
    href: string;
    alt: string;
  }>;
}

/**
 * HeroSlideshow widget data
 */
export interface HeroSlideshowData {
  slides?: HeroSlide[];
}

/**
 * Props for the HeroSlideshow component
 */
export type HeroSlideshowProps = WidgetProps<
  HeroSlideshowData,
  HeroSlideshowSettings
>;

/**
 * Design tokens extracted from nintarababy.in hero slideshow
 */
export const DESIGN_TOKENS = {
  colors: {
    dotInactive: "#ffffff",
    dotInactiveOpacity: 0.6,
    dotActive: "#ffffff",
    dotActiveOpacity: 1.0,
    dotProgressFill: "#ffffff",
  },
  dots: {
    width: "60px",
    height: "5px",
    borderRadius: "10px",
    gap: "8px",
    bottomPadding: "24px",
  },
  dimensions: {
    desktop: {
      width: 1440,
      height: 480,
      aspectRatio: "3/1",
    },
    mobile: {
      width: 375,
      height: 506,
      aspectRatio: "375/506",
    },
  },
  animation: {
    autoplayMs: 7000,
    scrollSettleMs: 120,
    teleportDebounceMs: 50,
    scrollBehaviorResetMs: 400,
  },
  breakpoints: {
    mobileImageSwap: 550,
  },
} as const;

/**
 * Image paths for hero slideshow assets
 */
export const IMAGE_PATHS = {
  basePath: "/assets/nintarababy/hero",
} as const;

/**
 * Default slides matching the source site
 */
export const DEFAULT_SLIDES: HeroSlide[] = [
  {
    index: 0,
    href: "/collections/baby-bedding-sets",
    desktopImage: "slide-0-desktop.webp",
    mobileImage: "slide-0-mobile.webp",
    alt: "Baby bedding sets collection",
    loading: "eager",
  },
  {
    index: 1,
    href: "/collections/baby-sleeping-mats-waterproof",
    desktopImage: "slide-1-desktop.webp",
    mobileImage: "slide-1-mobile.webp",
    alt: "Baby sleeping mats collection",
    loading: "lazy",
  },
  {
    index: 2,
    href: "/collections/all-products",
    desktopImage: "slide-2-desktop.webp",
    mobileImage: "slide-2-mobile.webp",
    alt: "All products collection",
    loading: "lazy",
  },
  {
    index: 3,
    href: "/collections/best-baby-gift-set-box",
    desktopImage: "slide-3-desktop.webp",
    mobileImage: "slide-3-mobile.webp",
    alt: "Baby gift set boxes collection",
    loading: "lazy",
  },
];
