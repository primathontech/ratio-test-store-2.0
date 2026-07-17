"use client";

import React, { memo, useEffect, useRef } from "react";
import Image from "next/image";
import type {
  ImageBannerProps,
  ImageBannerButton,
  ImageBannerContentPosition,
  ImageBannerAlignment,
  ImageBannerHeight,
  ImageBannerHeadingSize,
  ImageBannerTextStyle,
} from "./types";
import {
  SAMPLE_IMAGE,
  SAMPLE_IMAGE_ALT,
  SAMPLE_IMAGE2,
  SAMPLE_IMAGE2_ALT,
  SAMPLE_HEADING,
  SAMPLE_TEXT,
} from "./sample-data";
import { schemeColorVars } from "../_shared/scheme-vars";
import "./style.css";

/**
 * Image-banner look — V1
 *
 * Pixel-matched to the classic "Image banner" section:
 *  - Full-width, two images side-by-side (each 50% width, object-fit cover).
 *    Stays side-by-side on mobile when stackImagesOnMobile = false (live).
 *  - Desktop height presets (large = 720px live); mobile 390px.
 *  - Content box bottom-center on desktop (alignItems:flex-end + justify:center),
 *    centered on mobile; text-align center; transparent box (show_text_box=false).
 *  - Heading h0 52px desktop / 40px mobile, weight 400, white.
 *  - Sub-text white 75%.
 *  - "Shop now" secondary/outline button: transparent bg, white text, white 1px
 *    ring via ::after that grows to ~2.3px on hover (box-shadow 0.1s).
 *  - Black overlay opacity from imageOverlayOpacity (live = 0 → no tint).
 *  - image_behavior "fixed" → parallax fixed-attachment background.
 *  - Banner fades in + content slides up on viewport entry (IntersectionObserver).
 */

/** Desktop heights per image_height preset (rendered px). */
const DESKTOP_HEIGHTS: Record<ImageBannerHeight, string> = {
  adapt: "560px",
  small: "420px",
  medium: "560px",
  large: "720px",
};

/**
 * Heading font-size per heading_size token → [mobile, desktop] px.
 * h0 reproduces the original hardcoded 40px / 52px exactly, so the default
 * render is unchanged. Other tokens scale around it per the type ramp.
 */
const HEADING_SIZES: Record<ImageBannerHeadingSize, [string, string]> = {
  h2: ["24px", "30px"],
  h1: ["32px", "40px"],
  h0: ["40px", "52px"],
  hxl: ["48px", "72px"],
  hxxl: ["56px", "100px"],
};

/**
 * Text-block style per text_style token. `body` reproduces the original
 * hardcoded text styling exactly (15/16px, 1.8 line-height, 0.6px tracking),
 * so the default render is unchanged.
 */
const TEXT_STYLES: Record<
  ImageBannerTextStyle,
  {
    sizeMobile: string;
    sizeDesktop: string;
    lineHeight: string;
    letterSpacing: string;
    fontStyle: "normal" | "italic";
    textTransform: "none" | "uppercase";
  }
> = {
  body: {
    sizeMobile: "15px",
    sizeDesktop: "16px",
    lineHeight: "1.8",
    letterSpacing: "0.6px",
    fontStyle: "normal",
    textTransform: "none",
  },
  subtitle: {
    sizeMobile: "18px",
    sizeDesktop: "20px",
    lineHeight: "1.6",
    letterSpacing: "0.6px",
    fontStyle: "italic",
    textTransform: "none",
  },
  "caption-with-letter-spacing": {
    sizeMobile: "13px",
    sizeDesktop: "13px",
    lineHeight: "1.8",
    letterSpacing: "1.3px",
    fontStyle: "normal",
    textTransform: "uppercase",
  },
};

/** Shared textSize override → [mobile, desktop] px (medium = original body). */
const TEXT_SIZE_OVERRIDES: Record<string, [string, string]> = {
  small: ["13px", "14px"],
  medium: ["15px", "16px"],
  large: ["17px", "18px"],
};

/** Shared headingSpacing override → letter-spacing (original = 0.6px class). */
const HEADING_SPACING_VALUES: Record<string, string> = {
  tight: "-0.5px",
  normal: "0",
  wide: "4px",
};

