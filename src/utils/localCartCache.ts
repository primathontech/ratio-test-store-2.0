/**
 * Local cart cache for ResilientCartService offline fallback.
 * Widgets populate metadata before addItem() so local mode has item details.
 */

interface LocalCartItem {
  id: string;
  productId: string;
  variantId: string;
  title: string;
  price: { amount: number; currencyCode: string };
  image?: string;
  quantity: number;
}

const itemMetadata = new Map<string, Omit<LocalCartItem, "quantity">>();
const cartItemsMap = new Map<string, LocalCartItem[]>();

export function cacheLocalCartItem(
  variantId: string,
  meta: {
    productId: string;
    title: string;
    price: { amount: number; currencyCode: string };
    image?: string;
  }
): void {
  itemMetadata.set(variantId, {
    id: variantId,
    productId: meta.productId,
    variantId,
    title: meta.title,
    price: meta.price,
    image: meta.image,
  });
}

export function addLocalCartItem(
  cartId: string,
  variantId: string,
  quantity: number
): void {
  const items = cartItemsMap.get(cartId) || [];
  const existing = items.find((i) => i.variantId === variantId);
  if (existing) {
    existing.quantity += quantity;
  } else {
    const meta = itemMetadata.get(variantId);
    items.push({
      id: variantId,
      productId: meta?.productId || variantId,
      variantId,
      title: meta?.title || "",
      price: meta?.price || { amount: 0, currencyCode: "INR" },
      image: meta?.image,
      quantity,
    });
  }
  cartItemsMap.set(cartId, items);
}

export function getLocalCartItems(cartId: string): LocalCartItem[] {
  return cartItemsMap.get(cartId) || [];
}

export function removeLocalCartItem(cartId: string, variantId: string): void {
  const items = cartItemsMap.get(cartId) || [];
  cartItemsMap.set(
    cartId,
    items.filter((i) => i.variantId !== variantId)
  );
}

export function updateLocalCart(
  cartId: string,
  updates: Array<{ variantId: string; quantity: number }>
): void {
  const items = cartItemsMap.get(cartId) || [];
  for (const update of updates) {
    const item = items.find((i) => i.variantId === update.variantId);
    if (item) {
      item.quantity = update.quantity;
    }
  }
  cartItemsMap.set(cartId, items);
}
