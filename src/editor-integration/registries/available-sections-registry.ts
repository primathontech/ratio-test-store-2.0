// Common sections (shared across themes)
import customHtml from "@/editor-integration/sections/common/custom-html";
import testimonials from "@/editor-integration/sections/common/testimonials";
import contentSection from "@/editor-integration/sections/common/content-section";

import hero from "@/editor-integration/sections/common/hero";
import faq from "@/editor-integration/sections/common/faq";
import announcement from "@/editor-integration/sections/common/announcement";

// ratio theme sections
import announcementBar from "@/editor-integration/sections/ratio/announcement-bar";
import heroBanner from "@/editor-integration/sections/ratio/hero-banner";
import countdownTimer from "@/editor-integration/sections/ratio/countdown-timer";
import richText from "@/editor-integration/sections/ratio/rich-text";
import shopByCategories from "@/editor-integration/sections/ratio/shop-by-categories";
import featuredCollectionCarousel from "@/editor-integration/sections/ratio/featured-collection-carousel";
import featuredCollectionGrid from "@/editor-integration/sections/ratio/featured-collection-grid";
import collectionHeroBanner from "@/editor-integration/sections/ratio/collection-hero-banner";
import collectionPage from "@/editor-integration/sections/ratio/collection-page";

const commonSections = {
  "custom-html": customHtml,
  "content-section": contentSection,
  testimonials,
  hero,
  faq,
  announcement,
};

const ratioSections = {
  "announcement-bar": announcementBar,
  "hero-banner": heroBanner,
  "countdown-timer": countdownTimer,
  "rich-text": richText,
  "shop-by-categories": shopByCategories,
  "featured-collection-carousel": featuredCollectionCarousel,
  "featured-collection-grid": featuredCollectionGrid,
  "collection-hero-banner": collectionHeroBanner,
  "collection-page": collectionPage,
};

export const availableSectionsRegistry = {
  availableSections: {
    ...commonSections,
    ...ratioSections,
  },
};
