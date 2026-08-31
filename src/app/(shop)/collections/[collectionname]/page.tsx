import { createCollectionStaticParams } from "@shopkit/data-layer";
import { TEMPLATE_TYPES } from "@/themes/ratio/templates/.generated/types";
import { getCommerceClient } from "@/config/commerce";
import { getStaticLocale } from "@/bootstrap/i18n";
import { getPageMetadata } from "@shopkit/seo";
import { getRouteTranslations, getThemeName } from "@/utils";
import { getResourceTemplateSuffix } from "@/utils/template-suffix";
import { getPageBuilder } from "@/bootstrap/builder";
import { KwikPassCollectionView } from "@/integrations/kwikpass-custom";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

export const revalidate = 3600;
export const dynamicParams = true;
export const generateStaticParams =
  createCollectionStaticParams(getCommerceClient);

export async function generateMetadata(props: {
  params: Promise<{ collectionname: string }>;
}): Promise<Metadata> {
  try {
    const params = await props.params;
    const collection = await fetchCollection(params.collectionname);
    return getPageMetadata({
      pageType: "collection",
      path: `/collections/${params.collectionname}`,
      data: collection,
    });
  } catch {
    return {};
  }
}

export default async function CollectionPage(props: {
  params: Promise<{ collectionname: string }>;
}) {
  const params = await props.params;
  const themeName = getThemeName();
  const locale = getStaticLocale();
  const collection = await fetchCollection(params.collectionname);

  if (!collection) {
    notFound();
  }

  const routeContext = {
    templateName: TEMPLATE_TYPES.collection,
    path: `/collections/${params.collectionname}`,
    params: { handle: params.collectionname },
    query: {},
    // Page Templates: render the collection's assigned template; falls back to
    // default when unassigned or the template is missing.
    templateSuffix: getResourceTemplateSuffix(collection),
  };

  // Route translations: common + the resolved template's messages (consistent
  // with the home/product pages). Depends on routeContext, so it runs after the
  // collection is fetched.
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
    <Suspense fallback={<></>}>
      {pageContent}
      <KwikPassCollectionView collection={collection} />
    </Suspense>
  );
}

/**
 * Fetch collection data using the commerce client
 */
async function fetchCollection(handle: string): Promise<any | null> {
  const commerceClient = getCommerceClient();

  const collection = await commerceClient.getCollection({
    handle,
  });

  // Throw rather than 404: Next.js then keeps serving the last successfully
  // generated page and retries, instead of caching a 404 over it.
  if (!collection.success) {
    throw new Error(
      `Failed to fetch collection "${handle}": ${collection.error?.message ?? collection.message}`
    );
  }

  return collection.data;
}
