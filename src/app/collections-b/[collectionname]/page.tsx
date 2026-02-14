import { TEMPLATE_TYPES } from "@/themes/dawn/templates/.generated/types";
import { getCommerceClient } from "@/config/commerce";
import { getStaticLocale } from "@/bootstrap/i18n";
import { MetaTagGenerator, SEOFactory } from "@shopkit/seo";
import { getThemeName } from "@/utils";
import { getPageBuilder } from "@/bootstrap/builder";
import { Metadata } from "next";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { Suspense } from "react";

export const revalidate = 3600;
export const dynamicParams = true;

const seoSystem = SEOFactory.createForEnvironment(
  process.env.NODE_ENV as "development" | "staging" | "production",
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

    if (!collection) {
      return {
        title: "Collection Not Found | Wellevrsed",
        description: "The requested collection could not be found.",
        alternates: {
          canonical: `${
            process.env.NEXT_PUBLIC_BASE_URL || "https://wellversed.in"
          }/collections/${params.collectionname}`,
        },
      };
    }

    const seoTitle = `${collection.seo?.title || collection.title}`;
    const seoDescription = collection?.seo?.description;

    // Generate SEO data including structured data
    const locale = getStaticLocale();
    const seoData = await seoSystem.generateSEOData({
      type: "collection",
      data: collection,
      path: `/collections/${params.collectionname}`,
      locale,
    });

    const metaTagGenerator = new MetaTagGenerator(seoSystem["config"]);
    const metadata = metaTagGenerator.generateNextJSMetadata({
      title: seoTitle,
      description: seoDescription,
      type: "website" as "website",
      canonical: `${
        process.env.NEXT_PUBLIC_BASE_URL || "https://wellversed.in"
      }/collections/${params.collectionname}`,
      image: collection.image
        ? {
            id: `collection-${params.collectionname}`,
            url: collection.image.url,
            altText: collection.title,
            width: collection.image.width || 800,
            height: collection.image.height || 800,
          }
        : {
            id: "wellversed-default",
            url: "/images/logo/wellversed-logo.svg",
            altText: collection.title,
            width: 2048,
            height: 2048,
          },
    });

    // Add structured data to the head section to avoid Facebook Pixel conflicts
    if (seoData.structuredData && seoData.structuredData.length > 0) {
      const structuredDataScripts = seoData.structuredData.map(
        (schema, index) => ({
          type: "application/ld+json" as const,
          children: JSON.stringify(schema),
          key: `structured-data-${index}`,
        }),
      );

      return {
        ...metadata,
        other: {
          ...metadata.other,
          // Add structured data as script tags in head
          "script:type=application/ld+json": structuredDataScripts.map(
            (script) => script.children,
          ),
        },
      };
    }

    return metadata;
  } catch (error) {
    console.error("Error generating metadata for collection:", error);
    return {
      title: "Collection | Wellevrsed",
      description: "Shop our amazing collections at Wellevrsed",
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
    const messages = await getMessages();

    const collection = await fetchCollection(params.collectionname);

    if (!collection) {
      notFound();
    }

    const routeContext = {
      templateName: TEMPLATE_TYPES["collection-b"],
      path: `/collections-b/${params.collectionname}`,
      params: { handle: params.collectionname },
      query: {},
    };

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
