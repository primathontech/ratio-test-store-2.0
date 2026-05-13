"use client";

import React, { memo, useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { useCartItems, useCartStore, type CartItem } from "@shopkit/cart";
import { ProductCardToast } from "@/ui/components/ProductCard/Toast";
import type { ApiProduct } from "@/widgets/common/ProductDetail/types";
import { StickyAddToCartProps } from "../types";

/**
 * Build the cart item shape expected by `@shopkit/cart`'s `addItem`.
 * Mirrors the helper used in `BbluntProductInfo` so behaviour matches PDP.
 */
function buildCartItem(product: ApiProduct, variantId?: string): CartItem {
  const lineId = variantId ?? product.id;
  const defaultVariant =
    product.variants?.find((v) => v.title === "Default Title") ||
    product.variants?.[0];
  const priceInPaise = defaultVariant?.price ?? product.price ?? 0;
  const compareAtPriceInPaise = product.compare_at_price;

  return {
    id: lineId,
    productId: product.id,
    variantId: variantId || defaultVariant?.id,
    sku: defaultVariant?.sku,
    title: product.title,
    price: { amount: priceInPaise, currencyCode: "INR" },
    compareAtPrice: compareAtPriceInPaise
      ? { amount: compareAtPriceInPaise, currencyCode: "INR" }
      : undefined,
    quantity: 1,
    image: product.image?.url || product.images?.[0]?.url,
    product_type: product.product_type,
  };
}

/* ------------------------------------------------------------------ */
/*  Inline SVG Icons                                                    */
/* ------------------------------------------------------------------ */

const CartIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M5.8782 5.5916L19.6927 5.59457C20.9808 5.71065 21.8243 6.7815 21.6731 8.06425C21.1058 9.78928 20.679 11.622 20.0719 13.3274C18.5183 17.6888 13.5396 15.931 10.0045 16.2888C8.25978 16.1316 6.77583 14.9822 6.24428 13.3137C5.57343 11.2095 5.23117 8.72319 4.6752 6.54816C4.41091 5.51421 4.05912 4.5017 3.81686 3.4618C3.75079 3.40466 2.33648 3.49156 2.06862 3.44692C1.30968 3.31954 1.31027 2.16952 2.06862 2.04273C2.43707 1.98082 3.54126 1.99392 3.93234 2.03261C4.42818 2.08202 4.86449 2.40405 5.09307 2.83441L5.8788 5.59219L5.8782 5.5916ZM6.23059 7.02198L7.57346 12.7441C7.89133 13.9465 8.93599 14.7852 10.1795 14.8661C12.1378 14.9935 14.2349 14.7673 16.2075 14.8632C17.3117 14.7465 18.201 14.1167 18.6308 13.0935C19.301 11.4976 19.6159 9.56011 20.238 7.92497C20.3838 7.61306 20.0028 7.02198 19.6909 7.02198H6.23059Z"
      fill="currentColor"
    />
    <path
      d="M9.07823 17.7275C11.9836 17.4073 12.3354 21.7722 9.51157 21.9919C6.73415 22.2074 6.37164 18.0258 9.07823 17.7275ZM9.21038 19.152C8.45263 19.2758 8.45203 20.4318 9.21038 20.5562C10.3169 20.7377 10.3175 18.971 9.21038 19.152Z"
      fill="currentColor"
    />
    <path
      d="M16.2212 17.7275C19.1266 17.4073 19.4784 21.7722 16.6546 21.9919C13.8772 22.2074 13.5146 18.0258 16.2212 17.7275ZM16.3534 19.152C15.5956 19.2758 15.595 20.4318 16.3534 20.5562C17.4599 20.7377 17.4605 18.971 16.3534 19.152Z"
      fill="currentColor"
    />
    <path
      d="M6.23058 7.022H19.6903C20.0022 7.022 20.3832 7.61308 20.2373 7.92499C19.6153 9.56014 19.3004 11.4977 18.6302 13.0935C18.2004 14.1174 17.3111 14.7465 16.2069 14.8632C14.2337 14.7668 12.1372 14.9936 10.1789 14.8662C8.93538 14.7852 7.89072 13.9465 7.57286 12.7441L6.22998 7.022H6.23058Z"
      fill="white"
    />
    <path
      d="M9.21038 19.152C10.3175 18.971 10.3169 20.7371 9.21038 20.5562C8.45204 20.4318 8.45263 19.2758 9.21038 19.152Z"
      fill="white"
    />
    <path
      d="M16.3533 19.152C17.4605 18.971 17.4599 20.7371 16.3533 20.5562C15.595 20.4318 15.5956 19.2758 16.3533 19.152Z"
      fill="white"
    />
  </svg>
);

/* ------------------------------------------------------------------ */
/*  V1 -- Sticky Add To Cart Bar                                       */
/* ------------------------------------------------------------------ */

