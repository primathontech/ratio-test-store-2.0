// Rendered via @/bootstrap/builder → createPageBuildingEngine (shopkit page builder).
import { TEMPLATE_TYPES } from "@/themes/bblunt-2/templates/.generated/types";
import { getCommerceClient } from "@/config/commerce";
import { getStaticLocale } from "@/bootstrap/i18n";
import { resolveCommercePageSEO } from "@shopkit/seo";
import { getRouteTranslations, getThemeName } from "@/utils";
import { getPageBuilder } from "@/bootstrap/builder";
import { AppProductTracker } from "@shopkit/app-shell";
import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { cache } from "react";
import { ApiProduct } from "@/widgets/common/ProductDetail/types";

export const revalidate = 30;
export const dynamicParams = true;

const HIDDEN_PRODUCT_TAG = "hide__products";

function isProductHidden(product: ApiProduct | null | undefined): boolean {
  const tags = product?.tags
    ?.map((tag: any) => (typeof tag === "string" ? tag : tag?.name || ""))
    .filter((tag: string) => tag.length > 0);
  return Array.isArray(tags) && tags.includes(HIDDEN_PRODUCT_TAG);
}

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
  const collectionPromises = handles.map(async (handle) => {
    try {
      const collectionResponse = await commerceClient.getCollection({
        handle,
        productLimit: productsPerCollection,
      });

      // Check various possible response structures
      const collection = collectionResponse?.data || collectionResponse;
      const products =
        collection?.products || collection?.products?.edges || [];

      if (!products || products.length === 0) {
        console.warn(`No products found in collection '${handle}'`);
        return [];
      }

      // Handle both direct products array and Shopify edges format
      const productHandles = products.flatMap((product: any) => {
        const productNode = product?.node || product;
        return productNode?.handle ? [productNode.handle] : [];
      });

      return productHandles;
    } catch (err) {
      console.error(`Error fetching collection '${handle}':`, err);
      return [];
    }
  });

  // Wait for all collection requests to complete in parallel
  const collectionResults = await Promise.all(collectionPromises);

  // Flatten all product handles from all collections
  const allProductHandles = collectionResults.flat();

  // Remove duplicate product handles
  const uniqueProductHandles = Array.from(new Set(allProductHandles));

  // Return handles directly - the collection API already validated these products exist
  const allHandles = uniqueProductHandles.map((handle) => ({ handle }));

  return allHandles;
}

export async function generateMetadata(props: {
  params: Promise<{ handle: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const product = await fetchProduct(params.handle);
  return resolveCommercePageSEO(
    "product",
    product,
    `/products/${params.handle}`
  );
}

export default async function ProductPage(props: {
  params: Promise<{ handle: string }>;
}) {
  const params = await props.params;

  const product = await fetchProduct(params.handle);

  if (!product) {
    notFound();
  }

  if (isProductHidden(product as ApiProduct)) {
    redirect("/");
  }

  try {
    const themeName = getThemeName();
    const locale = getStaticLocale();

    const routeContext = {
      templateName: TEMPLATE_TYPES.products,
      path: `/products/${params.handle}`,
      params,
      query: {},
      fetchAPITemplate: true,
    };

    const messages = await getRouteTranslations({
      themeName,
      routeContext,
      language: locale,
    });

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
