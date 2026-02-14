"use client";

import React, { useState } from "react";
import Spinner from "../../ProductGrid/common/Spinner";
import { useCartStore, mapProductToCartItem } from "@shopkit/cart";

interface AddToCartWithQuantityProps {
  product: any;
  selectedVariantId?: string;
  initialQuantity?: number;
  className?: string;
  showRemoveButton?: boolean;
  cartItemCount?: number;
}

export function AddToCartWithQuantity({
  product,
  selectedVariantId,
  initialQuantity = 1,
  className = "",
  showRemoveButton = false,
  cartItemCount = 0,
}: AddToCartWithQuantityProps) {
  const [quantity, setQuantity] = useState(initialQuantity);
  const [inputValue, setInputValue] = useState(initialQuantity.toString());
  const { addItem } = useCartStore();
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});

  const isLoading = loadingStates[product.id] || false;

  // Common button styling
  const commonButtonClass =
    "w-6 h-6 flex items-center justify-center rounded-full transition-colors duration-200";

  const isDecrementDisabled = quantity <= 1 || isLoading;
  const isIncrementDisabled = isLoading;

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
      setInputValue(newQuantity.toString());
    }
  };

  const handleDecrementClick = () => {
    if (!isDecrementDisabled) {
      handleQuantityChange(quantity - 1);
    }
  };

  const handleIncrementClick = () => {
    if (!isIncrementDisabled) {
      handleQuantityChange(quantity + 1);
    }
  };

  const handleQuantityInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = e.target.value;
    setInputValue(value);
  };

  const handleBlur = () => {
    const numValue = parseInt(inputValue, 10);
    if (isNaN(numValue) || numValue < 1) {
      setInputValue(quantity.toString());
    } else {
      handleQuantityChange(numValue);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleBlur();
    }
  };

  const handleAddToCart = async () => {
    try {
      setLoadingStates((prev) => ({ ...prev, [product.id]: true }));
      const cartItem = mapProductToCartItem(product, selectedVariantId || product.variantId, quantity);
      await addItem(cartItem);
    } catch (error) {
      console.error("Failed to add to cart:", error);
    } finally {
      setLoadingStates((prev) => ({ ...prev, [product.id]: false }));
    }
  };

  return (
    <div
      data-testid="add-to-cart-with-quantity-container"
      className={`add-to-cart-with-quantity flex gap-4 ${className}`}
    >
      {/* Quantity Selector */}
      <div data-testid="quantity-selector-wrapper" className="">
        <div
          data-testid="quantity-label-desktop"
          className="hidden md:block text-text-base font-semibold mb-2 text-black"
        >
          Quantity {cartItemCount > 0 && `(${cartItemCount} in cart)`}
        </div>
        <div
          data-testid="cart-item-actions"
          className="cart-item-actions flex items-center gap-3 md:mt-2.5"
        >
          <div
            data-testid="cart-item-quantity"
            className="cart-item-quantity text-text-base text-black px-2 py-3 flex items-center gap-6 bg-gray-100 rounded-lg border border-surface-3"
          >
            <button
              data-testid="cart-item-decrease-quantity"
              className={`${commonButtonClass} ${
                isDecrementDisabled
                  ? "cursor-not-allowed opacity-50"
                  : "cursor-pointer hover:bg-gray-100"
              }`}
              onClick={handleDecrementClick}
              disabled={isDecrementDisabled}
              aria-label={quantity === 1 ? "Remove item" : "Decrease quantity"}
            >
              −
            </button>
            <input
              type="text"
              value={inputValue}
              onChange={handleQuantityInputChange}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              className="quantity-input mx-2 mb-0 font-normal min-w-4 text-center bg-transparent border-none outline-none focus:ring-0 disabled:opacity-50"
              aria-label="Item quantity"
              min="1"
              style={{ width: "24px" }}
            />
            <button
              data-testid="cart-item-increase-quantity"
              className={`${commonButtonClass} ${
                isIncrementDisabled
                  ? "cursor-not-allowed opacity-50"
                  : "cursor-pointer hover:bg-gray-100"
              }`}
              onClick={handleIncrementClick}
              disabled={isIncrementDisabled}
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
        </div>
      </div>

      {/* Add to Cart Button */}
      <button
        data-testid="add-to-cart-handler"
        onClick={handleAddToCart}
        disabled={isLoading}
        className={`shine-link-button w-full h-fit md:self-end py-2 md:py-4 px-6 bg-black text-text-lg text-white font-semibold rounded-lg transition-colors duration-200 ${
          isLoading
            ? "opacity-50 cursor-not-allowed"
            : product?.availableForSale
              ? ""
              : "opacity-40 cursor-not-allowed"
        }`}
      >
        {isLoading ? (
          <div
            data-testid="add-to-cart-loading-spinner"
            className="flex items-center justify-center gap-2"
          >
            <Spinner className="size-[2.4rem] text-gray-800" />
          </div>
        ) : product?.availableForSale ? (
          "Add to Cart"
        ) : (
          "Sold Out"
        )}
      </button>
    </div>
  );
}
