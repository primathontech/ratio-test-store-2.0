import type { CSSProperties } from "react";

/* ------------------------------------------------------------------ */
/* Type presets — a generic `type_preset` concept.                     */
/* The font sizes live in ONE place: the --font-{preset}--size CSS     */
/* tokens in globals.css (the global type scale). This module is the   */
/* JS-side counterpart of a typography-style helper: given a preset it */
/* returns the matching style + semantic tag, and it exposes a         */
/* ready-made editor select field reusable by every widget.            */
/* ------------------------------------------------------------------ */

export enum TypePreset {
  /** Rich text — inherits body size + scheme color (no forced color). */
  Rte = "rte",
  /** Body paragraph. */
  Paragraph = "paragraph",
  H1 = "h1",
  H2 = "h2",
  H3 = "h3",
  H4 = "h4",
  H5 = "h5",
  H6 = "h6",
  /** Caller supplies its own font/size/line-height/etc. */
  Custom = "custom",
}

/** Editor select options for a type-preset field. Reuse across widgets. */
export const TYPE_PRESET_OPTIONS: ReadonlyArray<{
  value: TypePreset;
  label: string;
}> = [
  { value: TypePreset.Rte, label: "Rich text" },
  { value: TypePreset.Paragraph, label: "Paragraph" },
  { value: TypePreset.H1, label: "Heading 1 (72px)" },
  { value: TypePreset.H2, label: "Heading 2 (48px)" },
  { value: TypePreset.H3, label: "Heading 3 (32px)" },
  { value: TypePreset.H4, label: "Heading 4 (24px)" },
  { value: TypePreset.H5, label: "Heading 5 (18px)" },
  { value: TypePreset.H6, label: "Heading 6 (16px)" },
];

// NOTE: the editor `typePresetField` builder lives in
// `@/editor-integration/schema-fields` (it consumes TYPE_PRESET_OPTIONS above).

const HEADING_PRESETS: ReadonlySet<TypePreset> = new Set([
  TypePreset.H1,
  TypePreset.H2,
  TypePreset.H3,
  TypePreset.H4,
  TypePreset.H5,
  TypePreset.H6,
]);

export function isHeadingPreset(preset?: TypePreset): boolean {
  return !!preset && HEADING_PRESETS.has(preset);
}

/** The semantic HTML tag a preset maps to (h1..h6 / p / div). */
export function typePresetTag(
  preset?: TypePreset
): keyof JSX.IntrinsicElements {
  if (isHeadingPreset(preset)) {
    return preset as keyof JSX.IntrinsicElements;
  }
  if (preset === TypePreset.Paragraph) {
    return "p";
  }
  return "div";
}

const HEADING_SIZE_VAR: Record<string, string> = {
  [TypePreset.H1]: "var(--font-h1--size, 72px)",
  [TypePreset.H2]: "var(--font-h2--size, 48px)",
  [TypePreset.H3]: "var(--font-h3--size, 32px)",
  [TypePreset.H4]: "var(--font-h4--size, 24px)",
  [TypePreset.H5]: "var(--font-h5--size, 18px)",
  [TypePreset.H6]: "var(--font-h6--size, 16px)",
};

/**
 * Inline style for a preset. Font size comes from the global token; family +
 * weight inherit from the rendered tag's base styles unless the preset forces
 * them. `custom` returns {} so the caller can supply its own typography.
 */
export function typePresetStyle(preset?: TypePreset): CSSProperties {
  if (isHeadingPreset(preset)) {
    return {
      fontSize: HEADING_SIZE_VAR[preset as TypePreset],
      lineHeight: "var(--font-heading--line-height, 1.1)",
    };
  }
  if (preset === TypePreset.Paragraph || preset === TypePreset.Rte) {
    return {
      fontSize: "var(--font-paragraph--size, 16px)",
      lineHeight: "var(--font-body--line-height, 1.6)",
    };
  }
  return {};
}
