"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Box, Flex, Text, Button } from "@/ui/atomic";
import { ShopifyCartDrawerProps } from "./types";

// Import components
import {
  CartItem,
  ShopifyCartSummary,
  LoadingSpinner,
  CustomCursor,
  EmptyCartView,
} from "./components";
import { CouponOffersComponent } from "./coupons";
import { useCartStore } from "@shopkit/cart";

/**
 * ShopifyCartDrawer Component
 * Displays a sliding cart drawer with cart items and Shopify checkout functionality
 */
export function ShopifyCartDrawer({}: ShopifyCartDrawerProps) {
  const router = useRouter();

  // Get cart context
  const {
    items,
    isOpen,
    closeCart,
    openCart,
    removeItem,
    updateItemQuantity,
    isLoading,
    error,
    cartToken,
  } = useCartStore();

  // Individual loading states for cart actions
  const [loadingStates, setLoadingStates] = useState<{
    [key: string]: "increment" | "decrement" | "remove" | "add" | null;
  }>({});
  const [showCustomCursor, setShowCustomCursor] = useState(false);
  const [, setCursorPosition] = useState({ x: 0, y: 0 });
  // These will be used as fallbacks if translations fail
  const currencyCode = "INR";

  // Use items as primary source for cartTotal calculation
  const cartTotal = useMemo(() => {
    return items.reduce((total, item) => {
      const itemPrice =
        typeof item.price === "number" ? item.price : item.price.amount;
      return total + itemPrice * item.quantity;
    }, 0);
  }, [items]);

  // Get currency code from first item, fallback to config or USD
  const finalCurrencyCode =
    items.length > 0 && typeof items[0].price === "object"
      ? items[0].price.currencyCode
      : currencyCode;

  // Handle retry
  const handleRetry = () => {
    if (cartToken) {
      openCart();
    }
  };

  const navigateToCollection = () => {
    router.push("/collections/all");
    closeCart();
  };

  // Helper functions for individual loading states
  const setItemLoading = (
    itemId: string,
    action: "increment" | "decrement" | "remove" | "add" | null,
  ) => {
    setLoadingStates((prev) => ({
      ...prev,
      [itemId]: action,
    }));
  };

  // Enhanced cart action handlers with individual loading states
  const handleQuantityIncrement = async (
    itemId: string,
    currentQuantity: number,
  ) => {
    setItemLoading(itemId, "increment");
    try {
      await updateItemQuantity(itemId, currentQuantity + 1);
    } finally {
      setItemLoading(itemId, null);
    }
  };

  const handleQuantityDecrement = async (
    itemId: string,
    currentQuantity: number,
  ) => {
    if (currentQuantity <= 1) {
      return;
    }

    setItemLoading(itemId, "decrement");
    try {
      await updateItemQuantity(itemId, Math.max(1, currentQuantity - 1));
    } finally {
      setItemLoading(itemId, null);
    }
  };

  const handleItemRemove = async (itemId: string) => {
    // Prevent duplicate removals - if already removing this item, ignore
    if (loadingStates[itemId] === "remove") {
      return; // Already removing this item
    }
    setItemLoading(itemId, "remove");
    try {
      await removeItem(itemId);
    } finally {
      setItemLoading(itemId, null);
    }
  };

  // Effect to handle body scroll lock and cursor tracking
  useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }
    const body = document.body;
    const html = document.documentElement;
    const prevBodyOverflow = body.style.overflow;
    const prevHtmlOverflow = html.style.overflow;

    if (isOpen) {
      body.style.overflow = "hidden";
      html.style.overflow = "hidden";
    } else {
      body.style.overflow = prevBodyOverflow;
      html.style.overflow = prevHtmlOverflow;
    }

    // Track cursor position to detect if it's over overlay or modal
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPosition({ x: e.clientX, y: e.clientY });

      const cartDrawer = document.querySelector(
        '[data-testid="bblunt-cart-drawer"]',
      );
      if (!cartDrawer) return;

      const drawerRect = cartDrawer.getBoundingClientRect();
      const isOverDrawer = e.clientX >= drawerRect.left;

      // Check if cursor is over any modal (Gokwik or other third-party modals)
      const elementAtCursor = document.elementFromPoint(e.clientX, e.clientY);
      const isOverModal =
        elementAtCursor &&
        (elementAtCursor.closest("iframe") ||
          elementAtCursor.closest('[class*="gokwik"]') ||
          elementAtCursor.closest('[id*="gokwik"]') ||
          elementAtCursor.closest('[class*="modal"]') ||
          elementAtCursor.closest('[role="dialog"]'));

      // Show cursor only if: cart is open AND not over drawer AND not over any modal
      const shouldShowCustomCursor = isOpen && !isOverDrawer && !isOverModal;
      setShowCustomCursor(shouldShowCustomCursor);

      if (shouldShowCustomCursor) {
        document.body.style.cursor = "none";
      } else {
        document.body.style.cursor = "auto";
      }
    };

    if (isOpen) {
      document.addEventListener("mousemove", handleMouseMove);
    } else {
      // When cart is closed, hide custom cursor and restore normal cursor
      setShowCustomCursor(false);
      document.body.style.cursor = "auto";
    }

    return () => {
      body.style.overflow = prevBodyOverflow;
      html.style.overflow = prevHtmlOverflow;
      document.body.style.cursor = "auto";
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, [isOpen]);

  return (
    <>
      {isLoading && <LoadingSpinner />}
      <CustomCursor isVisible={showCustomCursor} />

      <Box
        className={`cart-drawer-overlay fixed inset-0 w-full h-full bg-cart-overlay-dark transition-opacity duration-300 ease-in-out ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        style={{ zIndex: 9998 }}
        onClick={closeCart}
        data-testid="bblunt-cart-drawer-overlay"
      />
      <Box
        className={`cart-drawer fixed top-0 right-0 w-full max-w-[90%] md:max-w-[460px] h-full overflow-hidden bg-white text-text shadow-xl flex flex-col transition-transform duration-300 ease-in-out cursor-auto ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ zIndex: 9999 }}
        data-testid="bblunt-cart-drawer"
      >
        {/* Global loading overlay for cart operations */}
        <Flex
          justify="between"
          align="center"
          className="cart-drawer-header !px-[16px] !py-[17.5px] md:mx-[16px] border-b border-line-border/50"
        >
          <h2 className="cart-drawer-title text-black text-[20px] font-medium font-body">
            Your Cart
          </h2>
          <button
            className="cart-drawer-close bg-transparent cursor-pointer flex items-center justify-center px-[6px] py-[1px]"
            onClick={closeCart}
            aria-label="Close cart"
            data-testid="aqualogica-cart-drawer-close"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M20.4894 3.51063C15.8086 -1.17014 8.19199 -1.1706 3.51076 3.51063C-1.17048 8.19187 -1.17002 15.808 3.51076 20.4892C8.19153 25.1705 15.8081 25.1705 20.4894 20.4892C25.1701 15.808 25.1701 8.19141 20.4894 3.51063ZM16.7344 16.7343C16.3738 17.0949 15.7892 17.0949 15.4286 16.7343L12.0001 13.3058L8.40855 16.8973C8.04792 17.2579 7.46335 17.2579 7.10272 16.8973C6.74209 16.5366 6.74209 15.9521 7.10272 15.5914L10.6942 11.9999L7.26572 8.57143C6.90509 8.2108 6.90509 7.62576 7.26572 7.2656C7.62635 6.90497 8.21092 6.90497 8.57155 7.2656L12.0001 10.6941L15.2651 7.42906C15.6257 7.06843 16.2103 7.06843 16.5709 7.42906C16.9316 7.78968 16.9316 8.37426 16.5709 8.73489L13.3059 11.9999L16.7344 15.4284C17.095 15.7891 17.095 16.3736 16.7344 16.7343Z"
                fill="#CCCCCC"
              ></path>
            </svg>
          </button>
        </Flex>

        <div
          className="flex-1 overflow-y-scroll"
          data-testid="bblunt-cart-drawer-content"
        >
          <div data-testid="bblunt-cart-drawer-offers">
            <CouponOffersComponent />
          </div>

          {/* Error state */}
          {error && (
            <Box
              className="cart-error flex flex-col items-center justify-center py-[48px] text-center"
              data-testid="bblunt-cart-drawer-error"
            >
              <Text className="text-error mb-[16px] !font-body">
                Error: {error}
              </Text>
              <Button
                className="bg-primary text-white border-none rounded-sm px-[16px] py-[8px] text-sm font-medium cursor-pointer transition-colors hover:opacity-90 !font-body"
                onClick={handleRetry}
                data-testid="bblunt-cart-drawer-retry-button"
              >
                Try Again
              </Button>
            </Box>
          )}

          {/* Cart content */}
          {!error && (
            <>
              {items.length === 0 ? (
                <EmptyCartView onNavigateToCollection={navigateToCollection} />
              ) : (
                <div data-testid="bblunt-cart-drawer-items-section">
                  <p className="mx-[15px] mt-[16px] text-text-base font-semibold text-black tracking-[-0.333px] font-body">
                    Items in your cart
                  </p>
                  <Box
                    className="cart-items mx-[15px] flex flex-col divide-y divide-gray-200"
                    data-testid="bblunt-cart-drawer-items"
                  >
                    {items.map((item) => (
                      <CartItem
                        key={item.id}
                        item={item}
                        finalCurrencyCode={finalCurrencyCode}
                        loadingStates={loadingStates}
                        updateItemQuantity={updateItemQuantity}
                        onQuantityIncrement={handleQuantityIncrement}
                        onQuantityDecrement={handleQuantityDecrement}
                        onItemRemove={handleItemRemove}
                      />
                    ))}
                  </Box>
                </div>
              )}
            </>
          )}
        </div>

        {/* Cart Summary */}
        {!error && items?.length !== 0 && (
          <div data-testid="bblunt-cart-drawer-summary">
            <ShopifyCartSummary
              isLoading={isLoading}
              totalAmount={cartTotal}
              onCheckoutSuccess={() => {
                closeCart();
              }}
              onCheckoutError={(_error) => {
                // Error is already handled by ShopifyCheckoutService
              }}
            />
          </div>
        )}
      </Box>
    </>
  );
}
