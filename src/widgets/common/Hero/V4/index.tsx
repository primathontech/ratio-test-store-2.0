"use client";

/**
 * Shoppable hero — V4
 *
 * Full-bleed hero image with product hotspots positioned by PERCENT offsets.
 * Click "+" → inline popover product mini-card (absolute, relative to the
 * hotspot — NOT a body portal). "View product" → quick-shop modal (fixed
 * inset-0 sibling at the widget root — NO createPortal) with real add-to-cart
 * when `products` are wired via the data layer; harvested demo content
 * otherwise, so the section always renders.
 *
 * Responsive (cutover 768px):
 *   - Mobile: hero box is a portrait crop (aspect 640/695) and the content
 *     stacks BELOW the image on white → dark text. Percent hotspots follow the
 *     taller box via per-hotspot mobile percents.
 *   - Desktop: the landscape image keeps its natural aspect; content OVERLAYS
 *     the image (default bottom-left) → white text.
 *
 * Hotspot idle pulse / popover reveal / modal open animations live in
 * ./style.css (folder-local; prefers-reduced-motion guarded).
 */

import { memo, useCallback, useEffect, useState } from "react";
import Image from "next/image";
import type { ShoppableHeroProps, ShoppableHeroProduct } from "./types";
import {
  SAMPLE_HEADING,
  SAMPLE_SUBHEADING,
  SAMPLE_CTA_TEXT,
  SAMPLE_CTA_HREF,
  SAMPLE_IMAGE,
  SAMPLE_MOBILE_IMAGE,
  SAMPLE_HOTSPOTS,
  SAMPLE_HOTSPOT_COLOR,
  SAMPLE_HOTSPOT_TEXT_COLOR,
  SAMPLE_CTA_BACKGROUND,
  SAMPLE_CTA_TEXT_COLOR,
  SAMPLE_OVERLAY_TEXT_COLOR,
  SAMPLE_MOBILE_TEXT_COLOR,
  SAMPLE_PREHEADING,
  SAMPLE_HEADING_SIZE,
  SAMPLE_OVERLAY_OPACITY,
  SAMPLE_TEXT_ALIGNMENT,
  SAMPLE_TEXT_POSITION,
  SAMPLE_HOTSPOT_ICON,
} from "./sample-data";
import { PlusIcon, DotIcon, TagIcon, BagIcon } from "./icons";
import { HotspotPopover } from "./components/HotspotPopover";
import { QuickShopModal } from "./components/QuickShopModal";
import "./style.css";

/** Content alignment (mobile + desktop) → flex cross-axis + text-align classes. */
const ALIGN_MAP: Record<string, string> = {
  left: "items-start text-left",
  center: "items-center text-center",
  right: "items-end text-right",
};

/** Heading size → h2 font-size classes (source look: small 26 / medium 32 / large 26→27). */
const HEADING_SIZE_MAP: Record<string, string> = {
  small:
    "text-[26px] leading-[28.6px] min-[768px]:text-[26px] min-[768px]:leading-[29.7px]",
  medium:
    "text-[32px] leading-[1.15] min-[768px]:text-[32px] min-[768px]:leading-[1.15]",
  large:
    "text-[26px] leading-[1.12] min-[768px]:text-[27px] min-[768px]:leading-[1.12]",
};

/**
 * Desktop content position over the hero, "{top|middle|bottom}-{left|center|right}".
 * Applied ≥768 only (on mobile the content stacks below the image).
 */
function positionClasses(position: string): string {
  const [v, h] = (position || "bottom-left").split("-");
  const vMap: Record<string, string> = {
    top: "min-[768px]:items-start",
    middle: "min-[768px]:items-center",
    bottom: "min-[768px]:items-end",
  };
  const hMap: Record<string, string> = {
    left: "min-[768px]:justify-start",
    center: "min-[768px]:justify-center",
    right: "min-[768px]:justify-end",
  };
  return `${vMap[v] ?? "min-[768px]:items-end"} ${hMap[h] ?? "min-[768px]:justify-start"}`;
}

/** The hotspot glyph for the chosen icon style (plus | dot | tag | bag). */
function renderHotspotIcon(style: string) {
  const cls = "block h-full w-full";
  switch (style) {
    case "dot":
      return <DotIcon className={cls} />;
    case "tag":
      return <TagIcon className={cls} />;
    case "bag":
      return <BagIcon className={cls} />;
    default:
      return <PlusIcon className={cls} />;
  }
}

