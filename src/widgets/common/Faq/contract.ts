/**
 * Editor settings schema for the common Faq widget — the SHARED surface.
 *
 * One semantic field set for all variants; logic.ts adapts each field onto
 * the selected variant's native settings. Fields a variant doesn't use are
 * simply ignored by it — labels carry a variant hint where a field is
 * variant-specific, since the editor's DynamicForm has no conditional-field
 * support.
 *
 * Field order = sidebar order (content → rows → accordion look → media →
 * layout → appearance). Color fields are hex text inputs (the editor has no
 * color picker); empty string = keep the variant's own default.
 *
 * This file is the schema source of truth: app widget-registries import it,
 * so the folder stays the portable unit.
 */
import type { FaqCollapsibleSettings } from "./V1/types";
import type { FaqAccordionSettings } from "./V2/types";
import type { FaqAnimatedSettings } from "./V3/types";
import { SAMPLE_QA, SAMPLE_HEADING } from "./_shared/sample-qa";

/* ── Shared editor-facing settings (drives settingsSchema below) ────────── */

/** One Q&A item — the editor's FAQ input shape ({question, answer}[]). */
export interface FaqItem {
  question: string;
  /** Answer body — rich-text HTML allowed. */
  answer: string;
}

export interface FaqImage {
  src?: string;
  alt?: string;
}

/** The shared, editor-facing settings surface (one field set, all variants). */
export interface FaqSharedSettings {
  variant?: string;
  colorScheme?: string; // scheme-1..5
  caption?: string;
  heading?: string;
  headingSize?: "small" | "medium" | "large" | "xl"; // medium = variant's original
  headingColor?: string; // hex; empty = variant default
  headingAlignment?: "default" | "left" | "center" | "right";
  faqs?: FaqItem[];
  openFirstRow?: boolean;
  /** "multiple" lets several answers stay open (Animated look; the native
   *  <details> looks are naturally multiple). */
  openBehavior?: "default" | "single" | "multiple";
  iconStyle?: "default" | "caret" | "plus"; // v2 (v1 caret, v3 circled chevron)
  /** Question + answer text scale ("default" = the variant's original). */
  textSize?: "default" | "small" | "medium" | "large";
  /** Question case. */
  textCase?: "default" | "none" | "uppercase";
  dividers?: boolean;
  dividerColor?: string;
  /** Divider thickness in px. */
  dividerWidth?: number;
  questionColor?: string;
  answerColor?: string;
  rowStyle?: "default" | "hairline" | "boxed"; // v1
  image?: FaqImage | string; // v1 side image
  imageRatio?: "default" | "adapt" | "small" | "large"; // v1
  imagePosition?: "default" | "first" | "second"; // v1
  /** Container width ("default" = the variant's original). */
  contentWidth?: "default" | "narrow" | "page" | "full";
  sectionWidth?: "default" | "page" | "full"; // v2 (legacy alias of contentWidth)
  paddingTop?: number;
  paddingBottom?: number;
  sectionBackground?: string;
  [key: string]: unknown; // native passthrough → routed into the extension
}

/* ── View-model (the stable seam variants render) ──────────────────────── */

export interface FaqVMShared {
  caption?: string;
  heading?: {
    text: string;
    size: "small" | "medium" | "large" | "xl";
    color?: string;
    align?: "left" | "center" | "right";
  };
  /** Normalized Q&A rows (post sample fall-through — never empty). */
  rows: FaqItem[];
  behavior: { openFirstRow: boolean; multiOpen: boolean };
  text: {
    size?: "small" | "medium" | "large";
    case?: "none" | "uppercase";
  };
  appearance: {
    colorScheme: string; // scheme id — variants resolve via schemeColorVars()
    iconStyle?: "caret" | "plus";
    dividers: boolean;
    dividerColor?: string;
    questionColor?: string;
    answerColor?: string;
    sectionBackground?: string;
  };
  layout: {
    rowStyle?: "hairline" | "boxed";
    sectionWidth?: "page" | "full";
    image?: { src: string; alt?: string };
    imageRatio?: "adapt" | "small" | "large";
    imagePosition?: "first" | "second";
    paddingTop?: number;
    paddingBottom?: number;
  };
}

/**
 * The Faq view-model. Variants receive ONLY this (never raw settings).
 * Typed extensions = each variant's faithful native settings interface
 * (design decision D2/approach A); only the selected variant's slot is set.
 */
export interface FaqVM {
  variant: "v1" | "v2" | "v3";
  shared: FaqVMShared;
  v1?: FaqCollapsibleSettings;
  v2?: FaqAccordionSettings;
  v3?: FaqAnimatedSettings;
}

