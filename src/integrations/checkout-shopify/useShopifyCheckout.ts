/**
 * useShopifyCheckout Hook
 *
 * React hook for integrating Gokwik checkout functionality.
 * This hook provides a clean interface for components to use Gokwik checkout.
 */

"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  CartItem,
  CheckoutConfig,
  CheckoutEventHandlers,
  ShopifyCheckoutService,
} from "./ShopifyCheckoutService";

export interface UseShopifyCheckoutOptions {
  /**
   * Callback when checkout is successfully completed
   */
  onCheckoutSuccess?: (order: any) => void;

  /**
   * Callback when checkout fails
   */
  onCheckoutError?: (error: Error) => void;

  /**
   * Callback when payment is successful
   */
  onPaymentSuccess?: (data: any) => void;

  /**
   * Callback when user logs in during checkout
   */
  onUserLogin?: (data: any) => void;

  /**
   * Whether to clear cart after successful checkout
   * @default true
   */
  clearCartOnSuccess?: boolean;

  /**
   * Whether to close cart drawer after successful checkout
   * @default true
   */
  closeCartOnSuccess?: boolean;

  /**
   * Whether to redirect to order page after successful checkout
   * @default true
   */
  redirectOnSuccess?: boolean;

  /**
   * Custom redirect path after successful checkout
   * If not provided, will redirect to /{customerId}/orders/{orderId}
   */
  redirectPath?: string;

  /**
   * Cart clearing function (passed from component)
   */
  clearCart?: () => void;

  /**
   * Cart closing function (passed from component)
   */
  closeCart?: () => void;
}

export interface UseShopifyCheckoutReturn {
  /**
   * Initialize and start the checkout process
   */
  startCheckout: (
    config: Omit<CheckoutConfig, "eventHandlers">,
  ) => Promise<void>;

  /**
   * Whether checkout is currently in progress
   */
  isCheckoutLoading: boolean;

  /**
   * Last error that occurred during checkout
   */
  checkoutError: Error | null;

  /**
   * Clear the checkout error
   */
  clearCheckoutError: () => void;

  /**
   * Check if Gokwik is available
   */
  isGokwikAvailable: boolean;

  /**
   * Close the checkout manually
   */
  closeCheckout: () => void;
}

/**
 * Hook for Gokwik checkout integration
 */
export function useShopifyCheckout(
  options: UseShopifyCheckoutOptions = {},
): UseShopifyCheckoutReturn {
  const {
    onCheckoutSuccess,
    onCheckoutError,
    onPaymentSuccess,
    onUserLogin,
    clearCartOnSuccess = true,
    closeCartOnSuccess = true,
    redirectOnSuccess = true,
    redirectPath,
    clearCart,
    closeCart,
  } = options;

  const router = useRouter();
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState<Error | null>(null);
  const currentConfigRef = useRef<CheckoutConfig | null>(null);

  const clearCheckoutError = useCallback(() => {
    setCheckoutError(null);
  }, []);

  const closeCheckout = useCallback(() => {
    ShopifyCheckoutService.closeCheckout();
    setIsCheckoutLoading(false);
  }, []);

  const startCheckout = useCallback(
    async (config: Omit<CheckoutConfig, "eventHandlers">) => {
      setIsCheckoutLoading(true);
      setCheckoutError(null);

      // Store current config for use in event handlers
      currentConfigRef.current = config as CheckoutConfig;

      const eventHandlers: CheckoutEventHandlers = {
        onOrderComplete: (order: any) => {
          console.info("Order completed:", order);

          const orderId = order?.merchant_order_id || `temp-${Date.now()}`;

          // Clear cart if enabled and function provided
          if (clearCartOnSuccess && clearCart) {
            clearCart();
          }

          // Close cart drawer if enabled and function provided
          if (closeCartOnSuccess && closeCart) {
            closeCart();
          }

          // Call custom success handler
          onCheckoutSuccess?.(order);

          setIsCheckoutLoading(false);
        },

        onPaymentSuccess: (data: any) => {
          console.info("Payment successful:", data);

          // Call custom payment success handler
          onPaymentSuccess?.(data);
        },

        onCheckoutComplete: (data: any) => {
          console.info("Checkout completed:", data);
          setIsCheckoutLoading(false);
        },

        onUserLogin: (data: any) => {
          console.info("User logged in:", data);

          // Call custom user login handler
          onUserLogin?.(data);
        },

        onAddressSelected: (data: any) => {
          console.info("Address selected:", data);
        },

        onPaymentMethodSelected: (data: any) => {
          console.info("Payment method selected:", data);
        },

        onError: (error: Error) => {
          console.error("Checkout error:", error);
          setCheckoutError(error);
          setIsCheckoutLoading(false);

          // Call custom error handler
          onCheckoutError?.(error);
        },
      };

      try {
        await ShopifyCheckoutService.initializeCheckout({
          ...config,
          eventHandlers,
        });
      } catch (error) {
        const checkoutError =
          error instanceof Error ? error : new Error("Unknown checkout error");
        setCheckoutError(checkoutError);
        setIsCheckoutLoading(false);
        onCheckoutError?.(checkoutError);
      }
    },
    [
      router,
      onCheckoutSuccess,
      onCheckoutError,
      onPaymentSuccess,
      onUserLogin,
      redirectOnSuccess,
      redirectPath,
      clearCartOnSuccess,
      closeCartOnSuccess,
      clearCart,
      closeCart,
    ],
  );

  const [isGokwikAvailable, setIsGokwikAvailable] = useState(false);

  // Check availability on client side only, with polling for script load
  useEffect(() => {
    const checkAvailability = () => {
      const available = ShopifyCheckoutService.isGokwikAvailable();
      if (available) {
        setIsGokwikAvailable(true);
        return true;
      }
      return false;
    };

    // Check immediately
    if (checkAvailability()) return;

    // Poll for script availability (script might load after component mounts)
    const interval = setInterval(() => {
      if (checkAvailability()) {
        clearInterval(interval);
      }
    }, 100);

    // Cleanup after 5 seconds if still not available
    const timeout = setTimeout(() => {
      clearInterval(interval);
    }, 5000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  return {
    startCheckout,
    isCheckoutLoading,
    checkoutError,
    clearCheckoutError,
    isGokwikAvailable,
    closeCheckout,
  };
}

/**
 * Helper function to convert cart items to the format expected by the checkout service
 */
export function convertCartItemsForCheckout(items: any[]): CartItem[] {
  return items.map((item) => ({
    id: item.id,
    productId: item.productId,
    variantId: item.variantId,
    title: item.title,
    price: item.price,
    quantity: item.quantity,
    image: item.image,
  }));
}