export const V4 = memo(function V4({ vm, className }: ShoppableHeroProps) {
  const settings = vm.v4; // the VM seam: body below reads only the extension

  // ── Static content: settings first, sample-data as the typed fallback. ──
  const heading = settings?.heading ?? SAMPLE_HEADING;
  const subheading = settings?.subheading ?? SAMPLE_SUBHEADING;
  const ctaText = settings?.ctaText ?? SAMPLE_CTA_TEXT;
  const ctaHref = settings?.ctaHref ?? SAMPLE_CTA_HREF;
  const heroImage = settings?.image ?? SAMPLE_IMAGE;
  const mobileHeroImage = settings?.mobileImage ?? SAMPLE_MOBILE_IMAGE;
  const hotspots =
    settings?.hotspots && settings.hotspots.length > 0
      ? settings.hotspots
      : SAMPLE_HOTSPOTS;
  const hotspotColor = settings?.hotspotColor ?? SAMPLE_HOTSPOT_COLOR;
  const hotspotTextColor =
    settings?.hotspotTextColor ?? SAMPLE_HOTSPOT_TEXT_COLOR;
  const ctaBackground = settings?.ctaBackground ?? SAMPLE_CTA_BACKGROUND;
  const ctaTextColor = settings?.ctaTextColor ?? SAMPLE_CTA_TEXT_COLOR;
  const overlayTextColor =
    settings?.overlayTextColor ?? SAMPLE_OVERLAY_TEXT_COLOR;
  const mobileTextColor = settings?.mobileTextColor ?? SAMPLE_MOBILE_TEXT_COLOR;
  const preheading = settings?.preheading ?? SAMPLE_PREHEADING;
  const headingSize = settings?.headingSize ?? SAMPLE_HEADING_SIZE;
  const textAlignment = settings?.textAlignment ?? SAMPLE_TEXT_ALIGNMENT;
  const textPosition = settings?.textPosition ?? SAMPLE_TEXT_POSITION;
  const hotspotIconStyle = settings?.hotspotIconStyle ?? SAMPLE_HOTSPOT_ICON;
  // Text-protection scrim opacity (0–100 → 0–1, clamped).
  const overlayOpacityRaw = settings?.overlayOpacity ?? SAMPLE_OVERLAY_OPACITY;
  const overlayOpacityNum =
    typeof overlayOpacityRaw === "number"
      ? overlayOpacityRaw
      : Number.parseFloat(String(overlayOpacityRaw));
  const overlayOpacity = Number.isFinite(overlayOpacityNum)
    ? Math.min(100, Math.max(0, overlayOpacityNum)) / 100
    : 0.1;
  const alignClasses = ALIGN_MAP[textAlignment] ?? ALIGN_MAP.left;
  const headingSizeClasses =
    HEADING_SIZE_MAP[headingSize] ?? HEADING_SIZE_MAP.large;
  const posClasses = positionClasses(textPosition);
  // Library-extension overrides (shared headingCase/headingSpacing/textSize/
  // contentWidth) — undefined keeps the look's original values.
  const headingSpacing = settings?.headingSpacing
    ? { tight: "-0.5px", normal: "0", wide: "4px" }[settings.headingSpacing]
    : undefined;
  const subheadingSize = settings?.textSize
    ? { small: "13px", medium: "15px", large: "18px" }[settings.textSize]
    : undefined;
  const contentMaxWidth =
    settings?.contentMaxWidth === undefined
      ? undefined
      : settings.contentMaxWidth === 0
        ? "none"
        : `${settings.contentMaxWidth}px`;
  // ─────────────────────────────────────────────────────────────────────────

  // Live products (folded into the extension by logic.ts); hotspot[i] → products[i].
  const products = settings?.products ?? [];
  const productForHotspot = (idx: number): ShoppableHeroProduct | null =>
    products[idx] ?? null;

  // Which hotspot's popover is open (one at a time). null = none.
  const [openHotspot, setOpenHotspot] = useState<number | null>(null);
  // Which hotspot's quick-shop modal is open (null = closed).
  const [quickShopIdx, setQuickShopIdx] = useState<number | null>(null);

  const toggleHotspot = useCallback((idx: number) => {
    setOpenHotspot((cur) => (cur === idx ? null : idx));
  }, []);

  // Dismiss the open popover on ESC + outside-click (the modal owns its own ESC).
  useEffect(() => {
    if (openHotspot === null) {
      return;
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpenHotspot(null);
      }
    };
    const onPointer = (e: PointerEvent) => {
      const target = e.target as Node | null;
      if (
        target instanceof Element &&
        target.closest(
          '[data-testid="hero-hotspot"],[data-testid="hero-popover"]'
        )
      ) {
        return;
      }
      setOpenHotspot(null);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [openHotspot]);

  const quickShopHotspot =
    quickShopIdx !== null ? hotspots[quickShopIdx] : null;

  return (
    <section
      data-testid="hero"
      className={`cs-hero-v4 relative block w-full ${className ?? ""}`}
      style={
        {
          ["--cs-hero-v4-hs-color" as string]: hotspotColor,
          ["--cs-hero-v4-hs-text" as string]: hotspotTextColor,
          ["--cs-hero-v4-cta-bg" as string]: ctaBackground,
          ["--cs-hero-v4-cta-text" as string]: ctaTextColor,
          ["--cs-hero-v4-overlay-text" as string]: overlayTextColor,
          ["--cs-hero-v4-text-mobile" as string]: mobileTextColor,
        } as React.CSSProperties
      }
    >
      {/* Overlay grid. Mobile: 2 rows (image, then content BELOW). Desktop:
          single row so image + content overlay the same cell. */}
      <div className="grid grid-cols-1 grid-rows-[auto_auto] min-[768px]:grid-rows-1">
        {/* Media cell (image + hotspots). Relative so the % dots anchor to it. */}
        <div className="relative col-start-1 row-start-1">
          {/* Mobile: a PORTRAIT image fills the 640/695 box. Desktop: the
              landscape image at its natural aspect. Two art-directed images —
              a single landscape would be object-cover-cropped on mobile. */}
          <Image
            data-testid="hero-media"
            src={mobileHeroImage.src}
            alt={mobileHeroImage.alt ?? ""}
            width={800}
            height={869}
            priority
            sizes="100vw"
            className="block aspect-[640/695] w-full object-cover min-[768px]:hidden"
          />
          <Image
            src={heroImage.src}
            alt={heroImage.alt ?? ""}
            width={1440}
            height={960}
            priority
            sizes="100vw"
            className="hidden h-auto w-full object-fill min-[768px]:block"
          />

          {/* Text-protection scrim — above the image, below the content. */}
          <div
            aria-hidden="true"
            data-testid="hero-overlay"
            className="pointer-events-none absolute inset-0 z-[1] bg-[#2a3743]"
            style={{ opacity: overlayOpacity }}
          />

          {/* Hotspot layer — absolutely-positioned dots over the image. */}
          <div className="pointer-events-none absolute inset-0 z-[2]">
            {hotspots.map((hs, idx) => {
              const product = productForHotspot(idx);
              const title = product?.title ?? hs.demoTitle;
              const price = product
                ? formatProductPrice(product)
                : hs.demoPrice;
              const href = product
                ? `/products/${product.handle}`
                : hs.demoHref;
              const isOpen = openHotspot === idx;
              return (
                <div
                  key={`${hs.x}-${hs.y}-${idx}`}
                  // Percent offsets follow the box; the mobile box is a taller
                  // aspect, so mobile uses its own percents (CSS vars per spot).
                  className="pointer-events-auto absolute [left:var(--cs-hero-v4-hs-left-m)] [top:var(--cs-hero-v4-hs-top-m)] min-[768px]:[left:var(--cs-hero-v4-hs-left)] min-[768px]:[top:var(--cs-hero-v4-hs-top)]"
                  style={
                    {
                      ["--cs-hero-v4-hs-left" as string]: hs.x,
                      ["--cs-hero-v4-hs-top" as string]: hs.y,
                      ["--cs-hero-v4-hs-left-m" as string]: hs.xMobile ?? hs.x,
                      ["--cs-hero-v4-hs-top-m" as string]: hs.yMobile ?? hs.y,
                    } as React.CSSProperties
                  }
                >
                  <button
                    type="button"
                    data-testid="hero-hotspot"
                    aria-label={title}
                    aria-haspopup="dialog"
                    aria-expanded={isOpen}
                    onClick={() => toggleHotspot(idx)}
                    className="cs-hero-v4__btn flex h-[30px] w-[30px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[var(--cs-hero-v4-hs-color)] p-[6px] text-[var(--cs-hero-v4-hs-text)] min-[768px]:h-[40px] min-[768px]:w-[40px] min-[768px]:p-[10px]"
                  >
                    {renderHotspotIcon(hotspotIconStyle)}
                  </button>

                  {isOpen ? (
                    <HotspotPopover
                      title={title}
                      price={price}
                      href={href}
                      loading={false}
                      onViewProduct={() => {
                        setOpenHotspot(null);
                        setQuickShopIdx(idx);
                      }}
                    />
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>

        {/* Content cell — stacks BELOW the image on mobile (dark text on
            white), overlays the image on desktop (white text). */}
        <div
          className={`col-start-1 row-start-2 flex items-end ${posClasses} min-[768px]:row-start-1`}
        >
          <div
            className={`relative z-[3] flex w-full flex-col ${alignClasses} gap-[12px] p-[17px] min-[768px]:max-w-[508px] min-[1024px]:max-w-[592px] min-[1024px]:p-[40px] min-[1440px]:max-w-[742px]`}
            style={contentMaxWidth ? { maxWidth: contentMaxWidth } : undefined}
          >
            {preheading ? (
              <p
                data-testid="hero-preheading"
                className="m-0 font-body text-[13px] font-[700] uppercase tracking-[2.6px] text-[var(--cs-hero-v4-text-mobile)] min-[768px]:text-[var(--cs-hero-v4-overlay-text)]"
              >
                {preheading}
              </p>
            ) : null}
            <h2
              data-testid="hero-heading"
              className={`m-0 mt-[-4px] font-heading font-[500] ${headingSizeClasses} text-[var(--cs-hero-v4-text-mobile)] min-[768px]:text-[var(--cs-hero-v4-overlay-text)]`}
              style={{
                ...(settings?.headingCase
                  ? { textTransform: settings.headingCase }
                  : {}),
                ...(headingSpacing ? { letterSpacing: headingSpacing } : {}),
              }}
            >
              {heading}
            </h2>
            {subheading ? (
              <p
                data-testid="hero-subtitle"
                className="m-0 font-body text-[15px] font-[400] leading-[21px] tracking-[0.4px] text-[var(--cs-hero-v4-text-mobile)] min-[768px]:text-[16px] min-[768px]:leading-[22.4px] min-[768px]:text-[var(--cs-hero-v4-overlay-text)]"
                style={
                  subheadingSize
                    ? { fontSize: subheadingSize, lineHeight: 1.4 }
                    : undefined
                }
              >
                {subheading}
              </p>
            ) : null}
            <div className="relative">
              <a
                href={ctaHref}
                data-testid="hero-cta"
                // The source look's .btn carries a 1px border in the same color
                // as its bg (grows the button ~2px each axis) — kept for fidelity.
                className="inline-block w-fit border border-[var(--cs-hero-v4-cta-bg)] bg-[var(--cs-hero-v4-cta-bg)] px-[17px] py-[9px] text-center font-body text-[13px] font-[700] uppercase leading-[18.46px] tracking-[2.6px] text-[var(--cs-hero-v4-cta-text)] min-[768px]:px-[20px] min-[768px]:py-[11px] min-[768px]:text-[15px]"
              >
                {ctaText}
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Quick-shop modal — fixed sibling at the widget root (NO portal). */}
      {quickShopHotspot ? (
        <QuickShopModal
          product={
            quickShopIdx !== null ? productForHotspot(quickShopIdx) : null
          }
          fallbackTitle={quickShopHotspot.demoTitle}
          fallbackPrice={quickShopHotspot.demoPrice}
          fallbackHref={quickShopHotspot.demoHref}
          onClose={() => setQuickShopIdx(null)}
        />
      ) : null}
    </section>
  );
});

/** Format a data-layer product's min price (popover mini-card price). */
function formatProductPrice(product: ShoppableHeroProduct): string {
  const min = product.priceRange?.minVariantPrice;
  if (!min) {
    return "";
  }
  const amount = Number.parseFloat(min.amount);
  if (!Number.isFinite(amount)) {
    return "";
  }
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: min.currencyCode || "INR",
  }).format(amount);
}

export { V4 as default };
