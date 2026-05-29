"use client";

import React, { memo } from "react";
import { BannerCarousel } from "../../BannerCarousel";
import { SalePageBanner } from "../../SalePageBanner";
import type { CollectionHeroBannerProps } from "../types";
import { extractBannerData } from "../utils/extractBannerData";
import { extractSalePromoBannerData } from "../utils/extractSalePromoBannerData";

/**
 * CollectionHeroBanner V1
 *
 * Reads the active collection's metadata banners (v2 collection API) and
 * delegates rendering to the shared BannerCarousel widget. When the API
 * returns no banners, falls back to `settings.bannerCarousel`.
 */
export const V1 = memo(function CollectionHeroBannerV1({
  data,
  settings,
  className,
  locale,
}: CollectionHeroBannerProps) {
  const {
    bannerCarousel = [],
    autoplayInterval = 5000,
    autoplay = true,
    loop = true,
    pauseOnHover = true,
    draggable = true,
    showIndicators = true,
    indicatorType = "simple",
    mobileAspectRatio = "1/1",
    desktopAspectRatio = "182/57",
    style,
  } = settings ?? {};

  // When the collection exposes `sale_promo_banner` + `how_to_shop` metadata,
  // override the standard banner carousel with the SalePageBanner widget
  // (matches bblunt.com/collections/sale-page behavior).
  const salePromoSettings = extractSalePromoBannerData(data ?? {});
  if (salePromoSettings) {
    return (
      <div data-testid="collection-hero-banner-v1-sale-promo">
        <SalePageBanner settings={salePromoSettings} className={className} />
      </div>
    );
  }

  const dynamicBannerCarousel = extractBannerData(data ?? {});
  const finalBannerCarousel =
    dynamicBannerCarousel.length > 0 ? dynamicBannerCarousel : bannerCarousel;

  if (finalBannerCarousel.length === 0) {
    return null;
  }

  const bannerCarouselSettings = {
    variant: "v1" as const,
    bannerCarousel: finalBannerCarousel,
    autoplayInterval,
    autoplay,
    loop,
    pauseOnHover,
    draggable,
    showIndicators,
    indicatorType,
    mobileAspectRatio,
    desktopAspectRatio,
    className,
    style,
  };

  return (
    <div data-testid="collection-hero-banner-v1">
      <BannerCarousel
        data={data}
        settings={bannerCarouselSettings}
        className={className}
        locale={locale}
      />
    </div>
  );
});
