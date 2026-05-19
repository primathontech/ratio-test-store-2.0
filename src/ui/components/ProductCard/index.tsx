"use client";

import React, { memo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@shopkit/cart";
import { ProductCardTheme } from "./types";
import type { ProductCardProps } from "./types";
import SoldOutBadge from "./SoldOutBadge";
import { ProductCardToast } from "./Toast";

/* ------------------------------------------------------------------ */
/*  Star rating                                                        */
/* ------------------------------------------------------------------ */

const StarIcon = ({ filled }: { filled: boolean }) => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill={filled ? "#FBC210" : "#e0e0e0"}
    stroke={filled ? "#FBC210" : "#e0e0e0"}
    strokeWidth="2"
    strokeLinejoin="round"
    aria-hidden="true"
    className="w-full pr-[4px]"
  >
    <path d="M12 2l2.9 6.9 7.1.6-5.4 4.7 1.7 7.1L12 17.3 5.7 21.3l1.7-7.1L2 9.5l7.1-.6L12 2z" />
  </svg>
);

const StarRating = ({
  rating,
  reviewCount,
  textColor,
  className = "",
  valueClassName = "",
  reviewCountClassName = "",
}: {
  rating: number;
  reviewCount: number;
  textColor: string;
  className?: string;
  valueClassName?: string;
  reviewCountClassName?: string;
}) => {
  return (
    <div className={`flex items-center gap-[4px] ${className}`.trim()}>
      <span
        className="inline-flex items-center"
        role="img"
        aria-label={`${rating} star rating`}
      >
        <StarIcon filled={rating > 0} />
      </span>
      <span
        className={`text-[12px] md:text-[10px] leading-[16px] ${valueClassName}`.trim()}
        style={{ color: textColor }}
      >
        {rating.toFixed(1)}
      </span>
      <span
        className={`text-[14px] leading-[16px] ${reviewCountClassName}`.trim()}
        style={{ color: textColor }}
      >
        {" | "}
        {reviewCount}
      </span>
    </div>
  );
};

const InlineButtonLoader = ({ color }: { color: string }) => (
  <span className="flex items-center justify-center" aria-hidden="true">
    <span
      className="h-4 w-4 animate-spin rounded-full border-2 border-t-transparent"
      style={{ borderColor: color, borderTopColor: "transparent" }}
    />
  </span>
);

/* ------------------------------------------------------------------ */
/*  Quantity pill (when isInCart)                                      */
/* ------------------------------------------------------------------ */

const QuantityPill = ({
  quantity,
  onIncrement,
  onDecrement,
  isLoading,
  className = "",
  buttonRadius,
}: {
  quantity: number;
  onIncrement?: () => void;
  onDecrement?: () => void;
  isLoading: boolean;
  className?: string;
  buttonRadius: string;
}) => (
  <div
    data-testid="product-action-quantity-container"
    className={`flex items-center justify-between w-full h-[32px] md:h-[42px] px-[12px] text-[16px] font-medium border border-[#000000] ${className}`.trim()}
    style={{
      backgroundColor: "#FFFFFF",
      color: "#000000",
      borderRadius: buttonRadius,
    }}
  >
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onDecrement?.();
      }}
      disabled={isLoading}
      aria-label="Decrease quantity"
      data-testid="product-action-decrement-button"
      className="px-2 text-[20px] leading-none disabled:opacity-50 cursor-pointer"
    >
      −
    </button>
    <span
      data-testid="product-action-quantity-value"
      className="flex flex-1 items-center justify-center text-center"
    >
      <span className="flex h-[30px] w-[30px] items-center justify-center bg-[#F4F6F8] md:h-[40px] md:w-[40px]">
        {quantity}
      </span>
    </span>
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onIncrement?.();
      }}
      disabled={isLoading}
      aria-label="Increase quantity"
      data-testid="product-action-increment-button"
      className="px-2 text-[20px] leading-none disabled:opacity-50 cursor-pointer"
    >
      +
    </button>
  </div>
);

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function badgeColor(variant?: string): string {
  switch (variant) {
    case "new":
    case "bestseller":
      return "rgb(213, 52, 52)";
    case "deal":
      return "rgb(200, 50, 150)";
    case "trending":
    default:
      return "#82C341";
  }
}

