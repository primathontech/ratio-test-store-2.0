import type { ImageBannerSettings } from "./V1/types";
import type { HeroSettings as HeroV2Settings } from "./V2/types";
import type { HeroVideoSettings } from "./V3/types";
import type { ShoppableHeroExt } from "./V4/types";

/**
 * Settings-coverage maps — the COMPILER-ENFORCED parity gate.
 *
 * Every native settings key of every variant must be consciously classified:
 *   - "shared"      driven by a shared contract.ts field via logic.ts
 *   - "passthrough" not in the sidebar; reachable via native-key passthrough
 *                   (templates / advanced editor JSON); native wins over
 *                   generated values
 *   - "generated"   derived by the mapper; no direct control
 *
 * `satisfies Record<keyof <VariantSettings>, SettingsCoverage>` makes tsc fail
 * the moment a variant gains a settings key that nobody classified — the
 * silent editor-capability gap this file exists to prevent. tsc runs in the
 * pre-commit hooks, so an unclassified key cannot be committed.
 *
 * When you add a native key: add it to the variant's types.ts, classify it
 * here, and if "shared", wire it in contract.ts + mapSettings.ts.
 */
export type SettingsCoverage = "shared" | "passthrough" | "generated";

/* ── V1 (Image Banner) ─────────────────────────────────────────────────── */
export const V1_COVERAGE = {
  variant: "shared",
  image: "shared", // image (src)
  imageAlt: "shared", // image (alt)
  // v1 has no mobile image; the shared imageMobile drives the SECOND half.
  image2: "shared",
  image2Alt: "shared",
  imageHeight: "shared", // height (full → large; v1 has no full-screen)
  imageBehavior: "shared", // default = variant's own "fixed"
  imageOverlayOpacity: "shared", // overlayOpacity
  desktopContentPosition: "shared", // verticalPosition × align (9-pos grid)
  desktopContentAlignment: "shared", // align
  showTextBox: "shared",
  showTextBelow: "passthrough", // content below media on mobile
  stackImagesOnMobile: "shared", // stackOnMobile
  mobileContentAlignment: "shared", // align (one control, desktop + mobile)
  colorScheme: "shared",
  heading: "shared",
  headingSize: "shared", // small/medium/large/xl → h1/h0/hxl/hxxl
  headingColor: "shared", // library extension (source hardcoded white)
  text: "shared",
  textStyle: "passthrough", // body / subtitle / caption
  textColor: "shared", // library extension (source hardcoded white @ 75%)
  textSize: "shared", // library extension — text scale override
  headingCase: "shared", // library extension
  headingSpacing: "shared", // library extension
  contentMaxWidth: "shared", // contentWidth (narrow/page/full → px)
  ctaBackground: "shared", // library extension (solid bg / outline ring)
  ctaTextColor: "shared", // library extension
  // ctaLabel/ctaHref + secondaryCta*; primary solid vs outline via buttonStyle
  buttons: "shared",
} satisfies Record<keyof ImageBannerSettings, SettingsCoverage>;

