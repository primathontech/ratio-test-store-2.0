// Rendered via @/bootstrap/builder → createPageBuildingEngine (shopkit page builder).
import { TEMPLATE_TYPES } from "@/themes/bblunt-2/templates/.generated/types";
import { getCommerceClient } from "@/config/commerce";
import { getStaticLocale, loadMessages } from "@/bootstrap/i18n";
import { resolveCommercePageSEO } from "@shopkit/seo";
import { getThemeName } from "@/utils";
import { getPageBuilder } from "@/bootstrap/builder";
import { AppProductTracker } from "@shopkit/app-shell";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";

// For featured collection products, use static generation
export const revalidate = 3600;
export const dynamicParams = true;

export async function generateStaticParams() {
  const homepageFeaturedCollections = process.env.FEATURED_COLLECTIONS;
  const productsPerCollection = parseInt(
    process.env.HOMEPAGE_FEATURED_COLLECTIONS_PRODUCT_LIMIT || "8"
  );

  if (!homepageFeaturedCollections) {
    console.error(
      "HOMEPAGE_FEATURED_COLLECTIONS environment variable not found"
    );
    return [];
  }

  const handles = homepageFeaturedCollections
    .split(",")
    .filter(Boolean)
    .map((h) => h.trim());

  const commerceClient = getCommerceClient();

  // Get all collection-product pairs in parallel
  const collectionPromises = handles.map((collectionname) =>
    commerceClient
      .getCollection({
        handle: collectionname,
        first: productsPerCollection,
      })
      .then((collectionResponse: any) => {
        if (collectionResponse?.products) {
          return collectionResponse.products.flatMap((product: any) =>
            product?.handle ? [{ collectionname, handle: product.handle }] : []
          );
        }
        return [];
      })
      .catch((err: any) => {
        console.warn(
          `Collection handle '${collectionname}' not found, skipping`
        );
        return [];
      })
  );

  // Wait for all collection requests to complete in parallel
  const collectionResults = await Promise.all(collectionPromises);

  // Flatten all collection-product pairs
  const collectionProductPairs = collectionResults.flat();

  // Remove duplicate products (based on handle but keeping first found collection)
  const uniquePairs = Array.from(
    new Map(collectionProductPairs.map((item) => [item.handle, item])).values()
  );

  // Return pairs directly - the collection API already validated these products exist
  // Additional validation here would cause excessive API calls during build time
  return uniquePairs;
}

export async function generateMetadata({
  params,
}: {
  params: { collectionname: string; handle: string };
}): Promise<Metadata> {
  const product = await fetchProduct(params.handle);
  return await resolveCommercePageSEO(
    "product",
    product,
    `/products/${params.handle}`
  );
}

// Main page component
export default async function CollectionProductPage({
  params,
}: {
  params: { collectionname: string; handle: string };
}) {
  try {
    const collectionname = params.collectionname;
    const productHandle = params.handle;

    const themeName = getThemeName();
    const locale = getStaticLocale();
    const [messages, product] = await Promise.all([
      loadMessages(locale as "en", "products"),
      fetchProduct(productHandle),
    ]);

    if (!product) {
      notFound();
    }

    const routeContext = {
      templateName: TEMPLATE_TYPES.products,
      path: `/collections/${collectionname}/products/${productHandle}`,
      params,
      query: {},
    };

    // Get the page builder with widget manifest
    const pageBuilder = getPageBuilder();

    // Note: The builder uses "merchantName" internally for loading themes/templates
    // from @/themes/{name}/templates/, so we pass themeName here
    const pageContent = await pageBuilder.renderPage({
      merchantName: themeName,
      routeContext,
      locale,
      messages,
    });

    return (
      <>
        <AppProductTracker product={product} />
        {pageContent}
      </>
    );
  } catch (error) {
    console.error("Error rendering product page:", error);
    notFound();
  }
}

/**
 * Fetch product data using the commerce client
 * Cached to prevent duplicate API calls within the same request
 */
const fetchProduct = cache(async (handle: string): Promise<any | null> => {
  try {
    const commerceClient = getCommerceClient();

    const response = await commerceClient.getProduct({
      handle,
    });

    return response.data;
  } catch (error) {
    console.error(`Error fetching product ${handle}:`, error);
    return null;
  }
});
