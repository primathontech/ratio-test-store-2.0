"use client";

import Script from "next/script";
import { getKwikPassConfig } from "./config";

// Get KwikPass configuration from environment
const config = getKwikPassConfig();

interface KwikPassScriptShopifyProps {
  onLoad: () => void;
}

export default function KwikPassScriptShopify({
  onLoad,
}: KwikPassScriptShopifyProps) {
  return (
    <>
      <Script id="kwikpass-init">
        {`
        window.merchantInfo = {
          ...window.merchantInfo,
          mid: "${config.merchantName}",
          environment: "${config.environment}",
          type: "${config.type}",
          integrationType: 'CUSTOM_SHOPIFY'
        };
        `}
      </Script>
      <Script
        id="kwikpass-core"
        src={`${config.scriptUrl}/kwikpass/kwikpass-core-functions-min.js`}
      />
      <Script
        id="kwikpass-merchant"
        src={`${config.scriptUrl}/kwikpass/plugin/build/kp-merchant-v2.js`}
        strategy="afterInteractive"
        onLoad={onLoad}
      />
    </>
  );
}
