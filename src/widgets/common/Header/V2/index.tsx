"use client";

import React, { memo, useState, useRef, useEffect } from "react";
import { useResponsive } from "@/hooks";
import { Box, Flex } from "@/ui/atomic";
import { HeaderProps } from "../types";
import { useCartToggle } from "@shopkit/cart";
import { useContextAwareHomeURL } from "@/utils/navigation";

// Sub-components
import { MobileNavigationDrawer } from "./components/MobileNavigationDrawer";
import { DesktopNavigationMenu } from "./components/DesktopNavigationMenu";
import { UserActionsComponent } from "./components/UserActionsComponent";
import { MobileMenuButton } from "./components/MobileMenuButton";
import { CartIcon } from "./components/CartIcon";
import { BrandLogo } from "./components/BrandLogo";

/**
 * Header V2 Component - BBLUNT Replica
 * Pixel-perfect replica of BBLUNT website header with comprehensive responsive design
 */
const V2 = memo(function V2({ data, settings }: HeaderProps) {
  const { isMobile, isMobileTab } = useResponsive();

  // Use isMobileTab to include iPad in mobile layout
  const showMobileLayout = isMobileTab;

  // State management
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Refs
  const headerRef = useRef<HTMLDivElement>(null);

  const toggleCart = useCartToggle();

  // Get data from data source
  const brandName = data.brandName || "BBLUNT";
  const brandLogoUrl = data.brandLogoUrl;

  // Use context-aware home URL
  const homePageUrl = useContextAwareHomeURL();

  // Extract settings with defaults
  const {
    isFixed = false,
    logoWidth = 140,
    showCartIcon = true,
    navigation = {},
    userActions = {},
    accessibility = {},
    backgroundColor = "#ffffff",
    textColor = "#000000",
    connectWithUs = [],
    getApp,
  } = settings;

  // Navigation items from translation data or fallback to hardcoded structure
  const navigationItems = navigation.items || [];

  // Helper function to convert size values to CSS strings
  const toCSSSize = (value: string | number): string => {
    if (typeof value === "number") {
      return `${value}px`;
    }
    return value;
  };

  // Convert size values with responsive adjustments
  const cssLogoWidth = toCSSSize(
    showMobileLayout ? logoWidth * 0.8 : logoWidth,
  );

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleMobileMenuClose = () => {
    setIsMobileMenuOpen(false);
  };

  // Check if zoom modal is open by checking body class
  const [isZoomOpen, setIsZoomOpen] = useState(false);

  useEffect(() => {
    const checkZoomState = () => {
      setIsZoomOpen(document.body.classList.contains("zoom-modal-open"));
    };

    // Check initial state
    checkZoomState();

    // Create a MutationObserver to watch for class changes
    const observer = new MutationObserver(checkZoomState);
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  // Hide header when zoom modal is open
  if (isZoomOpen) {
    return null;
  }

  return (
    <>
      <Box
        as="header"
        ref={headerRef}
        className={`
        header-widget-v2 w-full transition-all duration-300 ease-in-out
        lg:mb-0 lg:px-6 xl2:px-[100px] py-[16px] xl:py-0
        ${isFixed ? "sticky top-0 left-0 z-[1200]" : ""}
      `}
        style={{
          background: isMobile
            ? "linear-gradient(to top, rgba(205, 229, 235, 0.3) 0%, rgba(230, 240, 245, 0.4) 50%, rgba(255, 255, 255, 0.5) 100%)"
            : backgroundColor === "#ffffff"
              ? "rgb(255 255 255 / .6)"
              : backgroundColor,
          backdropFilter: backgroundColor === "#ffffff" ? "blur(16px)" : "none",
          WebkitBackdropFilter:
            backgroundColor === "#ffffff" ? "blur(16px)" : "none",
        }}
        role="banner"
        aria-label={accessibility.main_navigation}
      >
        <Flex
          justify={!showMobileLayout ? "between" : "between"}
          align="center"
          className="header-container h-full px-6"
          gap={showMobileLayout ? "1.5rem" : "4rem"}
        >
          {showMobileLayout ? (
            <>
              {/* Left Section: Mobile Menu Button + Brand Logo */}
              <Flex align="center" className="lg:hidden">
                <MobileMenuButton
                  isOpen={isMobileMenuOpen}
                  onClick={handleMobileMenuToggle}
                  textColor={textColor}
                  ariaLabel={accessibility.mobile_menu_toggle}
                />
                <BrandLogo
                  href={homePageUrl}
                  logoUrl={brandLogoUrl}
                  brandName={brandName}
                  logoWidth={cssLogoWidth}
                  textColor={textColor}
                  isMobile={showMobileLayout}
                />
              </Flex>

              {/* Right Section: Cart */}
              <Flex align="center" gap="1.5rem" className="lg:hidden">
                {/* Cart Icon */}
                {showCartIcon && (
                  <CartIcon
                    onClick={toggleCart}
                    textColor={textColor}
                    isMobile={showMobileLayout}
                    ariaLabel={accessibility.shopping_cart}
                  />
                )}
              </Flex>
            </>
          ) : (
            <>
              {/* Desktop Layout */}
              {/* Brand Section */}
              <BrandLogo
                href={homePageUrl}
                logoUrl={brandLogoUrl}
                brandName={brandName}
                logoWidth={cssLogoWidth}
                textColor={textColor}
                isMobile={isMobile}
              />

              {/* Desktop Navigation Menu */}
              <div
                data-testid="header-desktop-navigation-wrapper"
                className="hidden lg:block flex-1"
              >
                <DesktopNavigationMenu
                  items={navigationItems}
                  className="desktop-navigation"
                />
              </div>

              {/* Right Section */}
              <div
                data-testid="header-right-section"
                className="flex items-center gap-6"
              >
                {/* Cart Icon */}
                {showCartIcon && (
                  <CartIcon
                    onClick={toggleCart}
                    textColor={textColor}
                    isMobile={showMobileLayout}
                    ariaLabel={accessibility.shopping_cart}
                  />
                )}

                {/* User Actions (Desktop only) */}
                <div
                  data-testid="header-user-actions-wrapper"
                  className="hidden lg:block"
                >
                  <UserActionsComponent
                    textColor={textColor}
                    className="user-actions"
                    userActionsTranslations={userActions}
                    navigationTranslations={navigation}
                    accessibilityTranslations={accessibility}
                  />
                </div>
              </div>
            </>
          )}
        </Flex>
      </Box>

      {/* Mobile Navigation Drawer */}
      <MobileNavigationDrawer
        isOpen={isMobileMenuOpen}
        onClose={handleMobileMenuClose}
        navigationTranslations={navigation}
        userActionsTranslations={userActions}
        items={navigationItems}
        connectWithUs={connectWithUs}
        getApp={getApp}
      />

      {/* Overlay for mobile menu */}
      {isMobileMenuOpen && (
        <div
          data-testid="header-mobile-menu-overlay"
          className="fixed inset-0 bg-black/50 z-[1100] opacity-100 transition-opacity duration-300"
          onClick={handleMobileMenuClose}
          aria-hidden="true"
        />
      )}
    </>
  );
});

export { V2 };
