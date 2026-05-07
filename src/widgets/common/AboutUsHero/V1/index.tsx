"use client";

import React, { memo } from "react";
import Image from "next/image";
import Link from "next/link";
import { AboutUsHeroProps } from "../types";

/* ------------------------------------------------------------------ */
/*  V1 -- AboutUsHero                                                  */
/*  Full-width clickable banner image for the About Us page.           */
/*  Single responsive image that scales fluidly with container width.  */
/*  Natural size 1522x476 (~3.2:1 aspect ratio).                      */
/* ------------------------------------------------------------------ */

export const V1 = memo(function AboutUsHeroV1({
  settings,
  className,
}: AboutUsHeroProps) {
  const imageSrc =
    settings?.imageSrc ||
    "https://cdn.shopify.com/s/files/1/0616/4994/4654/files/About-us.jpg?v=1729494426";
  const imageAlt = settings?.imageAlt || "About Us Banner";
  const href = settings?.href || "/products";
  const imageWidth = settings?.imageWidth || 1522;
  const imageHeight = settings?.imageHeight || 476;

  return (
    <section className={className || ""}>
      <Link href={href} className="block">
        <Image
          src={imageSrc}
          alt={imageAlt}
          width={imageWidth}
          height={imageHeight}
          priority
          className="w-full h-auto block"
          sizes="100vw"
        />
      </Link>
    </section>
  );
});
