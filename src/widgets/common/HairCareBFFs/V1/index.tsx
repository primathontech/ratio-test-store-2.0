"use client";

import React, { memo, useState, useRef, useCallback, useMemo } from "react";
import Image from "next/image";
import type {
  HairCareBFFsProps,
  HairCareBFFsTabConfig,
  ApiProduct,
  ApiCollectionResult,
} from "../types";
import { ProductCard, ProductCardTheme } from "@/ui/components/index";
import type { ProductCardProduct } from "@/ui/components/ProductCard/types";
import { getProductLabel } from "@/ui/components/ProductCard/badgeUtils";
import { SwipeCarousel } from "@/ui/components/SwipeCarousel";
import { useCartItems, useCartStore, type CartItem } from "@shopkit/cart";
import { LazyViewAllButton } from "@/widgets/common/FeaturedCollectionCarousel/components/LazyViewAllButton";

/* ------------------------------------------------------------------ */
/*  SVG Icons                                                          */
/* ------------------------------------------------------------------ */

const ChevronRightIcon = () => (
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

const ChevronLeftIcon = () => (
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
/*  Extract tabs from COLLECTION_BY_HANDLES response                   */
/* ------------------------------------------------------------------ */

interface CollectionTab {
  /** Display label (driven by settings.collections[].label, falls back to title/handle). */
  name: string;
  /** Server-fetched collection handle. */
  handle: string;
  /** Target handle for "View all" — same as `handle` unless template overrides. */
  viewAllHandle: string;
  products: ApiProduct[];
  totalProducts: number;
}

interface ServerCollectionEntry {
  handle: string;
  title: string;
  products: ApiProduct[];
  totalProducts: number;
}

function readServerCollections(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any
): ServerCollectionEntry[] {
  if (!data || !data.success) {
    return [];
  }
  const collections: ApiCollectionResult[] | undefined = data.data;
  if (!Array.isArray(collections) || collections.length === 0) {
    return [];
  }

  const out: ServerCollectionEntry[] = [];
  for (const collection of collections) {
    const collectionData = collection.data;
    const products = collectionData?.products || collection.products;
    if (!Array.isArray(products) || products.length === 0) {
      continue;
    }
    out.push({
      handle: collection.handle,
      title: collectionData?.title || collection.handle,
      products,
      totalProducts:
        collectionData?.productPagination?.total || products.length,
    });
  }
  return out;
}

/**
 * Build display tabs from server data, optionally enriched by a parallel
 * array of per-tab overrides. Order follows the server (which matches the
 * data source's `handles` array). Tabs without a corresponding override
 * fall back to the server title and server handle.
 */
function buildTabs(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any,
  overrides?: HairCareBFFsTabConfig[]
): CollectionTab[] {
  const serverEntries = readServerCollections(data);

  return serverEntries.map((e, idx) => {
    const cfg = overrides?.[idx];
    return {
      name: cfg?.label || e.title || e.handle,
      handle: e.handle,
      viewAllHandle: cfg?.viewAllCollectionHandle || e.handle,
      products: e.products,
      totalProducts: e.totalProducts,
    };
  });
}

/* ------------------------------------------------------------------ */
/*  Cart-aware product card wrapper                                    */
/* ------------------------------------------------------------------ */

interface HairCareCardProps {
  product: ApiProduct;
  theme: ProductCardTheme;
  actionButtonText?: string;
  soldOutText?: string;
}

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

const HairCareCard = memo(function HairCareCard({
  product,
  theme,
  actionButtonText,
  soldOutText,
}: HairCareCardProps) {
  const cardProduct = useMemo(() => transformApiProduct(product), [product]);
  const productId = product.id;
  const variantId = product.variant?.id;

  const items = useCartItems();
  const loadingItems = useCartStore((s) => s.loadingItems);
  const addItem = useCartStore((s) => s.addItem);
  const incrementItem = useCartStore((s) => s.incrementItem);
  const decrementItem = useCartStore((s) => s.decrementItem);

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
      console.error("[HairCareBFFs] addItem failed:", error);
    }
  }, [addItem, product, cardProduct]);

  const handleIncrement = useCallback(async () => {
    if (!cartLine) {
      return;
    }
    try {
      await incrementItem(cartLine.id, variantId);
    } catch (error) {
      console.error("[HairCareBFFs] incrementItem failed:", error);
    }
  }, [incrementItem, cartLine, variantId]);

  const handleDecrement = useCallback(async () => {
    if (!cartLine) {
      return;
    }
    try {
      await decrementItem(cartLine.id, variantId);
    } catch (error) {
      console.error("[HairCareBFFs] decrementItem failed:", error);
    }
  }, [decrementItem, cartLine, variantId]);

  return (
    <ProductCard
      product={cardProduct}
      theme={theme}
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
      className="pl-[12px] min-[992px]:pl-0" // compensate for carousel padding
    />
  );
});

