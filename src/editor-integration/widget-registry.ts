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
  [WIDGET_TYPES.AboutUsHero]: {
    type: WIDGET_TYPES.AboutUsHero,
    name: "About Us Hero",
    description: "Hero banner image for the About Us page",
    settingsSchema: {
      imageSrc: {
        type: "image" as const,
        label: "Banner Image",
        default: "",
      },
      imageAlt: {
        type: "text" as const,
        label: "Image Alt Text",
        default: "",
      },
      href: {
        type: "text" as const,
        label: "Link Destination",
        default: "",
      },
    },
  },
  [WIDGET_TYPES.AboutUsStory]: {
    type: WIDGET_TYPES.AboutUsStory,
    name: "About Us Story",
    description: "Story section with heading + body content blocks",
    settingsSchema: {
      blocks: {
        type: "objectArray" as const,
        label: "Content Blocks",
        fields: ["heading", "body"],
        default: [],
      },
    },
  },
  [WIDGET_TYPES.AboutUsValues]: {
    type: WIDGET_TYPES.AboutUsValues,
    name: "About Us Values",
    description: "Two-column icon grid with brand value items",
    settingsSchema: {
      items: {
        type: "objectArray" as const,
        label: "Value Items",
        fields: ["iconSrc", "iconAlt", "heading", "body"],
        fieldTypes: { iconSrc: "image" },
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
  [WIDGET_TYPES.Footer]: {
    type: WIDGET_TYPES.Footer,
    name: "Footer",
    description:
      "Site footer with link sections, social icons, payment methods, and app download",
    settingsSchema: {
      mobileFooterTagline: {
        type: "richtext" as const,
        label: "Mobile Footer Tagline (rich text)",
        default: "",
      },
      logoUrl: { type: "image" as const, label: "Logo Image", default: "" },
      logoAlt: { type: "text" as const, label: "Logo Alt Text", default: "" },

      appDownloadText: {
        type: "text" as const,
        label: "App Download Text",
        default: "",
      },
      googlePlayUrl: {
        type: "text" as const,
        label: "Google Play URL",
        default: "",
      },
      appStoreUrl: {
        type: "text" as const,
        label: "App Store URL",
        default: "",
      },
      googlePlayImage: {
        type: "image" as const,
        label: "Google Play Badge Image",
        default: "",
      },
      googlePlayAlt: {
        type: "text" as const,
        label: "Google Play Image Alt Text",
        default: "",
      },
      appStoreImage: {
        type: "image" as const,
        label: "App Store Badge Image",
        default: "",
      },
      appStoreAlt: {
        type: "text" as const,
        label: "App Store Image Alt Text",
        default: "",
      },

      serviceSectionsIcons: {
        type: "objectArray" as const,
        label: "Service Icons (Free Shipping, etc.)",
        fields: ["name", "image"],
        fieldTypes: { image: "image" },
        default: [],
      },

      aboutTitle: {
        type: "text" as const,
        label: "About Section Title",
        default: "",
      },
      aboutLinks: {
        type: "objectArray" as const,
        label: "About Links",
        fields: ["name", "href"],
        default: [],
      },

      usefulLinksTitle: {
        type: "text" as const,
        label: "Useful Links Section Title",
        default: "",
      },
      usefulLinks: {
        type: "objectArray" as const,
        label: "Useful Links",
        fields: ["name", "href"],
        default: [],
      },

      ourSalonsTitle: {
        type: "text" as const,
        label: "Our Salons Section Title",
        default: "",
      },
      ourSalonsLinks: {
        type: "objectArray" as const,
        label: "Our Salons Links",
        fields: ["name", "href"],
        default: [],
      },

      categoriesTitle: {
        type: "text" as const,
        label: "Categories Section Title",
        default: "",
      },
      categoriesLinks: {
        type: "objectArray" as const,
        label: "Categories Links",
        fields: ["name", "href"],
        default: [],
      },

      myAccountTitle: {
        type: "text" as const,
        label: "My Account Section Title",
        default: "",
      },
      myAccountLinks: {
        type: "objectArray" as const,
        label: "My Account Links",
        fields: ["name", "href"],
        default: [],
      },

      socialLinks: {
        type: "objectArray" as const,
        label: "Social Links",
        fields: ["name", "href", "icon"],
        default: [],
      },

      paymentProtectionText: {
        type: "text" as const,
        label: "Payment Protection Text",
        default: "",
      },
      copyrightText: {
        type: "text" as const,
        label: "Copyright Text",
        default: "",
      },
      paymentMethods: {
        type: "objectArray" as const,
        label: "Payment Methods",
        fields: ["name", "icon", "image"],
        fieldTypes: { image: "image" },
        default: [],
      },
    },
  },
  [WIDGET_TYPES.Header]: {
    type: WIDGET_TYPES.Header,
    name: "Header",
    description: "Site header with logo, navigation, search, and cart",
    settingsSchema: {
      logoSrc: { type: "image" as const, label: "Logo Image", default: "" },
      searchPlaceholder: {
        type: "text" as const,
        label: "Search Placeholder",
        default: "",
      },
      searchSuggestions: {
        type: "array" as const,
        label: "Search Suggestions (rotating animation)",
        default: [],
      },

      // Product menu
      product_label: {
        type: "text" as const,
        label: "Product Menu Label",
        default: "",
      },
      product_href: {
        type: "text" as const,
        label: "Product Menu Link",
        default: "",
      },
      product_items: {
        type: "objectArray" as const,
        label: "Product Dropdown Items",
        fields: ["label", "href"],
        default: [],
      },

      // Hair Care menu
      hair_care_label: {
        type: "text" as const,
        label: "Hair Care Menu Label",
        default: "",
      },
      hair_care_href: {
        type: "text" as const,
        label: "Hair Care Menu Link",
        default: "",
      },
      hair_care_type_label: {
        type: "text" as const,
        label: "Hair Care: Product Type Category Label",
        default: "",
      },
      hair_care_type_href: {
        type: "text" as const,
        label: "Hair Care: Product Type Category Link",
        default: "",
      },
      hair_care_type_items: {
        type: "objectArray" as const,
        label: "Hair Care: Product Type Items",
        fields: ["label", "href"],
        default: [],
      },
      hair_care_concern_label: {
        type: "text" as const,
        label: "Hair Care: Shop By Concern Category Label",
        default: "",
      },
      hair_care_concern_href: {
        type: "text" as const,
        label: "Hair Care: Shop By Concern Category Link",
        default: "",
      },
      hair_care_concern_items: {
        type: "objectArray" as const,
        label: "Hair Care: Shop By Concern Items",
        fields: ["label", "href"],
        default: [],
      },

      // Hair Colour menu
      hair_colour_label: {
        type: "text" as const,
        label: "Hair Colour Menu Label",
        default: "",
      },
      hair_colour_href: {
        type: "text" as const,
        label: "Hair Colour Menu Link",
        default: "",
      },
      hair_colour_items: {
        type: "objectArray" as const,
        label: "Hair Colour Dropdown Items",
        fields: ["label", "href"],
        default: [],
      },

      // Hair Styling menu
      hair_styling_label: {
        type: "text" as const,
        label: "Hair Styling Menu Label",
        default: "",
      },
      hair_styling_href: {
        type: "text" as const,
        label: "Hair Styling Menu Link",
        default: "",
      },
      hair_styling_items: {
        type: "objectArray" as const,
        label: "Hair Styling Dropdown Items",
        fields: ["label", "href"],
        default: [],
      },

      // Salon menu
      salon_label: {
        type: "text" as const,
        label: "Salon Menu Label",
        default: "",
      },
      salon_href: {
        type: "text" as const,
        label: "Salon Menu Link",
        default: "",
      },
      salon_items: {
        type: "objectArray" as const,
        label: "Salon Dropdown Items",
        fields: ["label", "href"],
        default: [],
      },
    },
  },
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
