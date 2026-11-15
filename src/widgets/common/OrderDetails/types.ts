import { WidgetProps } from "@/widgets/types";

export interface OrderDetailsData {
  orderId?: string;
}

export interface OrderDetailsSettings {
  variant?: string;
  showGetAppBanner?: boolean;
  getAppBannerTitle?: string;
  getAppBannerSubtitle?: string;
  getAppButtonText?: string;
  getAppButtonUrl?: string;
  greetingText?: string;
  logoutText?: string;
  notYouText?: string;
  [key: string]: any;
}

export type OrderDetailsProps = WidgetProps<
  OrderDetailsData,
  OrderDetailsSettings
>;
