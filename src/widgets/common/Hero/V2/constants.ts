/* ================================================================== */
/* Enums — values mirror the source `hero` schema verbatim.            */
/* ================================================================== */

export enum ResolvedMedia {
  Image = "image",
  Video = "video",
  None = "none",
}

export enum ContentDirection {
  Column = "column",
  Row = "row",
}

export enum HorizontalAlignment {
  Start = "flex-start",
  Center = "center",
  End = "flex-end",
  SpaceBetween = "space-between",
}

export enum VerticalAlignment {
  Start = "flex-start",
  Center = "center",
  End = "flex-end",
  SpaceBetween = "space-between",
  Baseline = "last baseline",
}

export enum SectionWidth {
  Page = "page-width",
  Full = "full-width",
}

export enum SectionHeight {
  Auto = "auto",
  Small = "small",
  Medium = "medium",
  Large = "large",
  FullScreen = "full-screen",
  Custom = "custom",
}

export enum OverlayStyle {
  Solid = "solid",
  Gradient = "gradient",
}

export enum GradientDirection {
  ToTop = "to top",
  ToBottom = "to bottom",
}

export enum ColorSchemeId {
  Scheme1 = "scheme-1",
  Scheme2 = "scheme-2",
  Scheme3 = "scheme-3",
  Scheme4 = "scheme-4",
  Scheme5 = "scheme-5",
}

export enum BlockType {
  Text = "text",
  Button = "button",
}

export enum TextPreset {
  Rte = "rte",
  Paragraph = "paragraph",
  H1 = "h1",
  H2 = "h2",
  H3 = "h3",
  H4 = "h4",
  H5 = "h5",
  H6 = "h6",
  Custom = "custom",
}

export enum TextWidth {
  Fit = "fit-content",
  Fill = "100%",
}

export enum MaxWidthOption {
  Narrow = "narrow",
  Normal = "normal",
  None = "none",
}

export enum LineHeightOption {
  Tight = "tight",
  Normal = "normal",
  Loose = "loose",
}

export enum LetterSpacingOption {
  Tight = "tight",
  Normal = "normal",
  Loose = "loose",
}

export enum TextCase {
  None = "none",
  Uppercase = "uppercase",
}

export enum TextWrapOption {
  Pretty = "pretty",
  Balance = "balance",
  Nowrap = "nowrap",
}

export enum ButtonStyle {
  Primary = "button",
  Secondary = "button-secondary",
  Link = "link",
}

export enum ButtonWidth {
  Fit = "fit-content",
  Custom = "custom",
}

/* ================================================================== */
/* CSS custom-property names used by the hero (kept in one place).     */
/* ================================================================== */

export const CssVar = {
  Background: "--color-background",
  Foreground: "--color-foreground",
  ForegroundHeading: "--color-foreground-heading",
  Primary: "--color-primary",
  BlurOpacity: "--blur-opacity",
  HeroMinHeight: "--hero-min-height",
  HeroMinHeightMd: "--hero-min-height-md",
  HeroMinHeightLg: "--hero-min-height-lg",
  HeroCols: "--hero-cols",
  SpacingScale: "--spacing-scale",
  PageWidth: "--normal-page-width",
  FontInter: "--font-inter",
} as const;

/* ================================================================== */
/* Color schemes — maps scheme-N → resolved colors.                    */
/* ================================================================== */

// Scheme → generic `--color-*` mapping is shared across widgets (base colors,
// foreground-heading, primary, muted, border, and button tokens) so the hero
// resolves the same complete set every other section does.
export { schemeColorVars } from "../_shared/scheme-vars";

/* ================================================================== */
/* Section heights — [base, ≥40em, ≥60em] mirroring                    */
/* theme-styles-variables.liquid.                                      */
/* ================================================================== */

export type ResponsiveHeight = readonly [string, string, string];

export const SECTION_HEIGHT_VALUES: Record<
  SectionHeight.Small | SectionHeight.Medium | SectionHeight.Large,
  ResponsiveHeight
