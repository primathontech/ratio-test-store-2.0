import {
  IBannerCarouselItem,
  MediaContentType,
} from "../../BannerCarousel/types";
import {
  ensureArray,
  getFirstValue,
} from "../../AdditionalInformation/utils/getAdditionalInfoItems";
import type { CollectionBannerItem, CollectionHeroBannerData } from "../types";

// Strip any absolute origin so links resolve on the current merchant domain.
// For an absolute URL we keep only pathname + search + hash; relative URLs and
// "#" pass through unchanged. Merchant-agnostic: works for any host.
function extractPathFromUrl(url: string): string {
  if (!url || url === "#") {
    return "#";
  }

  try {
    const parsed = new URL(url);
    return `${parsed.pathname}${parsed.search}${parsed.hash}`;
  } catch {
    // Not an absolute URL (e.g. already a relative path) — return as-is.
    return url;
  }
}

export function extractBannerData(
  collectionData: CollectionHeroBannerData
): IBannerCarouselItem[] {
  const metadata = collectionData?.data?.data?.collectionByHandle?.metadata;

  if (!metadata) {
    return [];
  }

  const collectionBanners = ensureArray<CollectionBannerItem>(
    metadata.collection_banners?.value
  );

  if (collectionBanners.length > 0) {
    return collectionBanners
      .filter((banner) => banner?.status === "active")
      .map((banner, index) => {
        const desktopImage =
          getFirstValue(banner.fields?.desktop_image?.value) || "";
        const mobileImage =
          getFirstValue(banner.fields?.mobile_image?.value) || "";
        const rawRedirectionLink =
          getFirstValue(banner.fields?.redirection_link?.value) || "#";
        const redirectionLink = extractPathFromUrl(rawRedirectionLink);
        const redirectInNewTab =
          banner.fields?.redirect_in_new_tab?.value || false;

        return {
          id: parseInt(banner.id.replace(/\D/g, ""), 10) || index + 1,
          type: MediaContentType.IMAGE,
          mobileSrc: mobileImage || "",
          desktopSrc: desktopImage || "",
          indicatorHeading: `Banner ${index + 1}`,
          indicatorSubHeading: "",
          href: redirectionLink,
          alt: `Collection Banner ${index + 1}`,
          target: redirectInNewTab ? "_blank" : "_self",
        };
      });
  }

  const fallbackBanners: IBannerCarouselItem[] = [];

  if (metadata.mobile_banner || metadata.collection_banner_image) {
    const rawFallbackLink =
      getFirstValue(metadata.collection_redirection?.value) || "#";
    const fallbackLink = extractPathFromUrl(rawFallbackLink);

    const mobileBanner = getFirstValue(metadata.mobile_banner?.value);
    const desktopBanner = getFirstValue(
      metadata.collection_banner_image?.value
    );

    const mobileSrc = mobileBanner || desktopBanner || "";
    const desktopSrc = desktopBanner || mobileBanner || "";

    fallbackBanners.push({
      id: 1,
      type: MediaContentType.IMAGE,
      mobileSrc,
      desktopSrc,
      indicatorHeading: "Collection Banner",
      indicatorSubHeading: "",
      href: fallbackLink,
      alt: "Collection Banner",
      target: "_self",
    });
  }

  return fallbackBanners;
}
