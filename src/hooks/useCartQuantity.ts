"use client";

import { useCallback } from "react";
import { CartItem, useCartStore } from "@shopkit/cart";

/**
 * Hook to get and manage cart item quantities
 *
 * Can be used in two ways:
 * 1. Pass productId to hook: const { increment, decrement, isInCart } = useCartQuantity(productId)
 * 2. Pass product to methods: const { incrementQuantity, isInCart } = useCartQuantity();
 *    Then call incrementQuantity(product) and isInCart(product)
 */
export function useCartQuantity(productId?: string) {
  const items = useCartStore((state) => state.items);
  const updateItemQuantity = useCartStore((state) => state.updateItemQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const isLoading = useCartStore((state) => state.isLoading);

  // Find cart item for the specified productId (if provided)
  const cartItem = productId
    ? items.find(
        (item: any) =>
          item.productId === productId || item.variantId === productId,
      )
    : undefined;

  const quantity = cartItem?.quantity || 0;

  // Helper to find cart item by product object or id
  const findCartItem = useCallback(
    (productOrId?: any): any => {
      if (!productOrId) return cartItem;
      const id =
        typeof productOrId === "string"
          ? productOrId
          : productOrId.id || productOrId.variantId || productOrId.variant?.id;
      return items.find(
        (item: any) => item.productId === id || item.variantId === id,
      );
    },
    [items, cartItem],
  );

  // Increment - can be called without args (uses productId) or with product
  const increment = useCallback(async () => {
    if (cartItem) {
      await updateItemQuantity(cartItem.id, cartItem.quantity + 1);
    }
  }, [cartItem, updateItemQuantity]);

  // Decrement - can be called without args (uses productId) or with product
  const decrement = useCallback(async () => {
    if (cartItem) {
      if (cartItem.quantity === 1) {
        await removeItem(cartItem.id);
      } else {
        await updateItemQuantity(cartItem.id, cartItem.quantity - 1);
      }
    }
  }, [cartItem, updateItemQuantity, removeItem]);

  // Version that accepts product as argument
  const incrementQuantity = useCallback(
    async (product?: any) => {
      const item = findCartItem(product);
      if (item) {
        await updateItemQuantity(item.id, item.quantity + 1);
      }
    },
    [findCartItem, updateItemQuantity],
  );

  // Version that accepts product as argument
  const decrementQuantity = useCallback(
    async (product?: any) => {
      const item = findCartItem(product);
      if (item) {
        if (item.quantity === 1) {
          await removeItem(item.id);
        } else {
          await updateItemQuantity(item.id, item.quantity - 1);
        }
      }
    },
    [findCartItem, updateItemQuantity, removeItem],
  );

  // Check if product is in cart - can accept product object
  const isInCart = useCallback(
    (product?: any): boolean => {
      if (!product && productId) {
        return quantity > 0;
      }
      const item = findCartItem(product);
      return item ? item.quantity > 0 : false;
    },
    [productId, quantity, findCartItem],
  );

  const getCartItem = useCallback(
    (productOrId?: any): CartItem | undefined => {
      return findCartItem(productOrId) as CartItem | undefined;
    },
    [findCartItem],
  );

  const isProductLoading = useCallback(
    (_productOrId?: any) => isLoading,
    [isLoading],
  );

  return {
    quantity,
    isInCart,
    cartItem: cartItem as CartItem | undefined,
    increment,
    decrement,
    incrementQuantity,
    decrementQuantity,
    getCartItem,
    isProductLoading,
  };
}

export default useCartQuantity;
