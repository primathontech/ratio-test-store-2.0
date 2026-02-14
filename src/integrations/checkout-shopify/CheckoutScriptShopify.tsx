"use client";

import Script from "next/script";
import { getCheckoutConfig } from "./config";

// Get checkout configuration from environment
const config = getCheckoutConfig();

interface CheckoutScriptShopifyProps {
  onLoaded?: () => void;
}

export default function CheckoutScriptShopify({
  onLoaded,
}: CheckoutScriptShopifyProps) {
  const onReady = () => {
    if (onLoaded) {
      onLoaded();
    }
  };

  return (
    <>
      <Script
        id="gokwik-merchant-integration"
        src={`${config.scriptUrl}/v4/build/gokwik.js`}
        strategy="afterInteractive"
        onReady={onReady}
      />
      <Script id="gokwik-merchant-info">
        {`
          window.merchantInfo = {
            mid: "${config.merchantName}",
            environment: "${config.environment}",
            type: "${config.type}",
            storeId: "${config.storeId || ""}",
            fbPixel: "${config.fbPixelId || ""}",
            integrationType: 'CUSTOM_SHOPIFY'
          };

          function triggerGokwikCheckout(cartId) {
            window.merchantInfo.cart = {id: cartId};
            // this function will be available after the script has loaded
            triggerGokwikCustomCheckout();
          }
        `}
      </Script>
    </>
  );
}
