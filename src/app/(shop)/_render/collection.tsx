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
import { getArmSelection, templateKeyOf } from "@/bootstrap/ab";
import { ArmReport } from "@/bootstrap/ab/ArmReport";
import type { Arm } from "@shopkit/ab";
import { notFound } from "next/navigation";
import { Suspense, cache } from "react";

export const staticParams = createCollectionStaticParams(getCommerceClient);

export async function pageMetadata(props: {
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

/**
 * The collection page body, with an optional A/B arm.
 *
 * A NAMED export in `_render/`: Next allows only its own reserved exports on a
 * route file, and the `/variant/[arm]` mirror needs to call the same body with
 * an arm.
 */
export async function renderCollection(
  params: { collectionname: string },
  arm?: Arm
) {
  const themeName = getThemeName();
  const locale = getStaticLocale();
  const collection = await fetchCollection(params.collectionname);

  if (!collection) {
    notFound();
  }

  // This page's own logical path, not the rewritten "/variant/b" one.
  const ab = arm
    ? await getArmSelection(
        `/collections/${params.collectionname}`,
        arm,
        templateKeyOf(
          themeName,
          TEMPLATE_TYPES.collection,
          getResourceTemplateSuffix(collection)
        )
      )
    : undefined;

  const routeContext = {
    templateName: TEMPLATE_TYPES.collection,
    path: `/collections/${params.collectionname}`,
    params: { handle: params.collectionname },
    query: {},
    // Page Templates: render the collection's assigned template; falls back to
    // default when unassigned or the template is missing.
    templateSuffix: getResourceTemplateSuffix(collection),
    sectionVariants: ab?.selection,
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
    <>
      {/* OUTSIDE the Suspense on purpose: anything inside it is streamed with
          the content and lands near the end of a large document, long after
          analytics has already fired its first page_view. */}
      <ArmReport report={ab?.report} />
      <Suspense fallback={<></>}>
        {pageContent}
        <KwikPassCollectionView collection={collection} />
      </Suspense>
    </>
  );
}

/**
 * Fetch collection data using the commerce client
 */
const fetchCollection = cache(async (handle: string): Promise<any | null> => {
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
});
