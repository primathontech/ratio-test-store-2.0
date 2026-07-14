import type { HeroVM } from "../contract";

/**
 * Shoppable hero (v4) — full-bleed hero image with product hotspots.
 *
 * "+" hotspots positioned by PERCENT offsets over the image; click → inline
 * popover product mini-card; "View product" → quick-shop modal (fixed sibling
 * at the widget root, NO portal) with real add-to-cart when `products` are
 * wired via the data layer. Static content falls back to sample-data.ts so the
 * section always renders (and looks great) with zero settings.
 */

/** A data-layer product (as delivered by a PRODUCTS dataSource). */
export interface ShoppableHeroProduct {
  id: string;
  title: string;
  handle: string;
  vendor?: string;
  productType?: string;
  images?: { url: string; altText?: string | null }[];
  featuredImage?: { url: string } | null;
  priceRange: {
    minVariantPrice: { amount: string; currencyCode: string };
  };
  compareAtPriceRange?: {
    minVariantPrice: { amount: string; currencyCode: string };
  } | null;
  variants?: {
    id: string;
    price: { amount: string; currencyCode: string };
    compareAtPrice?: { amount: string; currencyCode: string } | null;
    available?: boolean;
    sku?: string;
  }[];
}

/**
 * A single shoppable hotspot. Position is percent-of-image (left/top), with a
 * separate mobile position because the mobile hero box is a different (taller)
 * aspect-ratio. SHALLOW: every field is a scalar (valid flat editor content).
 */
export interface ShoppableHeroHotspot {
  /** Desktop position (≥768) — percent of the hero image. */
  x: string;
  y: string;
  /** Mobile position (<768) — percent of the (taller) mobile hero box. */
  xMobile?: string;
  yMobile?: string;
  /**
   * Demo product shown when no live `products` are wired. When products ARE
   * present, hotspot[i] binds to products[i] and these fields are ignored.
   */
  demoTitle: string;
  demoPrice: string;
  demoHref: string;
}

/** Simple image ref ({src, alt}). */
export interface ShoppableHeroImage {
  src: string;
  alt?: string;
}

/** This look's faithful native settings (the vm.v4 typed extension base). */
export interface ShoppableHeroSettings {
  /** @default 'v1' */
  variant?: string;
  /** Hero heading (h2). */
  heading?: string;
  /** Hero subheading (p). */
  subheading?: string;
  /** CTA button label. */
  ctaText?: string;
  /** CTA button href. */
  ctaHref?: string;
  /** Full-bleed hero image (landscape, desktop). */
  image?: ShoppableHeroImage;
  /** Dedicated portrait image for the mobile box (falls back to `image`). */
  mobileImage?: ShoppableHeroImage;
  /** The shoppable hotspots (scalars only — see ShoppableHeroHotspot). */
  hotspots?: ShoppableHeroHotspot[];
  /** Hotspot dot background color. */
  hotspotColor?: string;
  /** Hotspot glyph color. */
  hotspotTextColor?: string;
  /** CTA background color. */
  ctaBackground?: string;
  /** CTA text color. */
  ctaTextColor?: string;
  /** Desktop overlay text color (over the photographic hero). */
  overlayTextColor?: string;
  /** Mobile text color (content stacks below image on white). */
  mobileTextColor?: string;
  /** Small eyebrow line rendered above the heading. */
  preheading?: string;
  /** Heading size: `small` | `medium` | `large`. */
  headingSize?: string;
  /** Text-protection scrim opacity (0–100). */
  overlayOpacity?: string | number;
  /** Content text alignment: `left` | `center` | `right`. */
  textAlignment?: string;
  /** Desktop content position: `{top|middle|bottom}-{left|center|right}`. */
  textPosition?: string;
  /** Hotspot icon glyph: `plus` | `dot` | `tag` | `bag`. */
  hotspotIconStyle?: string;
}

/**
 * The vm.v4 extension: native settings + the data-layer products folded in by
 * logic.ts (hotspot[i] binds to products[i]; demo fallbacks otherwise).
 */
export interface ShoppableHeroExt extends ShoppableHeroSettings {
  products?: ShoppableHeroProduct[];
}

/** Props for the shoppable hero (v4) variant — renders ONLY the VM. */
export interface ShoppableHeroProps {
  vm: HeroVM;
  className?: string;
  locale?: string;
}
