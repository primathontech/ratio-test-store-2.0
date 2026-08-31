import { createProductViaCollectionsStaticParams } from "@shopkit/data-layer";
import { TEMPLATE_TYPES } from "@/themes/ratio/templates/.generated/types";
import { getCommerceClient } from "@/config/commerce";
import { getStaticLocale } from "@/bootstrap/i18n";
import { getPageMetadata } from "@shopkit/seo";
import { getRouteTranslations, getThemeName } from "@/utils";
import { getResourceTemplateSuffix } from "@/utils/template-suffix";
import { getPageBuilder } from "@/bootstrap/builder";
import { AppProductTracker } from "@shopkit/app-shell";
import { KwikPassProductView } from "@/integrations/kwikpass-custom";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";

export const revalidate = 3600;
export const dynamicParams = true;

// Custom backend has no products-list endpoint — collection traversal is the only way to discover all handles.
export const generateStaticParams =
  createProductViaCollectionsStaticParams(getCommerceClient);

export async function generateMetadata(props: {
  params: Promise<{ handle: string }>;
}): Promise<Metadata> {
  try {
    const params = await props.params;
    const product = await fetchProduct(params.handle);
    return getPageMetadata({
      pageType: "product",
      path: `/products/${params.handle}`,
      data: product,
    });
  } catch {
    return {};
  }
}

export default async function ProductPage(props: {
  params: Promise<{ handle: string }>;
}) {
  const params = await props.params;
  const themeName = getThemeName();

  // Get locale, then fetch the product (needed to resolve the template variant).
  const locale = getStaticLocale();
  const product = await fetchProduct(params.handle);

  if (!product) {
    notFound();
  }

  const routeContext = {
    templateName: TEMPLATE_TYPES.products,
    path: `/products/${params.handle}`,
    params,
    query: {},
    // Page Templates: render the product's assigned template; falls back to
    // default when unassigned or the template is missing.
    templateSuffix: getResourceTemplateSuffix(product),
  };

  // Route translations: common + the resolved template's messages (consistent
  // with the home/collection pages). Depends on routeContext, so it runs after
  // the product is fetched.
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
