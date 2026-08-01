import { WidgetProps } from "@/widgets/types";

/**
 * A single product in the Featured Products grid
 */
export interface FeaturedProduct {
  id: string;
  name: string;
  /** Per-product subtitle from product.metadata.subtitle.value (optional) */
  subtitle?: string;
  url: string;
  image: {
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
    compareAt: string;
    sale: string;
    savePercent?: string;
  };
  available: boolean;
}

/**
 * FeaturedProducts widget data
 */
export interface FeaturedProductsData {
  heading?: string;
  subtitle?: string;
  viewAllLink?: string;
  viewAllText?: string;
  products?: FeaturedProduct[];
}

/**
 * FeaturedProducts widget settings
 */
export interface FeaturedProductsSettings {
  variant?: string;
  /** Section heading */
  heading?: string;
  /** Section subtitle */
  subtitle?: string;
  /** "View all" button text */
  viewAllText?: string;
  /** "View all" button link */
  viewAllLink?: string;
  /** Collection handle for the data source (e.g. "bestseller") */
  collectionHandle?: string;
  /** Max number of products to display */
  productLimit?: number;
  /** Prefix text before the save percentage badge, e.g. "Save " */
  savePrefix?: string;
}

/**
 * Props for the FeaturedProducts component
 */
export type FeaturedProductsProps = WidgetProps<
  FeaturedProductsData,
  FeaturedProductsSettings
>;

/**
 * Design tokens extracted from nintarababy.in Featured Products section
 */
export const DESIGN_TOKENS = {
  colors: {
    sectionBackground: "#e3edd4",
    cardBackground: "#ffffff",
    headingText: "#092a33",
    subtitleText: "#092a33",
    productTitleText: "#092a33",
    comparePriceText: "#092a33",
    comparePriceMobileText: "#889093",
    salePriceText: "#092a33",
    atcBtnBorder: "#01464f",
    atcBtnColor: "#01464f",
    viewAllBorder: "#01464f",
    viewAllColor: "#01464f",
    viewAllHoverColor: "#092a33",
    starColor: "#e5c645",
    reviewCountColor: "#092a33",
  },
  typography: {
    fontFamily: "Figtree, sans-serif",
  },
  layout: {
    containerMaxWidth: "1440px",
    containerPaddingX: "80px",
    gridGap: "25px",
    cardWidth: "301px",
  },
  borders: {
    atcBtnRadius: "63px",
    viewAllRadius: "41px",
  },
} as const;

/**
 * Image paths for product images in public/assets/nintarababy/products/
 */
export const IMAGE_PATHS = {
  butterBlossoms: "/assets/nintarababy/products/butter-blossoms-swaddle.webp",
  ergopodPillow:
    "/assets/nintarababy/products/ergopod-feeding-pillow-lucky-clover.webp",
  bootiesPink: "/assets/nintarababy/products/booties-pretty-pink.webp",
  nursingCover: "/assets/nintarababy/products/nursing-cover-classic-green.webp",
} as const;

/**
 * Cart icon SVG path data (inline in the component)
 */
export const ICON_PATHS = {
  cartIcon: "cart-icon",
  shareIcon: "share-icon",
} as const;

/**
 * Default product data matching the source site
 */
export const DEFAULT_PRODUCTS: FeaturedProduct[] = [
  {
    id: "nin_home_feat_opt_01",
    name: "Wake Me Not Swaddle\u2122 | Butter Blossoms",
    url: "/products/wake-me-not-swaddle-butter-blossoms",
    image: {
      src: IMAGE_PATHS.butterBlossoms,
      alt: "Wake Me Not Swaddle\u2122 | Butter Blossoms",
      width: 300,
      height: 300,
    },
    rating: { score: 4.69, reviewCount: 154 },
    price: { compareAt: "\u20b91,405", sale: "\u20b91,335", savePercent: "" },
    available: true,
  },
  {
    id: "nin_home_feat_opt_02",
    name: "Ergopod\u2122 Baby Feeding Pillow | Lucky Clover",
    url: "/products/ergopod-feeding-pillow-lucky-clover",
    image: {
      src: IMAGE_PATHS.ergopodPillow,
      alt: "Ergopod\u2122 Baby Feeding Pillow | Lucky Clover",
      width: 300,
      height: 300,
    },
    rating: { score: 4.69, reviewCount: 58 },
    price: { compareAt: "\u20b92,250", sale: "\u20b91,999", savePercent: "" },
    available: true,
  },
  {
    id: "nin_home_feat_opt_03",
    name: "Soft Cotton Baby Booties | Pretty Pink",
    url: "/products/soft-cotton-baby-booties-pretty-pink",
    image: {
      src: IMAGE_PATHS.bootiesPink,
      alt: "Soft Cotton Baby Booties | Pretty Pink",
      width: 300,
      height: 300,
    },
    rating: { score: 4.89, reviewCount: 19 },
    price: { compareAt: "\u20b9999", sale: "\u20b9949", savePercent: "" },
    available: true,
  },
  {
    id: "nin_home_feat_opt_04",
    name: "Muslin Nursing Cover | Classic Green",
    url: "/products/classic-green-muslin-nursing-cover-40-x-30",
    image: {
      src: IMAGE_PATHS.nursingCover,
      alt: "Muslin Nursing Cover | Classic Green",
      width: 300,
      height: 300,
    },
    rating: { score: 4.85, reviewCount: 13 },
    price: { compareAt: "\u20b91,199", sale: "\u20b91,139", savePercent: "" },
    available: true,
  },
];
