import type React from "react";
import {
  ResolvedMedia,
  ContentDirection,
  HorizontalAlignment,
  VerticalAlignment,
  SectionHeight,
  CssVar,
  SECTION_HEIGHT_VALUES,
  FULL_SCREEN_HEIGHT,
  AUTO_HEIGHT,
  SPACING_SCALE_THRESHOLD_PX,
  DEFAULTS,
} from "./constants";
import type { HeroSettings, HeroMediaItem } from "./types";

/* ------------------------------------------------------------------ */
/* Spacing (mirrors snippets/spacing-style.liquid)                     */
/* ------------------------------------------------------------------ */

export function spacing(value: number | undefined): string | undefined {
  if (value === undefined) {
    return undefined;
  }
  if (value > SPACING_SCALE_THRESHOLD_PX) {
    return `max(${SPACING_SCALE_THRESHOLD_PX}px, calc(var(${CssVar.SpacingScale}, 1) * ${value}px))`;
  }
  return `${value}px`;
}

/* ------------------------------------------------------------------ */
/* Media resolution                                                    */
/* Each item → one slot with a resolved kind (image/video) plus the    */
/* desktop source and an optional distinct mobile source.              */
/* ------------------------------------------------------------------ */

export interface ResolvedSlot {
  kind: ResolvedMedia;
  /** Source shown on desktop (and on mobile when no distinct mobile). */
  desktopSrc: string;
  /** Distinct mobile source, or undefined when it reuses the desktop. */
  mobileSrc?: string;
  alt: string;
}

export interface ResolvedHeroMedia {
  slots: ResolvedSlot[];
  mediaCount: number;
  hasOnlyVideo: boolean;
  /** Desktop image sources, used for the blurred reflection. */
  reflectionImages: string[];
}

function resolveItem(item: HeroMediaItem): ResolvedSlot | null {
  const isVideo = Boolean(item.desktopVideo || item.mobileVideo);

  if (isVideo) {
    const desktopSrc = item.desktopVideo || item.mobileVideo || "";
    const mobileSrc =
      item.mobileVideo && item.mobileVideo !== desktopSrc
        ? item.mobileVideo
        : undefined;
    if (!desktopSrc) {
      return null;
    }
    return {
      kind: ResolvedMedia.Video,
      desktopSrc,
      mobileSrc,
      alt: item.alt ?? "",
    };
  }

  const desktopSrc = item.desktopImage || item.mobileImage || "";
  const mobileSrc =
    item.mobileImage && item.mobileImage !== desktopSrc
      ? item.mobileImage
      : undefined;
  if (!desktopSrc) {
    return null;
  }
  return {
    kind: ResolvedMedia.Image,
    desktopSrc,
    mobileSrc,
    alt: item.alt ?? "",
  };
}

export function resolveHeroMedia(s: HeroSettings): ResolvedHeroMedia {
  // The data.media fallback is folded into the extension by logic.ts.
  const items = (s.media ?? []) as HeroMediaItem[];
  const slots = items
    .map(resolveItem)
    .filter((slot): slot is ResolvedSlot => slot !== null);

  const mediaCount = slots.length;
  const hasOnlyVideo =
    mediaCount > 0 && slots.every((slot) => slot.kind === ResolvedMedia.Video);
  const reflectionImages = slots
    .filter((slot) => slot.kind === ResolvedMedia.Image)
    .map((slot) => slot.desktopSrc);

  return { slots, mediaCount, hasOnlyVideo, reflectionImages };
}

/* ------------------------------------------------------------------ */
/* Content alignment (mirrors layout-panel-style.liquid)               */
/* ------------------------------------------------------------------ */

export interface HeroAlignment {
  flexDirection: "row" | "column";
  justifyContent: string;
  alignItems: string;
}

export function resolveAlignment(s: HeroSettings): HeroAlignment {
  const isRow =
    (s.content_direction ?? ContentDirection.Column) === ContentDirection.Row;

  let horizontal: string;
  let vertical: string;
  if (isRow) {
    horizontal = s.horizontal_alignment ?? HorizontalAlignment.Start;
    vertical = s.vertical_alignment ?? VerticalAlignment.Center;
    if (s.align_baseline && vertical === VerticalAlignment.End) {
      vertical = VerticalAlignment.Baseline;
    }
  } else {
    horizontal =
      s.horizontal_alignment_flex_direction_column ?? HorizontalAlignment.Start;
    vertical =
      s.vertical_alignment_flex_direction_column ?? VerticalAlignment.Center;
  }

  // Column: block axis is vertical → justify = vertical, align = horizontal.
  // Row: inline axis is horizontal → justify = horizontal, align = vertical.
  // `baseline` is only ever assigned to the cross axis (alignItems) in row mode,
  // where it is a valid value — so it must be kept, not reverted.
  const justifyContent = isRow ? horizontal : vertical;
  const alignItems = isRow ? vertical : horizontal;

  return {
    flexDirection: (isRow ? ContentDirection.Row : ContentDirection.Column) as
      "row" | "column",
    justifyContent,
    alignItems,
  };
}

/* ------------------------------------------------------------------ */
/* Section height → inline CSS variables                               */
/* The responsive breakpoints live in style.css (.cs-hero-v2); here we */
/* only emit the per-breakpoint values as custom properties.           */
/* ------------------------------------------------------------------ */

export function heightVars(s: HeroSettings): React.CSSProperties {
  const preset = s.section_height ?? SectionHeight.Medium;

  if (preset === SectionHeight.Auto) {
    return { [CssVar.HeroMinHeight]: AUTO_HEIGHT } as React.CSSProperties;
  }
  if (preset === SectionHeight.FullScreen) {
    return {
      [CssVar.HeroMinHeight]: FULL_SCREEN_HEIGHT,
    } as React.CSSProperties;
  }
  if (preset === SectionHeight.Custom) {
    return {
      [CssVar.HeroMinHeight]: `${s.section_height_custom ?? DEFAULTS.customHeight}svh`,
    } as React.CSSProperties;
  }

  const [base, md, lg] =
    SECTION_HEIGHT_VALUES[
      preset as SectionHeight.Small | SectionHeight.Medium | SectionHeight.Large
    ];
  return {
    [CssVar.HeroMinHeight]: base,
    [CssVar.HeroMinHeightMd]: md,
    [CssVar.HeroMinHeightLg]: lg,
  } as React.CSSProperties;
}
