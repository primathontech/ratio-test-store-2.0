import { ProductResponse, ProductVariant } from "../types";

/**
 * Maps raw search result product data to ProductResponse format
 * @param product - Raw product data from search results
 * @returns Mapped ProductResponse object
 */
export const mapSearchProductToProductResponse = (
  product: any
): ProductResponse => {
  const variantId =
    (product as any).variantId ??
    (product as any).variants?.[0]?.variantId ??
    product.variant?.id ??
    product.id.toString();

  const pricePaise =
    (product as any).variants?.[0]?.price ??
    (typeof product.price === "number" ? product.price : 0);

  const compareAtPaise =
    (product as any).variants?.[0]?.compareAtPrice ??
    (product as any).compareAtPrice ??
    null;

  const mainImage = (product as any).mainImage ?? (product as any).image ?? "";

  const imageUrlsRaw = (product as any).imageUrls;
  const imageUrls = Array.isArray(imageUrlsRaw)
    ? imageUrlsRaw
        .map((u: any) => (u != null ? String(u).trim() : ""))
        .filter((u: string) => u !== "")
    : [];

  const mappedProduct: ProductResponse = {
    id: product.id.toString(),
    title: product.title,
    handle: product.handle,
    status: "active",
    tags: [],
    productType: product.productType,
    price: typeof pricePaise === "number" ? pricePaise : 0,
    compare_at_price:
      compareAtPaise != null && compareAtPaise > 0 ? compareAtPaise : null,
    image_url: mainImage,
    images: [
      ...(mainImage
        ? [
            {
              url: mainImage,
              is_main: true,
              alt: product.title,
            },
          ]
        : []),
      ...(imageUrls.length > 0
        ? imageUrls.map((url: string) => ({
            url,
            is_main: false,
            alt: product.title,
          }))
        : []),
    ] as ProductResponse["images"],
    product_availability: product?.inStock ?? product?.isInStock ?? true,
    availableForSale:
      (product?.onSale && (product?.inStock ?? product?.isInStock)) ?? false,
    variant: {
      id: variantId,
      title: product.variant?.title ?? "Default Title",
      price: typeof pricePaise === "number" ? pricePaise : 0,
      compare_at_price:
        compareAtPaise != null && compareAtPaise > 0 ? compareAtPaise : 0,
      availableForSale:
        (product?.onSale && (product?.inStock ?? product?.isInStock)) ?? false,
      availableQuantity: product.variant?.availableQuantity ?? 10,
    } as ProductVariant,
    average_rating: product.rating?.toString?.() ?? "0",
    rating_count: product.reviewsCount?.toString?.() ?? "0",
    metadata: {},
  };

  return mappedProduct;
};

/**
 * Creates cart action handlers for a mapped product
 */
export const createProductCartHandlers = (
  mappedProduct: ProductResponse,
  handleAddToCart: (product: ProductResponse) => void,
  incrementQuantity: (product: ProductResponse) => void,
  decrementQuantity: (product: ProductResponse) => void
) => ({
  productAddToCart: () => handleAddToCart(mappedProduct),
  productIncrement: () => incrementQuantity(mappedProduct),
  productDecrement: () => decrementQuantity(mappedProduct),
});
