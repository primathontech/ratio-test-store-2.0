"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Box } from "@/ui/atomic";
import { MobileNavigationItem } from "./MobileNavigationItem";
import GetApp from "./GetApp";
import ConnectWithUs from "./ConnectWithUs";
import { useAuth } from "@shopkit/core/context";
import { KwikPassScriptCustom } from "@/integrations/kwikpass-custom";

declare global {
  interface Window {
    handleCustomLogin?: (param: boolean) => void;
  }
}

interface NavigationItem {
  key?: string;
  label: string;
  href?: string;
  hasDropdown?: boolean;
  dropdownItems?: NavigationItem[];
  isCategory?: boolean;
  items?: NavigationItem[];
}

interface MobileNavigationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  navigationTranslations?: any;
  userActionsTranslations?: any;
  items: NavigationItem[];
  connectWithUs: [];
  getApp: any;
}

export const MobileNavigationDrawer: React.FC<MobileNavigationDrawerProps> = ({
  isOpen,
  onClose,
  navigationTranslations = {},
  userActionsTranslations = {},
  items = [],
  connectWithUs = [],
  getApp,
}) => {
  const router = useRouter();
  const { accessToken } = useAuth();
  const [shouldLoadKwikPassScript, setShouldLoadKwikPassScript] =
    useState(false);
  const [kwikPassScriptLoaded, setKwikPassScriptLoaded] = useState(false);
  const isLoggedIn = !!accessToken;

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
      document.body.style.overflow = "hidden";

      return () => {
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.width = "";
        document.body.style.overflow = "";
        window.scrollTo(0, scrollY);
      };
    }
  }, [isOpen]);

  // Handle KwikPass script loading and login trigger
  useEffect(() => {
    if (kwikPassScriptLoaded && shouldLoadKwikPassScript) {
      const timer = setTimeout(() => {
        if (typeof window !== "undefined" && window.handleCustomLogin) {
          window.handleCustomLogin(false);
        }
        setShouldLoadKwikPassScript(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [kwikPassScriptLoaded, shouldLoadKwikPassScript]);

  const handleAccountClick = () => {
    // If user is already logged in, navigate to account page
    if (isLoggedIn) {
      onClose();
      router.push("/account");
      return;
    }
    if (typeof window !== "undefined" && window.handleCustomLogin) {
      // Script is already loaded, trigger login directly
      window.handleCustomLogin(false);
    } else {
      setShouldLoadKwikPassScript(true);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose();
    }
  };

  return (
    <>
      {/* Backdrop */}
      <Box
        data-testid="mobile-navigation-drawer-backdrop"
        className={`
          mobile-nav-backdrop fixed inset-0 bg-black/50 z-[9998] transition-opacity duration-300
          ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}
        `}
        onClick={handleBackdropClick}
        onKeyDown={handleKeyDown}
        tabIndex={-1}
        aria-hidden="true"
      />

      {/* Drawer */}
      <Box
        data-testid="mobile-navigation-drawer"
        className={`
          mobile-nav-drawer fixed top-0 left-0 h-full min-w-[320px] max-w-[350px] w-80  z-[9999] flex flex-col
          transform transition-transform duration-300 ease-in-out shadow-2xl bg-white text-black
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
        role="dialog"
        aria-modal="true"
        aria-label={navigationTranslations.main_menu}
      >
        {/* Header */}
        <Box
          data-testid="mobile-navigation-drawer-header"
          className="flex items-center justify-start py-12 px-6 border-b border-white/10 shrink-0"
        >
          <button
            data-testid="mobile-navigation-drawer-close-button"
            onClick={onClose}
            className="
              rounded-lg transition-colors duration-200 bg-transparent border-none cursor-pointer
              hover:bg-white/10 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20
            "
            aria-label={navigationTranslations.close_menu}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </Box>

        <Box
          data-testid="mobile-navigation-drawer-content"
          className="flex-1 overflow-auto"
        >
          {/* Search Section */}
          <GetApp data={getApp} />

          {/* Navigation Items */}
          <Box
            data-testid="mobile-navigation-drawer-nav-wrapper"
            className="flex-1 overflow-y-auto pt-2"
          >
            <nav
              data-testid="mobile-navigation-drawer-nav"
              role="navigation"
              aria-label={navigationTranslations.main_navigation}
            >
              {items.map((item: any, i) => (
                <MobileNavigationItem
                  key={item.key}
                  data-testid={`mobile-navigation-drawer-${item.key}`}
                  item={item}
                  onClose={onClose}
                  showTopBorder={i !== 0}
                />
              ))}
            </nav>
          </Box>

          <ConnectWithUs items={connectWithUs} />
        </Box>

        {/* User Actions */}
        <Box
          data-testid="mobile-navigation-drawer-user-actions"
          className="mx-4 border-t shrink-0"
        >
          <button
            data-testid="mobile-navigation-drawer-account-button"
            className="py-4 flex gap-2 items-center"
            onClick={handleAccountClick}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
            <p>{isLoggedIn ? userActionsTranslations.account : "Login"}</p>
          </button>
        </Box>
      </Box>

      {/* Load KwikPass Script when user clicks account button */}
      {shouldLoadKwikPassScript && !kwikPassScriptLoaded && (
        <KwikPassScriptCustom
          onLoad={() => {
            setKwikPassScriptLoaded(true);
          }}
        />
      )}
    </>
  );
};
