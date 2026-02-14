"use client";

import Link from "next/link";
import React from "react";

interface NavigationItem {
  key?: string;
  label: string;
  href?: string;
  hasDropdown?: boolean;
  dropdownItems?: NavigationItem[];
  isCategory?: boolean;
  items?: NavigationItem[];
}

interface DropdownItemProps {
  item: NavigationItem;
  onClose: () => void;
}

export const DropdownItem: React.FC<DropdownItemProps> = ({
  item,
  onClose,
}) => {
  return (
    <Link
      data-testid={`header-dropdown-item-link`}
      href={item.href || "#"}
      role="menuitem"
      onClick={onClose}
      className="block py-1 mt-2 px-8 no-underline text-text-base text-gray-600 font-medium hover:text-blue-500"
    >
      {item.label}
    </Link>
  );
};
