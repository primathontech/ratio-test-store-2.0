// Common sections (shared across themes)
import customHtml from "@/editor-integration/sections/common/custom-html";
import shineAcademyBanner from "@/editor-integration/sections/common/shine-academy-banner";
import testimonials from "@/editor-integration/sections/common/testimonials";

// bblunt-2 theme sections (home page, data-source-free)
import bannerCarousel from "@/editor-integration/sections/bblunt-2/banner-carousel";
import shopByCategories from "@/editor-integration/sections/bblunt-2/shop-by-categories";
import shopByConcerns from "@/editor-integration/sections/bblunt-2/shop-by-concerns";

const commonSections = {
  "custom-html": customHtml,
  "shine-academy-banner": shineAcademyBanner,
  testimonials,
};

const bblunt2Sections = {
  "banner-carousel": bannerCarousel,
  "shop-by-categories": shopByCategories,
  "shop-by-concerns": shopByConcerns,
};

export const availableSectionsRegistry = {
  availableSections: {
    ...commonSections,
    ...bblunt2Sections,
  },
};
