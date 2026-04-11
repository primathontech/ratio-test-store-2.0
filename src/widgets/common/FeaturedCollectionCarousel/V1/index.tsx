"use client";

import React, { memo, useMemo, useCallback } from "react";
import type { FeaturedCollectionCarouselProps, ApiProduct } from "../types";
import { ProductCard } from "@/ui/components/ProductCard";
import type { ProductCardProduct } from "@/ui/components/ProductCard/types";
import { SwipeCarousel } from "@/ui/components/SwipeCarousel";

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

const ChevronRightIcon = () => (
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
/*  Extract products from COLLECTION API response                      */
/* ------------------------------------------------------------------ */

interface ExtractedCollection {
  products: ProductCardProduct[];
  totalProducts: number;
  handle: string;
}

function extractFromData(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any,
  collectionHandle?: string
): ExtractedCollection | null {
  if (!data || !data.success) return null;

  const collection = data.data;
  const products = collection?.products;

  if (!Array.isArray(products) || products.length === 0) return null;

  return {
    products: products.map(transformApiProduct),
    totalProducts: collection?.productPagination?.total || products.length,
    handle: collectionHandle || collection?.handle || "",
  };
}

/* ------------------------------------------------------------------ */
/*  Carousel breakpoints                                               */
/* ------------------------------------------------------------------ */

const CAROUSEL_BREAKPOINTS = [
  { minWidth: 0, cards: 2.3, gap: 16 },
  { minWidth: 768, cards: 3, gap: 16 },
  { minWidth: 1024, cards: 4, gap: 16 },
  { minWidth: 1440, cards: 5, gap: 16 },
];

/* ------------------------------------------------------------------ */
/*  Main V1 Component                                                  */
/* ------------------------------------------------------------------ */

export const V1 = memo(function V1({
  data,
  settings,
}: FeaturedCollectionCarouselProps) {
  const headingNormal = settings?.headingNormal || "";
  const headingBold = settings?.headingBold || "";
  const collectionHandle = settings?.collectionHandle || "";

  const extracted = useMemo(
    () => extractFromData(data, collectionHandle),
    [data, collectionHandle]
  );

  const products = extracted?.products ?? [];
  const totalProducts = extracted?.totalProducts ?? 0;
  const handle = extracted?.handle || collectionHandle;

  const renderProduct = useCallback(
    (idx: number) => {
      const product = products[idx];
      if (!product) return null;
      return <ProductCard product={product} />;
    },
    [products]
  );

  if (products.length === 0) {
    return null;
  }

  return (
    <section
      style={{
        backgroundColor: "#ffffff",
        paddingTop: "50px",
        paddingBottom: "50px",
        marginTop: "56px",
        fontFamily: "Gotham, sans-serif",
      }}
    >
      <div
        className="mx-auto"
        style={{
          maxWidth: "1300px",
          paddingLeft: "15px",
          paddingRight: "15px",
        }}
      >
        {/* Section heading */}
        <h3
          className="text-center"
          style={{
            fontSize: "32px",
            lineHeight: "42px",
            color: "#1d1d1d",
            fontWeight: 400,
            margin: "0 0 32px 0",
            fontFamily: "Gotham, sans-serif",
          }}
        >
          {headingNormal}
          <strong style={{ fontWeight: 700 }}>{headingBold}</strong>
        </h3>

        {/* Carousel area */}
        <SwipeCarousel
          itemCount={products.length}
          breakpoints={CAROUSEL_BREAKPOINTS}
          renderItem={renderProduct}
          renderPrev={(onClick, disabled) => (
            <button
              type="button"
              onClick={onClick}
              disabled={disabled}
              className="absolute left-[-20px] z-[3] hidden lg:flex items-center justify-center cursor-pointer"
              style={{
                top: "calc(50% - 80px)",
                transform: "translateY(-50%)",
                width: "40px",
                height: "40px",
                borderRadius: "9999px",
                backgroundColor: "rgba(255,255,255,0.95)",
                border: "1px solid rgb(229, 229, 229)",
                color: "#1d1d1d",
                opacity: !disabled ? 1 : 0.4,
                transition: "opacity 0.2s",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
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
              className="absolute right-[-20px] z-[3] hidden lg:flex items-center justify-center cursor-pointer"
              style={{
                top: "calc(50% - 80px)",
                transform: "translateY(-50%)",
                width: "40px",
                height: "40px",
                borderRadius: "9999px",
                backgroundColor: "rgba(255,255,255,0.95)",
                border: "1px solid rgb(229, 229, 229)",
                color: "#1d1d1d",
                opacity: !disabled ? 1 : 0.4,
                transition: "opacity 0.2s",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              }}
              aria-label="Next products"
            >
              <NextArrowIcon />
            </button>
          )}
        />

        {/* View all link */}
        {totalProducts > 0 && handle && (
          <div className="flex justify-center" style={{ marginTop: "32px" }}>
            <a
              href={`/collections/${handle}`}
              className="inline-flex items-center gap-[8px] no-underline text-[14px]"
              style={{
                backgroundColor: "rgb(244, 246, 248)",
                color: "#1d1d1d",
                padding: "10px 20px",
                borderRadius: "4px",
                border: "1px solid #1d1d1d",
                fontFamily: "Gotham, sans-serif",
                fontWeight: 500,
                transition:
                  "background-color 0.25s ease-in-out, color 0.25s ease-in-out",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget;
                el.style.backgroundColor = "#1d1d1d";
                el.style.color = "#ffffff";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget;
                el.style.backgroundColor = "rgb(244, 246, 248)";
                el.style.color = "#1d1d1d";
              }}
            >
              <span>View all {totalProducts} products</span>
              <ChevronRightIcon />
            </a>
          </div>
        )}
      </div>
    </section>
  );
});
