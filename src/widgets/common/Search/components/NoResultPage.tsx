"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Box, Text } from "@/ui/atomic";
import { ProductCard } from "@/ui/components/ProductCard";
import type { ProductCardProduct } from "@/ui/components/ProductCard/types";
import { ProductResponse, ProductVariant } from "../types";
import { getMostLovedProductsForComponent } from "../services/search-api";
import { ShimmerProductCard } from "./ShimmerProductCard";

/** Inlined badge tag keys (was @/widgets/bblunt/ProductGrid/constant). */
const BADGE_TAG_KEYS = new Set([
  "best-seller",
  "bestseller",
  "new",
  "new-launch",
  "trending",
  "deal",
  "offer",
]);

const normalizeTag = (tag: string) =>
  tag
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");

const withFallbackBadgeTag = (tags: string[]) => {
  const hasBadgeTag = tags.some((tag) => BADGE_TAG_KEYS.has(normalizeTag(tag)));
  return hasBadgeTag ? tags : [...tags, "best-seller"];
};

function pickBadge(tags: string[]): {
  label?: string;
  variant?: "trending" | "new" | "bestseller" | "deal";
} {
  const lowered = tags.map((t) => normalizeTag(t));
  if (lowered.some((t) => t.includes("bestseller") || t === "best-seller")) {
    return { label: "Best Seller", variant: "bestseller" };
  }
  if (lowered.some((t) => t === "new" || t.includes("new-launch"))) {
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

/** Map ProductResponse → ProductCardProduct (paise → rupees, images, badge from tags). */
function toCardProduct(product: ProductResponse): ProductCardProduct {
  const priceRupees = (product.price ?? 0) / 100;
  const compareAtRupees =
    product.compare_at_price != null
      ? product.compare_at_price / 100
      : undefined;
  const discount =
    compareAtRupees != null && compareAtRupees > priceRupees
      ? `${Math.round(((compareAtRupees - priceRupees) / compareAtRupees) * 100)}% OFF`
      : undefined;

  const images = Array.isArray(product.images) ? product.images : [];
  const mainImage =
    images.find((i) => i?.is_main)?.url ??
    images[0]?.url ??
    product.image_url ??
    "";
  const hoverImage = images[1]?.url ?? mainImage;

  const badge = pickBadge(product.tags ?? []);

  return {
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

  // Cart wiring temporarily disabled — no-ops matching the previous hook
  // shape. To re-enable, restore the `@/lib/hooks` import + destructure.
  const addToCart = async (_product?: unknown, _variantId?: string) => {
    /* no-op */
  };
  const incrementQuantity = async (_product?: unknown) => {
    /* no-op */
  };
  const decrementQuantity = async (_product?: unknown) => {
    /* no-op */
  };
  const isInCart = (_product?: unknown) => false;
  const getCartItem = (_product?: unknown) => undefined;
  const isProductLoading = (_product?: unknown) => false;

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
        tags: withFallbackBadgeTag(product.tags || []),
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

  const handleAddToCart = async (product: ProductResponse) => {
    const payload = {
      ...product,
      quantity: 1,
      variants: product?.variant ? [product.variant] : undefined,
    } as ProductResponse & { variants?: Array<{ id: string; price?: number }> };
    const variantIdArg = product?.variant?.id;
    try {
      await addToCart(payload, variantIdArg);
    } catch (error) {
      console.error("[NoResult] addToCart failed:", error);
    }
  };

  return (
    <Box
      className={`w-full mt-0 md:mt-[30px] mb-[50px] px-1.5 min-[769px]:px-[30px] ${className}`}
    >
      {/* No Results Message */}
      <Box className="text-center justify-center mb-2.5 md:mb-5">
        <Text className="!text-xl md:!text-[25px] lg:!text-3xl !text-center font-medium !text-black mb-5 !break-words !tracking-[-1px]">
          {settings.noResultsMessage || "We're sorry. There are no results for"}{" "}
          <span className="block md:inline">'{query}'</span>
        </Text>
        <Text className="!text-black !text-xs uppercase tracking-wide !text-center mb-5">
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
              <div className="flex items-center justify-center gap-4">
                <div className="flex-1 h-0.5 bg-black hidden lg:block" />
                <Text className="!text-[17px] lg:!text-xl !font-semibold !text-black md:whitespace-nowrap tracking-[-1px] !text-center">
                  {settings.bestsellingProductsTitle ||
                    "HERE ARE SOME OF OUR BESTSELLING PRODUCTS"}
                </Text>
                <div className="flex-1 h-0.5 bg-black hidden lg:block" />
              </div>
            </div>

            {/* Products Grid - show shimmer while loading, then products */}
            {isLoading ? (
              <div className="grid grid-cols-2 min-[768px]:grid-cols-3 min-[1024px]:grid-cols-4 gap-3 md:gap-[30px]">
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
              <div className="grid grid-cols-2 min-[768px]:grid-cols-3 min-[1024px]:grid-cols-4 gap-3 md:gap-[30px]">
                {transformedProducts.map((product, index) => {
                  const cardProduct = toCardProduct(product);
                  const productAddToCart = () => handleAddToCart(product);
                  const productIncrement = () => incrementQuantity(product);
                  const productDecrement = () => decrementQuantity(product);
                  return (
                    <ProductCard
                      key={product.id || index}
                      product={cardProduct}
                      isSoldOut={!product.availableForSale}
                      onAddToCart={productAddToCart}
                      onIncrement={productIncrement}
                      onDecrement={productDecrement}
                      isInCart={isInCart(product)}
                      cartItem={getCartItem(product)}
                      isQuantityLoading={isProductLoading(product)}
                      settings={{
                        showActionButton: true,
                        showQuantitySelector: false,
                        actionButtonText: "Add to cart",
                        actionButtonTextMobile: "Add to cart",
                        showBadge: true,
                        showRating: true,
                        soldOutText: "View Product",
                        soldOutTextMobile: "View Product",
                        backgroundColor: "white",
                        color: "#000",
                        actionButtonTextColor: "#ffffff",
                        actionButtonClassName:
                          "min-h-8 min-[767px]:min-h-[42px] !mt-0 !rounded-[10px] min-[769px]:!rounded !text-base",
                        titleClassName:
                          "!font-normal !text-sm !line-clamp-2 overflow-hidden [display:-webkit-box] [-webkit-box-orient:vertical] !min-h-9",
                        priceSectionClassName:
                          "!font-semibold [&_span]:!font-medium !text-sm md:!text-base",
                        detailsClassName: "!gap-[13px] mt-2",
                        ratingClassName: "!text-xs",
                        imageClassName: "!rounded-[10px]",
                      }}
                      className="!border-0 min-[769px]:!border border-faq-border rounded-[10px] px-0 md:px-2"
                      showProductType={false}
                    />
                  );
                })}
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
