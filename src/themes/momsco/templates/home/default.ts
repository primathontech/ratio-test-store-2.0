import type { PageConfig } from "@shopkit/builder";
import { WIDGET_TYPES } from "@/widgets/.generated/types";
import {
  SECTION_TYPES,
  SECTION_LAYOUT_OPTIONS,
  DATA_SOURCE_TYPES,
} from "@shopkit/builder";

/**
 * Home Page Template for dawn
 */
export const template: PageConfig = {
  id: "dawn-home",
  dataSources: {
    featuredProducts: {
      type: DATA_SOURCE_TYPES.COLLECTION_BY_HANDLES,
      params: { handles: ["bestsellers"], productLimit: 8 },
      required: false,
    },
    collectionDataAll: {
      type: DATA_SOURCE_TYPES.COLLECTIONS,
      params: { first: 50 },
      required: false,
    },
  },
  sections: [
    // Announcement Bar Section
    {
      id: "announcement-bar-section",
      name: "AnnouncementBar",
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
          id: "nintarababy-announcement-bar",
          name: "AnnouncementBar",
          type: WIDGET_TYPES.AnnouncementBar,
          settings: {
            variant: "v1",
            autoPlayInterval: 4500,
            pauseOnHover: true,
            transitionDuration: 600,
            messages: "t:common.announcement_bar.messages",
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
          id: "nintarababy-header",
          name: "Header",
          type: WIDGET_TYPES.Header,
          dataSourceKey: "collectionDataAll",
          settings: {
            variant: "v1",
            logoPath: "t:common.header.logoPath",
            isSticky: true,
            hideOnScrollDown: true,
            searchPlaceholder: "t:common.header.searchPlaceholder",
            whatsappHref: "t:common.header.whatsappHref",
            cartHref: "t:common.header.cartHref",
            navLinks: "t:common.header.navLinks",
            dropdownItems: "t:common.header.dropdownItems",
          },
        },
      ],
    },

    // Hero Slideshow Section
    {
      id: "hero-slideshow-section",
      name: "HeroSlideshow",
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
          id: "nintarababy-hero-slideshow",
          name: "HeroSlideshow",
          type: WIDGET_TYPES.HeroSlideshow,
          settings: {
            variant: "v1",
            slides: [
              {
                desktopImage: "/assets/momsco/images/home/Baby-Care.webp",
                mobileImage: "/assets/momsco/images/home/Baby-Care-mobile.webp",
                href: "/collections/baby-care",
                alt: "Baby bedding sets collection",
              },
              {
                desktopImage: "/assets/momsco/images/home/Mom-Care.webp",
                mobileImage: "/assets/momsco/images/home/Mom-Care-mobile.webp",
                href: "/collections/mom-care",
                alt: "Mom care collection",
              },
              {
                desktopImage: "/assets/momsco/images/home/Essentials.webp",
                mobileImage:
                  "/assets/momsco/images/home/Essentials-mobile.webp",
                href: "/collections/essentials",
                alt: "Baby gift set boxes collection",
              },
            ],
            autoplayMs: 7000,
            mobileBreakpoint: 550,
          },
        },
      ],
    },

    // Welcome / About Section
    {
      id: "welcome-section",
      name: "Welcome",
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
          id: "nintarababy-welcome",
          name: "Welcome",
          type: WIDGET_TYPES.Welcome,
          settings: {
            variant: "v1",
            imageOnly: true,
            bgDesktopPath: "/assets/momsco/images/home/Welcome-Banner.webp",
            bgMobilePath:
              "/assets/momsco/images/home/Welcome-Banner-Mobile.webp",

            // headingPrefix: "Welcome to",
            // bodyText:
            //   "Parenthood is a beautiful journey, filled with moments that deserve comfort and joy. Guided by parents, we craft thoughtful baby essentials, designed to be luxuriously soft, safe, and made to last for your little one.",
            // logoPath: "/assets/nintarababy/welcome/nintara-logo.webp",
            // badges: [
            //   {
            //     label: "GOTS Certified",
            //     iconSrc: "/assets/nintarababy/welcome/icon-gots-certified.webp",
            //     alt: "GOTS Certified",
            //   },
            //   {
            //     label: "EU & US Certified Safe",
            //     iconSrc:
            //       "/assets/nintarababy/welcome/icon-eu-us-certified.webp",
            //     alt: "EU & US Certified Safe",
            //   },
            //   {
            //     label: "Created For Comfort",
            //     iconSrc:
            //       "/assets/nintarababy/welcome/icon-created-for-comfort.webp",
            //     alt: "Created For Comfort",
            //   },
            //   {
            //     label: "Organic Cotton",
            //     iconSrc: "/assets/nintarababy/welcome/icon-organic-cotton.webp",
            //     alt: "Organic Cotton",
            //   },
            // ],
          },
        },
      ],
    },

    // Shop by Category Section
    {
      id: "shop-by-category-section",
      name: "ShopByCategory",
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
          id: "nintarababy-shop-by-category",
          name: "ShopByCategory",
          type: WIDGET_TYPES.ShopByCategory,
          settings: {
            variant: "v1",
            heading: "Shop by Category",
            subtitle: "Find your perfect baby must-haves.",
            categories: [
              {
                label: "Baby Care",
                href: "/collections/baby-care",
                image: "/assets/momsco/images/home/Baby-Care-Category.webp",
                hasNewBadge: "false",
              },
              {
                label: "Mom Care",
                href: "/collections/mom-care",
                image: "/assets/momsco/images/home/Mom-Care-Category.webp",
                hasNewBadge: "false",
              },
              {
                label: "Essentials",
                href: "/collections/essentials",
                image: "/assets/momsco/images/home/Essentials-Category.webp",
                hasNewBadge: "false",
              },
            ],
          },
        },
      ],
    },

    // Featured Products Section
    {
      id: "featured-products-section",
      name: "FeaturedProducts",
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
          id: "nintarababy-featured-products",
          name: "FeaturedProducts",
          type: WIDGET_TYPES.FeaturedProducts,
          dataSourceKey: "featuredProducts",
          settings: {
            variant: "v1",
            heading: "Featured Products",
            subtitle: "Our top picks, trusted by parents.",
            viewAllText: "View all",
            viewAllLink: "/collections/shop-all",
            collectionHandle: "bestsellers",
            productLimit: 8,
          },
        },
      ],
    },

    // Testimonials Section
    // {
    //   id: "testimonials-section",
    //   name: "Testimonials",
    //   type: SECTION_TYPES.CONTENT_SECTION,
    //   settings: {
    //     layout: SECTION_LAYOUT_OPTIONS.FULL,
    //     responsive: {
    //       mobile: { padding: { top: 0, right: 0, bottom: 0, left: 0 } },
    //       tablet: { padding: { top: 0, right: 0, bottom: 0, left: 0 } },
    //       desktop: { padding: { top: 0, right: 0, bottom: 0, left: 0 } },
    //     },
    //   },
    //   widgets: [
    //     {
    //       id: "nintarababy-testimonials",
    //       name: "Testimonials",
    //       type: WIDGET_TYPES.Testimonials,
    //       settings: {
    //         variant: "v1",
    //         heading: "Testimonials",
    //         subtitle: "Hear it from our Nintara parents",
    //         testimonials: [
    //           {
    //             reviewText:
    //               "Very cute and they don't slip off with the constant kicks of my baby",
    //             reviewerName: "- Shivani",
    //             cardImageSrc:
    //               "/assets/nintarababy/testimonials/images/testi-bg-booties.webp",
    //             productName: "Soft Cotton Baby Booties | Warm White",
    //             productHref: "/products/soft-cotton-baby-booties-warm-white",
    //             productThumbnailSrc:
    //               "/assets/nintarababy/testimonials/images/products/booties-warm-white-110.webp",
    //           },
    //           {
    //             reviewText:
    //               "The quality is really good and my baby is comfortable while sleeping",
    //             reviewerName: "- Nivi Gova",
    //             cardImageSrc:
    //               "/assets/nintarababy/testimonials/images/testi-bg-butter-blossoms.webp",
    //             productName: "Wake Me Not Swaddle\u2122 | Butter Blossoms",
    //             productHref: "/products/wake-me-not-swaddle-butter-blossoms",
    //             productThumbnailSrc:
    //               "/assets/nintarababy/testimonials/images/products/butter-blossoms-110.webp",
    //           },
    //           {
    //             reviewText: "Amazing muslin towel",
    //             reviewerName: "- Prarthana",
    //             cardImageSrc:
    //               "/assets/nintarababy/testimonials/images/testi-bg-muslin-hooded-towel.webp",
    //             productName: "Muslin Baby Hooded Towel | Butterscotch Stars",
    //             productHref:
    //               "/products/organic-cotton-butterscotch-stars-baby-hooded-towel",
    //             productThumbnailSrc:
    //               "/assets/nintarababy/testimonials/images/products/butterscotch-stars-110.webp",
    //           },
    //           {
    //             reviewText:
    //               "Perfect for my toddler's sensitive skin. It absorbs water so quickly, dries fast, and stays fresh even after daily use.",
    //             reviewerName: "- Jayani",
    //             cardImageSrc:
    //               "/assets/nintarababy/testimonials/images/testi-bg-hooded-towel-2.webp",
    //             productName: "Bamboo Baby Hooded Towel | Giraffe",
    //             productHref: "/products/baby-bamboo-hooded-towel-giraffe",
    //             productThumbnailSrc:
    //               "/assets/nintarababy/testimonials/images/products/giraffe-towel-110.webp",
    //           },
    //           {
    //             reviewText:
    //               "These sleep sacks are a lifesaver! The inverted zipper makes nighttime diaper changes so easy, and I love knowing my baby is safe and cozy.",
    //             reviewerName: "- Divya",
    //             cardImageSrc:
    //               "/assets/nintarababy/testimonials/images/testi-bg-sleep-sack.webp",
    //             productName: "Baby Sleep Sack 0.5 TOG - Citrus Stripes",
    //             productHref:
    //               "/products/organic-cotton-citrus-stripes-baby-sleep-sack-0-5-tog",
    //             productThumbnailSrc:
    //               "/assets/nintarababy/testimonials/images/products/citrus-stripes-sleep-sack-110.webp",
    //           },
    //           {
    //             reviewText:
    //               "So soft and absorbent, absolutely love these for feeding time!",
    //             reviewerName: "- Manisha",
    //             cardImageSrc:
    //               "/assets/nintarababy/testimonials/images/testi-bg-burp-cloth.webp",
    //             productName:
    //               "Baby Burp Cloths - Set of 6 | Playful Mix Mega Pack",
    //             productHref: "/products/baby-burp-cloths-set-of-6-mega-pack",
    //             productThumbnailSrc:
    //               "/assets/nintarababy/testimonials/images/products/burp-cloths-110.webp",
    //           },
    //           {
    //             reviewText:
    //               "I finally feed without slouching. The lumbar support keeps my back happy even during long, sleepy sessions. I didn't realise how much I needed this until I used it.",
    //             reviewerName: "- Ambuja K",
    //             cardImageSrc:
    //               "/assets/nintarababy/testimonials/images/testi-bg-feeding-pillow.webp",
    //             productName: "Ergopod\u2122 Baby Feeding Pillow | Purple Skies",
    //             productHref: "/products/ergopod-feeding-pillow-purple-skies",
    //             productThumbnailSrc:
    //               "/assets/nintarababy/testimonials/images/products/feeding-pillow-purple-110.webp",
    //           },
    //           {
    //             reviewText:
    //               "These washcloths are soft on my baby's skin. They soak up dribbles quickly, and dry fast. I keep one in my bag and by the changing mat.",
    //             reviewerName: "- Swati P",
    //             cardImageSrc:
    //               "/assets/nintarababy/testimonials/images/testi-bg-muslin-washcloth.webp",
    //             productName:
    //               "Muslin So-Softs\u2122 | Multipurpose Baby Washcloth - Set of 3 | Butterscotch",
    //             productHref:
    //               "/products/so-softs-muslin-washcloths-butterscotch-set-of-3",
    //             productThumbnailSrc:
    //               "/assets/nintarababy/testimonials/images/products/muslin-washcloth-butterscotch-110.webp",
    //           },
    //           {
    //             reviewText:
    //               "These cloths are amazing! My daughter has extremely sensitive skin, and these ones don't cause any irritation.",
    //             reviewerName: "- Maya S",
    //             cardImageSrc:
    //               "/assets/nintarababy/testimonials/images/testi-bg-bamboo-washcloth.jpg",
    //             productName:
    //               "Bamboo So-Softs\u2122 | Multipurpose Baby Washcloth - Set of 3 | White",
    //             productHref:
    //               "/products/so-softs-bamboo-washcloths-white-pack-set-of-3",
    //             productThumbnailSrc:
    //               "/assets/nintarababy/testimonials/images/products/bamboo-washcloth-white-110.webp",
    //           },
    //           {
    //             reviewText:
    //               "The swaddles are super soft, and the size is perfect. We love the variety of prints in the pack!",
    //             reviewerName: "- Riddhi",
    //             cardImageSrc:
    //               "/assets/nintarababy/testimonials/images/testi-bg-swaddle.webp",
    //             productName: "Muslin Baby Swaddle - Large | Happy Waves",
    //             productHref:
    //               "/products/organic-cotton-happy-waves-swaddle-wrap-39x39",
    //             productThumbnailSrc:
    //               "/assets/nintarababy/testimonials/images/products/swaddle-happy-waves-110.webp",
    //           },
    //           {
    //             reviewText:
    //               "I've tried so many bibs, but these are by far the best! They're soft and the waterproof layer actually works!",
    //             reviewerName: "- Akshaya",
    //             cardImageSrc:
    //               "/assets/nintarababy/testimonials/images/testi-bg-bibs.webp",
    //             productName: "Baby Bandana Bibs - Set of 6 | Mega Pack",
    //             productHref:
    //               "/products/organic-cotton-mega-pack-baby-bandana-bibs-set-of-6",
    //             productThumbnailSrc:
    //               "/assets/nintarababy/testimonials/images/products/bibs-mega-pack-110.webp",
    //           },
    //         ],
    //       },
    //     },
    //   ],
    // },

    // Blog / "We're Here For You" Section
    // {
    //   id: "blog-section",
    //   name: "Blog",
    //   type: SECTION_TYPES.CONTENT_SECTION,
    //   settings: {
    //     layout: SECTION_LAYOUT_OPTIONS.FULL,
    //     responsive: {
    //       mobile: { padding: { top: 0, right: 0, bottom: 0, left: 0 } },
    //       tablet: { padding: { top: 0, right: 0, bottom: 0, left: 0 } },
    //       desktop: { padding: { top: 0, right: 0, bottom: 0, left: 0 } },
    //     },
    //   },
    //   widgets: [
    //     {
    //       id: "nintarababy-blog",
    //       name: "Blog",
    //       type: WIDGET_TYPES.Blog,
    //       settings: {
    //         variant: "v1",
    //         heading: "We\u2019re Here For You!",
    //         seeAllText: "See All",
    //         seeAllLink: "/blogs/blog",
    //         posts: [
    //           {
    //             title: "The Ultimate Go-To Baby Essentials List",
    //             url: "/blogs/blog/the-ultimate-go-to-baby-essentials-list",
    //             category: "Newborn Essentials",
    //             date: "02 Feb 2026",
    //             readTime: "6 min read",
    //             excerpt:
    //               "Getting ready for your little one is exciting, a bit chaotic, and full of tiny decisions. A handy baby essentials list keeps the guesswork low and the snuggles high.",
    //             desktopImage:
    //               "/assets/nintarababy/blog/blog1-essentials-desktop.png",
    //             mobileImage:
    //               "/assets/nintarababy/blog/blog1-essentials-mobile.png",
    //           },
    //           {
    //             title:
    //               "Baby Bath Time: Tips for Bathing Baby from Newborn to Toddler",
    //             url: "/blogs/blog/baby-bath-time-tips-for-bathing-baby-from-newborn-to-toddler",
    //             category: "Baby Bathing",
    //             date: "23 Jan 2026",
    //             readTime: "6 mins read",
    //             excerpt:
    //               "Baby bath time can be one of the sweetest parts of the day \u2013 all those tiny toes, splashes, and that lovely \u201cfresh baby\u201d smell.",
    //             desktopImage:
    //               "/assets/nintarababy/blog/blog2-bath-desktop.webp",
    //             mobileImage: "/assets/nintarababy/blog/blog2-bath-mobile.webp",
    //           },
    //           {
    //             title: "Baby Sleep from 2-12 months: What to expect",
    //             url: "/blogs/blog/baby-sleep-from-2-12-months-what-to-expect",
    //             category: "Baby Sleep",
    //             date: "22 Jan 2026",
    //             readTime: "8 mins read",
    //             excerpt:
    //               "Baby sleep between 2\u201312 months can feel like a rollercoaster. Just when you think you have understood your little one\u2019s pattern, it changes again.",
    //             desktopImage:
    //               "/assets/nintarababy/blog/blog3-sleep-desktop.webp",
    //             mobileImage: "/assets/nintarababy/blog/blog3-sleep-mobile.webp",
    //           },
    //         ],
    //       },
    //     },
    //   ],
    // },

    // Footer Section (Nintara Baby)
    {
      id: "footer-section",
      name: "Footer",
      type: SECTION_TYPES.FOOTER_SECTION,
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
          id: "nintarababy-footer",
          name: "Footer",
          type: WIDGET_TYPES.Footer,
          dataSourceKey: "collectionDataAll",
          settings: {
            variant: "v1",
            seoHeading: "t:common.footer.seoHeading",
            contactAddress: "t:common.footer.contactAddress",
            contactWhatsapp: "t:common.footer.contactWhatsapp",
            contactEmail: "t:common.footer.contactEmail",
            categoriesHeading: "t:common.footer.categoriesHeading",
            helpHeading: "t:common.footer.helpHeading",
            otherLinksHeading: "t:common.footer.otherLinksHeading",
            newsletterHeading: "t:common.footer.newsletterHeading",
            facebookUrl: "t:common.footer.facebookUrl",
            instagramUrl: "t:common.footer.instagramUrl",
            helpLinks: "t:common.footer.helpLinks",
            otherLinks: "t:common.footer.otherLinks",
            categoryLinks: "t:common.footer.categoryLinks",
          },
        },
      ],
    },

    // Bottom Bar Section (Copyright)
    {
      id: "bottom-bar-section",
      name: "BottomBar",
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
          id: "nintarababy-bottom-bar",
          name: "BottomBar",
          type: WIDGET_TYPES.BottomBar,
          settings: {
            variant: "v1",
            copyrightText: "t:common.bottom_bar.copyrightText",
          },
        },
      ],
    },
  ],
};
