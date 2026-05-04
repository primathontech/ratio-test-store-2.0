"use client";

import React, { memo, useState, useRef, useCallback, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import type {
  HairCareBFFsProps,
  ApiProduct,
  ApiCollectionResult,
} from "../types";
import { ProductCard, ProductCardTheme } from "@/ui/components/index";
import type { ProductCardProduct } from "@/ui/components/ProductCard/types";
import { SwipeCarousel } from "@/ui/components/SwipeCarousel";
import { useCartItems, useCartStore, type CartItem } from "@shopkit/cart";

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

const ViewAllChevronIcon = () => (
  <svg
    width="7"
    height="12"
    viewBox="0 0 7 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M1 1L6 6L1 11"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
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
    badge: product.metadata?.product_labels?.value || "Get2@\u20B9599",
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
  name: string;
  handle: string;
  products: ApiProduct[];
  totalProducts: number;
}

function extractTabsFromData(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any
): CollectionTab[] | null {
  if (!data || !data.success) {
    return null;
  }

  const collections: ApiCollectionResult[] = data.data;
  if (!Array.isArray(collections) || collections.length === 0) {
    return null;
  }

  const tabs: CollectionTab[] = [];

  for (const collection of collections) {
    const collectionData = collection.data;
    const products = collectionData?.products || collection.products;

    if (!Array.isArray(products) || products.length === 0) {
      continue;
    }

    tabs.push({
      name: collectionData?.title || collection.handle,
      handle: collection.handle,
      products,
      totalProducts:
        collectionData?.productPagination?.total || products.length,
    });
  }

  return tabs.length > 0 ? tabs : null;
}

/* ------------------------------------------------------------------ */
/*  Cart-aware product card wrapper                                    */
/* ------------------------------------------------------------------ */

interface HairCareCardProps {
  product: ApiProduct;
  theme: ProductCardTheme;
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
      settings={{ showAddToCartToast: true }}
      onAddToCart={handleAddToCart}
      onIncrement={handleIncrement}
      onDecrement={handleDecrement}
      isInCart={isInCart}
      cartItem={cartLine}
      isQuantityLoading={isQuantityLoading}
    />
  );
});

function getMainImage(product: ApiProduct): string {
  return (
    product.images?.find((img) => img.is_main)?.url || product.image_url || ""
  );
}

/* ------------------------------------------------------------------ */
/*  Carousel breakpoints                                               */
/* ------------------------------------------------------------------ */

const HAIR_CARE_BFFS_BREAKPOINTS = [
  { minWidth: 0, cards: 2.15, gap: 0 },
  { minWidth: 1024, cards: 5, gap: 0 },
  { minWidth: 1440, cards: 5, gap: 0 },
];

/* ------------------------------------------------------------------ */
/*  Main V1 Component                                                  */
/* ------------------------------------------------------------------ */

export const V1 = memo(function V1({ data, settings }: HairCareBFFsProps) {
  const headingNormal = settings?.headingNormal || "Hair Care ";
  const headingBold = settings?.headingBold || "BFFs";
  const backgroundImage =
    settings?.backgroundImage || "/HairCareBFFs/images/bg-watermark.png";
  const backgroundImageMobile =
    settings?.backgroundImageMobile ||
    "/HairCareBFFs/images/bg-mobile-watermark.webp";

  const tabs = useMemo(() => extractTabsFromData(data) ?? [], [data]);

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
          <HairCareCard product={product} theme={cardTheme} />
        </div>
      );
    },
    [products, itemBorderClass, cardTheme]
  );

  if (tabs.length === 0) {
    return null;
  }

  return (
    <section
      className="relative overflow-hidden mt-[25px] md:mt-[56px] pt-[32.4px] md:pt-[56px] pb-[32.4px] md:pb-[56px]"
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
      <div className="absolute inset-0 z-[0] hidden md:block mb-[32.4px] md:mb-[56px]">
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
      <div className="relative z-[1] mx-auto xl:mx-[20px] px-[6px] md:px-[30px] xl:px-[50px] mb-[32px] md:mb-[56px]">
        {/* Tabs head: heading + tab buttons */}
        <div className="flex flex-col items-start md:items-center text-center mb-[24px] md:mb-[30px] px-[15px] gap-[15px] md:gap-[30px]">
          {/* Heading */}
          <h4
            className="text-[24px] xl:text-[28px] leading-[29px] md:leading-[34px]"
            style={{
              color: "#ffffff",
              fontWeight: 400,
              margin: 0,
            }}
          >
            {headingNormal}
            <strong style={{ fontWeight: 700 }}>{headingBold}</strong>
          </h4>

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
                className="flex-shrink-0 cursor-pointer text-[14px] md:text-[16px]"
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
          className={`xl:mx-auto xl:max-w-[1300px] ${outerBorderClass} md:rounded-[8px] overflow-hidden`}
        >
          <SwipeCarousel
            itemCount={products.length}
            breakpoints={HAIR_CARE_BFFS_BREAKPOINTS}
            resetKey={activeTabIndex}
            renderItem={renderProduct}
            renderPrev={(onClick, disabled) => (
              <button
                type="button"
                onClick={onClick}
                disabled={disabled}
                className="absolute left-[13px] z-[3] hidden lg:flex items-center justify-center cursor-pointer"
                style={{
                  top: "245px",
                  transform: "translateY(-50%)",
                  width: "46px",
                  height: "46px",
                  borderRadius: "9999px",
                  backgroundColor: "transparent",
                  border: "1px solid transparent",
                  color: disabled ? "rgba(255,255,255,0.4)" : "#ffffff",
                  opacity: disabled ? 0.4 : 1,
                  transition: "all 0.2s",
                }}
                aria-label="Previous products"
              >
                <ChevronLeftIcon />
              </button>
            )}
          />
        </div>

        {/* View all link */}
        {activeTab?.totalProducts && activeTab.totalProducts > 0 && (
          <div className="flex justify-center mt-[17.4px] md:mt-[30px]">
            <Link
              href={`/collections/${activeTab.handle}`}
              className="inline-flex items-center no-underline text-[14px] md:text-[18px] pl-[16px] md:pl-[42px] pr-[16px] md:pr-[55px] w-full md:w-auto mx-[16px] md:mx-0 p-[6px] md:p-0 justify-center"
              style={{
                backgroundColor: "rgb(29, 29, 29)",
                color: "#ffffff",
                paddingTop: "6px",
                paddingBottom: "6px",
                borderRadius: "4px",
                fontWeight: 500,
                transition: "all 0.2s",
                gap: "8px",
              }}
            >
              {/* First 3 product preview images */}
              <span className="inline-flex flex-row-reverse items-center">
                {products.slice(0, 3).map((p, i) => {
                  const mainImage = getMainImage(p);
                  return (
                    <span
                      key={p.id ?? i}
                      className={`relative inline-flex overflow-hidden rounded-[6px] border border-[#dddddd] md:border-[3px] w-[20px] md:w-[32px] h-[20px] md:h-[32px] ${
                        i === 0 ? "mr-0" : "mr-[-12px]"
                      }`}
                      style={{
                        zIndex: products.slice(0, 3).length - i,
                      }}
                    >
                      <Image
                        src={
                          mainImage.startsWith("//")
                            ? `https:${mainImage}`
                            : mainImage
                        }
                        alt=""
                        width={27}
                        height={27}
                        style={{
                          objectFit: "cover",
                        }}
                      />
                    </span>
                  );
                })}
              </span>
              <span>View all {activeTab.totalProducts} products</span>
              <ViewAllChevronIcon />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
});
