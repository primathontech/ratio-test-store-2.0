"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useCartStore } from "@shopkit/cart";

import type {
  VideoAppProductData,
  VideoAppProductResponse,
  VideoAppProps,
} from "../types";

/* ------------------------------------------------------------------ */
/*  External Video-Widget SDK type contract                            */
/* ------------------------------------------------------------------ */

type VideoWidgetConfig = {
  containerId: string;
  merchantId?: string;
  platform?: "shopify" | "openstore";
  productId?: string;
  baseUrl?: string;
  descriptionKey?: string;
  destinationUrl?: string;
  storefrontDestinationUrl?: string;
  layout?: "grid" | "carousel" | "slider" | "stories";
  itemsPerRow?: number;
  autoplay?: boolean;
  muteByDefault?: boolean;
  showVideoControls?: boolean;
  enableCtaButton?: boolean;
  buttonText?: string;
  ctaButtonTextColor?: string;
  ctaButtonBackgroundColor?: string;
  header?: {
    name?: string;
    fontSize?: string;
    fontWeight?: string;
    color?: string;
  };
};

type VideoWidgetConstructor = new (config: VideoWidgetConfig) => void;
type VideoWidgetWindow = Window & { VideoWidget?: VideoWidgetConstructor };

type VideoWidgetAddToCartDetail = {
  productId?: string | number;
  variantId?: string | number;
  quantity?: number;
  done?: (result: { ok: boolean; error?: string }) => void;
  item?: {
    id?: string | number;
    productId?: string | number;
    firstVariantId?: string | number;
    handle?: string;
  };
};

/**
 * Type guard for the envelope shape `{ success, data: {...product}, ... }`
 * the data-aggregator emits. Mirrors FBT's guard so both widgets handle
 * the same payload shape consistently.
 */
const isProductResponse = (
  input: NonNullable<VideoAppProps["data"]>
): input is VideoAppProductResponse =>
  "data" in input || "success" in input || "message" in input;

/* ------------------------------------------------------------------ */
/*  SDK loader — single-shot script injection w/ promise dedup         */
/* ------------------------------------------------------------------ */

const SDK_SCRIPT_ATTR = "data-video-widget-sdk";
let sdkPromise: Promise<void> | null = null;

const loadSDK = (url?: string) => {
  if (typeof window === "undefined") {
    return Promise.reject(
      new Error("Video widget SDK can only load in browser")
    );
  }
  if ((window as VideoWidgetWindow).VideoWidget) {
    return Promise.resolve();
  }
  if (!url) {
    return Promise.reject(new Error("Video widget SDK URL missing"));
  }
  if (sdkPromise) {
    return sdkPromise;
  }

  sdkPromise = new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      `script[${SDK_SCRIPT_ATTR}="true"]`
    );
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () =>
        reject(new Error("Video widget SDK script failed to load"))
      );
      return;
    }

    // eslint-disable-next-line no-restricted-syntax
    const script = document.createElement("script");
    script.src = url;
    script.async = true;
    // The Ratio SDK ships the widget as an ES module (served under /video/sdk/),
    // so it must load as type="module"; the legacy UMD SDK loads as a classic
    // script. Both set window.VideoWidget synchronously on execution.
    if (url && /\/video\/sdk\/|video-widget\.js/.test(url)) {
      script.type = "module";
    }
    script.setAttribute(SDK_SCRIPT_ATTR, "true");
    script.onload = () => resolve();
    script.onerror = () =>
      reject(new Error("Video widget SDK script failed to load"));
    document.head.appendChild(script);
  }).catch((error) => {
    sdkPromise = null;
    throw error;
  });

  return sdkPromise;
};

/* ------------------------------------------------------------------ */
/*  Main V1                                                             */
/* ------------------------------------------------------------------ */

