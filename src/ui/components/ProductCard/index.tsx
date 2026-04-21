"use client";

import React, { memo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ProductCardTheme } from "./types";
import type { ProductCardProps } from "./types";

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
}: {
  rating: number;
  reviewCount: number;
  textColor: string;
}) => {
  if (reviewCount === 0) {
    return null;
  }
  return (
    <div className="flex items-center gap-[4px]">
      <span
        className="inline-flex items-center"
        role="img"
        aria-label={`${rating} star rating`}
      >
        <StarIcon filled={rating > 0} />
      </span>
      <span
        className="text-[12px] md:text-[10px] leading-[16px]"
        style={{ color: textColor, fontFamily: "Gotham, sans-serif" }}
      >
        {rating.toFixed(1)}
      </span>
      <span
        className="text-[14px] leading-[16px]"
        style={{ color: textColor, fontFamily: "Gotham, sans-serif" }}
      >
        | {reviewCount}
      </span>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function normalizeImgSrc(url: string): string {
  return url.startsWith("//") ? `https:${url}` : url;
}

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
  textMuted: "#999999",
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
  discountColor: "rgb(0, 160, 0)",
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
  buttonHoverBg: "rgb(230,230,230)",
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
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const t = theme === ProductCardTheme.DARK ? DARK_THEME : LIGHT_THEME;

  return (
    <div
      className="flex flex-col h-full pl-[12px] lg:pl-0"
      style={{
        backgroundColor: t.cardBg,
        border: t.cardBorder,
        borderRadius: t.cardRadius,
        overflow: t.cardOverflow,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image area */}
      <div className="pl-0 md:pl-[8px] pr-0 md:pr-[8px] pt-0 md:pt-[8px]">
        <Link
          href={product.href}
          className="relative block overflow-hidden"
          style={{ aspectRatio: "1/1" }}
        >
          {/* Promo badge */}
          {product.badge && (
            <div className="absolute top-[4px] left-[4px] md:top-[8px] md:left-[10px] z-[2]">
              <div
                className="relative inline-flex items-center leading-[18px] md:leading-[21px] text-[12px] md:text-[14px] font-[500] rounded-l-[4px] pl-[4px] pr-[15px]"
                style={{
                  backgroundColor: badgeColor(product.badgeVariant),
                  color: "#ffffff",
                  fontFamily: "Gotham, sans-serif",
                  clipPath:
                    "polygon(0 0, 100% 0, calc(100% - 8px) 50%, 100% 100%, 0 100%)",
                }}
              >
                {product.badge}
              </div>
            </div>
          )}

          {/* Size / weight label */}
          {product.weight && (
            <div
              className="absolute bottom-[4px] right-[4px] z-[2] p-[4px] text-[10px] text-[#1D1D1D] leading-[12px]"
              style={{
                backgroundColor: t.weightBg,
                color: t.weightColor,
                borderRadius: "4px",
                fontFamily: "Gotham, sans-serif",
                fontWeight: 600,
              }}
            >
              {product.weight}
            </div>
          )}

          {/* Main image */}
          <Image
            src={normalizeImgSrc(product.mainImage)}
            alt={product.alt}
            width={360}
            height={360}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover rounded-[2px]"
            style={{
              opacity: isHovered && product.hoverImage ? 0 : 1,
              transition: "opacity 0.5s",
            }}
          />

          {/* Hover image */}
          {product.hoverImage && (
            <Image
              src={normalizeImgSrc(product.hoverImage)}
              alt={product.alt}
              width={360}
              height={360}
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover rounded-[2px]"
              style={{
                opacity: isHovered ? 1 : 0,
                transform: isHovered ? "scale(1.045)" : "scale(1)",
                transition:
                  "opacity 0.5s, transform 2s cubic-bezier(0, 0, 0.44, 1.18)",
              }}
            />
          )}
        </Link>
      </div>

      {/* Info area */}
      <div className="flex flex-col flex-1 gap-[5px] md:gap-[8px] mt-[8px] px-0 md:px-[8px] pb-0 md:pb-[8px]">
        {/* Category chip */}
        {product.category && (
          <div>
            <span
              className="inline-flex p-[4.5px] md:p-[8px] text-[12px] md:text-[14px] font-[600] leading-[14px]"
              style={{
                color: t.chipColor,
                backgroundColor: t.chipBg,
                border: t.chipBorder,
                borderRadius: "4px",
                fontFamily: "Gotham, sans-serif",
              }}
            >
              {product.category}
            </span>
          </div>
        )}

        {/* Title */}
        <Link
          href={product.href}
          className="text-[14px] md:text-[16px] leading-[16.6px] md:leading-[20px] no-underline line-clamp-2  min-h-[33px] md:min-h-[40px]"
          style={{
            color: t.textPrimary,
            fontFamily: "Gotham, sans-serif",
            fontWeight: 400,
            transition: "color 0.25s",
          }}
        >
          {product.title}
        </Link>

        {/* Description */}
        {product.description && (
          <p
            className="text-[12px] md:text-[13px] leading-[16px] line-clamp-2"
            style={{
              color: "#727272",
              fontFamily: "Gotham, sans-serif",
              fontWeight: 400,
            }}
          >
            {product.description}
          </p>
        )}

        {/* Rating */}
        <div>
          <StarRating
            rating={product.rating}
            reviewCount={product.reviewCount}
            textColor={t.textPrimary}
          />
        </div>

        {/* Price row */}
        <div className="flex items-center gap-[6px] flex-wrap mt-auto">
          <span
            className="text-[14px] md:text-[16px]"
            style={{
              color: t.textPrimary,
              fontFamily: "Gotham, sans-serif",
              fontWeight: 600,
            }}
          >
            &#8377;{product.salePrice.toLocaleString("en-IN")}
          </span>
          {product.originalPrice &&
            product.originalPrice > product.salePrice && (
              <>
                <span
                  className="text-[12px] line-through"
                  style={{
                    color: t.textMuted,
                    fontFamily: "Gotham, sans-serif",
                    fontWeight: 400,
                  }}
                >
                  &#8377;{product.originalPrice.toLocaleString("en-IN")}
                </span>
                {product.discount && (
                  <span
                    className="text-[12px]"
                    style={{
                      color: t.discountColor,
                      fontFamily: "Gotham, sans-serif",
                      fontWeight: 600,
                    }}
                  >
                    {product.discount}
                  </span>
                )}
              </>
            )}
        </div>

        {/* Add to cart button */}
        <button
          type="button"
          className="flex items-center justify-center w-full text-[18px] cursor-pointer font-[700] h-[32px] md:h-[42px]"
          style={{
            backgroundColor: t.buttonBg,
            color: t.buttonColor,
            borderRadius: t.buttonRadius,
            border: t.buttonBorder,
            fontFamily: "Gotham, sans-serif",
            transition: "background-color 0.2s",
          }}
          aria-label={`Add ${product.title} to cart`}
        >
          Add to cart
        </button>
      </div>
    </div>
  );
});

export {
  type ProductCardProduct,
  type ProductCardProps,
  ProductCardTheme,
} from "./types";
