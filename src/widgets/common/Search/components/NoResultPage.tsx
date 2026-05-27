"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Box, Text } from "@/ui/atomic";
import { ProductResponse, ProductVariant } from "../types";
import { getMostLovedProductsForComponent } from "../services/search-api";
import { ShimmerProductCard } from "./ShimmerProductCard";
import SearchProductCard from "./SearchProductCard";

/**
 * Every card in this section comes from the `bestseller` collection, so
 * the section heading reads "HERE ARE SOME OF OUR BESTSELLING PRODUCTS".
 * We force the Bestseller pill on every card by injecting the
 * `"best-seller"` tag — the shared `getProductLabel` resolver in
 * `badgeUtils.ts` maps that handleized key to the pink #ff5b6f badge
 * via `PRODUCT_TAG_LABELS_MAP`. Going through the tag path (rather than
 * the metafield path, which is hardcoded to green #82c341) keeps the
 * Bestseller pill pink here without changing the homepage Bestseller
 * (which is metafield-driven and stays green).
 *
 * Combined with `showDualBadges`, the tag slot always resolves to
 * Bestseller pink, while the metafield slot can still surface any
 * merchant-set label (e.g. "20% off") alongside it. The dedup in
 * `toCardProduct` collapses the case where both sources happen to
 * resolve to the same "Bestseller" label.
 */
const BESTSELLER_TAG = "best-seller";

interface NoResultPageProps {
  query?: string;
  className?: string;
  searchResults?: any;
  settings?: {
    noResultsMessage?: string;
    suggestionMessage?: string;
    bestsellingProductsTitle?: string;
  };
}

const NoResultPage: React.FC<NoResultPageProps> = ({
  query = "",
  className = "",
  settings = {},
}) => {
  const [mostLovedProducts, setMostLovedProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch most loved products on component mount (no shimmer - smooth load)
  useEffect(() => {
    const fetchMostLovedProducts = async () => {
      try {
        const result = await getMostLovedProductsForComponent(12);
        setMostLovedProducts(result.products || []);
      } catch (error) {
        setMostLovedProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMostLovedProducts();
  }, []);

  // Transform products for ProductCard component
  const transformedProducts = useMemo<ProductResponse[]>(() => {
    return mostLovedProducts.map((product) => {
      const price =
        typeof product.price === "number"
          ? product.price
          : parseFloat(product.price) || 0;
      const compareAtPrice =
        product.compare_at_price && product.compare_at_price !== product.price
          ? typeof product.compare_at_price === "number"
            ? product.compare_at_price
            : parseFloat(product.compare_at_price) || 0
          : 0;
      const imageUrl =
        product.images?.[0]?.url ||
        product.images?.[0]?.src ||
        product.image_url ||
        product.mainImage ||
        "";
      const images =
        product.images && product.images.length > 0
          ? product.images.map((img: any, i: number) => ({
              url: img.url || img.src,
              is_main: i === 0,
              alt: product.title,
            }))
          : imageUrl
            ? [{ url: imageUrl, is_main: true, alt: product.title }]
            : [];
      return {
        id: product.id ?? product.productId,
        title: product.title,
        handle: product.handle,
        status: product.status || "active",
        // Inject the bestseller tag — resolves to the pink #ff5b6f
        // badge via PRODUCT_TAG_LABELS_MAP. See BESTSELLER_TAG comment
        // above for why this is preferred over the metafield path.
        tags: [...(product.tags || []), BESTSELLER_TAG],
        productType: product.productType || "",
        price,
        compare_at_price: compareAtPrice || null,
        image_url: imageUrl,
        images,
        product_availability: product.status === "active",
        availableForSale: product.status === "active",
        variant: {
          id:
            (product as any).variantId ??
            (product as any).variant?.id ??
            (product as any).variants?.[0]?.variantId ??
            String(product.id ?? product.productId ?? ""),
          title: "Default Title",
          price,
          compare_at_price: compareAtPrice,
          availableForSale: product.status === "active",
          availableQuantity: 10,
        } as ProductVariant,
        average_rating: String(
          product.rating ?? product.averageRating ?? "4.5"
        ),
        rating_count: String(
          product.reviewsCount ?? product.ratingCount ?? "0"
        ),
        metadata: product.metadata ?? {},
      };
    });
  }, [mostLovedProducts]);

  return (
    <Box
      className={`w-full mt-0 md:mt-[30px] mb-[50px] px-1.5 min-[769px]:px-[10px] ${className}`}
    >
      {/* No Results Message */}
      <Box className="text-center justify-center mb-2.5 md:mb-5">
        <Text className="!text-xl md:!text-[25px] lg:!text-3xl !text-center font-medium !text-black mb-5 !break-words !tracking-[-1px]">
          {settings.noResultsMessage || "We're sorry. There are no results for"}{" "}
          <span className="block md:inline">'{query}'</span>
        </Text>
        <Text className="!text-black !text-xs uppercase tracking-wide !text-center mb-[35px]">
          {settings.suggestionMessage ||
            "PLEASE CHECK THE SPELLING OR TRY AGAIN WITH A LESS SPECIFIC OR DIFFERENT TERM."}
        </Text>
      </Box>

      {/* Best Sellers Section */}
      <Box className="w-full bg-white text-black">
        <div>
          <div>
            {/* Section Title */}
            <div className="my-2.5 lg:!text-center pb-[5px]">
              <div className="flex items-center justify-center gap-4 max-w-[1375px]">
                <div className="flex-1 h-[2.4px] bg-black hidden lg:block mt-[10px]" />
                <Text className="!text-[17px] lg:!text-xl !font-semibold !text-black md:whitespace-nowrap tracking-[-1px] !text-center mt-[10px]">
                  {settings.bestsellingProductsTitle ||
                    "HERE ARE SOME OF OUR BESTSELLING PRODUCTS"}
                </Text>
                <div className="flex-1 h-[2.4px] bg-black hidden lg:block mt-[10px]" />
              </div>
            </div>

            {/* Products Grid - show shimmer while loading, then products */}
            {isLoading ? (
              <div className="grid grid-cols-2 min-[768px]:grid-cols-3 min-[1024px]:grid-cols-4">
                {Array.from({ length: 6 }).map((_, index) => (
                  <ShimmerProductCard
                    key={`shimmer-${index}`}
                    className="h-full rounded-none min-[769px]:rounded-[10px]"
                    settings={{
                      cardLayoutSettings: {
                        backgroundColor: "white",
                        borderRadius: "10px",
                        padding: "0px",
                        border: "0px solid transparent",
                      },
                    }}
                  />
                ))}
              </div>
            ) : transformedProducts.length > 0 ? (
              <div className="grid grid-cols-2 min-[768px]:grid-cols-3 min-[1024px]:grid-cols-4">
                {transformedProducts.map((product, index) => (
                  <SearchProductCard
                    key={product.id || index}
                    product={product}
                    showDualBadges
                    secondaryBadgeClassName="!mt-[2px] min-[768px]:!mt-[4px]"
                    settings={{
                      showAddToCartToast: true,
                      actionButtonText: "Add to cart",
                      soldOutText: "View Product",
                    }}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Text className="text-gray-500">
                  No products available at the moment.
                </Text>
              </div>
            )}
          </div>
        </div>
      </Box>
    </Box>
  );
};

export default NoResultPage;
