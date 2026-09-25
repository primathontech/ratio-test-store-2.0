"use client";

import Link from "next/link";
import React from "react";
import {
  AddressIcon,
  ChatIcon,
  ContactIcon,
  DashboardIcon,
  LogoutIcon,
  OrderHistoryIcon,
} from "../icons/index";
import { NavigationItem } from "../types";

interface LeftSideBarProps {
  navigationItems: NavigationItem[];
  onLogout: () => void;
  isNavSticky?: boolean;
}

export const LeftSideBar: React.FC<LeftSideBarProps> = ({
  navigationItems,
  onLogout,
  isNavSticky = false,
}) => {
  const renderIcon = (id: string) => {
    switch (id) {
      case "dashboard":
        return <DashboardIcon />;
      case "orders":
        return <OrderHistoryIcon />;
      case "addresses":
        return <AddressIcon />;
      case "contact":
        return <ContactIcon />;
      case "chat":
        return <ChatIcon />;
      case "logout":
        return <LogoutIcon />;
      default:
        return null;
    }
  };

  return (
    <aside>
      {/* First nav item (Dashboard) - scrolls with page */}
      {navigationItems.length > 0 &&
        (() => {
          const item = navigationItems[0];
          const isLogout = item.id === "logout";
          const content = (
            <div
              className={`flex items-center px-[15px] py-[10px] border-b border-gray-200 transition-colors text-black ${
                item.isActive ? "bg-gray-50" : "hover:bg-gray-50"
              }`}
            >
              <span className="flex-shrink-0">{renderIcon(item.id)}</span>
              <span className="text-[14px]">
                {item.label}
                {item.badge !== undefined && (
                  <span className="text-[14px] ml-1">({item.badge})</span>
                )}
              </span>
            </div>
          );
          return (
            <div className="rounded-t-[5px] border border-b-0 border-gray-200 rounded-b-none">
              {isLogout ? (
                <button
                  key={item.id}
                  onClick={onLogout}
                  className="w-full text-left font-normal"
                >
                  {content}
                </button>
              ) : (
                <Link key={item.id} href={item.href} className="block">
                  {content}
                </Link>
              )}
            </div>
          );
        })()}

      {/* From Order history onward - sticky, touches header */}
      {navigationItems.length > 1 && (
        <nav
          className={`rounded-b-[5px] rounded-t-none border border-gray-200 -mt-px ${
            isNavSticky ? "md:sticky md:top-[70px] self-start" : ""
          }`}
        >
          {navigationItems.slice(1).map((item) => {
            const isLogout = item.id === "logout";
            const content = (
              <div
                className={`flex items-center px-[15px] py-[10px] border-b border-gray-200 last:border-b-0 transition-colors text-black ${
                  item.isActive ? "bg-gray-50" : "hover:bg-gray-50"
                }`}
              >
                <span className="flex-shrink-0">{renderIcon(item.id)}</span>
                <span className="text-[14px]">
                  {item.label}
                  {item.badge !== undefined && (
                    <span className="text-[14px] ml-1">({item.badge})</span>
                  )}
                </span>
              </div>
            );

            if (isLogout) {
              return (
                <button
                  key={item.id}
                  onClick={onLogout}
                  className="w-full text-left font-normal"
                >
                  {content}
                </button>
              );
            }

            return (
              <Link key={item.id} href={item.href} className="block">
                {content}
              </Link>
            );
          })}
        </nav>
      )}
    </aside>
  );
};