/* ------------------------------------------------------------------ */
/*  Theme tokens                                                       */
/* ------------------------------------------------------------------ */

const LIGHT_THEME = {
  cardBg: "#ffffff",
  cardBorder: "none",
  cardRadius: "0px",
  cardOverflow: "hidden" as const,
  textPrimary: "#1d1d1d",
  textSecondary: "#666666",
  textMuted: "#1D1D1D8C",
  comparePriceMobile: "#1D1D1D",
  comparePriceDesktop: "#1D1D1D8C",
  chipBg: "#F4F6F8",
  chipBorder: "none",
  chipColor: "#1d1d1d",
  chipPadding: "8px",
  chipFontSize: "14px",
  weightBg: "#fffc",
  weightColor: "#333333",
  buttonBg: "#000000",
  buttonColor: "#ffffff",
  buttonBorder: "2px solid #000000",
  buttonHoverBg: "rgb(56,56,56)",
  buttonHoverColor: "#ffffff",
  buttonHoverBorder: "2px solid #000000",
  discountColor: "#f04438",
  imageRadius: "10px",
  buttonRadius: "4px",
};

const DARK_THEME = {
  cardBg: "transparent",
  cardBorder: "none",
  cardRadius: "0px",
  cardOverflow: "visible" as const,
  textPrimary: "#ffffff",
  textSecondary: "rgba(255,255,255,0.7)",
  textMuted: "rgba(255,255,255,0.5)",
  comparePriceMobile: "rgba(255,255,255,0.5)",
  comparePriceDesktop: "rgba(255,255,255,0.5)",
  chipBg: "rgb(29, 29, 29)",
  chipBorder: "none",
  chipColor: "#ffffff",
  chipPadding: "4px 10px",
  chipFontSize: "11px",
  weightBg: "#fffc",
  weightColor: "#1D1D1D",
  buttonBg: "#ffffff",
  buttonColor: "rgb(29, 29, 29)",
  buttonBorder: "2px solid #ffffff",
  buttonHoverBg: "rgb(56,56,56)",
  buttonHoverColor: "#ffffff",
  buttonHoverBorder: "2px solid #000000",
  discountColor: "rgb(0, 200, 0)",
  imageRadius: "10px",
  buttonRadius: "4px",
};

/* ------------------------------------------------------------------ */
/*  Product Card                                                       */
/* ------------------------------------------------------------------ */

