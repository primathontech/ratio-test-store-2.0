"use client";

import React, { memo, useCallback, useMemo } from "react";
import type {
  FeaturedCollectionGridProps,
  FeaturedCollectionGridProduct,
  ApiProduct,
} from "../types";
import { ProductCard } from "@/ui/components/index";
import { useCartItem, useCartStore, type CartItem } from "@shopkit/cart";

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
/*  Cart-aware product card                                            */
/* ------------------------------------------------------------------ */

function buildCartItem(
  product: ApiProduct,
  cardProduct: FeaturedCollectionGridProduct
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

interface FeaturedCollectionGridCardProps {
  product: ApiProduct;
}

const FeaturedCollectionGridCard = memo(function FeaturedCollectionGridCard({
  product,
}: FeaturedCollectionGridCardProps) {
  const cardProduct = useMemo(() => transformApiProduct(product), [product]);
  const productId = product.id;
  const variantId = product.variant?.id;

  const cartLine = useCartItem(productId, variantId);
  const loadingItems = useCartStore((s) => s.loadingItems);
  const addItem = useCartStore((s) => s.addItem);
  const incrementItem = useCartStore((s) => s.incrementItem);
  const decrementItem = useCartStore((s) => s.decrementItem);
  const openCart = useCartStore((s) => s.openCart);

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
      await openCart();
    } catch (error) {
      console.error("[FeaturedCollectionGrid] addItem failed:", error);
    }
  }, [addItem, openCart, product, cardProduct]);

  const handleIncrement = useCallback(async () => {
    if (!cartLine) {
      return;
    }
    try {
      await incrementItem(cartLine.id, variantId);
    } catch (error) {
      console.error("[FeaturedCollectionGrid] incrementItem failed:", error);
    }
  }, [incrementItem, cartLine, variantId]);

  const handleDecrement = useCallback(async () => {
    if (!cartLine) {
      return;
    }
    try {
      await decrementItem(cartLine.id, variantId);
    } catch (error) {
      console.error("[FeaturedCollectionGrid] decrementItem failed:", error);
    }
  }, [decrementItem, cartLine, variantId]);

  return (
    <ProductCard
      product={cardProduct}
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
        <div className="grid grid-cols-2 lg:grid-cols-4">
          {products.map((product, idx) => (
            <FeaturedCollectionGridCard
              key={product.id || idx}
              product={product}
            />
          ))}
        </div>
      </div>
    </section>
  );
});