export const V1: React.FC<VideoAppProps> = ({ data, settings }) => {
  const sdkUrl =
    process.env.NEXT_PUBLIC_VIDEO_APP_SDK_URL ||
    process.env.NEXT_PUBLIC_SDK_URL ||
    "/video-app/widget-sdk.js";
  const apiBaseUrl = process.env.NEXT_PUBLIC_VIDEO_APP_API_BASE_URL;
  const descriptionKey = process.env.NEXT_PUBLIC_VIDEO_APP_DESCRIPTION_KEY;
  const merchantId =
    process.env.NEXT_PUBLIC_VIDEO_APP_MERCHANT_ID ||
    process.env.NEXT_PUBLIC_MERCHANT_ID ||
    process.env.NEXT_PUBLIC_MERCHANT_ID_SDK;
  const platform =
    process.env.NEXT_PUBLIC_PLATFORM === "shopify" ? "shopify" : "openstore";

  const [sdkLoading, setSdkLoading] = useState(true);
  const [hasContent, setHasContent] = useState<boolean | null>(null);
  const sectionRef = useRef<HTMLElement | null>(null);
  const addItems = useCartStore((s) => s.addItems);

  /**
   * Resolve product id (or "homepage" sentinel for the home rail).
   *
   * Envelope shape this matches (from data-aggregator + productData):
   *   { success: true, data: { id: "7623090045003", ... }, ... }
   *   → productId = "7623090045003"
   *
   * On home / when the envelope reports failure → "homepage", which
   * tells the SDK to fall back to its featured/global feed.
   */
  const productId = useMemo(() => {
    let id: string | number | undefined;
    if (data) {
      if (isProductResponse(data)) {
        if (data.success !== false) {
          id = data.data?.id;
        }
      } else {
        id = (data as VideoAppProductData).id;
      }
    }
    return id || "homepage";
  }, [data]);

  const containerId = "video-app-container";

  /* ── Boot the SDK after a 1s delay so it doesn't compete with FCP ── */
  useEffect(() => {
    if (!productId || !merchantId) {
      setSdkLoading(false);
      setHasContent(false);
      return;
    }

    let alive = true;
    setSdkLoading(true);
    setHasContent(null);

    const timeoutId = setTimeout(() => {
      loadSDK(sdkUrl)
        .then(() => {
          if (!alive) {
            return;
          }
          const VideoWidget = (window as VideoWidgetWindow).VideoWidget;
          if (!VideoWidget) {
            console.error("VideoWidget missing on window");
            setSdkLoading(false);
            return;
          }

          const config: VideoWidgetConfig = {
            containerId,
            merchantId,
            platform,
            productId: String(productId),
            storefrontDestinationUrl: "/products",
          };
          if (apiBaseUrl) {
            config.baseUrl = apiBaseUrl;
            // Ratio SDK reads `apiBaseUrl`; legacy reads `baseUrl`. Set both.
            (config as { apiBaseUrl?: string }).apiBaseUrl = apiBaseUrl;
          }
          // The Ratio SDK treats any truthy productId as product mode, but our
          // homepage sentinel is the string "homepage"; pass an explicit mode so
          // it fetches homepage widgets there (legacy SDK ignores `mode`).
          (config as { mode?: string }).mode =
            productId === "homepage" ? "homepage" : "product";
          if (descriptionKey) {
            config.descriptionKey = descriptionKey;
          }
          if (settings?.title) {
            config.header = { name: settings.title };
          }
          if (settings?.layout) {
            config.layout = settings.layout;
          }
          if (typeof settings?.itemsPerRow === "number") {
            config.itemsPerRow = settings.itemsPerRow;
          }
          if (typeof settings?.autoplay === "boolean") {
            config.autoplay = settings.autoplay;
          }
          if (typeof settings?.muteByDefault === "boolean") {
            config.muteByDefault = settings.muteByDefault;
          }
          if (typeof settings?.showVideoControls === "boolean") {
            config.showVideoControls = settings.showVideoControls;
          }
          if (typeof settings?.enableCtaButton === "boolean") {
            config.enableCtaButton = settings.enableCtaButton;
          }
          if (settings?.buttonText) {
            config.buttonText = settings.buttonText;
          }
          if (settings?.ctaButtonTextColor) {
            config.ctaButtonTextColor = settings.ctaButtonTextColor;
          }
          if (settings?.ctaButtonBackgroundColor) {
            config.ctaButtonBackgroundColor = settings.ctaButtonBackgroundColor;
          }
          config.destinationUrl = settings?.destinationUrl || "/products";

          // eslint-disable-next-line no-new
          new VideoWidget(config);
        })
        .catch((error) => {
          console.error(error);
          if (alive) {
            setSdkLoading(false);
          }
        });
    }, 1000);

    return () => {
      alive = false;
      clearTimeout(timeoutId);
      const container = document.getElementById(containerId);
      if (container) {
        container.innerHTML = "";
        container.style.removeProperty("display");
      }
    };
  }, [
    apiBaseUrl,
    containerId,
    descriptionKey,
    merchantId,
    platform,
    productId,
    sdkUrl,
    settings?.autoplay,
    settings?.buttonText,
    settings?.ctaButtonBackgroundColor,
    settings?.ctaButtonTextColor,
    settings?.destinationUrl,
    settings?.enableCtaButton,
    settings?.itemsPerRow,
    settings?.layout,
    settings?.muteByDefault,
    settings?.showVideoControls,
    settings?.title,
  ]);

  /* ── Watch container for child nodes — hide skeleton once content paints,
        and collapse the entire section when SDK reports no videos.       ── */
  useEffect(() => {
    const el = document.getElementById(containerId);
    if (!el) {
      return;
    }
    if (!sectionRef.current) {
      sectionRef.current = el.closest("section");
    }
    const check = () => {
      const hasChildren = el.childElementCount > 0;
      const hiddenByWidget = el.style.display === "none";
      if (hasChildren || hiddenByWidget) {
        setSdkLoading(false);
        setHasContent(hasChildren && !hiddenByWidget);
      }
    };
    check();
    // eslint-disable-next-line no-restricted-syntax
    const obs = new MutationObserver(check);
    obs.observe(el, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["style"],
    });
    return () => obs.disconnect();
  }, [containerId, productId]);

  /* ── Add-to-cart bridge: SDK emits, we forward to @shopkit/cart ── */
  useEffect(() => {
    const handleAddToCart = async (event: Event) => {
      const detail = (event as CustomEvent<VideoWidgetAddToCartDetail>).detail;
      if (!detail) {
        return;
      }
      (event as CustomEvent).preventDefault();

      const productId =
        detail.productId ?? detail.item?.productId ?? detail.item?.id;
      if (!productId) {
        detail.done?.({ ok: false, error: "missing_product_id" });
        return;
      }

      const variantId =
        detail.variantId ?? detail.item?.firstVariantId ?? productId;
      const quantity = detail.quantity ?? 1;

      try {
        await addItems([
          {
            productId: String(productId),
            variantId: String(variantId),
            quantity,
          },
        ]);
        detail.done?.({ ok: true });
      } catch (error) {
        console.error("VideoWidget add to cart failed", error);
        detail.done?.({ ok: false, error: String(error) });
      }
    };

    // eslint-disable-next-line no-restricted-syntax
    window.addEventListener(
      "video-widget:add-to-cart",
      handleAddToCart as EventListener
    );
    return () => {
      window.removeEventListener(
        "video-widget:add-to-cart",
        handleAddToCart as EventListener
      );
    };
  }, [addItems]);

  /* ── Description-key injection for SDK metadata event ── */
  useEffect(() => {
    const handleVideoMetadata = (event: Event) => {
      const detail = (event as CustomEvent<{ description?: string }>).detail;
      if (!detail) {
        return;
      }
      if (descriptionKey) {
        detail.description = descriptionKey;
      }
    };
    // eslint-disable-next-line no-restricted-syntax
    window.addEventListener(
      "video-widget:videoMetadata",
      handleVideoMetadata as EventListener
    );
    return () => {
      window.removeEventListener(
        "video-widget:videoMetadata",
        handleVideoMetadata as EventListener
      );
    };
  }, [descriptionKey]);

  /* ── Collapse parent <section> when SDK reports no content ── */
  useEffect(() => {
    const container = document.getElementById(containerId);
    const sectionEl = sectionRef.current ?? container?.closest("section");
    if (!sectionEl) {
      return;
    }
    if (hasContent === false) {
      sectionEl.style.display = "none";
    } else {
      sectionEl.style.removeProperty("display");
    }
  }, [containerId, hasContent]);

  return (
    <div data-testid="video-app-wrapper" className="max-w-[1400px] mx-auto">
      <div
        data-testid="video-app-container"
        id={containerId}
        className={sdkLoading ? "hidden" : ""}
      />
    </div>
  );
};
