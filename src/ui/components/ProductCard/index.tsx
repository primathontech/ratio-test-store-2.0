"use client";

import React, { memo, useState } from "react";
import Image from "next/image";
import { ProductCardTheme } from "./types";
import type { ProductCardProps } from "./types";

/* ------------------------------------------------------------------ */
/*  Star rating                                                        */
/* ------------------------------------------------------------------ */

const StarIcon = ({ filled }: { filled: boolean }) => (
  <span
    className="inline-block"
    style={{
      color: filled ? "#ffb700" : "#e0e0e0",
      fontSize: "12px",
      lineHeight: 1,
    }}
    aria-hidden="true"
  >
    &#9733;
  </span>
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
        {[1, 2, 3, 4, 5].map((i) => (
          <StarIcon key={i} filled={i <= Math.round(rating)} />
        ))}
      </span>
      <span
        className="text-[12px] leading-[16px]"
        style={{ color: textColor, fontFamily: "Gotham, sans-serif" }}
      >
        {rating.toFixed(1)}
      </span>
      <span
        className="text-[12px] leading-[16px]"
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
      return "rgb(72, 133, 24)";
  }
}

/* ------------------------------------------------------------------ */
/*  Theme tokens                                                       */
/* ------------------------------------------------------------------ */

const LIGHT_THEME = {
  cardBg: "#ffffff",
  cardBorder: "none",
  cardRadius: "10px",
  cardOverflow: "hidden" as const,
  textPrimary: "#1d1d1d",
  textSecondary: "#666666",
  textMuted: "#999999",
  chipBg: "rgb(244, 246, 248)",
  chipBorder: "none",
  chipColor: "#1d1d1d",
  chipPadding: "8px",
  chipFontSize: "14px",
  weightBg: "rgba(255,255,255,0.9)",
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
  weightBg: "rgba(0,0,0,0.5)",
  weightColor: "#ffffff",
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
      className="flex flex-col h-full"
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
      <a
        href={product.href}
        className="relative block overflow-hidden"
        style={{ aspectRatio: "1/1", borderRadius: t.imageRadius }}
      >
        {/* Promo badge */}
        {product.badge && (
          <div
            className="absolute top-0 left-0 z-[2] px-[8px] py-[3px] text-[10px]"
            style={{
              backgroundColor: badgeColor(product.badgeVariant),
              color: "#ffffff",
              borderRadius: "2px",
              fontFamily: "Gotham, sans-serif",
              fontWeight: 600,
            }}
          >
            {product.badge}
          </div>
        )}

        {/* Size / weight label */}
        {product.weight && (
          <div
            className="absolute bottom-[4px] right-[4px] z-[2] px-[6px] py-[2px] text-[11px]"
            style={{
              backgroundColor: t.weightBg,
              color: t.weightColor,
              borderRadius: "4px",
              fontFamily: "Gotham, sans-serif",
              fontWeight: 400,
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
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            opacity: isHovered && product.hoverImage ? 0 : 1,
            transition: "opacity 0.5s",
            borderRadius: t.imageRadius,
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
            className="absolute inset-0 w-full h-full object-cover"
            style={{
              opacity: isHovered ? 1 : 0,
              transform: isHovered ? "scale(1.045)" : "scale(1)",
              transition:
                "opacity 0.5s, transform 2s cubic-bezier(0, 0, 0.44, 1.18)",
              borderRadius: t.imageRadius,
            }}
          />
        )}
      </a>

      {/* Info area */}
      <div className="flex flex-col flex-1 px-[12px] pt-[8px] pb-[12px]">
        {/* Category chip */}
        {product.category && (
          <div className="mb-[8px]">
            <span
              className="inline-flex"
              style={{
                color: t.chipColor,
                backgroundColor: t.chipBg,
                border: t.chipBorder,
                borderRadius: "4px",
                padding: t.chipPadding,
                fontSize: t.chipFontSize,
                fontFamily: "Gotham, sans-serif",
                fontWeight: 400,
              }}
            >
              {product.category}
            </span>
          </div>
        )}

        {/* Title */}
        <a
          href={product.href}
          className="text-[14px] leading-[20px] no-underline line-clamp-2 mb-[4px]"
          style={{
            color: t.textPrimary,
            fontFamily: "Gotham, sans-serif",
            fontWeight: 400,
            transition: "color 0.25s",
          }}
        >
          {product.title}
        </a>

        {/* Description */}
        {product.description && (
          <p
            className="text-[12px] leading-[16px] line-clamp-2 mb-[4px]"
            style={{
              color: t.textSecondary,
              fontFamily: "Gotham, sans-serif",
              fontWeight: 400,
            }}
          >
            {product.description}
          </p>
        )}

        {/* Rating */}
        <div className="mb-[4px]">
          <StarRating
            rating={product.rating}
            reviewCount={product.reviewCount}
            textColor={t.textPrimary}
          />
        </div>

        {/* Price row */}
        <div className="flex items-center gap-[6px] flex-wrap mt-auto">
          <span
            className="text-[14px]"
            style={{
              color: t.textPrimary,
              fontFamily: "Gotham, sans-serif",
              fontWeight: 700,
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
          className="flex items-center justify-center w-full mt-[12px] text-[14px] cursor-pointer"
          style={{
            backgroundColor: t.buttonBg,
            color: t.buttonColor,
            height: "42px",
            borderRadius: t.buttonRadius,
            border: t.buttonBorder,
            fontFamily: "Gotham, sans-serif",
            fontWeight: 500,
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
