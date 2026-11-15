"use client";

import Script from "next/script";
import {
  CustomCheckoutService,
  notifyGokwikScriptReady,
} from "./CustomCheckoutService";
import { getGokwikScriptUrl } from "./config";

interface CheckoutScriptCustomProps {
  onLoaded?: () => void;
}

export default function CheckoutScriptCustom({
  onLoaded,
}: CheckoutScriptCustomProps) {
  // The root layout's <Script> starts this download. Instances that join an
  // in-flight load get onLoad (never onError) even if it failed, so check.
  const onLoad = () => {
    if (!CustomCheckoutService.isGokwikAvailable()) {
      console.error("GoKwik script failed to load");
    }
    notifyGokwikScriptReady();
  };

  const onReady = () => {
    notifyGokwikScriptReady();
    if (onLoaded) {
      onLoaded();
    }
  };

  return (
    <Script
      id="gokwik-merchant-integration"
      src={getGokwikScriptUrl()}
      strategy="afterInteractive"
      // next/script skips onReady when another <Script> with this id started the load first; onLoad still fires.
      onLoad={onLoad}
      onReady={onReady}
      onError={(error) => console.error("GoKwik script failed to load", error)}
    />
  );
}
