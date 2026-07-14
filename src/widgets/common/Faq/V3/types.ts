import type { FaqVM } from "../contract";

/**
 * FaqAnimated (v3) — client single-open accordion FAQ look.
 *
 * Narrow centered column (max 1000px): heading over `.faq-item` collapsibles.
 * Each item: a full-width trigger with the question on the left and a 28px
 * circled chevron on the right (down = closed, up = open) and a collapsible
 * rich-HTML answer. ONE item open at a time (opening another closes the
 * current one); smooth height animation via grid-rows 0fr→1fr. This is the
 * section's stateful look — its open/toggle state comes from useFaqLogic in
 * ../logic.ts (the merchant logic-wrap seam).
 */

/** One FAQ item: a plain-text question + a rich-HTML answer. */
export interface FaqAnimatedItem {
  /** Question (the collapsible trigger label) — plain text. */
  question: string;
  /** Answer body — rich-text HTML (rendered when the item is open). */
  answer: string;
}

/**
 * FaqAnimated native settings — v3's typed VM extension (vm.v3).
 * Everything below the first four fields is an extension: the source look
 * hardcoded those values; here they are settings whose empty value keeps the
 * original look.
 */
export interface FaqAnimatedSettings {
  variant?: string;
  /** Section heading. */
  heading?: string;
  /** Heading size: `small` (33px) | `medium` (43px) | `large` (50px). */
  headingSize?: "small" | "medium" | "large";
  /** The FAQ items (editor faq field → list of question + rich answer). */
  faqs?: FaqAnimatedItem[];

  /* ---- Extensions ---- */
  /** Short uppercase caption above the heading. Empty = not rendered. */
  caption?: string;
  headingAlignment?: "left" | "center" | "right";
  /** Heading color (hex). Empty = scheme heading color. */
  headingColor?: string;
  /** Question (trigger) color. Empty = scheme foreground. */
  questionColor?: string;
  /** Answer body color. Empty = scheme foreground. */
  answerColor?: string;
  /** Row hairline + chevron-circle border color. Empty = scheme border. */
  dividerColor?: string;
  /** Section background (hex). Empty = scheme background. */
  sectionBackground?: string;
  colorScheme?: string;
  /** Open the first item on first paint. */
  openFirstRow?: boolean;
  /** Top padding in px (desktop). Mobile uses ~55%. */
  paddingTop?: number;
  /** Bottom padding in px (desktop). Mobile uses ~55%. */
  paddingBottom?: number;
}

/** Props for the v3 look — renders ONLY the VM (vm.v3 is its extension). */
export interface FaqAnimatedProps {
  vm: FaqVM;
  className?: string;
  locale?: string;
}
