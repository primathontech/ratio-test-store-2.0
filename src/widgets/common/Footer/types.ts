import React from "react";
import { WidgetProps } from "@/widgets/types";

export interface FooterLink {
  name: string;
  href: string;
}

export interface SocialLink {
  name: string;
  href: string;
  icon: string;
}

export interface PaymentMethod {
  name: string;
  icon: string;
  image: string;
}

export interface ServiceIconItem {
  name: string;
  image: string;
}

export interface MobileNavigationItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path: string;
}

/**
 * Footer widget settings
 */
export interface FooterSettings {
  variant?: string;
  backgroundColor?: string;
  showSocialLinks?: boolean;
  showPaymentMethods?: boolean;
  showAppDownload?: boolean;
  mobileFooterTagline?: string;
  logoUrl?: string;
  logoAlt?: string;
  appDownloadText?: string;
  googlePlayUrl?: string;
  appStoreUrl?: string;
  googlePlayImage?: string;
  googlePlayAlt?: string;
  appStoreImage?: string;
  appStoreAlt?: string;
  serviceSectionsIcons?: ServiceIconItem[];
  aboutTitle?: string;
  aboutLinks?: FooterLink[];
  usefulLinksTitle?: string;
  usefulLinks?: FooterLink[];
  ourSalonsTitle?: string;
  ourSalonsLinks?: FooterLink[];
  categoriesTitle?: string;
  categoriesLinks?: FooterLink[];
  myAccountTitle?: string;
  myAccountLinks?: FooterLink[];
  socialLinks?: SocialLink[];
  paymentProtectionText?: string;
  copyrightText?: string;
  paymentMethods?: PaymentMethod[];
}

/**
 * Footer widget data
 */
export interface FooterData {
  // Static content — data is hardcoded in the V1 component
}

/**
 * Props for the Footer component
 */
export type FooterProps = WidgetProps<FooterData, FooterSettings>;
