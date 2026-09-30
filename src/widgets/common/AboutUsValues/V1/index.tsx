"use client";

import React, { memo } from "react";
import Image from "next/image";
import { AboutUsValuesProps } from "../types";

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
  const items = settings?.items || [];
  const headingColor = settings?.headingColor || "#1d1d1d";
  const bodyColor = settings?.bodyColor || "#4a4a4a";

  return (
    <section className={className || ""}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-[30px] p-[30px] text-center">
        {items.map((item, index) => (
          <div key={index} className="p-5">
            {/* Icon */}
            <Image
              src={item.iconSrc}
              alt={item.alt || item.iconAlt || ""}
              width={109}
              height={126}
              className="mx-auto block max-w-full"
            />

            {/* Heading */}
            <div
              className="mt-[15px] text-center text-[22px] font-bold leading-[35px]"
              style={{ color: headingColor }}
            >
              {item.heading}
            </div>

            {/* Body text */}
            <div
              className="mt-2.5 mb-[30px] px-[15px] lg:px-[30px] text-center text-base lg:text-lg leading-[26px] lg:leading-[29px] font-normal"
              style={{ color: bodyColor }}
            >
              {item.body}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
});
