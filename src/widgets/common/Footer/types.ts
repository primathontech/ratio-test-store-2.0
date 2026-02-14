export interface FooterProps {
  id: string;
  variant?: "v1";
  settings?: {
    backgroundColor?: string;
    showSocialLinks?: boolean;
    showPaymentMethods?: boolean;
    showAppDownload?: boolean;
    // Footer content properties
    mobileFooterTagline?: string;
    logoUrl?: string;
    logoAlt?: string;
    logoTagline?: string;
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
    productData?: any;
    selectedVariantId?: string;
    addToCartText?: string;
    soldOutText?: string;
  };
  responsive?: {
    mobile?: Partial<FooterProps["settings"]>;
    tablet?: Partial<FooterProps["settings"]>;
    desktop?: Partial<FooterProps["settings"]>;
  };
  data?: any;
}

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
