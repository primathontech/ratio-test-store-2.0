import { NavItemId, NavigationItem } from "../types";

export const getDefaultNavigationItems = (
  isDashboardPage: boolean,
  isOrdersPage: boolean,
  isAddressesPage: boolean,
  addressesCount: number = 0
): NavigationItem[] => [
  {
    id: NavItemId.Dashboard,
    label: "Dashboard",
    href: "/account",
    isActive: isDashboardPage,
  },
  {
    id: NavItemId.Orders,
    label: "Order history",
    href: "/pages/orders",
    isActive: isOrdersPage,
  },
  {
    id: NavItemId.Addresses,
    label: "Addresses",
    href: "/account/addresses",
    badge: addressesCount,
    isActive: isAddressesPage,
  },
  {
    id: NavItemId.Contact,
    label: "Contact Us",
    href: "https://support.bblunt.com/support/home",
  },
  {
    id: NavItemId.Chat,
    label: "Chat with us",
    href: "#",
    className: "lmchatwoot_order",
  },
  {
    id: NavItemId.Logout,
    label: "Log out",
    href: "/",
    isLogout: true,
  },
];

export const defaultSettings = {
  showGetAppBanner: true,
  getAppBannerTitle: "Get the App",
  getAppBannerSubtitle: "To track your order status smoothly",
  getAppButtonText: "Use app",
  getAppButtonUrl: "https://onelink.to/zwhyy8",
  accountDetailsTitle: "Account details",
  greetingText: "Hello",
  logoutText: "Log out",
  notYouText: "not",
  nameLabel: "Name",
  emailLabel: "Email",
};
