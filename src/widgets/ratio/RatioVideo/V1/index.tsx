"use client";

import React, { useEffect } from "react";
import type { RatioVideoProps } from "../types";

const SDK_URL = process.env.NEXT_PUBLIC_VIDEO_APP_SDK_URL || "";
const MERCHANT_ID =
  process.env.NEXT_PUBLIC_VIDEO_APP_MERCHANT_ID ||
  process.env.NEXT_PUBLIC_MERCHANT_ID ||
  "";

const LOADER_ATTR = "data-ratio-video-loader";
const MOUNT_ID = "video-widget";

function loaderSrc(): string {
  if (!SDK_URL) {
    return "";
  }
  try {
    const url = new URL(SDK_URL, "https://placeholder.invalid");
    if (MERCHANT_ID) {
      url.searchParams.set("store", MERCHANT_ID);
    }
    return SDK_URL.startsWith("http")
      ? url.toString()
      : `${url.pathname}${url.search}`;
  } catch {
    return SDK_URL;
  }
}

function injectLoaderOnce(): void {
  if (typeof document === "undefined") {
    return;
  }
  const src = loaderSrc();
  if (!src || document.querySelector(`script[${LOADER_ATTR}="true"]`)) {
    return;
  }
  // eslint-disable-next-line no-restricted-syntax
  const script = document.createElement("script");
  script.src = src;
  script.async = true;
  script.setAttribute(LOADER_ATTR, "true");
  document.head.appendChild(script);
}

export const V1: React.FC<RatioVideoProps> = ({ className }) => {
  useEffect(() => {
    injectLoaderOnce();
  }, []);

  return <div id={MOUNT_ID} className={className} data-testid="ratio-video" />;
};

export { V1 as default };
