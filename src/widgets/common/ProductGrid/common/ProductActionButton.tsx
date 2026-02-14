"use client";

import React from "react";
import { Button } from "@/ui/atomic";
import Spinner from "./Spinner";
import { type CartItem } from "@shopkit/cart";

interface ProductActionButtonProps {
  isInCart: boolean;
  cartItem?: CartItem;
  isLoading: boolean;
  product: any;
  onAddToCart: (e: React.MouseEvent) => void;
  onIncrement?: () => void;
  onDecrement?: () => void;
  settings: {
    actionButtonText: string;
    actionButtonTextMobile: string;
    soldOutText: string;
    soldOutTextMobile: string;
    color: string;
    actionButtonTextColor: string;
    actionButtonClassName?: string;
  };
}

const ProductActionButton: React.FC<ProductActionButtonProps> = ({
  isInCart,
  cartItem,
  isLoading,
  product,
  onAddToCart,
  onIncrement,
  onDecrement,
  settings,
}) => {
  const {
    actionButtonText,
    actionButtonTextMobile,
    soldOutText,
    soldOutTextMobile,
    color,
    actionButtonTextColor,
    actionButtonClassName = "",
  } = settings;

  // Determine button colors based on actionButtonTextColor
  // If actionButtonTextColor is dark (#000), use white background (for dark cards)
  // If actionButtonTextColor is light (#fff), use black background (for light cards)
  const isDarkText = actionButtonTextColor === "#000" || actionButtonTextColor === "black";
  const buttonBgColor = isDarkText ? "#fff" : "#000";
  const buttonTextColor = actionButtonTextColor || "#fff";

  if (!isInCart) {
    return (
      <Button
        onClick={onAddToCart}
        disabled={isLoading}
        data-testid="product-action-add-to-cart-button"
        className={`w-full !font-body hover:opacity-90 !text-[14px] md:!text-[16px] !leading-none !tracking-[-0.24px] !font-bold text-white h-[32px] md:h-[36px] px-4 !rounded-[4px] transition-all duration-200 mt-auto ${actionButtonClassName} ${
          isLoading
            ? "opacity-50 cursor-not-allowed"
            : "disabled:cursor-not-allowed"
        }`}
        style={{
          backgroundColor: buttonBgColor,
          color: buttonTextColor,
        }}
      >
        {isLoading ? (
          <div
            data-testid="product-action-add-to-cart-loading"
            className="flex items-center justify-center gap-2"
          >
            <Spinner className="size-[2.4rem] text-gray-800" />
          </div>
        ) : product?.availableForSale === false ? (
          <>
            <span
              data-testid="product-action-sold-out-text-mobile"
              className="md:hidden"
            >
              {soldOutTextMobile}
            </span>
            <span
              data-testid="product-action-sold-out-text-desktop"
              className="hidden md:block"
            >
              {soldOutText}
            </span>
          </>
        ) : (
          <>
            <span
              data-testid="product-action-add-to-cart-text-mobile"
              className="md:hidden"
            >
              {actionButtonTextMobile}
            </span>
            <span
              data-testid="product-action-add-to-cart-text-desktop"
              className="hidden md:block"
            >
              {actionButtonText}
            </span>
          </>
        )}
      </Button>
    );
  }

  return (
    <div
      data-testid="product-action-quantity-container"
      className="w-full flex items-center justify-between rounded-[4px] h-[32px] md:h-[36px] px-3 mt-auto border"
      style={{
        backgroundColor: "#fff",
        borderColor: isDarkText ? "#000" : "#333",
      }}
    >
      <button
        data-testid="product-action-decrement-button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onDecrement?.();
        }}
        className="h-full flex items-center justify-center text-[#000] hover:opacity-70 transition-opacity"
        disabled={isLoading}
      >
        <span
          data-testid="product-action-decrement-icon"
          className="text-xl font-bold !leading-none"
        >
          −
        </span>
      </button>
      <span
        data-testid="product-action-quantity-value"
        className="flex justify-center items-center h-[24px] text-[14px] md:text-[16px] font-bold bg-[#F4F6F8] !leading-none text-center min-w-[32px] rounded-[2px] !text-black"
      >
        {isLoading ? (
          <Spinner className="size-[1.6rem] text-black" />
        ) : (
          cartItem?.quantity || 0
        )}
      </span>
      <button
        data-testid="product-action-increment-button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onIncrement?.();
        }}
        className="h-full flex items-center justify-center text-[#000] hover:opacity-70 transition-opacity"
        disabled={isLoading}
      >
        <span
          data-testid="product-action-increment-icon"
          className="text-xl font-bold !leading-none"
        >
          +
        </span>
      </button>
    </div>
  );
};

export default ProductActionButton;
