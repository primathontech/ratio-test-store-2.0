/**
 * Editor settings schema for the common Hero widget — the SHARED surface.
 *
 * One semantic field set for all variants; mapSettings.ts adapts each field
 * onto the selected variant's native settings. Fields a variant doesn't use
 * are simply ignored by it (e.g. `videoId` only affects the video hero) —
 * labels carry a variant hint where a field is variant-specific, since the
 * editor's DynamicForm has no conditional-field support.
 *
 * Field order = sidebar order (content → buttons → media → layout →
 * appearance). Color fields are hex text inputs (the editor has no color
 * picker); empty string = keep the variant's own default.
 *
 * This file is the schema source of truth: app widget-registries import it,
 * so the folder stays the portable unit.
 */
import type { ImageBannerSettings } from "./V1/types";
import type { HeroSettings as HeroV2NativeSettings } from "./V2/types";
import type { HeroVideoSettings } from "./V3/types";
import type { ShoppableHeroExt } from "./V4/types";

/* ── Shared editor-facing settings (drives settingsSchema below) ────────── */

export interface HeroImage {
  src?: string;
  alt?: string;
}

/** The shared, editor-facing settings surface (one field set, all variants). */
export interface HeroSharedSettings {
  variant?: string;
  colorScheme?: string; // scheme-1..5
  heading?: string;
  headingSize?: "small" | "medium" | "large" | "xl"; // medium = variant's original
  headingColor?: string; // hex; empty = variant default
  text?: string;
  textColor?: string;
  ctaLabel?: string;
  ctaHref?: string;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
  buttonStyle?: "default" | "solid" | "outline" | "link"; // v1/v2
  ctaBackground?: string;
  ctaTextColor?: string;
  image?: HeroImage | string;
  imageMobile?: HeroImage | string;
  videoId?: string;
  imageBehavior?: "default" | "none" | "ambient" | "fixed" | "zoom-in"; // v1
  height?: "small" | "medium" | "large" | "full";
  mobileHeight?: "default" | "small" | "medium" | "large" | "full"; // v3
  sectionWidth?: "default" | "page" | "full"; // v2
  overlayOpacity?: number; // 0..100
  overlayColor?: string; // hex (v2)
  overlayStyle?: "default" | "solid" | "gradient-up" | "gradient-down"; // v2
  align?: "left" | "center" | "right";
  verticalPosition?: "default" | "top" | "middle" | "bottom";
  stackOnMobile?: boolean;
  showTextBox?: boolean; // v1
  sectionBackground?: string;
  blurredReflection?: boolean; // v2
  [key: string]: unknown; // native passthrough → routed into the extension
}

/* ── View-model (the stable seam variants render) ──────────────────────── */

export interface HeroMediaRef {
  src: string;
  alt?: string;
}

export interface HeroCta {
  label: string;
  href: string;
  role: "primary" | "secondary";
  style?: "solid" | "outline" | "link";
  background?: string;
  textColor?: string;
}

export interface HeroVMShared {
  heading?: {
    text: string;
    size: "small" | "medium" | "large" | "xl";
    color?: string;
  };
  text?: { value: string; color?: string };
  ctas: HeroCta[];
  media: { desktop?: HeroMediaRef; mobile?: HeroMediaRef; videoId?: string };
  layout: {
    height: "small" | "medium" | "large" | "full";
    mobileHeight?: "small" | "medium" | "large" | "full";
    align: "left" | "center" | "right";
    verticalPosition?: "top" | "middle" | "bottom";
    stackOnMobile: boolean;
    sectionWidth?: "page" | "full";
  };
  appearance: {
    colorScheme: string; // scheme id — variants resolve via schemeColorVars()
    sectionBackground?: string;
    overlay?: {
      opacity: number;
      color: string;
      style: "solid" | "gradient-up" | "gradient-down";
    };
  };
}

/**
 * The Hero view-model. Variants receive ONLY this (never raw settings).
 * Typed extensions = each variant's faithful native settings interface
 * (design decision D2/approach A); only the selected variant's slot is set.
 */
export interface HeroVM {
  variant: "v1" | "v2" | "v3" | "v4";
  shared: HeroVMShared;
  v1?: ImageBannerSettings;
  v2?: HeroV2NativeSettings;
  v3?: HeroVideoSettings;
  v4?: ShoppableHeroExt;
}

