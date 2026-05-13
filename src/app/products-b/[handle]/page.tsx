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

export const revalidate = 3600;
export const dynamicParams = true;

export async function generateStaticParams() {
  const homepageFeaturedCollections = process.env.HOMEPAGE_FEATURED_COLLECTIONS;
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

  // Get all product handles from collections in parallel
  const commerceClient = getCommerceClient();

  const collectionPromises = handles.map((handle) =>
    commerceClient
      .getCollection({
        handle,
        first: productsPerCollection,
      })
      .then((collectionResponse: any) => {
        if (collectionResponse?.products) {
          return collectionResponse.products.flatMap((product: any) =>
            product?.handle ? [product.handle] : []
          );
        }
        return [];
      })
      .catch((err: any) => {
        console.warn(`Collection handle '${handle}' not found, skipping`);
        return [];
      })
  );

  // Wait for all collection requests to complete in parallel
  const collectionResults = await Promise.all(collectionPromises);

  // Flatten all product handles from all collections
  const allProductHandles = collectionResults.flat();

  // Remove duplicate product handles
  const uniqueProductHandles = Array.from(new Set(allProductHandles));

  // Return handles directly - the collection API already validated these products exist
  // Additional validation here would cause excessive API calls during build time
  const allHandles = uniqueProductHandles.map((handle) => ({ handle }));

  return allHandles;
}

export async function generateMetadata({
  params,
}: {
  params: { handle: string };
}): Promise<Metadata> {
  const product = await fetchProduct(params.handle);
  return await resolveCommercePageSEO(
    "product",
    product,
    `/products/${params.handle}`
  );
}

export default async function ProductPage({
  params,
}: {
  params: { handle: string };
}) {
  try {
    const themeName = getThemeName();

    // Get locale first, then run other operations in parallel
    const locale = getStaticLocale();
    const [messages, product] = await Promise.all([
      loadMessages(locale as "en", "products"),
      fetchProduct(params.handle),
    ]);

    if (!product) {
      notFound();
    }

    const routeContext = {
      templateName: TEMPLATE_TYPES["products-b"],
      path: `/products/${params.handle}`,
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
