import { WIDGET_TYPES } from "@/widgets/.generated/types";
import { HeroContract } from "@/widgets/common/Hero/contract";
import { FaqContract } from "@/widgets/common/Faq/contract";
import { AnnouncementContract } from "@/widgets/common/Announcement/contract";

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
 *   commonWidgetSchemas  – registered for every merchant (RichText, etc.)
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
  // Common Sections library — schema lives IN the section folder (contract.ts);
  // this registry just points at it, so the folder stays the source of truth.
  [WIDGET_TYPES.Hero]: HeroContract,
  [WIDGET_TYPES.Faq]: FaqContract,
  [WIDGET_TYPES.Announcement]: AnnouncementContract,
};

// =============================================================================
// MERCHANT-SPECIFIC WIDGETS — uncomment and extend when forking this starter
// =============================================================================

const merchantWidgetSchemas = {
  // ── ratio chrome (forked from common Header/Footer) ──
  // Navigation is admin-managed via useNav, so the editable settings are the
  // menu handle(s) + branding/search/app fields. The old per-item nav label/
  // link settings are gone (the menu now drives the nav).
  [WIDGET_TYPES.RatioHeader]: {
    type: WIDGET_TYPES.RatioHeader,
    name: "Site Header",
    description:
      "Site header with logo, admin-managed navigation (useNav), search, and cart",
    settingsSchema: {
      menuHandle: {
        type: "menu-select" as const,
        label: "Navigation Menu",
        default: "main-menu",
      },
      logoSrc: {
        type: "image" as const,
        label: "Logo Image",
        default: { src: "", alt: "" },
      },
      searchSuggestions: {
        type: "array" as const,
        label: "Search Suggestions (rotating animation)",
        default: [],
      },
      backgroundColor: {
        type: "text" as const,
        label: "Background Color (hex)",
        default: "",
      },
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
      getApp_logo_url: {
        type: "image" as const,
        label: "Get App: Logo Image",
        default: { src: "", alt: "" },
      },
      getApp_logo_alt: {
        type: "text" as const,
        label: "Get App: Logo Alt Text",
        default: "",
      },
      getApp_app_url: {
        type: "text" as const,
        label: "Get App: App URL",
        default: "",
      },
    },
  },
  [WIDGET_TYPES.RatioFooter]: {
    type: WIDGET_TYPES.RatioFooter,
    name: "Site Footer",
    description:
      "Site footer. Each link column is admin-managed via its own nav menu (useNav); titles + links come from the menu.",
    settingsSchema: {
      // Per-section nav menus — section title + links come from these (useNav).
      aboutMenuHandle: {
        type: "menu-select" as const,
        label: "About Section Menu",
        default: "about-us",
      },
      usefulLinksMenuHandle: {
        type: "menu-select" as const,
        label: "Useful Links Menu",
        default: "useful-links",
      },
      ourSalonsMenuHandle: {
        type: "menu-select" as const,
        label: "Our Salons Menu",
        default: "our-salons",
      },
      categoriesMenuHandle: {
        type: "menu-select" as const,
        label: "Categories Menu",
        default: "categories",
      },
      myAccountMenuHandle: {
        type: "menu-select" as const,
        label: "My Account Menu",
        default: "my-account",
      },
      // Branding / app / misc (non-nav)
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
      appStoreImage: {
        type: "image" as const,
        label: "App Store Badge Image",
        default: { src: "", alt: "" },
      },
      serviceSectionsIcons: {
        type: "objectArray" as const,
        label: "Service Icons (Free Shipping, etc.)",
        fields: ["name", "image:image", "alt"],
        default: [],
      },
      socialLinks: {
        type: "objectArray" as const,
        label: "Social Links",
        fields: ["name", "href", "icon"],
        default: [],
      },
      paymentMethods: {
        type: "objectArray" as const,
        label: "Payment Methods",
        fields: ["name", "icon", "image"],
        fieldTypes: { image: "image" },
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
    },
  },
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
      backgroundColor: {
        type: "text" as const,
        label: "Background Color (hex)",
        default: "#000000",
      },
      textColor: {
        type: "text" as const,
        label: "Text Color (hex)",
        default: "#ffffff",
      },
      speed: {
        type: "number" as const,
        label: "Marquee Speed (px/sec)",
        default: 35,
      },
      pauseOnHover: {
        type: "boolean" as const,
        label: "Pause on Hover",
        default: true,
      },
    },
  },
  [WIDGET_TYPES.SEOMetadata]: {
    type: WIDGET_TYPES.SEOMetadata,
    name: "SEO Metadata",
    description:
      "Page-level SEO metadata widget for title, description, and canonical URL.",
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
      canonical: {
        type: "text" as const,
        label: "Canonical URL",
        default: "",
      },
      // NOTE: OG `image` is intentionally not an editor field — the widget reads
      // it as {url, altText} from SEO/remote data, which the editor image
      // control ({src, alt}) would not match. Driven by data, not per-instance.
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
      allowWriteReview: {
        type: "boolean" as const,
        label: "Allow customers to write reviews",
        default: false,
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
      sectionTitle: {
        type: "text" as const,
        label: "Section Title (override)",
        default: "",
      },
      marketedBy: {
        type: "text" as const,
        label: "Marketed By",
        default: "",
      },
      countryOfOrigin: {
        type: "text" as const,
        label: "Country of Origin",
        default: "",
      },
      customerCareDetails: {
        type: "text" as const,
        label: "Customer Care Details",
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
      counterTitle: {
        type: "text" as const,
        label: "Countdown Title",
        default: "",
      },
      endDateString: {
        type: "text" as const,
        label: "Countdown End Date (e.g. Jan 22, 2026 12:59:59)",
        default: "",
      },
      timerInterval: {
        type: "number" as const,
        label: "Timer Tick Interval (ms)",
        default: 1000,
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
      autoLoadMore: {
        type: "boolean",
        label: "Auto Load More",
        default: false,
      },
      showActionButton: {
        type: "boolean",
        label: "Show Action Button",
        default: true,
      },
      showBadge: {
        type: "boolean",
        label: "Show Badge",
        default: true,
      },
      showRating: {
        type: "boolean",
        label: "Show Rating",
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
      actionButtonTextColor: {
        type: "text",
        label: "Action Button Text Color (hex)",
        default: "",
      },
      sectionTextColor: {
        type: "text",
        label: "Section Text Color (hex)",
        default: "",
      },
      productCardBackgroundColor: {
        type: "text",
        label: "Product Card Background Color (hex)",
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
  [WIDGET_TYPES.RichText]: {
    type: WIDGET_TYPES.RichText,
    name: "Rich Text",
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
  [WIDGET_TYPES.HomeShowcase]: {
    type: WIDGET_TYPES.HomeShowcase,
    name: "Home Showcase",
    description:
      "Homepage hero + trust badges + featured products + shop-by-collection rail (data-driven from the commerce API)",
    settingsSchema: {
      heroEyebrow: {
        type: "text" as const,
        label: "Hero Eyebrow",
        default: "New season, new essentials",
      },
      heroHeadline: {
        type: "text" as const,
        label: "Hero Headline",
        default: "Everything you love, in one place",
      },
      heroSubtext: {
        type: "text" as const,
        label: "Hero Subtext",
        default:
          "Discover our full range of curated products — quality picks, honest prices, delivered to your door.",
      },
      heroCtaText: {
        type: "text" as const,
        label: "Hero CTA Text",
        default: "Shop all products",
      },
      heroCtaHref: {
        type: "text" as const,
        label: "Hero CTA Link",
        default: "/collections",
      },
      featuredHeading: {
        type: "text" as const,
        label: "Featured Products Heading",
        default: "Featured products",
      },
      collectionsHeading: {
        type: "text" as const,
        label: "Collections Heading",
        default: "Shop by collection",
      },
    },
  },
  [WIDGET_TYPES.StickyAddToCart]: {
    type: WIDGET_TYPES.StickyAddToCart,
    name: "Sticky Add To Cart",
    description:
      "Sticky bottom add-to-cart bar shown on the product detail page as the user scrolls",
    settingsSchema: {
      mrpLabel: {
        type: "text" as const,
        label: "MRP Label",
        default: "M.R.P.",
      },
      inclusiveOfAllTaxesText: {
        type: "text" as const,
        label: "Tax Note",
        default: "Incl. of all taxes",
      },
      buttonText: {
        type: "text" as const,
        label: "Add to Cart Button Text",
        default: "Add to cart",
      },
      soldOutText: {
        type: "text" as const,
        label: "Sold Out Text",
        default: "Sold Out",
      },
    },
  },
  [WIDGET_TYPES.CollectionHeading]: {
    type: WIDGET_TYPES.CollectionHeading,
    name: "Collection Heading",
    description: "Collection title with an optional horizontal divider",
    settingsSchema: {
      title: {
        type: "text" as const,
        label: "Title",
        default: "",
      },
      showDivider: {
        type: "boolean" as const,
        label: "Show Divider",
        default: true,
      },
      dividerColor: {
        type: "text" as const,
        label: "Divider Color (hex/rgb)",
        default: "rgb(217, 217, 217)",
      },
    },
  },
  [WIDGET_TYPES.CollectionList]: {
    type: WIDGET_TYPES.CollectionList,
    name: "Collection List",
    description: "Paginated grid of all collections with a section heading",
    settingsSchema: {
      heading: {
        type: "text" as const,
        label: "Section Heading",
        default: "All Collections",
      },
      pageSize: {
        type: "number" as const,
        label: "Collections Per Page",
        default: 6,
      },
    },
  },
  [WIDGET_TYPES.Breadcrumb]: {
    type: WIDGET_TYPES.Breadcrumb,
    name: "Breadcrumb",
    description:
      "Breadcrumb navigation trail. Falls back to these items when no product data is present.",
    settingsSchema: {
      items: {
        type: "objectArray" as const,
        label: "Breadcrumb Items",
        fields: ["text", "href"],
        default: [],
      },
    },
  },
  [WIDGET_TYPES.VideoApp]: {
    type: WIDGET_TYPES.VideoApp,
    name: "Video App",
    description:
      "Shoppable video rail rendered by the external Video Widget SDK. Settings are forwarded to the SDK config.",
    settingsSchema: {
      title: {
        type: "text" as const,
        label: "Section Heading",
        default: "",
      },
      layout: {
        type: "select" as const,
        label: "Layout",
        options: [
          { value: "grid", label: "Grid" },
          { value: "carousel", label: "Carousel" },
          { value: "slider", label: "Slider" },
          { value: "stories", label: "Stories" },
        ],
        default: "carousel",
      },
      itemsPerRow: {
        type: "number" as const,
        label: "Items Per Row (grid layout)",
        default: 4,
      },
      autoplay: {
        type: "boolean" as const,
        label: "Autoplay Videos",
        default: false,
      },
      muteByDefault: {
        type: "boolean" as const,
        label: "Mute By Default",
        default: true,
      },
      showVideoControls: {
        type: "boolean" as const,
        label: "Show Video Controls",
        default: false,
      },
      enableCtaButton: {
        type: "boolean" as const,
        label: "Show CTA Button",
        default: false,
      },
      buttonText: {
        type: "text" as const,
        label: "CTA Button Text",
        default: "",
      },
      ctaButtonTextColor: {
        type: "text" as const,
        label: "CTA Button Text Color (hex)",
        default: "",
      },
      ctaButtonBackgroundColor: {
        type: "text" as const,
        label: "CTA Button Background Color (hex)",
        default: "",
      },
      destinationUrl: {
        type: "text" as const,
        label: "CTA Destination URL",
        default: "/products",
      },
    },
  },
  [WIDGET_TYPES.PageContent]: {
    type: WIDGET_TYPES.PageContent,
    name: "Content Section",
    description:
      "Generic content block: eyebrow, title, intro, and text sections — for policy, info, and long-form pages",
    settingsSchema: {
      eyebrow: {
        type: "text" as const,
        label: "Eyebrow (small label)",
        default: "",
      },
      title: {
        type: "text" as const,
        label: "Title",
        default: "",
      },
      subtitle: {
        type: "text" as const,
        label: "Intro / Subtitle",
        default: "",
      },
      updatedAt: {
        type: "text" as const,
        label: "Last updated (optional)",
        default: "",
      },
      // NOTE: `contact` (email/phone/address/hours) is intentionally NOT an
      // editor field. The widget sources it env-first via getStoreContact()
      // (NEXT_PUBLIC_STORE_*) with the theme locale as fallback — merchant-
      // agnostic by config, not per-instance editing.
      sections: {
        type: "objectArray" as const,
        label: "Content Sections",
        fields: ["heading", "body", "bullets"],
        default: [],
      },
    },
  },
};

export const widgetRegistry: Record<string, any> = {
  ...commonWidgetSchemas,
  ...merchantWidgetSchemas,
};
