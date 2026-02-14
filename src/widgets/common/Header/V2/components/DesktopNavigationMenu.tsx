"use client";

import React, { useState, useRef, useEffect } from "react";
import { ExpandableDropdownMenu } from "./ExpandableDropdownMenu";
import Link from "next/link";

interface NavigationItem {
  key?: string;
  label: string;
  href?: string;
  hasDropdown?: boolean;
  dropdownItems?: NavigationItem[];
  isCategory?: boolean;
  items?: NavigationItem[];
}

interface DesktopNavigationMenuProps {
  items: NavigationItem[];
  className?: string;
}

export const DesktopNavigationMenu: React.FC<DesktopNavigationMenuProps> = ({
  items,
  className = "",
}) => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Handle keyboard navigation
  const handleKeyDown = (event: React.KeyboardEvent, itemKey: string) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (items.find((item) => item.key === itemKey)?.hasDropdown) {
        setActiveDropdown(activeDropdown === itemKey ? null : itemKey);
      }
    } else if (event.key === "Escape") {
      setActiveDropdown(null);
    }
  };

  // Handle mouse enter with immediate show
  const handleMouseEnter = (itemKey: string) => {
    // Clear any pending hide timeout
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setActiveDropdown(itemKey);
  };

  // Handle mouse leave with delay
  const handleMouseLeave = () => {
    // Add a delay before hiding to allow user to move to dropdown
    hoverTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 150); // 150ms delay
  };

  // Handle dropdown mouse enter to keep it open
  const handleDropdownMouseEnter = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
  };

  // Handle dropdown mouse leave
  const handleDropdownMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 100); // Shorter delay when leaving dropdown
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  return (
    <nav
      data-testid="desktop-navigation-menu"
      className={`flex items-center gap-6 ${className}`}
      role="navigation"
      aria-label="Main navigation"
    >
      {items.map((item, index) => {
        const itemKey = item.key || `item-${index}`;
        return (
          <div
            key={itemKey}
            data-testid={`desktop-navigation-item-${itemKey}`}
            className="relative py-5"
            onMouseEnter={() => handleMouseEnter(itemKey)}
            onMouseLeave={handleMouseLeave}
          >
            {item.hasDropdown ? (
              <Link
                data-testid={`desktop-navigation-dropdown-button-${itemKey}`}
                href={item.href || "#"}
                className="relative bg-transparent cursor-pointer flex items-baseline gap-[8px] font-medium text-text-base !leading-tight pb-1 no-underline
                  after:absolute after:left-0 after:right-0 after:bottom-0 after:h-[1px] after:bg-black
                  after:scale-x-0 after:origin-right after:translate-y-[4px] after:transition-transform after:duration-300 after:ease-out
                  hover:after:scale-x-100 hover:after:origin-left
                  text-black"
                aria-expanded={activeDropdown === itemKey}
                aria-haspopup="true"
                onKeyDown={(e) => handleKeyDown(e, itemKey)}
                onFocus={() => setActiveDropdown(itemKey)}
                onBlur={() => setActiveDropdown(null)}
              >
                <span>{item.label}</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="10"
                  height="7"
                  viewBox="0 0 10 7"
                  fill="none"
                >
                  <path
                    d="M10 1.24243L5 6.24243L-2.18557e-07 1.24243L0.8875 0.354932L5 4.46743L9.1125 0.354931L10 1.24243Z"
                    fill="currentColor"
                  ></path>
                </svg>
              </Link>
            ) : (
              <Link
                data-testid={`desktop-navigation-link-${itemKey}`}
                href={item.href || "#"}
                className="relative no-underline pb-1 tracking-wide font-medium text-sm inline-flex after:absolute after:left-0 after:right-0 after:bottom-0 after:h-[1px] after:bg-white after:scale-x-0 after:origin-left after:transition-transform after:duration-300 after:ease-out after:translate-y-[4px] hover:after:scale-x-100"
              >
                <span>{item.label}</span>
              </Link>
            )}

            {/* Dropdown Menu */}
            {item.hasDropdown && activeDropdown === itemKey && (
              <div
                data-testid={`desktop-navigation-dropdown-${itemKey}`}
                onMouseEnter={handleDropdownMouseEnter}
                onMouseLeave={handleDropdownMouseLeave}
              >
                <ExpandableDropdownMenu
                  items={item.dropdownItems || []}
                  textColor="inherit"
                  backgroundColor="#ffffff"
                  onClose={() => setActiveDropdown(null)}
                />
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
};
