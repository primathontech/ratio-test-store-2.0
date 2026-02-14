"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";

interface NavigationItem {
  key?: string;
  label: string;
  href?: string;
  hasDropdown?: boolean;
  dropdownItems?: NavigationItem[];
  isCategory?: boolean;
  items?: NavigationItem[];
}

interface ExpandableCategoryProps {
  item: NavigationItem;
  onClose: () => void;
}

export const ExpandableCategory: React.FC<ExpandableCategoryProps> = ({
  item,
  onClose,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Normalize href to ensure it starts with / for absolute paths
  const normalizeHref = (href: string | undefined): string => {
    if (!href || href === "#") return "#";
    // If href doesn't start with /, add it to make it an absolute path
    return href.startsWith("/") ? href : `/${href}`;
  };

  return (
    <div
      data-testid={`expandable-category-container-${item.label}`}
      className="py-1"
    >
      <button
        data-testid={`expandable-category-button-${item.label}`}
        className="w-full flex gap-3 items-center justify-between px-8 py-1 text-text-base text-gray-600 font-medium cursor-pointer hover:text-blue-500"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <Link
          data-testid="expandable-category-link"
          href={normalizeHref(item.href)}
          className="flex-1 flex"
        >
          {item.label}
        </Link>
        <span
          data-testid={`expandable-category-icon-wrapper-${item.label}`}
          className="flex justify-end w-20"
        >
          <svg
            className={`w-6 h-6 transition-transform duration-300 ${isExpanded ? "rotate-180" : "rotate-0"}`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="6,9 12,15 18,9"></polyline>
          </svg>
        </span>
      </button>
      <div
        data-testid={`expandable-category-dropdown-${item.label}`}
        className={`ml-5 border-l border-gray-200 transition-all duration-300 ease-in-out ${
          isExpanded
            ? "max-h-96 opacity-100 overflow-y-auto"
            : "max-h-0 opacity-0 overflow-hidden"
        }`}
      >
        {item.items?.map((subItem, subIndex) => (
          <Link
            key={subItem.key || subIndex}
            data-testid={`expandable-category-sublink-${subIndex}`}
            href={normalizeHref(subItem.href)}
            role="menuitem"
            onClick={onClose}
            className="block py-2 px-8 no-underline text-text-base text-gray-600 hover:text-blue-500"
          >
            {subItem.label}
          </Link>
        ))}
      </div>
    </div>
  );
};
