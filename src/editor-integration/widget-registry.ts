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
 *   menu-select – dropdown of the merchant's live nav menus (editor-fetched)
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
    description:
      "Rich-text page (heading + long-form body) for policy pages and similar",
    settingsSchema: {
      body: {
        type: "richtext" as const,
        label: "Body (rich text)",
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
        default: { src: "", alt: "" },
      },
      backgroundImageMobile: {
        type: "image" as const,
        label: "Background Image (mobile)",
        default: { src: "", alt: "" },
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
        // `type` is intended to be a select (IMAGE | VIDEO) but the current
        // editor's ObjectArrayInput only renders plain text inputs inside
        // an objectArray row. Merchants enter "IMAGE" or "VIDEO" verbatim.
        fields: [
          "id",
          "type",
          "href",
          "image:desktopImage",
          "image:mobileImage",
          "video:desktopVideo",
          "video:mobileVideo",
          "image:posterSrc",
          "alt",
          "indicatorHeading",
          "indicatorSubHeading",
        ],
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
        type: "text" as const,
        label: "Section Heading (rich text)",
        default: "",
      },
      testimonials: {
        type: "objectArray" as const,
        label: "Testimonials",
        fields: [
          "heading",
          "reviewText",
          "authorName",
          "image:avatarSrc",
          "alt",
          "stars",
        ],
        default: [],
      },
    },
  },
  [WIDGET_TYPES.ProductDetail]: {
    type: WIDGET_TYPES.ProductDetail,
    name: "Product Detail",
    description:
      "Product detail page hero (gallery + price + variants + ATC). Color/visual settings remain template-only.",
    settingsSchema: {
      // Coupon marquee
      showProductMarquee: {
        type: "boolean" as const,
        label: "Show Coupon Marquee",
        default: false,
      },
      productMarqueeText: {
        type: "text" as const,
        label: "Marquee Text",
        default: "",
      },
      productMarqueeCouponCode: {
        type: "text" as const,
        label: "Marquee Coupon Code",
        default: "",
      },
      productMarqueeSpeed: {
        type: "text" as const,
        label: "Marquee Speed (e.g. 8s)",
        default: "",
      },
      productMarqueeHref: {
        type: "text" as const,
        label: "Marquee Link",
        default: "",
      },
      // Right column copy
      netContentText: {
        type: "text" as const,
        label: "Net Content Label",
        default: "",
      },
      inclusiveOfAllTaxesText: {
        type: "text" as const,
        label: "Tax Note",
        default: "",
      },
      reviewsText: {
        type: "text" as const,
        label: "Reviews Suffix",
        default: "",
      },
      mrp: { type: "text" as const, label: "MRP Label", default: "" },
      usp: { type: "text" as const, label: "USP Label", default: "" },
      discount: {
        type: "text" as const,
        label: "Discount Suffix",
        default: "",
      },
      selectSizeText: {
        type: "text" as const,
        label: "Select Size Heading",
        default: "",
      },
      rupeeSymbol: {
        type: "text" as const,
        label: "Currency Symbol",
        default: "",
      },
      addToCartText: {
        type: "text" as const,
        label: "Add to Cart Text",
        default: "",
      },
      soldOutText: {
        type: "text" as const,
        label: "Sold Out Text",
        default: "",
      },
    },
  },
  [WIDGET_TYPES.ReasonsToLove]: {
    type: WIDGET_TYPES.ReasonsToLove,
    name: "Reasons to Love",
    description: "Product reasons-to-love section (data-driven from API)",
    settingsSchema: {
      sectionTitle: {
        type: "text" as const,
        label: "Section Title",
        default: "",
      },
    },
  },
  [WIDGET_TYPES.ProductTabs]: {
    type: WIDGET_TYPES.ProductTabs,
    name: "Product Tabs",
    description: "Accordion-style product info tabs (data-driven from API)",
    settingsSchema: {},
  },
  [WIDGET_TYPES.ProductFAQ]: {
    type: WIDGET_TYPES.ProductFAQ,
    name: "Product FAQ",
    description: "Accordion FAQ section for the product",
    settingsSchema: {
      title: {
        type: "text" as const,
        label: "Section Title",
        default: "",
      },
      defaultExpanded: {
        type: "boolean" as const,
        label: "Default Expanded",
        default: true,
      },
    },
  },
  [WIDGET_TYPES.CustomerReviews]: {
    type: WIDGET_TYPES.CustomerReviews,
    name: "Customer Reviews",
    description: "Customer reviews block with form and review list",
    settingsSchema: {
      title: {
        type: "text" as const,
        label: "Section Title",
        default: "",
      },
      writeReviewButtonText: {
        type: "text" as const,
        label: "Write Review Button Text",
        default: "",
      },
      cancelReviewButtonText: {
        type: "text" as const,
        label: "Cancel Review Button Text",
        default: "",
      },
    },
  },
  [WIDGET_TYPES.RecentlyViewed]: {
    type: WIDGET_TYPES.RecentlyViewed,
    name: "Recently Viewed",
    description:
      "Recently-viewed product carousel (cards & colors stay template-only)",
    settingsSchema: {
      heading: {
        type: "text" as const,
        label: "Section Heading",
        default: "",
      },
      actionButtonText: {
        type: "text" as const,
        label: "Add to Cart Text (desktop)",
        default: "",
      },
      soldOutText: {
        type: "text" as const,
        label: "Sold Out Text (desktop)",
        default: "",
      },
    },
  },
  [WIDGET_TYPES.AdditionalInformation]: {
    type: WIDGET_TYPES.AdditionalInformation,
    name: "Additional Information",
    description: "Manufacturer / origin / care details accordion",
    settingsSchema: {
      title: {
        type: "text" as const,
        label: "Section Title",
        default: "",
      },
      defaultExpanded: {
        type: "boolean" as const,
        label: "Default Expanded",
        default: false,
      },
    },
  },
  [WIDGET_TYPES.ProductDisclaimer]: {
    type: WIDGET_TYPES.ProductDisclaimer,
    name: "Product Disclaimer",
    description: "Product safety / disclaimer block",
    settingsSchema: {
      sectionTitle: {
        type: "text" as const,
        label: "Section Title",
        default: "",
      },
    },
  },

  [WIDGET_TYPES.HeroBanner]: {
    type: WIDGET_TYPES.HeroBanner,
    name: "Hero Banner",
    description: "Static hero image banner (desktop + mobile variants)",
    settingsSchema: {
      desktopImage: {
        type: "image" as const,
        label: "Desktop Image",
        default: { src: "", alt: "" },
      },
      mobileImage: {
        type: "image" as const,
        label: "Mobile Image",
        default: { src: "", alt: "" },
      },
      href: {
        type: "text" as const,
        label: "Link URL (optional)",
        default: "",
      },
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
    },
  },
  [WIDGET_TYPES.HowItWorksBanner]: {
    type: WIDGET_TYPES.HowItWorksBanner,
    name: "How It Works Banner",
    description: "Static how-it-works image banner (desktop + mobile)",
    settingsSchema: {
      mobileAspectRatio: {
        type: "text" as const,
        label: "Mobile Aspect Ratio (e.g. 1500/1167)",
        default: "",
      },
      desktopAspectRatio: {
        type: "text" as const,
        label: "Desktop Aspect Ratio (e.g. 5692/692)",
        default: "",
      },
      desktopImage: {
        type: "image" as const,
        label: "Desktop Image",
        default: { src: "", alt: "" },
      },
      mobileImage: {
        type: "image" as const,
        label: "Mobile Image",
        default: { src: "", alt: "" },
      },
    },
  },
  [WIDGET_TYPES.CountdownTimer]: {
    type: WIDGET_TYPES.CountdownTimer,
    name: "Countdown Timer",
    description: "Standalone countdown to a target date",
    settingsSchema: {
      targetDate: {
        type: "text" as const,
        label: "Target Date (e.g. Apr 12, 2026 00:00:00)",
        default: "",
      },
      heading: { type: "text" as const, label: "Heading", default: "" },
      subheading: { type: "text" as const, label: "Subheading", default: "" },
      expiredText: {
        type: "text" as const,
        label: "Expired Text",
        default: "",
      },
    },
  },
  [WIDGET_TYPES.SalePageBanner]: {
    type: WIDGET_TYPES.SalePageBanner,
    name: "Sale Page Banner",
    description:
      "Promotional sale banner with offer, countdown timer, coupon code, and 'How to shop' modal",
    settingsSchema: {
      mobileSrc: {
        type: "image" as const,
        label: "Mobile Background Image",
        default: { src: "", alt: "" },
      },
      desktopSrc: {
        type: "image" as const,
        label: "Desktop Background Image",
        default: { src: "", alt: "" },
      },
      offerTitle: { type: "text" as const, label: "Offer Title", default: "" },
      offerPrice: { type: "text" as const, label: "Offer Price", default: "" },
      currencySymbol: {
        type: "text" as const,
        label: "Currency Symbol",
        default: "₹",
      },
      couponCode: { type: "text" as const, label: "Coupon Code", default: "" },
      expiryText: {
        type: "text" as const,
        label: "Expiry Text",
        default: "",
      },
      endDateString: {
        type: "text" as const,
        label: "Countdown End Date (e.g. Jan 22, 2026 12:59:59)",
        default: "",
      },
      bannerCtaLabel: {
        type: "text" as const,
        label: "Banner CTA Label",
        default: "",
      },
      howToShopTitle: {
        type: "text" as const,
        label: "How To Shop Modal Title",
        default: "",
      },
      howToShopSteps: {
        type: "objectArray" as const,
        label: "How To Shop Steps (rich text)",
        fields: ["id", "text"],
        default: [],
      },
      termsAndConditionsTitle: {
        type: "text" as const,
        label: "Terms & Conditions Title",
        default: "",
      },
      termsAndConditionsPoints: {
        type: "text" as const,
        label: "Terms & Conditions Points",
        default: "",
      },
      primaryButtonLabel: {
        type: "text" as const,
        label: "Modal Primary Button Label",
        default: "",
      },
    },
  },
  [WIDGET_TYPES.FeaturedCollectionGrid]: {
    type: WIDGET_TYPES.FeaturedCollectionGrid,
    name: "Featured Collection Grid",
    description: "Product grid for a single collection handle",
    settingsSchema: {
      categoryTitle: {
        type: "text" as const,
        label: "Category Title",
        default: "",
      },
      collectionHandle: {
        type: "text" as const,
        label: "Collection Handle",
        default: "",
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
        default: { src: "", alt: "" },
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
        fields: ["image:iconSrc", "alt", "heading", "body"],
        default: [],
      },
    },
  },
  [WIDGET_TYPES.DeleteAccount]: {
    type: WIDGET_TYPES.DeleteAccount,
    name: "Delete Account",
    description:
      "Account deletion request form with heading, description, submit button, and success message",
    settingsSchema: {
      heading: {
        type: "text" as const,
        label: "Heading",
        default: "",
      },
      description: {
        type: "richtext" as const,
        label: "Description",
        default: "",
      },
      submitLabel: {
        type: "text" as const,
        label: "Submit Button Label",
        default: "",
      },
      successMessage: {
        type: "text" as const,
        label: "Success Message",
        default: "",
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
        default: { src: "", alt: "" },
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
        default: { src: "", alt: "" },
      },
      mosaicSrcMobile: {
        type: "image" as const,
        label: "Mosaic Image (mobile)",
        default: { src: "", alt: "" },
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
        fields: ["href", "image:image", "alt"],
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
        fields: [
          "label",
          "href",
          "image:desktopImage",
          "image:mobileImage",
          "alt",
        ],
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
      menuHandle: {
        type: "menu-select" as const,
        label: "Menu",
        default: "footer",
      },
      mobileFooterTagline: {
        type: "richtext" as const,
        label: "Mobile Footer Tagline (rich text)",
        default: "",
      },
      logoUrl: {
        type: "image" as const,
        label: "Logo Image",
        default: { src: "", alt: "" },
      },
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
        default: { src: "", alt: "" },
      },
      googlePlayAlt: {
        type: "text" as const,
        label: "Google Play Image Alt Text",
        default: "",
      },
      appStoreImage: {
        type: "image" as const,
        label: "App Store Badge Image",
        default: { src: "", alt: "" },
      },
      appStoreAlt: {
        type: "text" as const,
        label: "App Store Image Alt Text",
        default: "",
      },

      serviceSectionsIcons: {
        type: "objectArray" as const,
        label: "Service Icons (Free Shipping, etc.)",
        fields: ["name", "image:image", "alt"],
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
      menuHandle: {
        type: "menu-select" as const,
        label: "Menu",
        default: "main-menu",
      },
      logoSrc: {
        type: "image" as const,
        label: "Logo Image",
        default: { src: "", alt: "" },
      },
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

      // Mobile drawer "Get this App" banner
      getApp_title: {
        type: "text" as const,
        label: "Get App: Title",
        default: "",
      },
      getApp_description: {
        type: "text" as const,
        label: "Get App: Description",
        default: "",
      },
      getApp_button_text: {
        type: "text" as const,
        label: "Get App: Button Text",
        default: "",
      },
      getApp_logo_alt: {
        type: "text" as const,
        label: "Get App: Logo Alt Text",
        default: "",
      },
      getApp_logo_url: {
        type: "image" as const,
        label: "Get App: Logo Image",
        default: { src: "", alt: "" },
      },
      getApp_app_url: {
        type: "text" as const,
        label: "Get App: App URL",
        default: "",
      },
    },
  },
  [WIDGET_TYPES.CollectionTimer]: {
    type: WIDGET_TYPES.CollectionTimer,
    name: "Collection Timer",
    description:
      "Countdown timer widget for collection pages with urgency text, sale label, and expiry messaging.",
    settingsSchema: {
      endDateString: {
        type: "text",
        label: "End Date (e.g. Apr 30, 2026 23:59:59)",
        default: "",
      },
      urgencyText: {
        type: "text",
        label: "Urgency Text",
        default: "Hurry Up!",
      },
      saleLabel: {
        type: "text",
        label: "Sale Label",
        default: "Sale ends in:",
      },
      expiredText: {
        type: "text",
        label: "Expired Text",
        default: "Oops! Offer is Expired",
      },
    },
  },
  [WIDGET_TYPES.CollectionHeroBanner]: {
    type: WIDGET_TYPES.CollectionHeroBanner,
    name: "Collection Hero Banner",
    description:
      "Collection page hero banner with customizable aspect ratios for mobile and desktop.",
    settingsSchema: {
      mobileAspectRatio: {
        type: "text",
        label: "Mobile Aspect Ratio (e.g. 1/1)",
        default: "1/1",
      },
      desktopAspectRatio: {
        type: "text",
        label: "Desktop Aspect Ratio (e.g. 1440/530)",
        default: "1440/530",
      },
    },
    requiresDataSource: true,
    compatibleDataSources: ["COLLECTION"],
  },
  [WIDGET_TYPES.CollectionPage]: {
    type: WIDGET_TYPES.CollectionPage,
    name: "Collection Widget",
    description:
      "Collection listing widget with product cards, actions, badges, ratings, and load-more support.",
    settingsSchema: {
      actionButtonText: {
        type: "text",
        label: "Action Button Text",
        default: "",
      },
      showFilterAndSort: {
        type: "boolean",
        label: "Show Filter And Sort",
        default: true,
      },
      soldOutText: {
        type: "text",
        label: "Sold Out Text",
        default: "",
      },
      filterTitle: {
        type: "text",
        label: "Filter Title",
        default: "",
      },
      sortDropdownText: {
        type: "text",
        label: "Sort Dropdown Label",
        default: "",
      },
      title: {
        type: "text",
        label: "Collection Title (override)",
        default: "",
      },
    },
  },
  [WIDGET_TYPES.FaqAccordion]: {
    type: WIDGET_TYPES.FaqAccordion,
    name: "Collection FAQ",
    description:
      "FAQ accordion widget for collection pages with a configurable title.",
    settingsSchema: {
      title: {
        type: "text",
        label: "Title",
        default: "FAQ",
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
