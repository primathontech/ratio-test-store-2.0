import React from "react";
import { WidgetProps } from "@/widgets/types";
import type { ApiProduct } from "@/widgets/common/ProductDetail/types";

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
  /** Icon alt text (auto-filled by editor image picker). Falls back to name. */
  alt?: string;
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
  logoUrl?: { src: string; alt: string } | string;
  logoAlt?: string;
  appDownloadText?: string;
  googlePlayUrl?: string;
  appStoreUrl?: string;
  googlePlayImage?: { src: string; alt: string } | string;
  googlePlayAlt?: string;
  appStoreImage?: { src: string; alt: string } | string;
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
  /**
   * Nav-menu handle this footer renders, from `@shopkit/navigation`.
   * @default "footer"
   *
   * Same model as the header: the merchant manages the footer menu's content in
   * admin; this only selects which menu. Degrades gracefully when unavailable.
   */
  menuHandle?: string;
}

/**
 * Footer widget data
 */
export interface FooterData {
  success?: boolean;
  data?: ApiProduct | null;
}

/**
 * Props for the Footer component
 */
export type FooterProps = WidgetProps<FooterData, FooterSettings>;
