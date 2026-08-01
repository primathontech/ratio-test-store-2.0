import { WidgetProps } from "@/widgets/types";

/**
 * Welcome section widget data
 */
export interface WelcomeData {
  /** "Welcome to" heading text */
  headingPrefix?: string;
  /** Brand mission paragraph */
  bodyText?: string;
  /** Certification badges */
  badges?: WelcomeBadge[];
}

/**
 * A certification badge (icon + label)
 */
export interface WelcomeBadge {
  /** Badge label text */
  label: string;
  /** Badge icon image path */
  iconSrc: string;
  /** Alt text for the icon */
  alt: string;
}

/**
 * Welcome widget settings
 */
export interface WelcomeSettings {
  /** Widget variant @default "v1" */
  variant?: string;
  /** Render only responsive banner images (no overlay content) */
  imageOnly?: boolean;
  /** "Welcome to" heading text */
  headingPrefix?: string;
  /** Brand mission paragraph */
  bodyText?: string;
  /** Logo image path */
  logoPath?: string;
  /** Desktop background image path */
  bgDesktopPath?: string;
  /** Mobile background image path */
  bgMobilePath?: string;
  /** Certification badges */
  badges?: Array<{ label: string; iconSrc: string; alt: string }>;
}

/**
 * Props for the Welcome component
 */
export type WelcomeProps = WidgetProps<WelcomeData, WelcomeSettings>;

/**
 * Image paths relative to public directory
 */
export const IMAGE_PATHS = {
  bgDesktop: "/assets/nintarababy/welcome/bg-desktop.webp",
  bgMobile: "/assets/nintarababy/welcome/bg-mobile.webp",
  logo: "/assets/nintarababy/welcome/nintara-logo.webp",
  iconGotsCertified: "/assets/nintarababy/welcome/icon-gots-certified.webp",
  iconEuUsCertified: "/assets/nintarababy/welcome/icon-eu-us-certified.webp",
  iconCreatedForComfort:
    "/assets/nintarababy/welcome/icon-created-for-comfort.webp",
  iconOrganicCotton: "/assets/nintarababy/welcome/icon-organic-cotton.webp",
} as const;

/**
 * Design tokens extracted from nintarababy.in Welcome section
 */
export const DESIGN_TOKENS = {
  colors: {
    headingDark: "#004750",
    textBody: "#092A33",
    wrapperMobileBg: "#ffffff",
  },
  typography: {
    fontFamily: "Figtree, sans-serif",
    heading: {
      fontSize: "30px",
      fontWeight: "500",
      lineHeight: "39px",
    },
    body: {
      fontSize: "20px",
      fontWeight: "300",
      lineHeight: "30px",
      mobileFontSize: "16px",
      tabletFontSize: "18px",
    },
    badge: {
      fontSize: "20px",
      fontWeight: "500",
      lineHeight: "26px",
      mobileFontSize: "16px",
    },
  },
  spacing: {
    sectionHeight: "420px",
    innerMaxWidth: "922px",
    iconRowMarginTop: "25px",
    iconSize: "60px",
    mobilePadding: "30px 1.5rem",
    mobileSectionMarginBottom: "30px",
    mobileIconGridGap: "14px",
  },
  logo: {
    maxWidth: "50%",
    width: "470px",
    height: "70px",
  },
} as const;

/**
 * Default certification badges matching the source site
 */
export const DEFAULT_BADGES: WelcomeBadge[] = [
  {
    label: "GOTS Certified",
    iconSrc: IMAGE_PATHS.iconGotsCertified,
    alt: "GOTS Certified",
  },
  {
    label: "EU & US Certified Safe",
    iconSrc: IMAGE_PATHS.iconEuUsCertified,
    alt: "EU & US Certified Safe",
  },
  {
    label: "Created For Comfort",
    iconSrc: IMAGE_PATHS.iconCreatedForComfort,
    alt: "Created For Comfort",
  },
  {
    label: "Organic Cotton",
    iconSrc: IMAGE_PATHS.iconOrganicCotton,
    alt: "Organic Cotton",
  },
];

/**
 * Default body text matching the source site
 */
export const DEFAULT_BODY_TEXT =
  "Parenthood is a beautiful journey, filled with moments that deserve comfort and joy. Guided by parents, we craft thoughtful baby essentials, designed to be luxuriously soft, safe, and made to last for your little one.";
