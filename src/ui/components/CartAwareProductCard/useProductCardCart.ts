"use client";

import { useCallback, useMemo } from "react";
import { useCartItems, useCartStore, type CartItem } from "@shopkit/cart";
import type { ProductCardProduct } from "@/ui/components/ProductCard/types";

export interface UseProductCardCartResult {
  /** The cart line for this product (if any). */
  cartLine: CartItem | undefined;
  /** True when a cart line exists for this product. */
  isInCart: boolean;
  /** True while a cart mutation for this product/variant is in flight. */
  isQuantityLoading: boolean;
  /** Add to cart — no-op when product is sold out. */
  handleAddToCart: () => Promise<void>;
  /** Increment cart line quantity — no-op when not in cart. */
  handleIncrement: () => Promise<void>;
  /** Decrement cart line quantity — no-op when not in cart. */
  handleDecrement: () => Promise<void>;
}

/**
 * Cart wiring extracted from the per-widget `*Card` wrappers
 * (HairCareCard, FeaturedCarouselCard, etc.). Subscribes to the cart store,
 * resolves the matching line by `productId` (+ `variantId` if present),
 * and returns memoised handlers.
 *
 * `buildCartItem` is supplied by the caller so the same hook works for
 * both raw-API widgets (use `toCartItem`) and pre-mapped widgets like
 * CollectionPage (use `cardToCartItem`).
 *
 * Errors are caught and logged with the supplied `logTag` so failed mutations
 * never crash the carousel render path.
 */
export function useProductCardCart(
  cardProduct: ProductCardProduct,
  buildCartItem: () => CartItem,
  logTag: string = "ProductCard"
): UseProductCardCartResult {
  const productId = cardProduct.productId ?? String(cardProduct.id ?? "");
  const variantId = cardProduct.variantId;

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
      await addItem(buildCartItem());
    } catch (error) {
      console.error(`[${logTag}] addItem failed:`, error);
    }
  }, [addItem, buildCartItem, cardProduct.availableForSale, logTag]);

  const handleIncrement = useCallback(async () => {
    if (!cartLine) {
      return;
    }
    try {
      await incrementItem(cartLine.id, variantId);
    } catch (error) {
      console.error(`[${logTag}] incrementItem failed:`, error);
    }
  }, [incrementItem, cartLine, variantId, logTag]);

  const handleDecrement = useCallback(async () => {
    if (!cartLine) {
      return;
    }
    try {
      await decrementItem(cartLine.id, variantId);
    } catch (error) {
      console.error(`[${logTag}] decrementItem failed:`, error);
    }
  }, [decrementItem, cartLine, variantId, logTag]);

  return {
    cartLine,
    isInCart,
    isQuantityLoading,
    handleAddToCart,
    handleIncrement,
    handleDecrement,
  };
}
