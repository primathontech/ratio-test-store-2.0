"use client";

import React, { memo, useMemo, useCallback } from "react";
import type { FeaturedCollectionCarouselProps, ApiProduct } from "../types";
import { ProductCard } from "@/ui/components/ProductCard";
import type { ProductCardProduct } from "@/ui/components/ProductCard/types";
import { getProductLabel } from "@/ui/components/ProductCard/badgeUtils";
import { SwipeCarousel } from "@/ui/components/SwipeCarousel";
import { useCartItems, useCartStore, type CartItem } from "@shopkit/cart";
import { LazyViewAllButton } from "../components/LazyViewAllButton";

/* ------------------------------------------------------------------ */
/*  SVG Icons                                                          */
/* ------------------------------------------------------------------ */

const PrevArrowIcon = () => (
  <svg
    width="7"
    height="11"
    viewBox="0 0 7 11"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M5.5 11L0 5.5L5.5 0L6.47625 0.97625L1.9525 5.5L6.47625 10.0238L5.5 11Z"
      fill="currentColor"
    />
  </svg>
);

const NextArrowIcon = () => (
  <svg
    width="7"
    height="11"
    viewBox="0 0 7 11"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M1.5 11L7 5.5L1.5 0L0.52375 0.97625L5.0475 5.5L0.52375 10.0238L1.5 11Z"
      fill="currentColor"
    />
  </svg>
);

/* ------------------------------------------------------------------ */
/*  Transform: API product → ProductCardProduct                        */
/* ------------------------------------------------------------------ */

function transformApiProduct(product: ApiProduct): ProductCardProduct {
  const mainImg =
    product.images?.find((img) => img.is_main)?.url || product.image_url || "";
  const hoverImg = product.images?.find((img) => !img.is_main)?.url || mainImg;
  const alt =
    product.images?.find((img) => img.is_main)?.alt ||
    product.title ||
    "Product image";

  // API prices are in paisa (59900 = ₹599)
  const salePrice = product.price ? product.price / 100 : 0;
  const originalPrice = product.compare_at_price
    ? product.compare_at_price / 100
    : undefined;

  let discount: string | undefined;
  if (originalPrice && originalPrice > salePrice && salePrice > 0) {
    const pct = Math.round(((originalPrice - salePrice) / originalPrice) * 100);
    discount = `${pct}% off`;
  }

  // Resolve badge: metafield first, tag fallback (matches bblunt reference).
  const resolvedBadge = getProductLabel(
    product.metadata?.product_labels?.value,
    product.tags
  );

  return {
    id: product.id,
    productId: product.id,
    variantId: product.variant?.id,
    availableForSale:
      typeof product.availableForSale === "boolean"
        ? product.availableForSale
        : product.variant?.availableForSale,
    href: `/products/${product.handle}`,
    title: product.title,
    alt,
    mainImage: mainImg,
    hoverImage: hoverImg,
    category: product.productType || "",
    badge: resolvedBadge?.label,
    badgeBackground: resolvedBadge?.background,
    rating: product.average_rating || 0,
    reviewCount: product.rating_count || 0,
    salePrice,
    originalPrice,
    discount,
    weight: product.metadata?.product_net_content?.value || "250g",
    description:
      product.metadata?.product_subtitle?.value ||
      "Reduces Up to 93% Hair Fall | Strengthens & Nourishes Hair",
  };
}

/* ------------------------------------------------------------------ */
/*  Extract products from COLLECTION API response                      */
/* ------------------------------------------------------------------ */

interface ExtractedCollection {
  products: ApiProduct[];
  totalProducts: number;
  handle: string;
}

function extractFromData(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any
): ExtractedCollection | null {
  if (!data || !data.success) {
    return null;
  }

  const collection = data.data;
  const products = collection?.products;

  if (!Array.isArray(products) || products.length === 0) {
    return null;
  }

  return {
    products: products as ApiProduct[],
    totalProducts: collection?.productPagination?.total || products.length,
    handle: collection?.handle || "",
  };
}

/* ------------------------------------------------------------------ */
/*  Cart-aware product card wrapper                                    */
/* ------------------------------------------------------------------ */

function buildCartItem(
  product: ApiProduct,
  cardProduct: ProductCardProduct
): CartItem {
  const variantId = product.variant?.id;
  const productId = product.id;
  const lineId = variantId ?? productId;

  return {
    id: lineId,
    productId,
    variantId,
    sku: product.variant?.sku,
    title: product.title,
    price: { amount: product.price ?? 0, currencyCode: "INR" },
    compareAtPrice:
      typeof product.compare_at_price === "number"
        ? { amount: product.compare_at_price, currencyCode: "INR" }
        : undefined,
    quantity: 1,
    image: cardProduct.mainImage,
    product_type: product.productType,
  };
}

