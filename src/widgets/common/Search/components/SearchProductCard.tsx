"use client";

import React from "react";
import { CartAwareProductCard } from "@/ui/components/CartAwareProductCard";
import type { ProductResponse } from "../types";

interface SearchProductCardSettings {
  actionButtonText?: string;
  soldOutText?: string;
  showAddToCartToast?: boolean;
}

interface SearchProductCardProps {
  product: ProductResponse;
  settings?: SearchProductCardSettings;
  searchProductCard?: boolean;
}

/**
 * Search-results product card. Pure presentational wrapper that pins the
 * search-specific styling on top of `<CartAwareProductCard>`. Cart wiring
 * + API → card mapping are handled by the shared component.
 *
 * `ProductResponse` is structurally compatible with `MappableApiProduct`,
 * so the shared `toCardProduct` mapper accepts it directly.
 */
const SearchProductCard: React.FC<SearchProductCardProps> = ({
  product,
  settings,
  searchProductCard = true,
}) => (
  <CartAwareProductCard
    apiProduct={product}
    logTag="Search"
    settings={{
      showActionButton: true,
      showQuantitySelector: false,
      showAddToCartToast: settings?.showAddToCartToast ?? false,
      actionButtonText: settings?.actionButtonText || "Add to cart",
      showBadge: true,
      showRating: true,
      soldOutText: settings?.soldOutText || "View Product",
      backgroundColor: "white",
      color: "#000000",
      actionButtonTextColor: "#ffffff",
      titleClassName:
        "!font-normal !text-sm !line-clamp-2 overflow-hidden [display:-webkit-box] [-webkit-box-orient:vertical] !leading-[16px] !min-h-[30px] md:!min-h-[34px]",
      imageClassName: "!rounded-[10px]",
      detailsClassName: "!gap-[10px] md:!gap-[8px]",
      priceSectionClassName:
        "!flex-row !items-center !gap-[6px] !font-semibold [&_span]:!font-medium !text-sm md:!text-base md:max-h-[30px] !min-h-[16px]",
      salePriceClassName: "leading-[16px] md:leading-[29px]",
      actionButtonClassName:
        "min-h-8 min-[769px]:min-h-[42px] !mt-0 !rounded-[10px] md:!rounded-[10px] !text-base tracking-[1px]",
      linkClassName: "px-1.5 md:px-[8px] lg:px-[15px] mb-3 md:mb-5",
      compareAtPriceClassName:
        "!text-sm md:!text-base !text-[#0000008C] !font-medium",
      discountClassName: "!text-sm !text-[#F04438]",
      ratingClassName: "!text-xs min-h-[19px]",
      ratingValueClassName: "!text-[12px]",
      reviewCountClassName: "!text-[12px]",
      categoryChipClassName: "!text-[#000000] !text-[14px] p-[8px]",
      searchProductCard,
    }}
    showProductType
    showNetContent={false}
    showSubtitle={false}
    className="!border border-white lg:!border-faq-border !rounded-[10px] w-full h-full px-0 md:px-1.5 !pr-0"
  />
);

export default SearchProductCard;
