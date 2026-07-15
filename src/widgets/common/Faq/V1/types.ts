import type { FaqVM } from "../contract";

/**
 * FaqCollapsible (v1) — "Collapsible content" FAQ look.
 *
 * Centered caption + heading over native `<details>/<summary>` accordion rows
 * (zero JS). Two row treatments (hairline list vs bordered cards), an optional
 * media column beside the rows on tablet+, and per-scheme colors. The heading
 * scale uses the source look's h-token sizes (h1 = 40px desktop / 30px mobile).
 */

/** Heading size token (source `heading_size`; h1 = the look's original). */
export type FaqCollapsibleHeadingSize = "h2" | "h1" | "h0" | "hxl" | "hxxl";

/** Heading text-align. */
export type FaqCollapsibleAlignment = "left" | "center" | "right";

/**
 * Row treatment:
 *  - "none": narrow centered column of hairline-separated rows (the default).
 *  - "row":  each accordion is a bordered card with inner padding.
 */
export type FaqCollapsibleLayout = "none" | "row";

/** Desktop media-column position relative to the rows. */
export type FaqCollapsibleImagePosition = "image_first" | "image_second";

/** Media aspect: intrinsic ("adapt") or a fixed-height crop. */
export type FaqCollapsibleImageRatio = "adapt" | "small" | "large";

/** One collapsible row (flat — editor-friendly). */
export interface FaqCollapsibleRow {
  /** Row heading / accordion title (plain text). */
  title?: string;
  /** Rich body content (inline HTML — `<p>`, `<ul>`, `<strong>`…). */
  body?: string;
}

/**
 * FaqCollapsible native settings — v1's typed VM extension (vm.v1).
 * Color fields are extensions: the source look hardcoded scheme colors; here
 * they are settings whose empty value keeps the scheme-driven default.
 */
export interface FaqCollapsibleSettings {
  /** @default 'v1' */
  variant?: string;

  /* ---- Header ---- */
  /** Short uppercase caption above the heading. Empty = not rendered. */
  caption?: string;
  heading?: string;
  headingSize?: FaqCollapsibleHeadingSize;
  headingAlignment?: FaqCollapsibleAlignment;
  /** Heading color (hex). Empty = scheme foreground. */
  headingColor?: string;

  /* ---- Rows ---- */
  rows?: FaqCollapsibleRow[];
  /** Open the first row on first paint. */
  openFirstRow?: boolean;
  layout?: FaqCollapsibleLayout;
  /** Question (summary) color. Empty = scheme foreground. */
  questionColor?: string;
  /** Answer body color. Empty = scheme foreground at 75%. */
  answerColor?: string;
  /** Hairline/card border color. Empty = scheme border. */
  dividerColor?: string;

  /* ---- Optional media column ---- */
  /** Image URL beside the rows on tablet+. Empty = no media column. */
  image?: string;
  imageAlt?: string;
  imageRatio?: FaqCollapsibleImageRatio;
  imagePosition?: FaqCollapsibleImagePosition;

  /* ---- Section ---- */
  colorScheme?: string;
  /** Section background (hex). Empty = scheme background. */
  sectionBackground?: string;
  /** Top padding in px (desktop). Mobile uses ~75%. */
  paddingTop?: number;
  /** Bottom padding in px (desktop). Mobile uses ~75%. */
  paddingBottom?: number;

  /* ---- Extensions (the source hardcoded these) ---- */
  /** Row text scale: small 15/13px · medium 17–20/15–16px (original) · large 19–22/17–18px. */
  textSize?: "small" | "medium" | "large";
  /** Question case. @default none */
  textCase?: "none" | "uppercase";
  /** Hairline/card border thickness in px. @default 1 (original) */
  dividerWidth?: number;
  /** Container width override (original: narrow w/o image, page with image). */
  contentWidth?: "narrow" | "page" | "full";
}

/** Props for the v1 look — renders ONLY the VM (vm.v1 is its extension). */
export interface FaqCollapsibleProps {
  vm: FaqVM;
  className?: string;
  locale?: string;
}
