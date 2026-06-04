// Rendered via @/bootstrap/builder → createPageBuildingEngine (shopkit page builder).
import { TEMPLATE_TYPES } from "@/themes/bblunt-2/templates/.generated/types";
import { getCommerceClient } from "@/config/commerce";
import { getStaticLocale } from "@/bootstrap/i18n";
import { resolveCommercePageSEO } from "@shopkit/seo";
import { getRouteTranslations, getThemeName } from "@/utils";
import { getPageBuilder } from "@/bootstrap/builder";
import { AppProductTracker } from "@shopkit/app-shell";
import { KwikPassProductView } from "@/integrations/kwikpass-custom";
import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { cache } from "react";
import { ApiProduct } from "@/widgets/common/ProductDetail/types";

// export const revalidate = 30;
// export const dynamicParams = true;

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
    return resolveCommercePageSEO(
      "product",
      product,
      `/products/${params.handle}`
    );
  } catch {
    return {};
  }
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
