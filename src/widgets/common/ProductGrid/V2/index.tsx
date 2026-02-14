"use client";

import React, { useState } from "react";

import { useCartQuantity, useResponsive } from "@/hooks";

import { Box } from "@/ui/atomic";
import { ProductGridProps, ProductResponse } from "../types";

import { BbluntCarousel } from "../common/BbluntCarousel";
import { CollectionTabs } from "../common/CollectionTabs";
import ProductCard from "../common/ProductCard";
import { BackgroundImage } from "../common/BackgroundImage";
import { EventType, publishEvent } from "shopkit-analytics";
import { LazyViewAllButton } from "../components/LazyViewAllButton";

import "../style.css";
import { useAddToCart } from "@shopkit/cart";

/**
 * ProductGrid V2 Component - Tabbed Collections Version
 * Displays products in a responsive carousel with collection tabs
 *
 * Features:
 * - Collection tabs for switching between different collections
 * - Server-side collection data from COLLECTION_BY_HANDLES
 * - Pure client-side tab switching without API calls
 * - Responsive carousel with navigation
 * - Add to cart functionality
 * - Edge case: Single collection shows products without tabs
 */

export function V2({ data, settings }: ProductGridProps) {
  const { addToCart } = useAddToCart();
  const { isMobileTab, isTablet } = useResponsive();
  const {
    incrementQuantity,
    decrementQuantity,
    isInCart,
    getCartItem,
    isProductLoading,
  } = useCartQuantity();

  // Destructure all settings in one place
  const {
    collections = [],
    heading = "",
    viewAllButtonText = "View all",
    autoplay = false,
    autoplayInterval = 3000,
    infinite = true,
    iconStyle = "arrow",
    navigationPosition = "outside",
    navigationButtonVariant = "outline",
    showDots = false,
    sectionBackgroundDesktopImage,
    sectionBackgroundMobileImage,
    // Product card settings
    showActionButton = true,
    actionButtonText = "Add to cart",
    actionButtonTextMobile = "Add",
    actionButtonTextColor = "#000",
    showBadge = true,
    showRating = true,
    soldOutText = "Sold Out",
    soldOutTextMobile = "Sold",
    productCardBackgroundColor = "white",
    // Section styling
    sectionBackgroundColor = "white",
    sectionTextColor = "#1D1D1D",
  } = settings || {};

  // Get server-side collections data
  // Handle IResponse format: { success, message, data: T | null, meta }
  // Each item in data.data is wrapped: { handle, data: {collection}, meta }
  // Unwrap to get the actual collection objects
  const serverCollections = (data?.data || []).map(
    (item: any) => item.data || item,
  );

  // Create collection tabs from server data
  const collectionTabs = serverCollections.map(
    (collection: any, index: number) => ({
      id: collection.handle || `collection-${index}`,
      label: collections[index]?.label || collection.title,
      handle: collection.handle,
    }),
  );

  const showTabs = collectionTabs.length > 1;

  // State management - simplified for server-side data
  const [activeTabIndex, setActiveTabIndex] = useState<number>(0);
  const [animationKey, setAnimationKey] = useState<number>(0);

  // Handle tab change - no API calls, just state updates
  const handleTabChange = (tabId: string) => {
    const tabIndex = collectionTabs.findIndex((tab: any) => tab.id === tabId);
    if (tabIndex === -1 || tabIndex === activeTabIndex) {
      return;
    }

    setActiveTabIndex(tabIndex);
    // Trigger animation by updating the key
    setAnimationKey((prev) => prev + 1);
  };
  const handleAddToCart = async (product: ProductResponse) => {
    const currentPrice = (Number(product?.price) || 0) / 100;
    try {
      publishEvent({
        type: EventType.ADD_TO_CART,
        productId: product?.id,
        productName: product?.title,
        price: currentPrice,
        currency: "INR",
        quantity: 1,
      });
      // Normalize product structure: API returns product.variant (single object)
      // but cart mapper expects product.variants (array)
      const variantId = product?.variant?.id;
      const normalizedProduct = {
        ...product,
        variants:
          (product as any)?.variants || (product?.variant ? [product.variant] : []),
      };
      await addToCart(normalizedProduct, variantId, 1);
    } catch (error) {
      console.error("Failed to add product to cart:", error);
    }
  };

  // Product card settings object
  const cardSettings = {
    showActionButton,
    actionButtonText,
    actionButtonTextMobile,
    showBadge,
    showRating,
    soldOutText,
    soldOutTextMobile,
    backgroundColor: productCardBackgroundColor,
    color: sectionTextColor,
    actionButtonTextColor,
  };

  // Get current active collection and its products
  const activeCollection = serverCollections[activeTabIndex];
  const productsToDisplay = activeCollection?.products || [];

  // Remove unused variables - now handled by LazyViewAllButton

  const sectionStyle: React.CSSProperties = {
    background: sectionBackgroundColor,
  };

  const sectionTextStyle: React.CSSProperties = {
    color: sectionTextColor,
  };

  const isBackgroundImage = Boolean(
    sectionBackgroundDesktopImage && sectionBackgroundMobileImage,
  );

  return (
    <Box
      data-testid="product-grid-v2-container"
      className={`w-full md:px-6 xl2:px-14 relative ${isBackgroundImage ? "py-[32px] md:py-[56px]" : ""}`}
      style={sectionStyle}
    >
      {isBackgroundImage && (
        <BackgroundImage
          sectionBackgroundDesktopImage={sectionBackgroundDesktopImage!}
          sectionBackgroundMobileImage={sectionBackgroundMobileImage!}
        />
      )}

      {/* Product Grid Title */}
      <h2
        data-testid="product-grid-v2-heading"
        className="relative px-[1.6rem] md:text-center leading-tight text-[2.2rem] md:text-[3.2rem] font-normal mb-[2.4rem] md:mb-[3.2rem]"
        style={sectionTextStyle}
        dangerouslySetInnerHTML={{ __html: heading }}
      />

      {/* Collection Tabs */}
      {showTabs && (
        <CollectionTabs
          collections={collectionTabs}
          activeTabId={collectionTabs[activeTabIndex]?.id || ""}
          onTabChange={handleTabChange}
          sectionTextStyle={sectionTextStyle}
          isBackgroundImage={isBackgroundImage}
        />
      )}

      {/* Product Carousel */}
      {productsToDisplay.length > 0 && (
        <div
          data-testid="product-grid-v2-carousel-container"
          key={animationKey}
          className="relative group max-w-[1240px] mx-auto animate-slide-in-y"
          style={{
            animation: "slideInY 0.4s ease-out forwards",
          }}
        >
          <BbluntCarousel
            slidesToShow={!isMobileTab ? 5 : isTablet ? 4 : 3.2}
            slidesToScroll={!isMobileTab ? 5 : isTablet ? 4 : 3.2}
            autoplay={autoplay}
            autoplayInterval={autoplayInterval}
            showArrows={!isMobileTab ? true : false}
            showDots={showDots}
            infinite={infinite}
            iconStyle={iconStyle}
            navigationPosition={navigationPosition}
            navigationButtonVariant={navigationButtonVariant as any}
            smoothScroll={true}
            containerClassName="md:border md:rounded-[8px]"
            slideClassName="overflow-hidden h-full md:border-l first:md:border-l-0"
            arrowClassNames={`${isBackgroundImage ? "text-white" : "text-[#A3A3A3]"}`}
          >
            {productsToDisplay.map((product: any) => {
              const productAddToCart = () => handleAddToCart(product);
              const productIncrement = () => incrementQuantity(product);
              const productDecrement = () => decrementQuantity(product);

              return (
                <ProductCard
                  key={product.id || product.handle}
                  product={product}
                  onAddToCart={productAddToCart}
                  onIncrement={productIncrement}
                  onDecrement={productDecrement}
                  isInCart={isInCart(product)}
                  cartItem={getCartItem(product)}
                  isQuantityLoading={isProductLoading(product)}
                  settings={cardSettings}
                  isBackgroundImage={Boolean(isBackgroundImage)}
                />
              );
            })}
          </BbluntCarousel>
        </div>
      )}

      {/* No Products State */}
      {productsToDisplay.length === 0 && (
        <div
          data-testid="product-grid-v2-empty-state"
          className="relative text-center py-8"
        >
          <p
            data-testid="product-grid-v2-empty-state-text"
            className="mb-3"
            style={sectionTextStyle}
          >
            No products available
          </p>
        </div>
      )}

      {/* Lazy View All Button with conditional redirect logic */}
      {productsToDisplay.length > 0 && (
        <LazyViewAllButton
          serverCollectionHandle={activeCollection?.handle || ""}
          configCollectionHandle={collections[activeTabIndex]?.handle}
          viewAllButtonText={viewAllButtonText}
          serverTotalProductCount={activeCollection?.productPagination?.total}
          productsToDisplay={productsToDisplay}
          sectionTextStyle={sectionTextStyle}
          isBackgroundImage={isBackgroundImage}
        />
      )}
    </Box>
  );
}
