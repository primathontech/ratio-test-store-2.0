"use client";

import React from "react";
import { ExpandableCategory } from "./ExpandableCategory";
import { DropdownItem } from "./DropdownItem";

interface NavigationItem {
  key?: string;
  label: string;
  href?: string;
  hasDropdown?: boolean;
  dropdownItems?: NavigationItem[];
  isCategory?: boolean;
  items?: NavigationItem[];
}

interface ExpandableDropdownMenuProps {
  items: NavigationItem[];
  textColor?: string;
  backgroundColor: string;
  onClose: () => void;
}

export const ExpandableDropdownMenu: React.FC<ExpandableDropdownMenuProps> = ({
  items,
  textColor = "inherit",
  backgroundColor = "#ffffff",
  onClose,
}) => {
  if (items.length === 0) {
    return (
      <div
        data-testid="expandable-dropdown-menu-empty"
        className="dropdown-menu absolute top-full left-0 mt-0 bg-white text-black min-w-[200px] z-[1000] p-4 animate-dropdown-enter-left"
        style={{
          backgroundColor: textColor,
          color: backgroundColor,
          boxShadow: "#0000001f 0px 0px 3px 0px",
        }}
      >
        Coming Soon
      </div>
    );
  }

  return (
    <div
      data-testid="expandable-dropdown-menu"
      className="dropdown-menu absolute top-full left-0 mt-[11px] pb-4 bg-white text-black min-w-[280px] z-[1000] py-2 animate-dropdown-enter rounded-lg"
      style={{
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
      }}
      role="menu"
    >
      {items.map((item, index) => (
        <div
          key={item.key || index}
          data-testid={`expandable-dropdown-menu-item-${item.key || index}`}
        >
          {item.isCategory ? (
            // Expandable Category with nested items
            <ExpandableCategory item={item} onClose={onClose} />
          ) : (
            // Regular dropdown item
            <DropdownItem item={item} onClose={onClose} />
          )}
        </div>
      ))}
    </div>
  );
};
