"use client";

import { Box } from "@/ui/atomic";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";

interface NavigationItem {
  key?: string;
  label: string;
  href?: string;
  hasDropdown?: boolean;
  dropdownItems?: NavigationItem[];
  isCategory?: boolean;
  items?: NavigationItem[];
}

const CategoryNavigationItem: React.FC<{
  item: NavigationItem;
  onClose: () => void;
}> = ({ item, onClose }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [contentHeight, setContentHeight] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight);
    }
  }, [isExpanded, item.items]);

  const handleClick = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <Box data-testid={`category-navigation-item-${item.key || item.label}`}>
      <button
        onClick={handleClick}
        aria-expanded={isExpanded}
        className="w-full flex items-center justify-between py-2 pl-4"
        data-testid={`category-navigation-dropdown-${item.key || item.label}`}
      >
        <p className="text-sm">{item.label}</p>
        {isExpanded ? (
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-opacity duration-300 ease-in-out"
            aria-hidden="true"
          >
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        ) : (
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-opacity duration-300 ease-in-out"
            aria-hidden="true"
          >
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        )}
      </button>
      {item.items && (
        <Box
          className="ml-6 border-l overflow-hidden transition-all duration-300 ease-in-out"
          style={{
            maxHeight: isExpanded ? `${contentHeight}px` : "0px",
            opacity: isExpanded ? 1 : 0,
          }}
          data-testid={`category-navigation-content-${item.key || item.label}`}
        >
          <div ref={contentRef}>
            {item.items.map((nestedItem, nestedIndex) => (
              <Link
                key={nestedItem.key || nestedIndex}
                href={nestedItem.href || "#"}
                onClick={onClose}
                className="block py-1 my-1 px-4 no-underline text-sm transition-opacity duration-300"
                style={{
                  opacity: isExpanded ? 1 : 0,
                }}
              >
                {nestedItem.label}
              </Link>
            ))}
          </div>
        </Box>
      )}
    </Box>
  );
};

export default CategoryNavigationItem;
