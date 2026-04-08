"use client";

import React, { memo, useState, useRef, useCallback, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShopByConcernsProps, ConcernTile } from "../types";

/* ------------------------------------------------------------------ */
/*  Arrow SVG icons (prev / next)                                      */
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

const DEFAULT_TILES: ConcernTile[] = [
  {
    label: "Hair fall fighters",
    href: "/collections/hairfall",
    image: "/ShopByConcerns/images/hair-fall-fighters.png",
  },
  {
    label: "Frizz fixers",
    href: "/collections/dry-hair",
    image: "/ShopByConcerns/images/frizz-fixers.png",
  },
  {
    label: "Damage repair",
    href: "/collections/damaged-hair",
    image: "/ShopByConcerns/images/damage-repair.png",
  },
  {
    label: "Smooth hair essentials",
    href: "/collections/advanced-smoothening",
    image: "/ShopByConcerns/images/smooth-hair-essentials.png",
  },
  {
    label: "Dandruff defence",
    href: "/collections/anti-dandruff",
    image: "/ShopByConcerns/images/dandruff-defence.png",
  },
  {
    label: "Curl care crew",
    href: null,
    image: "/ShopByConcerns/images/curl-care-crew.png",
  },
  {
    label: "Shine boosters",
    href: null,
    image: "/ShopByConcerns/images/shine-boosters.png",
  },
  {
    label: "Scalp saviours",
    href: null,
    image: "/ShopByConcerns/images/scalp-saviours.png",
  },
];

/* ------------------------------------------------------------------ */
/*  Tile component                                                     */
/* ------------------------------------------------------------------ */

const Tile = ({ tile }: { tile: ConcernTile }) => {
  const content = (
    <div className="relative w-full" style={{ aspectRatio: "245 / 282" }}>
      <Image
        src={tile.image}
        alt={tile.label}
        fill
        sizes="(max-width: 767px) 42vw, (max-width: 1023px) 30vw, (max-width: 1439px) 23vw, 245px"
        className="object-cover"
      />
    </div>
  );

  if (tile.href) {
    return (
      <Link href={tile.href} className="block" aria-label={tile.label}>
        {content}
      </Link>
    );
  }

  return <div>{content}</div>;
};

/* ------------------------------------------------------------------ */
/*  Main V1 component                                                  */
/* ------------------------------------------------------------------ */

export const V1 = memo(function V1({ settings }: ShopByConcernsProps) {
  const tiles = settings?.tiles ?? DEFAULT_TILES;
  const headingNormal = settings?.headingNormal ?? "Shop by ";
  const headingBold = settings?.headingBold ?? "Concerns";

  const containerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [maxIndex, setMaxIndex] = useState(0);

  /* Calculate how many slides we can advance based on viewport */
  const getVisibleCount = useCallback(() => {
    if (typeof window === "undefined") return 5;
    const w = window.innerWidth;
    if (w < 768) return 2;
    if (w < 1024) return 3;
    if (w < 1440) return 4;
    return 5;
  }, []);

  useEffect(() => {
    const update = () => {
      const visible = getVisibleCount();
      setMaxIndex(Math.max(0, tiles.length - visible));
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [tiles.length, getVisibleCount]);

  const canGoPrev = currentIndex > 0;
  const canGoNext = currentIndex < maxIndex;

  const goPrev = useCallback(() => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  }, []);

  const goNext = useCallback(() => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
  }, [maxIndex]);

  /* Calculate translateX based on currentIndex */
  /* Each tile width + gap, expressed as percentage of container */
  const getTranslateX = () => {
    if (!containerRef.current || currentIndex === 0) return "0px";
    const container = containerRef.current;
    const gap = 15; // 15px gap between tiles
    const containerWidth = container.offsetWidth;
    const visible = getVisibleCount();
    const tileWidth = (containerWidth - (visible - 1) * gap) / visible;
    return `-${currentIndex * (tileWidth + gap)}px`;
  };

  return (
    <section
      className="relative bg-[#ffffff] py-[50px] overflow-hidden"
      aria-label="Shop by Concerns"
    >
      {/* Section Heading */}
      <h3
        className="text-center mb-[30px] px-[16px]"
        style={{
          fontFamily: "Gotham, sans-serif",
          fontSize: "22px",
          lineHeight: "34px",
          fontWeight: 400,
          color: "#1D1D1D",
        }}
      >
        {headingNormal}
        <strong style={{ fontWeight: 700 }}>{headingBold}</strong>
      </h3>

      {/* Carousel wrapper */}
      <div className="relative px-[50px] md:px-[60px]">
        {/* Prev button — hidden on mobile */}
        <button
          onClick={goPrev}
          disabled={!canGoPrev}
          aria-label="Previous"
          className="hidden md:flex absolute left-[4px] top-[50%] -translate-y-[50%] z-[2] w-[46px] h-[46px] items-center justify-center rounded-[9999px] border border-[#1D1D1D] bg-[#ffffff] text-[#1D1D1D] transition-opacity duration-300"
          style={{ opacity: canGoPrev ? 1 : 0.4 }}
        >
          <PrevArrow />
        </button>

        {/* Slider viewport */}
        <div className="overflow-hidden" ref={containerRef}>
          <div
            className="flex gap-[15px] transition-transform duration-[400ms] ease-in-out"
            style={{ transform: `translateX(${getTranslateX()})` }}
          >
            {tiles.map((tile, i) => (
              <div
                key={i}
                className="sbc-slide flex-shrink-0"
                role="group"
                aria-label={`${i + 1} of ${tiles.length}`}
              >
                <Tile tile={tile} />
              </div>
            ))}
          </div>
        </div>

        {/* Next button — hidden on mobile */}
        <button
          onClick={goNext}
          disabled={!canGoNext}
          aria-label="Next"
          className="hidden md:flex absolute right-[4px] top-[50%] -translate-y-[50%] z-[2] w-[46px] h-[46px] items-center justify-center rounded-[9999px] border border-[#1D1D1D] bg-[#ffffff] text-[#1D1D1D] transition-opacity duration-300"
          style={{ opacity: canGoNext ? 1 : 0.4 }}
        >
          <NextArrow />
        </button>
      </div>
    </section>
  );
});
