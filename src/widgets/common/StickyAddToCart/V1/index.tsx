"use client";

import React, { memo, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { StickyAddToCartProps } from "../types";

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

const SpinnerIcon = () => (
  <svg
    width="16"
    height="16"
    className="animate-spin"
    focusable="false"
    role="presentation"
    viewBox="0 0 66 66"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <circle
      className="opacity-25"
      fill="none"
      strokeWidth="6"
      stroke="currentColor"
      cx="33"
      cy="33"
      r="30"
    />
    <circle
      fill="none"
      strokeWidth="6"
      stroke="currentColor"
      cx="33"
      cy="33"
      r="30"
      strokeDasharray="164"
      strokeDashoffset="120"
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
  const buttonText = settings?.buttonText || "Add to cart";
  const cartHref = settings?.cartHref || "/cart";

  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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

  const handleAddToCart = useCallback(() => {
    setIsLoading(true);
    /* Simulate add-to-cart -- in production, connect to useCart hook */
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  }, []);

  // Hide widget when no product data and no settings fallback
  if (!product && !settings?.productTitle) {
    return null;
  }

  return (
    <div
      className={[
        "fixed bottom-0 left-0 right-0",
        "z-[100]",
        "bg-[#ffffff]",
        "shadow-[0_-4px_10px_rgba(0,0,0,0.05)]",
        "transition-transform duration-500",
        isVisible ? "translate-y-0" : "translate-y-full",
      ].join(" ")}
      style={{
        transitionTimingFunction: "cubic-bezier(0.19, 1, 0.22, 1)",
      }}
    >
      {/* ============================================ */}
      {/* DESKTOP LAYOUT (lg+): thumbnail + info + qty + ATC */}
      {/* ============================================ */}
      <div
        className={[
          "hidden lg:block",
          "mx-auto",
          "max-w-[1400px]",
          "px-[50px]",
        ].join(" ")}
      >
        <div className="flex items-center h-[85px] relative">
          {/* Product thumbnail -- positioned to extend above the bar */}
          <div className="relative w-[120px] min-w-[120px] h-[120px] -mt-[44px] mr-[15px]">
            <Image
              src={productImage}
              alt={productImageAlt}
              width={120}
              height={120}
              className="w-[120px] h-[120px] rounded-[24px] object-cover"
            />
          </div>

          {/* Product info */}
          <div className="flex-1 min-w-0 py-[10px] pl-[15px]">
            {/* Title */}
            <h3
              className={[
                "font-[Gotham,sans-serif]",
                "text-[16px] leading-[19px]",
                "font-[500]",
                "text-[#000000]",
                "mb-[8px]",
                "truncate",
              ].join(" ")}
            >
              {productTitle}
            </h3>

            {/* Price row */}
            <div className="flex items-baseline gap-[5px]">
              <span
                className={[
                  "font-[Gotham,sans-serif]",
                  "text-[14px] leading-[14px]",
                  "font-[400]",
                  "text-[#a3a3a3]",
                  "tracking-[1px]",
                ].join(" ")}
              >
                {mrpLabel}
              </span>
              <span
                className={[
                  "font-[Gotham,sans-serif]",
                  "text-[20px] leading-[20px]",
                  "font-[700]",
                  "text-[#1d1d1d]",
                  "tracking-[1px]",
                ].join(" ")}
              >
                {price}
              </span>
            </div>
          </div>

          {/* ATC button -- desktop shows just "Add to cart" */}
          <div className="flex items-center ml-auto">
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={isLoading}
              className={[
                "flex items-center justify-center",
                "w-[256px] h-[53px]",
                "bg-[#000000] text-[#ffffff]",
                "rounded-[10px]",
                "border border-[#000000]",
                "font-[Gotham,sans-serif]",
                "text-[20px] leading-[24px]",
                "font-[700]",
                "text-center",
                "cursor-pointer",
                "transition-[background-color,color,border] duration-[250ms] ease-in-out",
                "hover:bg-[#222222]",
                "disabled:opacity-70 disabled:cursor-not-allowed",
                "relative overflow-hidden",
              ].join(" ")}
              aria-label={`${buttonText} ${price}`}
            >
              {isLoading ? <SpinnerIcon /> : <span>{buttonText}</span>}
            </button>
          </div>
        </div>
      </div>

      {/* ============================================ */}
      {/* MOBILE LAYOUT (<lg): "Add to cart - ₹399" + cart icon */}
      {/* ============================================ */}
      <div className="lg:hidden px-[15px] py-[8px]">
        <div className="flex items-center gap-[8px]">
          {/* ATC button -- mobile: full-width pill with "Add to cart - ₹399" */}
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={isLoading}
            className={[
              "flex-1",
              "flex items-center justify-center",
              "h-[59px]",
              "bg-[#000000] text-[#ffffff]",
              "rounded-[100px]",
              "border border-[#000000]",
              "font-[Gotham,sans-serif]",
              "text-[16px] leading-[16px]",
              "font-[500]",
              "text-center",
              "cursor-pointer",
              "transition-[background-color,color,border] duration-[250ms] ease-in-out",
              "hover:bg-[#222222]",
              "disabled:opacity-70 disabled:cursor-not-allowed",
              "gap-[4px]",
              "px-[10px] py-[20px]",
            ].join(" ")}
            aria-label={`${buttonText} ${price}`}
          >
            {isLoading ? (
              <SpinnerIcon />
            ) : (
              <>
                <span className="font-[Gotham,sans-serif] text-[16px] leading-[19px] font-[700]">
                  {buttonText}
                </span>
                <span className="font-[Gotham,sans-serif] text-[16px] leading-[16px] font-[700] mx-[4px]">
                  -
                </span>
                <span className="font-[Gotham,sans-serif] text-[16px] leading-[19px] font-[700]">
                  {price}
                </span>
              </>
            )}
          </button>

          {/* Cart icon link */}
          <Link
            href={cartHref}
            className={[
              "flex flex-col items-center justify-center",
              "w-[59px] h-[59px]",
              "shrink-0",
            ].join(" ")}
            aria-label="Cart"
          >
            <span className="relative w-[24px] h-[24px] text-[#1d1d1d]">
              <CartIcon />
            </span>
            <span
              className={[
                "font-[Gotham,sans-serif]",
                "text-[10px] leading-[12px]",
                "font-[400]",
                "text-[#1d1d1d]",
                "mt-[2px]",
              ].join(" ")}
            >
              Cart
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
});
