import type { PageConfig } from "@shopkit/builder";
import { WIDGET_TYPES } from "@/widgets/.generated/types";
import { SECTION_TYPES, SECTION_LAYOUT_OPTIONS } from "@shopkit/builder";

/**
 * Products Page Template for dawn
 */
export const template: PageConfig = {
  id: "dawn-products",
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

    // Product Detail Section
    {
      id: "product-detail-section",
      name: "Product Detail",
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
          id: "dawn-product-detail",
          name: "Product Detail",
          type: WIDGET_TYPES.ProductDetail,
          settings: {
            variant: "v1",
          },
        },
      ],
    },

    // Reasons to Love Section
    {
      id: "reasons-to-love-section",
      name: "Reasons to Love",
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
          id: "dawn-reasons-to-love",
          name: "Reasons to Love",
          type: WIDGET_TYPES.ReasonsToLove,
          settings: {
            variant: "v1",
            heading: "Reasons to Love",
            imageSrc: "/ReasonsToLove/images/reasons-to-love.webp",
            imageAlt: "Reasons to love",
            imageWidth: 970,
            imageHeight: 4800,
          },
        },
      ],
    },

    // Product Tabs Section
    {
      id: "product-tabs-section",
      name: "Product Tabs",
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
          id: "dawn-product-tabs",
          name: "Product Tabs",
          type: WIDGET_TYPES.ProductTabs,
          settings: {
            variant: "v1",
            tabs: [
              {
                title: "Description",
                type: "html",
                contentHTML:
                  "<p><em>Hair colour that wrecks your strands? Sorry, not sorry, it\u2019s out of the dye-logue.</em></p>\n<p>So, if you\u2019ve ever hesitated before hitting a YES on that colour change, this one\u2019s for you. <strong>BBlunt Salon Secret High Shine Conditioning Hair Colour</strong> - in <strong>Mahogany Reddish Brown</strong>, now upgraded with <em>smarter science</em>, <em>more intense payoff</em>, and a <strong>bold new design</strong>. It shuts down the damage drama with a game-changing formula that lets you go <strong>bold</strong> without holding back.<br>Co-created by salon experts for Indian hair, it delivers <strong>100% grey coverage</strong> with rich, lasting pigment.</p>\n<p>This salon-grade hair colour is powered by <strong>MaliPeptide BondTech\u2122</strong> that\u2019s packed in the <strong>Bond Repair Serum Concentrate</strong>. It\u2019s a breakthrough technology that strengthens hair bonds from within, minimising breakage as you colour. And that\u2019s not all! Each box comes with a <strong>Shine Tonic Hair Mask</strong> that locks in moisture and adds a high-shine finish that looks and feels like you just stepped out of the salon.</p>\n<p>No ammonia. No fading fast. No compromising on strength. Just a rich, vibrant colour that lasts up to <strong>32 washes</strong>! Because with BBlunt, when you <strong>Colour Outside</strong>, you <strong>Care Inside</strong>.</p>\n<p><em>Disclaimer: Depends on the natural colour of the hair &amp; extent of greys.</em></p>",
              },
              {
                title: "How to Use",
                type: "steps",
                steps: [
                  {
                    label: "Mix",
                    text: "Blend Colourant + Developer + Bond Repair Serum Concentrate infused with MaliPeptide BondTech\u2122 until smooth",
                  },
                  {
                    label: "Apply",
                    text: "Evenly apply on dry hair & leave for 30 minutes",
                  },
                  {
                    label: "Rinse",
                    text: "Wash thoroughly with running water",
                  },
                  {
                    label: "Condition",
                    text: "Apply the hair mask infused with Shine Tonic, rinse after 5 minutes & style",
                  },
                ],
              },
              {
                title: "Power Ingredients",
                type: "ingredients",
                ingredients: [
                  {
                    image: "/ProductTabs/images/malipeptide-bondtech.png",
                    label: "Malipeptide Bondtech (Malic Acid + Nano-Peptides)",
                    text: "Reduces post-colour hair breakage",
                  },
                  {
                    image: "/ProductTabs/images/shine-tonic.jpg",
                    label: "Shine Tonic",
                    text: "Gives hair a high-shine finish",
                  },
                ],
              },
              {
                title: "Suitable For",
                type: "list",
                items: [
                  "Anyone looking for an Ammonia-free High Shine Hair Colour that doesn\u2019t cause hair breakage while deeply conditions the hair & adds shine.",
                  "It is formulated to suit all Indian hair types, textures & length.",
                ],
              },
              {
                title: "Ingredients List",
                type: "ingredientsList",
                ingredientListings: [
                  {
                    label: "Mahogany Reddish Brown",
                    text: "Paraffinum Liquidum, Aqua, Monoethanolamine, Steareth-21, Steareth-2, Cetearyl Alcohol (and) Ceteareth-20, Trideceth-2 Carboxamide MEA, Fragrance, Polyquaternium-22, Xanthan Gum, Cetearyl Alcohol (and) Dicetyl Phosphate (and) Ceteth-10 Phosphate, p-Aminophenol, 2-Methylresorcinol, 3 Methyl 4 Amino Phenol, Ascorbic Acid, Sodium Sulphite, Phenyl Methyl Pyrazolone, p-Phenylenediamine, Resorcinol, m-Aminophenol, Disodium EDTA, HEDP di-sodium salt, N,N-Bis(2-hydroxyethyl)-p-phenylenediamine Sulphate, 2-(2,4-Diaminophenoxy)Ethanol Dihydrochloride, Sodium Metabisulfite.",
                  },
                  {
                    label: "Developer",
                    text: "Aqua, Paraffinum Liquidum, Hydrogen Peroxide, Emulsifying Wax, Glyceryl Stearate (and) PEG-100 Stearate, Sodium Lauryl Ether Sulphate, Polyquaternium-39, Tetra Sodium Pyrophosphate, Disodium EDTA, Sodium Salicylate, Sodium Stannate.",
                  },
                ],
              },
            ],
          },
        },
      ],
    },

    // Product FAQ Section
    {
      id: "product-faq-section",
      name: "Product FAQ",
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
          id: "dawn-product-faq",
          name: "Product FAQ",
          type: WIDGET_TYPES.ProductFAQ,
          settings: {
            variant: "v1",
            title: "Product FAQs",
            defaultExpanded: true,
            items: [
              {
                question:
                  "What makes BBLUNT Hair Colour different from regular hair colours?",
                answer:
                  "BBLUNT\u2019s Salon Secret High Shine Conditioning Hair Colour is co-created with salon experts and powered with MaliPeptide BondTech\u2122 for intense colour with less breakage. It also includes a Shine Tonic that delivers salon-like shiny colour right at home.",
              },
              {
                question: "What is MaliPeptide BondTech\u2122?",
                answer:
                  "It\u2019s a breakthrough technology that strengthens hair bonds from within, minimising breakage as you colour, as well as post-colour hair breakage.",
              },
              {
                question: "How long does the colour last?",
                answer:
                  "The colour is long-lasting and vibrant for up to 32 washes, depending on your hair type and maintenance routine.",
              },
              {
                question: "Can I use this colour at home without help?",
                answer:
                  "Totally. It\u2019s designed for easy DIY application with salon-like results. Just follow the instructions inside the kit.",
              },
              {
                question: "Is this suitable for all hair types?",
                answer:
                  "Yes, it\u2019s suitable for straight, wavy, curly, or coily hair across all textures and lengths.",
              },
              {
                question: "How many boxes of hair colour do I need?",
                answer:
                  "If your hair is shoulder-length or shorter, 1 box should be enough. For longer or thicker hair, we recommend 2 boxes for full, even coverage.",
              },
              {
                question: "What type of hair dye is this?",
                answer:
                  "This is a permanent hair dye that provides long-lasting, intense shine hair colour.",
              },
            ],
          },
        },
      ],
    },

    // Customer Reviews Section
    {
      id: "customer-reviews-section",
      name: "Customer Reviews",
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
          id: "dawn-customer-reviews",
          name: "Customer Reviews",
          type: WIDGET_TYPES.CustomerReviews,
          settings: {
            variant: "v1",
            title: "Customer Reviews",
            averageRating: 5.0,
            totalReviews: 11,
            perPage: 5,
            defaultSort: "most-recent",
            sortOptions: [
              { label: "Most Recent", value: "most-recent" },
              { label: "Highest Rating", value: "highest-rating" },
              { label: "Lowest Rating", value: "lowest-rating" },
              { label: "Pictures First", value: "pictures-first" },
              { label: "Most Helpful", value: "most-helpful" },
            ],
            reviews: [
              {
                id: "r1",
                rating: 5,
                title: "Great",
                body: "Great",
                author: "Anonymous",
                verifiedBuyer: true,
                date: "03/26/2026",
              },
              {
                id: "r2",
                rating: 5,
                title: "Loved it",
                body: "Its amazing",
                author: "Sandhya Tomar",
                verifiedBuyer: true,
                date: "03/20/2026",
              },
              {
                id: "r3",
                rating: 5,
                title: "Awesome",
                body: "Awesome",
                author: "mita mita",
                verifiedBuyer: true,
                date: "03/20/2026",
              },
              {
                id: "r4",
                rating: 5,
                title: "Nice",
                body: "Nice Product",
                author: "Arun Abhinav",
                verifiedBuyer: true,
                date: "03/13/2026",
              },
              {
                id: "r5",
                rating: 5,
                title: "Amazing",
                body: "Amazing",
                author: "Darji Pooja kamlesh bhai",
                verifiedBuyer: true,
                date: "03/06/2026",
              },
              {
                id: "r6",
                rating: 5,
                title: "Good product",
                body: "Good quality hair colour",
                author: "Priya Sharma",
                verifiedBuyer: true,
                date: "02/28/2026",
              },
              {
                id: "r7",
                rating: 5,
                title: "Best hair colour",
                body: "Love the colour and shine",
                author: "Neha Gupta",
                verifiedBuyer: true,
                date: "02/20/2026",
              },
              {
                id: "r8",
                rating: 5,
                title: "Excellent",
                body: "Very easy to apply",
                author: "Ritu Singh",
                verifiedBuyer: true,
                date: "02/15/2026",
              },
              {
                id: "r9",
                rating: 5,
                title: "Superb",
                body: "Great coverage",
                author: "Kavita Patel",
                verifiedBuyer: true,
                date: "02/10/2026",
              },
              {
                id: "r10",
                rating: 5,
                title: "Wonderful",
                body: "Highly recommend",
                author: "Meena Rao",
                verifiedBuyer: true,
                date: "02/05/2026",
              },
              {
                id: "r11",
                rating: 5,
                title: "Perfect",
                body: "No ammonia smell at all",
                author: "Sunita Verma",
                verifiedBuyer: true,
                date: "01/30/2026",
              },
            ],
          },
        },
      ],
    },

    // People Also Bought Section
    {
      id: "people-also-bought-section",
      name: "People Also Bought",
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
          id: "dawn-people-also-bought",
          name: "People Also Bought",
          type: WIDGET_TYPES.PeopleAlsoBought,
          settings: {
            variant: "v1",
            heading: "People Also Bought",
            products: [
              {
                href: "/products/high-shine-conditioning-hair-colour-cherry-red-shade-6-62",
                title:
                  "High Shine Conditioning Hair Colour - Cherry Red (Shade 6.62)",
                alt: "High Shine Conditioning Hair Colour - Cherry Red (Shade 6.62)",
                mainImage:
                  "https://bblunt.com/cdn/shop/files/1FOP_1_c61589f1-a9b9-4937-a65a-bf8fa2f11fe1.jpg?v=1757585023&width=360",
                hoverImage:
                  "https://bblunt.com/cdn/shop/files/3FOPwithKMMarketplace.jpg?v=1757585144&width=360",
                category: "Hair Colour",
                badge: "Get3@\u20B9799",
                badgeVariant: "trending",
                rating: 4.85,
                reviewCount: 13,
                salePrice: 399,
                weight: "130g",
                description:
                  "Intense High Shine Hair Colour at Home | Colour Outside, Care Inside",
              },
              {
                href: "/products/high-shine-conditioning-hair-colour-mahogany-reddish-brown-shade-4-56pack-of-2",
                title:
                  "High Shine Conditioning Hair Colour - Mahogany Reddish Brown (Shade 4.56)(Pack of 2)",
                alt: "High Shine Conditioning Hair Colour - Mahogany Reddish Brown (Shade 4.56)(Pack of 2)",
                mainImage:
                  "https://bblunt.com/cdn/shop/files/Mahogany_Reddish_Brown_FOP.jpg?v=1762754842&width=360",
                hoverImage:
                  "https://bblunt.com/cdn/shop/files/3FOPwithKM_624e7dc2-83af-41f4-b3d2-bebd81fea683.jpg?v=1762754842&width=360",
                category: "Combos",
                badge: "New Launch",
                badgeVariant: "new",
                rating: 5.0,
                reviewCount: 1,
                salePrice: 638,
                originalPrice: 798,
                discount: "20% off",
                weight: "130g",
                description:
                  "Intense High Shine Hair Colour at Home | Colour Outside, Care Inside",
              },
              {
                href: "/products/high-shine-conditioning-hair-colour-wine-deep-burgundy-shade-4-20",
                title:
                  "High Shine Conditioning Hair Colour - Wine Deep Burgundy (Shade 4.20)",
                alt: "High Shine Conditioning Hair Colour - Wine Deep Burgundy (Shade 4.20)",
                mainImage:
                  "https://bblunt.com/cdn/shop/files/FOP_1_738d4d42-2fe0-4ab3-a29d-856a3b990327.jpg?v=1757585872&width=360",
                hoverImage:
                  "https://bblunt.com/cdn/shop/files/3FOPwithKMMarketplace_a6ec38b3-509e-4377-bf7e-cfe6a0c0b3f2.jpg?v=1757585872&width=360",
                category: "Hair Colour",
                badge: "Get3@\u20B9799",
                badgeVariant: "trending",
                rating: 4.9,
                reviewCount: 20,
                salePrice: 399,
                weight: "130g",
                description:
                  "Intense High Shine Hair Colour at Home | Colour Outside, Care Inside",
              },
              {
                href: "/products/high-shine-conditioning-hair-colour-mahogany-reddish-brown-shade-4-56pack-of-3",
                title:
                  "High Shine Conditioning Hair Colour - Mahogany Reddish Brown (Shade 4.56)(Pack of 3)",
                alt: "High Shine Conditioning Hair Colour - Mahogany Reddish Brown (Shade 4.56)(Pack of 3)",
                mainImage:
                  "https://bblunt.com/cdn/shop/files/Mahogany_Reddish_Brown_FOP_Pack_of_3.jpg?v=1762754883&width=360",
                hoverImage:
                  "https://bblunt.com/cdn/shop/files/3FOPwithKMMarketplace_7a3792cc-20ea-4c47-9bc8-bfbee0aa0b5c.jpg?v=1762754883&width=360",
                category: "Kits",
                badge: "New Launch",
                badgeVariant: "new",
                rating: 0,
                reviewCount: 0,
                salePrice: 898,
                originalPrice: 1197,
                discount: "25% off",
                weight: "130g",
                description:
                  "Intense High Shine Hair Colour at Home | Colour Outside, Care Inside",
              },
              {
                href: "/products/high-shine-conditioning-hair-colour-coffee-natural-brown-shade-4-31",
                title:
                  "High Shine Conditioning Hair Colour - Coffee Natural Brown (Shade 4.31)",
                alt: "High Shine Conditioning Hair Colour - Coffee Natural Brown (Shade 4.31)",
                mainImage:
                  "https://bblunt.com/cdn/shop/files/1_FOP_1.jpg?v=1753695913&width=360",
                hoverImage:
                  "https://bblunt.com/cdn/shop/files/4_Model.jpg?v=1753696146&width=360",
                category: "Hair Colour",
                badge: "Get3@\u20B9799",
                badgeVariant: "trending",
                rating: 4.64,
                reviewCount: 106,
                salePrice: 399,
                weight: "130g",
                description:
                  "Intense High Shine Hair Colour at Home | Colour Outside, Care Inside",
              },
              {
                href: "/products/high-shine-conditioning-hair-colour-natural-black-shade-1",
                title:
                  "High Shine Conditioning Hair Colour - Natural Black (Shade 1)",
                alt: "High Shine Conditioning Hair Colour - Natural Black (Shade 1)",
                mainImage:
                  "https://bblunt.com/cdn/shop/files/1FOP_1_d530b216-131a-49d6-b164-7b4c4e1935b2.jpg?v=1753698490&width=360",
                hoverImage:
                  "https://bblunt.com/cdn/shop/files/3FOPwithKM_917f7769-a802-42d4-8ecf-c78500dbf98c.jpg?v=1753698590&width=360",
                category: "Hair Colour",
                badge: "Get3@\u20B9799",
                badgeVariant: "trending",
                rating: 4.58,
                reviewCount: 78,
                salePrice: 399,
                weight: "130g",
                description:
                  "Intense High Shine Hair Colour at Home | Colour Outside, Care Inside",
              },
              {
                href: "/products/high-shine-conditioning-hair-colour-cherry-red-shade-6-62pack-of-2",
                title:
                  "High Shine Conditioning Hair Colour - Cherry Red (Shade 6.62)(Pack of 2)",
                alt: "High Shine Conditioning Hair Colour - Cherry Red (Shade 6.62)(Pack of 2)",
                mainImage:
                  "https://bblunt.com/cdn/shop/files/Cherry_Red_fop.jpg?v=1762754099&width=360",
                hoverImage:
                  "https://bblunt.com/cdn/shop/files/3FOPwithKMMarketplace_77494407-e9c4-46c4-8615-a94085cbcce9.jpg?v=1762754099&width=360",
                category: "Combos",
                badge: "New Launch",
                badgeVariant: "new",
                rating: 0,
                reviewCount: 0,
                salePrice: 638,
                originalPrice: 798,
                discount: "20% off",
                weight: "130g",
                description:
                  "Intense High Shine Hair Colour at Home | Colour Outside, Care Inside",
              },
              {
                href: "/products/high-shine-conditioning-hair-colour-chocolate-dark-brown-shade-3",
                title:
                  "High Shine Conditioning Hair Colour - Chocolate Dark Brown (Shade 3)",
                alt: "High Shine Conditioning Hair Colour - Chocolate Dark Brown (Shade 3)",
                mainImage:
                  "https://bblunt.com/cdn/shop/files/1FOP_1.jpg?v=1753438944&width=360",
                hoverImage:
                  "https://bblunt.com/cdn/shop/files/3FOPwithKM.jpg?v=1753439356&width=360",
                category: "Hair Colour",
                badge: "Get3@\u20B9799",
                badgeVariant: "trending",
                rating: 4.65,
                reviewCount: 110,
                salePrice: 399,
                weight: "130g",
                description:
                  "Intense High Shine Hair Colour at Home | Colour Outside, Care Inside",
              },
              {
                href: "/products/high-shine-conditioning-hair-colour-cherry-red-shade-6-62pack-of-3",
                title:
                  "High Shine Conditioning Hair Colour - Cherry Red (Shade 6.62)(Pack of 3)",
                alt: "High Shine Conditioning Hair Colour - Cherry Red (Shade 6.62)(Pack of 3)",
                mainImage:
                  "https://bblunt.com/cdn/shop/files/Cherry_Red_fop_pack_of_3.jpg?v=1762754279&width=360",
                hoverImage:
                  "https://bblunt.com/cdn/shop/files/3FOPwithKMMarketplace_77494407-e9c4-46c4-8615-a94085cbcce9.jpg?v=1762754279&width=360",
                category: "Kits",
                badge: "New Launch",
                badgeVariant: "new",
                rating: 0,
                reviewCount: 0,
                salePrice: 898,
                originalPrice: 1197,
                discount: "25% off",
                weight: "130g",
                description:
                  "Intense High Shine Hair Colour at Home | Colour Outside, Care Inside",
              },
            ],
          },
        },
      ],
    },

    // Additional Information Section
    {
      id: "additional-information-section",
      name: "Additional Information",
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
          id: "dawn-additional-information",
          name: "Additional Information",
          type: WIDGET_TYPES.AdditionalInformation,
          settings: {
            variant: "v1",
            title: "Additional Information",
            defaultExpanded: false,
            items: [
              {
                label: "MANUFACTURER",
                value:
                  "N.G. Electro Products Private Ltd, Unit III, H.B. No. 193, Village Dharampur, Tehsil Baddi, Distt. Solan, (H.P.), 173205",
              },
              {
                label: "MARKETED BY",
                value:
                  "Honasa Consumer Limited, 10th and 11th Floor, Capital Cyberscape, Sector 59, Gurugram, Haryana, 122101",
              },
              {
                label: "COUNTRY OF ORIGIN",
                value: "India",
              },
              {
                label: "Customer Care Details",
                value:
                  "Supratim Sarkar - nodal@honasa.in\n+91 7303086765 (refer to marketed by address)",
              },
            ],
          },
        },
      ],
    },

    // Breadcrumb Section
    {
      id: "breadcrumb-section",
      name: "Breadcrumb",
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
          id: "dawn-breadcrumb",
          name: "Breadcrumb",
          type: WIDGET_TYPES.Breadcrumb,
          settings: {
            variant: "v1",
            items: [
              { text: "Home", href: "/" },
              { text: "Salon secret", href: "/collections/salon-secret" },
              {
                text: "High Shine Conditioning Hair Colour - Mahogany Reddish Brown (Shade 4.56)",
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

    // Sticky Add To Cart Bar (fixed bottom bar)
    {
      id: "sticky-add-to-cart-section",
      name: "Sticky Add To Cart",
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
          id: "dawn-sticky-add-to-cart",
          name: "Sticky Add To Cart",
          type: WIDGET_TYPES.StickyAddToCart,
          settings: {
            variant: "v1",
            productTitle:
              "High Shine Conditioning Hair Colour - Mahogany Reddish Brown (Shade 4.56)",
            productImage: "/StickyAddToCart/images/product-thumb.jpg",
            productImageAlt:
              "High Shine Conditioning Hair Colour - Mahogany Reddish Brown (Shade 4.56)",
            mrpLabel: "M.R.P.",
            price: "\u20B9399",
            taxNote: "Incl. of all taxes",
            buttonText: "Add to cart",
            cartHref: "/cart",
          },
        },
      ],
    },
  ],
};