/** Map desktop_content_position → flex alignment for the content row. */
function positionToFlex(position: ImageBannerContentPosition): {
  vertical: string;
  horizontal: string;
} {
  const [v, h] = position.split("-");
  const vertical =
    v === "top" ? "flex-start" : v === "bottom" ? "flex-end" : "center";
  const horizontal =
    h === "left" ? "flex-start" : h === "right" ? "flex-end" : "center";
  return { vertical, horizontal };
}

/** Map text alignment token → CSS text-align value. */
function alignToText(align: ImageBannerAlignment): "left" | "center" | "right" {
  return align;
}

interface HalfProps {
  src: string;
  alt: string;
  /** object-position from harvest (per-image focal point). */
  objectPosition: string;
  fixed: boolean;
  priority: boolean;
  /** When stacking on mobile, each half is full-width / half-height on mobile. */
  stack: boolean;
}

/** A single image half. Side-by-side = 50% width; stacked = full width. */
const Half = ({
  src,
  alt,
  objectPosition,
  fixed,
  priority,
  stack,
}: HalfProps) => {
  return (
    <div
      className={[
        "relative overflow-hidden bg-[color:rgb(var(--color-foreground-rgb,17_17_17)/0.1)]",
        stack ? "h-1/2 w-full md:h-full md:w-1/2" : "h-full w-1/2",
        fixed ? "cs-hero-v1__half--fixed" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      style={fixed ? { backgroundImage: `url(${src})` } : undefined}
    >
      {/* When not fixed, render a real responsive image. When fixed, the
          background layer shows the parallax image and the <img> is hidden
          (still present for alt/semantics on no-CSS fallback). */}
      <Image
        src={src}
        alt={alt}
        fill
        sizes="50vw"
        priority={priority}
        className={fixed ? "object-cover opacity-0" : "object-cover"}
        style={{ objectPosition }}
      />
    </div>
  );
};

/** A single CTA button (secondary outline or primary solid). */
const Button = ({
  button,
  index,
  background,
  textColor,
}: {
  button: ImageBannerButton;
  index: number;
  /** Solid bg / outline ring color override (settings.ctaBackground). */
  background?: string;
  /** Label color override (settings.ctaTextColor). */
  textColor?: string;
}) => {
  const label = button?.label ?? "";
  const link = button?.link ?? "/collections/all";
  const secondary = button?.secondary ?? true;

  if (!label) {
    return null;
  }

  return (
    <a
      href={link}
      data-testid={index === 0 ? "hero-cta" : `hero-cta-${index + 1}`}
      className={[
        "inline-flex min-w-[122px] items-center justify-center px-[30px] py-[14px]",
        "text-[15px] font-normal leading-[18px] tracking-[1px] no-underline",
        secondary
          ? "cs-hero-v1__button--secondary"
          : "cs-hero-v1__button--primary",
      ].join(" ")}
      style={
        {
          fontFamily: "var(--font-body--family)",
          borderRadius: 0,
          minHeight: "47px",
          // Color overrides: outline ring color rides a CSS var (used by the
          // ::after box-shadow); solid bg/text apply inline.
          ...(secondary
            ? {
                ...(background
                  ? { ["--cs-hero-v1-ring" as string]: background }
                  : {}),
                ...(textColor ? { color: textColor } : {}),
              }
            : {
                ...(background ? { backgroundColor: background } : {}),
                ...(textColor ? { color: textColor } : {}),
              }),
        } as React.CSSProperties
      }
    >
      {label}
    </a>
  );
};

export const V1 = memo(function V1({ vm, className }: ImageBannerProps) {
  const settings = vm.v1; // the VM seam: body below reads only the extension
  // ---- Destructure-and-default contract: every visual value lives here. ----
  const colorScheme = settings?.colorScheme ?? "scheme-1";

  // Image settings may arrive as {src, alt} objects (editor image-picker /
  // unmapped native settings) — normalize so next/image never gets an object.
  const asSrc = (v: unknown, fb: string): string =>
    typeof v === "string" && v ? v : ((v as { src?: string })?.src ?? fb);
  const asAlt = (
    v: unknown,
    explicit: string | undefined,
    fb: string
  ): string =>
    explicit ??
    (typeof v === "object" ? (v as { alt?: string })?.alt : undefined) ??
    fb;

  const image = asSrc(settings?.image, SAMPLE_IMAGE);
  const imageAlt = asAlt(settings?.image, settings?.imageAlt, SAMPLE_IMAGE_ALT);
  const image2 = asSrc(settings?.image2, SAMPLE_IMAGE2);
  const image2Alt = asAlt(
    settings?.image2,
    settings?.image2Alt,
    SAMPLE_IMAGE2_ALT
  );

  const imageHeight: ImageBannerHeight = settings?.imageHeight ?? "large";
  const imageBehavior = settings?.imageBehavior ?? "fixed";
  const imageOverlayOpacity = settings?.imageOverlayOpacity ?? 0;
  const desktopContentPosition: ImageBannerContentPosition =
    settings?.desktopContentPosition ?? "bottom-center";
  const desktopContentAlignment: ImageBannerAlignment =
    settings?.desktopContentAlignment ?? "center";
  const showTextBox = settings?.showTextBox ?? false;
  const showTextBelow = settings?.showTextBelow ?? false;
  const stackImagesOnMobile = settings?.stackImagesOnMobile ?? false;
  const mobileContentAlignment: ImageBannerAlignment =
    settings?.mobileContentAlignment ?? "center";

  const heading = settings?.heading ?? SAMPLE_HEADING;
  const headingSize: ImageBannerHeadingSize = settings?.headingSize ?? "h0";
  const headingColor = settings?.headingColor;
  const text = settings?.text ?? SAMPLE_TEXT;
  const textStyle: ImageBannerTextStyle = settings?.textStyle ?? "body";
  const textColor = settings?.textColor ?? "rgba(255, 255, 255, 0.75)";
  const ctaBackground = settings?.ctaBackground;
  const ctaTextColor = settings?.ctaTextColor;

  const [headingSizeMobile, headingSizeDesktop] =
    HEADING_SIZES[headingSize] ?? HEADING_SIZES.h0;
  const textStyleSpec = TEXT_STYLES[textStyle] ?? TEXT_STYLES.body;

  // Library-extension overrides (shared textSize/headingCase/headingSpacing/
  // contentWidth) — undefined keeps the look's original values.
  const textSizeOverride = settings?.textSize
    ? TEXT_SIZE_OVERRIDES[settings.textSize]
    : undefined;
  const headingSpacingOverride = settings?.headingSpacing
    ? HEADING_SPACING_VALUES[settings.headingSpacing]
    : undefined;
  const contentMaxWidth =
    settings?.contentMaxWidth === undefined
      ? undefined
      : settings.contentMaxWidth === 0
        ? "none"
        : `${settings.contentMaxWidth}px`;

  const buttons: ImageBannerButton[] =
    settings?.buttons && settings.buttons.length > 0
      ? settings.buttons
      : [{ label: "Shop now", link: "/collections/all", secondary: true }];

  // Derived layout values.
  const desktopHeight = DESKTOP_HEIGHTS[imageHeight] ?? DESKTOP_HEIGHTS.large;
  const { vertical, horizontal } = positionToFlex(desktopContentPosition);
  const isFixed = imageBehavior === "fixed" || imageBehavior === "ambient";

  // Scroll-entry reveal (fade banner, slide content).
  const rootRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const root = rootRef.current;
    if (!root) {
      return;
    }
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      root
        .querySelectorAll(".cs-hero-v1__fade, .cs-hero-v1__slide")
        .forEach((el) => el.classList.add("is-revealed"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    root
      .querySelectorAll(".cs-hero-v1__fade, .cs-hero-v1__slide")
      .forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={rootRef}
      data-testid="hero"
      className={["relative w-full", className ?? ""].filter(Boolean).join(" ")}
      style={{ ...schemeColorVars(colorScheme) }}
    >
      <div
        className="cs-hero-v1__fade relative w-full overflow-hidden"
        style={{
          fontFamily: "var(--font-body--family)",
        }}
      >
        {/* Media layer — two halves. Mobile: stack vs side-by-side.
            Height: 390px on mobile, preset height (var) on md+ via responsive
            arbitrary classes reading the --cs-hero-v1-banner-h custom property. */}
        <div
          className={[
            "relative flex w-full",
            "h-[390px] md:h-[var(--cs-hero-v1-banner-h)]",
            stackImagesOnMobile ? "flex-col md:flex-row" : "flex-row",
          ].join(" ")}
          style={
            {
              ["--cs-hero-v1-banner-h" as string]: desktopHeight,
            } as React.CSSProperties
          }
        >
          <Half
            src={image}
            alt={imageAlt}
            objectPosition="52.2668% 33.8516%"
            fixed={isFixed}
            priority
            stack={stackImagesOnMobile}
          />
          <Half
            src={image2}
            alt={image2Alt}
            objectPosition="58.6367% 28.3682%"
            fixed={isFixed}
            priority
            stack={stackImagesOnMobile}
          />

          {/* Black overlay (opacity from settings; live = 0 → invisible). */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-[1] bg-black"
            style={{ opacity: imageOverlayOpacity / 100 }}
          />
        </div>

        {/* Content layer. Overlaid on the media on desktop; when showTextBelow
            is on it flows BELOW the media on mobile (static), reverting to the
            overlaid absolute layout from md+ via responsive classes. */}
        <div
          className={[
            "z-[2] mx-auto flex w-full max-w-[1200px] px-[15px] md:px-[50px]",
            showTextBelow
              ? "relative md:absolute md:inset-0"
              : "absolute inset-0",
          ].join(" ")}
          style={{
            // Desktop alignment from settings; mobile is centered.
            alignItems: vertical,
            justifyContent: horizontal,
            ...(contentMaxWidth ? { maxWidth: contentMaxWidth } : {}),
          }}
        >
          <div
            className="cs-hero-v1__slide flex w-full max-w-[450px] flex-col px-0 py-[40px] md:max-w-[740px] md:py-[50px]"
            style={{
              alignItems: "center",
              textAlign: alignToText(mobileContentAlignment),
              backgroundColor: showTextBox
                ? "rgb(var(--color-foreground-rgb, 17 17 17) / 0.7)"
                : "transparent",
            }}
          >
            {heading ? (
              <h2
                data-testid="hero-heading"
                className="m-0 leading-[1.3] tracking-[0.6px] text-white text-[length:var(--cs-hero-v1-bh-m)] md:text-[length:var(--cs-hero-v1-bh-d)]"
                style={
                  {
                    fontWeight: 400,
                    textAlign: alignToText(desktopContentAlignment),
                    ...(headingColor ? { color: headingColor } : {}),
                    ...(settings?.headingCase
                      ? { textTransform: settings.headingCase }
                      : {}),
                    ...(headingSpacingOverride
                      ? { letterSpacing: headingSpacingOverride }
                      : {}),
                    ["--cs-hero-v1-bh-m" as string]: headingSizeMobile,
                    ["--cs-hero-v1-bh-d" as string]: headingSizeDesktop,
                  } as React.CSSProperties
                }
              >
                {heading}
              </h2>
            ) : null}

            {text ? (
              <p
                className="m-0 mt-[10px] text-[length:var(--cs-hero-v1-bt-m)] md:text-[length:var(--cs-hero-v1-bt-d)]"
                style={
                  {
                    color: textColor,
                    textAlign: alignToText(desktopContentAlignment),
                    lineHeight: textStyleSpec.lineHeight,
                    letterSpacing: textStyleSpec.letterSpacing,
                    fontStyle: textStyleSpec.fontStyle,
                    textTransform: textStyleSpec.textTransform,
                    ["--cs-hero-v1-bt-m" as string]:
                      textSizeOverride?.[0] ?? textStyleSpec.sizeMobile,
                    ["--cs-hero-v1-bt-d" as string]:
                      textSizeOverride?.[1] ?? textStyleSpec.sizeDesktop,
                  } as React.CSSProperties
                }
              >
                {text}
              </p>
            ) : null}

            {buttons.some((b) => b?.label) ? (
              <div className="mt-[20px] inline-flex max-w-[450px] flex-wrap gap-[10px]">
                {buttons.slice(0, 2).map((button, index) => (
                  <Button
                    key={index}
                    button={button}
                    index={index}
                    background={ctaBackground}
                    textColor={ctaTextColor}
                  />
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
});

export { V1 as default };
