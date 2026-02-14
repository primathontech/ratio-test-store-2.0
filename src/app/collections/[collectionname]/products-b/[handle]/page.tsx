import { TEMPLATE_TYPES } from "@/themes/dawn/templates/.generated/types";
import { getCommerceClient } from "@/config/commerce";
import { getStaticLocale, loadMessages } from "@/bootstrap/i18n";
import { MetaTagGenerator, SEOFactory } from "@shopkit/seo";
import { getThemeName } from "@/utils";
import { getPageBuilder } from "@/bootstrap/builder";
import { AppProductTracker } from "@shopkit/app-shell";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";

// For featured collection products, use static generation
export const revalidate = 3600;
export const dynamicParams = true;

const seoSystem = SEOFactory.createForEnvironment(
  process.env.NODE_ENV as "development" | "staging" | "production",
);

export async function generateStaticParams() {
  const homepageFeaturedCollections = process.env.FEATURED_COLLECTIONS;
  const productsPerCollection = parseInt(
    process.env.HOMEPAGE_FEATURED_COLLECTIONS_PRODUCT_LIMIT || "8",
  );

  if (!homepageFeaturedCollections) {
    console.error(
      "HOMEPAGE_FEATURED_COLLECTIONS environment variable not found",
    );
    return [];
  }

  const handles = homepageFeaturedCollections
    .split(",")
    .filter(Boolean)
    .map((h) => h.trim());

  const commerceClient = getCommerceClient();

  // Get all collection-product pairs in parallel
  const collectionPromises = handles.map((collectionname) =>
    commerceClient
      .getCollection({
        handle: collectionname,
        first: productsPerCollection,
      })
      .then((collectionResponse: any) => {
        if (collectionResponse?.products) {
          return collectionResponse.collection.products.flatMap(
            (product: any) =>
              product?.handle
                ? [{ collectionname, handle: product.handle }]
                : [],
          );
        }
        return [];
      })
      .catch((err: any) => {
        console.warn(
          `Collection handle '${collectionname}' not found, skipping`,
        );
        return [];
      }),
  );

  // Wait for all collection requests to complete in parallel
  const collectionResults = await Promise.all(collectionPromises);

  // Flatten all collection-product pairs
  const collectionProductPairs = collectionResults.flat();

  // Remove duplicate products (based on handle but keeping first found collection)
  const uniquePairs = Array.from(
    new Map(collectionProductPairs.map((item) => [item.handle, item])).values(),
  );

  // Return pairs directly - the collection API already validated these products exist
  // Additional validation here would cause excessive API calls during build time
  return uniquePairs;
}

export async function generateMetadata({
  params,
}: {
  params: { collectionname: string; handle: string };
}): Promise<Metadata> {
  try {
    const product = await fetchProduct(params.handle);

    if (!product) {
      return {
        title: "Product Not Found | Wellevrsed",
        description: "The requested product could not be found.",
        alternates: {
          canonical: `${
            process.env.NEXT_PUBLIC_BASE_URL || "https://wellversed.in"
          }/collections/${params.collectionname}/products/${params.handle}`,
        },
      };
    }

    const seoTitle = `${product.seo?.title || product.title}`;
    const seoDescription = product?.seo?.description;

    // Generate SEO data including structured data
    const locale = getStaticLocale();
    const seoData = await seoSystem.generateSEOData({
      type: "product",
      data: product,
      path: `/collections/${params.collectionname}/products/${params.handle}`,
      locale,
    });

    const metaTagGenerator = new MetaTagGenerator(seoSystem["config"]);
    const metadata = metaTagGenerator.generateNextJSMetadata({
      title: seoTitle,
      description: seoDescription,
      type: "website" as "website",
      canonical: `${
        process.env.NEXT_PUBLIC_BASE_URL || "https://wellversed.in"
      }/collections/${params.collectionname}/products/${params.handle}`,
      image: product.images?.[0]
        ? {
            id: `product-${params.handle}`,
            url: product.images[0].url,
            altText: product.title,
            width: product.images[0].width || 800,
            height: product.images[0].height || 800,
          }
        : {
            id: "wellversed-default",
            url: "/images/logo/wellversed-logo.svg",
            altText: product.title,
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
    console.error("Error generating metadata for product:", error);
    return {
      title: "Product | Wellevrsed",
      description: "Shop our amazing products at Wellevrsed",
    };
  }
}

// Main page component
export default async function CollectionProductPage({
  params,
}: {
  params: { collectionname: string; handle: string };
}) {
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
      templateName: TEMPLATE_TYPES["products-b"],
      path: `/collections/${collectionname}/products-b/${productHandle}`,
      params,
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

    return (
      <>
        <AppProductTracker
          productData={{
            id: product.id,
            title: product.title,
            price: parseFloat(product.priceRange?.minVariantPrice?.amount || "0"),
            currency: product.priceRange?.minVariantPrice?.currencyCode || "INR",
          }}
        />
        {pageContent}
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
