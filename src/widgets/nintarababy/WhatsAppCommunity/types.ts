import { WidgetProps } from "@/widgets/types";

/**
 * WhatsAppCommunity widget settings
 */
export interface WhatsAppCommunitySettings {
  /** Widget variant @default "v1" */
  variant?: string;
}

/**
 * WhatsAppCommunity widget data
 */
export interface WhatsAppCommunityData {
  /** Headline text */
  headline?: string;
  /** Description / body text (may contain HTML for <strong>) */
  description?: string;
  /** CTA button text */
  ctaText?: string;
  /** CTA link URL */
  ctaUrl?: string;
}

/**
 * Props for the WhatsAppCommunity component
 */
export type WhatsAppCommunityProps = WidgetProps<
  WhatsAppCommunityData,
  WhatsAppCommunitySettings
>;

/**
 * Design tokens extracted from nintarababy.in WhatsAppCommunity section
 * Source: https://nintarababy.in/products/ergopod-feeding-pillow-lucky-clover
 * Section selector: #shopify-section-template--24784210329906__whatsapp_comunity_pWgHD3
 * Rendered height: 315px | topOffset: 4338px
 */
export const DESIGN_TOKENS = {
  colors: {
    background: "#ffffff",
    text: "#092a33",
    ctaBackground: "#25D366",
    ctaBackgroundHover: "#1ebe5d",
    ctaText: "#ffffff",
  },
  typography: {
    fontFamily: "Figtree, sans-serif",
    headline: {
      fontSize: "26px",
      fontSizeMobile: "20px",
      fontSizeSmallMobile: "18px",
      fontWeight: "600",
      lineHeight: "1.3",
    },
    body: {
      fontSize: "16px",
      fontSizeMobile: "14px",
      fontWeight: "400",
      lineHeight: "1.6",
    },
    cta: {
      fontSize: "16px",
      fontSizeMobile: "15px",
      fontWeight: "600",
      lineHeight: "1",
    },
    freeGiftBold: {
      fontWeight: "700",
    },
  },
  spacing: {
    sectionPaddingDesktop: "40px 80px",
    sectionPaddingMobile: "30px 20px",
    sectionPaddingSmallMobile: "24px 16px",
    containerMaxWidth: "1420px",
    gap: "40px",
    gapMobile: "24px",
    contentGap: "12px",
    ctaMarginTop: "12px",
    ctaPaddingDesktop: "14px 32px",
    ctaPaddingMobile: "12px 28px",
    ctaIconGap: "8px",
    minHeightDesktop: "315px",
  },
  icon: {
    widthDesktop: "120px",
    heightDesktop: "120px",
    widthMobile: "90px",
    heightMobile: "90px",
  },
  borders: {
    ctaRadius: "60px",
  },
  animation: {
    reveal: {
      duration: "0.6s",
      easing: "cubic-bezier(0, 0, 0.3, 1)",
      translateY: "2rem",
      opacityFrom: "0.01",
    },
    ctaHover: {
      duration: "0.2s",
      easing: "ease",
    },
    observerRootMargin: "0px 0px -50px 0px",
  },
} as const;

/**
 * Icon paths for downloaded SVG assets
 */
export const ICON_PATHS = {
  whatsappIcon: "/nintarababy/WhatsAppCommunity/icons/whatsapp-icon.svg",
} as const;

/**
 * Default headline text matching the source
 */
export const DEFAULT_HEADLINE =
  "You\u2019re invited to the Nintara Baby Inner Circle";

/**
 * Default description text matching the source (uses dangerouslySetInnerHTML)
 */
export const DEFAULT_DESCRIPTION =
  "our WhatsApp Community, filled with inspiration, care notes, and joyful rituals for you and your baby. Your <strong>FREE GIFT</strong> awaits!";

/**
 * Default CTA configuration
 */
export const DEFAULT_CTA_TEXT = "Join now";
export const DEFAULT_CTA_URL = "https://shr.pn/nintarawhatsappwebsite";
