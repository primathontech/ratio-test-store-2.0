import { WIDGET_TYPES } from "@/widgets/.generated/types";

/**
 * Common widgets schema
 *
 * Schemas for widgets shared across all themes.
 */
const commonWidgetsSchema = {
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
 * Only include widgets that are used in templates.
 */
export const widgetRegistry: Record<string, any> = {
  ...commonWidgetsSchema,

  // ─── nintarababy ─────────────────────────────────────────────────────────

  [WIDGET_TYPES.AnnouncementBar]: {
    type: WIDGET_TYPES.AnnouncementBar,
    name: "Announcement Bar",
    description:
      "A full-width promotional bar that auto-rotates between messages.",
    settingsSchema: {
      messages: {
        type: "objectArray" as const,
        label: "Messages",
        default: [],
        fields: ["text", "href"],
      },
      autoPlayInterval: {
        type: "number" as const,
        label: "Auto-play interval (ms)",
        default: 4500,
        min: 1000,
        max: 10000,
        step: 500,
      },
      pauseOnHover: {
        type: "boolean" as const,
        label: "Pause on hover",
        default: true,
      },
      transitionDuration: {
        type: "number" as const,
        label: "Transition duration (ms)",
        default: 600,
        min: 100,
        max: 2000,
        step: 100,
      },
    },
  },

  [WIDGET_TYPES.Header]: {
    type: WIDGET_TYPES.Header,
    name: "Header",
    description: "Site header with navigation, search, and cart.",
    settingsSchema: {
      logoPath: {
        type: "text" as const,
        label: "Logo image path",
        default: "/assets/momsco/svg/momsco-logo.svg",
      },
      isSticky: {
        type: "boolean" as const,
        label: "Sticky header",
        default: true,
      },
      hideOnScrollDown: {
        type: "boolean" as const,
        label: "Hide on scroll down",
        default: true,
      },
      searchPlaceholder: {
        type: "text" as const,
        label: "Search placeholder text",
        default: "Search for Products",
      },
      whatsappHref: {
        type: "text" as const,
        label: "WhatsApp link",
        default: "https://wa.me/8422873121",
      },
      cartHref: {
        type: "text" as const,
        label: "Cart link",
        default: "/cart",
      },
      navLinks: {
        type: "objectArray" as const,
        label: "Navigation Links",
        default: [],
        fields: ["text", "href"],
      },
      dropdownItems: {
        type: "objectArray" as const,
        label: "Dropdown Menu Items",
        default: [],
        fields: ["category", "text", "href"],
      },
    },
  },

  [WIDGET_TYPES.HeroSlideshow]: {
    type: WIDGET_TYPES.HeroSlideshow,
    name: "Hero Slideshow",
    description: "Full-width hero banner with image slideshow.",
    settingsSchema: {
      slides: {
        type: "objectArray" as const,
        label: "Slides",
        default: [],
        fields: ["desktopImage", "mobileImage", "href", "alt"],
      },
      autoplayMs: {
        type: "number" as const,
        label: "Autoplay interval (ms)",
        default: 7000,
        min: 1000,
        max: 15000,
        step: 500,
      },
      mobileBreakpoint: {
        type: "number" as const,
        label: "Mobile breakpoint (px)",
        default: 550,
        min: 320,
        max: 1024,
        step: 1,
      },
    },
  },

  [WIDGET_TYPES.Welcome]: {
    type: WIDGET_TYPES.Welcome,
    name: "Welcome",
    description: "Welcome / about section with brand introduction.",
    settingsSchema: {
      headingPrefix: {
        type: "text" as const,
        label: "Heading prefix",
        default: "Welcome to",
      },
      bodyText: {
        type: "text" as const,
        label: "Body text",
        default:
          "Parenthood is a beautiful journey, filled with moments that deserve comfort and joy. Guided by parents, we craft thoughtful baby essentials, designed to be luxuriously soft, safe, and made to last for your little one.",
      },
      logoPath: {
        type: "text" as const,
        label: "Logo image path",
        default: "/assets/nintarababy/welcome/nintara-logo.webp",
      },
      bgDesktopPath: {
        type: "text" as const,
        label: "Background image (desktop)",
        default: "/assets/nintarababy/welcome/bg-desktop.webp",
      },
      bgMobilePath: {
        type: "text" as const,
        label: "Background image (mobile)",
        default: "/assets/nintarababy/welcome/bg-mobile.webp",
      },
      badges: {
        type: "objectArray" as const,
        label: "Certification badges",
        default: [],
        fields: ["label", "iconSrc", "alt"],
      },
    },
  },

  [WIDGET_TYPES.ShopByCategory]: {
    type: WIDGET_TYPES.ShopByCategory,
    name: "Shop by Category",
    description: "Category grid for browsing product categories.",
    settingsSchema: {
      heading: {
        type: "text" as const,
        label: "Heading",
        default: "Shop by Category",
      },
      subtitle: {
        type: "text" as const,
        label: "Subtitle",
        default: "Find your perfect baby must-haves.",
      },
      categories: {
        type: "objectArray" as const,
        label: "Categories",
        default: [],
        fields: ["label", "image", "href", "hasNewBadge", "superscript"],
      },
    },
  },

  [WIDGET_TYPES.FeaturedProducts]: {
    type: WIDGET_TYPES.FeaturedProducts,
    name: "Featured Products",
    description: "Product grid showing featured/bestseller products.",
    requiresDataSource: true,
    compatibleDataSources: ["COLLECTION_BY_HANDLES"],
    settingsSchema: {
      heading: {
        type: "text" as const,
        label: "Heading",
        default: "Featured Products",
      },
      subtitle: {
        type: "text" as const,
        label: "Subtitle",
        default: "Our top picks, trusted by parents.",
      },
      viewAllText: {
        type: "text" as const,
        label: "View all button text",
        default: "View all",
      },
      viewAllLink: {
        type: "text" as const,
        label: "View all button link",
        default: "/collections/all-products",
      },
      collectionHandle: {
        type: "text" as const,
        label: "Collection handle (data source)",
        default: "bestseller",
      },
      productLimit: {
        type: "number" as const,
        label: "Max products to show",
        default: 8,
        min: 1,
        max: 20,
        step: 1,
      },
    },
  },

  [WIDGET_TYPES.Testimonials]: {
    type: WIDGET_TYPES.Testimonials,
    name: "Testimonials",
    description: "Customer testimonial cards.",
    settingsSchema: {
      heading: {
        type: "text" as const,
        label: "Heading",
        default: "Testimonials",
      },
      subtitle: {
        type: "text" as const,
        label: "Subtitle",
        default: "Hear it from our Nintara parents",
      },
      testimonials: {
        type: "objectArray" as const,
        label: "Testimonials",
        default: [],
        fields: [
          "reviewText",
          "reviewerName",
          "cardImageSrc",
          "productName",
          "productHref",
          "productThumbnailSrc",
        ],
      },
    },
  },

  [WIDGET_TYPES.Blog]: {
    type: WIDGET_TYPES.Blog,
    name: "Blog",
    description: "Blog / content cards section.",
    settingsSchema: {
      heading: {
        type: "text" as const,
        label: "Heading",
        default: "We\u2019re Here For You!",
      },
      seeAllText: {
        type: "text" as const,
        label: "See All button text",
        default: "See All",
      },
      seeAllLink: {
        type: "text" as const,
        label: "See All button link",
        default: "/blogs/blog",
      },
      posts: {
        type: "objectArray" as const,
        label: "Blog Posts",
        default: [],
        fields: [
          "title",
          "url",
          "category",
          "date",
          "readTime",
          "excerpt",
          "desktopImage",
          "mobileImage",
        ],
      },
    },
  },

  [WIDGET_TYPES.Footer]: {
    type: WIDGET_TYPES.Footer,
    name: "Footer",
    description: "Site footer with links, contact info, and social media.",
    settingsSchema: {
      seoHeading: {
        type: "text" as const,
        label: "SEO Heading",
        default: "Best Baby Care Products Online",
      },
      seoAccordionTitle: {
        type: "text" as const,
        label: "SEO Accordion Title",
        default:
          "Welcome to Nintara Baby - Your Go-to Baby Essentials Online Store",
      },
      seoAccordionContent: {
        type: "text" as const,
        label: "SEO Accordion Content",
        default:
          "We are proud to feature an exclusive selection of organic cotton baby products. Our products are free of harmful chemicals and are made from natural materials that provide the highest level of comfort and care for your children.",
      },
      contactAddress: {
        type: "text" as const,
        label: "Contact Address",
        default:
          "Grasper Global Private Limited 2nd & 3rd Floor, Unit No. 414, Sahas Apartment, Plot Number 1216, Private Road, Off Veer Savarkar Marg, Prabhadevi, Mumbai- 400025.",
      },
      contactWhatsapp: {
        type: "text" as const,
        label: "WhatsApp Number",
        default: "+918422873121",
      },
      contactEmail: {
        type: "text" as const,
        label: "Email Address",
        default: "hello@nintarababy.in",
      },
      newsletterHeading: {
        type: "text" as const,
        label: "Newsletter Heading",
        default: "Subscribe to our newsletter",
      },
      facebookUrl: {
        type: "text" as const,
        label: "Facebook URL",
        default: "https://www.facebook.com/profile.php?id=61561442655559",
      },
      instagramUrl: {
        type: "text" as const,
        label: "Instagram URL",
        default: "https://www.instagram.com/nintarababyindia/",
      },
      helpLinks: {
        type: "objectArray" as const,
        label: "Help Links",
        default: [],
        fields: ["text", "href", "badge"],
      },
      otherLinks: {
        type: "objectArray" as const,
        label: "Other Links",
        default: [],
        fields: ["text", "href"],
      },
      categoryLinks: {
        type: "objectArray" as const,
        label: "Category Links",
        default: [],
        fields: ["text", "href"],
      },
    },
  },

  [WIDGET_TYPES.BottomBar]: {
    type: WIDGET_TYPES.BottomBar,
    name: "Bottom Bar",
    description: "Copyright and legal links bar.",
    settingsSchema: {
      copyrightText: {
        type: "text" as const,
        label: "Copyright Text",
        default:
          "\u00A9 2025 Grasper Global Private Limited. All rights reserved.",
      },
    },
  },

  // ─── Product page widgets ──────────────────────────────────────────────

  [WIDGET_TYPES.Breadcrumb]: {
    type: WIDGET_TYPES.Breadcrumb,
    name: "Breadcrumb",
    description: "Navigation breadcrumb trail.",
    settingsSchema: {},
  },

  [WIDGET_TYPES.ProductMain]: {
    type: WIDGET_TYPES.ProductMain,
    name: "Product Main",
    description:
      "Main product display with gallery, title, price, and add-to-cart.",
    requiresDataSource: true,
    compatibleDataSources: ["PRODUCT"],
    settingsSchema: {},
  },

  [WIDGET_TYPES.KeyFeatures]: {
    type: WIDGET_TYPES.KeyFeatures,
    name: "Key Features",
    description: "Product key features / highlights section.",
    settingsSchema: {},
  },

  [WIDGET_TYPES.ProductTabs]: {
    type: WIDGET_TYPES.ProductTabs,
    name: "Product Tabs",
    description: "Tabbed content for product details, ingredients, etc.",
    settingsSchema: {},
  },

  [WIDGET_TYPES.TestimonialsCarousel]: {
    type: WIDGET_TYPES.TestimonialsCarousel,
    name: "Testimonials Carousel",
    description: "Scrollable testimonial carousel.",
    settingsSchema: {},
  },

  [WIDGET_TYPES.HowToUseInstructions]: {
    type: WIDGET_TYPES.HowToUseInstructions,
    name: "How to Use",
    description: "Step-by-step usage instructions.",
    settingsSchema: {},
  },

  [WIDGET_TYPES.VideoAndBrandValues]: {
    type: WIDGET_TYPES.VideoAndBrandValues,
    name: "Video & Brand Values",
    description: "Brand video and values showcase.",
    settingsSchema: {},
  },

  [WIDGET_TYPES.LovedByParentsCarousel]: {
    type: WIDGET_TYPES.LovedByParentsCarousel,
    name: "Loved by Parents",
    description: "Social proof carousel from parents.",
    settingsSchema: {},
  },

  [WIDGET_TYPES.WhatsAppCommunity]: {
    type: WIDGET_TYPES.WhatsAppCommunity,
    name: "WhatsApp Community",
    description: "WhatsApp community join CTA.",
    settingsSchema: {},
  },

  [WIDGET_TYPES.FAQsAccordion]: {
    type: WIDGET_TYPES.FAQsAccordion,
    name: "FAQs",
    description: "Frequently asked questions accordion.",
    settingsSchema: {},
  },

  [WIDGET_TYPES.CustomerReviews]: {
    type: WIDGET_TYPES.CustomerReviews,
    name: "Customer Reviews",
    description: "Customer reviews and ratings section.",
    settingsSchema: {},
  },

  // ─── Collection page widgets ───────────────────────────────────────────

  [WIDGET_TYPES.CollectionBanner]: {
    type: WIDGET_TYPES.CollectionBanner,
    name: "Collection Banner",
    description: "Banner image for collection pages.",
    settingsSchema: {},
  },

  [WIDGET_TYPES.CollectionHeader]: {
    type: WIDGET_TYPES.CollectionHeader,
    name: "Collection Header",
    description: "Collection title and description header.",
    settingsSchema: {},
  },

  [WIDGET_TYPES.CategoryTabBar]: {
    type: WIDGET_TYPES.CategoryTabBar,
    name: "Category Tab Bar",
    description: "Horizontal tab bar for browsing categories.",
    settingsSchema: {
      activeHandle: {
        type: "text" as const,
        label: "Active category handle",
        default: "",
      },
    },
  },

  [WIDGET_TYPES.FilterSortBar]: {
    type: WIDGET_TYPES.FilterSortBar,
    name: "Filter & Sort Bar",
    description: "Filtering and sorting controls for product listings.",
    settingsSchema: {
      activeSortValue: {
        type: "text" as const,
        label: "Default sort value",
        default: "",
      },
    },
  },

  [WIDGET_TYPES.ProductGrid]: {
    type: WIDGET_TYPES.ProductGrid,
    name: "Product Grid",
    description: "Grid layout for product listings.",
    requiresDataSource: true,
    compatibleDataSources: ["COLLECTION_BY_HANDLES"],
    settingsSchema: {},
  },

  [WIDGET_TYPES.LoadMorePagination]: {
    type: WIDGET_TYPES.LoadMorePagination,
    name: "Load More Pagination",
    description: "Load more button for paginated product listings.",
    settingsSchema: {},
  },

  // ─── Utility widgets ──────────────────────────────────────────────────

  [WIDGET_TYPES.FloatingActions]: {
    type: WIDGET_TYPES.FloatingActions,
    name: "Floating Actions",
    description: "Floating action buttons (WhatsApp, scroll-to-top, etc.).",
    settingsSchema: {},
  },

  [WIDGET_TYPES.MobileBottomBar]: {
    type: WIDGET_TYPES.MobileBottomBar,
    name: "Mobile Bottom Bar",
    description: "Mobile-only bottom navigation bar.",
    settingsSchema: {},
  },
};
