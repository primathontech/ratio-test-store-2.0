"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useResponsive } from "@/hooks";
import { calculateDiscountPercentage } from "../utils";
import { EventType, publishEvent } from "shopkit-analytics";
import { useAddToCart } from "@shopkit/cart";

interface ProductStickyBarProps {
  data: any;
  selectedVariantId?: string;
  addToCartText?: string;
  soldOutText?: string;
  inclusiveOfAllTaxesText?: string;
  mrp?: string;
  discount?: string;
  rupeeSymbol?: string;
}

export const ProductStickyBar: React.FC<ProductStickyBarProps> = ({
  data,
  selectedVariantId,
  addToCartText,
  soldOutText,
  inclusiveOfAllTaxesText,
  mrp,
  discount,
  rupeeSymbol,
}) => {
  const { addToCart, loadingStates } = useAddToCart();
  const { isTablet } = useResponsive();
  const isLoading = loadingStates[data?.id] || false;
  const isAvailable = data?.availableForSale !== false;

  // Calculate prices at component level (convert from paisa to rupees)
  const defaultTitleVariant = data?.variants.find(
    (variant: any) => variant?.title === "Default Title",
  );
  const priceInPaise = defaultTitleVariant?.price ?? 0;
  const currentPrice = priceInPaise / 100;

  const compareAtPrice = data?.compare_at_price
    ? data.compare_at_price / 100
    : data?.price?.compareAtAmount
      ? data?.price.compareAtAmount / 100
      : data?.price?.compareAtPrice?.amount
        ? data?.price.compareAtPrice.amount / 100
        : undefined;

  const productImage = data?.images?.[0]?.url || "";
  const productTitle = data?.title || "";

  const handleAddToCart = async () => {
    try {
      publishEvent({
        type: EventType.ADD_TO_CART,
        productId: data?.id,
        productName: data?.title,
        price: currentPrice,
        currency: "INR",
        quantity: 1,
      });
      await addToCart({
        ...data,
        variantId: selectedVariantId || data.variantId,
        quantity: 1,
      });
    } catch (error) {
      console.error("Failed to add to cart:", error);
    }
  };

  const discountPercentage =
    compareAtPrice && compareAtPrice > currentPrice
      ? calculateDiscountPercentage(compareAtPrice, currentPrice)
      : null;

  const [isVisible, setIsVisible] = useState(false);
  const SCROLL_THRESHOLD = 900;

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || window.pageYOffset;
      setIsVisible(scrollY > SCROLL_THRESHOLD);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div
      data-testid="product-sticky-bar-container"
      className="hidden md:block fixed bottom-0 left-0 right-0 z-50 bg-white transition-all duration-300 ease-in-out"
      style={{
        boxShadow: "0px -4px 16px 0px rgba(0, 0, 0, 0.1)",
        height: "85px",
        transform: isVisible ? "translateY(0)" : "translateY(100%)",
        opacity: isVisible ? 1 : 0,
        pointerEvents: isVisible ? "auto" : "none",
      }}
    >
      <div
        data-testid="product-sticky-bar-inner-container"
        className={`max-w-[1440px] mx-auto relative h-full flex items-center gap-4 ${isTablet ? "px-4" : "px-5"}`}
      >
        {/* Product Image */}
        <div
          data-testid="product-sticky-bar-image-wrapper"
          className="flex-shrink-0"
          style={{
            width: isTablet ? "100px" : "120px",
            height: isTablet ? "100px" : "120px",
            marginTop: isTablet ? "-30px" : "-35px",
          }}
        >
          <Image
            src={productImage}
            alt={productTitle}
            width={isTablet ? 100 : 120}
            height={isTablet ? 100 : 120}
            className="w-full h-full object-cover"
            style={{
              border: "1px solid #DDDDDD",
              borderRadius: "24px",
            }}
            unoptimized
          />
        </div>

        {/* Product Title and Price Section */}
        <div
          data-testid="product-sticky-bar-title-price-section"
          className={`flex-1 flex flex-col justify-center min-w-0 ${isTablet ? "ml-4" : "ml-9"}`}
        >
          {/* Product Title */}
          <div
            data-testid="product-sticky-bar-title"
            className="mb-3 min-w-0"
            style={{
              fontFamily: "Gotham, sans-serif",
              fontWeight: 700,
              fontSize: isTablet ? "14px" : "16px",
              lineHeight: "1.2em",
              color: "#1D1D1D",
              maxWidth: isTablet ? "400px" : "699px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {productTitle}
          </div>

          {/* Price Section */}
          <div
            data-testid="product-sticky-bar-price-section"
            className="flex items-end flex-wrap gap-2"
            style={{
              gap: "8px",
            }}
          >
            {/* Current Price */}
            <span
              className="flex-shrink-0"
              style={{
                fontFamily: "Gotham, sans-serif",
                fontWeight: 700,
                fontSize: isTablet ? "18px" : "20px",
                lineHeight: "1.296em",
                color: "#1D1D1D",
              }}
            >
              {rupeeSymbol}
              {currentPrice}
            </span>

            {/* MRP and Discount (only show if discount exists) */}
            {discountPercentage && compareAtPrice && (
              <>
                <span
                  className="flex-shrink-0 whitespace-nowrap"
                  style={{
                    fontFamily: "Gotham, sans-serif",
                    fontWeight: 400,
                    fontSize: "14px",
                    lineHeight: "1.851em",
                    color: "#727272",
                    textDecoration: "line-through",
                    textDecorationThickness: "1px",
                    textDecorationColor: "#727272",
                  }}
                >
                  {mrp}: {rupeeSymbol}
                  {compareAtPrice}
                </span>
                <span
                  className="flex-shrink-0 whitespace-nowrap"
                  style={{
                    fontFamily: "Gotham, sans-serif",
                    fontWeight: 500,
                    fontSize: "14px",
                    lineHeight: "1.851em",
                    color: "#D6322C",
                  }}
                >
                  {discountPercentage}
                  {discount}
                </span>
              </>
            )}

            {/* Inclusive of all taxes */}
            <span
              className="flex-shrink-0 whitespace-nowrap"
              style={{
                fontFamily: "Gotham, sans-serif",
                fontWeight: 300,
                fontSize: "12px",
                lineHeight: "2em",
                color: "#727272",
              }}
            >
              {inclusiveOfAllTaxesText}
            </span>
          </div>
        </div>

        {/* Add to Cart Button */}
        <div
          data-testid="product-sticky-bar-add-to-cart-wrapper"
          className="flex-shrink-0"
          style={{
            width: isTablet ? "200px" : "256px",
            height: isTablet ? "48px" : "53px",
          }}
        >
          <button
            onClick={handleAddToCart}
            data-testid="product-sticky-bar-add-to-cart-button"
            disabled={isLoading || !isAvailable}
            style={{
              width: "100%",
              height: "100%",
              backgroundColor: "#1D1D1D",
              color: "#FFFFFF",
              fontFamily: "Gotham, sans-serif",
              fontWeight: 700,
              fontSize: isTablet ? "16px" : "20px",
              lineHeight: "1.2em",
              borderRadius: "8px",
              border: "none",
              cursor: isLoading || !isAvailable ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: isLoading || !isAvailable ? 0.5 : 1,
            }}
          >
            {isLoading
              ? "Adding..."
              : !isAvailable
                ? soldOutText
                : addToCartText}
          </button>
        </div>
      </div>
    </div>
  );
};
