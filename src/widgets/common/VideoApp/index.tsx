"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useCartStore } from "@shopkit/cart";

type ProductData = { id?: string | number };
type ProductResponse = { data?: ProductData };

type VideoAppSettings = {
  title?: string;
  layout?: "grid" | "carousel" | "slider" | "stories";
  itemsPerRow?: number;
  autoplay?: boolean;
  muteByDefault?: boolean;
  showVideoControls?: boolean;
  enableCtaButton?: boolean;
  buttonText?: string;
  ctaButtonTextColor?: string;
  ctaButtonBackgroundColor?: string;
  destinationUrl?: string;
};

type Props = {
  data?: ProductData | ProductResponse;
  settings?: VideoAppSettings;
};

type VideoWidgetConfig = {
  containerId: string;
  merchantId?: string;
  platform?: "shopify" | "openstore";
  productId?: string;
  baseUrl?: string;
  destinationUrl?: string;
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

const SDK_SCRIPT_ATTR = "data-video-widget-sdk";
let sdkPromise: Promise<void> | null = null;

const loadSDK = (url?: string) => {
  if (typeof window === "undefined") {
    return Promise.reject(
      new Error("Video widget SDK can only load in browser"),
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
      `script[${SDK_SCRIPT_ATTR}="true"]`,
    );

    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () =>
        reject(new Error("Video widget SDK script failed to load")),
      );
      return;
    }

    const script = document.createElement("script");
    script.src = url;
    script.async = true;
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

const VideoApp = ({ data, settings }: Props) => {
  const sdkUrl = process.env.NEXT_PUBLIC_VIDEO_APP_SDK_URL;
  const apiBaseUrl = process.env.NEXT_PUBLIC_VIDEO_APP_API_BASE_URL;
  const merchantId =
    process.env.NEXT_PUBLIC_VIDEO_APP_MERCHANT_ID ||
    process.env.NEXT_PUBLIC_MERCHANT_ID ||
    process.env.NEXT_PUBLIC_MERCHANT_ID_SDK;
  const platform =
    process.env.NEXT_PUBLIC_PLATFORM === "shopify" ? "shopify" : "openstore";

  const [sdkLoading, setSdkLoading] = useState(true);
  const [hasContent, setHasContent] = useState<boolean | null>(null);
  const sectionRef = useRef<HTMLElement | null>(null);
  const { addItems } = useCartStore();

  const productId = useMemo(() => {
    let id: string | number | undefined;

    if (data) {
      if ("data" in data) {
        id = data.data?.id;
      } else if ("id" in data) {
        // Handle case where data is ProductData directly
        id = (data as ProductData).id;
      }
    }

    return id || "homepage";
  }, [data]);

  const containerId = "video-app-container";

  useEffect(() => {
    if (!productId || !merchantId) {
      setSdkLoading(false);
      setHasContent(false);
      return;
    }

    let alive = true;
    setSdkLoading(true);
    setHasContent(null);

    // Delay SDK loading to not block initial page render
    const timeoutId = setTimeout(() => {
      loadSDK(sdkUrl)
        .then(() => {
          if (!alive) {
            return;
          }

          const VideoWidget = (window as VideoWidgetWindow).VideoWidget;
          if (!VideoWidget) {
            // eslint-disable-next-line no-console
            console.error("VideoWidget missing on window");
            setSdkLoading(false);
            return;
          }

          const config: VideoWidgetConfig = {
            containerId,
            merchantId,
            platform,
            productId: String(productId),
          };

          if (apiBaseUrl) {
            config.baseUrl = apiBaseUrl;
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

          new VideoWidget(config);
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.error(error);
          if (alive) {
            setSdkLoading(false);
          }
        });
    }, 1000); // Delay by 1 second to not block initial render

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
    merchantId,
    platform,
    productId,
    sdkUrl,
    settings?.autoplay,
    settings?.buttonText,
    settings?.ctaButtonBackgroundColor,
    settings?.ctaButtonTextColor,
    settings?.enableCtaButton,
    settings?.itemsPerRow,
    settings?.layout,
    settings?.muteByDefault,
    settings?.showVideoControls,
    settings?.title,
    settings?.destinationUrl,
  ]);

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
        // eslint-disable-next-line no-console
        console.error("VideoWidget add to cart failed", error);
        detail.done?.({ ok: false, error: String(error) });
      }
    };

    window.addEventListener(
      "video-widget:add-to-cart",
      handleAddToCart as EventListener,
    );
    return () => {
      window.removeEventListener(
        "video-widget:add-to-cart",
        handleAddToCart as EventListener,
      );
    };
  }, [addItems]);

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
    <div data-testid="video-app-wrapper" className="mx-auto">
      {/* {sdkLoading && hasContent !== false && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          <div className="aspect-[9/16] w-full rounded-xl bg-gray-200 animate-pulse" />
          <div className="aspect-[9/16] w-full rounded-xl bg-gray-200 animate-pulse" />
          <div className="aspect-[9/16] w-full rounded-xl bg-gray-200 animate-pulse" />
          <div className="aspect-[9/16] w-full rounded-xl bg-gray-200 animate-pulse" />
        </div>
      )} */}
      <div
        data-testid="video-app-container"
        id={containerId}
        className={sdkLoading ? "hidden" : ""}
      />
    </div>
  );
};

export { VideoApp };
export default VideoApp;
