"use client";

import React, { memo, useCallback, useEffect, useMemo, useState } from "react";
import { CartAwareProductCard } from "@/ui/components/CartAwareProductCard";
import { SwipeCarousel } from "@/ui/components/SwipeCarousel";
import { RecentlyViewedProps } from "../types";
import {
  type ApiRecentProduct,
  addViewedProduct,
  fetchProductDetails,
  getViewedProductIds,
} from "../utils";

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
/*  Cart-aware product card wrapper                                    */
/* ------------------------------------------------------------------ */

function buildCartItem(
  product: ApiRecentProduct,
  cardProduct: ProductCardProduct
): CartItem {
  const variantId = cardProduct.variantId;
  const productId = product.id;
  const lineId = variantId ?? productId;

  return {
    id: lineId,
    productId,
    variantId,
    sku: product.variants?.[0]?.sku || product.variant?.sku,
    title: product.title,
    price: { amount: product.price ?? 0, currencyCode: "INR" },
    compareAtPrice:
      typeof product.compare_at_price === "number"
        ? { amount: product.compare_at_price, currencyCode: "INR" }
        : undefined,
    quantity: 1,
    image: cardProduct.mainImage,
    product_type: product.productType || product.product_type,
  };
}

interface RecentlyViewedCardProps {
  apiProduct: ApiRecentProduct;
  cardSettings: ProductCardProduct extends infer _T
    ? Parameters<typeof ProductCard>[0]["settings"]
    : never;
}

const RecentlyViewedCard = memo(function RecentlyViewedCard({
  apiProduct,
  cardSettings,
}: RecentlyViewedCardProps) {
  const cardProduct = useMemo(
    () => transformApiProductToCardProduct(apiProduct),
    [apiProduct]
  );
  const productId = apiProduct.id;
  const variantId = cardProduct.variantId;

  const cartLine = useCartItem(productId, variantId);
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
      await addItem(buildCartItem(apiProduct, cardProduct));
    } catch (error) {
      console.error("[RecentlyViewed] addItem failed:", error);
    }
  }, [addItem, apiProduct, cardProduct]);

  const handleIncrement = useCallback(async () => {
    if (!cartLine) {
      return;
    }
    try {
      await incrementItem(cartLine.id, variantId);
    } catch (error) {
      console.error("[RecentlyViewed] incrementItem failed:", error);
    }
  }, [incrementItem, cartLine, variantId]);

  const handleDecrement = useCallback(async () => {
    if (!cartLine) {
      return;
    }
    try {
      await decrementItem(cartLine.id, variantId);
    } catch (error) {
      console.error("[RecentlyViewed] decrementItem failed:", error);
    }
  }, [decrementItem, cartLine, variantId]);

  return (
    <ProductCard
      product={cardProduct}
      settings={cardSettings}
      onAddToCart={handleAddToCart}
      onIncrement={handleIncrement}
      onDecrement={handleDecrement}
      isInCart={isInCart}
      cartItem={cartLine}
      isQuantityLoading={isQuantityLoading}
      className="pl-[12px] min-[992px]:pl-0"
    />
  );
});

/* ------------------------------------------------------------------ */
/*  Carousel breakpoints — same as FeaturedCollectionCarousel          */
/* ------------------------------------------------------------------ */

const CAROUSEL_BREAKPOINTS = [
  { minWidth: 0, cards: 2.3, gap: 0 },
  { minWidth: 768, cards: 3, gap: 0 },
  { minWidth: 1024, cards: 4, gap: 0 },
  { minWidth: 1440, cards: 5, gap: 0 },
];

/* ------------------------------------------------------------------ */
/*  Main V1 component                                                  */
/* ------------------------------------------------------------------ */

export const V1 = memo(function V1({ data, settings }: RecentlyViewedProps) {
  const product = data?.success ? data.data : null;
  const currentProductId = product?.id ? String(product.id) : null;
  const currentVariantId = product?.variants?.[0]?.id;

  const heading = settings?.heading || "Recently Viewed";
  const maxProducts = settings?.maxProducts ?? 10;

  const [products, setProducts] = useState<ApiRecentProduct[]>([]);

  // 1. Track current product visit (with 1s debounce so accidental hits are skipped)
  useEffect(() => {
    if (!currentProductId) {
      return;
    }
    const t = setTimeout(() => {
      addViewedProduct(currentProductId, currentVariantId);
    }, 1000);
    return () => clearTimeout(t);
  }, [currentProductId, currentVariantId]);

  // 2. Fetch details for previously viewed products (excluding current)
  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      let ids = getViewedProductIds(maxProducts + 1);
      if (currentProductId) {
        ids = ids.filter((id) => id !== currentProductId);
      }
      ids = ids.slice(0, maxProducts);

      if (ids.length === 0) {
        if (!cancelled) {
          setProducts([]);
        }
        return;
      }

      const result = await fetchProductDetails(ids);
      if (!cancelled) {
        setProducts(result);
      }
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [currentProductId, maxProducts]);

  // 3. Product card settings
  const cardSettings = useMemo(
    () => ({
      showActionButton: settings?.showActionButton ?? true,
      actionButtonText: settings?.actionButtonText ?? "Add to cart",
      actionButtonTextColor: settings?.actionButtonTextColor,
      showBadge: settings?.showBadge ?? true,
      showRating: settings?.showRating ?? true,
      soldOutText: settings?.soldOutText ?? "Sold Out",
      backgroundColor: settings?.productCardBackgroundColor,
      color: settings?.sectionTextColor,
    }),
    [settings]
  );

  const renderProduct = useCallback(
    (idx: number) => {
      const apiProduct = products[idx];
      if (!apiProduct) {
        return null;
      }
      return (
        <div className="md:border-r md:border-[#EBEBEB] overflow-hidden">
          <CartAwareProductCard
            apiProduct={apiProduct}
            settings={cardSettings}
            logTag="RecentlyViewed"
          />
        </div>
      );
    },
    [products, cardSettings]
  );

  if (products.length === 0) {
    return null;
  }

  return (
    <section
      className="relative overflow-hidden mx-auto"
      style={{
        backgroundColor: settings?.sectionBackgroundColor || "#ffffff",
      }}
    >
      {/* Content overlay */}
      <div className="relative z-[1] max-w-[1300px] mx-auto px-1.5 md:px-[30px] xl:px-[50px]">
        {/* Heading */}
        <div className="flex flex-col items-start text-center mb-4 md:mb-[30px] px-[15px]">
          <h4
            className="text-2xl leading-[29px] md:leading-[34px]"
            style={{
              color: settings?.sectionTextColor || "#000000",
              fontWeight: 700,
              margin: 0,
            }}
          >
            {heading}
          </h4>
        </div>

        {/* Carousel area */}
        <div className="group xl:mx-auto xl:max-w-[1300px] md:border md:border-[#EBEBEB] md:rounded-lg overflow-hidden">
          <SwipeCarousel
            itemCount={products.length}
            breakpoints={CAROUSEL_BREAKPOINTS}
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
      </div>
    </section>
  );
});
