"use client";

import React, { memo } from "react";
import { LanguageSwitcher } from "@/ui/components/LanguageSwitcher";
import { Box, Flex, Text, Badge, Link, Image } from "@/ui/atomic";
import { HeaderProps } from "../types";
import { useCartToggle } from "@shopkit/cart";
import { CartBadge } from "@/ui/components";
import { useContextAwareHomeURL } from "@/utils/navigation";

/**
 * Header V1 Component
 * Displays a header with brand name/logo and cart icon
 */
const V1 = memo(function V1({ data, settings }: HeaderProps) {
  const toggleCart = useCartToggle();

  // Get data from data source with fallbacks
  const brandName = data?.brandName || "Store";
  const brandLogoUrl = data?.brandLogoUrl || "";

  // Use context-aware home URL
  const homePageUrl = useContextAwareHomeURL();

  // Extract settings with defaults
  const {
    isFixed = false,
    height = 70,
    logoWidth = 140,
    showCartIcon = true,
    showLanguageSwitcher = false,
    backgroundColor = "#ffffff",
    textColor = "#000000",
  } = settings;

  // Helper function to convert size values to CSS strings
  const toCSSSize = (value: string | number): string => {
    if (typeof value === "number") {
      return `${value}px`;
    }
    return value;
  };

  // Convert size values
  const cssLogoWidth = toCSSSize(logoWidth);
  const cssHeight = toCSSSize(height);

  // Styling values
  const borderBottom = `1px solid #DDDDDD`;
  const padding = "16px";
  const cartIconColor = textColor;
  const cartBadgeBackgroundColor = "#000000";
  const cartBadgeTextColor = "#ffffff";

  // Create style objects
  const headerStyle: React.CSSProperties = {
    backgroundColor: backgroundColor,
    color: textColor,
    borderBottom: borderBottom,
    padding: padding,
    width: "100%",
    height: cssHeight,
    ...(isFixed && {
      position: "fixed",
      top: 0,
      left: 0,
      zIndex: 1200,
      boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
    }),
  };

  return (
    <Box as="header" className="header-widget" style={headerStyle}>
      <Flex justify="between" align="center">
        {/* Brand Section */}
        <Link
          href={homePageUrl}
          className="header-brand-link"
          variant="default"
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <Flex align="center" className="header-brand">
            {brandLogoUrl ? (
              <div className="header-logo">
                <Image
                  src={brandLogoUrl}
                  alt={brandName || "Brand Logo"}
                  width={parseInt(cssLogoWidth)}
                  height={60}
                  objectFit="contain"
                  style={{
                    transition: "transform 0.2s ease",
                  }}
                />
              </div>
            ) : (
              <Text
                as="span"
                size="xl"
                weight="bold"
                className="header-brand-name"
              >
                {brandName || "Store"}
              </Text>
            )}
          </Flex>
        </Link>

        {/* Right Section */}
        <Flex align="center" gap="1rem" className="header-right-section">
          {showLanguageSwitcher && <LanguageSwitcher />}

          {showCartIcon && (
            <Box
              className="header-cart-icon"
              style={{
                position: "relative",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: cartIconColor,
              }}
              onClick={toggleCart}
              aria-label="Shopping Cart"
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
              >
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>

              <CartBadge
                backgroundColor={cartBadgeBackgroundColor}
                textColor={cartBadgeTextColor}
                position={{ top: "-8px", right: "-8px" }}
              />
            </Box>
          )}
        </Flex>
      </Flex>
    </Box>
  );
});

export { V1 };
