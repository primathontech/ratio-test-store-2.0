import { WidgetProps } from "@/widgets/types";

/**
 * LovedByParentsCarousel widget settings
 */
export interface LovedByParentsCarouselSettings {
  /** Widget variant @default "v1" */
  variant?: string;
  /** Section heading text (supports t: keys) */
  heading?: string;
  /** Product cards array (supports t: keys) */
  products?: LovedByParentsProduct[];
}

/**
 * A single product card in the carousel
 */
export interface LovedByParentsProduct {
  /** Unique ID */
  id: number;
  /** Product handle (URL slug) */
  handle: string;
  /** Product display title */
  title: string;
  /** Product image URL */
  image: string;
  /** Image alt text */
  imageAlt: string;
  /** Sale/current price (formatted with currency symbol) */
  salePrice: string;
  /** Original/compare-at price (formatted with currency symbol) */
  comparePrice: string;
  /** Star rating score (e.g. 4.69) */
  rating: number;
  /** Number of reviews */
  reviewCount: number;
  /** Savings badge text (e.g. "save 11%") */
  saveBadge?: string;
  /** Unit price text (e.g. "Unit Price: Rs. 1,999.00") */
  unitPrice?: string;
  /** Optional product badge */
  badge?: {
    type: "parents-choice" | "new-launch" | null;
    label: string;
  };
}

/**
 * LovedByParentsCarousel widget data
 */
export interface LovedByParentsCarouselData {
  /** Section heading */
  heading?: string;
  /** Array of product cards */
  products?: LovedByParentsProduct[];
}

/**
 * Combined props for the LovedByParentsCarousel widget
 */
export type LovedByParentsCarouselProps = WidgetProps<
  LovedByParentsCarouselData,
  LovedByParentsCarouselSettings
>;

/**
 * Default heading text
 */
export const DEFAULT_HEADING = "Loved by Parents";

/**
 * Default product data (from nintarababy.in recommendations API)
 */
export const DEFAULT_PRODUCTS: LovedByParentsProduct[] = [
  {
    id: 1,
    handle: "ergopod-feeding-pillow-purple-skies",
    title: "Ergopod\u2122 Baby Feeding Pillow | Purple Skies",
    image:
      "https://cdn.shopify.com/s/files/1/0902/0053/9442/files/1A_b4acc9b9-173c-459a-a96b-8e70944e9011.webp?v=1762234919",
    imageAlt: "Ergopod\u2122 Baby Feeding Pillow | Purple Skies",
    salePrice: "\u20B91,999",
    comparePrice: "\u20B92,250",
    rating: 4.69,
    reviewCount: 58,
    saveBadge: "save 11%",
    unitPrice: "Unit Price: Rs. 1,999.00",
  },
  {
    id: 2,
    handle: "organic-cotton-little-elephants-swaddle-wrap-47x47",
    title: "Muslin Baby Swaddle - Extra-Large | Little Elephants",
    image:
      "https://cdn.shopify.com/s/files/1/0902/0053/9442/files/image_1_76f224f9-7fe8-4d2f-a785-70f499bdd27d.webp?v=1763379380",
    imageAlt: "Muslin Baby Swaddle - Extra-Large | Little Elephants",
    salePrice: "\u20B9699",
    comparePrice: "\u20B9899",
    rating: 4.5,
    reviewCount: 24,
    saveBadge: "save 22%",
    unitPrice: "Unit Price: Rs. 699.00",
  },
  {
    id: 3,
    handle: "organic-cotton-soft-purple-swaddle-wrap-47x47",
    title: "Muslin Baby Swaddle - Extra-Large | Soft Purple",
    image:
      "https://cdn.shopify.com/s/files/1/0902/0053/9442/files/Swaddles__Pastel_Purple_3_29c40810-d12e-4e9f-a3b0-659939c89afe.webp?v=1740651802",
    imageAlt: "Muslin Baby Swaddle - Extra-Large | Soft Purple",
    salePrice: "\u20B9699",
    comparePrice: "\u20B9899",
    rating: 4.5,
    reviewCount: 18,
    saveBadge: "save 22%",
    unitPrice: "Unit Price: Rs. 699.00",
  },
  {
    id: 4,
    handle: "organic-cotton-purple-blossom-swaddle-wrap-47x47",
    title: "Muslin Baby Swaddle - Extra-Large | Purple Blossom",
    image:
      "https://cdn.shopify.com/s/files/1/0902/0053/9442/files/Swaddles__Blue_Flowers_11.webp?v=1742367356",
    imageAlt: "Muslin Baby Swaddle - Extra-Large | Purple Blossom",
    salePrice: "\u20B9699",
    comparePrice: "\u20B9899",
    rating: 4.5,
    reviewCount: 12,
    saveBadge: "save 22%",
    unitPrice: "Unit Price: Rs. 699.00",
  },
  {
    id: 5,
    handle: "organic-cotton-elephant-hugs-swaddle-wrap-47x47-set-of-4",
    title: "Muslin Baby Swaddle - Extra-Large - Set of 4 | Elephant Hugs",
    image:
      "https://cdn.shopify.com/s/files/1/0902/0053/9442/files/Elephant_Hugs.webp?v=1740719465",
    imageAlt: "Muslin Baby Swaddle - Extra-Large - Set of 4 | Elephant Hugs",
    salePrice: "\u20B92,124",
    comparePrice: "\u20B92,499",
    rating: 4.5,
    reviewCount: 8,
    saveBadge: "save 15%",
    unitPrice: "Unit Price: Rs. 531.00",
  },
  {
    id: 6,
    handle: "organic-cotton-purple-blossom-swaddle-wrap-39x39",
    title: "Muslin Baby Swaddle - Large | Purple Blossom",
    image:
      "https://cdn.shopify.com/s/files/1/0902/0053/9442/files/image_3_2d0d5395-c842-4b98-bcaf-6385fbca21f9.webp?v=1763379727",
    imageAlt: "Muslin Baby Swaddle - Large | Purple Blossom",
    salePrice: "\u20B9499",
    comparePrice: "\u20B9650",
    rating: 4.5,
    reviewCount: 15,
    saveBadge: "save 23%",
    unitPrice: "Unit Price: Rs. 499.00",
  },
  {
    id: 7,
    handle: "organic-cotton-elephant-hugs-swaddle-wrap-47x47-set-of-3",
    title: "Muslin Baby Swaddle - Extra-Large - Set of 3 | Elephant Hugs",
    image:
      "https://cdn.shopify.com/s/files/1/0902/0053/9442/files/pack_of_3_blue_f4715341-e015-4e99-9cca-3622138f7002.webp?v=1740657018",
    imageAlt: "Muslin Baby Swaddle - Extra-Large - Set of 3 | Elephant Hugs",
    salePrice: "\u20B91,699",
    comparePrice: "\u20B91,999",
    rating: 4.5,
    reviewCount: 10,
    saveBadge: "save 15%",
    unitPrice: "Unit Price: Rs. 566.33",
  },
];
