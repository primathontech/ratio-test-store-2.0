/**
 * Faq logic — the section's single logic entry (PRD §5.1).
 *
 * buildFaqVM(data, settings) → FaqVM:
 *   - vm.shared     semantic, variant-agnostic resolution of the shared
 *                   editor-facing settings (contract.ts settingsSchema)
 *   - vm.v1/v2/v3   the selected variant's typed extension = its faithful
 *                   native settings interface (design decision D2/approach A),
 *                   built from the shared fields + native-key passthrough
 *                   (native values win over generated ones)
 *
 * This is the library's FIRST STATEFUL section (amendment A1): alongside the
 * pure, server-safe builder it exports useFaqLogic — the open/toggle state
 * hook the animated look (v3) renders from. Merchant forks can wrap EITHER
 * seam via widgets/_overrides.ts:
 *   - "Faq"              → wrap buildFaqVM   (reshape the VM)
 *   - "Faq:useFaqLogic"  → wrap useFaqLogic  (e.g. analytics on question
 *                          open, multi-open behavior) — same decorating
 *                          pattern, pin `typeof useFaqLogic`.
 * v1/v2 render native <details>/<summary> and never touch the hook.
 */
import { useCallback, useState } from "react";
import type {
  FaqSharedSettings,
  FaqVM,
  FaqVMShared,
  FaqItem,
  FaqImage,
} from "./contract";
import type { FaqData } from "./types";
import type {
  FaqCollapsibleSettings,
  FaqCollapsibleHeadingSize,
} from "./V1/types";
import type { FaqAccordionSettings } from "./V2/types";
import type { FaqAnimatedSettings } from "./V3/types";
import { TypePreset } from "./_shared/typography";
import {
  V1_SAMPLE_ROWS,
  V1_SAMPLE_HEADING,
  V1_SAMPLE_CAPTION,
} from "./V1/sample-data";
import { V2_SAMPLE_ROWS, V2_SAMPLE_HEADING } from "./V2/sample-data";
import { V3_SAMPLE_ITEMS, V3_SAMPLE_HEADING } from "./V3/sample-data";
import { SAMPLE_QA } from "./_shared/sample-qa";

const SHARED_KEYS = [
  "variant",
  "colorScheme",
  "caption",
  "heading",
  "headingSize",
  "headingColor",
  "headingAlignment",
  "faqs",
  "openFirstRow",
  "iconStyle",
  "dividers",
  "dividerColor",
  "questionColor",
  "answerColor",
  "rowStyle",
  "image",
  "imageRatio",
  "imagePosition",
  "sectionWidth",
  "paddingTop",
  "paddingBottom",
  "sectionBackground",
] as const;

const src = (v: FaqImage | string | undefined): string | undefined =>
  typeof v === "string" ? v || undefined : v?.src || undefined;
const alt = (v: FaqImage | string | undefined): string | undefined =>
  typeof v === "string" ? undefined : v?.alt || undefined;

/** Drop undefined values so variant-internal fallbacks still apply. */
const compact = (o: Record<string, unknown>) =>
  Object.fromEntries(Object.entries(o).filter(([, v]) => v !== undefined));

/** "default" (and empty) select values mean "keep the variant's own default". */
const opt = <T extends string>(v: T | undefined): T | undefined =>
  !v || v === "default" ? undefined : v;

const nativeRest = (s: FaqSharedSettings) => {
  const rest: Record<string, unknown> = { ...s };
  for (const k of SHARED_KEYS) {
    delete rest[k];
  }
  return rest;
};

/** Configured Q&A items, or null when the merchant has set none. */
const configuredItems = (s: FaqSharedSettings): FaqItem[] | null =>
  Array.isArray(s.faqs) && s.faqs.length > 0 ? s.faqs : null;

