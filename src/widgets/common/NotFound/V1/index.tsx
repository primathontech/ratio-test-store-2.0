"use client";

import React, { memo } from "react";
import Link from "next/link";
import { NotFoundProps } from "../types";

export const V1 = memo(function NotFoundV1({
  settings,
  className,
}: NotFoundProps) {
  const errorCode = settings?.errorCode || "404";
  const heading = settings?.heading || "Oops...That link is broken.";
  const description =
    settings?.description ||
    "Sorry for the inconvenience. Go to our homepage to check out our latest collections.";
  const buttonText = settings?.buttonText || "Shop now";
  const buttonHref = settings?.buttonHref || "/collections/all";

  return (
    <main
      className={`flex-1 w-full flex justify-center px-[15px] pb-14 md:pb-[63px] xl:pb-[75px] pt-[75px] md:pt-[85px] xl:pt-[100px] min-h-[660px] md:min-h-[550px] ${className || ""}`}
    >
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-[24px] md:text-[40px] xl:text-[120px] font-normal text-black tracking-tight mb-[35px] md:mb-[50px] xl:mb-[72px] mt-1">
          {errorCode}
        </h1>
        <h2 className="text-[22px] md:text-[28px] xl:text-[32px] font-normal text-black">
          {heading}
        </h2>
        <p className="mt-2 md:mt-3 text-[14px] text-[#545454]">{description}</p>
        <Link
          href={buttonHref}
          className="inline-flex items-center justify-center mt-4 md:mt-[22px] xl:mt-[38px] px-6 py-[12.5px] rounded-[10px] bg-black text-white font-normal transition-colors text-[14px]"
        >
          {buttonText}
        </Link>
      </div>
    </main>
  );
});
