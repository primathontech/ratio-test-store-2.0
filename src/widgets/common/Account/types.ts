import { WidgetProps } from "@/widgets/types";

export enum NavItemId {
  Dashboard = "dashboard",
  Orders = "orders",
  Addresses = "addresses",
  Contact = "contact",
  Chat = "chat",
  Logout = "logout",
}

export enum AccountVariant {
  V1 = "v1",
}

export interface AccountSettings {
  variant?: AccountVariant;
  // Sidebar settings
  showGetAppBanner?: boolean;
  getAppBannerIcon?: string;
  getAppBannerTitle?: string;
  getAppBannerSubtitle?: string;
  getAppButtonText?: string;
  getAppButtonUrl?: string;
  // Navigation items
  navigationItems?: NavigationItem[];
  // Account details
  accountDetailsTitle?: string;
  // Translation keys
  greetingText?: string;
  logoutText?: string;
  notYouText?: string;
  accountDetailsLabel?: string;
  nameLabel?: string;
  emailLabel?: string;
}

export interface NavigationItem {
  id: NavItemId;
  label: string;
  icon?: string;
  href: string;
  badge?: string | number;
  isActive?: boolean;
  isLogout?: boolean;
  className?: string;
}

export interface AccountData {
  customer?: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
  };
  addressesCount?: number;
}

export type AccountProps = WidgetProps<AccountData, AccountSettings>;
