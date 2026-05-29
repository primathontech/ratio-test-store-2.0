import { getFirstValue } from "../../AdditionalInformation/utils/getAdditionalInfoItems";
import type { SalePageBannerSettings } from "../../SalePageBanner/types";
import type { CollectionHeroBannerData, HowToShopRichTextNode } from "../types";

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/**
 * Convert the `how_to_shop` rich-text tree (root → list → list-item → text)
 * into the `{ id, text }[]` shape consumed by the HowToShopModal. Inline
 * bold runs are emitted as `<strong>…</strong>`.
 */
function richTextToHowToShopSteps(
  root: HowToShopRichTextNode | undefined
): { id: number; text: string }[] {
  if (!root || !Array.isArray(root.children)) {
    return [];
  }

  const list = root.children.find((child) => child?.type === "list");
  const listItems = list?.children?.filter((c) => c?.type === "list-item");
  if (!listItems || listItems.length === 0) {
    return [];
  }

  return listItems.map((item, index) => {
    const text = (item.children ?? [])
      .filter((c) => c?.type === "text")
      .map((c) => {
        const raw = escapeHtml(c.value ?? "");
        return c.bold ? `<strong>${raw}</strong>` : raw;
      })
      .join("");
    return { id: index + 1, text };
  });
}

/**
 * Map collection metadata (`sale_promo_banner` + `how_to_shop`) into
 * SalePageBanner settings. Returns `null` when the metadata is absent
 * so the caller can fall back to the regular banner carousel.
 */
export function extractSalePromoBannerData(
  collectionData: CollectionHeroBannerData
): SalePageBannerSettings | null {
  const metadata = collectionData?.data?.data?.collectionByHandle?.metadata;
  const promoItems = metadata?.sale_promo_banner?.value;
  const promo = Array.isArray(promoItems) ? promoItems[0] : undefined;
  if (!promo) {
    return null;
  }

  // Every metaobject field below may ship as either a bare string or a
  // single-element array (Shopify v2 metaobject quirk). `getFirstValue`
  // normalises both shapes — same helper used across PDP/AdditionalInfo.
  const fields = promo.fields ?? {};
  const desktopImage = getFirstValue(fields.desktop_image?.value) || "";
  const mobileImage = getFirstValue(fields.image?.value) || desktopImage;

  if (!desktopImage && !mobileImage) {
    return null;
  }

  const offerTitle = getFirstValue(fields.title?.value) || "";
  const offerPrice = getFirstValue(fields.subtitle?.value) || "";
  const couponCode = getFirstValue(fields.discount_code?.value) || "";
  const expiryText = getFirstValue(fields.price_text?.value) || "";
  const endDateString = getFirstValue(fields.end_sale_date?.value) || "";

  const howToShopSteps = richTextToHowToShopSteps(metadata?.how_to_shop?.value);

  return {
    variant: "v1",
    mobileSrc: { src: mobileImage, alt: offerTitle || "Sale Banner" },
    desktopSrc: { src: desktopImage, alt: offerTitle || "Sale Banner" },
    offerTitle,
    offerPrice,
    currencySymbol: "",
    couponCode,
    expiryText,
    endDateString,
    timerInterval: 1000,
    bannerCtaLabel: howToShopSteps.length > 0 ? "How to shop" : "",
    howToShopTitle: "How to shop",
    howToShopSteps,
    // T&C copy isn't shipped from the collection API — hardcoded to match
    // the live bblunt.com "How to shop" modal.
    termsAndConditionsTitle: "Terms and conditions",
    termsAndConditionsPoints:
      "Offer cannot be clubbed with other coupons. Not applicable on kits & combos.",
    primaryButtonLabel: "Got it",
  };
}
