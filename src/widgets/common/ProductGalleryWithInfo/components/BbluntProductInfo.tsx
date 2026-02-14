// //BBluntproductinfo
"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { VariantPicker } from "./VariantPicker";
import { getUnitPrice, getUnitValue } from "../utils";
import { useResponsive } from "@/hooks/useResponsive";
import { calculateDiscountPercentage } from "../utils";
import { generateProductNavigationURL } from "@/utils/navigation";
import Spinner from "../../ProductGrid/common/Spinner";
import { ProductCardToast } from "../../ProductGrid/common/ProductCardToast";
import { EventType, publishEvent } from "shopkit-analytics";
import { useCartStore, mapProductToCartItem } from "@shopkit/cart";

enum PRODUCT_INFO_METAFIELD_KEYS {
  RATING = "rating",
  RATING_COUNT = "rating_count",
  PRODUCT_SUBTITLE = "product_subtitle",
  PRODUCT_NET_CONTENT = "product_net_content",
  PRODUCT_VARIANTS = "variants",
  PRODUCT_TAGS = "tags",
}

/**
 * BBLUNT Custom ProductInfo Data Interface
 */
interface BbluntProductInfoData {
  data: any;
  renderGallery?: React.ReactNode;
  addToCartText?: string;
  netContentText?: string;
  inclusiveOfAllTaxesText?: string;
  reviewsText?: string;
  mrp?: string;
  discount?: string;
  usp?: string;
  rupeeSymbol?: string;
  selectSizeText?: string;
  soldOutText?: string;
  reviews?: {
    total: number | null;
    average: number | null;
  };
}