interface FeaturedCarouselCardProps {
  product: ApiProduct;
  actionButtonText?: string;
  soldOutText?: string;
}

const FeaturedCarouselCard = memo(function FeaturedCarouselCard({
  product,
  actionButtonText,
  soldOutText,
}: FeaturedCarouselCardProps) {
  const cardProduct = useMemo(() => transformApiProduct(product), [product]);
  const productId = product.id;
  const variantId = product.variant?.id;

  const items = useCartItems();
  const cartLine = useMemo(
    () =>
      items.find((i) => {
        const lineProductId = i.productId ?? i.product_id;
        const lineVariantId = i.variantId ?? i.variant_id;
        return variantId
          ? lineProductId === productId && lineVariantId === variantId
          : lineProductId === productId;
      }),
    [items, productId, variantId]
  );
  const loadingItems = useCartStore((s) => s.loadingItems);
  const addItem = useCartStore((s) => s.addItem);
  const incrementItem = useCartStore((s) => s.incrementItem);
  const decrementItem = useCartStore((s) => s.decrementItem);

  const isInCart = !!cartLine;
  const isQuantityLoading =
    (variantId ? !!loadingItems[variantId] : false) ||
    (cartLine?.id ? !!loadingItems[cartLine.id] : false);

  const handleAddToCart = useCallback(async () => {
    if (cardProduct.availableForSale === false) {
      return;
    }
    try {
      await addItem(buildCartItem(product, cardProduct));
    } catch (error) {
      console.error("[FeaturedCollectionCarousel] addItem failed:", error);
    }
  }, [addItem, product, cardProduct]);

  const handleIncrement = useCallback(async () => {
    if (!cartLine) {
      return;
    }
    try {
      await incrementItem(cartLine.id, variantId);
    } catch (error) {
      console.error(
        "[FeaturedCollectionCarousel] incrementItem failed:",
        error
      );
    }
  }, [incrementItem, cartLine, variantId]);

  const handleDecrement = useCallback(async () => {
    if (!cartLine) {
      return;
    }
    try {
      await decrementItem(cartLine.id, variantId);
    } catch (error) {
      console.error(
        "[FeaturedCollectionCarousel] decrementItem failed:",
        error
      );
    }
  }, [decrementItem, cartLine, variantId]);

  return (
    <ProductCard
      product={cardProduct}
      settings={{
        showAddToCartToast: true,
        ...(actionButtonText ? { actionButtonText } : {}),
        ...(soldOutText ? { soldOutText } : {}),
      }}
      onAddToCart={handleAddToCart}
      onIncrement={handleIncrement}
      onDecrement={handleDecrement}
      isInCart={isInCart}
      cartItem={cartLine}
      isQuantityLoading={isQuantityLoading}
    />
  );
});

/* ------------------------------------------------------------------ */
/*  Carousel breakpoints                                               */
/* ------------------------------------------------------------------ */

const DEFAULT_CAROUSEL_BREAKPOINTS = [
  { minWidth: 0, cards: 2.3, gap: 0 },
  { minWidth: 768, cards: 3, gap: 0 },
  { minWidth: 1024, cards: 4, gap: 0 },
  { minWidth: 1440, cards: 5, gap: 0 },
];

/* ------------------------------------------------------------------ */
/*  Main V1 Component                                                  */
/* ------------------------------------------------------------------ */

