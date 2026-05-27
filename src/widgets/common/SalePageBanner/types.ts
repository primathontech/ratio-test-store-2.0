import type { WidgetProps } from "@/widgets/types";

export type VariantType = "v1";

/** One step shown inside the "How to shop" modal. */
export interface IHowToShopStep {
  id: number;
  /** May contain inline HTML (e.g. `<strong>` highlights). */
  text: string;
}

/** Terms & conditions block inside the modal. */
export interface ITermsAndConditions {
  title: string;
  points: string;
}

export interface SalePageBannerSettings {
  variant?: VariantType | string;

  // Image — `{ src, alt }` shape for editor image picker (string accepted for backward compat)
  mobileSrc?: { src: string; alt: string } | string;
  desktopSrc?: { src: string; alt: string } | string;

  // Offer
  offerTitle?: string;
  offerPrice?: string | number;
  currencySymbol?: string;
  couponCode?: string;
  expiryText?: string;

  // Timer
  /** ISO-like end date string, e.g. "Jan 20, 2026 12:59:59" */
  endDateString?: string;
  /** Tick interval (ms). Defaults to 1000. */
  timerInterval?: number;

  // CTA
  bannerCtaLabel?: string;

  // Modal
  howToShopTitle?: string;
  howToShopSteps?: IHowToShopStep[];
  termsAndConditionsTitle?: string;
  termsAndConditionsPoints?: string;
  primaryButtonLabel?: string;
}

/** Static section — no API data needed. */
export interface SalePageBannerData {}

export type SalePageBannerProps = WidgetProps<
  SalePageBannerData,
  SalePageBannerSettings
>;
