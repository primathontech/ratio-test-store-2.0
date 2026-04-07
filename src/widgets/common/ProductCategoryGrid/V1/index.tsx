"use client";

import React, { memo } from "react";
import { ProductCategoryGridProps } from "../types";
import { ProductCard } from "@/ui/components/ProductCard";

/* ------------------------------------------------------------------ */
/*  V1 — Category title banner + product grid                          */
/* ------------------------------------------------------------------ */

export const V1 = memo(function V1({ settings }: ProductCategoryGridProps) {
  const categoryTitle = settings?.categoryTitle || "Products";
  const products = settings?.products || [];

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