/* ------------------------------------------------------------------ */
/*  Carousel breakpoints                                               */
/* ------------------------------------------------------------------ */

const DEFAULT_HAIR_CARE_BFFS_BREAKPOINTS = [
  { minWidth: 0, cards: 2.15, gap: 0 },
  { minWidth: 1024, cards: 5, gap: 0 },
  { minWidth: 1440, cards: 5, gap: 0 },
];

/* ------------------------------------------------------------------ */
/*  Main V1 Component                                                  */
/* ------------------------------------------------------------------ */

export const V1 = memo(function V1({ data, settings }: HairCareBFFsProps) {
  const headingRich = settings?.heading || "Hair Care <strong>BFFs</strong>";
  const backgroundImage =
    settings?.backgroundImage || "/HairCareBFFs/images/bg-watermark.png";
  const backgroundImageMobile =
    settings?.backgroundImageMobile ||
    "/HairCareBFFs/images/bg-mobile-watermark.webp";

  const collectionsConfig = settings?.collections;
  const actionButtonText = settings?.actionButtonText;
  const soldOutText = settings?.soldOutText;
  const carouselBreakpoints =
    settings?.carouselBreakpoints && settings.carouselBreakpoints.length > 0
      ? settings.carouselBreakpoints
      : DEFAULT_HAIR_CARE_BFFS_BREAKPOINTS;
  const tabs = useMemo(
    () => buildTabs(data, collectionsConfig),
    [data, collectionsConfig]
  );

  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const activeTab = tabs[activeTabIndex];
  const products = useMemo(
    () => activeTab?.products || [],
    [activeTab?.products]
  );

  const handleTabClick = useCallback(
    (index: number) => {
      if (index === activeTabIndex) {
        return;
      }
      setActiveTabIndex(index);
    },
    [activeTabIndex]
  );

  const tabsScrollRef = useRef<HTMLDivElement>(null);

  const cardTheme = ProductCardTheme.DARK;
  const outerBorderClass =
    cardTheme === ProductCardTheme.DARK
      ? "md:border md:border-white/20"
      : "md:border md:border-[#EBEBEB]";
  const itemBorderClass =
    cardTheme === ProductCardTheme.DARK
      ? "md:border-r md:border-white/20"
      : "md:border-r md:border-[#EBEBEB]";

  const renderProduct = useCallback(
    (idx: number) => {
      const product = products[idx];
      if (!product) {
        return null;
      }
      return (
        <div className={`${itemBorderClass} overflow-hidden`}>
          <HairCareCard
            product={product}
            theme={cardTheme}
            actionButtonText={actionButtonText}
            soldOutText={soldOutText}
          />
        </div>
      );
    },
    [products, itemBorderClass, cardTheme, actionButtonText, soldOutText]
  );

  if (tabs.length === 0) {
    return null;
  }

  return (
    <section
      className="relative overflow-hidden mt-[25px] md:mt-14 pt-[32.4px] md:pt-14 pb-[32.4px] md:pb-14"
      style={{}}
    >
      {/* Background image — mobile */}
      <div className="absolute inset-0 z-[0] md:hidden">
        <Image
          src={backgroundImageMobile}
          alt=""
          fill
          className="object-cover"
          loading="lazy"
          aria-hidden="true"
        />
      </div>

      {/* Background image — desktop */}
      <div className="absolute inset-0 z-[0] hidden md:block mb-[32.4px] md:mb-14">
        <Image
          src={backgroundImage}
          alt=""
          fill
          className="object-cover"
          loading="lazy"
          aria-hidden="true"
        />
      </div>

      {/* Content overlay */}
      <div className="relative z-[1] mx-auto xl:mx-5 px-1.5 md:px-[30px] xl:px-[50px] mb-8 md:mb-14">
        {/* Tabs head: heading + tab buttons */}
        <div className="flex flex-col items-start md:items-center text-center mb-6 md:mb-[30px] px-[15px] gap-[15px] md:gap-[30px]">
          {/* Heading — rich HTML; <strong> in the source becomes the bold part. */}
          <h4
            className="text-2xl xl:text-[28px] leading-[29px] md:leading-[34px] [&_strong]:font-bold"
            style={{
              color: "#ffffff",
              fontWeight: 400,
              margin: 0,
            }}
            // eslint-disable-next-line no-restricted-syntax
            dangerouslySetInnerHTML={{ __html: headingRich }}
          />

          {/* Tab buttons */}
          <div
            ref={tabsScrollRef}
            className="flex overflow-x-auto hide-scrollbar"
            style={{ gap: "8px", maxWidth: "100%" }}
          >
            {tabs.map((tab, idx) => (
              <button
                key={tab.handle}
                type="button"
                onClick={() => handleTabClick(idx)}
                className="flex-shrink-0 cursor-pointer text-sm md:text-base"
                style={{
                  color: "#ffffff",
                  backgroundColor: "transparent",
                  border:
                    idx === activeTabIndex
                      ? "1px solid rgb(128, 128, 128)"
                      : "1px solid transparent",
                  borderRadius: idx === activeTabIndex ? "4px" : "0px",
                  padding: "4px 8px",
                  fontWeight: 500,
                  transition: "all 0.4s 0.1s",
                  whiteSpace: "nowrap",
                }}
                aria-pressed={idx === activeTabIndex}
              >
                {tab.name}
              </button>
            ))}
          </div>
        </div>

        {/* Carousel area */}
        <div
          className={`xl:mx-auto xl:max-w-[1300px] ${outerBorderClass} md:rounded-lg`}
        >
          <SwipeCarousel
            itemCount={products.length}
            breakpoints={carouselBreakpoints}
            resetKey={activeTabIndex}
            renderItem={renderProduct}
            renderPrev={(onClick, disabled) => (
              <button
                type="button"
                onClick={onClick}
                disabled={disabled}
                className={`absolute left-[-30px] top-1/2 -translate-y-1/2 z-[3] items-center justify-center cursor-pointer text-gray-700 hover:text-loading-blue transition-colors duration-300 ${
                  disabled ? "hidden" : "hidden lg:flex"
                }`}
                aria-label="Previous products"
              >
                <ChevronLeftIcon />
              </button>
            )}
            renderNext={(onClick, disabled) => (
              <button
                type="button"
                onClick={onClick}
                disabled={disabled}
                className={`absolute right-[-30px] top-1/2 -translate-y-1/2 z-[3] items-center justify-center cursor-pointer text-gray-700 hover:text-loading-blue transition-colors duration-300 ${
                  disabled ? "hidden" : "hidden lg:flex"
                }`}
                aria-label="Next products"
              >
                <ChevronRightIcon />
              </button>
            )}
          />
        </div>

        {/* View all link — reuses server products as thumbnails when handles
            match (no extra fetch); lazy-fetches via getCollection on intersection
            when settings.collections[i].viewAllCollectionHandle differs. */}
        {activeTab && activeTab.totalProducts > 0 && (
          <LazyViewAllButton
            theme="dark"
            serverCollectionHandle={activeTab.handle}
            configCollectionHandle={activeTab.viewAllHandle}
            serverTotalProducts={activeTab.totalProducts}
            serverProducts={products}
          />
        )}
      </div>
    </section>
  );
});
