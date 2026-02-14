"use client";

import { Flex } from "@/ui/atomic";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export const GetApp = ({ data }: any) => {
  if (!data) {
    return null;
  }

  return (
    <div
      data-testid="get-app-container"
      className="app-widget bg-[#1d1d1d] px-4 py-3 flex items-center"
    >
      <Link
        data-testid="get-app-link"
        href={data?.app_url || "#"}
        className="app-widget-inner w-full flex items-center justify-between no-underline text-white hover:text-white"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Flex align="center" className="gap-3">
          {/* App Logo */}
          <div
            data-testid="get-app-logo-wrapper"
            className="rounded-lg overflow-hidden shrink-0"
          >
            <Image
              src={data?.logo_url}
              alt={data?.logo_alt || "App Logo"}
              width={40}
              height={40}
              className="object-contain"
            />
          </div>

          {/* App Widget Header */}
          <div data-testid="get-app-text-wrapper" className="flex flex-col">
            <h2 className="text-sm font-bold text-white leading-tight">
              {data?.title}
            </h2>
            <p className="text-xs text-gray-300 leading-tight">
              {data?.description}
            </p>
          </div>
        </Flex>

        {/* App Widget Button */}
        <span
          data-testid="get-app-button-text"
          className="app-widget-button h-[32px] px-4 text-xs font-semibold rounded-md border border-white text-white flex items-center justify-center whitespace-nowrap shrink-0"
        >
          {data?.button_text}
        </span>
      </Link>
    </div>
  );
};

export default GetApp;
