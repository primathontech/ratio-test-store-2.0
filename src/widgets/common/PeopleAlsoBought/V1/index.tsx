"use client";

import React, { memo, useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { PeopleAlsoBoughtProps, PeopleAlsoBoughtProduct } from "../types";

/* ------------------------------------------------------------------ */
/*  SVG Icons                                                          */
/* ------------------------------------------------------------------ */

const ChevronLeftIcon = () => (
  <svg
    width="7"
    height="11"
    viewBox="0 0 7 11"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M5.5 11L0 5.5L5.5 0L6.47625 0.97625L1.9525 5.5L6.47625 10.0238L5.5 11Z"
      fill="currentColor"
    />
  </svg>
);

const ChevronRightIcon = () => (
  <svg
    width="7"
    height="11"
    viewBox="0 0 7 11"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M1.5 11L7 5.5L1.5 0L0.52375 0.97625L5.0475 5.5L0.52375 10.0238L1.5 11Z"
      fill="currentColor"
    />
  </svg>
);

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

/* ------------------------------------------------------------------ */
/*  Product Card                                                       */
/* ------------------------------------------------------------------ */

const ProductCard = memo(function ProductCard({
  product,
}: {
  product: PeopleAlsoBoughtProduct;
}) {
  const [isHovered, setIsHovered] = useState(false);

  const badgeBg =
    product.badgeVariant === "new" ? "rgb(213, 52, 52)" : "rgb(72, 133, 24)";

  return (
    <div
      className="flex flex-col h-full border border-[rgba(29,29,29,0.12)]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image area */}
      <a
        href={product.href}
        className="relative block overflow-hidden"
        style={{ aspectRatio: "1/1" }}
      >
        {/* Badge */}
        {product.badge && (
          <div
            className="absolute top-0 left-0 z-[2] px-[8px] py-[3px] text-[10px]"
            style={{
              backgroundColor: badgeBg,
              color: "#ffffff",
              borderRadius: "2px",
              fontFamily: "Gotham, sans-serif",
              fontWeight: 600,
            }}
          >
            {product.badge}
          </div>
        )}

        {/* Weight label */}
        {product.weight && (
          <div
            className="absolute bottom-[4px] right-[4px] z-[2] text-[12px]"
            style={{ color: "#1d1d1d", fontFamily: "Gotham, sans-serif" }}
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
            opacity: isHovered ? 0 : 1,
            transition: "opacity 0.5s",
          }}
        />

        {/* Hover image */}
        <Image
          src={normalizeImgSrc(product.hoverImage)}
          alt={product.alt}
          width={360}
          height={360}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            opacity: isHovered ? 1 : 0,
            transition:
              "opacity 0.5s, transform 2s cubic-bezier(0, 0, 0.44, 1.18)",
          }}
        />
      </a>

      {/* Info area */}
      <div className="flex flex-col flex-1 px-[12px] pt-[8px] pb-[12px]">
        {/* Category chip */}
        {product.category && (
          <div className="mb-[8px]">
            <span
              className="inline-flex text-[11px] px-[10px] py-[4px]"
              style={{
                color: "#1d1d1d",
                backgroundColor: "#f2f2f2",
                borderRadius: "2px",
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
            color: "#1d1d1d",
            fontFamily: "Gotham, sans-serif",
            fontWeight: 400,
            transition: "0.25s",
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
                      color: "rgb(213, 52, 52)",
                      fontFamily: "Gotham, sans-serif",
                      fontWeight: 400,
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
          className="flex items-center justify-center gap-[8px] w-full mt-[12px] text-[14px] cursor-pointer"
          style={{
            backgroundColor: "#000000",
            color: "#ffffff",
            height: "42px",
            borderRadius: "0px",
            border: "none",
            fontFamily: "Gotham, sans-serif",
            fontWeight: 400,
            transition: "all 0.3s",
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

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

export const V1 = memo(function V1({ settings }: PeopleAlsoBoughtProps) {
  const heading = settings?.heading || "People Also Bought";
  const products = settings?.products || [];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCards, setVisibleCards] = useState(5);

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w >= 1440) {
        setVisibleCards(5);
      } else if (w >= 1024) {
        setVisibleCards(3);
      } else if (w >= 768) {
        setVisibleCards(2);
      } else {
        setVisibleCards(1);
      }
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const maxIndex = Math.max(0, products.length - visibleCards);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  }, []);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
  }, [maxIndex]);

  const isPrevDisabled = currentIndex === 0;
  const isNextDisabled = currentIndex >= maxIndex;

  if (products.length === 0) {
    return null;
  }

  return (
    <section
      className="pab-section w-full py-[32px]"
      style={{ backgroundColor: "#ffffff" }}
      aria-label={heading}
    >
      {/* Heading */}
      <div className="px-[16px] lg:px-[72px]">
        <h3
          className="text-[20px] lg:text-[24px] mb-[24px]"
          style={{
            color: "#1d1d1d",
            fontFamily: "Gotham, sans-serif",
            fontWeight: 700,
          }}
        >
          {heading}
        </h3>
      </div>

      {/* Slider viewport */}
      <div className="pab-slider-viewport overflow-hidden">
        <div
          className="flex items-stretch"
          style={{
            gap: "var(--pab-gap)",
            paddingLeft: "var(--pab-pad)",
            paddingRight: "var(--pab-pad)",
            transform: `translate3d(calc(-${currentIndex} * (calc((100% - var(--pab-pad) * 2 - (var(--pab-cards) - 1) * var(--pab-gap)) / var(--pab-cards)) + var(--pab-gap))), 0px, 0px)`,
            transition: "transform 0.5s ease",
          }}
        >
          {products.map((product, idx) => (
            <div key={idx} className="pab-slide flex-shrink-0">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>

      {/* Navigation arrows */}
      <div className="flex items-center gap-[8px] px-[16px] lg:px-[72px] mt-[16px]">
        <button
          type="button"
          onClick={handlePrev}
          disabled={isPrevDisabled}
          className="flex items-center justify-center w-[40px] h-[40px] border cursor-pointer"
          style={{
            borderRadius: "50%",
            borderColor: "rgba(29,29,29,0.12)",
            backgroundColor: "#ffffff",
            opacity: isPrevDisabled ? 0.4 : 1,
            transition: "0.4s",
          }}
          aria-label="Previous products"
        >
          <ChevronLeftIcon />
        </button>
        <button
          type="button"
          onClick={handleNext}
          disabled={isNextDisabled}
          className="flex items-center justify-center w-[40px] h-[40px] border cursor-pointer"
          style={{
            borderRadius: "50%",
            borderColor: "rgba(29,29,29,0.12)",
            backgroundColor: "#ffffff",
            opacity: isNextDisabled ? 0.4 : 1,
            transition: "0.4s",
          }}
          aria-label="Next products"
        >
          <ChevronRightIcon />
        </button>
      </div>
    </section>
  );
});
