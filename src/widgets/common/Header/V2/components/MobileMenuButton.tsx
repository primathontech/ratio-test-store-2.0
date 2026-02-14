"use client";

import React from "react";

interface MobileMenuButtonProps {
  isOpen: boolean;
  onClick: () => void;
  textColor?: string;
  ariaLabel: string;
}

export const MobileMenuButton: React.FC<MobileMenuButtonProps> = ({
  isOpen,
  onClick,
  textColor = "inherit",
  ariaLabel,
}) => {
  return (
    <button
      data-testid="header-mobile-menu-button"
      onClick={onClick}
      className="pl-2 rounded-md transition-all duration-200 ease-in-out"
      aria-label={ariaLabel}
      aria-expanded={isOpen}
      aria-controls="mobile-navigation-drawer"
      style={{ color: textColor }}
    >
      <img
        data-testid="header-mobile-menu-button-icon"
        src="/dawn/images/static/menu_icon.svg"
        alt="Menu"
        width="24"
        height="24"
        className={`transition-transform duration-200 ${isOpen ? "rotate-90" : ""}`}
        style={{ color: textColor }}
        aria-hidden="true"
      />
    </button>
  );
};
