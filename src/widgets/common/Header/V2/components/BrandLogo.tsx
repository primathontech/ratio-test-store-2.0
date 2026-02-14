"use client";

import React from "react";
import { Flex, Text, Link, Image } from "@/ui/atomic";

interface BrandLogoProps {
  href: string;
  logoUrl?: string;
  brandName: string;
  logoWidth: string;
  textColor?: string;
  isMobile: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  href,
  logoUrl,
  brandName,
  logoWidth,
  textColor = "inherit",
  isMobile,
}) => {
  // Parse logoWidth - handle both "140px" and 140 formats
  const parsedWidth =
    typeof logoWidth === "string"
      ? parseInt(logoWidth.replace("px", ""), 10) || 140
      : logoWidth || 140;

  const logoSrc = logoUrl || "/dawn/images/static/brand_logo_image.svg";

  return (
    <Link
      href={href}
      className="header-brand-link flex-shrink-0"
      variant="default"
      style={{ color: textColor, textDecoration: "none" }}
    >
      <Flex align="center" className="header-brand">
        <div
          data-testid="header-brand-logo"
          className="header-logo transition-transform duration-200 ease-in-out"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minWidth: `${parsedWidth}px`,
          }}
        >
          <Image
            src={logoSrc}
            alt={brandName || "Brand Logo"}
            width={parsedWidth}
            height={60}
            objectFit="contain"
            priority
            className="transition-transform duration-200 ease-in-out"
            style={{
              width: isMobile ? "87px" : "121px",
              height: isMobile ? "26px" : "36px",
              display: "block",
            }}
            unoptimized
          />
        </div>
      </Flex>
    </Link>
  );
};
