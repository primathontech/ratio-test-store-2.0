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
/*  Tile component                                                     */
/* ------------------------------------------------------------------ */

const Tile = ({ tile }: { tile: ConcernTile }) => {
  const content = (
    <div className="relative w-full" style={{ aspectRatio: "245 / 282" }}>
      <Image
        src={tile.image}
        alt={tile.alt || tile.label}
        fill
        loading="lazy"
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
  const tiles = settings?.tiles ?? [];
  const heading = settings?.heading ?? "Shop by <strong>Concerns</strong>";

  const containerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [maxIndex, setMaxIndex] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  /* Calculate how many slides we can advance based on viewport.
   * Must mirror the .sbc-slide CSS breakpoints in globals.css. */
  const getVisibleCount = useCallback(() => {
    if (typeof window === "undefined") {
      return 5;
    }
    const w = window.innerWidth;
    if (w < 1024) {
      return 2;
    }
    if (w < 1440) {
      return 4;
    }
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
    const visible = getVisibleCount();
    setCurrentIndex((prev) => Math.max(0, prev - visible));
  }, [getVisibleCount]);

  const goNext = useCallback(() => {
    const visible = getVisibleCount();
    setCurrentIndex((prev) => Math.min(maxIndex, prev + visible));
  }, [maxIndex, getVisibleCount]);

  /* Calculate translateX by measuring the actual rendered first tile + the
   * real gap from the flex track. This avoids drift between JS assumptions
   * and the CSS in globals.css (.sbc-slide widths + responsive flex gap). */
  const getTranslateX = () => {
    if (!containerRef.current || currentIndex === 0) {
      return "0px";
    }
    const track = containerRef.current.firstElementChild as HTMLElement | null;
    const firstTile = track?.firstElementChild as HTMLElement | null;
    if (!track || !firstTile) {
      return "0px";
    }
    const tileWidth = firstTile.offsetWidth;
    const gap = parseFloat(getComputedStyle(track).columnGap || "0") || 0;
    return `-${currentIndex * (tileWidth + gap)}px`;
  };

  return (
    <section
      className="relative bg-secondary max-w-[1400px] mx-auto overflow-hidden mt-[25px] md:mt-14"
      aria-label="Shop by Concerns"
    >
      {/* Section Heading */}
      <h3
        className="text-start md:text-center mb-4 md:mb-[30px] px-4 text-[20px] min-[375px]:text-[22px] md:text-[24px] lg:text-[28px] leading-[24px] min-[375px]:leading-[26.4px] md:leading-[28.8px] lg:leading-[33.6px]"
        style={{
          fontWeight: 400,
          color: "#1D1D1D",
        }}
        // eslint-disable-next-line no-restricted-syntax
        dangerouslySetInnerHTML={{ __html: heading }}
      />

      {/* Carousel wrapper */}
      <div className="flex items-center pl-[14px] xl:pl-5 pr-0 xl:pr-[3px]">
        {/* Prev button — desktop only */}
        <button
          onClick={goPrev}
          disabled={!canGoPrev}
          aria-label="Previous"
          className="hidden md:flex flex-shrink-0 w-10 xl:w-[46px] h-10 xl:h-[46px] items-center justify-center text-primary"
        >
          <span
            className="inline-flex transition-opacity duration-300"
            style={{ opacity: canGoPrev ? 1 : 0.4 }}
          >
            <PrevArrow />
          </span>
        </button>

        {/* Slider viewport — native scroll on mobile, button-driven on desktop */}
        <div
          className="flex-1 min-w-0 overflow-x-auto md:overflow-hidden snap-x snap-mandatory md:snap-none scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          ref={containerRef}
        >
          <div
            className="flex gap-2 lg:gap-[15px] md:transition-transform md:duration-[400ms] md:ease-in-out"
            style={
              isDesktop
                ? { transform: `translateX(${getTranslateX()})` }
                : undefined
            }
          >
            {tiles.map((tile, i) => (
              <div
                key={i}
                className="sbc-slide flex-shrink-0 snap-start md:snap-align-none first:ml-[14px] last:mr-[14px] md:first:ml-0 md:last:mr-0"
                role="group"
                aria-label={`${i + 1} of ${tiles.length}`}
              >
                <Tile tile={tile} />
              </div>
            ))}
          </div>
        </div>

        {/* Next button — desktop only */}
        <button
          onClick={goNext}
          disabled={!canGoNext}
          aria-label="Next"
          className="hidden md:flex flex-shrink-0 w-10 xl:w-[46px] h-10 xl:h-[46px] items-center justify-center text-primary"
        >
          <span
            className="inline-flex transition-opacity duration-300"
            style={{ opacity: canGoNext ? 1 : 0.4 }}
          >
            <NextArrow />
          </span>
        </button>
      </div>
    </section>
  );
});
