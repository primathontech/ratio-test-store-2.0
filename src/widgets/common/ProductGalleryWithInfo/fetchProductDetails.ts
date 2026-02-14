import { getCommerceClient } from "@/config/commerce";

export type ProductTag = {
  id: string;
  name: string;
};

export type ProductDetails = {
  id: string;
  handle: string;
  title: string;
  tags: ProductTag[];
  price: number;
  compareAtPrice?: number;
  [key: string]: any;
};

export type ProductHandleItem = {
  handle: string;
};

export const fetchProductDetails = async (
  productHandles: string[] | ProductHandleItem[],
): Promise<PromiseSettledResult<ProductDetails>[]> => {
  if (!Array.isArray(productHandles)) {
    throw new Error("productHandles must be an array");
  }

  if (productHandles.length === 0) {
    return [];
  }

  const commerceClient = getCommerceClient();

  const handles: string[] = productHandles.map((item) =>
    typeof item === "string" ? item : item.handle,
  );

  const requests = handles.map((handle) => {
    return commerceClient
      .getProduct({ handle })
      .then((response) => {
        const data = response.data ?? response;
        return data as ProductDetails;
      })
      .catch((error) => {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error occurred";
        throw new Error(
          `Failed to fetch product details for handle "${handle}": ${errorMessage}`,
        );
      });
  });

  const results = await Promise.allSettled(requests);
  return results;
};