export const V1 = memo(function V1({
  data,
  settings,
}: FeaturedCollectionCarouselProps) {
  const headingRich = settings?.heading || "";
  const actionButtonText = settings?.actionButtonText;
  const soldOutText = settings?.soldOutText;
  const carouselBreakpoints =
    settings?.carouselBreakpoints && settings.carouselBreakpoints.length > 0
      ? settings.carouselBreakpoints
      : DEFAULT_CAROUSEL_BREAKPOINTS;

  const extracted = useMemo(() => extractFromData(data), [data]);

  const products = useMemo(
    () => extracted?.products ?? [],
    [extracted?.products]
  );
  const totalProducts = extracted?.totalProducts ?? 0;
  // Server-fetched handle is the source of truth (data source already specifies
  // it). View All target defaults to the same; settings can override.
  const handle = extracted?.handle || "";
  const viewAllCollectionHandle = settings?.viewAllCollectionHandle || handle;

  const renderProduct = useCallback(
    (idx: number) => {
      const product = products[idx];
      if (!product) {
        return null;
      }
      return (
        <div className="md:border-r md:border-[#EBEBEB] overflow-hidden">
          <FeaturedCarouselCard
            product={product}
            actionButtonText={actionButtonText}
            soldOutText={soldOutText}
          />
        </div>
      );
    },
    [products, actionButtonText, soldOutText]
  );

  if (products.length === 0) {
    return null;
  }

  return (
    <section
      className="relative overflow-hidden pb-[32.4px] md:pb-14"
      style={{
        backgroundColor: "#ffffff",
      }}
    >
      {/* Content overlay */}
      <div className="relative z-[1] mx-auto xl:mx-5 px-1.5 md:px-[30px] xl:px-[50px]">
        {/* Heading */}
        <div className="flex flex-col items-start md:items-center text-center mb-6 md:mb-[30px] px-[15px]">
          {/* Heading — rich HTML; <strong> in the source becomes the bold part. */}
          <h4
            className="text-2xl xl:text-[28px] leading-[29px] md:leading-[34px] [&_strong]:font-bold"
            style={{
              color: "#1D1D1D",
              fontWeight: 400,
              margin: 0,
            }}
            // eslint-disable-next-line no-restricted-syntax
            dangerouslySetInnerHTML={{ __html: headingRich }}
          />
        </div>

        {/* Carousel area */}
        <div className="group xl:mx-auto xl:max-w-[1300px] md:border md:border-[#EBEBEB] md:rounded-lg overflow-hidden">
          <SwipeCarousel
            itemCount={products.length}
            breakpoints={carouselBreakpoints}
            renderItem={renderProduct}
            renderPrev={(onClick, disabled) => (
              <button
                type="button"
                onClick={onClick}
                disabled={disabled}
                className={`absolute left-[13px] z-[3] hidden lg:flex items-center justify-center cursor-pointer -translate-y-1/2 lg:opacity-0 lg:translate-x-[20px] lg:group-hover:translate-x-0 ${
                  disabled
                    ? "lg:group-hover:opacity-40"
                    : "lg:group-hover:opacity-100 hover:!bg-white hover:!text-black hover:!border-white"
                }`}
                style={{
                  top: "245px",
                  width: "46px",
                  height: "46px",
                  borderRadius: "9999px",
                  backgroundColor: disabled
                    ? "rgba(255,255,255,0.2)"
                    : "rgb(0,0,0)",
                  border: disabled
                    ? "1px solid rgba(255,255,255,0.01)"
                    : "1px solid rgb(0,0,0)",
                  color: "#ffffff",
                  transition:
                    "opacity 0.3s ease, transform 0.35s ease, background-color 0.5s ease, border-color 0.5s ease, color 0.5s ease",
                }}
                aria-label="Previous products"
              >
                <PrevArrowIcon />
              </button>
            )}
            renderNext={(onClick, disabled) => (
              <button
                type="button"
                onClick={onClick}
                disabled={disabled}
                className={`absolute right-[13px] z-[3] hidden lg:flex items-center justify-center cursor-pointer -translate-y-1/2 lg:opacity-0 lg:-translate-x-[20px] lg:group-hover:translate-x-0 ${
                  disabled
                    ? "lg:group-hover:opacity-40"
                    : "lg:group-hover:opacity-100 hover:!bg-white hover:!text-black hover:!border-white"
                }`}
                style={{
                  top: "245px",
                  width: "46px",
                  height: "46px",
                  borderRadius: "9999px",
                  backgroundColor: disabled
                    ? "rgba(255,255,255,0.2)"
                    : "rgb(0,0,0)",
                  border: disabled
                    ? "1px solid rgba(255,255,255,0.01)"
                    : "1px solid rgb(0,0,0)",
                  color: "#ffffff",
                  transition:
                    "opacity 0.3s ease, transform 0.35s ease, background-color 0.5s ease, border-color 0.5s ease, color 0.5s ease",
                }}
                aria-label="Next products"
              >
                <NextArrowIcon />
              </button>
            )}
          />
        </div>

        {/* View all link — reuses server products as thumbnails when handles
            match (no extra fetch); lazy-fetches via getCollection on intersection
            when viewAllCollectionHandle differs from the server-fetched handle. */}
        {handle && (
          <LazyViewAllButton
            serverCollectionHandle={handle}
            configCollectionHandle={viewAllCollectionHandle}
            serverTotalProducts={totalProducts}
            serverProducts={products}
          />
        )}
      </div>
    </section>
  );
});