export const HeroContract = {
  type: "Hero",
  name: "Hero",
  description:
    "Common hero section — image banner (v1), media hero (v2), or ambient video hero (v3)",
  /** Every data-testid the section renders (normalized across variants). */
  testIds: [
    "hero",
    "hero-heading",
    "hero-subtitle",
    "hero-preheading",
    "hero-cta",
    "hero-button-block",
    "hero-text-block",
    "hero-media",
    "hero-media-wrapper",
    "hero-overlay",
    "hero-lightbox",
    "hero-hotspot",
    "hero-popover",
    "hero-popover-link",
    "hero-quickshop",
    "hero-quickshop-atc",
  ] as const,
  /** Block types the media hero (v2) accepts in its content region. */
  acceptedBlocks: ["text", "button"] as const,
  /**
   * Data need: none required. Optional fall-ins: v2 media (HeroMediaItem[]),
   * v4 products (PRODUCTS dataSource → hotspot[i] binds products[i]).
   */
  data: {
    required: false,
    optionalFallback:
      "media (v2): HeroMediaItem[] · products (v4): ShoppableHeroProduct[]",
  } as const,
  settingsSchema: {
    variant: {
      type: "select" as const,
      label: "Widget Variant",
      options: [
        { value: "v1", label: "Version 1 (Image Banner)" },
        { value: "v2", label: "Version 2 (Media Hero)" },
        { value: "v3", label: "Version 3 (Video Hero)" },
        { value: "v4", label: "Version 4 (Shoppable Hero)" },
      ],
      default: "v1",
    },

    /* ── Content ─────────────────────────────────────────────────────── */
    heading: {
      type: "text" as const,
      label: "Heading",
      default: "Industrial design meets fashion.",
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
      placeholder: "#ffffff",
      default: "",
    },
    text: {
      type: "text" as const,
      label: "Text",
      default: "Atypical leather goods",
    },
    textColor: {
      type: "text" as const,
      label: "Text Color (hex, empty = default)",
      placeholder: "#ffffff",
      default: "",
    },

    /* ── Buttons ─────────────────────────────────────────────────────── */
    ctaLabel: {
      type: "text" as const,
      label: "Button Label",
      default: "Shop now",
    },
    ctaHref: {
      type: "text" as const,
      label: "Button Link",
      default: "/collections/all",
    },
    secondaryCtaLabel: {
      type: "text" as const,
      label: "Secondary Button Label",
      default: "",
    },
    secondaryCtaHref: {
      type: "text" as const,
      label: "Secondary Button Link",
      default: "",
    },
    buttonStyle: {
      type: "select" as const,
      label: "Button Style",
      options: [
        { value: "default", label: "Variant default" },
        { value: "solid", label: "Solid" },
        { value: "outline", label: "Outline" },
        { value: "link", label: "Link (Media Hero)" },
      ],
      default: "default",
    },
    ctaBackground: {
      type: "text" as const,
      label: "Button Background (hex, empty = default)",
      placeholder: "#111111",
      default: "",
    },
    ctaTextColor: {
      type: "text" as const,
      label: "Button Text Color (hex, empty = default)",
      placeholder: "#ffffff",
      default: "",
    },

    /* ── Media ───────────────────────────────────────────────────────── */
    image: {
      type: "image" as const,
      label: "Image (desktop)",
      default: { src: "/widgets/Hero/V1/banner-1.jpg", alt: "" },
    },
    imageMobile: {
      type: "image" as const,
      label: "Image (mobile)",
      default: { src: "", alt: "" },
    },
    videoId: {
      type: "text" as const,
      label: "Background Video (YouTube URL/id)",
      default: "",
    },
    imageBehavior: {
      type: "select" as const,
      label: "Image Scroll Effect (Image Banner)",
      options: [
        { value: "default", label: "Variant default" },
        { value: "none", label: "None" },
        { value: "ambient", label: "Ambient drift" },
        { value: "fixed", label: "Fixed (parallax)" },
        { value: "zoom-in", label: "Zoom in on scroll" },
      ],
      default: "default",
    },

    /* ── Layout ──────────────────────────────────────────────────────── */
    height: {
      type: "select" as const,
      label: "Section Height",
      options: [
        { value: "small", label: "Small" },
        { value: "medium", label: "Medium" },
        { value: "large", label: "Large" },
        { value: "full", label: "Full screen" },
      ],
      default: "large",
    },
    mobileHeight: {
      type: "select" as const,
      label: "Section Height (mobile — Video Hero)",
      options: [
        { value: "default", label: "Variant default" },
        { value: "small", label: "Small" },
        { value: "medium", label: "Medium" },
        { value: "large", label: "Large" },
        { value: "full", label: "Full screen" },
      ],
      default: "default",
    },
    sectionWidth: {
      type: "select" as const,
      label: "Content Width (Media Hero)",
      options: [
        { value: "default", label: "Variant default" },
        { value: "page", label: "Page width" },
        { value: "full", label: "Full width" },
      ],
      default: "default",
    },
    align: {
      type: "select" as const,
      label: "Content Alignment",
      options: [
        { value: "left", label: "Left" },
        { value: "center", label: "Center" },
        { value: "right", label: "Right" },
      ],
      default: "center",
    },
    verticalPosition: {
      type: "select" as const,
      label: "Content Vertical Position",
      options: [
        { value: "default", label: "Variant default" },
        { value: "top", label: "Top" },
        { value: "middle", label: "Middle" },
        { value: "bottom", label: "Bottom" },
      ],
      default: "default",
    },
    stackOnMobile: {
      type: "boolean" as const,
      label: "Stack Media on Mobile",
      default: false,
    },
    showTextBox: {
      type: "boolean" as const,
      label: "Show Text Box (Image Banner)",
      default: false,
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
    overlayOpacity: {
      type: "number" as const,
      label: "Overlay Opacity (0–100)",
      default: 0,
    },
    overlayColor: {
      type: "text" as const,
      label: "Overlay Color (hex — Media Hero)",
      default: "#000000",
    },
    overlayStyle: {
      type: "select" as const,
      label: "Overlay Style (Media Hero)",
      options: [
        { value: "default", label: "Solid (default)" },
        { value: "gradient-up", label: "Gradient — fade upward" },
        { value: "gradient-down", label: "Gradient — fade downward" },
      ],
      default: "default",
    },
    blurredReflection: {
      type: "boolean" as const,
      label: "Blurred Reflection (Media Hero)",
      default: false,
    },
  },
} as const;

export default HeroContract;
