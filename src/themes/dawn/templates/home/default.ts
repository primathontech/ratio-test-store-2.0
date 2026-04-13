import type { PageConfig } from "@shopkit/builder";
import { WIDGET_TYPES } from "@/widgets/.generated/types";
import {
  SECTION_TYPES,
  SECTION_LAYOUT_OPTIONS,
  DATA_SOURCE_TYPES,
} from "@shopkit/builder";

/* ------------------------------------------------------------------ */
/*  Helper: section config for a FeaturedCollectionCarousel widget      */
/* ------------------------------------------------------------------ */

function carouselSection(
  id: string,
  name: string,
  headingNormal: string,
  headingBold: string,
  dataSourceKey: string,
  collectionHandle: string
) {
  return {
    id: `${id}-section`,
    name,
    type: SECTION_TYPES.CONTENT_SECTION,
    settings: {
      layout: SECTION_LAYOUT_OPTIONS.FULL,
      responsive: {
        mobile: { padding: { top: 0, right: 0, bottom: 0, left: 0 } },
        tablet: { padding: { top: 0, right: 0, bottom: 0, left: 0 } },
        desktop: { padding: { top: 0, right: 0, bottom: 0, left: 0 } },
      },
    },
    widgets: [
      {
        id: `dawn-${id}`,
        name,
        type: WIDGET_TYPES.FeaturedCollectionCarousel,
        dataSourceKey,
        settings: {
          variant: "v1",
          headingNormal,
          headingBold,
          collectionHandle,
        },
      },
    ],
  };
}

/**
 * Home Page Template for dawn
 */
