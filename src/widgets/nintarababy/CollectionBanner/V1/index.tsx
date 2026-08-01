"use client";

import React, { memo, useMemo } from "react";
import { usePathname } from "next/navigation";
import { CollectionBannerProps } from "../types";
import "../style.css";

/* =====================================================================
   V1 — Full-width responsive collection banner

   Renders a <picture> element with two <source> tags:
   - Desktop (>=768px): wide landscape banner 1600x349px
   - Mobile (<=767px): portrait-ish banner with aspect-ratio 3/2

   Category labels (Sleep, Feeding, Bath) are painted into the
   images themselves — no overlay DOM elements needed.

   No hover, no click, no scroll, no focus interactions.
   ===================================================================== */

export const V1 = memo(function V1({
  data,
  settings,
  className,
}: CollectionBannerProps) {
  const pathname = usePathname();
  const rawData = data as Record<string, unknown> | undefined;
  const apiCollections = Array.isArray((rawData as any)?.data)
    ? ((rawData as any).data as Array<Record<string, any>>)
    : null;

  // Find the current collection by matching URL handle
  const currentCollection = useMemo(() => {
    if (!apiCollections) {
      return null;
    }
    const segments = pathname?.split("/") ?? [];
    const handle = segments[segments.length - 1];
    return apiCollections.find((c) => c.handle === handle) ?? null;
  }, [apiCollections, pathname]);

  const colData = currentCollection?.data ?? currentCollection;
  const desktopSrc =
    colData?.metadata?.collection_banner_desktop?.value?.[0] || null;
  const mobileSrc =
    colData?.metadata?.collection_banner_mobile?.value?.[0] || null;
  const altText = colData?.title ?? data?.altText ?? "Shop All";

  if (!desktopSrc && !mobileSrc) {
    return null;
  }

  return (
    <section
      className={`nintara-cb ${className ?? ""}`}
      aria-label="Collection banner"
    >
      <div className="nintara-cb__wrapper">
        <picture className="nintara-cb__picture">
          {mobileSrc && (
            <source media="(max-width: 767px)" srcSet={mobileSrc} />
          )}
          {desktopSrc && (
            <source media="(min-width: 768px)" srcSet={desktopSrc} />
          )}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={desktopSrc || mobileSrc || ""}
            alt={altText}
            className="nintara-cb__img"
            loading="eager"
            decoding="async"
            fetchPriority="high"
          />
        </picture>
      </div>
    </section>
  );
});

export { V1 as default };
