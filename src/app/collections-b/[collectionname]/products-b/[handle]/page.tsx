import { TEMPLATE_TYPES } from "@/themes/dawn/templates/.generated/types";
import { getCommerceClient } from "@/config/commerce";
import { getStaticLocale } from "@/bootstrap/i18n";
import { getPageMetadata } from "@shopkit/seo";
import { getThemeName, getRouteTranslations } from "@/utils";
import { createPageBuildingEngine } from "@/bootstrap/builder";
import { AppProductTracker } from "@shopkit/app-shell";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import { KwikPassProductView } from "@/integrations/kwikpass-custom";

// For featured collection products, use static generation
export const revalidate = 30;
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
          return collectionResponse.collection.products.flatMap(
            (product: any) =>
              product?.handle
                ? [{ collectionname, handle: product.handle }]
                : []
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
  return getPageMetadata({
    pageType: "product",
    path: `/collections-b/${params.collectionname}/products-b/${params.handle}`,
    data: product,
  });
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
    const routeContext = {
      templateName: TEMPLATE_TYPES["products-b"],
      path: `/collections-b/${collectionname}/products-b/${productHandle}`,
      params,
      query: {},
      fetchAPITemplate: true,
    };
    const [messages, product] = await Promise.all([
      getRouteTranslations({ themeName, routeContext, language: locale }),
      fetchProduct(productHandle),
    ]);

    if (!product) {
      notFound();
    }

    // Get the page builder with widget manifest
    const pageBuilder = createPageBuildingEngine();

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
        <KwikPassProductView product={product} />
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
