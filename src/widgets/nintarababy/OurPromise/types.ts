import { WidgetProps } from "@/widgets/types";

/**
 * A single promise/trust badge item
 */
export interface PromiseItem {
  /** Icon image path */
  icon: string;
  /** Title text (displayed in green) */
  title: string;
  /** Description text */
  description: string;
}

/**
 * OurPromise widget data
 */
export interface OurPromiseData {
  promises?: PromiseItem[];
}

/**
 * OurPromise widget settings
 */
export interface OurPromiseSettings {
  /** Widget variant @default "v1" */
  variant?: string;
  /** Center image path */
  centerImage?: string;
  /** Center image alt text */
  centerImageAlt?: string;
  /** Desktop center image max width (px) — height auto-scales to aspect ratio */
  centerImageWidth?: number;
  /** Mobile center image max width (px) — height auto-scales to aspect ratio */
  centerImageMobileWidth?: number;
  /** Desktop icon size (px, square) */
  iconSize?: number;
  /** Mobile icon size (px, square) */
  iconSizeMobile?: number;
  /** Promise items (array form) */
  promises?: PromiseItem[];
  /** Flat promise fields (editor form) */
  [key: `promise${number}_${"icon" | "title" | "description"}`]: string;
}

/**
 * Props for the OurPromise component
 */
export type OurPromiseProps = WidgetProps<OurPromiseData, OurPromiseSettings>;

/**
 * Design tokens for OurPromise section
 */
export const DESIGN_TOKENS = {
  colors: {
    titleColor: "#4d7a57",
    textColor: "#000000",
    background: "#fdf6f0",
  },
  typography: {
    fontFamily: "Figtree, sans-serif",
    title: {
      fontSize: "clamp(16px, 1.8vw, 22px)",
      fontWeight: "700",
    },
    description: {
      fontSize: "clamp(13px, 1.2vw, 16px)",
      fontWeight: "400",
      lineHeight: "1.5",
    },
  },
  spacing: {
    sectionPadding: "60px 5%",
    sectionPaddingMobile: "40px 5%",
    iconSize: "64px",
    iconSizeMobile: "40px",
    imageMaxWidth: "380px",
    imageBorderRadius: "24px",
  },
} as const;

/**
 * Default promise items
 */
export const DEFAULT_PROMISES: PromiseItem[] = [
  {
    icon: "/assets/momsco/images/home/Hypoallergenic.png",
    title: "Hypoallergenic",
    description: "No redness, no rashes, no discomfort. Only gentle care.",
  },
  {
    icon: "/assets/momsco/images/home/Clinically-Tested-For-Safety.png",
    title: "Clinically Tested For Safety",
    description: "Backed by science and made with love.",
  },
  {
    icon: "/assets/momsco/images/home/Dermatologically-Tested.png",
    title: "Dermatologically Tested",
    description: "Skin-nourishing formulas, tested by experts you can trust.",
  },
  {
    icon: "/assets/momsco/images/home/Natural-Ingredients.png",
    title: "Natural Ingredients",
    description: "Made responsibly with nature\u2019s safest ingredients.",
  },
];
