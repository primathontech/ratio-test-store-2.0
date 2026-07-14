/**
 * Hero logic — the section's single logic entry (PRD §5.1; amendment A1: pure
 * and server-safe, so v2 stays a server component; Hero has no state, hence no
 * useSectionLogic).
 *
 * buildHeroVM(data, settings) → HeroVM:
 *   - vm.shared    semantic, variant-agnostic resolution of the shared
 *                  editor-facing settings (contract.ts settingsSchema)
 *   - vm.v1/v2/v3  the selected variant's typed extension = its faithful
 *                  native settings interface (design decision D2/approach A),
 *                  built from the shared fields + native-key passthrough
 *                  (native values win over generated ones)
 *
 * Merchant forks can wrap this via widgets/_overrides.ts (logic-wrap override,
 * customization ladder rung 5) — see widgets/_resolve.ts.
 */
import type { HeroData } from "./V2/types";
import type {
  HeroSharedSettings,
  HeroVM,
  HeroVMShared,
  HeroCta,
  HeroMediaRef,
  HeroImage,
} from "./contract";
import type { ImageBannerSettings } from "./V1/types";
import type { HeroSettings as HeroV2NativeSettings } from "./V2/types";
import type { HeroVideoSettings } from "./V3/types";
import type { ShoppableHeroExt, ShoppableHeroProduct } from "./V4/types";
import {
  SAMPLE_MEDIA as V2_SAMPLE_MEDIA,
  SAMPLE_BLOCKS as V2_SAMPLE_BLOCKS,
  SAMPLE_SECTION as V2_SAMPLE_SECTION,
} from "./V2/sample-data";

/**
 * What the builder may hand the Hero widget as `data`:
 * v2 consumes an optional media fallback; v4 consumes an optional PRODUCTS
 * dataSource result (hotspot[i] binds to products[i]).
 */
export type HeroWidgetData = HeroData & {
  products?: ShoppableHeroProduct[];
  collection?: { products?: ShoppableHeroProduct[] } | null;
};

const SHARED_KEYS = [
  "variant",
  "colorScheme",
  "heading",
  "headingSize",
  "headingColor",
  "text",
  "textColor",
  "ctaLabel",
  "ctaHref",
  "secondaryCtaLabel",
  "secondaryCtaHref",
  "buttonStyle",
  "ctaBackground",
  "ctaTextColor",
  "image",
  "imageMobile",
  "videoId",
  "imageBehavior",
  "height",
  "mobileHeight",
  "sectionWidth",
  "overlayOpacity",
  "overlayColor",
  "overlayStyle",
  "align",
  "verticalPosition",
  "stackOnMobile",
  "showTextBox",
  "sectionBackground",
  "blurredReflection",
] as const;

const src = (v: HeroImage | string | undefined): string | undefined =>
  typeof v === "string" ? v || undefined : v?.src || undefined;
const alt = (v: HeroImage | string | undefined): string | undefined =>
  typeof v === "string" ? undefined : v?.alt || undefined;

/** Drop undefined values so variant-internal fallbacks still apply. */
const compact = (o: Record<string, unknown>) =>
  Object.fromEntries(Object.entries(o).filter(([, v]) => v !== undefined));

/** "default" (and empty) select values mean "keep the variant's own default". */
const opt = <T extends string>(v: T | undefined): T | undefined =>
  !v || v === "default" ? undefined : v;

/** hex (#rgb/#rrggbb) + 0..1 alpha → `rgb(r g b / a)`; falls back to black. */
const overlayRgb = (hex: string | undefined, alpha: number): string => {
  const m = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec((hex ?? "").trim());
  let r = 0;
  let g = 0;
  let b = 0;
  if (m) {
    const h =
      m[1].length === 3
        ? m[1]
            .split("")
            .map((c) => c + c)
            .join("")
        : m[1];
    r = parseInt(h.slice(0, 2), 16);
    g = parseInt(h.slice(2, 4), 16);
    b = parseInt(h.slice(4, 6), 16);
  }
  return `rgb(${r} ${g} ${b} / ${alpha})`;
};

const clampPct = (n: number) => Math.min(100, Math.max(0, n));

const nativeRest = (s: HeroSharedSettings) => {
  const rest: Record<string, unknown> = { ...s };
  for (const k of SHARED_KEYS) {
    delete rest[k];
  }
  return rest;
};

