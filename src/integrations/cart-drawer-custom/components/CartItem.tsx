"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Box, Flex, Image } from "@/ui/atomic";
import { formatPaiseToINR } from "@/utils";
import { useCartStore } from "@shopkit/cart";
import { getCartImage } from "@/utils/cartImageCache";

interface CartItemProps {
  item: any;
  finalCurrencyCode: string;
  loadingStates: {
    [key: string]: "increment" | "decrement" | "remove" | "add" | null;
  };
  setItemQuantity: (itemId: string, quantity: number) => Promise<void>;
  onQuantityIncrement: (itemId: string) => Promise<void>;
  onQuantityDecrement: (itemId: string) => Promise<void>;
  onItemRemove: (itemId: string) => Promise<void>;
}

// Maximum allowed quantity per item
const MAX_QUANTITY = 40;

/** Extract price in paise from price field (handles both number and {amount, currencyCode} object) */
function extractPricePaise(price: any): number {
  if (typeof price === "number") {
    return price;
  }
  if (
    typeof price === "object" &&
    price !== null &&
    typeof price.amount === "number"
  ) {
    return price.amount;
  }
  return 0;
}

export const CartItem: React.FC<CartItemProps> = ({
  item,
  loadingStates,
  onQuantityIncrement,
  onQuantityDecrement,
  setItemQuantity,
  onItemRemove,
}) => {
  const { closeCart } = useCartStore();

  // State for managing the input value
  const [inputValue, setInputValue] = useState<string>(
    item.quantity.toString()
  );
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  // Update input value when item quantity changes from external sources
  useEffect(() => {
    setInputValue(item.quantity.toString());
  }, [item.quantity]);

  // Helper function to check if item is loading
  const isItemLoading = (
    itemId: string,
    action: "increment" | "decrement" | "remove" | "add"
  ) => {
    return loadingStates[itemId] === action;
  };

  // Helper function to check if any item in the cart is being removing
  const isAnyItemRemoving = () => {
    return Object.values(loadingStates).includes("remove");
  };

  // Handler for quantity input changes
  const handleQuantityInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    // Allow empty string for better UX while typing
    if (value === "" || /^\d+$/.test(value)) {
      setInputValue(value);
    }
  };

  // Handler for updating quantity when input loses focus or Enter is pressed
  const handleQuantityUpdate = async () => {
    if (isUpdating) {
      return;
    }

    // Handle empty string - remove item from cart
    if (inputValue.trim() === "") {
      if (isRemoveLoading) {
        return;
      } // Already removing
      setIsUpdating(true);
      try {
        await onItemRemove(item.id);
      } finally {
        setIsUpdating(false);
      }
      return;
    }

    const newQuantity = parseInt(inputValue, 10);

    // Validation logic
    if (isNaN(newQuantity) || newQuantity < 0) {
      // Reset to 1 for negative or invalid values
      setInputValue("1");
      setIsUpdating(true);
      try {
        await setItemQuantity(item.id, 1);
      } finally {
        setIsUpdating(false);
      }
      return;
    }

    if (newQuantity === 0) {
      // Remove item if quantity is 0
      if (isRemoveLoading) {
        return;
      } // Already removing
      setIsUpdating(true);
      try {
        await onItemRemove(item.id);
      } finally {
        setIsUpdating(false);
      }
      return;
    }

    // Enforce maximum quantity limit
    let finalQuantity = newQuantity;
    if (newQuantity > MAX_QUANTITY) {
      finalQuantity = MAX_QUANTITY;
      setInputValue(MAX_QUANTITY.toString());
    }

    // Only update if quantity has actually changed
    if (finalQuantity !== item.quantity) {
      setIsUpdating(true);
      try {
        await setItemQuantity(item.id, finalQuantity);
      } finally {
        setIsUpdating(false);
      }
    }
  };

  // Handler for Enter key press
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleQuantityUpdate();
      (e.target as HTMLInputElement).blur();
    }
  };

  // Handler for input blur
  const handleBlur = () => {
    handleQuantityUpdate();
  };

  // Extract all conditions into constants
  const hasImage = getCartImage(item);

  const itemPricePaise = extractPricePaise(item?.price);
  const itemOriginalPricePaise = extractPricePaise(item?.original_price);

  const hasCompareAtPrice =
    itemOriginalPricePaise > 0 && itemOriginalPricePaise > itemPricePaise;

  const isDecrementLoading = isItemLoading(item.id, "decrement");
  const isIncrementLoading = isItemLoading(item.id, "increment");
  const isRemoveLoading = isItemLoading(item.id, "remove");

  // Updated: Remove the quantity <= 1 check from disabled condition
  const isDecrementDisabled = isDecrementLoading || isAnyItemRemoving();
  const isIncrementDisabled =
    isIncrementLoading || isAnyItemRemoving() || item.quantity >= MAX_QUANTITY;
  const isRemoveDisabled = isRemoveLoading || isAnyItemRemoving();

  // Handler for remove button click - prevents multiple simultaneous removals
  const handleRemoveClick = async () => {
    // Prevent multiple simultaneous removals
    if (isRemoveLoading || isUpdating || isAnyItemRemoving()) {
      return; // Already processing
    }
    await onItemRemove(item.id);
  };

  // Handler for decrement button click
  const handleDecrementClick = async () => {
    await onQuantityDecrement(item.id);
  };

  // Handler for increment button click with max quantity check
  const handleIncrementClick = async () => {
    if (item.quantity < MAX_QUANTITY) {
      await onQuantityIncrement(item.id);
    }
  };

  return (
    <Flex
      key={item.id}
      className="cart-item flex gap-x-[14px] md:gap-x-[24px] py-8 font-body"
      data-testid={`bblunt-cart-item-${item.id}`}
    >
      {hasImage && (
        <Link
          href={item?.handle ? `/products/${item.handle}` : "#"}
          onClick={(e) => {
            if (!item?.handle) {
              e.preventDefault();
            } else {
              closeCart();
            }
          }}
          className="h-[80px] aspect-square"
        >
          <Image
            src={hasImage}
            alt={item.title}
            width={80}
            height={80}
            objectFit="cover"
            priority
            className="h-full cart-item-image cursor-pointer rounded-[4px]"
            data-testid={`bblunt-cart-item-image-${item.id}`}
          />
        </Link>
      )}

      <div data-testid={`bblunt-cart-item-details-${item.id}`}>
        <Link
          href={item?.handle ? `/products/${item.handle}` : "#"}
          onClick={(e) => {
            if (!item?.handle) {
              e.preventDefault();
            } else {
              closeCart();
            }
          }}
          className="cart-item-title text-text-base md:text-text-lg text-black hover:text-[#0089DD] line-clamp-1 cursor-pointer !leading-none transition-colors duration-300"
          data-testid={`bblunt-cart-item-title-${item.id}`}
        >
          {item.title}
        </Link>

        <Box className="cart-item-details">
          <div
            className="flex gap-x-2 mt-[6px]"
            data-testid={`bblunt-cart-item-price-section-${item.id}`}
          >
            {hasCompareAtPrice ? (
              <p
                className="text-text-base font-medium text-[#0000008c] line-through !leading-none"
                data-testid={`bblunt-cart-item-compare-price-${item.id}`}
              >
                {`${formatPaiseToINR(itemOriginalPricePaise)}`}
              </p>
            ) : null}
            <p
              className="cart-item-price text-text-base whitespace-nowrap font-semibold text-primary !leading-none"
              data-testid={`bblunt-cart-item-price-${item.id}`}
            >
              {`${formatPaiseToINR(itemPricePaise)}`}
            </p>
          </div>

          <Flex
            className="cart-item-actions flex items-center gap-5 mt-[10px]"
            data-testid={`bblunt-cart-item-actions-${item.id}`}
          >
            <Flex
              className="cart-item-quantity flex gap-[8px] items-center bg-[#f2f2f2] rounded-[10px] border border-primary/10 h-[30px] px-[10px] font-body"
              data-testid={`bblunt-cart-item-quantity-controls-${item.id}`}
            >
              <button
                className={`h-full text-text-base text-black hover:text-[#0089DD] font-normal flex items-center justify-center ${
                  isDecrementDisabled
                    ? "cursor-not-allowed opacity-50"
                    : "cursor-pointer"
                }`}
                onClick={handleDecrementClick}
                disabled={isDecrementDisabled}
                aria-label={
                  item.quantity === 1 ? "Remove item" : "Decrease quantity"
                }
                data-testid={`bblunt-cart-item-decrement-${item.id}`}
              >
                <svg width="9" height="1" viewBox="0 0 9 1" fill="currentColor">
                  <path d="M9 1H5.14286H3.85714H0V1.50201e-05H3.85714L5.14286 0L9 1.50201e-05V1Z"></path>
                </svg>
              </button>
              <input
                type="text"
                value={inputValue}
                onChange={handleQuantityInputChange}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                disabled={
                  isUpdating || isDecrementLoading || isIncrementLoading
                }
                className="quantity-input bg-transparent w-12 h-full text-text-sm font-medium text-center outline-none focus:ring-0 disabled:opacity-50 leading-[30px]"
                aria-label="Item quantity"
                data-testid={`bblunt-cart-item-quantity-input-${item.id}`}
              />
              <button
                className={`h-full text-text-base text-black hover:text-[#0089DD] font-normal flex items-center justify-center ${
                  isIncrementDisabled
                    ? "cursor-not-allowed opacity-50"
                    : "cursor-pointer"
                }`}
                onClick={handleIncrementClick}
                disabled={isIncrementDisabled}
                aria-label="Increase quantity"
                data-testid={`bblunt-cart-item-increment-${item.id}`}
              >
                <svg width="9" height="9" viewBox="0 0 9 9" fill="currentColor">
                  <path d="M9 5.14286H5.14286V9H3.85714V5.14286H0V3.85714H3.85714V0H5.14286V3.85714H9V5.14286Z"></path>
                </svg>
              </button>
            </Flex>

            <button
              className={`cart-item-remove bg-transparent border-none text-text-sm h-[30px] flex items-center font-body ${
                isRemoveDisabled
                  ? "cursor-not-allowed opacity-50"
                  : "cursor-pointer"
              }`}
              onClick={handleRemoveClick}
              disabled={isRemoveDisabled}
              aria-label="Remove item"
              data-testid={`bblunt-cart-item-remove-${item.id}`}
            >
              <span className="underline text-text-sm text-[#545454] hover:text-[#0089DD] font-normal">
                Remove
              </span>
            </button>
          </Flex>
        </Box>
      </div>
    </Flex>
  );
};
