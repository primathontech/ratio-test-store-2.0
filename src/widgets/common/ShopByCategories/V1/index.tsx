"use client";

import React, { memo, useRef, useState, useCallback, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShopByCategoriesProps, CategoryTile } from "../types";

/* ------------------------------------------------------------------ */
/*  Arrow SVG icons (prev / next) — visible only on tablet/mobile     */
/* ------------------------------------------------------------------ */

const PrevArrow = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="7"
    height="11"
    viewBox="0 0 7 11"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M5.5 11L0 5.5L5.5 0L6.47625 0.97625L1.9525 5.5L6.47625 10.0238L5.5 11Z"
      fill="currentColor"
    />
  </svg>
);

const NextArrow = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="7"
    height="11"
    viewBox="0 0 7 11"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M1.5 11L7 5.5L1.5 0L0.52375 0.97625L5.0475 5.5L0.52375 10.0238L1.5 11Z"
      fill="currentColor"
    />
  </svg>
);

/* ------------------------------------------------------------------ */
/*  Default tiles data                                                 */
/* ------------------------------------------------------------------ */

const DEFAULT_TILES: CategoryTile[] = [
  {
    label: "Shampoo",
    href: "/collections/shampoo",
    desktopImage: "/ShopByCategories/images/shampoo-desktop.png",
    mobileImage: "/ShopByCategories/images/shampoo-mobile.png",
  },
  {
    label: "Conditioner",
    href: "/collections/conditioner",
    desktopImage: "/ShopByCategories/images/conditioner-desktop.png",
    mobileImage: "/ShopByCategories/images/conditioner-mobile.png",
  },
  {
    label: "Hair spray",
    href: "/collections/sprays",
    desktopImage: "/ShopByCategories/images/hair-spray-desktop.png",
    mobileImage: "/ShopByCategories/images/hair-spray-mobile.png",
  },
  {
    label: "Hair colour",
    href: "/collections/hair-colour",
    desktopImage: "/ShopByCategories/images/hair-colour-desktop.png",
    mobileImage: "/ShopByCategories/images/hair-colour-mobile.png",
  },
  {
    label: "Hair serum",
    href: "/collections/serum",
    desktopImage: "/ShopByCategories/images/hair-serum-desktop.png",
    mobileImage: "/ShopByCategories/images/hair-serum-mobile.png",
  },
];

/* ------------------------------------------------------------------ */
/*  Main V1 component                                                  */
/* ------------------------------------------------------------------ */

export const V1 = memo(function V1({ settings }: ShopByCategoriesProps) {
  const tiles = settings?.tiles ?? DEFAULT_TILES;
  const headingNormal = settings?.headingNormal ?? "Shop by ";
  const headingBold = settings?.headingBold ?? "Categories";

  const viewportRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  /* Update scroll button visibility */
  const updateScrollButtons = useCallback(() => {
    const el = viewportRef.current;
    if (!el) {
      return;
    }
    setCanScrollLeft(el.scrollLeft > 2);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 2);
  }, []);

  useEffect(() => {
    const el = viewportRef.current;
    if (!el) {
      return;
    }
    updateScrollButtons();
    el.addEventListener("scroll", updateScrollButtons, { passive: true });
    window.addEventListener("resize", updateScrollButtons);
    return () => {
      el.removeEventListener("scroll", updateScrollButtons);
      window.removeEventListener("resize", updateScrollButtons);
    };
  }, [updateScrollButtons]);

  const scrollBy = useCallback(
    (direction: "prev" | "next") => {
      const el = viewportRef.current;
      if (!el) {
        return;
      }
      const slideWidth = el.scrollWidth / tiles.length;
      const amount = direction === "next" ? slideWidth : -slideWidth;
      el.scrollBy({ left: amount, behavior: "smooth" });
    },
    [tiles.length]
  );

  return (
    <section
      className="relative mt-[25px] md:mt-[56px]"
      aria-label="Shop by Categories"
    >
      {/* Section Heading */}
      <h3
        className="text-start md:text-center mb-[16px] px-[16px] lg:mb-[30px] text-[24px] lg:text-[28px]"
        style={{
          lineHeight: "34px",
          fontWeight: 400,
          color: "#1D1D1D",
        }}
      >
        {headingNormal}
        <strong style={{ fontWeight: 700 }}>{headingBold}</strong>
      </h3>

      {/* Carousel wrapper — relative for nav button positioning */}
      <div className="relative">
        {/* Prev button — visible only between 769px and 989px */}
        <button
          onClick={() => scrollBy("prev")}
          disabled={!canScrollLeft}
          aria-label="Previous"
          className="hidden min-[768px]:flex min-[990px]:hidden absolute left-[2px] lg:left-[5px] top-[50%] -translate-y-[50%] z-[2] w-[40px] h-[40px] items-center justify-center text-[#1D1D1D]"
        >
          <span
            className="inline-flex transition-opacity duration-300"
            style={{ opacity: canScrollLeft ? 1 : 0.4 }}
          >
            <PrevArrow />
          </span>
        </button>

        {/* Scrollable viewport */}
        <div
          ref={viewportRef}
          className="px-[10px] md:px-[30px] lg:px-[30px] xl:px-[70px] overflow-x-auto hide-scrollbar"
        >
          <div className="sbc-cat-container flex">
            {tiles.map((tile, i) => (
              <div
                key={i}
                className="sbc-cat-slide flex-shrink-0"
                role="group"
                aria-label={`${tile.label} — ${i + 1} of ${tiles.length}`}
              >
                <Link
                  href={tile.href}
                  className="sbc-cat-link block text-center no-underline"
                  style={{ color: "#000000", textDecoration: "none" }}
                >
                  {/* Desktop image (>=768px) */}
                  <div className="sbc-cat-img-desktop hidden md:flex justify-center items-center h-[120px]  pl-[4px] lg:pl-[15px]">
                    <Image
                      src={tile.desktopImage}
                      alt={tile.label}
                      width={400}
                      height={236}
                      className="h-[120px] w-auto object-contain"
                      loading="lazy"
                    />
                  </div>
                  {/* Mobile image (<768px) */}
                  <div className="sbc-cat-img-mobile flex justify-center md:hidden">
                    <Image
                      src={tile.mobileImage}
                      alt={tile.label}
                      width={228}
                      height={297}
                      className="w-full h-auto"
                      loading="lazy"
                    />
                  </div>
                  {/* Label — visible only on mobile (<768px) */}
                  <div
                    className="sbc-cat-label mt-[8px] md:hidden text-[14px]"
                    style={{
                      lineHeight: "19px",
                      fontWeight: 500,
                      color: "#000000",
                    }}
                  >
                    {tile.label}
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Next button — visible only between 769px and 989px */}
        <button
          onClick={() => scrollBy("next")}
          disabled={!canScrollRight}
          aria-label="Next"
          className="hidden min-[768px]:flex min-[990px]:hidden absolute right-[2px] lg:right-[5px] top-[50%] -translate-y-[50%] z-[2] w-[40px] h-[40px] items-center justify-center text-[#1D1D1D]"
        >
          <span
            className="inline-flex transition-opacity duration-300"
            style={{ opacity: canScrollRight ? 1 : 0.4 }}
          >
            <NextArrow />
          </span>
        </button>
      </div>
    </section>
  );
});
