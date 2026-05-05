"use client";

import React from "react";
import { ProductCard } from "@/ui/components/ProductCard";
import type { ProductCardProduct } from "@/ui/components/ProductCard/types";
import type { ProductResponse } from "../types";

interface SearchProductCardSettings {
  actionButtonText?: string;
  actionButtonTextMobile?: string;
  soldOutText?: string;
  soldOutTextMobile?: string;
}

interface SearchProductCardProps {
  product: ProductResponse;
  onAddToCart: () => void;
  onIncrement: () => void;
  onDecrement: () => void;
  isInCart: boolean;
  cartItem?: { quantity?: number } | undefined;
  isQuantityLoading: boolean;
  settings?: SearchProductCardSettings;
  searchProductCard?: boolean;
}

/** Pull "best looking" badge label from product.tags. Mirrors the reference logic. */
function pickBadge(tags: string[] | undefined): {
  label?: string;
  variant?: "trending" | "new" | "bestseller" | "deal";
} {
  if (!Array.isArray(tags) || tags.length === 0) {
    return {};
  }
  const lowered = tags.map((t) => t.toLowerCase());
  if (lowered.some((t) => t.includes("bestseller"))) {
    return { label: "Best Seller", variant: "bestseller" };
  }
  if (lowered.some((t) => t.includes("new"))) {
    return { label: "New", variant: "new" };
  }
  if (lowered.some((t) => t.includes("trending"))) {
    return { label: "Trending", variant: "trending" };
  }
  if (lowered.some((t) => t.includes("deal") || t.includes("offer"))) {
    return { label: "Deal", variant: "deal" };
  }
  return {};
}

/** Map a `ProductResponse` (paise prices, raw images) → `ProductCardProduct`
 *  (rupees, mainImage / hoverImage, badge derived from tags, percent off). */
function toCardProduct(product: ProductResponse): ProductCardProduct {
  const priceRupees = (product.price ?? 0) / 100;
  const compareAtRupees =
    product.compare_at_price != null
      ? product.compare_at_price / 100
      : undefined;
  const discount =
    compareAtRupees != null && compareAtRupees > priceRupees
      ? `${Math.round(((compareAtRupees - priceRupees) / compareAtRupees) * 100)}% off`
      : undefined;

  const images = Array.isArray(product.images) ? product.images : [];
  const mainImage =
    images.find((i) => i?.is_main)?.url ??
    images[0]?.url ??
    product.image_url ??
    "";
  const hoverImage = images[1]?.url ?? mainImage;

  const badge = pickBadge(product.tags);

  return {
    id: product.id,
    href: `/products/${product.handle}`,
    title: product.title,
    alt: product.title,
    mainImage,
    hoverImage,
    category: product.productType ?? "",
    badge: badge.label,
    badgeVariant: badge.variant,
    rating: Number(product.average_rating ?? 0) || 0,
    reviewCount: Number(product.rating_count ?? 0) || 0,
    salePrice: priceRupees,
    originalPrice: compareAtRupees,
    discount,
  };
}

/**
 * Search-results product card. Thin wrapper around the shared `ProductCard`
 * — the reference SearchProductCard does the same: it just configures
 * settings + forwards cart action props.
 */
const SearchProductCard: React.FC<SearchProductCardProps> = ({
  product,
  onAddToCart,
  onIncrement,
  onDecrement,
  isInCart,
  cartItem,
  isQuantityLoading,
  settings,
  searchProductCard = true,
}) => (
  <ProductCard
    product={toCardProduct(product)}
    isSoldOut={!product.availableForSale}
    onAddToCart={onAddToCart}
    onIncrement={onIncrement}
    onDecrement={onDecrement}
    isInCart={isInCart}
    cartItem={cartItem}
    isQuantityLoading={isQuantityLoading}
    settings={{
      showActionButton: true,
      showQuantitySelector: true,
      actionButtonText: settings?.actionButtonText || "Add to cart",
      actionButtonTextMobile: settings?.actionButtonTextMobile || "Add to cart",
      showBadge: true,
      showRating: true,
      soldOutText: settings?.soldOutText || "View Product",
      soldOutTextMobile: settings?.soldOutTextMobile || "View Product",
      backgroundColor: "white",
      color: "#000000",
      actionButtonTextColor: "#ffffff",
      titleClassName:
        "!font-normal !text-sm !line-clamp-2 overflow-hidden [display:-webkit-box] [-webkit-box-orient:vertical]",
      imageClassName: "!rounded-[10px]",
      detailsClassName: "!gap-2.5",
      priceSectionClassName:
        "!font-semibold [&_span]:!font-medium !text-sm md:!text-base",
      actionButtonClassName:
        "min-h-8 min-[769px]:min-h-[42px] !mt-0 !rounded-[10px] md:!rounded-[10px] !text-base",
      linkClassName: "px-1.5 md:px-[15px] mb-3 md:mb-5",
      compareAtPriceClassName:
        "!text-sm md:!text-base !text-[#0000008C] !font-medium",
      discountClassName: "!text-sm !text-[#F04438]",
      ratingClassName: "!text-xs",
      searchProductCard,
    }}
    showProductType={true}
    showNetContent={false}
    showSubtitle={false}
    className="!border border-white md:!border-faq-border !rounded-[10px] w-full h-full px-0 md:px-1.5 "
  />
);

export default SearchProductCard;
