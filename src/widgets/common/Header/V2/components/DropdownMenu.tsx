"use client";

import React from "react";
import { Box } from "@/ui/atomic";
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

interface DropdownMenuProps {
  items: NavigationItem[];
  textColor?: string;
  backgroundColor: string;
  onClose: () => void;
}

export const DropdownMenu: React.FC<DropdownMenuProps> = ({
  items,
  textColor = "inherit",
  backgroundColor = "#ffffff",
  onClose,
}) => {
  if (items.length === 0) {
    return (
      <Box
        data-testid="header-dropdown-menu-empty"
        className="
          dropdown-menu absolute top-full left-0 mt-0
          bg-white text-black
          min-w-[200px] z-[1000] p-4
        "
        style={{ backgroundColor: textColor, color: backgroundColor }}
      >
        Coming Soon
      </Box>
    );
  }

  return (
    <Box
      data-testid="header-dropdown-menu"
      className="
        dropdown-menu absolute top-full left-0 mt-0
        bg-white text-black
        min-w-[220px] z-[1000] py-2
      "
      role="menu"
    >
      {items.map((item, index) => (
        <Box
          key={item.key || index}
          data-testid={`header-dropdown-menu-item-${item.key || index}`}
        >
          {item.isCategory ? (
            // Category with nested items
            <Box
              data-testid={`header-dropdown-menu-category-${item.key || index}`}
              className="py-2"
            >
              <p
                className="px-4 py-2 text-gray-500 tracking-wider"
                data-testid={`header-dropdown-menu-category-label-${item.key || index}`}
              >
                {item.label}
              </p>
              {item.items?.map((subItem, subIndex) => (
                <Link
                  key={subItem.key || subIndex}
                  data-testid={`header-dropdown-menu-category-link-${subItem.key || subIndex}`}
                  href={subItem.href || "#"}
                  role="menuitem"
                  onClick={onClose}
                  className="
                    block py-2 px-6 no-underline text-sm font-medium
                  "
                >
                  {subItem.label}
                </Link>
              ))}
            </Box>
          ) : (
            // Regular dropdown item
            <Link
              key={item.key || index}
              data-testid={`header-dropdown-menu-link-${item.key || index}`}
              href={item.href || "#"}
              role="menuitem"
              onClick={onClose}
              className="
                block py-3 px-4 no-underline text-sm font-medium
              "
            >
              {item.label}
            </Link>
          )}
        </Box>
      ))}
    </Box>
  );
};
