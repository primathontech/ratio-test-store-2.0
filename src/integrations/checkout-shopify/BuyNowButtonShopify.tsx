"use client";

import dynamic from "next/dynamic";
import React, { useState, useCallback } from "react";
import { BuyNowButtonShopifyProps } from "./types";
import { publishEvent, EventType } from "@shopkit/analytics";
import { useShopifyCheckout } from "./useShopifyCheckout";
import { getCartConfig } from "@shopkit/cart";

// Dynamically import the ShopifyCheckoutScript to avoid SSR issues
const ShopifyCheckoutScript = dynamic(() => import("./CheckoutScriptShopify"), {
  ssr: false,
});

export function BuyNowButtonShopify({
  children = "Buy Now",
  className,
  style,
  disabled = false,
  variantId,
  productId,
  title,
  price,
  quantity,
  imageUrl,
  onCheckoutStart,
  onCheckoutSuccess,
  onCheckoutError,
  redirectPath,
  loadingContent,
  buttonProps,
}: BuyNowButtonShopifyProps) {
  // State to track if GoKwik script is loaded
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [isScriptLoading, setIsScriptLoading] = useState(true);
  const [checkoutError, setCheckoutError] = useState<Error | null>(null);

  // Use the Shopify checkout hook directly
  const { startCheckout, isCheckoutLoading, isGokwikAvailable } =
    useShopifyCheckout({
      onCheckoutSuccess,
      onCheckoutError: (error) => {
        setCheckoutError(error);
        onCheckoutError?.(error);
      },
    });

  // Callback when script is loaded
  const handleScriptLoaded = useCallback(() => {
    setIsScriptLoaded(true);
    setIsScriptLoading(false);
  }, []);

  // Check if GoKwik is ready (script loaded and SDK available)
  const isGokwikReady = isScriptLoaded && isGokwikAvailable;

  const handleBuyNow = async () => {
    // Validate required parameters
    if (!variantId) {
      const error = new Error(
        "Cannot proceed with Buy Now: Product variant ID is required",
      );
      onCheckoutError?.(error);
      return;
    }

    if (!isGokwikReady) {
      const error = new Error(
        "Cannot proceed with Buy Now: Gokwik service is not ready. Please wait for the script to load.",
      );
      onCheckoutError?.(error);
      return;
    }

    // Validate price and quantity
    if (!price || typeof price.amount !== "number" || price.amount <= 0) {
      const error = new Error(
        "Cannot proceed with Buy Now: Invalid product price",
      );
      onCheckoutError?.(error);
      return;
    }

    // Send checkout started event
    publishEvent({
      type: EventType.INITIATE_CHECKOUT,
      cartValue: price.amount * quantity,
      currency: price.currencyCode,
      itemCount: 1,
      items: [
        {
          productId: productId,
          productName: title,
          price: price.amount,
          quantity: quantity,
          variant: variantId,
        },
      ],
    });

    // Send add payment info event
    publishEvent({
      type: EventType.ADD_PAYMENT_INFO,
      cartValue: price.amount * quantity,
      currency: price.currencyCode,
      itemCount: 1,
      paymentType: "gokwik",
      items: [
        {
          productId: productId,
          productName: title,
          price: price.amount,
          quantity: quantity,
          variant: variantId,
        },
      ],
    });

    try {
      onCheckoutStart?.();
      setCheckoutError(null);

      // Use cart service directly — create ephemeral cart, add item, start checkout
      const { cartService, merchantName } = getCartConfig();

      const newCart = await cartService.createCart(merchantName);
      await cartService.addToCart(newCart.id, [
        {
          productId,
          variantId,
          quantity,
        },
      ]);

      // Fetch the full cart to get checkoutUrl
      const fullCart = await cartService.getCart(newCart.id);

      await startCheckout({
        cartId: newCart.id,
        items: [
          {
            id: productId,
            productId,
            variantId,
            title,
            price,
            quantity,
            image: imageUrl,
          },
        ],
        total: price.amount * quantity,
        currencyCode: price.currencyCode,
        checkoutUrl: fullCart.checkoutUrl || "",
      });
    } catch (error) {
      const err =
        error instanceof Error
          ? error
          : new Error("Unknown error during Buy Now checkout");
      setCheckoutError(err);
      onCheckoutError?.(err);
    }
  };

  // Button is disabled if explicitly disabled, checkout is loading, script is loading, or Gokwik is not ready
  const isButtonDisabled =
    disabled || isCheckoutLoading || isScriptLoading || !isGokwikReady;

  return (
    <>
      {/* Load GoKwik Checkout Script */}
      <ShopifyCheckoutScript onLoaded={handleScriptLoaded} />

      <button
        {...buttonProps}
        className={className}
        style={style}
        onClick={handleBuyNow}
        disabled={isButtonDisabled}
        type="button"
      >
        {isScriptLoading
          ? (loadingContent ?? <span>Loading...</span>)
          : isCheckoutLoading
            ? (loadingContent ?? <span>Processing...</span>)
            : children}
      </button>

      {/* Display error if any */}
      {checkoutError && (
        <div
          style={{
            color: "red",
            fontSize: "0.875rem",
            marginTop: "0.5rem",
            textAlign: "center",
          }}
        >
          {checkoutError.message}
        </div>
      )}
    </>
  );
}