/* ── v1: image banner ──────────────────────────────────────────────────── */
function toV1Ext(s: HeroSharedSettings): ImageBannerSettings {
  const heightMap: Record<string, string> = {
    small: "small",
    medium: "medium",
    large: "large",
    full: "large",
  };
  // medium = h0, the variant's original heading size.
  const headingSizeMap: Record<string, string> = {
    small: "h1",
    medium: "h0",
    large: "hxl",
    xl: "hxxl",
  };
  const verticalPosition = opt(s.verticalPosition);
  // "solid" keeps the primary CTA solid (current default); outline/link both
  // map to v1's outline look (v1 has no text-link button style).
  const buttonStyle = opt(s.buttonStyle);
  const buttons =
    s.ctaLabel || s.secondaryCtaLabel
      ? [
          ...(s.ctaLabel
            ? [
                {
                  label: s.ctaLabel,
                  link: s.ctaHref ?? "#",
                  secondary: buttonStyle ? buttonStyle !== "solid" : false,
                },
              ]
            : []),
          ...(s.secondaryCtaLabel
            ? [
                {
                  label: s.secondaryCtaLabel,
                  link: s.secondaryCtaHref ?? "#",
                  secondary: true,
                },
              ]
            : []),
        ]
      : undefined;
  return {
    ...compact({
      colorScheme: s.colorScheme,
      heading: s.heading,
      headingSize: s.headingSize ? headingSizeMap[s.headingSize] : undefined,
      headingColor: s.headingColor || undefined,
      text: s.text,
      textColor: s.textColor || undefined,
      ctaBackground: s.ctaBackground || undefined,
      ctaTextColor: s.ctaTextColor || undefined,
      imageBehavior: opt(s.imageBehavior),
      showTextBox: s.showTextBox,
      image: src(s.image),
      imageAlt: alt(s.image),
      image2: src(s.imageMobile),
      image2Alt: alt(s.imageMobile),
      imageHeight: s.height ? heightMap[s.height] : undefined,
      imageOverlayOpacity: s.overlayOpacity,
      desktopContentAlignment: s.align,
      mobileContentAlignment: s.align,
      // Combined 9-position grid: shared vertical × shared horizontal.
      desktopContentPosition: verticalPosition
        ? `${verticalPosition}-${s.align ?? "center"}`
        : undefined,
      stackImagesOnMobile: s.stackOnMobile,
      buttons,
    }),
    ...nativeRest(s),
  } as unknown as ImageBannerSettings;
}