export const template: PageConfig = {
  id: "dawn-home",
  dataSources: {
    hairCareBffsCollections: {
      type: DATA_SOURCE_TYPES.COLLECTION_BY_HANDLES,
      params: {
        handles: ["most-loved-home-page", "shampoo-haircarebffs"],
        productLimit: 1,
      },
      required: false,
    },
    mostLovedCarousel: {
      type: DATA_SOURCE_TYPES.COLLECTION,
      params: {
        handle: "most-loved-home-page",
        productLimit: 1,
      },
      required: false,
    },
    shampooCarousel: {
      type: DATA_SOURCE_TYPES.COLLECTION,
      params: {
        handle: "shampoo-haircarebffs",
        productLimit: 1,
      },
      required: false,
    },
  },
  sections: [
    // Announcement Bar Section
    {
      id: "announcement-bar-section",
      name: "Announcement Bar",
      type: SECTION_TYPES.HEADER_SECTION,
      settings: {
        layout: SECTION_LAYOUT_OPTIONS.FULL,
        responsive: {
          mobile: { padding: { top: 0, right: 0, bottom: 0, left: 0 } },
          tablet: { padding: { top: 0, right: 0, bottom: 0, left: 0 } },
          desktop: { padding: { top: 0, right: 0, bottom: 0, left: 0 } },
        },
      },
      widgets: [
        {
          id: "dawn-announcement-bar",
          name: "Announcement Bar",
          type: WIDGET_TYPES.AnnouncementBar,
          settings: {
            variant: "v1",
            backgroundColor: "#000000",
            textColor: "#ffffff",
            speed: 35,
            pauseOnHover: true,
            items: [
              {
                text: "Buy 3 Products at \u20B9799 | Use code : <strong>FLAT3</strong>",
                href: "/pages/flat3",
              },
              {
                text: "Shop for \u20B9499 & Get 2 Best Sellers FREE | Code : <strong>FREEIM</strong>",
                href: "/pages/shine-squad-weekly-offer",
              },
            ],
          },
        },
      ],
    },

    // Header Section
    {
      id: "header-section",
      name: "Header",
      type: SECTION_TYPES.HEADER_SECTION,
      settings: {
        layout: SECTION_LAYOUT_OPTIONS.FULL,
        responsive: {
          mobile: { padding: { top: 0, right: 0, bottom: 0, left: 0 } },
          tablet: { padding: { top: 0, right: 0, bottom: 0, left: 0 } },
          desktop: { padding: { top: 0, right: 0, bottom: 0, left: 0 } },
        },
      },
      widgets: [
        {
          id: "dawn-header",
          name: "Header",
          type: WIDGET_TYPES.Header,
          settings: {
            variant: "v1",
            logoSrc: "/Header/images/logo.png",
            logoAlt: "BBlunt",
            searchPlaceholder: "Search For Conditioner, Shampoo...",
            cartHref: "/cart",
            accountHref: "/account",
          },
        },
      ],
    },

    // Hero Banner Carousel Section
    {
      id: "hero-banner-carousel-section",
      name: "Hero Banner Carousel",
      type: SECTION_TYPES.CONTENT_SECTION,
      settings: {
        layout: SECTION_LAYOUT_OPTIONS.FULL,
        responsive: {
          mobile: { padding: { top: 0, right: 0, bottom: 0, left: 0 } },
          tablet: { padding: { top: 0, right: 0, bottom: 0, left: 0 } },
          desktop: { padding: { top: 0, right: 0, bottom: 0, left: 0 } },
        },
      },
      widgets: [
        {
          id: "dawn-hero-banner-carousel",
          name: "Hero Banner Carousel",
          type: WIDGET_TYPES.HeroBannerCarousel,
          settings: {
            variant: "v1",
            autoPlayInterval: 5000,
            loop: true,
            desktopWidth: 1440,
            desktopHeight: 529,
            mobileWidth: 1200,
            mobileHeight: 1200,
            slides: [
              {
                type: "image",
                href: "/pages/shine-squad-bb30-offer",
                desktopImage: "/HeroBannerCarousel/images/slide1-desktop.webp",
                mobileImage: "/HeroBannerCarousel/images/slide1-mobile.png",
                alt: "Get 3 Freebies on orders above Rs499 - Code FREETRIO",
              },
              {
                type: "image",
                href: "/pages/flat3",
                desktopImage: "/HeroBannerCarousel/images/slide2-desktop.jpg",
                mobileImage: "/HeroBannerCarousel/images/slide2-mobile.jpg",
                alt: "Buy 3 for Rs799 - Code FLAT3",
              },
              {
                type: "image",
                href: "/pages/shine-squad-get999",
                desktopImage: "/HeroBannerCarousel/images/slide3-desktop.jpg",
                mobileImage: "/HeroBannerCarousel/images/slide3-mobile.jpg",
                alt: "Up to 95% Frizz Reduction",
              },
              {
                type: "video",
                href: "/collections/dry-hair",
                desktopVideoSrc:
                  "https://bblunt.com/cdn/shop/videos/c/vp/9d41619129504abd8c80adeefe936559/9d41619129504abd8c80adeefe936559.SD-480p-1.5Mbps-64951035.mp4?v=0",
                mobileVideoSrc:
                  "https://bblunt.com/cdn/shop/videos/c/vp/23170c4a114945e69f8075c035dd7bbe/23170c4a114945e69f8075c035dd7bbe.HD-1080p-7.2Mbps-64441147.mp4?v=0",
                desktopPoster:
                  "/HeroBannerCarousel/images/slide4-poster-desktop.jpg",
                mobilePoster:
                  "/HeroBannerCarousel/images/slide4-poster-mobile.jpg",
                alt: "BBlunt Hair Care",
              },
            ],
          },
        },
      ],
    },

    // Shop by Concerns Section
    {
      id: "shop-by-concerns-section",
      name: "Shop by Concerns",
      type: SECTION_TYPES.CONTENT_SECTION,
      settings: {
        layout: SECTION_LAYOUT_OPTIONS.FULL,
        responsive: {
          mobile: { padding: { top: 0, right: 0, bottom: 0, left: 0 } },
          tablet: { padding: { top: 0, right: 0, bottom: 0, left: 0 } },
          desktop: { padding: { top: 0, right: 0, bottom: 0, left: 0 } },
        },
      },
      widgets: [
        {
          id: "dawn-shop-by-concerns",
          name: "Shop by Concerns",
          type: WIDGET_TYPES.ShopByConcerns,
          settings: {
            variant: "v1",
            headingNormal: "Shop by ",
            headingBold: "Concerns",
            tiles: [
              {
                label: "Hair fall fighters",
                href: "/collections/hairfall",
                image: "/ShopByConcerns/images/hair-fall-fighters.png",
              },
              {
                label: "Frizz fixers",
                href: "/collections/dry-hair",
                image: "/ShopByConcerns/images/frizz-fixers.png",
              },
              {
                label: "Damage repair",
                href: "/collections/damaged-hair",
                image: "/ShopByConcerns/images/damage-repair.png",
              },
              {
                label: "Smooth hair essentials",
                href: "/collections/advanced-smoothening",
                image: "/ShopByConcerns/images/smooth-hair-essentials.png",
              },
              {
                label: "Dandruff defence",
                href: "/collections/anti-dandruff",
                image: "/ShopByConcerns/images/dandruff-defence.png",
              },
              {
                label: "Curl care crew",
                href: null,
                image: "/ShopByConcerns/images/curl-care-crew.png",
              },
              {
                label: "Shine boosters",
                href: null,
                image: "/ShopByConcerns/images/shine-boosters.png",
              },
              {
                label: "Scalp saviours",
                href: null,
                image: "/ShopByConcerns/images/scalp-saviours.png",
              },
            ],
          },
        },
      ],
    },

    // Shop by Categories Section
    {
      id: "shop-by-categories-section",
      name: "Shop by Categories",
      type: SECTION_TYPES.CONTENT_SECTION,
      settings: {
        layout: SECTION_LAYOUT_OPTIONS.FULL,
        responsive: {
          mobile: { padding: { top: 0, right: 0, bottom: 0, left: 0 } },
          tablet: { padding: { top: 0, right: 0, bottom: 0, left: 0 } },
          desktop: { padding: { top: 0, right: 0, bottom: 0, left: 0 } },
        },
      },
      widgets: [
        {
          id: "dawn-shop-by-categories",
          name: "Shop by Categories",
          type: WIDGET_TYPES.ShopByCategories,
          settings: {
            variant: "v1",
            headingNormal: "Shop by ",
            headingBold: "Categories",
            tiles: [
              {
                label: "Shampoo",
                href: "/collections/shampoo",
                desktopImage: "/ShopByCategories/images/shampoo-desktop.png",
                mobileImage: "/ShopByCategories/images/shampoo-mobile.png",
              },
              {
                label: "Conditioner",
                href: "/collections/conditioner",
                desktopImage:
                  "/ShopByCategories/images/conditioner-desktop.png",
                mobileImage: "/ShopByCategories/images/conditioner-mobile.png",
              },
              {
                label: "Hair spray",
                href: "/collections/sprays",
                desktopImage: "/ShopByCategories/images/hair-spray-desktop.png",
                mobileImage: "/ShopByCategories/images/hair-spray-mobile.png",
              },
              {
                label: "Hair colour",
                href: "/collections/hair-colour",
                desktopImage:
                  "/ShopByCategories/images/hair-colour-desktop.png",
                mobileImage: "/ShopByCategories/images/hair-colour-mobile.png",
              },
              {
                label: "Hair serum",
                href: "/collections/serum",
                desktopImage: "/ShopByCategories/images/hair-serum-desktop.png",
                mobileImage: "/ShopByCategories/images/hair-serum-mobile.png",
              },
            ],
          },
        },
      ],
    },

    // Hair Care BFFs Section
    {
      id: "hair-care-bffs-section",
      name: "Hair Care BFFs",
      type: SECTION_TYPES.CONTENT_SECTION,
      settings: {
        layout: SECTION_LAYOUT_OPTIONS.FULL,
        responsive: {
          mobile: { padding: { top: 0, right: 0, bottom: 0, left: 0 } },
          tablet: { padding: { top: 0, right: 0, bottom: 0, left: 0 } },
          desktop: { padding: { top: 0, right: 0, bottom: 0, left: 0 } },
        },
      },
      widgets: [
        {
          id: "dawn-hair-care-bffs",
          name: "Hair Care BFFs",
          type: WIDGET_TYPES.HairCareBFFs,
          dataSourceKey: "hairCareBffsCollections",
          settings: {
            variant: "v1",
            headingNormal: "Hair Care ",
            headingBold: "BFFs",
            backgroundImage: "/HairCareBFFs/images/bg-watermark.png",
          },
        },
      ],
    },

    // ── FeaturedCollectionCarousel Sections (API-driven) ────────────
    // Note: All sections currently use mostLovedCarousel or shampooCarousel
    // as placeholder dataSources. Replace with proper per-collection
    // dataSources when those API handles are ready.

    // For Hair Fall Control — FeaturedCollectionCarousel #1
    carouselSection(
      "for-hair-fall-control",
      "For Hair Fall Control",
      "For ",
      "Hair Fall Control",
      "mostLovedCarousel",
      "most-loved-home-page"
    ),

    // For Party Ready Hair — FeaturedCollectionCarousel #2
    carouselSection(
      "for-party-ready-hair",
      "For Party Ready Hair",
      "For ",
      "Party Ready Hair at Home",
      "shampooCarousel",
      "shampoo-haircarebffs"
    ),

    // For Dull & Dry Hair — FeaturedCollectionCarousel #3
    carouselSection(
      "for-dull-dry-hair",
      "For Dull & Dry Hair",
      "For ",
      "Dull & Dry Hair",
      "mostLovedCarousel",
      "most-loved-home-page"
    ),

    // High Shine Creme Hair Colour — FeaturedCollectionCarousel #4
    carouselSection(
      "high-shine-creme-hair-colour",
      "High Shine Creme Hair Colour",
      "",
      "High Shine Creme Hair Colour",
      "shampooCarousel",
      "shampoo-haircarebffs"
    ),

    // For Damage Repair — FeaturedCollectionCarousel #5
    carouselSection(
      "for-damage-repair",
      "For Damage Repair",
      "For ",
      "Damage Repair",
      "mostLovedCarousel",
      "most-loved-home-page"
    ),

    // For Advanced Smoothening — FeaturedCollectionCarousel #6
    carouselSection(
      "for-advanced-smoothening",
      "For Advanced Smoothening",
      "For ",
      "Advanced Smoothening",
      "shampooCarousel",
      "shampoo-haircarebffs"
    ),

    // For Extraordinary Shiny Hair — FeaturedCollectionCarousel #7
    carouselSection(
      "for-extraordinary-shiny-hair",
      "For Extraordinary Shiny Hair",
      "For ",
      "Extraordinary Shiny Hair",
      "mostLovedCarousel",
      "most-loved-home-page"
    ),

    // For Bond Repair — FeaturedCollectionCarousel #8
    carouselSection(
      "for-bond-repair",
      "For Bond Repair",
      "For ",
      "Bond Repair",
      "shampooCarousel",
      "shampoo-haircarebffs"
    ),

    // For Nourished & Defined Curls — FeaturedCollectionCarousel #9
    carouselSection(
      "for-nourished-defined-curls",
      "For Nourished & Defined Curls",
      "For ",
      "Nourished & Defined Curls",
      "mostLovedCarousel",
      "most-loved-home-page"
    ),

    // For Dandruff Control — FeaturedCollectionCarousel #10
    carouselSection(
      "for-dandruff-control",
      "For Dandruff Control",
      "For ",
      "Dandruff Control",
      "shampooCarousel",
      "shampoo-haircarebffs"
    ),

    // 5 Minute Shampoo Hair Colour — FeaturedCollectionCarousel #11
    carouselSection(
      "five-minute-shampoo-hair-colour",
      "5 Minute Shampoo Hair Colour",
      "5 Minute ",
      "Shampoo Hair Colour",
      "mostLovedCarousel",
      "most-loved-home-page"
    ),

    // Shine Academy Banner Section
    {
      id: "shine-academy-banner-section",
      name: "Shine Academy Banner",
      type: SECTION_TYPES.CONTENT_SECTION,
      settings: {
        layout: SECTION_LAYOUT_OPTIONS.FULL,
        responsive: {
          mobile: { padding: { top: 0, right: 0, bottom: 0, left: 0 } },
          tablet: { padding: { top: 0, right: 0, bottom: 0, left: 0 } },
          desktop: { padding: { top: 0, right: 0, bottom: 0, left: 0 } },
        },
      },
      widgets: [
        {
          id: "dawn-shine-academy-banner",
          name: "Shine Academy Banner",
          type: WIDGET_TYPES.ShineAcademyBanner,
          settings: {
            variant: "v1",
          },
        },
      ],
    },

    // Testimonials Section
    {
      id: "testimonials-section",
      name: "Testimonials",
      type: SECTION_TYPES.CONTENT_SECTION,
      settings: {
        layout: SECTION_LAYOUT_OPTIONS.FULL,
        responsive: {
          mobile: { padding: { top: 0, right: 0, bottom: 0, left: 0 } },
          tablet: { padding: { top: 0, right: 0, bottom: 0, left: 0 } },
          desktop: { padding: { top: 0, right: 0, bottom: 0, left: 0 } },
        },
      },
      widgets: [
        {
          id: "dawn-testimonials",
          name: "Testimonials",
          type: WIDGET_TYPES.Testimonials,
          settings: {
            variant: "v1",
            headingRegular: "What our",
            headingBold: "customers are saying?",
            cardBackground: "rgb(29, 29, 29)",
            testimonials: [
              {
                heading: "Surprised at the result",
                reviewText:
                  "So easy peasy to use! In just 5 minutes like shampoo I can apply and it leaves my hair so shiny and wonderful!! Totally recommended for people like me who can't get roots touched up every other week! Thanks BBLUNT!",
                authorName: "Amaira Joe",
                avatarSrc: "/Testimonials/images/amaira-joe.jpg",
                stars: 5,
              },
              {
                heading: "Last Longing Hair Colour!",
                reviewText:
                  "My friend suggested me use this hair colour, and I tried it. Guess what? I was shocked as it gives a smooth glossy & nourished finish, covers grey hairs, and looks natural. The colour easily lasted for more than two months, unlike other brands in the market.",
                authorName: "Nikita Advani",
                avatarSrc: "/Testimonials/images/nikita-advani.jpg",
                stars: 5,
              },
              {
                heading: "Love this Intense Moisture Range!",
                reviewText:
                  "The first impression after using the shampoo is really impressive. It gives smoothness & hydration and also helps to reduce dryness from my dry and color-treated hair. I highly recommend it to everyone with dry and damaged hair.",
                authorName: "Anita Agrawal",
                avatarSrc: "/Testimonials/images/anita-agrawal.jpg",
                stars: 5,
              },
              {
                heading: "Curly Girls Will Love This",
                reviewText:
                  "This BBLUNT Curly Hair Shampoo & Conditioner is the best combo for people with curly hair. It makes our hair frizz free and smooth, and even it makes it bounce that looks so gorgeous every time. Use both products together to get the best result.",
                authorName: "Tarini Menon",
                avatarSrc: "/Testimonials/images/tarini-menon.jpg",
                stars: 5,
              },
            ],
          },
        },
      ],
    },

    // Footer Section
    {
      id: "footer-section",
      name: "Footer",
      type: SECTION_TYPES.FOOTER_SECTION,
      settings: {
        layout: SECTION_LAYOUT_OPTIONS.FULL,
        responsive: {
          mobile: { padding: { top: 20, right: 0, bottom: 0, left: 0 } },
          tablet: { padding: { top: 20, right: 0, bottom: 0, left: 0 } },
          desktop: { padding: { top: 20, right: 0, bottom: 0, left: 0 } },
        },
      },
      widgets: [
        {
          id: "dawn-footer",
          name: "Footer",
          type: WIDGET_TYPES.Footer,
          settings: { variant: "v1" },
        },
      ],
    },
  ],
};
