import { WidgetProps } from "@/widgets/types";
import { NavItemId } from "../Account/types";

// Order Widget Variant Enum
export enum OrdersVariant {
  V1 = "v1",
}

export interface OrdersSettings {
  variant?: OrdersVariant;
  // Sidebar settings
  showGetAppBanner?: boolean;
  getAppBannerIcon?: string;
  getAppBannerTitle?: string;
  getAppBannerSubtitle?: string;
  getAppButtonText?: string;
  getAppButtonUrl?: string;
  // Navigation items
  navigationItems?: NavigationItem[];
  // Translation keys
  greetingText?: string;
  logoutText?: string;
  notYouText?: string;
}

export interface NavigationItem {
  id: NavItemId;
  label: string;
  icon?: string;
  href: string;
  badge?: string | number;
  isActive?: boolean;
  isLogout?: boolean;
}

export interface OrdersData {
  customer?: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
  };
  orders?: Array<{
    id: string;
    orderNumber: string;
    placedOn?: string;
    date?: string;
    paymentStatus?: string;
    deliveryBy?: string;
    total: string;
    orderStatus?: string;
    status?: string;
    items?: Array<{
      title: string;
      quantity: number;
      price: string;
    }>;
  }>;
  addressesCount?: number;
}

export type OrdersProps = WidgetProps<OrdersData, OrdersSettings>;
