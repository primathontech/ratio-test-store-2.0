"use client";

import React, { memo } from "react";
import Image from "next/image";
import Link from "next/link";
import { HeroBannerProps } from "../types";
import { resolveImage } from "@/widgets/utils/resolveImageSrc";

/**
 * HeroBanner V1
 *
 * Full-width responsive hero banner for promotional/landing pages.
 * Uses two separate Next.js Image components for responsive art direction:
 * - Desktop image (>=768px): ~2.72:1 aspect ratio (1440x529 natural)
 * - Mobile image (<768px): 1:1 aspect ratio (1200x1200 natural)
 *
 * All text content (headline, promo code, CTA button) is baked into the
 * banner images. No HTML text overlays are rendered.
 */
export const V1 = memo(function HeroBannerV1({
  settings,
  className,
}: HeroBannerProps) {
  const desktop = resolveImage(settings?.desktopImage, {
    src: "/HeroBanner/images/hero-desktop.jpg",
    alt: settings?.alt || "Promotional Hero Banner",
  });
  const mobile = resolveImage(settings?.mobileImage, {
    src: "/HeroBanner/images/hero-mobile.jpg",
    alt: settings?.alt || "Promotional Hero Banner",
  });
  const desktopImage = desktop.src;
  const mobileImage = mobile.src;
  const desktopAlt = desktop.alt;
  const mobileAlt = mobile.alt;
  const href = settings?.href;
  const mobileAspectRatio = settings?.mobileAspectRatio || "1 / 1";
  const desktopAspectRatio = settings?.desktopAspectRatio || "1440 / 529";

  const toCssRatio = (ratio: string) => ratio.replace("/", " / ");
  const desktopStyle: React.CSSProperties = {
    aspectRatio: toCssRatio(desktopAspectRatio),
    height: "auto",
  };
  const mobileStyle: React.CSSProperties = {
    aspectRatio: toCssRatio(mobileAspectRatio),
    height: "auto",
  };

  const bannerContent = (
    <>
      {/* Desktop / Tablet image (>=768px). Width/height passed for next/image
       *  intrinsic-size hint only — actual rendered size is controlled by
       *  the CSS aspect-ratio + 100% width. */}
      <Image
        src={desktopImage}
        alt={desktopAlt}
        width={1440}
        height={529}
        priority
        className="hidden md:block w-full object-cover"
        sizes="100vw"
        style={desktopStyle}
      />
      {/* Mobile image (<768px) */}
      <Image
        src={mobileImage}
        alt={mobileAlt}
        width={1200}
        height={1200}
        priority
        className="block md:hidden w-full object-cover"
        sizes="100vw"
        style={mobileStyle}
      />
    </>
  );

  if (href) {
    return (
      <section className={`w-full overflow-hidden ${className || ""}`}>
        <Link href={href} className="block w-full">
          {bannerContent}
        </Link>
      </section>
    );
  }

  return (
    <section className={`w-full overflow-hidden ${className || ""}`}>
      {bannerContent}
    </section>
  );
});
