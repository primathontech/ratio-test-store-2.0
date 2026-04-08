"use client";

import React, { memo, useState, useRef, useCallback, useEffect } from "react";
import Image from "next/image";
import { HairCareBFFsProps, HairCareBFFsProduct } from "../types";

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

const ChevronRightIcon = () => (
  <svg
    width="8"
    height="14"
    viewBox="0 0 8 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M1 1L7 7L1 13"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ChevronLeftIcon = () => (
  <svg
    width="8"
    height="14"
    viewBox="0 0 8 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M7 1L1 7L7 13"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ArrowRightIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M3.5 8H12.5M12.5 8L8.5 4M12.5 8L8.5 12"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/* ------------------------------------------------------------------ */
/*  Star rating — dark theme variant                                   */
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
        style={{ color: "#ffc107" }}
        aria-hidden="true"
      >
        &#9733;
      </span>
      <span
        className="text-[12px] leading-[16px]"
        style={{ color: "#ffffff", fontFamily: "Gotham, sans-serif" }}
      >
        {rating.toFixed(1)}
      </span>
      <span
        className="text-[12px] leading-[16px]"
        style={{
          color: "rgba(255,255,255,0.7)",
          fontFamily: "Gotham, sans-serif",
        }}
      >
        | {reviewCount}
      </span>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  Product Card — dark theme                                          */
/* ------------------------------------------------------------------ */

const DarkProductCard = memo(function DarkProductCard({
  product,
}: {
  product: HairCareBFFsProduct;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="flex flex-col h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image area */}
      <a
        href={product.href}
        className="relative block overflow-hidden"
        style={{
          aspectRatio: "1/1",
          borderRadius: "10px",
          padding: "8px",
        }}
      >
        {/* Gift badge */}
        {product.badge && (
          <div
            className="absolute top-0 left-0 z-[2] px-[6px] py-[2px] text-[11px]"
            style={{
              backgroundColor: "rgb(85, 176, 81)",
              color: "#ffffff",
              borderRadius: "2px",
              fontFamily: "Gotham, sans-serif",
              fontWeight: 600,
            }}
          >
            {product.badge}
          </div>
        )}

        {/* Net content label */}
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
            borderRadius: "10px",
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
              borderRadius: "10px",
            }}
          />
        )}
      </a>

      {/* Info area */}
      <div
        className="flex flex-col flex-1 px-[8px] pt-[8px] pb-[8px]"
        style={{ gap: "8px" }}
      >
        {/* Category chip */}
        {product.category && (
          <div>
            <span
              className="inline-flex text-[11px] px-[8px] py-[8px]"
              style={{
                color: "#ffffff",
                backgroundColor: "rgb(29, 29, 29)",
                borderRadius: "4px",
                fontFamily: "Gotham, sans-serif",
                fontWeight: 500,
              }}
            >
              {product.category}
            </span>
          </div>
        )}

        {/* Title */}
        <a
          href={product.href}
          className="text-[16px] leading-[22px] no-underline line-clamp-2"
          style={{
            color: "#ffffff",
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
              color: "rgba(255,255,255,0.7)",
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

        {/* Price */}
        <div
          className="text-[16px]"
          style={{
            color: "#ffffff",
            fontFamily: "Gotham, sans-serif",
            fontWeight: 600,
          }}
        >
          {product.price}
        </div>

        {/* Add to cart button */}
        <button
          type="button"
          className="flex items-center justify-center gap-[8px] w-full mt-auto text-[14px] cursor-pointer"
          style={{
            backgroundColor: "#ffffff",
            color: "rgb(29, 29, 29)",
            height: "44px",
            borderRadius: "4px",
            border: "2px solid #ffffff",
            fontFamily: "Gotham, sans-serif",
            fontWeight: 500,
            transition: "all 0.2s",
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
/*  Carousel logic                                                     */
/* ------------------------------------------------------------------ */

function useCarousel(itemCount: number) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const viewportRef = useRef<HTMLDivElement>(null);

  const getVisibleCards = useCallback((): number => {
    if (typeof window === "undefined") return 5;
    const w = window.innerWidth;
    if (w >= 1440) return 5;
    if (w >= 1024) return 4;
    if (w >= 768) return 2.5;
    return 1.5;
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

  const translateX = -(currentIndex * (100 / visibleCards));

  return {
    viewportRef,
    translateX,
    canGoPrev,
    canGoNext,
    goNext,
    goPrev,
    visibleCards,
  };
}

/* ------------------------------------------------------------------ */
/*  Main V1 Component                                                  */
/* ------------------------------------------------------------------ */

export const V1 = memo(function V1({ settings }: HairCareBFFsProps) {
  const tabs = settings?.tabs || [];
  const headingNormal = settings?.headingNormal || "Hair Care ";
  const headingBold = settings?.headingBold || "BFFs";
  const backgroundImage =
    settings?.backgroundImage || "/HairCareBFFs/images/bg-watermark.png";

  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const activeTab = tabs[activeTabIndex];
  const products = activeTab?.products || [];

  const {
    viewportRef,
    translateX,
    canGoPrev,
    canGoNext,
    goNext,
    goPrev,
    visibleCards,
  } = useCarousel(products.length);

  // Reset carousel position when tab changes
  const handleTabClick = useCallback(
    (index: number) => {
      if (index === activeTabIndex) return;
      setActiveTabIndex(index);
    },
    [activeTabIndex]
  );

  // Reset carousel to start when activeTabIndex changes (via parent state)
  const prevTabRef = useRef(activeTabIndex);
  useEffect(() => {
    if (prevTabRef.current !== activeTabIndex) {
      prevTabRef.current = activeTabIndex;
    }
  }, [activeTabIndex]);

  const tabsScrollRef = useRef<HTMLDivElement>(null);

  return (
    <section
      className="relative overflow-hidden"
      style={{
        paddingTop: "56px",
        paddingBottom: "56px",
        marginTop: "56px",
        fontFamily: "Gotham, sans-serif",
      }}
    >
      {/* Background image */}
      <div className="absolute inset-0 z-[0]">
        <Image
          src={backgroundImage}
          alt=""
          fill
          className="object-cover"
          loading="lazy"
          aria-hidden="true"
        />
      </div>

      {/* Content overlay */}
      <div
        className="relative z-[1] mx-auto"
        style={{
          maxWidth: "1300px",
          paddingLeft: "15px",
          paddingRight: "15px",
        }}
      >
        {/* Tabs head: heading + tab buttons */}
        <div
          className="flex flex-col items-center text-center"
          style={{ gap: "30px", marginBottom: "30px" }}
        >
          {/* Heading */}
          <h4
            className="text-[24px] leading-[34px]"
            style={{
              color: "#ffffff",
              fontWeight: 400,
              margin: 0,
              fontFamily: "Gotham, sans-serif",
            }}
          >
            {headingNormal}
            <strong style={{ fontWeight: 700 }}>{headingBold}</strong>
          </h4>

          {/* Tab buttons */}
          <div
            ref={tabsScrollRef}
            className="flex overflow-x-auto hide-scrollbar"
            style={{ gap: "8px", maxWidth: "100%" }}
          >
            {tabs.map((tab, idx) => (
              <button
                key={tab.name}
                type="button"
                onClick={() => handleTabClick(idx)}
                className="flex-shrink-0 cursor-pointer text-[16px]"
                style={{
                  color: "#ffffff",
                  backgroundColor: "transparent",
                  border:
                    idx === activeTabIndex
                      ? "1px solid rgb(128, 128, 128)"
                      : "1px solid transparent",
                  borderRadius: idx === activeTabIndex ? "4px" : "0px",
                  padding: "4px 8px",
                  fontFamily: "Gotham, sans-serif",
                  fontWeight: 500,
                  transition: "all 0.4s 0.1s",
                  whiteSpace: "nowrap",
                }}
                aria-pressed={idx === activeTabIndex}
              >
                {tab.name}
              </button>
            ))}
          </div>
        </div>

        {/* Carousel area */}
        <div className="relative">
          {/* Prev button */}
          <button
            type="button"
            onClick={goPrev}
            disabled={!canGoPrev}
            className="absolute left-[-12px] top-[50%] z-[3] hidden lg:flex items-center justify-center cursor-pointer"
            style={{
              transform: "translateY(-50%)",
              width: "40px",
              height: "40px",
              borderRadius: "9999px",
              backgroundColor: canGoPrev
                ? "rgba(255,255,255,0.9)"
                : "rgba(255,255,255,0.3)",
              border: "none",
              color: canGoPrev ? "#1d1d1d" : "#999999",
              transition: "all 0.2s",
            }}
            aria-label="Previous products"
          >
            <ChevronLeftIcon />
          </button>

          {/* Next button */}
          <button
            type="button"
            onClick={goNext}
            disabled={!canGoNext}
            className="absolute right-[-12px] top-[50%] z-[3] hidden lg:flex items-center justify-center cursor-pointer"
            style={{
              transform: "translateY(-50%)",
              width: "40px",
              height: "40px",
              borderRadius: "9999px",
              backgroundColor: canGoNext
                ? "rgba(255,255,255,0.9)"
                : "rgba(255,255,255,0.3)",
              border: "none",
              color: canGoNext ? "#1d1d1d" : "#999999",
              transition: "all 0.2s",
            }}
            aria-label="Next products"
          >
            <ChevronRightIcon />
          </button>

          {/* Viewport */}
          <div ref={viewportRef} className="overflow-hidden">
            <div
              className="flex"
              style={{
                transform: `translateX(${translateX}%)`,
                transition: "transform 0.4s ease",
              }}
            >
              {products.map((product, idx) => (
                <div
                  key={`${activeTabIndex}-${idx}`}
                  className="hcb-slide flex-shrink-0"
                >
                  <DarkProductCard product={product} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* View all link */}
        {activeTab?.viewAllCount && activeTab.viewAllCount > 0 && (
          <div className="flex justify-center" style={{ marginTop: "30px" }}>
            <a
              href={`/collections/${activeTab.collectionHandle}`}
              className="inline-flex items-center gap-[8px] no-underline text-[14px]"
              style={{
                backgroundColor: "rgb(29, 29, 29)",
                color: "#ffffff",
                padding: "6px 55px",
                borderRadius: "4px",
                fontFamily: "Gotham, sans-serif",
                fontWeight: 400,
                transition: "all 0.2s",
              }}
            >
              <span>View all {activeTab.viewAllCount} products</span>
              <ArrowRightIcon />
            </a>
          </div>
        )}
      </div>
    </section>
  );
});