/* ── V2 (Media Hero) ───────────────────────────────────────────────────── */
export const V2_COVERAGE = {
  variant: "shared",
  // One slot generated from image/imageMobile/videoId; full multi-slot array
  // via passthrough (native wins).
  media: "shared",
  stack_media_on_mobile: "shared", // stackOnMobile
  link: "passthrough", // whole-hero link
  open_in_new_tab: "passthrough",
  content_direction: "passthrough", // column (default) / row
  vertical_on_mobile: "passthrough", // row direction only
  horizontal_alignment: "shared", // align (row direction)
  vertical_alignment: "shared", // verticalPosition (row direction)
  align_baseline: "passthrough", // row + bottom only
  // Column direction is the default — the mapper sets BOTH direction pairs.
  horizontal_alignment_flex_direction_column: "shared",
  vertical_alignment_flex_direction_column: "shared",
  gap: "passthrough", // px between blocks
  section_width: "shared", // contentWidth (page/full; legacy sectionWidth alias)
  content_max_width: "shared", // contentWidth narrow → 734px cap
  section_height: "shared", // height (full → full-screen)
  section_height_custom: "passthrough", // svh, with section_height=custom
  color_scheme: "shared", // colorScheme
  // Library extensions — root CSS-var overrides that win over scheme vars.
  section_background: "shared",
  cta_background: "shared",
  cta_text_color: "shared",
  // Section-level override of ALL button blocks; the shared buttonStyle
  // drives the GENERATED primary block's style_class instead.
  button_style: "passthrough",
  toggle_overlay: "generated", // true when overlayOpacity > 0
  overlay_color: "shared", // overlayColor + overlayOpacity → rgb(r g b / a)
  overlay_style: "shared", // overlayStyle (gradient-up/down → gradient)
  gradient_direction: "shared", // overlayStyle (to top / to bottom)
  blurred_reflection: "shared", // blurredReflection
  reflection_opacity: "passthrough", // with blurred_reflection (default 100)
  "padding-block-start": "passthrough",
  "padding-block-end": "passthrough",
  // Generated from heading(+size+color)/text(+color)/CTAs — primary style via
  // buttonStyle (default button-secondary, the source look), secondary =
  // link; full array via passthrough (native wins).
  blocks: "shared",
} satisfies Record<keyof HeroV2Settings, SettingsCoverage>;

/* ── V3 (Video Hero) ───────────────────────────────────────────────────── */
export const V3_COVERAGE = {
  variant: "shared",
  heading: "shared",
  headingSize: "shared", // small/medium/large/xl → 40/60/80/100 px
  headingColor: "shared", // library extension (source hardcoded white)
  subtitle: "shared", // text
  subtitleColor: "shared", // textColor — library extension
  ctaText: "shared", // ctaLabel
  ctaHref: "shared",
  backgroundVideoId: "shared", // videoId
  videoTitle: "passthrough", // iframe a11y title
  // verticalPosition × align (top → middle; v3 has no top slot).
  textAlignment: "shared",
  overlayOpacity: "shared",
  desktopHeight: "shared", // height (450/550/650/full)
  mobileHeight: "shared", // mobileHeight (250/300/400/full)
  ctaBackground: "shared", // v3 ignores colorScheme — own colors
  ctaTextColor: "shared",
  sectionBackground: "shared",
  textSize: "shared", // library extension — subtitle scale override
  headingCase: "shared", // library extension
  headingSpacing: "shared", // library extension
  contentMaxWidth: "shared", // contentWidth (narrow/page/full → px)
} satisfies Record<keyof HeroVideoSettings, SettingsCoverage>;

/* ── V4 (Shoppable Hero) ───────────────────────────────────────────────── */
export const V4_COVERAGE = {
  variant: "shared",
  heading: "shared",
  subheading: "shared", // text
  ctaText: "shared", // ctaLabel
  ctaHref: "shared",
  image: "shared", // image (desktop landscape)
  mobileImage: "shared", // imageMobile (dedicated portrait crop)
  hotspots: "passthrough", // objectArray — template/editor JSON drives it
  hotspotColor: "passthrough",
  hotspotTextColor: "passthrough",
  ctaBackground: "shared",
  ctaTextColor: "shared",
  overlayTextColor: "shared", // headingColor (desktop overlay text)
  mobileTextColor: "shared", // textColor (mobile stacked text)
  preheading: "passthrough", // eyebrow line — v4-only
  headingSize: "shared", // small/medium/large (xl → large)
  overlayOpacity: "shared",
  textAlignment: "shared", // align
  textPosition: "shared", // verticalPosition × align (default bottom-left)
  hotspotIconStyle: "passthrough", // plus/dot/tag/bag
  textSize: "shared", // library extension — subheading scale override
  headingCase: "shared", // library extension
  headingSpacing: "shared", // library extension
  contentMaxWidth: "shared", // contentWidth (narrow/page/full → px)
  products: "generated", // folded from the data layer (PRODUCTS dataSource)
} satisfies Record<keyof ShoppableHeroExt, SettingsCoverage>;