/* ── v1: collapsible content ───────────────────────────────────────────── */
function toV1Ext(s: FaqSharedSettings): FaqCollapsibleSettings {
  // medium = h1, the look's original heading size.
  const headingSizeMap: Record<string, FaqCollapsibleHeadingSize> = {
    small: "h2",
    medium: "h1",
    large: "h0",
    xl: "hxl",
  };
  const rowStyleMap: Record<string, "none" | "row"> = {
    hairline: "none",
    boxed: "row",
  };
  const imagePositionMap: Record<string, "image_first" | "image_second"> = {
    first: "image_first",
    second: "image_second",
  };
  const items = configuredItems(s);
  // Sample fall-through: with NO rows the section must look GREAT (fresh
  // palette add / AI instantiation) — never render an empty shell.
  const unconfigured = !items && s.heading === undefined;
  const rows = items
    ? items.map((qa) => ({ title: qa.question, body: qa.answer }))
    : V1_SAMPLE_ROWS;
  const rowStyle = opt(s.rowStyle);
  const imageRatio = opt(s.imageRatio);
  const imagePosition = opt(s.imagePosition);
  return {
    ...compact({
      caption: s.caption ?? (unconfigured ? V1_SAMPLE_CAPTION : undefined),
      heading: s.heading ?? V1_SAMPLE_HEADING,
      headingSize: s.headingSize ? headingSizeMap[s.headingSize] : undefined,
      headingAlignment: opt(s.headingAlignment),
      headingColor: s.headingColor || undefined,
      rows,
      openFirstRow: s.openFirstRow,
      layout: rowStyle ? rowStyleMap[rowStyle] : undefined,
      questionColor: s.questionColor || undefined,
      answerColor: s.answerColor || undefined,
      dividerColor: s.dividerColor || undefined,
      image: src(s.image),
      imageAlt: alt(s.image),
      imageRatio,
      imagePosition: imagePosition
        ? imagePositionMap[imagePosition]
        : undefined,
      colorScheme: s.colorScheme,
      sectionBackground: s.sectionBackground || undefined,
      paddingTop: s.paddingTop,
      paddingBottom: s.paddingBottom,
    }),
    ...nativeRest(s),
  } as FaqCollapsibleSettings;
}

/* ── v2: flat accordion ────────────────────────────────────────────────── */
function toV2Ext(s: FaqSharedSettings): FaqAccordionSettings {
  // medium = h3, the look's original heading preset.
  const headingPresetMap: Record<string, TypePreset> = {
    small: TypePreset.H4,
    medium: TypePreset.H3,
    large: TypePreset.H2,
    xl: TypePreset.H1,
  };
  const sectionWidthMap: Record<string, "page-width" | "full-width"> = {
    page: "page-width",
    full: "full-width",
  };
  const items = configuredItems(s);
  const rows = items
    ? items.map((qa, i) => ({
        heading: qa.question,
        body: qa.answer,
        open_by_default: s.openFirstRow ? i === 0 : undefined,
      }))
    : s.openFirstRow === false
      ? V2_SAMPLE_ROWS.map((r) => ({ ...r, open_by_default: false }))
      : V2_SAMPLE_ROWS;
  const sectionWidth = opt(s.sectionWidth);
  return {
    ...compact({
      caption: s.caption,
      heading: s.heading ?? V2_SAMPLE_HEADING,
      heading_preset: s.headingSize
        ? headingPresetMap[s.headingSize]
        : undefined,
      heading_alignment: opt(s.headingAlignment),
      heading_color: s.headingColor || undefined,
      rows,
      icon: opt(s.iconStyle),
      dividers: s.dividers,
      divider_color: s.dividerColor || undefined,
      question_color: s.questionColor || undefined,
      answer_color: s.answerColor || undefined,
      color_scheme: s.colorScheme,
      section_background: s.sectionBackground || undefined,
      section_width: sectionWidth ? sectionWidthMap[sectionWidth] : undefined,
      "padding-block-start": s.paddingTop,
      "padding-block-end": s.paddingBottom,
    }),
    ...nativeRest(s),
  } as FaqAccordionSettings;
}

