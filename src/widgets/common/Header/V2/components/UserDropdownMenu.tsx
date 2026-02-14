"use client";

import React from "react";
import { Box, Flex, Text, Link } from "@/ui/atomic";

interface UserDropdownMenuProps {
  textColor: string;
  onClose: () => void;
  userActionsTranslations?: any;
}

export const UserDropdownMenu: React.FC<UserDropdownMenuProps> = ({
  textColor,
  onClose,
  userActionsTranslations = {},
}) => {
  const menuItems = [
    {
      key: "profile",
      label: userActionsTranslations.user_profile,
      href: "/account/profile",
      icon: (
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
        >
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
      ),
    },
    {
      key: "orders",
      label: userActionsTranslations.my_orders,
      href: "/account/orders",
      icon: (
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
        >
          <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
          <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
        </svg>
      ),
    },
    {
      key: "wishlist",
      label: userActionsTranslations.wishlist,
      href: "/account/wishlist",
      icon: (
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
        >
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
        </svg>
      ),
    },
  ];

  const handleLogout = () => {
    // In real app, this would handle logout
    console.log("Logging out...");
    onClose();
  };

  return (
    <Box
      data-testid="header-user-dropdown-menu"
      className="
        user-dropdown-menu absolute top-full right-0 mt-2 bg-white text-black
        rounded-xl shadow-2xl border border-black/10 min-w-[200px] z-[1000]
        opacity-100 translate-y-0 transition-all duration-200 ease-out py-2
        backdrop-blur-sm animate-in fade-in slide-in-from-top-2
      "
      role="menu"
    >
      {/* User Info Header */}
      <Box
        data-testid="header-user-dropdown-user-info"
        className="px-4 py-3 border-b border-gray-100"
      >
        <Flex align="center" gap="12px">
          <Box
            data-testid="header-user-dropdown-avatar"
            className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-600"
          >
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
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </Box>
          <Box data-testid="header-user-dropdown-user-details">
            <Text size="sm" weight="semibold" className="text-gray-900">
              John Doe
            </Text>
            <Text size="xs" className="text-gray-600">
              john@example.com
            </Text>
          </Box>
        </Flex>
      </Box>

      {/* Menu Items */}
      <Box data-testid="header-user-dropdown-menu-items" className="py-1">
        {menuItems.map((item) => (
          <Link
            key={item.key}
            data-testid={`header-user-dropdown-menu-item-${item.key}`}
            href={item.href}
            role="menuitem"
            onClick={onClose}
            className="
              flex items-center gap-3 py-3 px-4 text-gray-700 no-underline text-sm
              font-medium transition-all duration-200 ease-in-out rounded-md mx-2
              hover:bg-gray-50 hover:text-black
            "
          >
            {item.icon}
            <Text size="sm" weight="medium">
              {item.label}
            </Text>
          </Link>
        ))}
      </Box>

      {/* Logout Button */}
      <Box
        data-testid="header-user-dropdown-logout-section"
        className="py-1 border-t border-gray-100 mt-1"
      >
        <button
          data-testid="header-user-dropdown-logout-button"
          onClick={handleLogout}
          role="menuitem"
          className="
            w-full flex items-center gap-3 py-3 px-4 bg-transparent border-none
            text-red-600 text-sm font-medium text-left cursor-pointer
            transition-all duration-200 ease-in-out rounded-md mx-2
            hover:bg-red-50 hover:text-red-600
          "
        >
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
          >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16,17 21,12 16,7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
          <Text size="sm" weight="medium">
            {userActionsTranslations.logout}
          </Text>
        </button>
      </Box>
    </Box>
  );
};
