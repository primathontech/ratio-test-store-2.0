"use client";

import React, { memo, useCallback, useMemo } from "react";
import { ProductCard } from "@/ui/components/ProductCard";
import {
  ProductCardTheme,
  type ProductCardProduct,
  type ProductCardSettings,
} from "@/ui/components/ProductCard/types";
import type { MappableApiProduct } from "./types";
import { toCardProduct } from "./toCardProduct";
import { toCartItem, cardToCartItem } from "./toCartItem";
import { useProductCardCart } from "./useProductCardCart";

export type { MappableApiProduct } from "./types";
export { toCardProduct } from "./toCardProduct";
export { toCartItem, cardToCartItem } from "./toCartItem";
export { useProductCardCart } from "./useProductCardCart";

interface CommonProps {
  /** Card color theme — defaults to LIGHT. */
  theme?: ProductCardTheme;
  /** ProductCard settings (toast, button text, className overrides…). */
  settings?: ProductCardSettings;
  /** Classes appended to the root card container. */
  className?: string;
  /** Optional label used to scope console errors from cart mutations. */
  logTag?: string;
  /** Show the category / product-type chip — defaults to true. */
  showProductType?: boolean;
  /** Show the net content / weight badge on the image — defaults to true. */
  showNetContent?: boolean;
  /** Show the subtitle / description line — defaults to true. */
  showSubtitle?: boolean;
  /** Render BOTH the tag-resolved badge and the metafield-resolved badge
   *  stacked on the image (e.g. Bestseller + 20% off). Defaults to false. */
  showDualBadges?: boolean;
}

/**
 * Two ways to pass the product:
 *   - `apiProduct`: raw API shape — wrapper maps + builds cart item via
 *     `toCartItem(api, card)`. Most widgets.
 *   - `cardProduct`: pre-mapped card shape — wrapper skips mapping and
 *     builds the cart item via `cardToCartItem(card)` (paisa = ₹×100).
 *     For widgets that already adapt before render (e.g. CollectionPage).
 */
type ApiProductForm = CommonProps & {
  apiProduct: MappableApiProduct;
  cardProduct?: never;
};

type CardProductForm = CommonProps & {
  apiProduct?: never;
  cardProduct: ProductCardProduct;
};

export type CartAwareProductCardProps = ApiProductForm | CardProductForm;

export const CartAwareProductCard = memo(function CartAwareProductCard(
  props: CartAwareProductCardProps
) {
  const {
    theme,
    settings,
    className,
    logTag,
    showProductType,
    showNetContent,
    showSubtitle,
    showDualBadges,
  } = props;

  // Resolve the card product — either map from API or use the pre-mapped one.
  const card = useMemo(
    () =>
      "apiProduct" in props && props.apiProduct
        ? toCardProduct(props.apiProduct)
        : (props as CardProductForm).cardProduct,
    [props]
  );

  // Cart-item factory binds to whichever input was supplied. Memoised so
  // the hook's handler dependencies stay stable.
  const apiProductRef = "apiProduct" in props ? props.apiProduct : undefined;
  const buildCartItem = useCallback(
    () =>
      apiProductRef ? toCartItem(apiProductRef, card) : cardToCartItem(card),
    [apiProductRef, card]
  );

  const cart = useProductCardCart(card, buildCartItem, logTag);

  return (
    <ProductCard
      product={card}
      theme={theme}
      className={className}
      settings={settings}
      showProductType={showProductType}
      showNetContent={showNetContent}
      showSubtitle={showSubtitle}
      showDualBadges={showDualBadges}
      onAddToCart={cart.handleAddToCart}
      onIncrement={cart.handleIncrement}
      onDecrement={cart.handleDecrement}
      isInCart={cart.isInCart}
      cartItem={cart.cartLine}
      isQuantityLoading={cart.isQuantityLoading}
    />
  );
});
