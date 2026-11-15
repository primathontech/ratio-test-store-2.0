import { createCollectionProductStaticParams } from "@shopkit/data-layer";
import { TEMPLATE_TYPES } from "@/themes/dawn/templates/.generated/types";
import { getCommerceClient } from "@/config/commerce";
import { getStaticLocale } from "@/bootstrap/i18n";
import { getPageMetadata } from "@shopkit/seo";
import { getRouteTranslations, getThemeName } from "@/utils";
import { getResourceTemplateSuffix } from "@/utils/template-suffix";
import { getPageBuilder } from "@/bootstrap/builder";
import { AppProductTracker } from "@shopkit/app-shell";
import { Metadata } from "next";
import { getArmSelection, templateKeyOf } from "@/bootstrap/ab";
import { ArmReport } from "@/bootstrap/ab/ArmReport";
import type { Arm } from "@shopkit/ab";
import { notFound } from "next/navigation";
import { cache } from "react";
import { KwikPassProductView } from "@/integrations/kwikpass-custom";

export const staticParams =
  createCollectionProductStaticParams(getCommerceClient);

export async function pageMetadata(props: {
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

/**
 * The nested product page body, with an optional A/B arm.
 *
 * A product is reachable at TWO paths — `/products/x` and
 * `/collections/y/products/x` — and both must honour an experiment, or a test
 * works when a shopper arrives from search and silently does not when they
 * arrive from a collection. Same product, same template, different result.
 *
 * A NAMED export: Next validates a page's default export against `PageProps`
 * and rejects any extra prop, so `arm` cannot travel that way.
 */
export async function renderCollectionProduct(
  params: { collectionname: string; handle: string },
  arm?: Arm
) {
  const collectionname = params.collectionname;
  const productHandle = params.handle;

  const themeName = getThemeName();
  const locale = getStaticLocale();
  const product = await fetchProduct(productHandle);

  if (!product) {
    notFound();
  }

  // This page's own logical path, not the rewritten "/variant/b" one.
  //
  // The suffix is passed here AND to the engine below, and the two must never
  // diverge: the A/B key has to describe the template that actually rendered,
  // not the one the product is assigned. Name `products_default` here while the
  // engine renders `products_pdp-2` and an experiment on the wrong template
  // applies — or the right one silently does not.
  const templateSuffix = getResourceTemplateSuffix(product);

  const ab = arm
    ? await getArmSelection(
        `/collections/${collectionname}/products/${productHandle}`,
        arm,
        templateKeyOf(themeName, TEMPLATE_TYPES.products, templateSuffix)
      )
    : undefined;

  const routeContext = {
    templateName: TEMPLATE_TYPES.products,
    path: `/collections/${collectionname}/products/${productHandle}`,
    params,
    query: {},
    // Page Templates: render the product's assigned template; falls back to
    // default when unassigned or the template is missing. Matches the sibling
    // /products/[handle] route, so one product cannot render two different
    // pages depending on which path a shopper reached it by.
    templateSuffix,
    sectionVariants: ab?.selection,
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
      <ArmReport report={ab?.report} />
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
