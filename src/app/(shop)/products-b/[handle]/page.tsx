// Rendered via @/bootstrap/builder → createPageBuildingEngine (shopkit page builder).
import { TEMPLATE_TYPES } from "@/themes/bblunt-2/templates/.generated/types";
import { getCommerceClient } from "@/config/commerce";
import { getStaticLocale, loadMessages } from "@/bootstrap/i18n";
import { resolveCommercePageSEO } from "@shopkit/seo";
import { getThemeName } from "@/utils";
import { getPageBuilder } from "@/bootstrap/builder";
import { readEditorPreviewState } from "@shopkit/editor-bridge/server";
import type { PageConfig } from "@shopkit/builder";
import { AppProductTracker } from "@shopkit/app-shell";
import { KwikPassProductView } from "@/integrations/kwikpass-custom";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";

// export const revalidate = 30;
// export const dynamicParams = true;

// TODO: generateStaticParams has been enabled for this route to support static generation when needed.
// export const generateStaticParams =
//   createProductViaCollectionsStaticParams(getCommerceClient);

export async function generateMetadata(props: {
  params: Promise<{ handle: string }>;
}): Promise<Metadata> {
  try {
    const params = await props.params;
    const product = await fetchProduct(params.handle);
    return resolveCommercePageSEO(
      "product",
      product,
      `/products-b/${params.handle}`
    );
  } catch {
    return {};
  }
}

export default async function ProductPage(props: {
  params: Promise<{ handle: string }>;
  searchParams: Promise<{ editor?: string; previewKey?: string }>;
}) {
  const params = await props.params;
  const { isEditor, pageConfig: previewPageConfig } =
    await readEditorPreviewState<PageConfig>(props.searchParams);
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
    const pageBuilder = getPageBuilder({ isEditor });

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
