"use client";

import React, { memo, useState, useRef, useCallback, useMemo } from "react";
import Image from "next/image";
import type {
  HairCareBFFsProps,
  ApiProduct,
  ApiCollectionResult,
} from "../types";
import { ProductCard, ProductCardTheme } from "@/ui/components/index";
import type { ProductCardProduct } from "@/ui/components/ProductCard/types";
import { SwipeCarousel } from "@/ui/components/SwipeCarousel";

/* ------------------------------------------------------------------ */
/*  SVG Icons                                                          */
/* ------------------------------------------------------------------ */

const ChevronRightIcon = () => (
  <svg
    width="8"
    height="14"
    viewBox="0 0 8 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M1 1L7 7L1 13"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ChevronLeftIcon = () => (
  <svg
    width="8"
    height="14"
    viewBox="0 0 8 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M7 1L1 7L7 13"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ArrowRightIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M3.5 8H12.5M12.5 8L8.5 4M12.5 8L8.5 12"
      stroke="currentColor"
      strokeWidth="1.5"
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
    href: `/products/${product.handle}`,
    title: product.title,
    alt,
    mainImage: mainImg,
    hoverImage: hoverImg,
    category: product.productType || "",
    badge: product.metadata?.product_labels?.value || undefined,
    rating: product.average_rating || 0,
    reviewCount: product.rating_count || 0,
    salePrice,
    originalPrice,
    discount,
    weight: product.metadata?.product_net_content?.value || undefined,
    description: product.metadata?.product_subtitle?.value || undefined,
  };
}

/* ------------------------------------------------------------------ */
/*  Extract tabs from COLLECTION_BY_HANDLES response                   */
/* ------------------------------------------------------------------ */

interface CollectionTab {
  name: string;
  handle: string;
  products: ProductCardProduct[];
  totalProducts: number;
}

function extractTabsFromData(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any
): CollectionTab[] | null {
  if (!data || !data.success) return null;

  const collections: ApiCollectionResult[] = data.data;
  if (!Array.isArray(collections) || collections.length === 0) return null;

  const tabs: CollectionTab[] = [];

  for (const collection of collections) {
    const collectionData = collection.data;
    const products = collectionData?.products || collection.products;

    if (!Array.isArray(products) || products.length === 0) continue;

    tabs.push({
      name: collectionData?.title || collection.handle,
      handle: collection.handle,
      products: products.map(transformApiProduct),
      totalProducts:
        collectionData?.productPagination?.total || products.length,
    });
  }

  return tabs.length > 0 ? tabs : null;
}

/* ------------------------------------------------------------------ */
/*  Carousel breakpoints                                               */
/* ------------------------------------------------------------------ */

const HAIR_CARE_BFFS_BREAKPOINTS = [
  { minWidth: 0, cards: 1.5, gap: 12 },
  { minWidth: 768, cards: 2.5, gap: 12 },
  { minWidth: 1024, cards: 4, gap: 12 },
  { minWidth: 1440, cards: 5, gap: 12 },
];

/* ------------------------------------------------------------------ */
/*  Main V1 Component                                                  */
/* ------------------------------------------------------------------ */

export const V1 = memo(function V1({ data, settings }: HairCareBFFsProps) {
  const headingNormal = settings?.headingNormal || "Hair Care ";
  const headingBold = settings?.headingBold || "BFFs";
  const backgroundImage =
    settings?.backgroundImage || "/HairCareBFFs/images/bg-watermark.png";

  const tabs = useMemo(() => extractTabsFromData(data) ?? [], [data]);

  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const activeTab = tabs[activeTabIndex];
  const products = activeTab?.products || [];

  const handleTabClick = useCallback(
    (index: number) => {
      if (index === activeTabIndex) return;
      setActiveTabIndex(index);
    },
    [activeTabIndex]
  );

  const tabsScrollRef = useRef<HTMLDivElement>(null);

  const renderProduct = useCallback(
    (idx: number) => {
      const product = products[idx];
      if (!product) return null;
      return <ProductCard product={product} theme={ProductCardTheme.DARK} />;
    },
    [products]
  );

  if (tabs.length === 0) {
    return null;
  }

  return (
    <section
      className="relative overflow-hidden"
      style={{
        paddingTop: "56px",
        paddingBottom: "56px",
        marginTop: "56px",
        fontFamily: "Gotham, sans-serif",
      }}
    >
      {/* Background image */}
      <div className="absolute inset-0 z-[0]">
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
      <div
        className="relative z-[1] mx-auto"
        style={{
          maxWidth: "1300px",
          paddingLeft: "15px",
          paddingRight: "15px",
        }}
      >
        {/* Tabs head: heading + tab buttons */}
        <div
          className="flex flex-col items-center text-center"
          style={{ gap: "30px", marginBottom: "30px" }}
        >
          {/* Heading */}
          <h4
            className="text-[24px] leading-[34px]"
            style={{
              color: "#ffffff",
              fontWeight: 400,
              margin: 0,
              fontFamily: "Gotham, sans-serif",
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
                className="flex-shrink-0 cursor-pointer text-[16px]"
                style={{
                  color: "#ffffff",
                  backgroundColor: "transparent",
                  border:
                    idx === activeTabIndex
                      ? "1px solid rgb(128, 128, 128)"
                      : "1px solid transparent",
                  borderRadius: idx === activeTabIndex ? "4px" : "0px",
                  padding: "4px 8px",
                  fontFamily: "Gotham, sans-serif",
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
              className="absolute left-[-12px] top-[50%] z-[3] hidden lg:flex items-center justify-center cursor-pointer"
              style={{
                transform: "translateY(-50%)",
                width: "40px",
                height: "40px",
                borderRadius: "9999px",
                backgroundColor: !disabled
                  ? "rgba(255,255,255,0.9)"
                  : "rgba(255,255,255,0.3)",
                border: "none",
                color: !disabled ? "#1d1d1d" : "#999999",
                transition: "all 0.2s",
              }}
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
              className="absolute right-[-12px] top-[50%] z-[3] hidden lg:flex items-center justify-center cursor-pointer"
              style={{
                transform: "translateY(-50%)",
                width: "40px",
                height: "40px",
                borderRadius: "9999px",
                backgroundColor: !disabled
                  ? "rgba(255,255,255,0.9)"
                  : "rgba(255,255,255,0.3)",
                border: "none",
                color: !disabled ? "#1d1d1d" : "#999999",
                transition: "all 0.2s",
              }}
              aria-label="Next products"
            >
              <ChevronRightIcon />
            </button>
          )}
        />

        {/* View all link */}
        {activeTab?.totalProducts && activeTab.totalProducts > 0 && (
          <div className="flex justify-center" style={{ marginTop: "30px" }}>
            <a
              href={`/collections/${activeTab.handle}`}
              className="inline-flex items-center gap-[8px] no-underline text-[14px]"
              style={{
                backgroundColor: "rgb(29, 29, 29)",
                color: "#ffffff",
                padding: "6px 55px",
                borderRadius: "4px",
                fontFamily: "Gotham, sans-serif",
                fontWeight: 400,
                transition: "all 0.2s",
              }}
            >
              <span>View all {activeTab.totalProducts} products</span>
              <ArrowRightIcon />
            </a>
          </div>
        )}
      </div>
    </section>
  );
});
