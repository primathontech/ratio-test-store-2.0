// Rendered via @/bootstrap/builder → createPageBuildingEngine (shopkit page builder).
import { TEMPLATE_TYPES } from "@/themes/bblunt-2/templates/.generated/types";
import { getCommerceClient } from "@/config/commerce";
import { getStaticLocale } from "@/bootstrap/i18n";
import { MetaTagGenerator, SEOFactory } from "@shopkit/seo";
import { getRouteTranslations, getThemeName } from "@/utils";
import { getPageBuilder } from "@/bootstrap/builder";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

export const revalidate = 30;
export const dynamicParams = true;

const seoSystem = SEOFactory.createForEnvironment(
  process.env.NODE_ENV as "development" | "staging" | "production"
);

export async function generateStaticParams() {
  const featuredCollections = process.env.FEATURED_COLLECTIONS;

  // Check environment variable
  if (!featuredCollections) {
    console.error("FEATURED_COLLECTIONS environment variable not found");
    return [];
  }

  // Split and clean handles
  const handles = featuredCollections
    .split(",")
    .filter(Boolean)
    .map((h) => h.trim());

  // Return each handle as { collectionname }
  const staticParams = handles.map((handle) => ({
    collectionname: handle,
  }));

  return staticParams;
}

export async function generateMetadata({
  params,
}: {
  params: { collectionname: string };
}): Promise<Metadata> {
  try {
    const collection = await fetchCollection(params.collectionname);
    const locale = getStaticLocale();

    if (!collection || !collection.data) {
      return {
        title: "Collection Not Found",
        description: "The requested collection could not be found.",
      };
    }

    const collectionData = collection.data;

    const baseSeoData = await seoSystem.generateSEOData({
      type: "collection",
      data: collectionData,
      path: `/collections/${params.collectionname}`,
      locale,
    });

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://bblunt.com/";
    const canonicalUrl = collectionData?.seo_handle
      ? `${baseUrl}/collections/${collectionData.seo_handle}`
      : baseSeoData.canonical;

    const seoData = {
      ...baseSeoData,
      title: collectionData?.seo_title || baseSeoData.title,
      description: collectionData?.seo_description || baseSeoData.description,
      canonical: canonicalUrl,
    };

    const metaTagGenerator = new MetaTagGenerator(seoSystem["config"]);
    return metaTagGenerator.generateNextJSMetadata(seoData);
  } catch (error) {
    console.error("Error generating metadata for collection:", error);
    return {
      title: "Collection | BBlunt",
      description: "Shop our amazing collections at BBlunt",
    };
  }
}

export default async function CollectionPage({
  params,
}: {
  params: { collectionname: string };
}) {
  try {
    const themeName = getThemeName();
    const locale = getStaticLocale();

    const routeContext = {
      templateName: TEMPLATE_TYPES.collection,
      path: `/collections/${params.collectionname}`,
      params: { handle: params.collectionname },
      query: {},
    };

    const [messages, collection] = await Promise.all([
      getRouteTranslations({
        themeName,
        routeContext,
        language: locale,
      }),
      fetchCollection(params.collectionname),
    ]);

    if (!collection) {
      notFound();
    }

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

    return <Suspense fallback={<></>}>{pageContent}</Suspense>;
  } catch (error) {
    console.error("Error rendering collection page:", error);
    notFound();
  }
}

/**
 * Fetch collection data using the commerce client
 */
async function fetchCollection(handle: string): Promise<any | null> {
  try {
    const commerceClient = getCommerceClient();

    const collection = await commerceClient.getCollection({
      handle,
    });

    return collection;
  } catch (error) {
    console.error(`Error fetching collection ${handle}:`, error);
    return null;
  }
}