> = {
  [SectionHeight.Small]: ["15rem", "40svh", "50svh"],
  [SectionHeight.Medium]: ["25rem", "55svh", "65svh"],
  [SectionHeight.Large]: ["35rem", "70svh", "80svh"],
};

export const FULL_SCREEN_HEIGHT = "100svh";
export const AUTO_HEIGHT = "auto";

/* ================================================================== */
/* Breakpoints & scaling                                               */
/* ================================================================== */

export const MOBILE_MAX_WIDTH_PX = 749;
export const TABLET_MIN_EM = 40;
export const DESKTOP_MIN_EM = 60;
export const SPACING_SCALE_THRESHOLD_PX = 20;

/* ================================================================== */
/* Typography                                                          */
/* ================================================================== */

export const FONT_FAMILY = `var(${CssVar.FontInter}, Inter), sans-serif`;

/* Typography presets are handled by the shared <PresetText> component
   (_shared/PresetText → _shared/typography → global --font-*--size tokens).
   Hero's TextBlock renders through it, so no per-widget preset map is needed. */

export const MAX_WIDTH_VALUES: Record<MaxWidthOption, string> = {
  [MaxWidthOption.Narrow]: "28rem",
  [MaxWidthOption.Normal]: "42rem",
  [MaxWidthOption.None]: "none",
};

export const LINE_HEIGHT_VALUES: Record<LineHeightOption, number> = {
  [LineHeightOption.Tight]: 1.1,
  [LineHeightOption.Normal]: 1.4,
  [LineHeightOption.Loose]: 1.8,
};

export const LETTER_SPACING_VALUES: Record<LetterSpacingOption, string> = {
  [LetterSpacingOption.Tight]: "-0.01em",
  [LetterSpacingOption.Normal]: "normal",
  [LetterSpacingOption.Loose]: "0.06em",
};

/** Heading preset → semantic tag. */
export const HEADING_TAGS: ReadonlySet<TextPreset> = new Set([
  TextPreset.H1,
  TextPreset.H2,
  TextPreset.H3,
  TextPreset.H4,
  TextPreset.H5,
  TextPreset.H6,
]);

/* ================================================================== */
/* Layout / appearance values                                          */
/* ================================================================== */

export const PAGE_CONTENT_MAX_WIDTH = `var(${CssVar.PageWidth}, 120rem)`;
export const PAGE_INLINE_PADDING = "clamp(20px, 4vw, 40px)";
export const FULL_INLINE_PADDING = "20px";
export const CONTENT_BLOCK_PADDING = "40px";
export const EMPTY_MEDIA_BG = "#f4f4f4";

/* ================================================================== */
/* Defaults (mirror schema defaults)                                   */
/* ================================================================== */

export const DEFAULTS = {
  gap: 12,
  customHeight: 50,
  reflectionOpacity: 75,
  overlayColor: "rgb(0 0 0 / 0.15)",
  buttonLabel: "Shop now",
  blockText: "",
} as const;

/* ================================================================== */
/* CSS class names (BEM, mirror hero.liquid)                           */
/* ================================================================== */

export const ClassName = {
  Root: "cs-hero-v2",
  /** Modifier: stack media slots vertically on mobile. */
  RootStackMobile: "cs-hero-v2--stack-mobile",
  Container: "cs-hero-v2__container",
  MediaGrid: "cs-hero-v2__media-grid",
  MediaWrapper: "cs-hero-v2__media-wrapper",
  Media: "cs-hero-v2__media",
  /** Desktop media element that has a distinct mobile sibling (hidden <750px). */
  MediaDesktopHasMobile: "cs-hero-v2__media--desktop-has-mobile",
  /** Mobile-only media element (shown <750px). */
  MediaMobile: "cs-hero-v2__media--mobile",
  Link: "cs-hero-v2__link",
  ContentWrapper: "cs-hero-v2__content-wrapper",
  BlurredImage: "cs-hero-v2__blurred-image",
  MobileColumn: "mobile-column",
} as const;
