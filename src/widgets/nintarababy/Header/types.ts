import { WidgetProps } from "@/widgets/types";

/**
 * A single dropdown sub-link
 */
export interface DropdownLink {
  /** Display text */
  text: string;
  /** Link URL */
  href: string;
  /** Nested child links (second level) */
  children?: { text: string; href: string }[];
}

/**
 * A single navigation link in the header
 */
export interface NavLink {
  /** Display text */
  text: string;
  /** Link URL */
  href: string;
  /** Whether the link has a "New" badge */
  hasBadge?: boolean;
  /** Badge text (e.g., "New") */
  badgeText?: string;
  /** Whether the link has a dropdown submenu */
  hasDropdown?: boolean;
  /** Dropdown sub-links */
  dropdownLinks?: DropdownLink[];
}

/**
 * NintaraHeader widget settings
 */
export interface NintaraHeaderSettings {
  /** Widget variant @default "v1" */
  variant?: string;
  /** Admin-managed nav-menu handle rendered via `@shopkit/navigation` (useNav).
   *  When the menu is published it drives the top nav; when unavailable the
   *  header falls back to collection metadata / `navLinks` / defaults.
   *  @default "main-menu" */
  menuHandle?: string;
  /** Whether the header is sticky @default true */
  isSticky?: boolean;
  /** Whether to hide the header on scroll down @default true */
  hideOnScrollDown?: boolean;
  /** Search input placeholder text */
  searchPlaceholder?: string;
  /** WhatsApp contact link */
  whatsappHref?: string;
  /** Cart link */
  cartHref?: string;
  /** Logo image path */
  logoPath?: string;
  /** Navigation links (overrides data.navLinks when provided) */
  navLinks?: NavLink[];
  /** Flat dropdown items — each has a category (parent nav text), text, and href.
   *  Component groups by category to rebuild dropdown structure.
   *  Sub-children inherit from DEFAULT_NAV_LINKS by matching href. */
  dropdownItems?: Array<{ category: string; text: string; href: string }>;
}

/**
 * NintaraHeader widget data
 */
export interface NintaraHeaderData {
  /** Navigation links */
  navLinks?: NavLink[];
  /** Logo alt text */
  logoAlt?: string;
  /** Logo href */
  logoHref?: string;
  /** Cart item count */
  cartCount?: number;
}

/**
 * Props for the NintaraHeader component
 */
export type NintaraHeaderProps = WidgetProps<
  NintaraHeaderData,
  NintaraHeaderSettings
>;

/**
 * Design tokens extracted from nintarababy.in header
 */
export const DESIGN_TOKENS = {
  colors: {
    background: "#ffffff",
    text: "#092a33",
    textHover: "#56cfe1",
    navLinkHover: "#c49330",
    border: "#e8ecf2",
    searchBorder: "#9CA3AF",
    searchFocusBorder: "rgba(71, 93, 104, 0.875)",
    badgeBackground: "#e5c645",
    badgeText: "#ffffff",
    cartBadgeBackground: "#000000",
    cartBadgeText: "#ffffff",
    overlayBackground: "rgba(0, 0, 0, 0.7)",
  },
  typography: {
    fontFamily: "Figtree, sans-serif",
    nav: {
      fontSize: "14px",
      fontWeight: "500",
      lineHeight: "14px",
    },
    search: {
      fontSize: "14px",
      fontWeight: "400",
    },
    badge: {
      fontSize: "11px",
      fontWeight: "500",
    },
    cartCount: {
      fontSize: "10px",
    },
  },
  spacing: {
    row1Height: "80px",
    row1HeightMobile: "45px",
    row1PaddingX: "40px",
    row1PaddingXMobile: "20px",
    row2Height: "60px",
    navPadding: "5px 13px",
    navPaddingWide: "5px 17.5px",
  },
  dimensions: {
    logoWidth: "clamp(210px, 20vw, 270px)",
    searchMinWidth: "300px",
    searchHeight: "50px",
    searchRadius: "38px",
    drawerWidth: "calc(100vw - 65px)",
    drawerMaxWidth: "325px",
  },
  transitions: {
    stickySlide: "transform 0.35s ease-in-out",
    stickyReveal: "transform 0.15s ease-out",
    iconHover: "0.35s cubic-bezier(0.25, 0.1, 0.25, 1)",
    colorTransition: "color 0.2s ease-in-out",
    dropdownReveal: "0.2s ease-in-out",
    drawerSlide: "transform 0.5s cubic-bezier(0.645, 0.045, 0.355, 1)",
    searchFocus: "border-color 0.5s ease",
  },
  sticky: {
    zIndex: 460,
    hideTransform: "translateY(-142px)",
    boxShadow: "rgba(0, 0, 0, 0.1) 0px 1px 3px",
  },
} as const;

/**
 * Default navigation links matching the source site
 */
export const DEFAULT_NAV_LINKS: NavLink[] = [
  {
    text: "Shop All",
    href: "/collections/all-products",
    hasDropdown: false,
  },
  {
    text: "Bestseller",
    href: "/collections/bestsellers",
    hasDropdown: false,
  },
  {
    text: "Baby Care",
    href: "/collections/baby-care",
    hasDropdown: true,
    dropdownLinks: [
      { text: "Baby Wash", href: "/collections/baby-wash" },
      { text: "Baby Shampoo", href: "/collections/baby-shampoo" },
      { text: "Baby Face Cream", href: "/collections/baby-face-cream" },
      { text: "Baby Lotion", href: "/collections/baby-lotion" },
    ],
  },
  {
    text: "Mom Care",
    href: "/collections/mom-care",
    hasDropdown: true,
    dropdownLinks: [
      { text: "Under Eye Cream", href: "/collections/under-eye-cream" },
    ],
  },
  {
    text: "Essentials",
    href: "/collections/essentials",
    hasDropdown: true,
    dropdownLinks: [
      { text: "Diaper Rash Cream", href: "/collections/diaper-rash-cream" },
      { text: "Natural Water Wipes", href: "/collections/natural-water-wipes" },
      { text: "All Day Baby Wipes", href: "/collections/all-day-baby-wipes" },
    ],
  },
];

/**
 * SVG icon paths for inline icons
 */
export const ICON_PATHS = {
  logo: "/assets/momsco/svg/momsco-logo-new.svg",
} as const;
