import React from "react";
import { WidgetProps } from "@/widgets/types";
import type { ApiProduct } from "@/widgets/common/ProductDetail/types";

export interface FooterLink {
  name: string;
  href: string;
  /** When true, render as an external link (opens a new tab). Maps from the
   *  useNav leaf/column `isExternal` flag. */
  isExternal?: boolean;
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

  /* ── Per-section nav-menu handles (admin-managed via useNav) ──
   * Each footer link column is driven by its own menu handle, mirroring the
   * header's useNav data contract. The section LINKS come from the menu; the
   * section TITLE stays from the *Title settings above. When a menu is
   * unavailable the section falls back to its *Links setting (so it's never
   * blank). */
  /** @default "about-us" */
  aboutMenuHandle?: string;
  /** @default "useful-links" */
  usefulLinksMenuHandle?: string;
  /** @default "our-salons" */
  ourSalonsMenuHandle?: string;
  /** @default "categories" */
  categoriesMenuHandle?: string;
  /** @default "my-account" */
  myAccountMenuHandle?: string;
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
