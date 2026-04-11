"use client";

import React, { memo, useMemo } from "react";
import type {
  FeaturedCollectionGridProps,
  FeaturedCollectionGridProduct,
  ApiProduct,
} from "../types";
import { ProductCard } from "@/ui/components/ProductCard";

/* ------------------------------------------------------------------ */
/*  Transform: API product → ProductCardProduct                        */
/* ------------------------------------------------------------------ */

function transformApiProduct(
  product: ApiProduct
): FeaturedCollectionGridProduct {
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
/*  Extract products from collection API response                      */
/* ------------------------------------------------------------------ */

function extractProductsFromData(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any
): FeaturedCollectionGridProduct[] | null {
  if (!data || !data.success) return null;

  // DATA_SOURCE_TYPES.COLLECTION returns { success, data: { products: [...] } }
  const collection = data.data;
  const products = collection?.products;

  if (!Array.isArray(products) || products.length === 0) return null;

  return products.map(transformApiProduct);
}

/* ------------------------------------------------------------------ */
/*  V1 — Category title banner + product grid                          */
/* ------------------------------------------------------------------ */

export const V1 = memo(function V1({
  data,
  settings,
}: FeaturedCollectionGridProps) {
  const categoryTitle = settings?.categoryTitle || "Products";

  const products = useMemo(() => extractProductsFromData(data) ?? [], [data]);

  if (products.length === 0) {
    return null;
  }

  return (
    <section
      className="w-full"
      style={{ backgroundColor: "#ffffff" }}
      aria-label={categoryTitle}
    >
      {/* Container */}
      <div
        className="mx-auto px-[16px] md:px-[40px] lg:px-[72px]"
        style={{ maxWidth: "1440px" }}
      >
        {/* Category title banner */}
        <div
          className="flex items-center justify-center py-[10px] md:py-[12px] mb-[24px]"
          style={{
            backgroundColor: "#000000",
            borderRadius: "0px",
          }}
        >
          <h3
            className="text-[20px] md:text-[24px] lg:text-[28px] text-center"
            style={{
              color: "#ffffff",
              fontFamily: "Gotham, sans-serif",
              fontWeight: 700,
              margin: 0,
              lineHeight: 1.3,
            }}
          >
            {categoryTitle}
          </h3>
        </div>

        {/* Product grid: 2 cols mobile, 4 cols desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-[12px] md:gap-[16px] lg:gap-[20px]">
          {products.map((product, idx) => (
            <ProductCard key={product.href || idx} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
});
