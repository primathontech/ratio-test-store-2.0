"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import SoldOutBadge from "./SoldOutBadge";
import ProductActionButton from "./ProductActionButton";
import {
  getPrimaryAndSecondaryImages,
  getProductLabel,
} from "../utils/metafield";
import { PRODUCT_CARD_META_FIELDS } from "../constant";
import { ProductResponse } from "../types";
import { formatPaiseToINR } from "@/utils";
import { ProductCardToast } from "./ProductCardToast";
import { normalizeValue } from "../../ProductAdditionalInfoSection/utils/getAdditionalInfoItems";
import { CartItem, useCartStore } from "@shopkit/cart";

interface ProductCardProps {
  product: ProductResponse;
  onAddToCart?: () => void;
  onIncrement?: () => void;
  onDecrement?: () => void;
  isInCart?: boolean;
  cartItem?: CartItem;
  isQuantityLoading?: boolean;
  settings?: {
    showActionButton?: boolean;
    actionButtonText?: string;
    actionButtonTextMobile?: string;
    showBadge?: boolean;
    showRating?: boolean;
    soldOutText?: string;
    soldOutTextMobile?: string;
    backgroundColor?: string;
    color?: string;
    actionButtonTextColor?: string;
    titleClassName?: string;
    imageClassName?: string;
    detailsClassName?: string;
    priceSectionClassName?: string;
    actionButtonClassName?: string;
  };
  isBackgroundImage?: boolean | undefined;
  className?: string;
  showProductType?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onIncrement,
  onDecrement,
  isInCart = false,
  cartItem,
  isQuantityLoading = false,
  settings = {},
  isBackgroundImage = false,
  className = "",
  showProductType = true,
}) => {
  const { metadata, average_rating, rating_count } = product || {};

  const [isHovered, setIsHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [showToast, setShowToast] = useState(false);
  const isCartOpen = useCartStore((state) => state.isOpen);
  const cartIsLoading = useCartStore((state) => state.isLoading);
  const {
    showActionButton = true,
    actionButtonText = "Add to cart",
    actionButtonTextMobile = "Add",
    showBadge = true,
    showRating = true,
    soldOutText = "Sold Out",
    soldOutTextMobile = "Sold",
    backgroundColor = "white",
    color = "white",
    actionButtonTextColor = "#000",
    titleClassName = "",
    imageClassName = "",
    detailsClassName = "",
    priceSectionClassName = "",
    actionButtonClassName = "",
  } = settings;

  // Product Net Content
  const netContent = normalizeValue(
    metadata?.[PRODUCT_CARD_META_FIELDS.CUSTOM.NET_CONTENT.key]?.value,
  );

  // Product Subtitle/Description
  const productSubtitle = normalizeValue(
    metadata?.[PRODUCT_CARD_META_FIELDS.CUSTOM.PRODUCT_SUBTITLE.key]?.value,
  );

  // Offer Text (e.g., "Get it for ₹250*| Code : B2G2")
  const offerText = normalizeValue(
    metadata?.[PRODUCT_CARD_META_FIELDS.CUSTOM.OFFER_TEXT.key]?.value,
  );

  const productLabelsMeta =
    metadata?.[PRODUCT_CARD_META_FIELDS.CUSTOM.PRODUCT_LABELS.key]?.value;

  const badge = getProductLabel(productLabelsMeta, product?.tags);

  const getPrice = (product: any): number => {
    const price =
      product?.priceRange?.minVariantPrice?.amount ?? product?.price ?? 0;

    return Number(price);
  };

  // Calculate discount percentage
  const discountPercentage = product.compare_at_price
    ? Math.round(
        ((product.compare_at_price - getPrice(product)) /
          product.compare_at_price) *
          100,
      )
    : 0;

  // Get primary and secondary images
  const { primaryImage, secondaryImage } = getPrimaryAndSecondaryImages(
    product.images,
  );

  // Handle add to cart click
  const handleAddToCart = async (e: React.MouseEvent) => {
    // If product is not available, let the Link handle navigation
    if (!product?.availableForSale) {
      return;
    }

    // If available, prevent navigation and add to cart
    e.preventDefault();
    e.stopPropagation();

    setIsLoading(true);
    try {
      await onAddToCart?.();
      if (!isCartOpen) {
        setShowToast(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Link
      href={`/products/${product.handle}`}
      data-testid={`product-card-link-${product.id}`}
      className="block h-full"
      prefetch={true}
    >
      <div
        data-testid={`product-card-container-${product.id}`}
        className={`overflow-hidden transition-all duration-300 ease-in-out h-full flex flex-col gap-[8px] md:p-[8px] group ${className}`}
        style={{ backgroundColor }}
      >
        {/* Product Image Container */}
        <div
          data-testid={`product-card-image-container-${product.id}`}
          className={`relative aspect-square overflow-hidden bg-gradient-to-br from-purple-50 via-blue-50 to-purple-100 ${imageClassName || "rounded-[4px]"}`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Badge - Top Left - Always show if badge exists or discount > 0 */}
          {showBadge && badge && !Array.isArray(badge) && (
            <div
              data-testid={`product-card-badge-${product.id}`}
              className="badge-wrapper"
              style={
                {
                  // single source of truth
                  "--badge-color": badge.background,
                } as React.CSSProperties
              }
            >
              <span className="badge-text">{badge.label}</span>
            </div>
          )}

          {!product?.availableForSale && (
            <div
              data-testid={`product-card-sold-out-overlay-${product.id}`}
              className="absolute z-[3] inset-0 size-full bg-black/10"
            />
          )}

          {!product?.availableForSale && (
            <div
              data-testid={`product-card-sold-out-badge-container-${product.id}`}
              className="absolute z-[2] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            >
              <SoldOutBadge />
            </div>
          )}

          {/* Product Net Content */}
          {netContent && (
            <p
              data-testid={`product-card-net-content-${product.id}`}
              className="absolute z-10 right-[4px] bottom-[4px] md:right-[8px] md:bottom-[8px] text-[10px] md:text-[12px] font-medium bg-white/80 text-primary rounded-[2px] py-[3px] px-[4px] md:py-[3px] leading-none"
            >
              {netContent}
            </p>
          )}

          {/* Primary Image */}
          <div
            data-testid={`product-card-image-wrapper-${product.id}`}
            className="relative w-full h-full"
          >
            {primaryImage && (
              <Image
                src={primaryImage.url}
                alt={`${product.title} secondary image`}
                fill
                className={`object-contain transition-all duration-700 ease-in-out ${
                  isHovered && secondaryImage
                    ? "opacity-0 scale-105"
                    : "opacity-100 scale-100"
                }`}
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                loading="lazy"
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
              />
            )}

            {/* Secondary Image - Shows on Hover with Zoom */}
            {secondaryImage && (
              <Image
                src={secondaryImage.url}
                alt={`${product.title} primary image`}
                fill
                className={`object-contain transition-all duration-700 ease-in-out absolute inset-0 ${
                  isHovered ? "opacity-100 scale-110" : "opacity-0 scale-100"
                }`}
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                loading="lazy"
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
              />
            )}
          </div>
        </div>

        {/* Product Details */}
        <div
          data-testid={`product-card-details-${product.id}`}
          className={`flex-1 flex flex-col gap-[4px] md:gap-[6px] ${detailsClassName}`}
        >
          {/* Offer Text - Below image */}
          {offerText && (
            <p
              data-testid={`product-card-offer-text-${product.id}`}
              className="text-[10px] md:text-[12px] font-medium text-[#82c341] leading-tight line-clamp-1"
            >
              {offerText}
            </p>
          )}

          {/* Product Type Badge */}
          {showProductType && product?.productType && (
            <p
              data-testid={`product-card-variant-${product.id}`}
              className={`w-fit text-[10px] md:text-[11px] font-medium rounded-[2px] py-[2px] px-[6px] !leading-none line-clamp-1 ${isBackgroundImage ? "bg-[#363636] md:bg-primary text-white" : "bg-[#F4F6F8] text-[#333]"}`}
            >
              {product?.productType}
            </p>
          )}

          {/* Product Title */}
          <h3
            data-testid={`product-card-title-${product.id}`}
            className={`text-[12px] md:text-[14px] leading-[16px] md:leading-[18px] font-medium text-left transition-colors duration-200 cursor-pointer line-clamp-2 max-w-full hover:text-[#0089bf] ${titleClassName}`}
            style={{ color: isBackgroundImage ? color : "#333" }}
          >
            {product.title}
          </h3>

          {/* Product Description/Subtitle - Teal color */}
          {productSubtitle && (
            <p
              data-testid={`product-card-subtitle-${product.id}`}
              className="text-[11px] md:text-[12px] text-[#666] font-normal line-clamp-2 leading-tight"
            >
              {productSubtitle}
            </p>
          )}

          {/* Rating and Review Count */}
          {showRating && (average_rating !== undefined || rating_count !== undefined) && (
            <div
              data-testid={`product-card-rating-${product.id}`}
              className="flex items-center gap-1 text-[11px] md:text-[12px] leading-none"
              style={{ color: isBackgroundImage ? color : "#666" }}
            >
              <span className="text-[#FBC210]">★</span>
              <span>{average_rating || 0}</span>
              <span className="text-[#999]">|</span>
              <span>{rating_count || 0}</span>
            </div>
          )}

          {/* Price Section */}
          <div
            data-testid={`product-card-price-section-${product.id}`}
            className={`flex flex-wrap items-center gap-1 md:gap-2 ${priceSectionClassName}`}
          >
            <span
              data-testid={`product-card-price-${product.id}`}
              className="text-[14px] md:text-[16px] font-bold !leading-none"
              style={{ color: isBackgroundImage ? color : "#333" }}
            >
              {formatPaiseToINR(getPrice(product))}
            </span>
            {product.compare_at_price !== null &&
              product.compare_at_price > 0 &&
              product.compare_at_price > getPrice(product) && (
                <span
                  data-testid={`product-card-compare-price-${product.id}`}
                  className="text-[12px] md:text-[13px] font-normal line-through !leading-none text-[#999]"
                >
                  {formatPaiseToINR(product.compare_at_price)}
                </span>
              )}
            {/* Discount Percentage */}
            {discountPercentage > 0 && (
              <span
                data-testid={`product-card-discount-${product.id}`}
                className="text-[11px] md:text-[12px] !leading-none font-medium text-nowrap text-[#F04438]"
              >
                {discountPercentage}% off
              </span>
            )}
          </div>

          {/* Add to Cart Button or Quantity Selector */}
          {showActionButton && (
            <ProductActionButton
              isInCart={isInCart}
              cartItem={cartItem}
              isLoading={isQuantityLoading || isLoading}
              product={product}
              onAddToCart={handleAddToCart}
              onIncrement={onIncrement}
              onDecrement={onDecrement}
              settings={{
                actionButtonText,
                actionButtonTextMobile,
                soldOutText,
                soldOutTextMobile,
                color,
                actionButtonTextColor,
                actionButtonClassName,
              }}
            />
          )}
        </div>
      </div>
      {/* Custom Add to Cart Toast */}
      <ProductCardToast
        show={showToast && !isCartOpen && !cartIsLoading}
        onClose={() => setShowToast(false)}
        title="Item added to your cart"
      />
    </Link>
  );
};

export default ProductCard;
