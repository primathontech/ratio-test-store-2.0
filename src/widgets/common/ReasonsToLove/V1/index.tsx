"use client";

import React, { memo } from "react";
import Image from "next/image";
import { ReasonsToLoveProps } from "../types";
import { ProductMetadataKey } from "@/widgets/common/ProductDetail/types";

/* ------------------------------------------------------------------ */
/*  V1 — Reasons to Love                                              */
/*  Heading + full-width product marketing image                       */
/* ------------------------------------------------------------------ */

export const V1 = memo(function V1({
  data,
  settings,
  className,
}: ReasonsToLoveProps) {
  const product = data?.success ? data.data : null;

  const apiImage =
    product?.metadata?.[ProductMetadataKey.REASONS_TO_LOVE_IMAGE]?.value;

  // Hide widget when no image is available from API or settings
  if (
    !(Array.isArray(apiImage) && apiImage.length > 0) &&
    !settings?.imageSrc
  ) {
    return null;
  }

  const heading = settings?.heading || "Reasons to Love";
  const imageSrc =
    Array.isArray(apiImage) && apiImage.length > 0
      ? String(apiImage[0])
      : (settings?.imageSrc ?? "");
  const imageAlt = settings?.imageAlt || "Reasons to love";
  const imageWidth = settings?.imageWidth || 970;
  const imageHeight = settings?.imageHeight || 4800;

  return (
    <section className={className}>
      {/* Container — max-width 1400px, centered, responsive padding */}
      <div className="mx-auto" style={{ maxWidth: "1400px" }}>
        <div
          className={[
            "pt-[24px] pb-[24px] px-[15px]",
            "md:pt-[27px] md:pb-[27px] md:px-[30px]",
            "xl:pt-[32px] xl:pb-[32px] xl:px-[50px]",
          ].join(" ")}
        >
          {/* Heading wrapper — flex column, justify-center */}
          <div className="flex flex-col justify-center">
            <h3
              className={[
                "flex",
                "font-[Gotham,sans-serif]",
                "text-[16px] leading-[19px] font-[700]",
                "md:text-[24px] md:leading-[29px]",
                "text-[#1d1d1d]",
                "m-0 p-0",
              ].join(" ")}
            >
              <span>{heading}</span>
            </h3>
          </div>

          {/* Image wrapper — flex, justify-center, 30px top margin */}
          <div className="flex justify-center mt-[30px]">
            <Image
              src={imageSrc}
              alt={imageAlt}
              width={imageWidth}
              height={imageHeight}
              className="max-w-[100%] h-auto"
              loading="lazy"
              sizes="(max-width: 360px) 315px, (max-width: 768px) 693px, (max-width: 1024px) 949px, 1300px"
            />
          </div>
        </div>
      </div>
    </section>
  );
});
