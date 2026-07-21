// Rendered via @/bootstrap/builder → createPageBuildingEngine (shopkit page builder).
import { TEMPLATE_TYPES } from "@/themes/ratio/templates/.generated/types";
import { getCommerceClient } from "@/config/commerce";
import { getStaticLocale, loadMessages } from "@/bootstrap/i18n";
import { getPageMetadata } from "@shopkit/seo";
import { getThemeName } from "@/utils";
import { getPageBuilder } from "@/bootstrap/builder";
import { readEditorPreviewState } from "@shopkit/editor-bridge/server";
import type { PageConfig } from "@shopkit/builder";
import { AppProductTracker } from "@shopkit/app-shell";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import { KwikPassProductView } from "@/integrations/kwikpass-custom";
import { createCollectionProductStaticParams } from "@shopkit/data-layer";

// ISR: prerender collection×product pairs at build time, revalidate hourly, and
// still render (then cache) any pair not in the build set via on-demand ISR.
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
  searchParams: Promise<{ editor?: string; previewKey?: string }>;
}) {
  const params = await props.params;
  const { isEditor, pageConfig: previewPageConfig } =
    await readEditorPreviewState<PageConfig>(props.searchParams);
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
