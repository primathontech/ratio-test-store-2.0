"use client";

import { Box } from "@/ui/atomic";
import Link from "next/link";
import React, { useState } from "react";
import CategoryNavigationItem from "./CategoryNavigationItem";

interface NavigationItem {
  key?: string;
  label: string;
  href?: string;
  isExternal?: boolean;
  hasDropdown?: boolean;
  dropdownItems?: NavigationItem[];
  isCategory?: boolean;
  items?: NavigationItem[];
}

interface MobileNavigationItemProps {
  item: NavigationItem;
  onClose: () => void;
  showTopBorder?: boolean;
}

export const MobileNavigationItem: React.FC<MobileNavigationItemProps> = ({
  item,
  onClose,
  showTopBorder,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleClick = () => {
    if (item.hasDropdown) {
      setIsExpanded(!isExpanded);
    } else {
      onClose();
    }
  };

  return (
    <Box
      className={`mx-5 ${showTopBorder ? "border-t" : ""}`}
      data-testid={`mobile-navigation-item-${item.key || item.label}`}
    >
      {item.hasDropdown ? (
        <button
          onClick={handleClick}
          aria-expanded={isExpanded}
          className="w-full flex items-center justify-between py-[5.4px] my-1 md:py-[9px] md:my-0 transition-colors duration-200"
          data-testid={`mobile-navigation-item-button-${item.key || item.label}`}
        >
          <p className="text-sm font-medium">{item.label}</p>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="transition-transform duration-700 ease-in-out"
            style={{
              transform: isExpanded ? "rotate(0deg)" : "rotate(-90deg)",
            }}
          >
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <line
              x1="12"
              y1="5"
              x2="12"
              y2="19"
              style={{
                opacity: isExpanded ? 0 : 1,
                transition: "opacity 400ms ease-in-out",
              }}
            ></line>
          </svg>
        </button>
      ) : (
        <Link
          href={item.href as string}
          {...(item.isExternal
            ? { target: "_blank", rel: "noopener noreferrer" }
            : {})}
          onClick={onClose}
          className="block py-2 my-1 px-4 text-sm"
          data-testid={`mobile-navigation-item-link-${item.key || item.label}`}
        >
          {item.label}
        </Link>
      )}

      {/* Dropdown content */}
      {item.hasDropdown && item.dropdownItems && (
        <Box
          className={`border-l ml-2.5 mb-1 overflow-hidden transition-all duration-300 ease-in-out ${
            isExpanded ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0 mb-0"
          }`}
          data-testid={`mobile-navigation-item-dropdown-${item.key || item.label}`}
        >
          <div
            className="py-1"
            data-testid={`mobile-navigation-item-dropdown-content-${item.key || item.label}`}
          >
            {item.dropdownItems.map((subItem, index) => (
              <Box
                key={subItem.key || index}
                data-testid={`mobile-navigation-item-subitem-${subItem.key || index}`}
              >
                {subItem.isCategory ? (
                  <CategoryNavigationItem item={subItem} onClose={onClose} />
                ) : (
                  <Link
                    key={subItem.key || index}
                    href={subItem.href || "#"}
                    {...(subItem.isExternal
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                    onClick={onClose}
                    className="block py-1 my-1 px-4 no-underline text-sm"
                    data-testid={`mobile-navigation-item-sublink-${subItem.key || index}`}
                  >
                    {subItem.label}
                  </Link>
                )}
              </Box>
            ))}
          </div>
        </Box>
      )}
    </Box>
  );
};
