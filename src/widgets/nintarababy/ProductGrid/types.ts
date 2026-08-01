import { WidgetProps } from "@/widgets/types";

/**
 * A single product in the ProductGrid
 */
export interface ProductGridProduct {
  id: string;
  name: string;
  url: string;
  image: {
    src: string;
    alt: string;
    width: number;
    height: number;
  };
  hoverImage?: {
    src: string;
    alt: string;
    width: number;
    height: number;
  };
  rating: {
    score: number;
    reviewCount: number;
  };
  price: {
    current: string;
    original: string;
    savePercent?: string;
  };
  available: boolean;
  subtitle?: string;
  badge?: {
    type: "parents-choice" | "new-launch" | null;
    label: string;
  };
  variants?: {
    id: string;
    label: string;
    available: boolean;
  }[];
}

/**
 * ProductGrid widget data
 */
export interface ProductGridData {
  products?: ProductGridProduct[];
}

/**
 * ProductGrid widget settings
 */
export interface ProductGridSettings {
  /** Widget variant @default "v1" */
  variant?: string;
  /** Text for the "Add to Cart" button */
  addToCartText?: string;
  /** Text shown when product is out of stock */
  outOfStockText?: string;
  /** Label for the reviews count (e.g. "Reviews") */
  reviewsText?: string;
  /** Prefix for the save badge (e.g. "Save") */
  savePrefix?: string;
}

/**
 * Props for the ProductGrid component
 */
export type ProductGridProps = WidgetProps<
  ProductGridData,
  ProductGridSettings
>;

/**
 * Design tokens extracted from nintarababy.in collection product grid
 */
export const DESIGN_TOKENS = {
  colors: {
    cardBorder: "rgba(0, 53, 81, 0.24)",
    titleColor: "#092a33",
    titleHoverColor: "#222222",
    priceCurrentColor: "#092a33",
    priceOriginalColor: "#889093",
    saveBadgeBg: "#e5c645",
    saveBadgeText: "#092a33",
    atcBorder: "#01464f",
    atcColor: "#01464f",
    atcHoverBg: "#01464f",
    atcHoverColor: "#ffffff",
    atcDisabledBorder: "#9ca3af",
    atcDisabledColor: "#9ca3af",
    starColor: "#e5c645",
    reviewColor: "#092a33",
    badgeParentsChoice: "#c6d4f6",
    badgeNewLaunch: "#e5c645",
    badgeText: "#092a33",
    overlayBg: "rgba(0, 0, 0, 0.1)",
  },
  typography: {
    fontFamily: "Figtree, sans-serif",
  },
  layout: {
    containerMaxWidth: "1200px",
    gridGapDesktop: "30px",
    gridGapMobile: "10px",
    columnsDesktop: 4,
    columnsMobile: 2,
  },
  borders: {
    cardRadius: "4px",
    atcRadius: "63px",
    saveBadgeRadius: "4px",
  },
} as const;

/**
 * Default product data matching the source site
 */
