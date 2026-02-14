"use client";

import { useCallback, useEffect, useState } from "react";
import KwikPassScript from "./KwikPassScriptShopify";
import { usePathname } from "next/navigation";
import {
  decodeKpToken,
  getCustomerAccessToken,
  getCustomerAccessTokenMultipass,
} from "./AuthUtils";

// Import event system
import { dispatchPageViewEvent } from "./events";

import { getCartToken } from "./utils";
import { useAuth } from "@shopkit/core/context";

// Extend Window interface to include KwikPass event handlers
declare global {
  interface Window {
    handleCustomLogin?: (param: boolean) => void;
    handleDOMUpdate?: () => void;
  }
}

// Define custom event types for KwikPass
type KwikPassLoginEvent = CustomEvent<{
  [key: string]: unknown;
}>;

// Extend WindowEventMap to include KwikPass events
declare global {
  interface WindowEventMap {
    kp_data_sent: KwikPassLoginEvent;
    "update-dom": Event;
  }
}

export default function KwikPassShopify() {
  const pathname = usePathname();
  const [isKwikPassScriptLoaded, setIsKwikPassScriptLoaded] = useState(false);
  const { login } = useAuth();

  const onLoad = () => {
    setIsKwikPassScriptLoaded(true);
  };

  const handleUserLogin = useCallback(
    async (event: KwikPassLoginEvent) => {
      if (event?.detail?.kpToken) {
        try {
          const customer = await decodeKpToken(event.detail.kpToken as string);

          let accessToken: string | null = null;

          if (customer) {
            if (customer?.email && customer?.password) {
              accessToken = await getCustomerAccessToken(customer);
            }

            if (customer?.multipassToken) {
              accessToken = await getCustomerAccessTokenMultipass(customer);
            }
          }

          if (accessToken) {
            login(accessToken);
          }
        } catch (error) {
          console.error("Error during KwikPass login:", error);
        }
      }
    },
    [login],
  );

  // Effect hook to add event listeners once the script is loaded
  useEffect(() => {
    if (isKwikPassScriptLoaded && typeof window !== "undefined") {
      window.addEventListener("kp_data_sent", handleUserLogin); // User login event

      return () => {
        window.removeEventListener("kp_data_sent", handleUserLogin);
      };
    }
  }, [isKwikPassScriptLoaded, handleUserLogin]);

  // Effect for DOM updates
  useEffect(() => {
    if (!(window && isKwikPassScriptLoaded)) {
      return;
    }

    if (window.handleDOMUpdate) {
      window.handleDOMUpdate();
    }

    const handleDomUpdate = () => {
      if (window.handleDOMUpdate) {
        window.handleDOMUpdate();
      }
    };

    window.addEventListener("update-dom", handleDomUpdate);

    return () => {
      window.removeEventListener("update-dom", handleDomUpdate);
    };
  }, [isKwikPassScriptLoaded]);

  // Effect hook to send page view event whenever the page changes
  useEffect(() => {
    if (isKwikPassScriptLoaded && typeof window !== "undefined") {
      // Send page view event (you can expand this functionality as needed)
      if (!pathname.startsWith("/products")) {
        dispatchPageViewEvent({
          cart_id: getCartToken(),
        });
      }
    }
  }, [isKwikPassScriptLoaded, pathname]);

  return <KwikPassScript onLoad={onLoad} />;
}
