"use client";

import React, { memo, useMemo } from "react";
import type { FeaturedCollectionGridProps, ApiProduct } from "../types";
import { CartAwareProductCard } from "@/ui/components/CartAwareProductCard";

/* ------------------------------------------------------------------ */
/*  Extract products from collection API response                      */
/* ------------------------------------------------------------------ */

function extractProductsFromData(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any
): ApiProduct[] | null {
  if (!data || !data.success) {
    return null;
  }

  // DATA_SOURCE_TYPES.COLLECTION returns { success, data: { products: [...] } }
  const collection = data.data;
  const products = collection?.products;

  if (!Array.isArray(products) || products.length === 0) {
    return null;
  }

  return products as ApiProduct[];
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
      <div className="mx-auto px-4 md:px-[50px]" style={{ maxWidth: "1400px" }}>
        {/* Category title — plain centered heading (matches bblunt.com live) */}
        <div
          className="flex items-center justify-center text-center px-[15px]"
          style={{ marginBottom: "30px" }}
        >
          <h3
            className="text-center"
            style={{
              color: "#000000",
              fontSize: "28px",
              fontWeight: 400,
              lineHeight: 1.2,
              margin: 0,
            }}
          >
            {categoryTitle}
          </h3>
        </div>

        {/* Product grid: 2 cols mobile, 3 cols tablet, 4 cols desktop, 16px gap */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4">
          {products.map((product, idx) => (
            <div
              key={product.id || idx}
              className="overflow-hidden rounded-t-xl md:rounded-xl md:border md:border-solid md:border-gray-light"
            >
              <CartAwareProductCard
                apiProduct={product}
                logTag="FeaturedCollectionGrid"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});