export const V1 = memo(function V1({ data, settings }: StickyAddToCartProps) {
  const product = data?.success ? data.data : null;

  const productTitle = product?.title ?? settings?.productTitle ?? "";
  const productImage = product?.image?.url ?? settings?.productImage ?? "";
  const productImageAlt =
    product?.image?.alt_text ?? settings?.productImageAlt ?? "";
  const mrpLabel = settings?.mrpLabel || "M.R.P.";
  const price = product
    ? `\u20B9${Math.round(product.price / 100)}`
    : settings?.price || "";
  const inclusiveOfAllTaxesText =
    settings?.inclusiveOfAllTaxesText || "Incl. of all taxes";
  const buttonText = settings?.buttonText || "Add to cart";
  const cartHref = settings?.cartHref || "/cart";

  const [isVisible, setIsVisible] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const addItem = useCartStore((s) => s.addItem);
  const loadingItems = useCartStore((s) => s.loadingItems);
  const isCartOpen = useCartStore((s) => s.isOpen);
  const items = useCartItems();
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const isLoading =
    isAddingToCart || Boolean(product?.id && loadingItems[product.id]);

  const cartLine = product
    ? items.find((i) => (i.productId ?? i.product_id) === product.id)
    : undefined;
  const currentQuantity = cartLine?.quantity ?? 0;
  const isInCart = !!cartLine;

  const pendingAddRef = useRef<{
    prevQuantity: number;
    prevInCart: boolean;
  } | null>(null);
  const pendingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const pending = pendingAddRef.current;
    if (!pending) {
      return;
    }
    const becameInCart = isInCart && !pending.prevInCart;
    const quantityIncreased =
      isInCart && currentQuantity > pending.prevQuantity;
    if (becameInCart || quantityIncreased) {
      setShowToast(true);
      pendingAddRef.current = null;
      if (pendingTimeoutRef.current) {
        clearTimeout(pendingTimeoutRef.current);
        pendingTimeoutRef.current = null;
      }
    }
  }, [isInCart, currentQuantity]);

  useEffect(
    () => () => {
      if (pendingTimeoutRef.current) {
        clearTimeout(pendingTimeoutRef.current);
      }
    },
    []
  );

  /* Show/hide bar on scroll -- appears after scrolling past ~500px */
  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 500);
    };

    /* Always visible on mobile by default (matches source) */
    const isMobile = window.innerWidth < 1024;
    if (isMobile) {
      setIsVisible(true);
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleAddToCart = useCallback(async () => {
    if (!product) {
      return;
    }
    pendingAddRef.current = {
      prevQuantity: currentQuantity,
      prevInCart: isInCart,
    };
    if (pendingTimeoutRef.current) {
      clearTimeout(pendingTimeoutRef.current);
    }
    pendingTimeoutRef.current = setTimeout(() => {
      pendingAddRef.current = null;
      pendingTimeoutRef.current = null;
    }, 5000);

    setIsAddingToCart(true);
    try {
      await addItem(buildCartItem(product));
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("[StickyAddToCart] addItem failed:", error);
    } finally {
      setIsAddingToCart(false);
    }
  }, [product, addItem, currentQuantity, isInCart]);

  // Hide widget when no product data and no settings fallback
  if (!product && !settings?.productTitle) {
    return null;
  }

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-[3000] bg-secondary shadow-[0_-4px_10px_rgba(0,0,0,0.05)] transition-transform duration-500 ${
        isVisible ? "translate-y-0" : "translate-y-[calc(100%+44px)]"
      }`}
      style={{
        transitionTimingFunction: "cubic-bezier(0.19, 1, 0.22, 1)",
      }}
    >
      {/* ============================================ */}
      {/* DESKTOP LAYOUT (lg+): thumbnail + info + qty + ATC */}
      {/* ============================================ */}
      <div className="hidden md:block mx-auto max-w-[1400px] px-[50px]">
        <div className="flex items-center h-[85px] relative">
          {/* Product thumbnail -- positioned to extend above the bar */}
          <div className="relative w-[120px] min-w-[120px] h-[120px] -mt-11 mr-[15px]">
            <Image
              src={productImage}
              alt={productImageAlt}
              width={120}
              height={120}
              className="w-[120px] h-[120px] rounded-3xl object-cover"
            />
          </div>

          {/* Product info */}
          <div className="flex-1 min-w-0 pb-6 pt-2.5">
            {/* Title */}
            <h3 className="text-base leading-[19px] font-medium text-black mb-1 truncate">
              {productTitle}
            </h3>

            {/* Price row */}
            <div className="flex items-baseline gap-[5px]">
              <span className="text-sm leading-[14px] font-normal text-[#a3a3a3] tracking-[1px]">
                {mrpLabel}
              </span>
              <span className="text-xl leading-[20px] font-bold text-primary tracking-[1px]">
                {price}
              </span>
              <span className="text-xs italic text-[#a3a3a3] leading-[19.2px] whitespace-nowrap mt-2">
                {inclusiveOfAllTaxesText}
              </span>
            </div>
          </div>

          {/* ATC button -- desktop shows just "Add to cart" */}
          <div className="flex items-center ml-auto mb-4">
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={isLoading}
              className="flex items-center justify-center w-64 h-[53px] bg-black text-secondary rounded-[10px] border border-black text-xl leading-[24px] font-bold text-center cursor-pointer transition-[background-color,color,border] duration-[250ms] ease-in-out hover:bg-[#222222] disabled:cursor-not-allowed relative overflow-hidden"
              aria-label={`${buttonText} ${price}`}
            >
              {isLoading ? (
                <span
                  data-testid="sticky-add-to-cart-loading-spinner"
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"
                />
              ) : (
                <span>{buttonText}</span>
              )}
            </button>
          </div>
        </div>
      </div>

      <ProductCardToast
        show={showToast && !isCartOpen}
        onClose={() => setShowToast(false)}
        title="Item added to your cart"
      />
    </div>
  );
});
