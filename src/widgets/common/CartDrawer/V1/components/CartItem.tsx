"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Box, Flex, Image } from "@/ui/atomic";
import { formatPaiseToINR } from "@/utils";
import { useCartStore } from "@shopkit/cart";

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

const MAX_QUANTITY = 40;

export const CartItem: React.FC<CartItemProps> = ({
  item,
  loadingStates,
  onQuantityIncrement,
  onQuantityDecrement,
  setItemQuantity,
  onItemRemove,
}) => {
  const { closeCart } = useCartStore();

  const [inputValue, setInputValue] = useState<string>(
    item.quantity.toString()
  );
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  useEffect(() => {
    setInputValue(item.quantity.toString());
  }, [item.quantity]);

  const isItemLoading = (
    itemId: string,
    action: "increment" | "decrement" | "remove" | "add"
  ) => {
    return loadingStates[itemId] === action;
  };

  const isAnyItemRemoving = () => {
    return Object.values(loadingStates).includes("remove");
  };

  const handleQuantityInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    if (value === "" || /^\d+$/.test(value)) {
      setInputValue(value);
    }
  };

  const handleQuantityUpdate = async () => {
    if (isUpdating) {
      return;
    }

    if (inputValue.trim() === "") {
      if (isRemoveLoading) {
        return;
      }
      setIsUpdating(true);
      try {
        await onItemRemove(item.id);
      } finally {
        setIsUpdating(false);
      }
      return;
    }

    const newQuantity = parseInt(inputValue, 10);

    if (isNaN(newQuantity) || newQuantity < 0) {
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
      if (isRemoveLoading) {
        return;
      }
      setIsUpdating(true);
      try {
        await onItemRemove(item.id);
      } finally {
        setIsUpdating(false);
      }
      return;
    }

    let finalQuantity = newQuantity;
    if (newQuantity > MAX_QUANTITY) {
      finalQuantity = MAX_QUANTITY;
      setInputValue(MAX_QUANTITY.toString());
    }

    if (finalQuantity !== item.quantity) {
      setIsUpdating(true);
      try {
        await setItemQuantity(item.id, finalQuantity);
      } finally {
        setIsUpdating(false);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleQuantityUpdate();
      (e.target as HTMLInputElement).blur();
    }
  };

  const handleBlur = () => {
    handleQuantityUpdate();
  };

  const hasImage = item.image;

  const hasCompareAtPrice =
    item?.original_price &&
    item?.original_price > 0 &&
    Number(item?.original_price) > Number(item?.price);

  const isDecrementLoading = isItemLoading(item.id, "decrement");
  const isIncrementLoading = isItemLoading(item.id, "increment");
  const isRemoveLoading = isItemLoading(item.id, "remove");

  const isDecrementDisabled = isDecrementLoading || isAnyItemRemoving();
  const isIncrementDisabled =
    isIncrementLoading || isAnyItemRemoving() || item.quantity >= MAX_QUANTITY;
  const isRemoveDisabled = isRemoveLoading || isAnyItemRemoving();

  const handleRemoveClick = async () => {
    if (isRemoveLoading || isUpdating || isAnyItemRemoving()) {
      return;
    }
    await onItemRemove(item.id);
  };

  const handleDecrementClick = async () => {
    await onQuantityDecrement(item.id);
  };

  const handleIncrementClick = async () => {
    if (item.quantity < MAX_QUANTITY) {
      await onQuantityIncrement(item.id);
    }
  };

  return (
    <Flex
      key={item.id}
      className="cart-item flex gap-x-3.5 md:gap-x-6 py-8 font-body"
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
          className="h-20 aspect-square"
        >
          <Image
            src={hasImage}
            alt={item.title}
            width={80}
            height={80}
            objectFit="cover"
            priority
            className="h-full cart-item-image cursor-pointer rounded"
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
          className="cart-item-title text-sm md:text-base text-black hover:text-[#0089DD] line-clamp-1 cursor-pointer !leading-none transition-colors duration-300"
          data-testid={`bblunt-cart-item-title-${item.id}`}
        >
          {item.title}
        </Link>

        <Box className="cart-item-details">
          <div
            className="flex gap-x-2 mt-1.5"
            data-testid={`bblunt-cart-item-price-section-${item.id}`}
          >
            {hasCompareAtPrice ? (
              <p
                className="text-sm font-medium text-[#0000008c] line-through !leading-none"
                data-testid={`bblunt-cart-item-compare-price-${item.id}`}
              >
                {`${formatPaiseToINR(Number(item?.original_price))}`}
              </p>
            ) : null}
            <p
              className="cart-item-price text-sm whitespace-nowrap font-semibold text-primary !leading-none"
              data-testid={`bblunt-cart-item-price-${item.id}`}
            >
              {`${formatPaiseToINR(Number(item?.price))}`}
            </p>
          </div>

          <Flex
            className="cart-item-actions flex items-center gap-5 mt-2.5"
            data-testid={`bblunt-cart-item-actions-${item.id}`}
          >
            <Flex
              className="cart-item-quantity flex gap-2 items-center bg-[#f2f2f2] rounded-[10px] border border-primary/10 h-[30px] px-2.5 font-body"
              data-testid={`bblunt-cart-item-quantity-controls-${item.id}`}
            >
              <button
                className={`h-full text-sm text-black hover:text-[#0089DD] font-normal flex items-center justify-center ${
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
                className="quantity-input bg-transparent w-12 h-full text-xs font-medium text-center outline-none focus:ring-0 disabled:opacity-50 leading-[30px]"
                aria-label="Item quantity"
                data-testid={`bblunt-cart-item-quantity-input-${item.id}`}
              />
              <button
                className={`h-full text-sm text-black hover:text-[#0089DD] font-normal flex items-center justify-center ${
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
              className={`cart-item-remove bg-transparent border-none text-xs h-[30px] flex items-center font-body ${
                isRemoveDisabled
                  ? "cursor-not-allowed opacity-50"
                  : "cursor-pointer"
              }`}
              onClick={handleRemoveClick}
              disabled={isRemoveDisabled}
              aria-label="Remove item"
              data-testid={`bblunt-cart-item-remove-${item.id}`}
            >
              <span className="underline text-xs text-[#545454] hover:text-[#0089DD] font-normal">
                Remove
              </span>
            </button>
          </Flex>
        </Box>
      </div>
    </Flex>
  );
};