export const DEFAULT_PRODUCTS: ProductGridProduct[] = [
  {
    id: "nin_pg_01",
    name: "Wake Me Not Swaddle\u2122 | Butter Blossoms",
    url: "/products/wake-me-not-swaddle-butter-blossoms",
    image: {
      src: "https://cdn.shopify.com/s/files/1/0902/0053/9442/files/Butter_Blossom_21.webp?v=1756880642",
      alt: "Wake Me Not Swaddle\u2122 | Butter Blossoms",
      width: 720,
      height: 720,
    },
    hoverImage: {
      src: "https://cdn.shopify.com/s/files/1/0902/0053/9442/files/ButterBlossom11.webp?v=1756880642",
      alt: "Wake Me Not Swaddle\u2122 | Butter Blossoms - hover",
      width: 720,
      height: 720,
    },
    rating: { score: 4.69, reviewCount: 154 },
    price: {
      current: "\u20b91,335",
      original: "\u20b91,405",
      savePercent: "5%",
    },
    available: true,
    badge: { type: "parents-choice", label: "Parent's Choice" },
  },
  {
    id: "nin_pg_02",
    name: "Ergopod\u2122 Baby Feeding Pillow | Lucky Clover",
    url: "/products/ergopod-feeding-pillow-lucky-clover",
    image: {
      src: "https://cdn.shopify.com/s/files/1/0902/0053/9442/files/1A_1_bd7a26ba-cf35-468e-8cbe-31cba61b48fd.webp?v=1760527981",
      alt: "Ergopod\u2122 Baby Feeding Pillow | Lucky Clover",
      width: 720,
      height: 720,
    },
    hoverImage: {
      src: "https://cdn.shopify.com/s/files/1/0902/0053/9442/files/2_1_5148fa66-ac7c-4130-9775-350a45f64527.webp?v=1760527981",
      alt: "Ergopod\u2122 Baby Feeding Pillow | Lucky Clover - hover",
      width: 720,
      height: 720,
    },
    rating: { score: 4.69, reviewCount: 58 },
    price: {
      current: "\u20b91,999",
      original: "\u20b92,250",
      savePercent: "11%",
    },
    available: true,
    badge: { type: "new-launch", label: "New Launch" },
  },
  {
    id: "nin_pg_03",
    name: "Soft Cotton Baby Booties | Pretty Pink",
    url: "/products/soft-cotton-baby-booties-pretty-pink",
    image: {
      src: "https://cdn.shopify.com/s/files/1/0902/0053/9442/files/1_2_1.webp?v=1760357456",
      alt: "Soft Cotton Baby Booties | Pretty Pink",
      width: 720,
      height: 720,
    },
    hoverImage: {
      src: "https://cdn.shopify.com/s/files/1/0902/0053/9442/files/2_1_1_572e7041-72ab-4a8b-9284-1b094bc5c8cf.webp?v=1761212792",
      alt: "Soft Cotton Baby Booties | Pretty Pink - hover",
      width: 720,
      height: 720,
    },
    rating: { score: 4.89, reviewCount: 19 },
    price: {
      current: "\u20b9949",
      original: "\u20b9999",
      savePercent: "5%",
    },
    available: true,
    badge: { type: "parents-choice", label: "Parent's Choice" },
  },
  {
    id: "nin_pg_04",
    name: "Muslin Nursing Cover | Classic Green",
    url: "/products/classic-green-muslin-nursing-cover-40-x-30",
    image: {
      src: "https://cdn.shopify.com/s/files/1/0902/0053/9442/files/1B.webp?v=1760524320",
      alt: "Muslin Nursing Cover | Classic Green",
      width: 720,
      height: 720,
    },
    hoverImage: {
      src: "https://cdn.shopify.com/s/files/1/0902/0053/9442/files/2_b946580c-07ca-4fb6-ab59-654b40dbd1d5.webp?v=1760524320",
      alt: "Muslin Nursing Cover | Classic Green - hover",
      width: 720,
      height: 720,
    },
    rating: { score: 4.85, reviewCount: 13 },
    price: {
      current: "\u20b91,139",
      original: "\u20b91,199",
      savePercent: "5%",
    },
    available: true,
    badge: { type: "new-launch", label: "New Launch" },
  },
  {
    id: "nin_pg_05",
    name: "The Breezy Blanket | Light Baby Blanket - Vroom, Vroom!",
    url: "/products/baby-blankets-the-breezy-blanket-vroom-vroom",
    image: {
      src: "https://cdn.shopify.com/s/files/1/0902/0053/9442/files/1_DTC_c55c89a6-a655-447c-9687-473251ce8612.webp?v=1769665093",
      alt: "The Breezy Blanket | Light Baby Blanket - Vroom, Vroom!",
      width: 720,
      height: 720,
    },
    hoverImage: {
      src: "https://cdn.shopify.com/s/files/1/0902/0053/9442/files/2_c83c2b3f-d64b-468c-afd7-cada40a9658b.webp?v=1769665102",
      alt: "The Breezy Blanket | Light Baby Blanket - Vroom, Vroom! - hover",
      width: 720,
      height: 720,
    },
    rating: { score: 4.79, reviewCount: 14 },
    price: {
      current: "\u20b9759",
      original: "\u20b9799",
      savePercent: "5%",
    },
    available: true,
    badge: { type: "parents-choice", label: "Parent's Choice" },
  },
  {
    id: "nin_pg_06",
    name: "Wake Me Not Swaddle | Bear Cuddles",
    url: "/products/wake-me-not-swaddle-bear-cuddles",
    image: {
      src: "https://cdn.shopify.com/s/files/1/0902/0053/9442/files/1_DTC_97ba512c-95b3-471c-b890-828e8eda1a4a.webp?v=1770442818",
      alt: "Wake Me Not Swaddle | Bear Cuddles",
      width: 720,
      height: 720,
    },
    hoverImage: {
      src: "https://cdn.shopify.com/s/files/1/0902/0053/9442/files/1_af1bccfa-1693-40be-b625-7ea9b40591e6.webp?v=1770965486",
      alt: "Wake Me Not Swaddle | Bear Cuddles - hover",
      width: 720,
      height: 720,
    },
    rating: { score: 4.68, reviewCount: 154 },
    price: {
      current: "\u20b91,335",
      original: "\u20b91,499",
      savePercent: "11%",
    },
    available: true,
    badge: { type: "new-launch", label: "New Launch" },
  },
  {
    id: "nin_pg_07",
    name: "Fitted Crib Sheets | Vroom, Vroom!",
    url: "/products/baby-fitted-crib-sheets-vroom-vroom",
    image: {
      src: "https://cdn.shopify.com/s/files/1/0902/0053/9442/files/1_1935be50-a7d3-4cf1-a5a5-b354edc715a9.webp?v=1769509089",
      alt: "Fitted Crib Sheets | Vroom, Vroom!",
      width: 720,
      height: 720,
    },
    hoverImage: {
      src: "https://cdn.shopify.com/s/files/1/0902/0053/9442/files/2_b6b4485d-5bb0-4e31-b340-2c29c43ae3ab.webp?v=1769509089",
      alt: "Fitted Crib Sheets | Vroom, Vroom! - hover",
      width: 720,
      height: 720,
    },
    rating: { score: 4.83, reviewCount: 12 },
    price: {
      current: "\u20b91,044",
      original: "\u20b91,099",
      savePercent: "5%",
    },
    available: true,
    badge: { type: "parents-choice", label: "Parent's Choice" },
  },
  {
    id: "nin_pg_08",
    name: "Anti-Slip Baby Socks - Set of 3 | Little Hearts",
    url: "/products/anti-slip-baby-socks-set-of-3-little-hearts",
    image: {
      src: "https://cdn.shopify.com/s/files/1/0902/0053/9442/files/1_0d87352f-e4b9-41d7-b3f3-1f39fa2577d5.webp?v=1769148993",
      alt: "Anti-Slip Baby Socks - Set of 3 | Little Hearts",
      width: 720,
      height: 720,
    },
    hoverImage: {
      src: "https://cdn.shopify.com/s/files/1/0902/0053/9442/files/2_19d1a2de-ec66-4607-a4fa-eba39157f34f.webp?v=1769148993",
      alt: "Anti-Slip Baby Socks - Set of 3 | Little Hearts - hover",
      width: 720,
      height: 720,
    },
    rating: { score: 4.78, reviewCount: 9 },
    price: {
      current: "\u20b9427",
      original: "\u20b9449",
      savePercent: "5%",
    },
    available: true,
    badge: { type: "new-launch", label: "New Launch" },
  },
  {
    id: "nin_pg_09",
    name: "The Baby Landing Mat | In Bloom",
    url: "/products/the-baby-landing-mat-in-bloom",
    image: {
      src: "https://cdn.shopify.com/s/files/1/0902/0053/9442/files/1_efaf8a30-9921-4184-9d32-59c7ea5559fc.webp?v=1768473598",
      alt: "The Baby Landing Mat | In Bloom",
      width: 720,
      height: 720,
    },
    hoverImage: {
      src: "https://cdn.shopify.com/s/files/1/0902/0053/9442/files/2_1b46ecc8-cdf1-443a-8ded-391f1c12022c.webp?v=1768473598",
      alt: "The Baby Landing Mat | In Bloom - hover",
      width: 720,
      height: 720,
    },
    rating: { score: 5.0, reviewCount: 35 },
    price: {
      current: "\u20b91,139",
      original: "\u20b91,199",
      savePercent: "5%",
    },
    available: true,
    badge: { type: "parents-choice", label: "Parent's Choice" },
  },
  {
    id: "nin_pg_10",
    name: "Buttery Soft Baby Hairband - Set of 2 | Winter Pink Bloom + Baby Mocha Bloom",
    url: "/products/softbaby-hair-bands-winter-pink-bloom-baby-mocha-bloom-set-of-2",
    image: {
      src: "https://cdn.shopify.com/s/files/1/0902/0053/9442/files/1_1_e5381a70-b1b1-4054-b50a-f83e196cbbea.webp?v=1762337631",
      alt: "Buttery Soft Baby Hairband - Set of 2 | Winter Pink Bloom + Baby Mocha Bloom",
      width: 720,
      height: 720,
    },
    hoverImage: {
      src: "https://cdn.shopify.com/s/files/1/0902/0053/9442/files/2_2_38d70d0c-afc7-4a93-9c7b-dcf75f40ce12.webp?v=1762337631",
      alt: "Buttery Soft Baby Hairband - Set of 2 | Winter Pink Bloom + Baby Mocha Bloom - hover",
      width: 720,
      height: 720,
    },
    rating: { score: 5.0, reviewCount: 13 },
    price: {
      current: "\u20b9569",
      original: "\u20b9599",
      savePercent: "5%",
    },
    available: true,
    badge: { type: "new-launch", label: "New Launch" },
  },
  {
    id: "nin_pg_11",
    name: "Bamboo Baby Hooded Towel | Giraffe",
    url: "/products/baby-bamboo-hooded-towel-giraffe",
    image: {
      src: "https://cdn.shopify.com/s/files/1/0902/0053/9442/files/Giraffe_1_1.webp?v=1759920988",
      alt: "Bamboo Baby Hooded Towel | Giraffe",
      width: 720,
      height: 720,
    },
    hoverImage: {
      src: "https://cdn.shopify.com/s/files/1/0902/0053/9442/files/2_f8be0d08-a09c-4db1-b217-006bdc974810.webp?v=1761716280",
      alt: "Bamboo Baby Hooded Towel | Giraffe - hover",
      width: 720,
      height: 720,
    },
    rating: { score: 4.74, reviewCount: 34 },
    price: {
      current: "\u20b91,199",
      original: "\u20b91,699",
      savePercent: "29%",
    },
    available: true,
    badge: { type: "parents-choice", label: "Parent's Choice" },
  },
  {
    id: "nin_pg_12",
    name: "Washable Nursing Pads | Set of 6",
    url: "/products/washable-nursing-pads-set-of-6",
    image: {
      src: "https://cdn.shopify.com/s/files/1/0902/0053/9442/files/1_fe602670-17de-4d9f-bb7f-372ff7688683.webp?v=1761646244",
      alt: "Washable Nursing Pads | Set of 6",
      width: 720,
      height: 720,
    },
    hoverImage: {
      src: "https://cdn.shopify.com/s/files/1/0902/0053/9442/files/2_f9263775-e8cb-4815-beea-1f1d694e8427.webp?v=1761649542",
      alt: "Washable Nursing Pads | Set of 6 - hover",
      width: 720,
      height: 720,
    },
    rating: { score: 4.92, reviewCount: 25 },
    price: {
      current: "\u20b9664",
      original: "\u20b9699",
      savePercent: "5%",
    },
    available: true,
    badge: { type: "new-launch", label: "New Launch" },
  },
];

// PAGE_2_PRODUCTS moved to ./page2data.ts to avoid bundler tree-shaking issues
