"use client";

import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import KwikPassScriptCustom from "./KwikPassScriptCustom";
import { dispatchPageViewEvent } from "./events";
import { getCartToken } from "./utils";
import { useAuth } from "@shopkit/core/context";

// Extend Window interface to include KwikPass event handlers
declare global {
  interface Window {
    handleCustomLogin?: (param: boolean) => void;
  }
}

// Define custom event types for KwikPass
type KwikPassLoginEvent = CustomEvent<{
  [key: string]: unknown;
}>;

// Extend WindowEventMap to include KwikPass events
declare global {
  interface WindowEventMap {
    "user-loggedin": KwikPassLoginEvent;
    user_loggedin_merchant: KwikPassLoginEvent;
  }
}

export default function KwikPassCustom() {
  const pathname = usePathname();
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const { login } = useAuth();

  // Callback to set scriptLoaded state to true when the script has loaded
  const onLoaded = useCallback(() => {
    setScriptLoaded(true);
  }, []);

  // Handler for KwikPass login (this is triggered when a user logs in via SSO or KwikPass)
  const handleKwikpassLogin = useCallback(
    async (event: KwikPassLoginEvent) => {
      // Handle the login after the user is authenticated via SSO or KwikPass.

      if (!event.detail) {
        console.warn("KwikPassCustom: Login event has no detail");
        return;
      }

      // Try to extract the access token from various possible locations
      let loginData = null;

      // Check for gk-access-token
      if (event.detail["gk-access-token"]) {
        loginData = event.detail["gk-access-token"];
      }
      // Check for accessToken
      else if (event.detail["accessToken"]) {
        loginData = event.detail["accessToken"];
      }
      // Check for token
      else if (event.detail["token"]) {
        loginData = event.detail["token"];
      }
      // If detail is an object with data, use the whole detail
      else if (
        typeof event.detail === "object" &&
        Object.keys(event.detail).length > 0
      ) {
        loginData = event.detail;
      }
      // If detail is a string/number, use it directly
      else if (event.detail !== null && event.detail !== undefined) {
        loginData = event.detail;
      }

      if (loginData) {
        login(loginData);
      } else {
        console.warn(
          "KwikPassCustom: No valid login data found in event:",
          event.detail,
        );
      }
    },
    [login],
  );

  // Effect hook to add event listeners once the script is loaded
  useEffect(() => {
    if (scriptLoaded && typeof window !== "undefined") {
      // Add event listeners for user and merchant login events
      window.addEventListener("user-loggedin", handleKwikpassLogin); // SSO or KwikPass login event
      // Cleanup function to remove event listeners on component unmount
      return () => {
        window.removeEventListener("user-loggedin", handleKwikpassLogin);
      };
    }
  }, [scriptLoaded, handleKwikpassLogin]);

  // Effect hook to send page view event whenever the page changes
  useEffect(() => {
    if (scriptLoaded && typeof window !== "undefined") {
      // Send page view event (you can expand this functionality as needed)
      console.info("KP: Page view:", pathname);
      if (!pathname.startsWith("/products")) {
        dispatchPageViewEvent({
          cart_id: getCartToken(),
        });
      }
    }
  }, [scriptLoaded, pathname]);

  return <KwikPassScriptCustom onLoad={onLoaded} />;
}
