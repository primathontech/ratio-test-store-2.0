"use client";

import React, { memo, useEffect, useRef } from "react";
import Image from "next/image";
import { ShineAcademyBannerProps } from "../types";

/* ------------------------------------------------------------------ */
/*  V1 -- ShineAcademyBanner                                           */
/*  BBlunt Shine Academy brand story: logo + tagline + mosaic collage  */
/*  Single-column layout at all breakpoints, fade-in on scroll         */
/* ------------------------------------------------------------------ */

export const V1 = memo(function V1({
  settings,
  className,
}: ShineAcademyBannerProps) {
  const logoSrc =
    settings?.logoSrc || "/images/shine-academy/shine-academy-logo.webp";
  const logoAlt = settings?.logoAlt || "BBlunt Shine Academy";
  const tagline =
    settings?.tagline ||
    "Every time you buy from our website, you play a significant role in impacting a woman\u2019s life by empowering her to shine on.";
  const mosaicSrcDesktop =
    settings?.mosaicSrcDesktop ||
    settings?.mosaicSrc ||
    "/images/shine-academy/home-shine-academy-desktop.webp";
  const mosaicAlt =
    settings?.mosaicAlt ||
    "BBlunt Shine Academy - salon stylists and trainees collage";
  const backgroundColor = settings?.backgroundColor || "#E8F0F7";

  /* ---- Scroll fade-in animation ---- */
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) {
      /* Make everything visible immediately */
      const els = sectionRef.current?.querySelectorAll(
        ".sab-animate-on-scroll"
      );
      els?.forEach((el) => el.classList.add("sab-animate-in"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("sab-animate-in");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    const elements = sectionRef.current?.querySelectorAll(
      ".sab-animate-on-scroll"
    );
    elements?.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="overflow-hidden bg-gradient-to-b from-[#F7F0FF] to-white md:from-[#F3F9FF]"
    >
      {/* Outer container -- max-width 1400px */}
      <div className="mx-auto max-w-[1400px]">
        {/* Inner newsletter container -- max-width 1300px centered */}
        <div className="mx-auto max-w-[1300px] flex flex-col">
          {/* ---- Text column: logo + tagline ---- */}
          <div className="sab-animate-on-scroll flex flex-col items-center justify-center px-[15px] md:px-[40px]">
            {/* Shine Academy logo */}
            <div className="relative w-[175px] h-[89.5px] md:w-[336px] md:h-[172px] xl:w-[336px] xl:h-[172.7px]">
              <Image
                src={logoSrc}
                alt={logoAlt}
                fill
                className="object-contain"
                sizes="(min-width: 1440px) 336px, (min-width: 768px) 280px, 220px"
              />
            </div>

            {/* Tagline */}
            <p className="font-[Gotham,sans-serif] text-[12px] md:text-[24px] font-[500] text-[#545454] text-center mb-[18px] md:mb-0 mt-[18px] md:mt-[18px] max-w-[700px] m-0 leading-[13px] md:leading-[26.4px] px-[20px] md:px-0">
              {tagline}
            </p>
          </div>

          {/* ---- Image column: mosaic collage ---- */}
          <div className="sab-animate-on-scroll flex items-center">
            {/* Mobile image (uses desktop asset) */}
            <div className="relative w-full md:hidden px-[15px]">
              <div className="overflow-hidden rounded-tl-[20px] rounded-tr-[20px] rounded-bl-0 rounded-br-[20px]">
                <Image
                  src={mosaicSrcDesktop}
                  alt={mosaicAlt}
                  width={2000}
                  height={800}
                  className="object-cover w-full h-auto block"
                  sizes="calc(100vw - 30px)"
                  loading="lazy"
                />
              </div>
            </div>
            {/* Desktop image */}
            <div className="relative w-full overflow-hidden hidden md:block">
              <Image
                src={mosaicSrcDesktop}
                alt={mosaicAlt}
                width={2000}
                height={800}
                className="object-contain rounded-tl-[20px] rounded-tr-[20px] md:rounded-tl-[20px] rounded-br-[20px] md:rounded-bl-[20px] w-full h-auto px-[15px] md:px-0"
                sizes="(min-width: 1440px) 1300px, (min-width: 1024px) 960px, 700px"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});