/* ── v2: media/block hero ──────────────────────────────────────────────── */
function toV2Ext(s: HeroSharedSettings, data?: HeroData): HeroV2NativeSettings {
  const heightMap: Record<string, string> = {
    small: "small",
    medium: "medium",
    large: "large",
    full: "full-screen",
  };
  const alignMap: Record<string, string> = {
    left: "flex-start",
    center: "center",
    right: "flex-end",
  };
  const verticalMap: Record<string, string> = {
    top: "flex-start",
    middle: "center",
    bottom: "flex-end",
  };
  // medium = h1, the size the generated heading block always used. large/xl go
  // through the text block's custom-typography path (no h0/hxl presets in v2).
  const headingPresetMap: Record<string, Record<string, unknown>> = {
    small: { type_preset: "h2" },
    medium: { type_preset: "h1" },
    large: { type_preset: "custom", font_size: "56px" },
    xl: { type_preset: "custom", font_size: "72px" },
  };
  const verticalPosition = opt(s.verticalPosition);
  const rest = nativeRest(s);
  const media =
    rest.media ??
    data?.media ??
    (src(s.image) || src(s.imageMobile)
      ? [
          {
            desktopImage: src(s.image) ?? "",
            mobileImage: src(s.imageMobile) ?? "",
            desktopVideo: s.videoId ?? "",
            alt: alt(s.image) ?? s.heading ?? "",
          },
        ]
      : undefined);
  const blocks =
    rest.blocks ??
    (s.heading || s.text || s.ctaLabel || s.secondaryCtaLabel
      ? [
          ...(s.heading
            ? [
                {
                  type: "text",
                  text: s.heading,
                  ...(headingPresetMap[s.headingSize ?? "medium"] ??
                    headingPresetMap.medium),
                  ...(s.headingColor ? { color: s.headingColor } : {}),
                },
              ]
            : []),
          ...(s.text
            ? [
                {
                  type: "text",
                  text: s.text,
                  type_preset: "rte",
                  ...(s.textColor ? { color: s.textColor } : {}),
                },
              ]
            : []),
          ...(s.ctaLabel
            ? [
                {
                  type: "button",
                  label: s.ctaLabel,
                  link: s.ctaHref ?? "#",
                  // Outline (button-secondary) is the source demo's default look.
                  style_class:
                    opt(s.buttonStyle) === "solid"
                      ? "button"
                      : opt(s.buttonStyle) === "link"
                        ? "link"
                        : "button-secondary",
                },
              ]
            : []),
          ...(s.secondaryCtaLabel
            ? [
                {
                  type: "button",
                  label: s.secondaryCtaLabel,
                  link: s.secondaryCtaHref ?? "#",
                  style_class: "link",
                },
              ]
            : []),
        ]
      : undefined);
  delete rest.media;
  delete rest.blocks;
  // Sample fall-through (settings → data → sample): with NO media and NO
  // content the section must look GREAT (fresh palette add / AI
  // instantiation), not render an empty grey box. When the section is
  // entirely unconfigured, the curated section-level styling (large height,
  // gradient scrim, centered white content, blurred reflection) applies as
  // the lowest-precedence base — any real setting wins over it.
  const unconfigured =
    !media && (!blocks || (blocks as unknown[]).length === 0);
  const finalMedia = media ?? V2_SAMPLE_MEDIA;
  const finalBlocks = unconfigured ? V2_SAMPLE_BLOCKS : blocks;
  const overlayStyle = opt(s.overlayStyle);
  const sectionWidthMap: Record<string, string> = {
    page: "page-width",
    full: "full-width",
  };
  return {
    ...(unconfigured ? V2_SAMPLE_SECTION : {}),
    ...compact({
      color_scheme: s.colorScheme,
      section_background: s.sectionBackground || undefined,
      cta_background: s.ctaBackground || undefined,
      cta_text_color: s.ctaTextColor || undefined,
      section_width: opt(s.sectionWidth)
        ? sectionWidthMap[s.sectionWidth!]
        : undefined,
      overlay_style:
        overlayStyle && overlayStyle !== "solid" ? "gradient" : undefined,
      gradient_direction:
        overlayStyle === "gradient-up"
          ? "to top"
          : overlayStyle === "gradient-down"
            ? "to bottom"
            : undefined,
      blurred_reflection: s.blurredReflection || undefined,
      section_height: s.height ? heightMap[s.height] : undefined,
      // Default content_direction is COLUMN, where the column-specific
      // alignment keys apply — set both pairs so align/verticalPosition work
      // whichever direction the template picks.
      horizontal_alignment: s.align ? alignMap[s.align] : undefined,
      horizontal_alignment_flex_direction_column: s.align
        ? alignMap[s.align]
        : undefined,
      vertical_alignment: verticalPosition
        ? verticalMap[verticalPosition]
        : undefined,
      vertical_alignment_flex_direction_column: verticalPosition
        ? verticalMap[verticalPosition]
        : undefined,
      toggle_overlay: s.overlayOpacity ? true : undefined,
      overlay_color: s.overlayOpacity
        ? overlayRgb(s.overlayColor, clampPct(s.overlayOpacity) / 100)
        : undefined,
      stack_media_on_mobile: s.stackOnMobile,
      media: finalMedia,
      blocks: finalBlocks,
    }),
    ...rest,
  } as unknown as HeroV2NativeSettings;
}

/* ── v3: ambient video hero ────────────────────────────────────────────── */
function toV3Ext(s: HeroSharedSettings): HeroVideoSettings {
  const heightMap: Record<string, string | number> = {
    small: 450,
    medium: 550,
    large: 650,
    full: "full",
  };
  const mobileHeightMap: Record<string, string | number> = {
    small: 250,
    medium: 300,
    large: 400,
    full: "full",
  };
  // medium = 60px, the variant's original heading size.
  const headingSizeMap: Record<string, number> = {
    small: 40,
    medium: 60,
    large: 80,
    xl: 100,
  };
  const verticalPosition = opt(s.verticalPosition);
  const mobileHeight = opt(s.mobileHeight);
  // Native textAlignment is "<middle|bottom>-<left|center|right>" — a bare
  // "left" would be parsed as a VERTICAL part and silently render centered.
  const textAlignment =
    s.align || verticalPosition
      ? `${verticalPosition === "bottom" ? "bottom" : "middle"}-${s.align ?? "center"}`
      : undefined;
  return {
    ...compact({
      heading: s.heading,
      headingSize: s.headingSize ? headingSizeMap[s.headingSize] : undefined,
      headingColor: s.headingColor || undefined,
      subtitle: s.text,
      subtitleColor: s.textColor || undefined,
      ctaText: s.ctaLabel,
      ctaHref: s.ctaHref,
      ctaBackground: s.ctaBackground || undefined,
      ctaTextColor: s.ctaTextColor || undefined,
      sectionBackground: s.sectionBackground || undefined,
      backgroundVideoId: s.videoId,
      overlayOpacity: s.overlayOpacity,
      textAlignment,
      desktopHeight: s.height ? heightMap[s.height] : undefined,
      mobileHeight: mobileHeight ? mobileHeightMap[mobileHeight] : undefined,
    }),
    ...nativeRest(s),
  } as unknown as HeroVideoSettings;
}

