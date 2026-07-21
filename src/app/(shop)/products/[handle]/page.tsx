// Rendered via @/bootstrap/builder → createPageBuildingEngine (shopkit page builder).
import { TEMPLATE_TYPES } from "@/themes/ratio/templates/.generated/types";
import { getCommerceClient } from "@/config/commerce";
import { getStaticLocale } from "@/bootstrap/i18n";
import { getPageMetadata } from "@shopkit/seo";
import { getRouteTranslations, getThemeName } from "@/utils";
import { getPageBuilder } from "@/bootstrap/builder";
import { readEditorPreviewState } from "@shopkit/editor-bridge/server";
import type { PageConfig } from "@shopkit/builder";
import { AppProductTracker } from "@shopkit/app-shell";
import { KwikPassProductView } from "@/integrations/kwikpass-custom";
import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { cache } from "react";
import { ApiProduct } from "@/widgets/common/ProductDetail/types";
import { JsonLd, extractJsonLd, stripJsonLd } from "@/components/seo/JsonLd";
import { createProductViaCollectionsStaticParams } from "@shopkit/data-layer";

// ISR: prerender every product at build time, revalidate hourly, and still
// render (then cache) any handle not in the build set via on-demand ISR.
export const revalidate = 3600;
export const dynamicParams = true;

// Custom backend has no products-list endpoint — collection traversal is the
// only way to discover all handles (helper from @shopkit/data-layer).
export const generateStaticParams =
  createProductViaCollectionsStaticParams(getCommerceClient);

const HIDDEN_PRODUCT_TAG = "hide__products";

function isProductHidden(product: ApiProduct | null | undefined): boolean {
  const tags = product?.tags
    ?.map((tag: any) => (typeof tag === "string" ? tag : tag?.name || ""))
    .filter((tag: string) => tag.length > 0);
  return Array.isArray(tags) && tags.includes(HIDDEN_PRODUCT_TAG);
}

// Custom backend has no products-list endpoint — collection traversal is the only way to discover all handles.
// export const generateStaticParams =
//   createProductViaCollectionsStaticParams(getCommerceClient);

export async function generateMetadata(props: {
  params: Promise<{ handle: string }>;
}): Promise<Metadata> {
  try {
    const params = await props.params;
    const product = await fetchProduct(params.handle);
    // JSON-LD is rendered as a real <script> in the page body (see below), so
    // strip it from `other` to avoid the broken <meta> duplicate.
    return stripJsonLd(
      await getPageMetadata({
        pageType: "product",
        path: `/products/${params.handle}`,
        data: product,
      })
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

    // Real JSON-LD <script> from the same schema the SEO layer computes for the
    // metadata (product already fetched above, so this is pure CPU — no extra
    // network call).
    const jsonLd = extractJsonLd(
      await getPageMetadata({
        pageType: "product",
        path: `/products/${params.handle}`,
        data: product,
      })
    );

    return (
      <>
        <AppProductTracker product={product} />
        {pageContent}
        <JsonLd data={jsonLd} />
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