export const FaqContract = {
  type: "Faq",
  name: "FAQ",
  description:
    "Common FAQ section — collapsible content with optional side image (v1), flat accordion (v2), or animated single-open accordion (v3)",
  /** Every data-testid the section renders (normalized across variants). */
  testIds: [
    "faq",
    "faq-caption",
    "faq-heading",
    "faq-row",
    "faq-question",
    "faq-answer",
    "faq-media",
  ] as const,
  /** No block region — rows are settings-driven (the editor's FAQ input). */
  acceptedBlocks: [] as const,
  /** Fully editor-driven — no data source. */
  data: { required: false } as const,
  settingsSchema: {
    variant: {
      type: "select" as const,
      label: "Widget Variant",
      options: [
        { value: "v1", label: "Version 1 (Collapsible Content)" },
        { value: "v2", label: "Version 2 (Accordion)" },
        { value: "v3", label: "Version 3 (Animated Accordion)" },
      ],
      default: "v1",
    },

    /* ── Content ─────────────────────────────────────────────────────── */
    caption: {
      type: "text" as const,
      label: "Caption (above heading)",
      default: "",
    },
    heading: {
      type: "text" as const,
      label: "Heading",
      default: SAMPLE_HEADING,
    },
    headingSize: {
      type: "select" as const,
      label: "Heading Size",
      options: [
        { value: "small", label: "Small" },
        { value: "medium", label: "Medium" },
        { value: "large", label: "Large" },
        { value: "xl", label: "Extra large" },
      ],
      default: "medium",
    },
    headingColor: {
      type: "text" as const,
      label: "Heading Color (hex, empty = default)",
      placeholder: "#111111",
      default: "",
    },
    headingAlignment: {
      type: "select" as const,
      label: "Heading Alignment",
      options: [
        { value: "default", label: "Variant default" },
        { value: "left", label: "Left" },
        { value: "center", label: "Center" },
        { value: "right", label: "Right" },
      ],
      default: "default",
    },

    /* ── Rows ────────────────────────────────────────────────────────── */
    faqs: {
      type: "faq" as const,
      label: "FAQ Items",
      default: SAMPLE_QA,
    },
    openFirstRow: {
      type: "boolean" as const,
      label: "Open First Question",
      default: false,
    },
    openBehavior: {
      type: "select" as const,
      label: "Open Behavior (Animated Accordion)",
      options: [
        { value: "default", label: "Variant default" },
        { value: "single", label: "One open at a time" },
        { value: "multiple", label: "Allow multiple open" },
      ],
      default: "default",
    },

    /* ── Accordion look ──────────────────────────────────────────────── */
    iconStyle: {
      type: "select" as const,
      label: "Toggle Icon (Accordion)",
      options: [
        { value: "default", label: "Variant default" },
        { value: "caret", label: "Caret" },
        { value: "plus", label: "Plus / minus" },
      ],
      default: "default",
    },
    textSize: {
      type: "select" as const,
      label: "Question & Answer Text Size",
      options: [
        { value: "default", label: "Variant default" },
        { value: "small", label: "Small" },
        { value: "medium", label: "Medium" },
        { value: "large", label: "Large" },
      ],
      default: "default",
    },
    textCase: {
      type: "select" as const,
      label: "Question Case",
      options: [
        { value: "default", label: "Variant default" },
        { value: "none", label: "Normal" },
        { value: "uppercase", label: "Uppercase" },
      ],
      default: "default",
    },
    dividers: {
      type: "boolean" as const,
      label: "Row Dividers",
      default: true,
    },
    dividerColor: {
      type: "text" as const,
      label: "Divider Color (hex, empty = default)",
      placeholder: "#e5e5e5",
      default: "",
    },
    dividerWidth: {
      type: "number" as const,
      label: "Divider Thickness (px)",
      default: 1,
      min: 0,
      max: 8,
      step: 1,
    },
    questionColor: {
      type: "text" as const,
      label: "Question Color (hex, empty = default)",
      placeholder: "#111111",
      default: "",
    },
    answerColor: {
      type: "text" as const,
      label: "Answer Color (hex, empty = default)",
      placeholder: "#333333",
      default: "",
    },
    rowStyle: {
      type: "select" as const,
      label: "Row Style (Collapsible Content)",
      options: [
        { value: "default", label: "Variant default" },
        { value: "hairline", label: "Hairline list" },
        { value: "boxed", label: "Bordered cards" },
      ],
      default: "default",
    },

    /* ── Media (Collapsible Content) ─────────────────────────────────── */
    image: {
      type: "image" as const,
      label: "Side Image (Collapsible Content)",
      default: { src: "", alt: "" },
    },
    imageRatio: {
      type: "select" as const,
      label: "Side Image Ratio",
      options: [
        { value: "default", label: "Adapt to image" },
        { value: "small", label: "Small crop" },
        { value: "large", label: "Large crop" },
      ],
      default: "default",
    },
    imagePosition: {
      type: "select" as const,
      label: "Side Image Position (desktop)",
      options: [
        { value: "default", label: "Variant default (right)" },
        { value: "first", label: "Left of the rows" },
        { value: "second", label: "Right of the rows" },
      ],
      default: "default",
    },

    /* ── Layout ──────────────────────────────────────────────────────── */
    sectionWidth: {
      type: "select" as const,
      label: "Content Width (Accordion)",
      options: [
        { value: "default", label: "Variant default" },
        { value: "page", label: "Page width" },
        { value: "full", label: "Full width" },
      ],
      default: "default",
    },
    contentWidth: {
      type: "select" as const,
      label: "Container Width",
      options: [
        { value: "default", label: "Variant default" },
        { value: "narrow", label: "Narrow (734px)" },
        { value: "page", label: "Page width" },
        { value: "full", label: "Full width" },
      ],
      default: "default",
    },
    paddingTop: {
      type: "number" as const,
      label: "Top Padding (px, desktop)",
      default: 48,
    },
    paddingBottom: {
      type: "number" as const,
      label: "Bottom Padding (px, desktop)",
      default: 48,
    },

    /* ── Appearance ──────────────────────────────────────────────────── */
    colorScheme: {
      type: "select" as const,
      label: "Color Scheme",
      options: [
        { value: "scheme-1", label: "Scheme 1" },
        { value: "scheme-2", label: "Scheme 2" },
        { value: "scheme-3", label: "Scheme 3" },
        { value: "scheme-4", label: "Scheme 4" },
        { value: "scheme-5", label: "Scheme 5" },
      ],
      default: "scheme-1",
    },
    sectionBackground: {
      type: "text" as const,
      label: "Section Background (hex, empty = default)",
      placeholder: "#ffffff",
      default: "",
    },
  },
} as const;

export default FaqContract;
