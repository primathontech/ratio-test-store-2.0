import type { HeroVM } from "../contract";

/* ------------------------------------------------------------------ */
/* Hero block system                                                   */
/* Mirrors the `text` and `button` theme blocks 1:1.                   */
/* (logo / jumbo-text / spacer / group / _marquee are shared block     */
/*  types reused across many sections — added as a follow-up.)         */
/* ------------------------------------------------------------------ */

export type HeroBlockType = "text" | "button";

/** Mirrors blocks/text.liquid {% schema %}. */
export interface HeroTextBlockSettings {
  /** Rich text (HTML allowed). */
  text?: string;
  /** Box width. */
  width?: "fit-content" | "100%";
  /** Max line length. */
  max_width?: "narrow" | "normal" | "none";
  /** Text alignment (only applies when width = 100%). */
  alignment?: "left" | "center" | "right";
  /** Typography preset. */
  type_preset?:
    | "rte"
    | "paragraph"
    | "h1"
    | "h2"
    | "h3"
    | "h4"
    | "h5"
    | "h6"
    | "custom";
  /** Font family (custom preset only). */
  font?: string;
  /** Font size (custom preset only). */
  font_size?: string;
  /** Line height (custom preset only). */
  line_height?: "tight" | "normal" | "loose";
  /** Letter spacing (custom preset only). */
  letter_spacing?: "tight" | "normal" | "loose";
  /** Text case (custom preset only). */
  case?: "none" | "uppercase";
  /** Text wrap (custom preset only). */
  wrap?: "pretty" | "balance" | "nowrap";
  /** Text color (non-rte presets). */
  color?: string;
  /** Show a background behind the text. */
  background?: boolean;
  /** Background color (when background enabled). */
  background_color?: string;
  /** Background corner radius in px. */
  corner_radius?: number;
  "padding-block-start"?: number;
  "padding-block-end"?: number;
  "padding-inline-start"?: number;
  "padding-inline-end"?: number;
}

/** Mirrors blocks/button.liquid {% schema %}. */
export interface HeroButtonBlockSettings {
  label?: string;
  link?: string;
  open_in_new_tab?: boolean;
  style_class?: "button" | "button-secondary" | "link";
  width?: "fit-content" | "custom";
  custom_width?: number;
  width_mobile?: "fit-content" | "custom";
  custom_width_mobile?: number;
}

export interface HeroTextBlock {
  id?: string;
  type: "text";
  settings: HeroTextBlockSettings;
}

export interface HeroButtonBlock {
  id?: string;
  type: "button";
  settings: HeroButtonBlockSettings;
}

export type HeroBlock = HeroTextBlock | HeroButtonBlock;

/* ------------------------------------------------------------------ */
/* Hero media                                                          */
/* Each item is one media slot carrying BOTH a desktop and a mobile    */
/* source. A slot is treated as video when a video source is present,  */
/* otherwise as an image. Mobile falls back to desktop when omitted.   */
/* Modelled as an editor `objectArray` (plain URL strings per the CMS  */
/* guide, with a single shared `alt` sibling per item).                */
/* ------------------------------------------------------------------ */

export interface HeroMediaItem {
  id?: string;
  /** Desktop image URL. */
  desktopImage?: string;
  /** Mobile image URL (falls back to desktopImage). */
  mobileImage?: string;
  /** Desktop video URL (presence marks this slot as a video). */
  desktopVideo?: string;
  /** Mobile video URL (falls back to desktopVideo). */
  mobileVideo?: string;
  /** Alt text (images). */
  alt?: string;
}

/* ------------------------------------------------------------------ */
/* Hero section settings — 1:1 with sections/hero.liquid {% schema %}  */
/* (media collapsed into a desktop+mobile item array)                  */
/* ------------------------------------------------------------------ */

export interface HeroSettings {
  /**
   * Widget variant
   * @default 'v1'
   */
  variant?: string;

  /* --- Media --- */
  /** Media slots (1 = full-bleed, 2 = split hero). */
  media?: HeroMediaItem[];
  /** Stack media slots vertically on mobile (vs side-by-side). */
  stack_media_on_mobile?: boolean;

  /* --- Section link --- */
  /** Wrap the whole hero in a link. */
  link?: string;
  open_in_new_tab?: boolean;

  /* --- Layout --- */
  content_direction?: "column" | "row";
  /** Force vertical stacking of content on mobile (row direction only). */
  vertical_on_mobile?: boolean;
  /** Horizontal alignment (row direction). */
  horizontal_alignment?: "flex-start" | "center" | "flex-end" | "space-between";
  /** Vertical alignment (row direction). */
  vertical_alignment?: "flex-start" | "center" | "flex-end";
  /** Align to baseline (when vertical_alignment = flex-end). */
  align_baseline?: boolean;
  /** Horizontal alignment (column direction). */
  horizontal_alignment_flex_direction_column?:
    | "flex-start"
    | "center"
    | "flex-end";
  /** Vertical alignment (column direction). */
  vertical_alignment_flex_direction_column?:
    | "flex-start"
    | "center"
    | "flex-end"
    | "space-between";
  /** Gap between content blocks (px). */
  gap?: number;
  /** Content container width. */
  section_width?: "page-width" | "full-width";
  /** Section height preset. */
  section_height?:
    | "auto"
    | "small"
    | "medium"
    | "large"
    | "full-screen"
    | "custom";
  /** Custom section height in svh (when section_height = custom). */
  section_height_custom?: number;

  /* --- Appearance --- */
  /** Color scheme key (scheme-1 .. scheme-5). */
  color_scheme?: string;
  /** Section background override (wins over the scheme's background). */
  section_background?: string;
  /** Button background override (applies to primary AND secondary buttons). */
  cta_background?: string;
  /** Button label color override. */
  cta_text_color?: string;
  /**
   * Style applied to button content blocks (primary / secondary / link).
   * Section-level so the editor shows a proper dropdown; overrides a block's
   * own `style_class`.
   */
  button_style?: "button" | "button-secondary" | "link";
  /** Show a color overlay on top of the media. */
  toggle_overlay?: boolean;
  /** Overlay color (rgba/hex with alpha). */
  overlay_color?: string;
  overlay_style?: "solid" | "gradient";
  gradient_direction?: "to top" | "to bottom";
  /** Show a blurred reflection of the image below the hero (images only). */
  blurred_reflection?: boolean;
  /** Blurred reflection opacity (%). */
  reflection_opacity?: number;

  /* --- Padding --- */
  "padding-block-start"?: number;
  "padding-block-end"?: number;

  /* --- Content --- */
  /** Reorderable content blocks rendered over the media. */
  blocks?: HeroBlock[];
}

/**
 * Hero widget data.
 *
 * Media normally lives in `settings.media` (so the editor exposes the
 * objectArray picker). `data.media` is an optional fallback supply path
 * for a STATIC / API data source.
 */
export interface HeroData {
  media?: HeroMediaItem[];
}

/**
 * Props for the media hero (v2) variant — renders ONLY the VM.
 * Its typed extension (vm.v2) is this file's HeroSettings; the data.media
 * fallback is folded into the extension by logic.ts.
 */
export interface HeroV2Props {
  vm: HeroVM;
  className?: string;
  locale?: string;
}
