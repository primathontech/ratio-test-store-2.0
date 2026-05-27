import {
  IBannerCarouselItem,
  MediaContentType,
} from "../../BannerCarousel/types";
import {
  ensureArray,
  getFirstValue,
} from "../../AdditionalInformation/utils/getAdditionalInfoItems";
import type { CollectionBannerItem, CollectionHeroBannerData } from "../types";

function extractPathFromBbluntUrl(url: string): string {
  if (!url || url === "#") {
    return "#";
  }

  const bbluntIndex = url.indexOf("bblunt.com");
  if (bbluntIndex !== -1) {
    const pathStart = bbluntIndex + "bblunt.com".length;
    const path = url.substring(pathStart);
    return path.startsWith("/") ? path : `/${path}`;
  }

  return url;
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
        const redirectionLink = extractPathFromBbluntUrl(rawRedirectionLink);
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
    const fallbackLink = extractPathFromBbluntUrl(rawFallbackLink);

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
