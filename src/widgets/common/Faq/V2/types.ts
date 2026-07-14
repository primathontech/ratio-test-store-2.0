import type { FaqVM } from "../contract";
import type { TypePreset } from "../_shared/typography";

/**
 * FaqAccordion (v2) — flat-schema accordion FAQ look.
 *
 * A heading over a list of native `<details>/<summary>` rows (zero client JS).
 * Caret-or-plus toggle icon, dividers on by default, per-row open-by-default,
 * type presets for the heading and row titles, and page/full section width.
 */

/** One collapsible row (flat — editor objectArray friendly). */
export interface FaqAccordionRow {
  heading?: string;
  /** Answer body — rich text (HTML allowed). */
  body?: string;
  /** Render the row expanded on first paint. */
  open_by_default?: boolean;
}

/**
 * FaqAccordion native settings — v2's typed VM extension (vm.v2).
 * Color fields beyond `divider_color` are extensions (the source look was
 * fully scheme-driven; empty keeps the scheme default).
 */
export interface FaqAccordionSettings {
  variant?: string;

  /* --- Layout / appearance --- */
  color_scheme?: string;
  section_width?: "page-width" | "full-width";
  /** Gap between the heading and the accordion, px. */
  gap?: number;
  "padding-block-start"?: number;
  "padding-block-end"?: number;
  /** Section background (hex). Empty = scheme background. */
  section_background?: string;

  /* --- Heading --- */
  /** Short uppercase caption above the heading. Empty = not rendered. */
  caption?: string;
  heading?: string;
  heading_preset?: TypePreset;
  heading_alignment?: "left" | "center" | "right";
  /** Heading color (hex). Empty = scheme heading color. */
  heading_color?: string;

  /* --- Accordion --- */
  icon?: "caret" | "plus";
  dividers?: boolean;
  divider_color?: string;
  /** Typography preset for each row's title. */
  row_preset?: TypePreset;
  rows?: FaqAccordionRow[];
  /** Question (row title) color. Empty = scheme foreground. */
  question_color?: string;
  /** Answer body color. Empty = scheme foreground. */
  answer_color?: string;
}

/** Props for the v2 look — renders ONLY the VM (vm.v2 is its extension). */
export interface FaqAccordionProps {
  vm: FaqVM;
  className?: string;
  locale?: string;
}