export const ProductCard = memo(function ProductCard({
  product,
  theme = ProductCardTheme.LIGHT,
  className = "",
  settings = {},
  showProductType = true,
  showNetContent = true,
  showSubtitle = true,
  onAddToCart,
  onIncrement,
  onDecrement,
  isInCart = false,
  cartItem,
  isQuantityLoading = false,
  isSoldOut: isSoldOutProp,
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [hasHovered, setHasHovered] = useState(false);
  const [isButtonHovered, setIsButtonHovered] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const isCartOpen = useCartStore((s) => s.isOpen);
  const t = theme === ProductCardTheme.DARK ? DARK_THEME : LIGHT_THEME;
  const {
    showBadge = true,
    showRating = true,
    showActionButton = true,
    showQuantitySelector = true,
    showAddToCartToast = false,
    addToCartToastTitle = "Item added to your cart",
    actionButtonText = "Add to cart",
    soldOutText = "View",
    backgroundColor: bgOverride,
    color: colorOverride,
    actionButtonTextColor,
    searchProductCard = false,
    linkClassName = "",
    imageClassName = "",
    productImageClassName = "",
    detailsClassName = "",
    titleClassName = "",
    ratingClassName = "",
    ratingValueClassName = "",
    reviewCountClassName = "",
    categoryChipClassName = "",
    priceSectionClassName = "",
    salePriceClassName = "",
    compareAtPriceClassName = "",
    discountClassName = "",
    actionButtonClassName = "",
  } = settings;
  const cardBg = bgOverride ?? t.cardBg;
  const textPrimary = colorOverride ?? t.textPrimary;
  const buttonTextColor = actionButtonTextColor ?? t.buttonColor;
  const isSoldOut =
    isSoldOutProp !== undefined
      ? isSoldOutProp
      : product.availableForSale !== undefined
        ? !product.availableForSale
        : product.salePrice <= 0;
  const showInCartPill = isInCart && showQuantitySelector;

  const handleAddToCartClick = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    if (isSoldOut || !onAddToCart) {
      return;
    }
    e.preventDefault();
    e.stopPropagation();
    setIsLoading(true);
    let success = false;
    try {
      await onAddToCart();
      success = useCartStore.getState().error === null;
    } catch {
      // failures don't surface a toast
    } finally {
      setIsLoading(false);
    }
    if (success && !isCartOpen && !isInCart && !showToast) {
      setShowToast(true);
    }
  };

  return (
    <div
      data-testid={`product-card-link-${product.id}`}
      className={`block ${searchProductCard ? "" : "h-full"} ${linkClassName}`.trim()}
    >
      <div
        data-testid={`product-card-container-${product.id}`}
        className={`flex flex-col ${searchProductCard ? "h-auto !pl-0" : "h-full"} ${className}`.trim()}
        style={{
          backgroundColor: cardBg,
          borderRadius: t.cardRadius,
          overflow: t.cardOverflow,
        }}
        onMouseEnter={() => {
          setIsHovered(true);
          setHasHovered(true);
        }}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Image area */}
        <div className="pl-0 md:pl-[8px] pr-0 md:pr-[8px] pt-0 md:pt-[8px]">
          <Link
            href={product.href}
            data-testid={`product-card-image-container-${product.id}`}
            className={`relative block overflow-hidden bg-gradient-to-br from-purple-50 via-blue-50 to-purple-100 ${imageClassName}`.trim()}
            style={{ aspectRatio: "1/1" }}
          >
            {/* Sold-out overlay + center badge */}
            {isSoldOut && (
              <>
                <div
                  data-testid={`product-card-sold-out-overlay-${product.id}`}
                  className="absolute z-[2] inset-0 size-full bg-black/10"
                />
                <div
                  data-testid={`product-card-sold-out-badge-container-${product.id}`}
                  className="absolute z-[3] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                >
                  <SoldOutBadge />
                </div>
              </>
            )}

            {/* Promo badge — `badgeBackground` (resolved via getProductLabel)
                takes precedence over the legacy `badgeVariant` mapping. */}
            {showBadge && product.badge && (
              <div
                data-testid={`product-card-badge-${product.id}`}
                className="absolute top-[4px] left-[4px] md:top-[8px] md:left-[10px] z-[2]"
              >
                <div
                  className="relative inline-flex items-center leading-[18px] md:leading-[21px] text-[12px] md:text-[14px] font-[500] rounded-l-[4px] pl-[4px] pr-[15px]"
                  style={{
                    backgroundColor:
                      product.badgeBackground ??
                      badgeColor(product.badgeVariant),
                    color: "#ffffff",
                    clipPath:
                      "polygon(0 0, 100% 0, calc(100% - 8px) 50%, 100% 100%, 0 100%)",
                  }}
                >
                  {product.badge}
                </div>
              </div>
            )}

            {/* Size / weight label */}
            {showNetContent && product.weight && (
              <div
                data-testid={`product-card-net-content-${product.id}`}
                className="absolute bottom-[4px] right-[4px] z-[2] p-[4px] text-[10px] text-[#1D1D1D] leading-[12px]"
                style={{
                  backgroundColor: t.weightBg,
                  color: t.weightColor,
                  borderRadius: "4px",
                  fontWeight: 600,
                }}
              >
                {product.weight}
              </div>
            )}

            {/* Main image */}
            <Image
              src={product.mainImage}
              alt={product.alt}
              width={360}
              height={360}
              loading="lazy"
              className={`absolute inset-0 w-full h-full object-cover rounded-[2px] ${productImageClassName}`.trim()}
              style={{
                opacity: 1,
              }}
            />

            {product.hoverImage && hasHovered && (
              <Image
                src={product.hoverImage}
                alt={product.alt}
                width={360}
                height={360}
                loading="lazy"
                className={`absolute inset-0 w-full h-full object-cover rounded-[2px] ${
                  isHovered ? "animate-fadeZoomIn" : "animate-fadeZoomOut"
                } ${productImageClassName}`.trim()}
              />
            )}
          </Link>
        </div>

        {/* Info area */}
        <div
          data-testid={`product-card-details-${product.id}`}
          className={`flex flex-col flex-1 gap-[5px] md:gap-[8px] mt-[8px] px-0 md:px-[8px] pb-0 md:pb-[8px] ${detailsClassName}`.trim()}
        >
          {/* Category chip */}
          {showProductType && product.category && (
            <div>
              <span
                data-testid={`product-card-variant-${product.id}`}
                className={`inline-flex p-[4.5px] md:p-[8px] text-[12px] md:text-[14px] font-[600] leading-[14px] ${categoryChipClassName}`.trim()}
                style={{
                  color: t.chipColor,
                  backgroundColor: t.chipBg,
                  border: t.chipBorder,
                  borderRadius: "4px",
                }}
              >
                {product.category}
              </span>
            </div>
          )}

          {/* Title */}
          <Link
            href={product.href}
            data-testid={`product-card-title-${product.id}`}
            className={`text-[14px] md:text-[16px] leading-[16.6px] md:leading-[20px] no-underline line-clamp-2  min-h-[33px] md:min-h-[40px] ${titleClassName}`.trim()}
            style={{
              color: textPrimary,
              fontWeight: 400,
              transition: "color 0.25s",
            }}
          >
            {product.title}
          </Link>

          {/* Description */}
          {showSubtitle && product.description && (
            <p
              className="text-[12px] md:text-[13px] leading-[16px] line-clamp-2 min-h-[32px]"
              style={{
                color: "#727272",
                fontWeight: 400,
              }}
            >
              {product.description}
            </p>
          )}

          {/* Rating */}
          {showRating && (
            <div data-testid={`product-card-rating-${product.id}`}>
              <StarRating
                rating={product.rating}
                reviewCount={product.reviewCount}
                textColor={textPrimary}
                className={ratingClassName}
                valueClassName={ratingValueClassName}
                reviewCountClassName={reviewCountClassName}
              />
            </div>
          )}

          {/* Price row */}
          <div
            data-testid={`product-card-price-section-${product.id}`}
            className={`flex flex-col lg:flex-row items-start lg:items-center gap-0 lg:gap-[6px] flex-wrap mt-auto min-h-8 lg:min-h-4 ${priceSectionClassName}`.trim()}
          >
            <span
              data-testid={`product-card-price-${product.id}`}
              className={`text-[14px] md:text-[16px] leading-4 ${salePriceClassName}`.trim()}
              style={{
                color: textPrimary,
                fontWeight: 600,
              }}
            >
              &#8377;{product.salePrice.toLocaleString("en-IN")}
            </span>
            {product.originalPrice &&
              product.originalPrice > product.salePrice && (
                <>
                  <div
                    data-testid={`product-card-price-details-${product.id}`}
                    className="leading-[13px] gap-1"
                  >
                    <span
                      data-testid={`product-card-compare-price-${product.id}`}
                      className={`text-[12px] line-through mr-1 text-[var(--compare-price-mobile)] md:text-[var(--compare-price-desktop)] ${compareAtPriceClassName}`.trim()}
                      style={
                        {
                          "--compare-price-mobile": t.comparePriceMobile,
                          "--compare-price-desktop": t.comparePriceDesktop,
                          fontWeight: 400,
                        } as React.CSSProperties
                      }
                    >
                      &#8377;{product.originalPrice.toLocaleString("en-IN")}
                    </span>
                    {product.discount && (
                      <span
                        data-testid={`product-card-discount-${product.id}`}
                        className={`text-[12px] ${discountClassName}`.trim()}
                        style={{
                          color: t.discountColor,
                          fontWeight: 600,
                        }}
                      >
                        {product.discount}
                      </span>
                    )}
                  </div>
                </>
              )}
          </div>

          {/* Add to cart / quantity pill / sold-out (links to PDP) */}
          {showActionButton &&
            (showInCartPill && !isSoldOut ? (
              <QuantityPill
                quantity={cartItem?.quantity ?? 1}
                onIncrement={onIncrement}
                onDecrement={onDecrement}
                isLoading={isQuantityLoading}
                className={actionButtonClassName}
                buttonRadius={t.buttonRadius}
              />
            ) : isSoldOut ? (
              // Sold-out: render as a Link to the PDP — clicking redirects.
              <Link
                href={product.href}
                onMouseEnter={() => setIsButtonHovered(true)}
                onMouseLeave={() => setIsButtonHovered(false)}
                className={`flex items-center justify-center w-full text-[18px] cursor-pointer font-[700] h-[32px] md:h-[42px] ${actionButtonClassName}`.trim()}
                style={{
                  backgroundColor: isButtonHovered
                    ? t.buttonHoverBg
                    : t.buttonBg,
                  color: isButtonHovered ? t.buttonHoverColor : buttonTextColor,
                  borderRadius: t.buttonRadius,
                  border: isButtonHovered
                    ? t.buttonHoverBorder
                    : t.buttonBorder,
                  transition:
                    "background-color 0.2s, color 0.2s, border-color 0.2s",
                }}
                aria-label={`${soldOutText} - ${product.title}`}
              >
                {soldOutText}
              </Link>
            ) : (
              <button
                type="button"
                onClick={handleAddToCartClick}
                disabled={isQuantityLoading || isLoading}
                onMouseEnter={() => setIsButtonHovered(true)}
                onMouseLeave={() => setIsButtonHovered(false)}
                data-testid="product-action-add-to-cart-button"
                className={`flex items-center justify-center w-full text-[18px] cursor-pointer font-[700] h-[32px] md:h-[42px] disabled:cursor-not-allowed ${actionButtonClassName}`.trim()}
                style={{
                  backgroundColor: isButtonHovered
                    ? t.buttonHoverBg
                    : t.buttonBg,
                  color: isButtonHovered ? t.buttonHoverColor : buttonTextColor,
                  borderRadius: t.buttonRadius,
                  border: isButtonHovered
                    ? t.buttonHoverBorder
                    : t.buttonBorder,
                  transition:
                    "background-color 0.2s, color 0.2s, border-color 0.2s",
                }}
                aria-label={`${actionButtonText} - ${product.title}`}
              >
                {isQuantityLoading || isLoading ? (
                  <InlineButtonLoader color={buttonTextColor} />
                ) : (
                  actionButtonText
                )}
              </button>
            ))}
        </div>
      </div>
      {showAddToCartToast && (
        <ProductCardToast
          show={showToast && !isCartOpen}
          onClose={() => setShowToast(false)}
          title={addToCartToastTitle}
        />
      )}
    </div>
  );
});

export {
  type ProductCardProduct,
  type ProductCardProps,
  type ProductCardSettings,
  ProductCardTheme,
} from "./types";
