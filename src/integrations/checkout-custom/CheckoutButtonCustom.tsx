/**
 * CheckoutButtonCustom Component
 *
 * A reusable checkout button component that handles Gokwik checkout functionality.
 * This component can be used in any cart drawer design across different merchants.
 */

"use client";
import { publishEvent, EventType } from "@shopkit/analytics";
import {
  convertCartItemsForCheckout,
  useCustomCheckout,
} from "./useCustomCheckout";
import React from "react";
import { CheckoutButtonCustomProps } from "./types";
import { useCartStore } from "@shopkit/cart";
import CheckoutScriptCustom from "./CheckoutScriptCustom";

/**
 * Reusable Custom checkout button component
 */
export function CheckoutButtonCustom({
  children = "Checkout",
  className,
  style,
  disabled = false,
  onCheckoutStart,
  onCheckoutSuccess,
  onCheckoutError,
  clearCartOnSuccess = true,
  closeCartOnSuccess = true,
  redirectPath,
  buttonProps,
}: CheckoutButtonCustomProps) {
  const { items, cartToken, checkoutUrl, clearCart, closeCart } =
    useCartStore();

  // Calculate cart total
  const cartTotal = items.reduce((total, item) => {
    const itemPrice =
      typeof item.price === "number" ? item.price : item.price.amount;
    return total + itemPrice * item.quantity;
  }, 0);

  // Get currency code from first item, fallback to INR
  const currencyCode =
    items.length > 0 && typeof items[0].price === "object"
      ? items[0].price.currencyCode
      : "INR";

  const { startCheckout, checkoutError, isGokwikAvailable } = useCustomCheckout(
    {
      onCheckoutSuccess: (order) => {
        // Call custom success handler
        onCheckoutSuccess?.(order);
      },
      onCheckoutError: (error) => {
        console.error("Checkout failed:", error);
        onCheckoutError?.(error);
      },
      redirectPath,
      clearCartOnSuccess,
      closeCartOnSuccess,
      clearCart,
      closeCart,
    },
  );

  const handleCheckout = async () => {
    console.log("### Custom Checkout Button Cliked");

    if (!cartToken || items.length === 0) {
      console.warn("Cannot checkout: No cart ID or empty cart");
      return;
    }

    if (!isGokwikAvailable) {
      console.error("Gokwik is not available");
      onCheckoutError?.(new Error("Checkout service is not available"));
      return;
    }

    // Send checkout started event
    publishEvent({
      type: EventType.INITIATE_CHECKOUT,
      cartValue: cartTotal,
      currency: currencyCode,
      itemCount: items.length,
      items: items.map((item) => ({
        productId: item.productId || item.id,
        productName: item.title,
        price: typeof item.price === "number" ? item.price : item.price.amount,
        quantity: item.quantity,
      })),
    });

    // Send checkout payment event
    publishEvent({
      type: EventType.ADD_PAYMENT_INFO,
      cartValue: cartTotal,
      currency: currencyCode,
      itemCount: items.length,
      paymentType: "checkout",
      items: items.map((item) => ({
        productId: item.productId || item.id,
        productName: item.title,
        price: typeof item.price === "number" ? item.price : item.price.amount,
        quantity: item.quantity,
      })),
    });
    // Call checkout start callback
    onCheckoutStart?.();

    try {
      await startCheckout({
        cartToken: cartToken,
        items: convertCartItemsForCheckout(items),
        total: cartTotal,
        currencyCode,
        checkoutUrl: checkoutUrl || "",
      });
    } catch (error) {
      console.error("Failed to start checkout:", error);
    }
  };

  const isButtonDisabled =
    disabled || items.length === 0 || !cartToken || !isGokwikAvailable;

  return (
    <>
      {/* Load GoKwik Checkout Script */}
      <CheckoutScriptCustom />

      <button
        {...buttonProps}
        className={className}
        style={style}
        onClick={handleCheckout}
        disabled={isButtonDisabled}
        type="button"
        data-debug="main hu checkout"
      >
        {children}
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
