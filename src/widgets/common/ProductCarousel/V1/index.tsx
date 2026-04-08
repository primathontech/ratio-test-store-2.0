"use client";

import React, { memo, useState, useRef, useCallback, useEffect } from "react";
import Image from "next/image";
import { ProductCarouselProps, ProductCarouselProduct } from "../types";

/* ------------------------------------------------------------------ */
/*  SVG Icons                                                          */
/* ------------------------------------------------------------------ */

const PrevArrowIcon = () => (
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

const NextArrowIcon = () => (
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

const ChevronRightIcon = () => (
  <svg
    width="7"
    height="12"
    viewBox="0 0 7 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M1 1L6 6L1 11"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/* ------------------------------------------------------------------ */
/*  Star rating                                                        */
/* ------------------------------------------------------------------ */

const StarRating = ({
  rating,
  reviewCount,
}: {
  rating: number;
  reviewCount: number;
}) => {
  if (reviewCount === 0) return null;
  return (
    <div className="flex items-center gap-[4px]">
      <span
        className="text-[12px] leading-[1]"
        style={{ color: "#f9a826" }}
        aria-hidden="true"
      >
        &#9733;
      </span>
      <span
        className="text-[12px] leading-[16px]"
        style={{ color: "#1d1d1d", fontFamily: "Gotham, sans-serif" }}
      >
        {rating.toFixed(1)}
      </span>
      <span
        className="text-[12px] leading-[16px]"
        style={{
          color: "rgb(143, 143, 143)",
          fontFamily: "Gotham, sans-serif",
        }}
      >
        | {reviewCount}
      </span>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  Product Card — light theme (white background)                      */
/* ------------------------------------------------------------------ */

const ProductCard = memo(function ProductCard({
  product,
}: {
  product: ProductCarouselProduct;
}) {
  const [isHovered, setIsHovered] = useState(false);

  const badgeBgColor =
    product.badgeColor === "orange" ? "rgb(255, 90, 0)" : "rgb(118, 194, 120)";

  return (
    <div
      className="flex flex-col h-full"
      style={{
        backgroundColor: "#ffffff",
        borderRadius: "8px",
        border: "1px solid rgb(229, 229, 229)",
        overflow: "hidden",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image area */}
      <a
        href={product.href}
        className="relative block overflow-hidden"
        style={{ aspectRatio: "1/1" }}
      >
        {/* Top-left badge */}
        {product.badge && (
          <div
            className="absolute top-[8px] left-[8px] z-[2] px-[8px] py-[4px] text-[12px]"
            style={{
              backgroundColor: badgeBgColor,
              color: "#ffffff",
              borderRadius: "4px",
              fontFamily: "Gotham, sans-serif",
              fontWeight: 600,
            }}
          >
            {product.badge}
          </div>
        )}

        {/* Bottom-right weight/net content label */}
        {product.netContent && (
          <div
            className="absolute bottom-[8px] right-[8px] z-[2] px-[6px] py-[2px] text-[11px]"
            style={{
              backgroundColor: "rgba(0,0,0,0.5)",
              color: "#ffffff",
              borderRadius: "4px",
              fontFamily: "Gotham, sans-serif",
              fontWeight: 400,
            }}
          >
            {product.netContent}
          </div>
        )}

        {/* Main image */}
        <Image
          src={product.mainImage}
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
            src={product.hoverImage}
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
      <div
        className="flex flex-col flex-1 px-[10px] pt-[10px] pb-[10px]"
        style={{ gap: "6px" }}
      >
        {/* Category pill */}
        {product.category && (
          <div>
            <span
              className="inline-flex text-[12px] px-[8px] py-[2px]"
              style={{
                color: "#1d1d1d",
                backgroundColor: "rgb(244, 246, 248)",
                borderRadius: "20px",
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
          className="text-[14px] leading-[20px] no-underline line-clamp-2"
          style={{
            color: "#1d1d1d",
            fontFamily: "Gotham, sans-serif",
            fontWeight: 400,
          }}
        >
          {product.title}
        </a>

        {/* Subtitle */}
        {product.subtitle && (
          <p
            className="text-[12px] leading-[16px] line-clamp-2"
            style={{
              color: "rgb(143, 143, 143)",
              fontFamily: "Gotham, sans-serif",
              fontWeight: 400,
              margin: 0,
            }}
          >
            {product.subtitle}
          </p>
        )}

        {/* Rating */}
        <StarRating rating={product.rating} reviewCount={product.reviewCount} />

        {/* Price row */}
        <div className="flex items-center gap-[6px] flex-wrap">
          <span
            className="text-[14px]"
            style={{
              color: "#1d1d1d",
              fontFamily: "Gotham, sans-serif",
              fontWeight: 600,
            }}
          >
            {product.price}
          </span>
          {product.originalPrice && (
            <span
              className="text-[12px] line-through"
              style={{
                color: "rgb(143, 143, 143)",
                fontFamily: "Gotham, sans-serif",
                fontWeight: 400,
              }}
            >
              {product.originalPrice}
            </span>
          )}
          {product.discountLabel && (
            <span
              className="text-[12px]"
              style={{
                color: "rgb(211, 47, 47)",
                fontFamily: "Gotham, sans-serif",
                fontWeight: 600,
              }}
            >
              {product.discountLabel}
            </span>
          )}
        </div>

        {/* Add to cart button */}
        <button
          type="button"
          className="flex items-center justify-center gap-[8px] w-full mt-auto text-[14px] cursor-pointer"
          style={{
            backgroundColor: "#000000",
            color: "#ffffff",
            height: "44px",
            borderRadius: "4px",
            border: "none",
            fontFamily: "Gotham, sans-serif",
            fontWeight: 500,
            transition: "opacity 0.2s",
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
/*  Carousel hook                                                      */
/* ------------------------------------------------------------------ */

function useCarousel(itemCount: number) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const viewportRef = useRef<HTMLDivElement>(null);

  const getVisibleCards = useCallback((): number => {
    if (typeof window === "undefined") return 5;
    const w = window.innerWidth;
    if (w >= 1440) return 5;
    if (w >= 1024) return 4;
    if (w >= 768) return 3;
    return 2.3;
  }, []);

  const [visibleCards, setVisibleCards] = useState(5);

  useEffect(() => {
    const update = () => setVisibleCards(getVisibleCards());
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [getVisibleCards]);

  const maxIndex = Math.max(0, Math.ceil(itemCount - visibleCards));
  const canGoPrev = currentIndex > 0;
  const canGoNext = currentIndex < maxIndex;

  const goNext = useCallback(() => {
    setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));
  }, [maxIndex]);

  const goPrev = useCallback(() => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  }, []);

  const gapPx = 16;

  return {
    viewportRef,
    currentIndex,
    canGoPrev,
    canGoNext,
    goNext,
    goPrev,
    visibleCards,
    gapPx,
  };
}

/* ------------------------------------------------------------------ */
/*  Main V1 Component                                                  */
/* ------------------------------------------------------------------ */

export const V1 = memo(function V1({ settings }: ProductCarouselProps) {
  const products = settings?.products || [];
  const headingNormal = settings?.headingNormal || "";
  const headingBold = settings?.headingBold || "";
  const collectionHandle = settings?.collectionHandle || "";
  const viewAllCount = settings?.viewAllCount || 0;

  const {
    viewportRef,
    currentIndex,
    canGoPrev,
    canGoNext,
    goNext,
    goPrev,
    visibleCards,
    gapPx,
  } = useCarousel(products.length);

  // Calculate transform based on currentIndex
  const [transformPx, setTransformPx] = useState(0);

  useEffect(() => {
    const updateTransform = () => {
      if (!viewportRef.current) return;
      const viewportWidth = viewportRef.current.offsetWidth;
      const cardWidth =
        (viewportWidth - gapPx * (Math.floor(visibleCards) - 1)) / visibleCards;
      setTransformPx(-(currentIndex * (cardWidth + gapPx)));
    };
    updateTransform();
    window.addEventListener("resize", updateTransform);
    return () => window.removeEventListener("resize", updateTransform);
  }, [currentIndex, visibleCards, gapPx, viewportRef]);

  return (
    <section
      style={{
        backgroundColor: "#ffffff",
        paddingTop: "50px",
        paddingBottom: "50px",
        marginTop: "56px",
        fontFamily: "Gotham, sans-serif",
      }}
    >
      <div
        className="mx-auto"
        style={{
          maxWidth: "1300px",
          paddingLeft: "15px",
          paddingRight: "15px",
        }}
      >
        {/* Section heading */}
        <h3
          className="text-center"
          style={{
            fontSize: "32px",
            lineHeight: "42px",
            color: "#1d1d1d",
            fontWeight: 400,
            margin: "0 0 32px 0",
            fontFamily: "Gotham, sans-serif",
          }}
        >
          {headingNormal}
          <strong style={{ fontWeight: 700 }}>{headingBold}</strong>
        </h3>

        {/* Carousel area */}
        <div className="relative">
          {/* Prev button */}
          <button
            type="button"
            onClick={goPrev}
            disabled={!canGoPrev}
            className="absolute left-[-20px] z-[3] hidden lg:flex items-center justify-center cursor-pointer"
            style={{
              top: "calc(50% - 80px)",
              transform: "translateY(-50%)",
              width: "40px",
              height: "40px",
              borderRadius: "9999px",
              backgroundColor: "rgba(255,255,255,0.95)",
              border: "1px solid rgb(229, 229, 229)",
              color: "#1d1d1d",
              opacity: canGoPrev ? 1 : 0.4,
              transition: "opacity 0.2s",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            }}
            aria-label="Previous products"
          >
            <PrevArrowIcon />
          </button>

          {/* Next button */}
          <button
            type="button"
            onClick={goNext}
            disabled={!canGoNext}
            className="absolute right-[-20px] z-[3] hidden lg:flex items-center justify-center cursor-pointer"
            style={{
              top: "calc(50% - 80px)",
              transform: "translateY(-50%)",
              width: "40px",
              height: "40px",
              borderRadius: "9999px",
              backgroundColor: "rgba(255,255,255,0.95)",
              border: "1px solid rgb(229, 229, 229)",
              color: "#1d1d1d",
              opacity: canGoNext ? 1 : 0.4,
              transition: "opacity 0.2s",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            }}
            aria-label="Next products"
          >
            <NextArrowIcon />
          </button>

          {/* Viewport */}
          <div ref={viewportRef} className="overflow-hidden">
            <div
              className="flex"
              style={{
                transform: `translateX(${transformPx}px)`,
                transition: "transform 0.4s ease",
                gap: `${gapPx}px`,
              }}
            >
              {products.map((product, idx) => (
                <div
                  key={idx}
                  className="flex-shrink-0"
                  style={{
                    width: `calc((100% - ${gapPx * (Math.floor(visibleCards) - 1)}px) / ${visibleCards})`,
                  }}
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* View all link */}
        {viewAllCount > 0 && collectionHandle && (
          <div className="flex justify-center" style={{ marginTop: "32px" }}>
            <a
              href={`/collections/${collectionHandle}`}
              className="inline-flex items-center gap-[8px] no-underline text-[14px]"
              style={{
                backgroundColor: "rgb(244, 246, 248)",
                color: "#1d1d1d",
                padding: "10px 20px",
                borderRadius: "4px",
                border: "1px solid #1d1d1d",
                fontFamily: "Gotham, sans-serif",
                fontWeight: 500,
                transition:
                  "background-color 0.25s ease-in-out, color 0.25s ease-in-out",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget;
                el.style.backgroundColor = "#1d1d1d";
                el.style.color = "#ffffff";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget;
                el.style.backgroundColor = "rgb(244, 246, 248)";
                el.style.color = "#1d1d1d";
              }}
            >
              <span>View all {viewAllCount} products</span>
              <ChevronRightIcon />
            </a>
          </div>
        )}
      </div>
    </section>
  );
});
