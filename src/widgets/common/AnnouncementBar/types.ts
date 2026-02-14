import { WidgetProps } from "../../types";
import { VariantType } from "./variants";

/** Navigation icon styles for V2 */
export type TNavigationIconStyle = "arrow" | "chevron" | "caret";

/** Navigation position for V2 */
export type TNavigationPosition = "inside" | "outside";

/** Single text item (flat) */
export interface IBannerTextItemFlat {
  id?: string | number;
  text: string; // plain text or sanitized HTML string
  href?: string; // optional link
  target?: "_self" | "_blank" | "_parent" | "_top";
}

/** Modes */
export type TBannerMode = "static" | "marquee" | "marquee-reverse" | "fade";

/** Control shape */
export type TControlShape = "circle" | "square" | "rounded";

/** Control shape */
export type TSeparator = "dot" | "line";

/** Action button position */
export type TActionButtonPosition = "left" | "right" | "center";

/** Flattened props */
export interface Settings {
  variant: VariantType;
  width?: "full" | "container" | string; // 'full' | 'container' or custom CSS width

  // background (flat responsive)
  backgroundColor?: string;
  fontColor?: string; // single value (can be token or CSS color)
  fontColorMobile?: string;

  // height (flat responsive)
  heightMobile?: string;
  heightDesktop?: string;

  // typography (flat responsive)
  fontSizeMobile?: string;
  fontSizeDesktop?: string;

  // text content (array allowed)
  texts: IBannerTextItemFlat[]; // required (at least one item)
  separator?: TSeparator;
  textJustifyContent?: string;

  // behavior
  mode?: TBannerMode; // marquee | static
  marqueeSpeed?: number | string; // px/sec or CSS duration string (e.g. '10s')
  pauseOnHover?: boolean;

  ariaLabel?: string;

  showCloseButton?: boolean;

  // action button (flat)
  showActionButton?: boolean;
  actionButtonHeight?: string | number;
  actionButtonWidth?: string | number;
  actionButtonText?: string;
  actionButtonHref?: string;
  actionButtonTarget?: "_self" | "_blank" | "_parent" | "_top";
  actionButtonPosition?: TActionButtonPosition;
  actionButtonBorderRadius?: string | number;
  actionButtonBorderColor?: string | number;
  actionButtonTextColor?: string;
  actionButtonBackgroundColor?: string;

  // V2-specific slider settings
  enableSlider?: boolean; // Enable slider functionality (V2 only)
  slidesToShow?: number; // Number of announcements visible at once
  slidesToScroll?: number; // Number of announcements to scroll per action
  autoplay?: boolean; // Auto-advance slides (different from marquee autoplay)
  autoplayInterval?: number; // Auto-advance interval in ms
  infinite?: boolean; // Loop slides infinitely (different from marquee infinite)

  // V2-specific navigation controls
  showNavigationArrows?: boolean; // Show prev/next arrows
  navigationPosition?: TNavigationPosition; // Arrow positioning
  navigationIconStyle?: TNavigationIconStyle; // Icon style
  showNavigationOnHover?: boolean; // Show arrows only on hover

  // V2-specific drag/touch support
  enableDragScroll?: boolean; // Enable drag/touch scrolling
  dragSensitivity?: number; // Minimum drag distance in px

  // V2-specific styling
  navigationArrowColor?: string; // Arrow color
  navigationArrowBackgroundColor?: string; // Arrow background
  navigationArrowSize?: string; // Arrow size
}

/**
 * Header widget data - content that comes from data sources
 */
export interface Data {}

export type Props = WidgetProps<Data, Settings>;
