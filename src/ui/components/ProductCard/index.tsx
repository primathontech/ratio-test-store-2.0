"use client";

import React, { memo, useState } from "react";
import Image from "next/image";
import { ProductCardProduct } from "./types";

/* ------------------------------------------------------------------ */
/*  SVG Icons                                                          */
/* ------------------------------------------------------------------ */

const CartIcon = () => (
  <svg
    width="14"
    height="16"
    viewBox="0 0 14 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M4.5 1.5C4.5 0.671573 5.17157 0 6 0H8C8.82843 0 9.5 0.671573 9.5 1.5V3H4.5V1.5Z"
      stroke="currentColor"
      strokeWidth="1"
      fill="none"
    />
    <path
      d="M0.5 4H13.5L12.5 15H1.5L0.5 4Z"
      stroke="currentColor"
      strokeWidth="1"
      fill="none"
    />
  </svg>
);

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
}: {
  rating: number;
  reviewCount: number;
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
        style={{ color: "#1d1d1d", fontFamily: "Gotham, sans-serif" }}
      >
        {rating.toFixed(1)}
      </span>
      <span
        className="text-[12px] leading-[16px]"
        style={{ color: "#1d1d1d", fontFamily: "Gotham, sans-serif" }}
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
/*  Product Card                                                       */
/* ------------------------------------------------------------------ */

export const ProductCard = memo(function ProductCard({
  product,
}: {
  product: ProductCardProduct;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="flex flex-col h-full border border-[rgba(29,29,29,0.12)]"
      style={{ backgroundColor: "#ffffff" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image area */}
      <a
        href={product.href}
        className="relative block overflow-hidden"
        style={{ aspectRatio: "1/1" }}
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
              backgroundColor: "rgba(255,255,255,0.9)",
              color: "#333333",
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
              className="inline-flex text-[11px] px-[10px] py-[4px]"
              style={{
                color: "#333333",
                backgroundColor: "#ffffff",
                border: "1px solid #333333",
                borderRadius: "4px",
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
          className="text-[14px] leading-[20px] no-underline line-clamp-2 mb-[4px] hover:text-[rgb(0,137,221)]"
          style={{
            color: "#1d1d1d",
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
              color: "#666666",
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
          />
        </div>

        {/* Price row */}
        <div className="flex items-center gap-[6px] flex-wrap mt-auto">
          <span
            className="text-[14px]"
            style={{
              color: "#1d1d1d",
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
                    color: "#999999",
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
                      color: "rgb(0, 160, 0)",
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
          className="flex items-center justify-center gap-[8px] w-full mt-[12px] text-[14px] cursor-pointer hover:bg-[rgb(56,56,56)]"
          style={{
            backgroundColor: "#000000",
            color: "#ffffff",
            height: "42px",
            borderRadius: "0px",
            border: "none",
            fontFamily: "Gotham, sans-serif",
            fontWeight: 400,
            transition: "background-color 0.2s",
          }}
          aria-label={`Add ${product.title} to cart`}
        >
          <CartIcon />
          <span>Add to cart</span>
        </button>
      </div>
    </div>
  );
});

export { type ProductCardProduct } from "./types";
