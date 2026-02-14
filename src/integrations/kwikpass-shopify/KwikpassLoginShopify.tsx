"use client";

import ReactDOM from "react-dom";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Close, fireUserEngagementEvent, KwikPassLogo } from "./utils";
import { useAuth } from "@shopkit/core/context";

declare global {
  interface Window {
    __KP_LOGIN_SDK_INSTANCE__?: {
      handleKpLogin: () => void;
    };
    handleLogout?: (path: string) => void;
  }
}

/**
 * KwikpassLoginShopify component that handles user authentication via KwikPass
 * Displays different UI based on login state
 */
export default function KwikpassLoginShopify() {
  const [open, setOpen] = useState(false);
  const { accessToken, logout } = useAuth();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const router = useRouter();
  const [dropdownPosition, setDropdownPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);

  /**
   * Handles user logout
   */
  const doLogout = () => {
    try {
      if (typeof window !== "undefined" && window.handleLogout) {
        window.handleLogout("/");
      }
      logout();
      setOpen(false);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  /**
   * Triggers KwikPass login flow
   */
  const handleLogin = () => {
    try {
      if (typeof window !== "undefined") {
        if (window.__KP_LOGIN_SDK_INSTANCE__) {
          window.__KP_LOGIN_SDK_INSTANCE__.handleKpLogin();
          setOpen(false);
        }
      }
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  /**
   * Handle click outside to close dropdown
   */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  useEffect(() => {
    if (open && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + 8,
        left: rect.right - 172,
      });
    }
  }, [open]);

  return (
    <div className="relative" data-testid="kwikpass-login">
      {accessToken ? (
        <button
          id="user-account"
          ref={buttonRef}
          className="h-full flex items-center gap-2 cursor-pointer w-[100px] text-gray-800"
          aria-label={open ? "Close user menu" : "Open user menu"}
          onClick={open ? () => setOpen(false) : () => setOpen(true)}
          data-testid="toggle-user-dropdown"
        >
          {open ? (
            <>
              <Close currentColor="#374151" />
              <span
                className="text-text-base font-normal leading-normal whitespace-nowrap"
                style={{
                  color: "#1D1D1D",
                }}
              >
                Account
              </span>
            </>
          ) : (
            <>
              <div className="rounded-full border-2 border-[#d7d9db]">
                <KwikPassLogo width="28" height="28" currentColor="#374151" />
              </div>
              <span
                className="text-text-base font-normal leading-normal whitespace-nowrap"
                style={{
                  color: "#1d1d1d",
                }}
              >
                Account
              </span>
            </>
          )}
        </button>
      ) : (
        <button
          className="text-gray-800"
          aria-label="Login"
          onClick={handleLogin}
          id="login"
          data-testid="login-button"
        >
          <div className="rounded-full border-2 border-[#d7d9db]">
            <KwikPassLogo width="28" height="28" currentColor="#840000" />
          </div>
        </button>
      )}

      {open &&
        accessToken &&
        dropdownPosition &&
        typeof window !== "undefined" &&
        document.body &&
        ReactDOM.createPortal(
          <div
            ref={dropdownRef}
            className="p-4 overflow-hidden rounded-b-lg border border-gray-100 fixed z-[10000] bg-white"
            style={{
              boxShadow: "0px 0px 32px 0px rgba(16, 24, 40, 0.32)",
              width: 172,
              top: dropdownPosition.top,
              left: dropdownPosition.left,
            }}
            data-testid="user-dropdown"
          >
            <div className="flex flex-col space-y-4">
              <button
                id="order-history"
                className="flex items-center font-medium text-gray-800 hover:text-gray-600"
                onClick={() => {
                  fireUserEngagementEvent();
                  router.push("/account/order-history");
                  setOpen(false);
                }}
                data-testid="order-history-button"
              >
                Order History
              </button>

              <button
                id="logout"
                className="flex items-center justify-center w-full p-2 border border-gray-300 rounded text-gray-700 font-medium"
                aria-label="Logout"
                onClick={doLogout}
                data-testid="logout-button"
              >
                Logout
              </button>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
