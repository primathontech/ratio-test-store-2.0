import { WIDGET_TYPES } from "@/widgets/.generated/types";

/**
 * Widget Registry for Visual Editor
 *
 * Maps each widget type to its schema definition.
 * The editor's SettingsSidebar uses these schemas to generate
 * the form fields shown in the right-side settings panel.
 *
 * Schema field types:
 *   text        – plain text input
 *   number      – numeric input (supports min/max/step/unit)
 *   boolean     – toggle switch
 *   select      – dropdown with options[]
 *   spacing     – responsive padding/margin control
 *   image       – image picker
 *   richtext    – rich text editor
 *   html        – raw HTML code editor
 *   array       – simple array of scalar values
 *   objectArray – array of objects (fields lists the editable keys per item)
 *   faq         – FAQ question/answer pairs
 *
 * Structure:
 *   commonWidgetSchemas  – registered for every merchant (CustomHtml, etc.)
 *   Merchant-specific    – uncomment and extend per widget when forking
 */

// =============================================================================
// COMMON WIDGETS — registered for all merchants
// =============================================================================

const commonWidgetSchemas = {
  [WIDGET_TYPES.CustomHtml]: {
    type: WIDGET_TYPES.CustomHtml,
    name: "Custom HTML",
    description: "Raw HTML snippet with support for <style> and <script> tags",
    settingsSchema: {
      html: {
        type: "html" as const,
        label: "HTML (supports <style> and <script>)",
        default: "",
      },
    },
  },
};

// =============================================================================
// MERCHANT-SPECIFIC WIDGETS — uncomment and extend when forking this starter
// =============================================================================

