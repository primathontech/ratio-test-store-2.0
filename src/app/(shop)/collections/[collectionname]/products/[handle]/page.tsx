import { createCollectionProductStaticParams } from "@shopkit/data-layer";
import { TEMPLATE_TYPES } from "@/themes/ratio/templates/.generated/types";
import { getCommerceClient } from "@/config/commerce";
import { getStaticLocale } from "@/bootstrap/i18n";
import { getPageMetadata } from "@shopkit/seo";
import { getRouteTranslations, getThemeName } from "@/utils";
import { getPageBuilder } from "@/bootstrap/builder";
import { AppProductTracker } from "@shopkit/app-shell";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import { KwikPassProductView } from "@/integrations/kwikpass-custom";

export const revalidate = 3600;
export const dynamicParams = true;
export const generateStaticParams =
  createCollectionProductStaticParams(getCommerceClient);

export async function generateMetadata(props: {
  params: Promise<{ collectionname: string; handle: string }>;
}): Promise<Metadata> {
  try {
    const params = await props.params;
    const product = await fetchProduct(params.handle);
    return getPageMetadata({
      pageType: "product",
      path: `/collections/${params.collectionname}/products/${params.handle}`,
      data: product,
      canonicalPath: `/products/${params.handle}`,
    });
  } catch {
    return {};
  }
}

// Main page component
export default async function CollectionProductPage(props: {
  params: Promise<{ collectionname: string; handle: string }>;
}) {
  const params = await props.params;
  const collectionname = params.collectionname;
  const productHandle = params.handle;

  const themeName = getThemeName();
  const locale = getStaticLocale();
  const product = await fetchProduct(productHandle);

  if (!product) {
    notFound();
  }

  const routeContext = {
    templateName: TEMPLATE_TYPES.products,
    path: `/collections/${collectionname}/products/${productHandle}`,
    params,
    query: {},
  };

  const messages = await getRouteTranslations({
    themeName,
    routeContext,
    language: locale,
  });

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
      <KwikPassProductView product={product} />
    </>
  );
}

/**
 * Fetch product data using the commerce client
 * Cached to prevent duplicate API calls within the same request
 */
const fetchProduct = cache(async (handle: string): Promise<any | null> => {
  const commerceClient = getCommerceClient();

  const response = await commerceClient.getProduct({
    handle,
  });

  // Throw rather than 404: Next.js then keeps serving the last successfully
  // generated page and retries, instead of caching a 404 over it.
  if (!response.success) {
    throw new Error(
      `Failed to fetch product "${handle}": ${response.error?.message ?? response.message}`
    );
  }

  return response.data;
});
