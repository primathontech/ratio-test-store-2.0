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
  const mosaicSrc =
    settings?.mosaicSrc || "/images/shine-academy/mosaic-collage.webp";
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
      className={["overflow-hidden", className || ""].join(" ")}
      style={{ backgroundColor }}
    >
      {/* Outer container -- max-width 1400px */}
      <div className="mx-auto max-w-[1400px]">
        {/* Inner newsletter container -- max-width 1300px centered */}
        <div className="mx-auto max-w-[1300px] flex flex-col">
          {/* ---- Text column: logo + tagline ---- */}
          <div
            className={[
              "sab-animate-on-scroll",
              "flex flex-col items-center justify-center",
              "px-[30px] py-[30px]",
              "md:px-[40px] md:py-[40px]",
              "st:px-[15px] st:py-[10px]",
            ].join(" ")}
          >
            {/* Shine Academy logo */}
            <div className="relative w-[220px] h-[113px] md:w-[280px] md:h-[144px] xl:w-[336px] xl:h-[173px]">
              <Image
                src={logoSrc}
                alt={logoAlt}
                fill
                className="object-contain"
                sizes="(min-width: 1440px) 336px, (min-width: 768px) 280px, 220px"
              />
            </div>

            {/* Tagline */}
            <p
              className={[
                "font-[Gotham,sans-serif]",
                "text-[18px] leading-[22px]",
                "md:text-[22px] md:leading-[24px]",
                "xl:text-[24px] xl:leading-[26px]",
                "font-[500]",
                "text-[#545454]",
                "text-center",
                "mt-[16px] md:mt-[20px] xl:mt-[26px]",
                "max-w-[700px]",
                "m-0",
              ].join(" ")}
            >
              {tagline}
            </p>
          </div>

          {/* ---- Image column: mosaic collage ---- */}
          <div
            className={["sab-animate-on-scroll", "flex items-center"].join(" ")}
          >
            <div
              className="relative w-full overflow-hidden"
              style={{ aspectRatio: "2.526" }}
            >
              <Image
                src={mosaicSrc}
                alt={mosaicAlt}
                fill
                className={[
                  "object-cover",
                  "rounded-tl-[20px] rounded-tr-[20px] rounded-bl-[0px] rounded-br-[0px]",
                  "md:rounded-tl-[20px] md:rounded-tr-[0px] md:rounded-bl-[20px] md:rounded-br-[0px]",
                ].join(" ")}
                sizes="(min-width: 1440px) 1300px, (min-width: 1024px) 960px, (min-width: 768px) 700px, calc(100vw - 30px)"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});
