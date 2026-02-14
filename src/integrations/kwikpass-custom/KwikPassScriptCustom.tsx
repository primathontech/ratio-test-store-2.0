"use client";

import Script from "next/script";
import { getKwikPassConfig } from "./config";

// Get KwikPass configuration from environment
const config = getKwikPassConfig();

// Extend Window interface to include merchantInfo and kpUpdateDOM
declare global {
  interface Window {
    kpUpdateDOM?: () => void;
  }
}

interface KwikPassScriptCustomProps {
  onLoad?: () => void;
}

export default function KwikPassScriptCustom({
  onLoad,
}: KwikPassScriptCustomProps) {
  const onReady = () => {
    // Initialize the KwikPass DOM
    if (
      typeof window !== "undefined" &&
      typeof window.kpUpdateDOM !== "undefined"
    ) {
      window.kpUpdateDOM();
    }
    // Call the onLoad callback once the script is ready
    if (onLoad) {
      onLoad();
    }
  };

  return (
    <>
      <Script id="kwikpass-init">
        {`
          window.merchantInfo = {
            ...window.merchantInfo,
            mid: "${config.merchantName}",
            environment: "${config.environment}",
            type: "${config.type}",
          };
        `}
      </Script>
      <Script
        id="non-shopify-core-functions"
        src={`${config.scriptUrl}/kwikpass/non-shopify-core-functions.min.js`}
      />
      <Script
        id="merchant-v2"
        src={`${config.scriptUrl}/kwikpass/plugin/build/kp-merchant-v2.js`}
        strategy="afterInteractive"
        onReady={onReady}
      />
    </>
  );
}