const merchantWidgetSchemas = {
  [WIDGET_TYPES.AnnouncementBar]: {
    type: WIDGET_TYPES.AnnouncementBar,
    name: "Announcement Bar",
    description:
      "Marquee announcement strip displayed at the top of every page",
    settingsSchema: {
      items: {
        type: "objectArray" as const,
        label: "Announcements",
        fields: ["id", "text", "href"],
        default: [],
      },
    },
  },
  [WIDGET_TYPES.SEOMetadata]: {
    type: WIDGET_TYPES.SEOMetadata,
    name: "SEO Metadata",
    description:
      "Page-level SEO metadata widget for title, description, canonical, and Open Graph image.",
    settingsSchema: {
      title: {
        type: "text" as const,
        label: "Page Title",
        default: "",
      },
      description: {
        type: "text" as const,
        label: "Meta Description",
        default: "",
      },
    },
  },
  [WIDGET_TYPES.HairCareBFFs]: {
    type: WIDGET_TYPES.HairCareBFFs,
    name: "Hair Care BFFs",
    description: "Tabbed product carousel with rich heading and background",
    settingsSchema: {
      heading: {
        type: "text" as const,
        label: "Section Heading (rich text)",
        default: "",
      },
      backgroundImage: {
        type: "image" as const,
        label: "Background Image (desktop)",
        default: "",
      },
      backgroundImageMobile: {
        type: "image" as const,
        label: "Background Image (mobile)",
        default: "",
      },
      collections: {
        type: "objectArray" as const,
        label: "Tabs (matches data source handles order)",
        fields: ["label", "viewAllCollectionHandle"],
        default: [],
      },
      actionButtonText: {
        type: "text" as const,
        label: "Add to Cart Button Text",
        default: "",
      },
      soldOutText: {
        type: "text" as const,
        label: "Sold Out Text",
        default: "",
      },
    },
  },
  [WIDGET_TYPES.FeaturedCollectionCarousel]: {
    type: WIDGET_TYPES.FeaturedCollectionCarousel,
    name: "Featured Collection Carousel",
    description: "Product carousel for a single collection",
    settingsSchema: {
      heading: {
        type: "text" as const,
        label: "Section Heading (rich text)",
        default: "",
      },
      collectionHandle: {
        type: "text" as const,
        label: "Collection Handle",
        default: "",
      },
      viewAllCollectionHandle: {
        type: "text" as const,
        label: "View All Collection Handle (override)",
        default: "",
      },
      actionButtonText: {
        type: "text" as const,
        label: "Add to Cart Button Text",
        default: "",
      },
      soldOutText: {
        type: "text" as const,
        label: "Sold Out Text",
        default: "",
      },
    },
  },
  [WIDGET_TYPES.BannerCarousel]: {
    type: WIDGET_TYPES.BannerCarousel,
    name: "Banner Carousel",
    description: "Hero banner carousel with image/video slides",
    settingsSchema: {
      mobileAspectRatio: {
        type: "text" as const,
        label: "Mobile Aspect Ratio (e.g. 1/1)",
        default: "",
      },
      desktopAspectRatio: {
        type: "text" as const,
        label: "Desktop Aspect Ratio (e.g. 1440/529)",
        default: "",
      },
      bannerCarousel: {
        type: "objectArray" as const,
        label: "Banner Slides",
        fields: [
          "id",
          "type",
          "href",
          "desktopSrc",
          "mobileSrc",
          "posterSrc",
          "alt",
          "indicatorHeading",
          "indicatorSubHeading",
        ],
        fieldTypes: {
          desktopSrc: "image",
          mobileSrc: "image",
          posterSrc: "image",
        },
        default: [],
      },
    },
  },
  [WIDGET_TYPES.Testimonials]: {
    type: WIDGET_TYPES.Testimonials,
    name: "Testimonials",
    description: "Customer testimonial cards with rich heading",
    settingsSchema: {
      heading: {
        type: "richtext" as const,
        label: "Section Heading (rich text)",
        default: "",
      },
      testimonials: {
        type: "objectArray" as const,
        label: "Testimonials",
        fields: ["heading", "reviewText", "authorName", "avatarSrc", "stars"],
        fieldTypes: { avatarSrc: "image" },
        default: [],
      },
    },
  },
  [WIDGET_TYPES.ShineAcademyBanner]: {
    type: WIDGET_TYPES.ShineAcademyBanner,
    name: "Shine Academy Banner",
    description: "Static banner section with logo, tagline, and mosaic image",
    settingsSchema: {
      logoSrc: {
        type: "image" as const,
        label: "Logo Image",
        default: "",
      },
      logoAlt: {
        type: "text" as const,
        label: "Logo Alt Text",
        default: "",
      },
      tagline: {
        type: "text" as const,
        label: "Tagline",
        default: "",
      },
      mosaicSrcDesktop: {
        type: "image" as const,
        label: "Mosaic Image (desktop)",
        default: "",
      },
      mosaicSrcMobile: {
        type: "image" as const,
        label: "Mosaic Image (mobile)",
        default: "",
      },
      mosaicAlt: {
        type: "text" as const,
        label: "Mosaic Alt Text",
        default: "",
      },
      backgroundColor: {
        type: "text" as const,
        label: "Background Color",
        default: "",
      },
    },
  },
  [WIDGET_TYPES.ShopByConcerns]: {
    type: WIDGET_TYPES.ShopByConcerns,
    name: "Shop by Concerns",
    description: "Carousel of concern tiles with a section heading",
    settingsSchema: {
      heading: {
        type: "text" as const,
        label: "Section Heading (rich text)",
        default: "",
      },
      tiles: {
        type: "objectArray" as const,
        label: "Concern Tiles",
        fields: ["label", "href", "image"],
        fieldTypes: { image: "image" },
        default: [],
      },
    },
  },
  [WIDGET_TYPES.ShopByCategories]: {
    type: WIDGET_TYPES.ShopByCategories,
    name: "Shop by Categories",
    description: "Carousel of category tiles with a section heading",
    settingsSchema: {
      heading: {
        type: "text" as const,
        label: "Section Heading (rich text)",
        default: "",
      },
      tiles: {
        type: "objectArray" as const,
        label: "Category Tiles",
        fields: ["label", "href", "desktopImage", "mobileImage"],
        fieldTypes: { desktopImage: "image", mobileImage: "image" },
        default: [],
      },
    },
  },
  // [WIDGET_TYPES.Header]: {
  //   type: WIDGET_TYPES.Header,
  //   name: "Header",
  //   description: "Site header with logo, navigation, and cart icon",
  //   settingsSchema: {
  //     variant: {
  //       type: "select",
  //       label: "Widget Variant",
  //       options: [
  //         { value: "v1", label: "Version 1 (Classic)" },
  //         { value: "v2", label: "Version 2 (Enhanced)" },
  //       ],
  //       default: "",
  //     },
  //   },
  // },
  // [WIDGET_TYPES.Footer]: {
  //   type: WIDGET_TYPES.Footer,
  //   name: "Footer",
  //   description: "Site footer with links and branding",
  //   settingsSchema: {
  //     variant: {
  //       type: "select",
  //       label: "Widget Variant",
  //       options: [{ value: "v1", label: "Version 1 (Classic)" }],
  //       default: "",
  //     },
  //   },
  // },
  // [WIDGET_TYPES.PageContent]: {
  //   type: WIDGET_TYPES.PageContent,
  //   name: "Page Content",
  //   description: "Generic page content block",
  //   settingsSchema: {
  //     variant: {
  //       type: "select",
  //       label: "Widget Variant",
  //       options: [{ value: "v1", label: "Version 1 (Classic)" }],
  //       default: "",
  //     },
  //   },
  // },
};

export const widgetRegistry: Record<string, any> = {
  ...commonWidgetSchemas,
  ...merchantWidgetSchemas,
};
