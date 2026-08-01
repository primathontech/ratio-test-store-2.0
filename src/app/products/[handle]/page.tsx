import { TEMPLATE_TYPES } from "@/themes/dawn/templates/.generated/types";
import { getCommerceClient } from "@/config/commerce";
import { getStaticLocale } from "@/bootstrap/i18n";
import { getPageMetadata } from "@shopkit/seo";
import { getThemeName, getRouteTranslations } from "@/utils";
import { getResourceTemplateSuffix } from "@/utils/template-suffix";
import { createPageBuildingEngine } from "@/bootstrap/builder";
import { readEditorPreviewState } from "@shopkit/editor-bridge/server";
import type { PageConfig } from "@shopkit/builder";
import { AppProductTracker } from "@shopkit/app-shell";
import { KwikPassProductView } from "@/integrations/kwikpass-custom";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";

export const revalidate = 30;
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
  return getPageMetadata({
    pageType: "product",
    path: `/products/${params.handle}`,
    data: product,
  });
}

export default async function ProductPage({
  params,
  searchParams,
}: {
  params: { handle: string };
  searchParams?: { editor?: string; previewKey?: string };
}) {
  try {
    const { isEditor, pageConfig: previewPageConfig } =
      await readEditorPreviewState<PageConfig>(
        Promise.resolve(searchParams ?? {})
      );

    const themeName = getThemeName();

    // Get locale first, then run other operations in parallel
    const locale = getStaticLocale();

    // Fetch the product FIRST so its assigned template suffix is known before
    // resolving translations — otherwise getRouteTranslations can't pick the
    // template's own translation JSON. fetchProduct is React-cached, so this
    // doesn't add a network round-trip. The suffix goes into routeContext once,
    // and both the translation resolve and renderPage use the same context.
    const product = await fetchProduct(params.handle);

    const routeContext = {
      templateName: TEMPLATE_TYPES.products,
      path: `/products/${params.handle}`,
      params,
      query: {},
      fetchAPITemplate: true,
      // Page Templates: render the product's assigned template; falls back to
      // default when unassigned or the template is missing.
      templateSuffix: getResourceTemplateSuffix(product),
    };

    const messages = await getRouteTranslations({
      themeName,
      routeContext,
      language: locale,
    });

    // Get the page builder with widget manifest
    const pageBuilder = createPageBuildingEngine({ isEditor });
    // Clear @shopkit/builder's internal template cache so API changes are picked up on every request
    pageBuilder.clearCache();

    // Note: The builder uses "merchantName" internally for loading themes/templates
    // from @/themes/{name}/templates/, so we pass themeName here
    const pageContent = await pageBuilder.renderPage({
      merchantName: themeName,
      routeContext,
      locale,
      messages,
      pageConfig: previewPageConfig,
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
