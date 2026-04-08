import type { PageConfig } from "@shopkit/builder";
import { WIDGET_TYPES } from "@/widgets/.generated/types";
import { SECTION_TYPES, SECTION_LAYOUT_OPTIONS } from "@shopkit/builder";

/**
 * Home Page Template for dawn
 */
export const template: PageConfig = {
  id: "dawn-home",
  dataSources: {},
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
                text: "Buy 3 Products at \u20B9799 | Use code : ",
                href: "/pages/flat3",
                boldPart: "FLAT3",
              },
              {
                text: "Shop for \u20B9499 & Get 2 Best Sellers FREE | Code : ",
                href: "/pages/shine-squad-weekly-offer",
                boldPart: "FREEIM",
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
          settings: {
            variant: "v1",
            headingNormal: "Hair Care ",
            headingBold: "BFFs",
            backgroundImage: "/HairCareBFFs/images/bg-watermark.png",
            tabs: [
              {
                name: "Most Loved",
                collectionHandle: "most-loved-home-page",
                viewAllCount: 12,
                products: [
                  {
                    href: "/products/hot-shot-hold-spray",
                    title:
                      "Hot Shot Hold Spray for Instant & Firm Hold - 300 ml",
                    subtitle: "Leaves No Residue | No Alcohol",
                    alt: "Hot Shot Hold Spray",
                    mainImage:
                      "https://bblunt.com/cdn/shop/files/1_14c1b0be-a8b7-44b2-8f91-36b47a66dc90.jpg?v=1763705200&width=360",
                    hoverImage:
                      "https://bblunt.com/cdn/shop/files/2_73ee2ca6-59e0-4843-83e2-8330b4a72460.jpg?v=1763705200&width=360",
                    category: "Hair Styling",
                    badge: "+3 Gifts",
                    rating: 4.8,
                    reviewCount: 169,
                    price: "\u20B9599",
                    netContent: "300ml",
                  },
                  {
                    href: "/products/hot-shot-heat-protection-mist",
                    title:
                      "Hot Shot Heat Protection Mist with Grapeseed Oil & Provitamin B5 - 150 ml",
                    subtitle:
                      "Prevents Damage | Upto 230\u00B0 Celsius Protection",
                    alt: "Hot Shot Heat Protection Mist",
                    mainImage:
                      "https://bblunt.com/cdn/shop/files/1_cb2dc9d5-b3c2-45ca-aed1-4e85e04a1fc0.jpg?v=1763705200&width=360",
                    hoverImage:
                      "https://bblunt.com/cdn/shop/files/2_e7e3ad0a-b6e6-4f2d-ae75-bce5c1a19d63.jpg?v=1763705200&width=360",
                    category: "Hair Styling",
                    badge: "+3 Gifts",
                    rating: 4.8,
                    reviewCount: 337,
                    price: "\u20B9499",
                    netContent: "150ml",
                  },
                  {
                    href: "/products/hair-fall-control-shampoo",
                    title:
                      "Hair Fall Control Shampoo with Pea Protein & Caffeine for Stronger Hair - 300 ml",
                    subtitle: "Reduces Up to 93% Hair Fall | Adds Shine",
                    alt: "Hair Fall Control Shampoo",
                    mainImage:
                      "https://bblunt.com/cdn/shop/files/1_3e8c9f1a-3f4c-4e5b-bf8b-14c5f7fc5a68.jpg?v=1763705200&width=360",
                    hoverImage:
                      "https://bblunt.com/cdn/shop/files/2_1f4e6b7a-ae6c-4fd1-a0e3-ec8e98bda1e6.jpg?v=1763705200&width=360",
                    category: "Shampoo",
                    badge: "+3 Gifts",
                    rating: 4.8,
                    reviewCount: 667,
                    price: "\u20B9355",
                    netContent: "300ml",
                  },
                  {
                    href: "/products/hair-fall-control-conditioner",
                    title:
                      "Hair Fall Control Conditioner for Stronger Hair - 250 g",
                    subtitle:
                      "Reduces Up to 93% Hair Fall | Softens Hair & Adds Shine",
                    alt: "Hair Fall Control Conditioner",
                    mainImage:
                      "https://bblunt.com/cdn/shop/files/1_d1e2f3a4-b5c6-7d8e-9f0a-1b2c3d4e5f6a.jpg?v=1763705200&width=360",
                    hoverImage:
                      "https://bblunt.com/cdn/shop/files/2_a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d.jpg?v=1763705200&width=360",
                    category: "Conditioner",
                    badge: "+3 Gifts",
                    rating: 4.8,
                    reviewCount: 390,
                    price: "\u20B9399",
                    netContent: "250g",
                  },
                  {
                    href: "/products/7-in-1-repair-revive-hair-mask",
                    title:
                      "7 in 1 Repair & Revive Hair Mask for Upto 100% Damage Repair",
                    subtitle:
                      "Addresses 7 Signs of Hair Damage | Enriched with Ceramides & Argan Oil",
                    alt: "7 in 1 Repair & Revive Hair Mask",
                    mainImage:
                      "https://bblunt.com/cdn/shop/files/1_f5e4d3c2-b1a0-9f8e-7d6c-5b4a3f2e1d0c.jpg?v=1763705200&width=360",
                    hoverImage:
                      "https://bblunt.com/cdn/shop/files/2_c0d1e2f3-a4b5-6c7d-8e9f-0a1b2c3d4e5f.jpg?v=1763705200&width=360",
                    category: "Hair Mask",
                    badge: "+3 Gifts",
                    rating: 4.7,
                    reviewCount: 314,
                    price: "\u20B9499",
                    netContent: "250g",
                  },
                ],
              },
              {
                name: "Shampoo",
                collectionHandle: "shampoo",
                viewAllCount: 13,
                products: [
                  {
                    href: "/products/hair-fall-control-shampoo",
                    title:
                      "Hair Fall Control Shampoo with Pea Protein & Caffeine - 300 ml",
                    subtitle: "Reduces Up to 93% Hair Fall | Adds Shine",
                    alt: "Hair Fall Control Shampoo",
                    mainImage:
                      "https://bblunt.com/cdn/shop/files/1_3e8c9f1a-3f4c-4e5b-bf8b-14c5f7fc5a68.jpg?v=1763705200&width=360",
                    category: "Shampoo",
                    badge: "+3 Gifts",
                    rating: 4.8,
                    reviewCount: 667,
                    price: "\u20B9355",
                    netContent: "300ml",
                  },
                ],
              },
              {
                name: "Conditioner",
                collectionHandle: "conditioner",
                viewAllCount: 8,
                products: [
                  {
                    href: "/products/hair-fall-control-conditioner",
                    title:
                      "Hair Fall Control Conditioner for Stronger Hair - 250 g",
                    subtitle:
                      "Reduces Up to 93% Hair Fall | Softens Hair & Adds Shine",
                    alt: "Hair Fall Control Conditioner",
                    mainImage:
                      "https://bblunt.com/cdn/shop/files/1_d1e2f3a4-b5c6-7d8e-9f0a-1b2c3d4e5f6a.jpg?v=1763705200&width=360",
                    category: "Conditioner",
                    badge: "+3 Gifts",
                    rating: 4.8,
                    reviewCount: 390,
                    price: "\u20B9399",
                    netContent: "250g",
                  },
                ],
              },
              {
                name: "Hair Spray",
                collectionHandle: "hair-styling",
                viewAllCount: 10,
                products: [
                  {
                    href: "/products/hot-shot-hold-spray",
                    title:
                      "Hot Shot Hold Spray for Instant & Firm Hold - 300 ml",
                    subtitle: "Leaves No Residue | No Alcohol",
                    alt: "Hot Shot Hold Spray",
                    mainImage:
                      "https://bblunt.com/cdn/shop/files/1_14c1b0be-a8b7-44b2-8f91-36b47a66dc90.jpg?v=1763705200&width=360",
                    category: "Hair Styling",
                    badge: "+3 Gifts",
                    rating: 4.8,
                    reviewCount: 169,
                    price: "\u20B9599",
                    netContent: "300ml",
                  },
                ],
              },
              {
                name: "Hair Colour",
                collectionHandle: "hair-colour",
                viewAllCount: 15,
                products: [
                  {
                    href: "/products/salon-secret-high-shine-creme-hair-colour",
                    title: "Salon Secret High Shine Creme Hair Colour",
                    subtitle: "100% Grey Coverage | Enriched with Shine Tonic",
                    alt: "High Shine Creme Hair Colour",
                    mainImage:
                      "https://bblunt.com/cdn/shop/files/1_hair_colour_placeholder.jpg?v=1763705200&width=360",
                    category: "Hair Colour",
                    rating: 4.6,
                    reviewCount: 245,
                    price: "\u20B9450",
                  },
                ],
              },
              {
                name: "Hair Mask",
                collectionHandle: "hair-masks",
                viewAllCount: 6,
                products: [
                  {
                    href: "/products/7-in-1-repair-revive-hair-mask",
                    title:
                      "7 in 1 Repair & Revive Hair Mask for Upto 100% Damage Repair",
                    subtitle:
                      "Addresses 7 Signs of Hair Damage | Enriched with Ceramides & Argan Oil",
                    alt: "7 in 1 Repair & Revive Hair Mask",
                    mainImage:
                      "https://bblunt.com/cdn/shop/files/1_f5e4d3c2-b1a0-9f8e-7d6c-5b4a3f2e1d0c.jpg?v=1763705200&width=360",
                    category: "Hair Mask",
                    badge: "+3 Gifts",
                    rating: 4.7,
                    reviewCount: 314,
                    price: "\u20B9499",
                    netContent: "250g",
                  },
                ],
              },
            ],
          },
        },
      ],
    },

    // For Hair Fall Control — ProductCarousel #1
    {
      id: "for-hair-fall-control-section",
      name: "For Hair Fall Control",
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
          id: "dawn-for-hair-fall-control",
          name: "For Hair Fall Control",
          type: WIDGET_TYPES.ProductCarousel,
          settings: {
            variant: "v1",
            headingNormal: "For ",
            headingBold: "Hair Fall Control",
            collectionHandle: "hairfall",
            viewAllCount: 12,
            products: [
              {
                href: "/products/hair-fall-control-hair-mask",
                title:
                  "Hair Fall Control Hair Mask with Pea Protein & Caffeine for Stronger Hair - 250 g",
                subtitle:
                  "Reduces Hair Fall | Strengthens Hair | Enriched with Shine Tonic",
                alt: "Hair Fall Control Hair Mask",
                mainImage:
                  "https://bblunt.com/cdn/shop/files/1_1_54_32bbf09a-9120-4264-ab21-f67169305eca.jpg?v=1734339498&width=360",
                hoverImage:
                  "https://bblunt.com/cdn/shop/files/2_1_54_32bbf09a-9120-4264-ab21-f67169305eca.jpg?v=1734339498&width=360",
                category: "Hair Mask",
                badge: "+3 Gifts",
                badgeColor: "green",
                netContent: "250g",
                rating: 4.6,
                reviewCount: 104,
                price: "\u20B9499",
              },
              {
                href: "/products/hair-fall-control-scalp-hair-tonic",
                title: "Hair Fall Control Scalp Hair Tonic 50 ml",
                subtitle: "Controls Hair Fall | Improves Hair Growth",
                alt: "Hair Fall Control Scalp Hair Tonic",
                mainImage:
                  "https://bblunt.com/cdn/shop/files/1_1_55.jpg?v=1734339498&width=360",
                hoverImage:
                  "https://bblunt.com/cdn/shop/files/2_1_55.jpg?v=1734339498&width=360",
                category: "Hair Tonics",
                badge: "+3 Gifts",
                badgeColor: "green",
                netContent: "50ml",
                rating: 4.3,
                reviewCount: 125,
                price: "\u20B9499",
              },
              {
                href: "/products/hair-fall-control-heat-hair-spa-mask",
                title:
                  "Hair Fall Control Heat Hair Spa Mask with Pea Protein & Caffeine - 70 g",
                subtitle:
                  "Salon-Like Hair Spa in Just 5 Minutes | Reduces Hair Fall",
                alt: "Hair Fall Control Heat Hair Spa Mask",
                mainImage:
                  "https://bblunt.com/cdn/shop/files/1_1_56.jpg?v=1734339498&width=360",
                category: "Spa Mask",
                netContent: "70g",
                rating: 4.1,
                reviewCount: 52,
                price: "\u20B9349",
              },
              {
                href: "/products/hair-fall-control-shampoo-conditioner-combo",
                title:
                  "Hair Fall Control Shampoo & Conditioner Combo for Stronger Hair",
                subtitle: "Controls Hair Fall | Strengthens & Nourishes Hair",
                alt: "Hair Fall Control Shampoo & Conditioner Combo",
                mainImage:
                  "https://bblunt.com/cdn/shop/files/1_1_57.jpg?v=1734339498&width=360",
                category: "Combos",
                badge: "Bestseller",
                badgeColor: "orange",
                rating: 4.6,
                reviewCount: 440,
                price: "\u20B9603",
                originalPrice: "\u20B9754",
                discountLabel: "20% off",
              },
              {
                href: "/products/hair-fall-control-duo",
                title: "Hair Fall Control Duo",
                subtitle:
                  "Reduces Up to 93% Hair Fall | Strengthens & Nourishes Hair",
                alt: "Hair Fall Control Duo",
                mainImage:
                  "https://bblunt.com/cdn/shop/files/hair_fall_shampoo_serum_0f8fcf2d-2ac0-4d3a-9328-f451470694a7.jpg?v=1734339465&width=360",
                category: "Combos",
                netContent: "Pack of 2",
                rating: 4.9,
                reviewCount: 56,
                price: "\u20B9683",
                originalPrice: "\u20B9854",
                discountLabel: "20% off",
              },
            ],
          },
        },
      ],
    },

    // For Party Ready Hair — ProductCarousel #2
    {
      id: "for-party-ready-hair-section",
      name: "For Party Ready Hair",
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
          id: "dawn-for-party-ready-hair",
          name: "For Party Ready Hair",
          type: WIDGET_TYPES.ProductCarousel,
          settings: {
            variant: "v1",
            headingNormal: "For ",
            headingBold: "Party Ready Hair at Home",
            collectionHandle: "party-ready-hair",
            viewAllCount: 10,
            products: [
              {
                href: "/products/hot-shot-hold-spray",
                title: "Hot Shot Hold Spray for Instant & Firm Hold - 300 ml",
                subtitle: "Leaves No Residue | No Alcohol",
                alt: "Hot Shot Hold Spray",
                mainImage:
                  "https://bblunt.com/cdn/shop/files/1_14c1b0be-a8b7-44b2-8f91-36b47a66dc90.jpg?v=1763705200&width=360",
                hoverImage:
                  "https://bblunt.com/cdn/shop/files/2_73ee2ca6-59e0-4843-83e2-8330b4a72460.jpg?v=1763705200&width=360",
                category: "Hair Styling",
                badge: "+3 Gifts",
                badgeColor: "green",
                netContent: "300ml",
                rating: 4.8,
                reviewCount: 169,
                price: "\u20B9599",
              },
              {
                href: "/products/hot-shot-heat-protection-mist",
                title:
                  "Hot Shot Heat Protection Mist with Grapeseed Oil & Provitamin B5 - 150 ml",
                subtitle: "Prevents Damage | Upto 230\u00B0 Celsius Protection",
                alt: "Hot Shot Heat Protection Mist",
                mainImage:
                  "https://bblunt.com/cdn/shop/files/1_cb2dc9d5-b3c2-45ca-aed1-4e85e04a1fc0.jpg?v=1763705200&width=360",
                hoverImage:
                  "https://bblunt.com/cdn/shop/files/2_e7e3ad0a-b6e6-4f2d-ae75-bce5c1a19d63.jpg?v=1763705200&width=360",
                category: "Hair Styling",
                badge: "+3 Gifts",
                badgeColor: "green",
                netContent: "150ml",
                rating: 4.8,
                reviewCount: 337,
                price: "\u20B9499",
              },
              {
                href: "/products/back-to-life-dry-shampoo",
                title:
                  "Back to Life Dry Shampoo for Instant Freshness - 125 ml",
                subtitle: "Oil Absorption | Volume Boost",
                alt: "Back to Life Dry Shampoo",
                mainImage:
                  "https://bblunt.com/cdn/shop/files/1_dry_shampoo.jpg?v=1763705200&width=360",
                category: "Hair Styling",
                badge: "+3 Gifts",
                badgeColor: "green",
                netContent: "125ml",
                rating: 4.5,
                reviewCount: 89,
                price: "\u20B9550",
              },
              {
                href: "/products/spotlight-hair-serum",
                title: "Spotlight Hair Serum for Shine & Smoothness - 50 ml",
                subtitle: "Instant Shine | Frizz Control",
                alt: "Spotlight Hair Serum",
                mainImage:
                  "https://bblunt.com/cdn/shop/files/1_spotlight_serum.jpg?v=1763705200&width=360",
                category: "Hair Serum",
                netContent: "50ml",
                rating: 4.7,
                reviewCount: 210,
                price: "\u20B9499",
              },
              {
                href: "/products/intense-moisture-shampoo",
                title:
                  "Intense Moisture Shampoo with Jojoba & Vitamin E - 300 ml",
                subtitle: "Deep Hydration | Adds Shine",
                alt: "Intense Moisture Shampoo",
                mainImage:
                  "https://bblunt.com/cdn/shop/files/1_intense_moisture.jpg?v=1763705200&width=360",
                category: "Shampoo",
                netContent: "300ml",
                rating: 4.6,
                reviewCount: 145,
                price: "\u20B9399",
              },
            ],
          },
        },
      ],
    },

    // For Dull & Dry Hair — ProductCarousel #3
    {
      id: "for-dull-dry-hair-section",
      name: "For Dull & Dry Hair",
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
          id: "dawn-for-dull-dry-hair",
          name: "For Dull & Dry Hair",
          type: WIDGET_TYPES.ProductCarousel,
          settings: {
            variant: "v1",
            headingNormal: "For ",
            headingBold: "Dull & Dry Hair",
            collectionHandle: "dry-hair",
            viewAllCount: 14,
            products: [
              {
                href: "/products/intense-moisture-shampoo",
                title:
                  "Intense Moisture Shampoo with Jojoba & Vitamin E - 300 ml",
                subtitle: "Deep Hydration | Adds Shine | Softens Hair",
                alt: "Intense Moisture Shampoo",
                mainImage:
                  "https://bblunt.com/cdn/shop/files/1_intense_moisture.jpg?v=1763705200&width=360",
                category: "Shampoo",
                badge: "+3 Gifts",
                badgeColor: "green",
                netContent: "300ml",
                rating: 4.6,
                reviewCount: 145,
                price: "\u20B9399",
              },
              {
                href: "/products/intense-moisture-conditioner",
                title:
                  "Intense Moisture Conditioner for Dry & Frizzy Hair - 250 g",
                subtitle: "72-Hour Moisture Lock | Reduces Frizz",
                alt: "Intense Moisture Conditioner",
                mainImage:
                  "https://bblunt.com/cdn/shop/files/1_im_conditioner.jpg?v=1763705200&width=360",
                category: "Conditioner",
                badge: "+3 Gifts",
                badgeColor: "green",
                netContent: "250g",
                rating: 4.5,
                reviewCount: 198,
                price: "\u20B9399",
              },
              {
                href: "/products/intense-moisture-hair-mask",
                title:
                  "Intense Moisture Hair Mask for Deep Conditioning - 250 g",
                subtitle: "Restores Moisture | Adds Shine & Softness",
                alt: "Intense Moisture Hair Mask",
                mainImage:
                  "https://bblunt.com/cdn/shop/files/1_im_hair_mask.jpg?v=1763705200&width=360",
                category: "Hair Mask",
                netContent: "250g",
                rating: 4.7,
                reviewCount: 175,
                price: "\u20B9499",
              },
              {
                href: "/products/spotlight-hair-serum",
                title: "Spotlight Hair Serum for Shine & Smoothness - 50 ml",
                subtitle: "Instant Shine | Frizz Control",
                alt: "Spotlight Hair Serum",
                mainImage:
                  "https://bblunt.com/cdn/shop/files/1_spotlight_serum.jpg?v=1763705200&width=360",
                category: "Hair Serum",
                netContent: "50ml",
                rating: 4.7,
                reviewCount: 210,
                price: "\u20B9499",
              },
              {
                href: "/products/intense-moisture-combo",
                title: "Intense Moisture Shampoo & Conditioner Combo",
                subtitle: "Complete Hydration Routine | Softens & Nourishes",
                alt: "Intense Moisture Combo",
                mainImage:
                  "https://bblunt.com/cdn/shop/files/1_im_combo.jpg?v=1763705200&width=360",
                category: "Combos",
                rating: 4.6,
                reviewCount: 88,
                price: "\u20B9639",
                originalPrice: "\u20B9798",
                discountLabel: "20% off",
              },
            ],
          },
        },
      ],
    },

    // High Shine Creme Hair Colour — ProductCarousel #4
    {
      id: "high-shine-creme-hair-colour-section",
      name: "High Shine Creme Hair Colour",
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
          id: "dawn-high-shine-creme-hair-colour",
          name: "High Shine Creme Hair Colour",
          type: WIDGET_TYPES.ProductCarousel,
          settings: {
            variant: "v1",
            headingNormal: "High Shine ",
            headingBold: "Creme Hair Colour",
            collectionHandle: "high-shine-creme-hair-colour",
            viewAllCount: 15,
            products: [
              {
                href: "/products/salon-secret-high-shine-creme-hair-colour-natural-black",
                title:
                  "Salon Secret High Shine Creme Hair Colour - Natural Black 1.0",
                subtitle: "100% Grey Coverage | Enriched with Shine Tonic",
                alt: "High Shine Creme Hair Colour Natural Black",
                mainImage:
                  "https://bblunt.com/cdn/shop/files/1_hscc_black.jpg?v=1763705200&width=360",
                category: "Hair Colour",
                badge: "+3 Gifts",
                badgeColor: "green",
                rating: 4.6,
                reviewCount: 245,
                price: "\u20B9450",
              },
              {
                href: "/products/salon-secret-high-shine-creme-hair-colour-dark-brown",
                title:
                  "Salon Secret High Shine Creme Hair Colour - Dark Brown 3.0",
                subtitle: "100% Grey Coverage | Enriched with Shine Tonic",
                alt: "High Shine Creme Hair Colour Dark Brown",
                mainImage:
                  "https://bblunt.com/cdn/shop/files/1_hscc_dark_brown.jpg?v=1763705200&width=360",
                category: "Hair Colour",
                badge: "+3 Gifts",
                badgeColor: "green",
                rating: 4.5,
                reviewCount: 189,
                price: "\u20B9450",
              },
              {
                href: "/products/salon-secret-high-shine-creme-hair-colour-chocolate",
                title:
                  "Salon Secret High Shine Creme Hair Colour - Chocolate 4.06",
                subtitle: "100% Grey Coverage | Enriched with Shine Tonic",
                alt: "High Shine Creme Hair Colour Chocolate",
                mainImage:
                  "https://bblunt.com/cdn/shop/files/1_hscc_chocolate.jpg?v=1763705200&width=360",
                category: "Hair Colour",
                rating: 4.4,
                reviewCount: 156,
                price: "\u20B9450",
              },
              {
                href: "/products/salon-secret-high-shine-creme-hair-colour-mahogany",
                title:
                  "Salon Secret High Shine Creme Hair Colour - Mahogany Reddish Brown 4.56",
                subtitle: "100% Grey Coverage | Enriched with Shine Tonic",
                alt: "High Shine Creme Hair Colour Mahogany",
                mainImage:
                  "https://bblunt.com/cdn/shop/files/1_hscc_mahogany.jpg?v=1763705200&width=360",
                category: "Hair Colour",
                rating: 4.3,
                reviewCount: 134,
                price: "\u20B9450",
              },
              {
                href: "/products/salon-secret-high-shine-creme-hair-colour-honey-light-golden",
                title:
                  "Salon Secret High Shine Creme Hair Colour - Honey Light Golden Brown 5.32",
                subtitle: "100% Grey Coverage | Enriched with Shine Tonic",
                alt: "High Shine Creme Hair Colour Honey",
                mainImage:
                  "https://bblunt.com/cdn/shop/files/1_hscc_honey.jpg?v=1763705200&width=360",
                category: "Hair Colour",
                rating: 4.5,
                reviewCount: 112,
                price: "\u20B9450",
              },
            ],
          },
        },
      ],
    },

    // For Damage Repair — ProductCarousel #5
    {
      id: "for-damage-repair-section",
      name: "For Damage Repair",
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
          id: "dawn-for-damage-repair",
          name: "For Damage Repair",
          type: WIDGET_TYPES.ProductCarousel,
          settings: {
            variant: "v1",
            headingNormal: "For ",
            headingBold: "Damage Repair",
            collectionHandle: "damaged-hair",
            viewAllCount: 11,
            products: [
              {
                href: "/products/7-in-1-repair-revive-hair-mask",
                title:
                  "7 in 1 Repair & Revive Hair Mask for Upto 100% Damage Repair - 250 g",
                subtitle:
                  "Addresses 7 Signs of Hair Damage | Enriched with Ceramides & Argan Oil",
                alt: "7 in 1 Repair & Revive Hair Mask",
                mainImage:
                  "https://bblunt.com/cdn/shop/files/1_f5e4d3c2-b1a0-9f8e-7d6c-5b4a3f2e1d0c.jpg?v=1763705200&width=360",
                category: "Hair Mask",
                badge: "+3 Gifts",
                badgeColor: "green",
                netContent: "250g",
                rating: 4.7,
                reviewCount: 314,
                price: "\u20B9499",
              },
              {
                href: "/products/repair-revive-shampoo",
                title: "Repair & Revive Shampoo for Damaged Hair - 300 ml",
                subtitle: "Reduces Breakage | Strengthens Hair Fibre",
                alt: "Repair & Revive Shampoo",
                mainImage:
                  "https://bblunt.com/cdn/shop/files/1_rr_shampoo.jpg?v=1763705200&width=360",
                category: "Shampoo",
                badge: "+3 Gifts",
                badgeColor: "green",
                netContent: "300ml",
                rating: 4.5,
                reviewCount: 178,
                price: "\u20B9399",
              },
              {
                href: "/products/repair-revive-conditioner",
                title: "Repair & Revive Conditioner for Damaged Hair - 250 g",
                subtitle: "Restores Damage | Adds Softness",
                alt: "Repair & Revive Conditioner",
                mainImage:
                  "https://bblunt.com/cdn/shop/files/1_rr_conditioner.jpg?v=1763705200&width=360",
                category: "Conditioner",
                netContent: "250g",
                rating: 4.6,
                reviewCount: 142,
                price: "\u20B9399",
              },
              {
                href: "/products/repair-revive-leave-in-cream",
                title: "Repair & Revive Leave-In Cream - 150 g",
                subtitle: "Protects from Heat | Smooths Frizz",
                alt: "Repair & Revive Leave-In Cream",
                mainImage:
                  "https://bblunt.com/cdn/shop/files/1_rr_leave_in.jpg?v=1763705200&width=360",
                category: "Hair Cream",
                netContent: "150g",
                rating: 4.4,
                reviewCount: 95,
                price: "\u20B9449",
              },
              {
                href: "/products/repair-revive-combo",
                title: "Repair & Revive Shampoo & Conditioner Combo",
                subtitle: "Complete Damage Repair Routine",
                alt: "Repair & Revive Combo",
                mainImage:
                  "https://bblunt.com/cdn/shop/files/1_rr_combo.jpg?v=1763705200&width=360",
                category: "Combos",
                rating: 4.5,
                reviewCount: 67,
                price: "\u20B9639",
                originalPrice: "\u20B9798",
                discountLabel: "20% off",
              },
            ],
          },
        },
      ],
    },

    // For Advanced Smoothening — ProductCarousel #6
    {
      id: "for-advanced-smoothening-section",
      name: "For Advanced Smoothening",
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
          id: "dawn-for-advanced-smoothening",
          name: "For Advanced Smoothening",
          type: WIDGET_TYPES.ProductCarousel,
          settings: {
            variant: "v1",
            headingNormal: "For ",
            headingBold: "Advanced Smoothening",
            collectionHandle: "advanced-smoothening",
            viewAllCount: 9,
            products: [
              {
                href: "/products/advanced-smoothening-shampoo",
                title:
                  "Advanced Smoothening Shampoo with Keratin & Argan Oil - 300 ml",
                subtitle: "Up to 95% Frizz Reduction | Salon-like Smoothness",
                alt: "Advanced Smoothening Shampoo",
                mainImage:
                  "https://bblunt.com/cdn/shop/files/1_as_shampoo.jpg?v=1763705200&width=360",
                category: "Shampoo",
                badge: "+3 Gifts",
                badgeColor: "green",
                netContent: "300ml",
                rating: 4.7,
                reviewCount: 223,
                price: "\u20B9399",
              },
              {
                href: "/products/advanced-smoothening-conditioner",
                title:
                  "Advanced Smoothening Conditioner for Frizzy Hair - 250 g",
                subtitle: "Tames Frizz | Adds Shine & Smoothness",
                alt: "Advanced Smoothening Conditioner",
                mainImage:
                  "https://bblunt.com/cdn/shop/files/1_as_conditioner.jpg?v=1763705200&width=360",
                category: "Conditioner",
                badge: "+3 Gifts",
                badgeColor: "green",
                netContent: "250g",
                rating: 4.6,
                reviewCount: 187,
                price: "\u20B9399",
              },
              {
                href: "/products/advanced-smoothening-hair-mask",
                title: "Advanced Smoothening Hair Mask - 250 g",
                subtitle: "Deep Conditioning | Long-lasting Smoothness",
                alt: "Advanced Smoothening Hair Mask",
                mainImage:
                  "https://bblunt.com/cdn/shop/files/1_as_mask.jpg?v=1763705200&width=360",
                category: "Hair Mask",
                netContent: "250g",
                rating: 4.5,
                reviewCount: 145,
                price: "\u20B9499",
              },
              {
                href: "/products/advanced-smoothening-serum",
                title: "Advanced Smoothening Hair Serum - 100 ml",
                subtitle: "Anti-Frizz | Heat Protection",
                alt: "Advanced Smoothening Serum",
                mainImage:
                  "https://bblunt.com/cdn/shop/files/1_as_serum.jpg?v=1763705200&width=360",
                category: "Hair Serum",
                netContent: "100ml",
                rating: 4.6,
                reviewCount: 167,
                price: "\u20B9499",
              },
              {
                href: "/products/advanced-smoothening-combo",
                title: "Advanced Smoothening Shampoo & Conditioner Combo",
                subtitle: "Complete Frizz Control Routine",
                alt: "Advanced Smoothening Combo",
                mainImage:
                  "https://bblunt.com/cdn/shop/files/1_as_combo.jpg?v=1763705200&width=360",
                category: "Combos",
                rating: 4.7,
                reviewCount: 98,
                price: "\u20B9639",
                originalPrice: "\u20B9798",
                discountLabel: "20% off",
              },
            ],
          },
        },
      ],
    },

    // For Extraordinary Shiny Hair — ProductCarousel #7
    {
      id: "for-extraordinary-shiny-hair-section",
      name: "For Extraordinary Shiny Hair",
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
          id: "dawn-for-extraordinary-shiny-hair",
          name: "For Extraordinary Shiny Hair",
          type: WIDGET_TYPES.ProductCarousel,
          settings: {
            variant: "v1",
            headingNormal: "For ",
            headingBold: "Extraordinary Shiny Hair",
            collectionHandle: "extraordinary-shine",
            viewAllCount: 8,
            products: [
              {
                href: "/products/extraordinary-shine-shampoo",
                title: "Extraordinary Shine Shampoo for Dull Hair - 300 ml",
                subtitle: "Mirror-like Shine | Lightweight Formula",
                alt: "Extraordinary Shine Shampoo",
                mainImage:
                  "https://bblunt.com/cdn/shop/files/1_es_shampoo.jpg?v=1763705200&width=360",
                category: "Shampoo",
                badge: "+3 Gifts",
                badgeColor: "green",
                netContent: "300ml",
                rating: 4.6,
                reviewCount: 134,
                price: "\u20B9399",
              },
              {
                href: "/products/extraordinary-shine-conditioner",
                title: "Extraordinary Shine Conditioner - 250 g",
                subtitle: "Boosts Shine | Softens & Detangles",
                alt: "Extraordinary Shine Conditioner",
                mainImage:
                  "https://bblunt.com/cdn/shop/files/1_es_conditioner.jpg?v=1763705200&width=360",
                category: "Conditioner",
                badge: "+3 Gifts",
                badgeColor: "green",
                netContent: "250g",
                rating: 4.5,
                reviewCount: 112,
                price: "\u20B9399",
              },
              {
                href: "/products/spotlight-hair-serum",
                title: "Spotlight Hair Serum for Shine & Smoothness - 50 ml",
                subtitle: "Instant Shine | Frizz Control",
                alt: "Spotlight Hair Serum",
                mainImage:
                  "https://bblunt.com/cdn/shop/files/1_spotlight_serum.jpg?v=1763705200&width=360",
                category: "Hair Serum",
                netContent: "50ml",
                rating: 4.7,
                reviewCount: 210,
                price: "\u20B9499",
              },
              {
                href: "/products/extraordinary-shine-hair-mask",
                title: "Extraordinary Shine Hair Mask - 250 g",
                subtitle: "Deep Shine Treatment | Restores Lustre",
                alt: "Extraordinary Shine Hair Mask",
                mainImage:
                  "https://bblunt.com/cdn/shop/files/1_es_mask.jpg?v=1763705200&width=360",
                category: "Hair Mask",
                netContent: "250g",
                rating: 4.4,
                reviewCount: 89,
                price: "\u20B9499",
              },
              {
                href: "/products/extraordinary-shine-combo",
                title: "Extraordinary Shine Shampoo & Conditioner Combo",
                subtitle: "Complete Shine Routine",
                alt: "Extraordinary Shine Combo",
                mainImage:
                  "https://bblunt.com/cdn/shop/files/1_es_combo.jpg?v=1763705200&width=360",
                category: "Combos",
                rating: 4.6,
                reviewCount: 72,
                price: "\u20B9639",
                originalPrice: "\u20B9798",
                discountLabel: "20% off",
              },
            ],
          },
        },
      ],
    },

    // For Bond Repair — ProductCarousel #8
    {
      id: "for-bond-repair-section",
      name: "For Bond Repair",
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
          id: "dawn-for-bond-repair",
          name: "For Bond Repair",
          type: WIDGET_TYPES.ProductCarousel,
          settings: {
            variant: "v1",
            headingNormal: "For ",
            headingBold: "Bond Repair",
            collectionHandle: "bond-repair",
            viewAllCount: 7,
            products: [
              {
                href: "/products/bond-repair-shampoo",
                title: "Bond Repair Shampoo with Hyaluronic Acid - 300 ml",
                subtitle: "Rebuilds Broken Bonds | Strengthens from Within",
                alt: "Bond Repair Shampoo",
                mainImage:
                  "https://bblunt.com/cdn/shop/files/1_br_shampoo.jpg?v=1763705200&width=360",
                category: "Shampoo",
                badge: "+3 Gifts",
                badgeColor: "green",
                netContent: "300ml",
                rating: 4.7,
                reviewCount: 156,
                price: "\u20B9449",
              },
              {
                href: "/products/bond-repair-conditioner",
                title: "Bond Repair Conditioner - 250 g",
                subtitle: "Repairs Chemical Damage | Restores Elasticity",
                alt: "Bond Repair Conditioner",
                mainImage:
                  "https://bblunt.com/cdn/shop/files/1_br_conditioner.jpg?v=1763705200&width=360",
                category: "Conditioner",
                badge: "+3 Gifts",
                badgeColor: "green",
                netContent: "250g",
                rating: 4.6,
                reviewCount: 134,
                price: "\u20B9449",
              },
              {
                href: "/products/bond-repair-hair-mask",
                title:
                  "Bond Repair Hair Mask for Chemically Treated Hair - 250 g",
                subtitle: "Intensive Bond Reconstruction",
                alt: "Bond Repair Hair Mask",
                mainImage:
                  "https://bblunt.com/cdn/shop/files/1_br_mask.jpg?v=1763705200&width=360",
                category: "Hair Mask",
                netContent: "250g",
                rating: 4.5,
                reviewCount: 98,
                price: "\u20B9549",
              },
              {
                href: "/products/bond-repair-leave-in-treatment",
                title: "Bond Repair Leave-In Treatment - 150 ml",
                subtitle: "Instant Bond Repair | No Rinse",
                alt: "Bond Repair Leave-In Treatment",
                mainImage:
                  "https://bblunt.com/cdn/shop/files/1_br_leave_in.jpg?v=1763705200&width=360",
                category: "Hair Treatment",
                netContent: "150ml",
                rating: 4.4,
                reviewCount: 67,
                price: "\u20B9499",
              },
              {
                href: "/products/bond-repair-combo",
                title: "Bond Repair Shampoo & Conditioner Combo",
                subtitle: "Complete Bond Repair Routine",
                alt: "Bond Repair Combo",
                mainImage:
                  "https://bblunt.com/cdn/shop/files/1_br_combo.jpg?v=1763705200&width=360",
                category: "Combos",
                rating: 4.6,
                reviewCount: 54,
                price: "\u20B9719",
                originalPrice: "\u20B9898",
                discountLabel: "20% off",
              },
            ],
          },
        },
      ],
    },

    // For Nourished & Defined Curls — ProductCarousel #9
    {
      id: "for-nourished-defined-curls-section",
      name: "For Nourished & Defined Curls",
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
          id: "dawn-for-nourished-defined-curls",
          name: "For Nourished & Defined Curls",
          type: WIDGET_TYPES.ProductCarousel,
          settings: {
            variant: "v1",
            headingNormal: "For ",
            headingBold: "Nourished & Defined Curls",
            collectionHandle: "curly-hair",
            viewAllCount: 8,
            products: [
              {
                href: "/products/curl-defining-shampoo",
                title: "Curl Defining Shampoo for Wavy & Curly Hair - 300 ml",
                subtitle: "Defines Curls | Reduces Frizz | Sulphate-Free",
                alt: "Curl Defining Shampoo",
                mainImage:
                  "https://bblunt.com/cdn/shop/files/1_cd_shampoo.jpg?v=1763705200&width=360",
                category: "Shampoo",
                badge: "+3 Gifts",
                badgeColor: "green",
                netContent: "300ml",
                rating: 4.5,
                reviewCount: 112,
                price: "\u20B9399",
              },
              {
                href: "/products/curl-defining-conditioner",
                title: "Curl Defining Conditioner - 250 g",
                subtitle: "Moisturizes | Enhances Curl Pattern",
                alt: "Curl Defining Conditioner",
                mainImage:
                  "https://bblunt.com/cdn/shop/files/1_cd_conditioner.jpg?v=1763705200&width=360",
                category: "Conditioner",
                badge: "+3 Gifts",
                badgeColor: "green",
                netContent: "250g",
                rating: 4.4,
                reviewCount: 98,
                price: "\u20B9399",
              },
              {
                href: "/products/curl-defining-cream",
                title: "Curl Defining Cream for Bounce & Hold - 150 g",
                subtitle: "Defines Without Crunch | Long-lasting Hold",
                alt: "Curl Defining Cream",
                mainImage:
                  "https://bblunt.com/cdn/shop/files/1_cd_cream.jpg?v=1763705200&width=360",
                category: "Hair Styling",
                netContent: "150g",
                rating: 4.6,
                reviewCount: 87,
                price: "\u20B9449",
              },
              {
                href: "/products/curl-defining-hair-mask",
                title: "Curl Defining Hair Mask - 250 g",
                subtitle: "Deep Nourishment for Curls | Adds Bounce",
                alt: "Curl Defining Hair Mask",
                mainImage:
                  "https://bblunt.com/cdn/shop/files/1_cd_mask.jpg?v=1763705200&width=360",
                category: "Hair Mask",
                netContent: "250g",
                rating: 4.3,
                reviewCount: 56,
                price: "\u20B9499",
              },
              {
                href: "/products/curl-defining-combo",
                title: "Curl Defining Shampoo & Conditioner Combo",
                subtitle: "Complete Curl Care Routine",
                alt: "Curl Defining Combo",
                mainImage:
                  "https://bblunt.com/cdn/shop/files/1_cd_combo.jpg?v=1763705200&width=360",
                category: "Combos",
                rating: 4.5,
                reviewCount: 45,
                price: "\u20B9639",
                originalPrice: "\u20B9798",
                discountLabel: "20% off",
              },
            ],
          },
        },
      ],
    },

    // For Dandruff Control — ProductCarousel #10
    {
      id: "for-dandruff-control-section",
      name: "For Dandruff Control",
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
          id: "dawn-for-dandruff-control",
          name: "For Dandruff Control",
          type: WIDGET_TYPES.ProductCarousel,
          settings: {
            variant: "v1",
            headingNormal: "For ",
            headingBold: "Dandruff Control",
            collectionHandle: "anti-dandruff",
            viewAllCount: 7,
            products: [
              {
                href: "/products/anti-dandruff-shampoo",
                title: "Anti-Dandruff Shampoo with Zinc Pyrithione - 300 ml",
                subtitle: "Fights Dandruff | Soothes Itchy Scalp",
                alt: "Anti-Dandruff Shampoo",
                mainImage:
                  "https://bblunt.com/cdn/shop/files/1_ad_shampoo.jpg?v=1763705200&width=360",
                category: "Shampoo",
                badge: "+3 Gifts",
                badgeColor: "green",
                netContent: "300ml",
                rating: 4.5,
                reviewCount: 198,
                price: "\u20B9399",
              },
              {
                href: "/products/anti-dandruff-conditioner",
                title: "Anti-Dandruff Conditioner - 250 g",
                subtitle: "Controls Flakes | Moisturizes Scalp",
                alt: "Anti-Dandruff Conditioner",
                mainImage:
                  "https://bblunt.com/cdn/shop/files/1_ad_conditioner.jpg?v=1763705200&width=360",
                category: "Conditioner",
                badge: "+3 Gifts",
                badgeColor: "green",
                netContent: "250g",
                rating: 4.4,
                reviewCount: 145,
                price: "\u20B9399",
              },
              {
                href: "/products/anti-dandruff-scalp-tonic",
                title: "Anti-Dandruff Scalp Tonic - 50 ml",
                subtitle: "Targets Root Cause | Prevents Recurrence",
                alt: "Anti-Dandruff Scalp Tonic",
                mainImage:
                  "https://bblunt.com/cdn/shop/files/1_ad_tonic.jpg?v=1763705200&width=360",
                category: "Hair Tonics",
                netContent: "50ml",
                rating: 4.3,
                reviewCount: 87,
                price: "\u20B9499",
              },
              {
                href: "/products/anti-dandruff-hair-mask",
                title: "Anti-Dandruff Hair Mask - 250 g",
                subtitle: "Deep Scalp Treatment | Reduces Itching",
                alt: "Anti-Dandruff Hair Mask",
                mainImage:
                  "https://bblunt.com/cdn/shop/files/1_ad_mask.jpg?v=1763705200&width=360",
                category: "Hair Mask",
                netContent: "250g",
                rating: 4.2,
                reviewCount: 65,
                price: "\u20B9499",
              },
              {
                href: "/products/anti-dandruff-combo",
                title: "Anti-Dandruff Shampoo & Conditioner Combo",
                subtitle: "Complete Dandruff Defence Routine",
                alt: "Anti-Dandruff Combo",
                mainImage:
                  "https://bblunt.com/cdn/shop/files/1_ad_combo.jpg?v=1763705200&width=360",
                category: "Combos",
                rating: 4.4,
                reviewCount: 52,
                price: "\u20B9639",
                originalPrice: "\u20B9798",
                discountLabel: "20% off",
              },
            ],
          },
        },
      ],
    },

    // 5 Minute Shampoo Hair Colour — ProductCarousel #11
    {
      id: "five-minute-shampoo-hair-colour-section",
      name: "5 Minute Shampoo Hair Colour",
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
          id: "dawn-five-minute-shampoo-hair-colour",
          name: "5 Minute Shampoo Hair Colour",
          type: WIDGET_TYPES.ProductCarousel,
          settings: {
            variant: "v1",
            headingNormal: "5 Minute ",
            headingBold: "Shampoo Hair Colour",
            collectionHandle: "5-minute-shampoo-hair-colour",
            viewAllCount: 10,
            products: [
              {
                href: "/products/5-minute-shampoo-hair-colour-natural-black",
                title: "5 Minute Shampoo Hair Colour - Natural Black 1.0",
                subtitle: "Quick & Easy | No Ammonia | 100% Grey Coverage",
                alt: "5 Minute Shampoo Hair Colour Natural Black",
                mainImage:
                  "https://bblunt.com/cdn/shop/files/1_5min_black.jpg?v=1763705200&width=360",
                category: "Hair Colour",
                badge: "+3 Gifts",
                badgeColor: "green",
                rating: 4.5,
                reviewCount: 234,
                price: "\u20B9199",
              },
              {
                href: "/products/5-minute-shampoo-hair-colour-dark-brown",
                title: "5 Minute Shampoo Hair Colour - Dark Brown 3.0",
                subtitle: "Quick & Easy | No Ammonia | 100% Grey Coverage",
                alt: "5 Minute Shampoo Hair Colour Dark Brown",
                mainImage:
                  "https://bblunt.com/cdn/shop/files/1_5min_dark_brown.jpg?v=1763705200&width=360",
                category: "Hair Colour",
                badge: "+3 Gifts",
                badgeColor: "green",
                rating: 4.4,
                reviewCount: 198,
                price: "\u20B9199",
              },
              {
                href: "/products/5-minute-shampoo-hair-colour-burgundy",
                title: "5 Minute Shampoo Hair Colour - Burgundy 3.16",
                subtitle: "Quick & Easy | No Ammonia | 100% Grey Coverage",
                alt: "5 Minute Shampoo Hair Colour Burgundy",
                mainImage:
                  "https://bblunt.com/cdn/shop/files/1_5min_burgundy.jpg?v=1763705200&width=360",
                category: "Hair Colour",
                rating: 4.3,
                reviewCount: 156,
                price: "\u20B9199",
              },
              {
                href: "/products/5-minute-shampoo-hair-colour-coffee",
                title:
                  "5 Minute Shampoo Hair Colour - Coffee Natural Brown 4.31",
                subtitle: "Quick & Easy | No Ammonia | 100% Grey Coverage",
                alt: "5 Minute Shampoo Hair Colour Coffee",
                mainImage:
                  "https://bblunt.com/cdn/shop/files/1_5min_coffee.jpg?v=1763705200&width=360",
                category: "Hair Colour",
                rating: 4.4,
                reviewCount: 134,
                price: "\u20B9199",
              },
              {
                href: "/products/5-minute-shampoo-hair-colour-mahogany",
                title: "5 Minute Shampoo Hair Colour - Mahogany 4.56",
                subtitle: "Quick & Easy | No Ammonia | 100% Grey Coverage",
                alt: "5 Minute Shampoo Hair Colour Mahogany",
                mainImage:
                  "https://bblunt.com/cdn/shop/files/1_5min_mahogany.jpg?v=1763705200&width=360",
                category: "Hair Colour",
                rating: 4.2,
                reviewCount: 112,
                price: "\u20B9199",
              },
            ],
          },
        },
      ],
    },

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