/* ── v4: shoppable hero ────────────────────────────────────────────────── */
function toV4Ext(
  s: HeroSharedSettings,
  data?: HeroWidgetData
): ShoppableHeroExt {
  // v4 heading sizes are small/medium/large (no xl in the source look).
  const headingSizeMap: Record<string, string> = {
    small: "small",
    medium: "medium",
    large: "large",
    xl: "large",
  };
  const verticalPosition = opt(s.verticalPosition);
  // Native textPosition is "{top|middle|bottom}-{left|center|right}".
  const textPosition =
    s.align || verticalPosition
      ? `${verticalPosition ?? "bottom"}-${s.align ?? "left"}`
      : undefined;
  const image = src(s.image)
    ? { src: src(s.image)!, alt: alt(s.image) }
    : undefined;
  const mobileImage = src(s.imageMobile)
    ? { src: src(s.imageMobile)!, alt: alt(s.imageMobile) }
    : undefined;
  return {
    ...compact({
      heading: s.heading,
      subheading: s.text,
      ctaText: s.ctaLabel,
      ctaHref: s.ctaHref,
      image,
      mobileImage,
      headingSize: s.headingSize ? headingSizeMap[s.headingSize] : undefined,
      // Desktop text overlays the photo; mobile text stacks below on white.
      overlayTextColor: s.headingColor || undefined,
      mobileTextColor: s.textColor || undefined,
      ctaBackground: s.ctaBackground || undefined,
      ctaTextColor: s.ctaTextColor || undefined,
      overlayOpacity: s.overlayOpacity,
      textAlignment: s.align,
      textPosition,
      products: data?.products ?? data?.collection?.products ?? undefined,
    }),
    ...nativeRest(s),
  } as unknown as ShoppableHeroExt;
}

/* ── shared semantics ──────────────────────────────────────────────────── */
const ref = (v: HeroSharedSettings["image"]): HeroMediaRef | undefined => {
  const source = src(v);
  return source ? { src: source, alt: alt(v) } : undefined;
};

function buildShared(s: HeroSharedSettings): HeroVMShared {
  const ctas: HeroCta[] = [
    ...(s.ctaLabel
      ? [
          {
            label: s.ctaLabel,
            href: s.ctaHref ?? "#",
            role: "primary" as const,
            style: opt(s.buttonStyle) as HeroCta["style"],
            background: s.ctaBackground || undefined,
            textColor: s.ctaTextColor || undefined,
          },
        ]
      : []),
    ...(s.secondaryCtaLabel
      ? [
          {
            label: s.secondaryCtaLabel,
            href: s.secondaryCtaHref ?? "#",
            role: "secondary" as const,
          },
        ]
      : []),
  ];
  return {
    heading: s.heading
      ? {
          text: s.heading,
          size: s.headingSize ?? "medium",
          color: s.headingColor || undefined,
        }
      : undefined,
    text: s.text
      ? { value: s.text, color: s.textColor || undefined }
      : undefined,
    ctas,
    media: {
      desktop: ref(s.image),
      mobile: ref(s.imageMobile),
      videoId: s.videoId || undefined,
    },
    layout: {
      height: s.height ?? "large",
      mobileHeight: opt(
        s.mobileHeight
      ) as HeroVMShared["layout"]["mobileHeight"],
      align: s.align ?? "center",
      verticalPosition: opt(
        s.verticalPosition
      ) as HeroVMShared["layout"]["verticalPosition"],
      stackOnMobile: !!s.stackOnMobile,
      sectionWidth: opt(
        s.sectionWidth
      ) as HeroVMShared["layout"]["sectionWidth"],
    },
    appearance: {
      colorScheme: s.colorScheme ?? "scheme-1",
      sectionBackground: s.sectionBackground || undefined,
      overlay: s.overlayOpacity
        ? {
            opacity: clampPct(s.overlayOpacity),
            color: s.overlayColor || "#000000",
            style: (opt(s.overlayStyle) ?? "solid") as NonNullable<
              HeroVMShared["appearance"]["overlay"]
            >["style"],
          }
        : undefined,
    },
  };
}

/** The section's single logic entry — pure and server-safe. */
export function buildHeroVM(
  data: HeroWidgetData | undefined,
  settings: HeroSharedSettings | undefined
): HeroVM {
  const s = settings ?? {};
  const variant =
    s.variant === "v2" || s.variant === "v3" || s.variant === "v4"
      ? s.variant
      : "v1";
  const shared = buildShared(s);
  if (variant === "v2") {
    return { variant, shared, v2: toV2Ext(s, data) };
  }
  if (variant === "v3") {
    return { variant, shared, v3: toV3Ext(s) };
  }
  if (variant === "v4") {
    return { variant, shared, v4: toV4Ext(s, data) };
  }
  return { variant, shared, v1: toV1Ext(s) };
}
