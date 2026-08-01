import { NavigationItem } from "../types";

export const getDefaultNavigationItems = (
  isDashboardPage: boolean,
  isOrdersPage: boolean,
  isAddressesPage: boolean,
  addressesCount: number = 0
): NavigationItem[] => [
  {
    id: "dashboard",
    label: "Dashboard",
    href: "/account",
    isActive: isDashboardPage,
  },
  {
    id: "orders",
    label: "Order history",
    href: "/pages/orders",
    isActive: isOrdersPage,
  },
  {
    id: "addresses",
    label: "Addresses",
    href: "/account/addresses",
    badge: addressesCount,
    isActive: isAddressesPage,
  },
  {
    id: "contact",
    label: "Contact Us",
    href: "mailto:support@hello@themomsco.com",
  },
  {
    id: "logout",
    label: "Log out",
    href: "/",
    isLogout: true,
  },
];

export const defaultSettings = {
  showGetAppBanner: false,
  getAppBannerTitle: "Get the App",
  getAppBannerSubtitle: "To track your order status smoothly",
  getAppButtonText: "Use app",
  getAppButtonUrl: "#",
  accountDetailsTitle: "Account details",
  greetingText: "Hello",
  logoutText: "Log out",
  notYouText: "not",
  nameLabel: "Name",
  emailLabel: "Email",
};
