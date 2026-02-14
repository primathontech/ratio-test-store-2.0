"use client";

import React from "react";
import Link from "next/link";
import { Box } from "@/ui/atomic";
import { useResponsive } from "@/hooks";
import { ProductGridProps } from "../types";
import ProductCard from "../common/ProductCard";
import { BbluntCarousel } from "../common/BbluntCarousel";
import "../style.css";
import { useAddToCart } from "@shopkit/cart";

/**
 * ProductGrid V2 Component - Carousel Version
 * Displays products in a responsive carousel with navigation and dots
 *
 * Features:
 * - Responsive carousel (Desktop: 4 slides, Tablet: 3 slides, Mobile: 2 slides)
 * - Dynamic slidesToScroll based on slidesToShow
 * - Navigation arrows (desktop only)
 * - Indicator dots (mobile and tablet)
 * - Drag/swipe scrolling support
 * - Add to cart functionality
 */

export function V1({ data, settings }: ProductGridProps) {
  const { addToCart, loadingStates } = useAddToCart();
  const { isMobileTab, isTablet } = useResponsive();

  // Handle add to cart for individual products
  const handleAddToCart = async (product: any) => {
    try {
      await addToCart({
        ...product,
        quantity: 1,
      });
    } catch (error) {
      console.error("Failed to add product to cart:", error);
    }
  };

  // Default settings for the product cards
  const cardSettings = {
    showActionButton: settings?.showActionButton ?? true,
    actionButtonText: settings?.actionButtonText ?? "Add to cart",
    showBadge: settings?.showBadge ?? true,
    showRating: settings?.showRating ?? true,
    soldOutText: settings?.soldOutText ?? "Sold Out",
  };

  // Use provided products or empty array if no products
  const productsToDisplay =
    data?.data?.products && data?.data.products.length > 0
      ? data?.data.products
      : [];

  // TODO: This will be uncommented when the mock data comes in
  // const productsToDisplay =
  //   collectionData?.data?.products && collectionData?.data.products.length > 0
  //     ? collectionData?.data.products
  //     : [];

  return (
    <Box className="w-full px-3 md:px-6 xl2:px-14">
      {/* Product Grid Title */}
      <h2 className="text-center text-black leading-tight text-[2.2rem] md:text-[3.2rem] font-normal mb-12">
        {settings?.heading}
      </h2>

      {/* Product Carousel - Uses all settings from template */}
      {productsToDisplay && productsToDisplay.length > 0 ? (
        <div className="relative group">
          <BbluntCarousel
            slidesToShow={!isMobileTab ? 4 : isTablet ? 3 : 2}
            slidesToScroll={!isMobileTab ? 4 : isTablet ? 3 : 2}
            autoplay={settings?.autoplay ?? false}
            autoplayInterval={settings?.autoplayInterval ?? 3000}
            showArrows={!isMobileTab ? true : false}
            showDots={!isMobileTab ? false : true}
            infinite={settings?.infinite ?? true}
            iconStyle={settings?.iconStyle ?? "arrow"}
            navigationPosition={settings?.navigationPosition ?? "outside"}
            navigationButtonVariant={
              (settings?.navigationButtonVariant as any) ?? "outline"
            }
            smoothScroll={true}
          >
            {productsToDisplay.map((product: any) => {
              const productAddToCart = () => handleAddToCart(product);
              return (
                <ProductCard
                  key={product.id || product.handle}
                  product={product}
                  onAddToCart={productAddToCart}
                  settings={cardSettings}
                  className="h-full"
                />
              );
            })}
          </BbluntCarousel>
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-3">No products available</p>

          <button
            onClick={() => window.location.reload()}
            className="text-red-500 underline hover:text-red-600 transition"
          >
            Try Again
          </button>
        </div>
      )}

      <Link
        href={settings?.redirectionLink || "/collections/bestseller"}
        className="shine-link flex justify-center w-fit mx-auto mt-9 text-text-base text-white px-10 py-[0.9rem] bg-black border border-black rounded-2xl"
      >
        {settings?.viewAllButtonText || "View all"}
      </Link>
    </Box>
  );
}
