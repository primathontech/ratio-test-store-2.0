"use client";

import Script from "next/script";
import { getCheckoutConfig } from "./config";

// Get checkout configuration from environment
const config = getCheckoutConfig();

interface KwikCartCheckoutScriptProps {
  onLoaded?: () => void;
}

export default function KwikCartCheckoutScript({
  onLoaded,
}: KwikCartCheckoutScriptProps) {
  const onReady = () => {
    if (onLoaded) {
      onLoaded();
    }
  };

  return (
    <Script
      id="gokwik-merchant-integration"
      src={`${config.scriptUrl}/v4/build/gokwik.js`}
      strategy="afterInteractive"
      onReady={onReady}
    />
  );
}
