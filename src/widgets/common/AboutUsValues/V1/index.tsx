"use client";

import React, { memo } from "react";
import Image from "next/image";
import { AboutUsValuesProps, AboutUsValuesItem } from "../types";

/* ------------------------------------------------------------------ */
/*  Default content items (from bblunt.com About Us page)              */
/* ------------------------------------------------------------------ */

const DEFAULT_ITEMS: AboutUsValuesItem[] = [
  {
    iconSrc: "/AboutUsValues/images/about-us-1.svg",
    iconAlt: "Designed for Indian Hair",
    iconWidth: 109,
    iconHeight: 126,
    heading: "Designed for Indian Hair",
    body: "Indian water, pollution, and the environment can be hard on hair. But we work harder to protect Indian hair.",
  },
  {
    iconSrc: "/AboutUsValues/images/about-us-2.svg",
    iconAlt: "Cruelty-free",
    iconWidth: 108,
    iconHeight: 116,
    heading: "Cruelty-free",
    body: "25 million+ animals are used for testing and research. Not a single one by us.",
  },
];

/* ------------------------------------------------------------------ */
/*  V1 -- AboutUsValues                                                */
/*  Two-column icon grid at desktop (>=1024px), single column mobile.  */
/*  Each item: centered SVG icon, bold heading, body text.             */
/*  Grid container: 30px padding, 20px gap mobile / 30px gap desktop.  */
/*  Heading: Gotham 700, 22px/35px, #1d1d1d, mt-15px.                 */
/*  Body: Gotham 400, 16px/26px mobile, 18px/29px desktop, #4a4a4a.   */
/* ------------------------------------------------------------------ */

export const V1 = memo(function AboutUsValuesV1({
  settings,
  className,
}: AboutUsValuesProps) {
  const items = settings?.items || DEFAULT_ITEMS;
  const headingColor = settings?.headingColor || "#1d1d1d";
  const bodyColor = settings?.bodyColor || "#4a4a4a";

  return (
    <section className={className || ""}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-[20px] lg:gap-[30px] p-[30px] text-center">
        {items.map((item, index) => (
          <div key={index} className="p-[20px]">
            {/* Icon */}
            <Image
              src={item.iconSrc}
              alt={item.iconAlt}
              width={item.iconWidth}
              height={item.iconHeight}
              className="mx-auto block max-w-full"
            />

            {/* Heading */}
            <div
              className="mt-[15px] text-center text-[22px] font-[700] leading-[35px]"
              style={{ color: headingColor, fontFamily: "Gotham, sans-serif" }}
            >
              {item.heading}
            </div>

            {/* Body text */}
            <div
              className="mt-[10px] mb-[30px] px-[15px] lg:px-[30px] text-center text-[16px] lg:text-[18px] leading-[26px] lg:leading-[29px] font-[400]"
              style={{ color: bodyColor, fontFamily: "Gotham, sans-serif" }}
            >
              {item.body}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
});
