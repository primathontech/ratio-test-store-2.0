// Common sections (shared across themes)
import customHtml from "@/editor-integration/sections/common/custom-html";
import shineAcademyBanner from "@/editor-integration/sections/common/shine-academy-banner";
import testimonials from "@/editor-integration/sections/common/testimonials";

// bblunt-2 theme sections
import announcementBar from "@/editor-integration/sections/bblunt-2/announcement-bar";
import bannerCarousel from "@/editor-integration/sections/bblunt-2/banner-carousel";
import heroBanner from "@/editor-integration/sections/bblunt-2/hero-banner";
import howItWorksBanner from "@/editor-integration/sections/bblunt-2/how-it-works-banner";
import countdownTimer from "@/editor-integration/sections/bblunt-2/countdown-timer";
import richText from "@/editor-integration/sections/bblunt-2/rich-text";
import shopByCategories from "@/editor-integration/sections/bblunt-2/shop-by-categories";
import shopByConcerns from "@/editor-integration/sections/bblunt-2/shop-by-concerns";
import salePageBanner from "@/editor-integration/sections/bblunt-2/sale-page-banner";
import hairCareBffs from "@/editor-integration/sections/bblunt-2/hair-care-bffs";
import featuredCollectionCarousel from "@/editor-integration/sections/bblunt-2/featured-collection-carousel";
import featuredCollectionGrid from "@/editor-integration/sections/bblunt-2/featured-collection-grid";
import collectionHeroBanner from "@/editor-integration/sections/bblunt-2/collection-hero-banner";
import collectionTimer from "@/editor-integration/sections/bblunt-2/collection-timer";
import collectionPage from "@/editor-integration/sections/bblunt-2/collection-page";

const commonSections = {
  "custom-html": customHtml,
  "shine-academy-banner": shineAcademyBanner,
  testimonials,
};

const bblunt2Sections = {
  "announcement-bar": announcementBar,
  "banner-carousel": bannerCarousel,
  "hero-banner": heroBanner,
  "how-it-works-banner": howItWorksBanner,
  "countdown-timer": countdownTimer,
  "rich-text": richText,
  "shop-by-categories": shopByCategories,
  "shop-by-concerns": shopByConcerns,
  "sale-page-banner": salePageBanner,
  "hair-care-bffs": hairCareBffs,
  "featured-collection-carousel": featuredCollectionCarousel,
  "featured-collection-grid": featuredCollectionGrid,
  "collection-hero-banner": collectionHeroBanner,
  "collection-timer": collectionTimer,
  "collection-page": collectionPage,
};

export const availableSectionsRegistry = {
  availableSections: {
    ...commonSections,
    ...bblunt2Sections,
  },
};
