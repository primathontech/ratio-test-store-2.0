import type React from "react";
import { PresetText } from "../../_shared/PresetText";
import { TypePreset } from "../../_shared/typography";
import { HeroTextBlock } from "../types";
import {
  TextPreset,
  TextWidth,
  TextCase,
  TextWrapOption,
  MaxWidthOption,
  LineHeightOption,
  LetterSpacingOption,
  CssVar,
  FONT_FAMILY,
  MAX_WIDTH_VALUES,
  LINE_HEIGHT_VALUES,
  LETTER_SPACING_VALUES,
  HEADING_TAGS,
  DEFAULTS,
} from "../constants";
import { spacing } from "../utils";

/**
 * Hero `text` content block — ports blocks/text.liquid.
 * Supports preset typography (h1–h6 / paragraph / rte) and a full custom
 * typography path (font, size, line-height, letter-spacing, case, wrap),
 * optional background, corner radius and per-side padding.
 */
export function TextBlock({ block }: { block: HeroTextBlock }) {
  const s = block.settings ?? {};
  const preset = (s.type_preset ?? TextPreset.Rte) as TextPreset;
  const Tag = (
    HEADING_TAGS.has(preset) ? preset : "div"
  ) as keyof JSX.IntrinsicElements;
  const isFill = s.width === TextWidth.Fill;

  const base: React.CSSProperties = {
    margin: 0,
    width: isFill ? TextWidth.Fill : TextWidth.Fit,
    maxWidth: MAX_WIDTH_VALUES[s.max_width ?? MaxWidthOption.Normal],
    textAlign: isFill
      ? (s.alignment as React.CSSProperties["textAlign"])
      : undefined,
    paddingTop: spacing(s["padding-block-start"]),
    paddingBottom: spacing(s["padding-block-end"]),
    paddingLeft: spacing(s["padding-inline-start"]),
    paddingRight: spacing(s["padding-inline-end"]),
  };

  if (s.background) {
    base.backgroundColor = s.background_color ?? "#00000026";
    base.borderRadius = `${s.corner_radius ?? 0}px`;
  }

  const isCustom = preset === TextPreset.Custom;

  // For the custom preset we supply the full typography; otherwise PresetText
  // applies the shared type-preset scale and we only add family/color here.
  const typography: React.CSSProperties = isCustom
    ? {
        fontFamily: s.font ?? FONT_FAMILY,
        fontSize: s.font_size || undefined,
        lineHeight:
          LINE_HEIGHT_VALUES[s.line_height ?? LineHeightOption.Normal],
        letterSpacing:
          LETTER_SPACING_VALUES[s.letter_spacing ?? LetterSpacingOption.Normal],
        textTransform: s.case === TextCase.Uppercase ? "uppercase" : undefined,
        whiteSpace: s.wrap === TextWrapOption.Nowrap ? "nowrap" : undefined,
        textWrap:
          s.wrap && s.wrap !== TextWrapOption.Nowrap ? s.wrap : undefined,
      }
    : { fontFamily: FONT_FAMILY };

  // Non-rte presets honour the color setting; rte inherits the scheme color
  // unless a color is explicitly set (lets the shared textColor field work).
  if (preset !== TextPreset.Rte) {
    typography.color = s.color ?? `var(${CssVar.Foreground})`;
  } else if (s.color) {
    typography.color = s.color;
  }

  return (
    <PresetText
      preset={isCustom ? TypePreset.Custom : (preset as unknown as TypePreset)}
      as={Tag}
      // Normalized test ids: heading-preset blocks are THE hero heading.
      testId={HEADING_TAGS.has(preset) ? "hero-heading" : "hero-text-block"}
      html={s.text ?? DEFAULTS.blockText}
      style={{ ...base, ...typography }}
    />
  );
}
