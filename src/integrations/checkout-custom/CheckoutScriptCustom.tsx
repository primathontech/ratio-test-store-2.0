"use client";

import Script from "next/script";
import { getCheckoutConfig } from "./config";

// Get checkout configuration from environment
const config = getCheckoutConfig();

interface CheckoutScriptCustomProps {
  onLoaded?: () => void;
}

export default function CheckoutScriptCustom({
  onLoaded,
}: CheckoutScriptCustomProps) {
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