/* ── v3: animated single-open accordion ────────────────────────────────── */
function toV3Ext(s: FaqSharedSettings): FaqAnimatedSettings {
  // v3 heading sizes are small/medium/large (no xl in the source look).
  const headingSizeMap: Record<string, "small" | "medium" | "large"> = {
    small: "small",
    medium: "medium",
    large: "large",
    xl: "large",
  };
  const items = configuredItems(s);
  return {
    ...compact({
      heading: s.heading ?? V3_SAMPLE_HEADING,
      headingSize: s.headingSize ? headingSizeMap[s.headingSize] : undefined,
      faqs: items ?? V3_SAMPLE_ITEMS,
      caption: s.caption,
      headingAlignment: opt(s.headingAlignment),
      headingColor: s.headingColor || undefined,
      questionColor: s.questionColor || undefined,
      answerColor: s.answerColor || undefined,
      dividerColor: s.dividerColor || undefined,
      colorScheme: s.colorScheme,
      sectionBackground: s.sectionBackground || undefined,
      openFirstRow: s.openFirstRow,
      paddingTop: s.paddingTop,
      paddingBottom: s.paddingBottom,
    }),
    ...nativeRest(s),
  } as FaqAnimatedSettings;
}

/* ── shared semantics ──────────────────────────────────────────────────── */
function buildShared(s: FaqSharedSettings): FaqVMShared {
  const items = configuredItems(s);
  const imageSrc = src(s.image);
  return {
    caption: s.caption || undefined,
    heading:
      (s.heading ?? "") !== ""
        ? {
            text: (s.heading ?? "") as string,
            size: s.headingSize ?? "medium",
            color: s.headingColor || undefined,
            align: opt(s.headingAlignment) as NonNullable<
              FaqVMShared["heading"]
            >["align"],
          }
        : undefined,
    rows: items ?? SAMPLE_QA,
    behavior: { openFirstRow: !!s.openFirstRow },
    appearance: {
      colorScheme: s.colorScheme ?? "scheme-1",
      iconStyle: opt(s.iconStyle) as FaqVMShared["appearance"]["iconStyle"],
      dividers: s.dividers !== false,
      dividerColor: s.dividerColor || undefined,
      questionColor: s.questionColor || undefined,
      answerColor: s.answerColor || undefined,
      sectionBackground: s.sectionBackground || undefined,
    },
    layout: {
      rowStyle: opt(s.rowStyle) as FaqVMShared["layout"]["rowStyle"],
      sectionWidth: opt(
        s.sectionWidth
      ) as FaqVMShared["layout"]["sectionWidth"],
      image: imageSrc ? { src: imageSrc, alt: alt(s.image) } : undefined,
      imageRatio: opt(s.imageRatio) as FaqVMShared["layout"]["imageRatio"],
      imagePosition: opt(
        s.imagePosition
      ) as FaqVMShared["layout"]["imagePosition"],
      paddingTop: s.paddingTop,
      paddingBottom: s.paddingBottom,
    },
  };
}

/** The section's single logic entry — pure and server-safe. */
export function buildFaqVM(
  _data: FaqData | undefined, // no data source — kept for the uniform logic signature
  settings: FaqSharedSettings | undefined
): FaqVM {
  const s = settings ?? {};
  const variant = s.variant === "v2" || s.variant === "v3" ? s.variant : "v1";
  const shared = buildShared(s);
  if (variant === "v2") {
    return { variant, shared, v2: toV2Ext(s) };
  }
  if (variant === "v3") {
    return { variant, shared, v3: toV3Ext(s) };
  }
  return { variant, shared, v1: toV1Ext(s) };
}

/* ── useFaqLogic — the stateful seam (amendment A1) ────────────────────── */

/** What the hook hands a stateful variant to render from. */
export interface FaqLogic {
  /** Index of the open item, or null when everything is closed. */
  openIndex: number | null;
  isOpen: (index: number) => boolean;
  /** Open the item (closing the current one) or close it if already open. */
  toggle: (index: number) => void;
}

/**
 * Single-open accordion state. Client-only (v3 consumes it); the pure
 * builder above stays importable from server code — this hook is only
 * evaluated inside "use client" variants.
 */
export function useFaqLogic(vm: FaqVM): FaqLogic {
  const [openIndex, setOpenIndex] = useState<number | null>(
    vm.shared.behavior.openFirstRow ? 0 : null
  );
  const toggle = useCallback(
    (index: number) => setOpenIndex((prev) => (prev === index ? null : index)),
    []
  );
  return {
    openIndex,
    isOpen: (index: number) => openIndex === index,
    toggle,
  };
}
