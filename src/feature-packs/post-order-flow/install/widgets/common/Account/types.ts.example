import { WidgetProps } from "@/widgets/types";

export interface AccountSettings {
  variant?: "v1";
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
  id: string;
  label: string;
  icon?: string;
  href: string;
  badge?: string | number;
  isActive?: boolean;
  isLogout?: boolean;
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

export interface AccountProps extends WidgetProps<
  AccountData,
  AccountSettings
> {}
