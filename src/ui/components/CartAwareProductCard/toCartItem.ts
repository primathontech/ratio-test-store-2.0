import type { CartItem } from "@shopkit/cart";
import type { ProductCardProduct } from "@/ui/components/ProductCard/types";
import type { MappableApiProduct } from "./types";

/**
 * Build a `CartItem` payload from an API product + its already-mapped
 * card-product view. Used when the caller has the raw API product (price
 * in paisa, sku on variant, etc.) — the most accurate path.
 */
export function toCartItem(
  product: MappableApiProduct,
  cardProduct: ProductCardProduct
): CartItem {
  const variantId = product.variant?.id || product.variants?.[0]?.id;
  const productId = product.id;
  const lineId = variantId ?? productId;

  return {
    id: lineId,
    productId,
    variantId,
    sku: product.variant?.sku || product.variants?.[0]?.sku,
    title: product.title,
    price: { amount: product.price ?? 0, currencyCode: "INR" },
    compareAtPrice:
      typeof product.compare_at_price === "number"
        ? { amount: product.compare_at_price, currencyCode: "INR" }
        : undefined,
    quantity: 1,
    image: cardProduct.mainImage,
    product_type: product.productType || product.product_type,
  };
}

/**
 * Build a `CartItem` payload from a `ProductCardProduct` alone — for
 * callers that have already mapped to display-shape (e.g. CollectionPage,
 * which gets `TransformedProduct` from the collection client and adapts
 * to `ProductCardProduct` before render).
 *
 * Reverses the price normalisation: paisa = round(₹ × 100).
 */
export function cardToCartItem(cardProduct: ProductCardProduct): CartItem {
  const productId = cardProduct.productId ?? String(cardProduct.id ?? "");
  const variantId = cardProduct.variantId;
  const lineId = variantId ?? productId;

  return {
    id: lineId,
    productId,
    variantId,
    sku: cardProduct.sku,
    title: cardProduct.title,
    price: {
      amount: Math.round(cardProduct.salePrice * 100),
      currencyCode: "INR",
    },
    compareAtPrice:
      typeof cardProduct.originalPrice === "number"
        ? {
            amount: Math.round(cardProduct.originalPrice * 100),
            currencyCode: "INR",
          }
        : undefined,
    quantity: 1,
    image: cardProduct.mainImage,
    product_type: cardProduct.category,
  };
}