export function BbluntProductInfo(props: BbluntProductInfoData) {
  const {
    data,
    renderGallery,
    addToCartText,
    netContentText,
    inclusiveOfAllTaxesText,
    reviewsText,
    mrp,
    discount,
    usp,
    rupeeSymbol,
    selectSizeText,
    soldOutText,
    reviews,
  } = props;

  const [selectedVariantId, setSelectedVariantId] = useState<string>();
  const { isMobile, isTablet, isDesktop } = useResponsive();
  const showMobileLikeLayout = isMobile || isTablet;
  const { addItem, isOpen: isCartOpen, isLoading: cartIsLoading } = useCartStore();
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});
  const isLoading = loadingStates[data?.id] || false;
  const router = useRouter();
  const pathname = usePathname();
  const [showToast, setShowToast] = useState(false);
  const handleAddToCart = async () => {
    try {
      setLoadingStates((prev) => ({ ...prev, [data?.id]: true }));
      publishEvent({
        type: EventType.ADD_TO_CART,
        productId: data?.id,
        productName: data?.title,
        price: currentPrice,
        currency: "INR",
        quantity: 1,
      });
      const cartItem = mapProductToCartItem(data, selectedVariantId || data.variantId, 1);
      await addItem(cartItem);
      if (!isCartOpen) {
        setShowToast(true);
      }
    } catch (error) {
      console.error("Failed to add to cart:", error);
    } finally {
      setLoadingStates((prev) => ({ ...prev, [data?.id]: false }));
    }
  };

  const productVariants =
    data?.metadata?.[PRODUCT_INFO_METAFIELD_KEYS.PRODUCT_VARIANTS];

  const rawNetContent =
    data?.metadata?.[PRODUCT_INFO_METAFIELD_KEYS.PRODUCT_NET_CONTENT]?.value;

  const productNetContent = Array.isArray(rawNetContent)
    ? (rawNetContent?.[0] ?? null)
    : (rawNetContent ?? null);

  const unitValue = getUnitValue(productNetContent);

  const getReviewsMetafieldValue = (key: string): string | null => {
    if (!data?.metafields || !Array.isArray(data.metafields)) {
      return null;
    }

    const metafield = data.metafields.find(
      (field: any) =>
        field && field.key === key && field.namespace === "reviews",
    );

    return metafield?.value || null;
  };

  // Scroll to reviews section handler
  const scrollToReviewsSection = () => {
    // Try multiple selectors to find the reviews section
    const reviewSectionSelectors = [
      '[data-testid="review-section-container"]', // Primary selector
      '[id="review-section"]',
      '[data-testid="review-section"]',
      ".review-section",
      "#review-section",
    ];

    let reviewElement: HTMLElement | null = null;

    for (const selector of reviewSectionSelectors) {
      reviewElement = document.querySelector(selector);
      if (reviewElement) break;
    }

    if (reviewElement) {
      const headerOffset = 80; // Offset for sticky header if any
      const elementPosition = reviewElement.getBoundingClientRect().top;
      const offsetPosition =
        elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    } else {
      console.log("Reviews section not found.");
    }
  };

  const ratingSection = (
    <div
      className="flex items-center gap-1.5 py-4"
      data-testid="bblunt-product-all-details-rating-section"
    >
      <svg
        className="w-[16px] h-[16px] flex-shrink-0"
        fill="#E6B30D"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M12 2L14.5 8.5L21.5 9.5L16.5 14.5L18 21.5L12 18L6 21.5L7.5 14.5L2.5 9.5L9.5 8.5L12 2Z" />
      </svg>
      <span
        className="text-black font-normal text-[12px] md:text-text-lg cursor-pointer hover:opacity-70 transition-opacity"
        data-testid="bbunt-product-all-details-rating-value"
        style={{ color: "#000000" }}
        onClick={scrollToReviewsSection}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            scrollToReviewsSection();
          }
        }}
        aria-label="Scroll to reviews section"
      >
        {reviews?.average}
      </span>
      <span
        className="text-[8px] md:text-text-lg mx-1"
        style={{ color: "#DDDDDD" }}
      >
        |
      </span>
      <span
        className="text-[#3C4CFF] font-normal text-[12px] md:text-text-lg cursor-pointer hover:opacity-70 transition-opacity"
        onClick={scrollToReviewsSection}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            scrollToReviewsSection();
          }
        }}
        aria-label="Scroll to reviews section"
      >
        {reviews?.total} {reviewsText}
      </span>
    </div>
  );

  const productTitle = (
    <div data-testid="product-title-wrapper" className="mb-2.5">
      <h1
        className="font-heading text-text-base font-medium md:text-[24px] md:font-bold text-black leading-tight"
        data-testid="bblunt-product-all-details-title"
        style={{ color: "#000000" }}
      >
        {data?.title}
      </h1>
    </div>
  );

  const productTagsSection = () => {
    if (!data || !data?.tags || data.tags.length === 0) return null;

    return (
      <div
        data-testid="product-tags-container"
        className="flex flex-wrap gap-2 mb-4 pb-4 md:pb-12"
      >
        {data?.tags.map((tag: any, index: number) => (
          <div
            key={index}
            data-testid={`product-tag-${index}`}
            className="flex items-center gap-2"
            style={{
              backgroundColor: "#DDDDDD",
              padding: "5px",
              borderRadius: "4px",
            }}
          >
            {/* Tag Icon */}
            <Image
              src="/dawn/svg/tag_icon.svg"
              alt="tag icon"
              width={12}
              height={12}
              className="flex-shrink-0 "
              unoptimized={true}
            />
            {/* Tag Name */}
            <span className="text-[12px] md:text-[16px] font-medium text-[#1D1D1D]">
              {tag?.name}
            </span>
          </div>
        ))}
      </div>
    );
  };

  const netContentSection = () => {
    if (!productNetContent) return null;

    return (
      <div
        data-testid="net-content-section"
        className="text-[14px] py-4 md:py-0 font-normal text-[#1D1D1D] leading-[1.29em]"
        style={{ color: "#1D1D1D" }}
      >
        {netContentText}:{" "}
        <span className="font-medium md:font-bold">{productNetContent}</span>
        {unitPrice && unitValue && (
          <>
            {" "}
            <span className="font-medium md:font-bold">
              ({usp}:{rupeeSymbol} {unitPrice}/{unitValue})
            </span>
          </>
        )}
      </div>
    );
  };

  const defaultTitleVariant = data?.variants.find(
    (variant: any) => variant?.title === "Default Title",
  );
  const priceInPaise = defaultTitleVariant?.price ?? 0;
  const currentPrice = priceInPaise / 100;

  let unitPrice: string | null = null;
  if (productNetContent && typeof data?.price === "number") {
    unitPrice = getUnitPrice(currentPrice, productNetContent);
  }

  const compareAtPrice = data?.compare_at_price
    ? data.compare_at_price / 100
    : data?.price?.compareAtAmount
      ? data?.price.compareAtAmount / 100
      : data?.price?.compareAtPrice?.amount
        ? data?.price.compareAtPrice.amount / 100
        : undefined;

  // Handle variant selection - navigate to variant's product page
  const handleVariantSelect = (variant: {
    fields?: {
      variant?: {
        value?: Array<{ handle?: any }>;
      };
    };
  }) => {
    const variantHandle = variant?.fields?.variant?.value?.[0]?.handle?.handle;
    if (variantHandle && pathname) {
      const productUrl = generateProductNavigationURL(variantHandle, pathname);
      router.push(productUrl);
    }
  };

  //Price Section
  const priceSection = () => {
    return (
      <div data-testid="price-section-container" className="mb-4">
        {/* Mobile */}
        <div
          data-testid="price-section-content"
          className="flex flex-col md:gap-2 gap-4"
        >
          {compareAtPrice && compareAtPrice > currentPrice ? (
            <>
              {/* MOBILE: everything in ONE LINE */}
              <div
                data-testid="price-mobile-line"
                className="flex flex-wrap items-center gap-2 md:hidden"
              >
                <span className="text-[26px] font-bold text-[#1D1D1D] leading-[1]">
                  {rupeeSymbol}
                  {currentPrice}
                </span>

                <span className="text-[14px] font-medium text-[#727272] line-through">
                  {mrp}: {rupeeSymbol}
                  {compareAtPrice}
                </span>

                <span className="text-[14px] font-medium text-[#D6322C]">
                  {calculateDiscountPercentage(compareAtPrice, currentPrice)}
                  {discount}
                </span>

                <span className="text-[12px]  italic text-[#727272] whitespace-nowrap">
                  {inclusiveOfAllTaxesText}
                </span>
              </div>

              {/* DESKTOP: existing 2-line layout */}
              <div
                data-testid="price-desktop-container"
                className="hidden md:flex flex-col"
              >
                {/* Line 1 */}
                <div
                  data-testid="price-desktop-line-1"
                  className="flex items-center gap-4"
                >
                  <span className="text-[26px] font-bold text-[#1D1D1D]">
                    {rupeeSymbol}
                    {currentPrice}
                  </span>

                  <span className="text-[14px] font-medium text-[#D6322C]">
                    {calculateDiscountPercentage(compareAtPrice, currentPrice)}
                    {discount}
                  </span>
                </div>

                {/* Line 2 */}
                <div
                  data-testid="price-desktop-line-2"
                  className="flex items-center"
                >
                  <span className="text-[14px] font-medium text-[#727272] line-through">
                    {mrp}: {rupeeSymbol}
                    {compareAtPrice}
                  </span>

                  <span className="text-[12px] ml-4 italic text-[#727272]">
                    {inclusiveOfAllTaxesText}
                  </span>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* ONE LINE for all devices when no discount */}
              <div
                data-testid="price-no-discount-line"
                className="flex flex-wrap items-center gap-2 mt-4"
              >
                <span className="text-[14px] font-medium text-[#727272]">
                  {mrp}:
                </span>
                <span className="text-[26px] font-bold text-[#1D1D1D] leading-[1]">
                  {rupeeSymbol}
                  {currentPrice}
                </span>
                <span className="text-[12px] italic text-[#727272] whitespace-nowrap">
                  {inclusiveOfAllTaxesText}
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <div
      data-testid="bblunt-product-info-container"
      style={{ fontFamily: "Gotham", color: "#1D1D1D" }}
    >
      {showMobileLikeLayout && (
        <div data-testid="mobile-layout-container">
          {productTitle}
          {ratingSection}
          {productTagsSection()}
          {renderGallery && isMobile && (
            <div data-testid="mobile-gallery-wrapper" className="mb-4">
              {renderGallery}
            </div>
          )}
          {netContentSection()}
          {priceSection()}
          {productVariants && (
            <VariantPicker
              data={productVariants}
              selectSizeText={selectSizeText}
              fallbackImageUrl={data?.images?.[0]?.url}
              unitWithPrice={`${unitPrice}/${unitValue}`}
              selectedVariantId={selectedVariantId}
              compareAtPrice={compareAtPrice || 0}
              discount={discount}
              currentPrice={currentPrice}
              rupeeSymbol={rupeeSymbol}
              onVariantSelect={handleVariantSelect}
            />
          )}
        </div>
      )}
      {isDesktop && (
        <div data-testid="desktop-layout-container">
          <div
            data-testid="desktop-content-wrapper"
            className="space-y-3 order-1 w-full"
          >
            {productTitle}
            {ratingSection}
            {productTagsSection()}
          </div>
          {/* )} */}
          {netContentSection()}

          {priceSection()}

          {/* Variant Picker */}
          {productVariants && (
            <VariantPicker
              data={productVariants}
              selectSizeText={selectSizeText}
              fallbackImageUrl={data?.images?.[0]?.url}
              unitWithPrice={`${unitPrice}/${unitValue}`}
              selectedVariantId={selectedVariantId}
              compareAtPrice={compareAtPrice || 0}
              currentPrice={currentPrice}
              discount={discount}
              rupeeSymbol={rupeeSymbol}
              onVariantSelect={handleVariantSelect}
            />
          )}
        </div>
      )}
      <button
        data-testid="cart-item-add-to-cart"
        className="hidden md:flex w-full h-[48px] bg-[#1D1D1D] text-white rounded-[4px] font-bold text-[24px] leading-[1.2em] items-center justify-center mt-6 lg:mt-[56px] transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={handleAddToCart}
        disabled={isLoading || !data?.availableForSale}
      >
        {isLoading ? (
          <div
            data-testid="add-to-cart-loading-spinner"
            className="flex items-center justify-center gap-2"
          >
            <Spinner className="size-[2.4rem] text-gray-800" />
          </div>
        ) : !data?.availableForSale ? (
          soldOutText
        ) : (
          addToCartText
        )}
      </button>
      {/* Custom Add to Cart Toast */}
      <ProductCardToast
        show={showToast && !isCartOpen && !cartIsLoading}
        onClose={() => setShowToast(false)}
        title="Item added to your cart"
      />
    </div>
  );
}
