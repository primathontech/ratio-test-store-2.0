"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Box, Text } from "@/ui/atomic";
import { ProductCard } from "@/ui/components/ProductCard";
import type { ProductCardProduct } from "@/ui/components/ProductCard/types";
import { ProductResponse, ProductVariant } from "../types";
import { getMostLovedProductsForComponent } from "../services/search-api";
import { ShimmerProductCard } from "./ShimmerProductCard";
import { useCartItems, useCartStore, type CartItem } from "@shopkit/cart";

function buildCartItem(product: ProductResponse): CartItem {
  return {
    id: product.variant?.id ?? product.id,
    productId: product.id,
    variantId: product.variant?.id,
    title: product.title,
    price: { amount: product.price ?? 0, currencyCode: "INR" },
    compareAtPrice:
      typeof product.compare_at_price === "number"
        ? {
            amount: product.compare_at_price,
            currencyCode: "INR",
          }
        : undefined,
    quantity: 1,
    image: product.image_url,
    product_type: product.productType,
  };
}

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

  const items = useCartItems();
  const loadingItems = useCartStore((s) => s.loadingItems);
  const addItem = useCartStore((s) => s.addItem);
  const incrementItem = useCartStore((s) => s.incrementItem);
  const decrementItem = useCartStore((s) => s.decrementItem);

  const findCartLine = useCallback(
    (product: ProductResponse) => {
      const productId = product.id;
      const variantId = product.variant?.id;

      return items.find((item) => {
        const lineProductId = item.productId ?? item.product_id;
        const lineVariantId = item.variantId ?? item.variant_id;

        return variantId
          ? lineProductId === productId && lineVariantId === variantId
          : lineProductId === productId;
      });
    },
    [items]
  );

  const incrementQuantity = useCallback(
    async (product: ProductResponse) => {
      const line = findCartLine(product);
      if (!line) {
        return;
      }
      try {
        await incrementItem(line.id, product.variant?.id);
      } catch (error) {
        console.error("[NoResult] incrementItem failed:", error);
      }
    },
    [findCartLine, incrementItem]
  );

  const decrementQuantity = useCallback(
    async (product: ProductResponse) => {
      const line = findCartLine(product);
      if (!line) {
        return;
      }
      try {
        await decrementItem(line.id, product.variant?.id);
      } catch (error) {
        console.error("[NoResult] decrementItem failed:", error);
      }
    },
    [decrementItem, findCartLine]
  );

  const isInCart = useCallback(
    (product: ProductResponse) => !!findCartLine(product),
    [findCartLine]
  );

  const getCartItem = useCallback(
    (product: ProductResponse) => findCartLine(product),
    [findCartLine]
  );

  const isProductLoading = useCallback(
    (product: ProductResponse) => {
      const cartLine = findCartLine(product);
      const variantId = product.variant?.id;
      return (
        (variantId ? !!loadingItems[variantId] : false) ||
        (cartLine?.id ? !!loadingItems[cartLine.id] : false)
      );
    },
    [findCartLine, loadingItems]
  );

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
    try {
      await addItem(buildCartItem(product));
    } catch (error) {
      console.error("[NoResult] addToCart failed:", error);
    }
  };

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
                        showAddToCartToast: true,
                        actionButtonText: "Add to cart",
                        actionButtonTextMobile: "Add to cart",
                        showBadge: true,
                        showRating: true,
                        soldOutText: "View Product",
                        soldOutTextMobile: "View Product",
                        backgroundColor: "white",
                        color: "#000000",
                        actionButtonTextColor: "#ffffff",
                        titleClassName:
                          "!font-normal !text-sm !line-clamp-2 overflow-hidden [display:-webkit-box] [-webkit-box-orient:vertical] !leading-[16px] !min-h-[30px] md:!min-h-[34px]",
                        imageClassName: "!rounded-[10px]",
                        detailsClassName: "!gap-[10px] md:!gap-[8px]",
                        priceSectionClassName:
                          "!font-semibold [&_span]:!font-medium !text-sm md:!text-base max-h-[16px] md:max-h-[30px]",
                        salePriceClassName: "leading-[16px] md:leading-[29px]",
                        actionButtonClassName:
                          "min-h-8 min-[769px]:min-h-[42px] !mt-0 !rounded-[10px] md:!rounded-[10px] !text-base tracking-[1px]",
                        linkClassName:
                          "px-1.5 md:px-[8px] lg:px-[15px] mb-3 md:mb-5",
                        compareAtPriceClassName:
                          "!text-sm md:!text-base !text-[#0000008C] !font-medium",
                        discountClassName: "!text-sm !text-[#F04438]",
                        ratingClassName: "!text-xs min-h-[19px]",
                        ratingValueClassName: "!text-[12px]",
                        reviewCountClassName: "!text-[12px]",
                        categoryChipClassName:
                          "!text-[#000000] !text-[14px] p-[8px]",
                        searchProductCard: true,
                      }}
                      showProductType={true}
                      showNetContent={false}
                      showSubtitle={false}
                      className="!border border-white md:!border-faq-border !rounded-[10px] w-full h-full px-0 md:px-1.5 !pr-0"
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
