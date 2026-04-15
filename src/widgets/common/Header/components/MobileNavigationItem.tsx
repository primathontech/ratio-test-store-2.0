"use client";

import { Box } from "@/ui/atomic";
import Link from "next/link";
import React, { useState } from "react";
import CategoryNavigationItem from "./CategoryNavigationItem";

interface NavigationItem {
  key?: string;
  label: string;
  href?: string;
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
    <Box className={`mx-8 ${showTopBorder ? "border-t" : ""}`}>
      {item.hasDropdown ? (
        <button
          onClick={handleClick}
          aria-expanded={isExpanded}
          className="w-full flex items-center justify-between py-[9px] my-1 md:py-[9px] md:my-0 transition-colors duration-200"
        >
          <p className="text-[14px] font-[500]">{item.label}</p>
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
            className="transition-transform duration-300 ease-in-out"
            style={{
              transform: isExpanded ? "rotate(0deg)" : "rotate(90deg)",
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
                transition: "opacity 300ms ease-in-out",
              }}
            ></line>
          </svg>
        </button>
      ) : (
        <Link
          href={item.href as string}
          onClick={onClose}
          className="block py-2 my-1 px-4 text-[14px]"
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
        >
          <div className="py-1">
            {item.dropdownItems.map((subItem, index) => (
              <Box key={subItem.key || index}>
                {subItem.isCategory ? (
                  <CategoryNavigationItem item={subItem} onClose={onClose} />
                ) : (
                  <Link
                    key={subItem.key || index}
                    href={subItem.href || "#"}
                    onClick={onClose}
                    className="block py-1 my-1 px-4 no-underline text-[14px]"
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
