"use client";

import { Box } from "@/ui/atomic";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@shopkit/core/context";
import { handleKwikpassLogin } from "@/integrations/kwikpass-custom";
import ConnectWithUs from "./ConnectWithUs";
import GetApp from "./GetApp";
import { MobileNavigationItem } from "./MobileNavigationItem";

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
  items: NavigationItem[];
  connectWithUs?: any[];
  getApp?: any;
}

export const MobileNavigationDrawer: React.FC<MobileNavigationDrawerProps> = ({
  isOpen,
  onClose,
  items = [],
  connectWithUs = [],
  getApp,
}) => {
  const router = useRouter();
  const { accessToken } = useAuth();
  const isLoggedIn = !!accessToken;

  // If logged in, route to /account; otherwise trigger KwikPass login overlay.
  const handleAccountClick = () => {
    onClose();
    if (isLoggedIn) {
      router.push("/account");
      return;
    }
    handleKwikpassLogin();
  };

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
        className={`
          mobile-nav-drawer fixed top-0 left-0 h-full min-w-[320px] max-w-[350px] w-80 md:w-[367px] md:max-w-[367px] z-[9999] flex flex-col
          transform transition-transform duration-300 ease-in-out shadow-2xl bg-white text-black
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        {/* Header */}
        <Box className="flex items-center justify-start py-12 px-6 border-b border-white/10 shrink-0">
          <button
            onClick={onClose}
            className="rounded-lg transition-colors duration-200 bg-transparent border-none cursor-pointer hover:bg-white/10 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20"
            aria-label="Close menu"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M20.4894 3.51063C15.8086 -1.17014 8.19199 -1.1706 3.51076 3.51063C-1.17048 8.19187 -1.17002 15.808 3.51076 20.4892C8.19153 25.1705 15.8081 25.1705 20.4894 20.4892C25.1701 15.808 25.1701 8.19141 20.4894 3.51063ZM16.7344 16.7343C16.3738 17.0949 15.7892 17.0949 15.4286 16.7343L12.0001 13.3058L8.40855 16.8973C8.04792 17.2579 7.46335 17.2579 7.10272 16.8973C6.74209 16.5366 6.74209 15.9521 7.10272 15.5914L10.6942 11.9999L7.26572 8.57143C6.90509 8.2108 6.90509 7.62576 7.26572 7.2656C7.62635 6.90497 8.21092 6.90497 8.57155 7.2656L12.0001 10.6941L15.2651 7.42906C15.6257 7.06843 16.2103 7.06843 16.5709 7.42906C16.9316 7.78968 16.9316 8.37426 16.5709 8.73489L13.3059 11.9999L16.7344 15.4284C17.095 15.7891 17.095 16.3736 16.7344 16.7343Z"
                fill="#CCCCCC"
              ></path>
            </svg>
          </button>
        </Box>

        <Box className="flex-1 overflow-auto">
          {/* Get App Banner */}
          <GetApp data={getApp} />

          {/* Navigation Items */}
          <Box className="flex-1 overflow-y-auto pt-2">
            <nav role="navigation" aria-label="Main navigation">
              {items.map((item: any, i) => (
                <MobileNavigationItem
                  key={item.key || i}
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
        <Box className="mx-4 border-t shrink-0">
          <button
            type="button"
            onClick={handleAccountClick}
            className="py-4 flex gap-2 items-center bg-transparent border-0 cursor-pointer"
            aria-label={isLoggedIn ? "My Account" : "Login"}
            data-testid="mobile-drawer-account-button"
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
            <p className="text-[14px] text-[#1d1d1d]">
              {isLoggedIn ? "My Account" : "Login"}
            </p>
          </button>
        </Box>
      </Box>
    </>
  );
};
