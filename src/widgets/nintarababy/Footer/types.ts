import { WidgetProps } from "@/widgets/types";

/**
 * Footer widget settings
 */
export interface FooterSettings {
  /** Widget variant @default "v1" */
  variant?: string;
  seoHeading?: string;
  contactAddress?: string;
  contactWhatsapp?: string;
  contactEmail?: string;
  contactUsHeading?: string;
  registeredOfficeLabel?: string;
  whatsappUsLabel?: string;
  emailUsLabel?: string;
  categoriesHeading?: string;
  helpHeading?: string;
  otherLinksHeading?: string;
  newsletterHeading?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  helpLinks?: Array<{ text: string; href: string; badge?: string }>;
  otherLinks?: Array<{ text: string; href: string }>;
  categoryLinks?: Array<{ text: string; href: string }>;
}

/**
 * Footer widget data (static content)
 */
export interface FooterData {
  seoHeading?: string;
  accordionTitle?: string;
  accordionContent?: string;
}

/**
 * Props for the Footer component
 */
export type FooterProps = WidgetProps<FooterData, FooterSettings>;

/**
 * Design tokens extracted from nintarababy.in footer
 */
export const DESIGN_TOKENS = {
  colors: {
    background: "#f5ead3",
    text: "#092a33",
    textMuted: "#878787",
    border: "#e6e6e6",
    borderMuted: "#c3c7c8",
    newsletterInputBg: "#ffffff",
    newsletterButtonBg: "#01464f",
    newsletterButtonHoverBg: "#c49330",
    newsletterButtonText: "#ffffff",
    socialIconFill: "#01464f",
    impBadgeBg: "#e5c645",
    impBadgeText: "#ffffff",
  },
  typography: {
    fontFamily: "Figtree, sans-serif",
    seoHeading: {
      fontSize: "28px",
      fontWeight: "600",
      lineHeight: "36.4px",
    },
    columnHeading: {
      fontSize: "20px",
      fontWeight: "600",
      lineHeight: "26px",
    },
    body: {
      fontSize: "14px",
      fontWeight: "400",
      lineHeight: "23.8px",
    },
    footerLinks: {
      fontSize: "14px",
      fontWeight: "400",
      lineHeight: "19.6px",
    },
    subscribeHeading: {
      fontSize: "20px",
      fontWeight: "600",
      lineHeight: "24px",
    },
    accordionToggle: {
      fontSize: "16px",
      fontWeight: "600",
    },
    categoryLinks: {
      fontSize: "14px",
      fontWeight: "400",
      lineHeight: "223%",
    },
  },
  spacing: {
    sectionPaddingTop: "40px",
    sectionPaddingTopMobile: "32px",
    containerMaxWidth: "1200px",
    columnGap: "30px",
    columnHeadingMarginBottom: "30px",
  },
  borders: {
    newsletterPill: "46px",
    newsletterButton: "40px",
    impBadge: "16px",
    categoryBorder: "1px solid #c3c7c8",
    accordionBorder: "1px solid #c3c7c8",
  },
} as const;

/** Links data for the Help column */
export const HELP_LINKS = [
  // {
  //   text: "GST Notice",
  //   href: "/pages/gst",
  //   badge: "IMP",
  // },
  {
    text: "Shipping & Delivery",
    href: "/shipping-policy",
  },
  {
    text: "Cancellation Policy",
    href: "/cancellation-policy",
  },
  // {
  //   text: "FAQs",
  //   href: "/pages/faq",
  // },
] as const;

/** Links data for the Other Links column */
export const OTHER_LINKS = [
  { text: "About Us", href: "/about-us" },
  // { text: "Blogs", href: "/blogs/blog" },
  { text: "Privacy Policy", href: "/privacy-policy" },
  { text: "Terms of Use", href: "/terms-of-use" },
] as const;

/** Contact information */
export const CONTACT_INFO = {
  address:
    "Visage Lines Personal Care Pvt Ltd. 5th Floor, Vipul PlazaGolf Course Road, Sector 54, Suncity, Gurgaon, Haryana. Pin Code: 122011",
  whatsapp: "+91 7419023569",
  whatsappUrl: "https://wa.me/+917419023569",
  email: "hello@themomsco.com",
  emailUrl: "mailto:hello@themomsco.com",
} as const;

/** Category links for the bottom section */
export const CATEGORY_LINKS = [
  { text: "Baby Wash", href: "/collections/baby-wash" },
  { text: "Baby Shampoo", href: "/collections/baby-shampoo" },
  { text: "Baby Face Cream", href: "/collections/baby-face-cream" },
  { text: "Baby Lotion", href: "/collections/baby-lotion" },
  { text: "Under Eye Cream", href: "/collections/under-eye-cream" },
  { text: "Diaper Rash Cream", href: "/collections/diaper-rash-cream" },
  { text: "Natural Water Wipes", href: "/collections/natural-water-wipes" },
  { text: "All Day Baby Wipes", href: "/collections/all-day-baby-wipes" },
] as const;

/** Social links */
export const SOCIAL_LINKS = {
  facebook: {
    url: "https://www.facebook.com/profile.php?id=61561442655559",
    title: "Follow on Facebook",
  },
  instagram: {
    url: "https://www.instagram.com/nintarababyindia/",
    title: "Follow on Instagram",
  },
} as const;

/** SEO accordion content */
export const SEO_ACCORDION = {
  title: "Welcome to Nintara Baby - Your Go-to Baby Essentials Online Store",
  content:
    "We are proud to feature an exclusive selection of organic cotton baby products. Our products are free of harmful chemicals and are made from natural materials that provide the highest level of comfort and care for your children.",
} as const;
