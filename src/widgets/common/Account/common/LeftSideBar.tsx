"use client";

import Image from "next/image";
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
import { NavItemId, NavigationItem } from "../types";

const DEFAULT_APP_URL = "https://onelink.to/zwhyy8";

const AppIcon = () => (
  <div className="lg:w-[26px] xl:w-[46px] lg:h-[26px] xl:h-[46px] rounded-lg flex items-center justify-center overflow-hidden">
    <Image
      src="https://bblunt.com/cdn/shop/files/bbluntIcon.webp?v=1760440322"
      alt="BBLUNT App Icon"
      width={48}
      height={48}
      className="object-contain"
      unoptimized
    />
  </div>
);

interface LeftSideBarProps {
  showGetAppBanner?: boolean;
  getAppBannerTitle?: string;
  getAppBannerSubtitle?: string;
  getAppButtonText?: string;
  getAppButtonUrl?: string;
  navigationItems: NavigationItem[];
  onLogout: () => void;
  isNavSticky?: boolean;
}

export const LeftSideBar: React.FC<LeftSideBarProps> = ({
  showGetAppBanner = true,
  getAppBannerTitle = "Get the App",
  getAppBannerSubtitle = "To track your order status smoothly",
  getAppButtonText = "Use app",
  getAppButtonUrl: getAppButtonUrlProp,
  navigationItems,
  onLogout,
  isNavSticky = false,
}) => {
  const getAppButtonUrl =
    getAppButtonUrlProp && getAppButtonUrlProp !== "#"
      ? getAppButtonUrlProp
      : DEFAULT_APP_URL;

  const renderIcon = (id: NavItemId) => {
    switch (id) {
      case NavItemId.Dashboard:
        return <DashboardIcon />;
      case NavItemId.Orders:
        return <OrderHistoryIcon />;
      case NavItemId.Addresses:
        return <AddressIcon />;
      case NavItemId.Contact:
        return <ContactIcon />;
      case NavItemId.Chat:
        return <ChatIcon />;
      case NavItemId.Logout:
        return <LogoutIcon />;
      default:
        return null;
    }
  };

  return (
    <aside>
      {/* Get the App Banner */}
      {showGetAppBanner && (
        <div className="bg-primary rounded-lg px-4 pt-4 pb-5 mb-2.5 flex items-center gap-2">
          <AppIcon />
          <div className="flex-1">
            <p className="text-white font-extrabold text-sm leading-7">
              {getAppBannerTitle}
            </p>
            <p className="text-white text-xs opacity-90 font-medium leading-7">
              {getAppBannerSubtitle}
            </p>
          </div>
          <a
            href={getAppButtonUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white px-3 py-2 border border-white rounded-[5px] text-xs font-bold whitespace-nowrap"
          >
            {getAppButtonText}
          </a>
        </div>
      )}

      {/* First nav item (Dashboard) - scrolls with page */}
      {navigationItems.length > 0 &&
        (() => {
          const item = navigationItems[0];
          const isLogout = item.id === NavItemId.Logout;
          const content = (
            <div
              className={`flex items-center px-[15px] py-2.5 border-b border-gray-200 transition-colors text-black ${
                item.isActive ? "bg-gray-100" : "hover:bg-gray-100"
              }`}
            >
              <span className="flex-shrink-0">{renderIcon(item.id)}</span>
              <span className="text-sm">
                {item.label}
                {item.badge !== undefined && (
                  <span className="text-sm ml-1">({item.badge})</span>
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
            const isLogout = item.id === NavItemId.Logout;
            const content = (
              <div
                className={`flex items-center px-[15px] py-2.5 border-b border-gray-200 transition-colors text-black ${
                  item.isActive ? "bg-gray-100" : "hover:bg-gray-100"
                }`}
              >
                <span className="flex-shrink-0">{renderIcon(item.id)}</span>
                <span className="text-sm">
                  {item.label}
                  {item.badge !== undefined && (
                    <span className="text-sm ml-1">({item.badge})</span>
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
              <Link
                key={item.id}
                href={item.href}
                className={`block ${item.className || ""}`}
              >
                {content}
              </Link>
            );
          })}
        </nav>
      )}
    </aside>
  );
};
