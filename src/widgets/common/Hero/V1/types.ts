import type { HeroVM } from "../contract";

/**
 * A single call-to-action button (image-banner `buttons` block).
 * Mirrors the block settings: label + link + outline-style flag.
 */
export interface ImageBannerButton {
  /** Button label text. */
  label?: string;
  /** Button destination URL. */
  link?: string;
  /**
   * Use the outline (secondary) button style — transparent bg, ring border.
   */
  secondary?: boolean;
}

/**
 * Desktop content-position options (`desktop_content_position`).
 * Controls the alignment of the content box inside the banner on desktop.
 */
export type ImageBannerContentPosition =
  | "top-left"
  | "top-center"
  | "top-right"
  | "middle-left"
  | "middle-center"
  | "middle-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";

/** Text alignment (`desktop_content_alignment` / `mobile_content_alignment`). */
export type ImageBannerAlignment = "left" | "center" | "right";

/** Banner height preset (`image_height`). */
export type ImageBannerHeight = "adapt" | "small" | "medium" | "large";

/** Image scroll behaviour (`image_behavior`). */
export type ImageBannerBehavior = "none" | "ambient" | "fixed" | "zoom-in";

/** Heading size token (`heading_size`). */
export type ImageBannerHeadingSize = "h2" | "h1" | "h0" | "hxl" | "hxxl";

/** Text block style (text block `text_style`). */
export type ImageBannerTextStyle =
  | "body"
  | "subtitle"
  | "caption-with-letter-spacing";

/**
 * ImageBanner variant (v1) settings.
 *
 * Maps 1:1 to the image-banner schema (section settings + the
 * heading / text / buttons blocks). Live demo defaults are encoded as the
 * `??` fallbacks inside the component so an unconfigured widget still looks
 * correct.
 */
export interface ImageBannerSettings {
  /**
   * Widget variant
   * @default 'v1'
   */
  variant?: string;

  // ---- Media -------------------------------------------------------------
  /** First image (left half). */
  image?: string;
  /** Alt text for the first image. */
  imageAlt?: string;
  /** Second image (right half). */
  image2?: string;
  /** Alt text for the second image. */
  image2Alt?: string;

  // ---- Layout / behaviour ------------------------------------------------
  /** Banner height preset. */
  imageHeight?: ImageBannerHeight;
  /** Image scroll behaviour — parallax/fixed/ambient/zoom. */
  imageBehavior?: ImageBannerBehavior;
  /** Black overlay opacity 0–100 (%). */
  imageOverlayOpacity?: number;
  /** Desktop content box position. */
  desktopContentPosition?: ImageBannerContentPosition;
  /** Desktop text alignment. */
  desktopContentAlignment?: ImageBannerAlignment;
  /** Show the solid container box around content on desktop. */
  showTextBox?: boolean;
  /**
   * On mobile, render the content box BELOW the images instead of overlaid on
   * top of them.
   */
  showTextBelow?: boolean;
  /** Stack the two images vertically on mobile (vs. 50/50 side-by-side). */
  stackImagesOnMobile?: boolean;
  /** Mobile text alignment. */
  mobileContentAlignment?: ImageBannerAlignment;
  /**
   * Theme color scheme.
   * @default "scheme-1"
   */
  colorScheme?: string;

  // ---- Content (heading / text blocks) -----------------------------------
  /** Heading text. */
  heading?: string;
  /** Heading size token. */
  headingSize?: ImageBannerHeadingSize;
  /** Heading color (default white). */
  headingColor?: string;
  /** Sub/description text. */
  text?: string;
  /** Text block style — body / subtitle / caption. */
  textStyle?: ImageBannerTextStyle;
  /** Sub-text color (default white @ 75%). */
  textColor?: string;

  // ---- Button colors (defaults preserve the classic look) ----------------
  /** Solid-button background / outline-button ring+text color override. */
  ctaBackground?: string;
  /** Button label color override. */
  ctaTextColor?: string;

  // ---- Buttons block -----------------------------------------------------
  /** Up to two CTA buttons. */
  buttons?: ImageBannerButton[];
}

/**
 * ImageBanner widget data.
 * The banner is fully static (no data source) — content lives in settings.
 */
export interface ImageBannerData {
  // No data source.
}

/**
 * Props for the ImageBanner (v1) variant — renders ONLY the VM.
 * Its typed extension (vm.v1) is this file's ImageBannerSettings.
 */
export interface ImageBannerProps {
  vm: HeroVM;
  className?: string;
  locale?: string;
}
