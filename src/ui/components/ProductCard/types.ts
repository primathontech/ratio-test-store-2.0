/**
 * Shared Product Card types — used by PeopleAlsoBought, CollectionPage,
 * Search, and any future widget that renders product cards in the BBlunt
 * design language.
 */

/** A single product for the shared ProductCard component */
export interface ProductCardProduct {
  /** Stable identifier — used as React key in cart/quantity helpers */
  id?: string | number;
  /** Product identifier — used for cart add/lookup */
  productId?: string;
  /** Variant identifier — used for cart add/lookup */
  variantId?: string;
  /** Variant SKU — forwarded to the cart payload for add-to-cart analytics */
  sku?: string;
  /** Whether the product is purchasable. When false, the action button shows the sold-out state. */
  availableForSale?: boolean;
  /** Product page URL */
  href: string;
  /** Product title */
  title: string;
  /** Image alt text */
  alt: string;
  /** Main product image URL */
  mainImage: string;
  /** Hover product image URL (for cross-fade) */
  hoverImage: string;
  /** Category chip label (e.g. "Shampoo", "Combos") */
  category: string;
  /** Badge text (e.g. "Get3@₹799", "Bestseller") */
  badge?: string;
  /** Badge style variant: "trending" = green, "new"/"bestseller" = red, "deal" = magenta */
  badgeVariant?: "trending" | "new" | "bestseller" | "deal";
  /**
   * Direct badge background color. Takes precedence over `badgeVariant`.
   * Set by transform layers using `getProductLabel(...)` from
   * `./badgeUtils` so the color matches the resolved label
   * (metafield default = #82c341, tag map = per-entry color).
   */
  badgeBackground?: string;
  /**
   * Tag-only resolved badge (from product tags, ignoring metafields).
   * Populated by `toCardProduct` so the card can render two badges when
   * `showDualBadges` is enabled. Stays undefined when no tag matches.
   */
  tagBadge?: { label: string; background: string };
  /**
   * Metafield-only resolved badge (from `metadata.product_labels.value`,
   * ignoring tags). Counterpart to `tagBadge` — together they drive the
   * dual-badge render path used by search NoResult cards.
   */
  metaBadge?: { label: string; background: string };
  /** Star rating (e.g. 4.85) */
  rating: number;
  /** Number of reviews */
  reviewCount: number;
  /** Current sale price (number) */
  salePrice: number;
  /** Original price before discount (number, optional) */
  originalPrice?: number;
  /** Discount percentage text (e.g. "20% off") */
  discount?: string;
  /** Weight / size label (e.g. "300ml", "Pack of 2") */
  weight?: string;
  /** Short description text */
  description?: string;
}

/** Cart-line shape that the QuantityPill reads `quantity` from. Kept loose
 * so any concrete cart item (e.g. shopkit `CartItem`) is structurally
 * assignable without forcing an index signature on the source type. */
export type ProductCardCartItem = {
  quantity?: number;
};

/** Card color theme */
export enum ProductCardTheme {
  LIGHT = "light",
  DARK = "dark",
}

/** Optional className overrides + visibility toggles for the ProductCard */
export interface ProductCardSettings {
  /** Show the promo badge — defaults to true */
  showBadge?: boolean;
  /** Show the star rating row — defaults to true */
  showRating?: boolean;
  /** Show the Add to cart button — defaults to true */
  showActionButton?: boolean;
  /** When in cart, show the +/- quantity pill instead of the action button — defaults to true */
  showQuantitySelector?: boolean;
  /** Show a "Item added to your cart" toast when an Add-to-cart click successfully updates the cart — defaults to false */
  showAddToCartToast?: boolean;
  /** Toast title — defaults to "Item added to your cart" */
  addToCartToastTitle?: string;
  /** Action button text — defaults to "Add to cart" */
  actionButtonText?: string;
  /** Sold-out fallback text — defaults to "Sold Out" */
  soldOutText?: string;
  /** Override card background color (overrides theme) */
  backgroundColor?: string;
  /** Override primary text color (overrides theme) */
  color?: string;
  /** Override action button text color */
  actionButtonTextColor?: string;
  /** Layout flag for "recommended product" usage; accepted for parity */
  isRecommendedProduct?: boolean;
  /** Layout flag for "search results" usage — drops the `h-full` of the link wrapper so the action button sits at the natural bottom of the card */
  searchProductCard?: boolean;
  /** Classes appended to the wrapping product Link */
  linkClassName?: string;
  /** Classes appended to the image area Link */
  imageClassName?: string;
  /** Classes appended to the main + hover product <Image> elements */
  productImageClassName?: string;
  /** Classes appended to the info/details container */
  detailsClassName?: string;
  /** Classes appended to the title Link */
  titleClassName?: string;
  /** Classes appended to the rating wrapper */
  ratingClassName?: string;
  /** Classes appended to the rating value (e.g. "4.8") span */
  ratingValueClassName?: string;
  /** Classes appended to the review count (e.g. "| 12 reviews") span */
  reviewCountClassName?: string;
  /** Classes appended to the category chip */
  categoryChipClassName?: string;
  /** Classes appended to the price row */
  priceSectionClassName?: string;
  /** Classes appended to the sale price text */
  salePriceClassName?: string;
  /** Classes appended to the original (compare-at) price */
  compareAtPriceClassName?: string;
  /** Classes appended to the discount label */
  discountClassName?: string;
  /** Classes appended to the Add to cart button */
  actionButtonClassName?: string;
  /**
   * Classes appended to the SECOND badge when `showDualBadges` is on.
   * Used to nudge the secondary pill (e.g. small `mt-1` spacing) so the
   * two badges read as a stack rather than two overlapping shapes.
   */
  secondaryBadgeClassName?: string;
}

/** Props for the ProductCard component */
export interface ProductCardProps {
  product: ProductCardProduct;
  /** Card color theme — defaults to LIGHT */
  theme?: ProductCardTheme;
  /** Classes appended to the root card container */
  className?: string;
  /** Per-element className overrides */
  settings?: ProductCardSettings;
  /** Show the category / product-type chip — defaults to true */
  showProductType?: boolean;
  /** Show the net content / weight badge on the image — defaults to true */
  showNetContent?: boolean;
  /** Show the subtitle / description line — defaults to true */
  showSubtitle?: boolean;
  /**
   * When true, render BOTH the tag-resolved badge and the metafield-resolved
   * badge stacked on the image (e.g. "Bestseller" + "20% off"). Falls back
   * to the single-badge render path when only one of the two resolves, or
   * to nothing when neither does. Defaults to false (single-badge mode).
   */
  showDualBadges?: boolean;

  /* ─── Cart wiring (all optional — opt-in per consumer) ─────────────── */

  /** Click handler for the Add to cart button. When omitted, the button is purely visual. */
  onAddToCart?: () => void | Promise<void>;
  /** Click handler for the + button on the in-cart quantity pill. */
  onIncrement?: () => void;
  /** Click handler for the − button on the in-cart quantity pill. */
  onDecrement?: () => void;
  /** Whether the product is already in the user's cart. When true, the action button is replaced by a +/- pill. */
  isInCart?: boolean;
  /** Cart line for this product. The pill reads `cartItem.quantity` from it. */
  cartItem?: ProductCardCartItem;
  /** Disables the action button + pill, shows a "…" placeholder. */
  isQuantityLoading?: boolean;
  /** When true, renders a sold-out overlay + locks the action button to soldOutText. Falls back to deriving from `product.salePrice <= 0` when undefined. */
  isSoldOut?: boolean;
}
