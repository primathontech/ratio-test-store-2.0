import type { MetadataRoute } from "next";
import { getCommerceClient } from "@/config/commerce";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = (
    process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
  ).replace(/\/$/, "");

  const commerceClient = getCommerceClient();
  const [productsResult, collectionsResult] = await Promise.allSettled([
    commerceClient.getProducts({ first: 250 }),
    commerceClient.getCollections({ first: 100 }),
  ]);

  const products: any[] =
    productsResult.status === "fulfilled" && productsResult.value?.data
      ? (productsResult.value.data as any[])
      : [];

  const collections: any[] =
    collectionsResult.status === "fulfilled" && collectionsResult.value?.data
      ? (collectionsResult.value.data as any[])
      : [];

  const productEntries: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${siteUrl}/products/${product.handle}`,
    lastModified: product.updatedAt ? new Date(product.updatedAt) : new Date(),
    changeFrequency: "daily" as const,
    priority: 0.8,
  }));

  const collectionEntries: MetadataRoute.Sitemap = collections.map(
    (collection) => ({
      url: `${siteUrl}/collections/${collection.handle}`,
      lastModified: collection.updatedAt
        ? new Date(collection.updatedAt)
        : new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })
  );

  // Static content + policy routes. Kept in sync with the handles served by
  // the /pages/[handle] route (merchant-agnostic).
  const contentPaths = [
    "/pages/about-us",
    "/pages/contact",
    "/pages/faq",
    "/pages/privacy-policy",
    "/pages/refund-policy",
    "/pages/terms-of-service",
    "/pages/shipping-policy",
  ];

  const staticEntries: MetadataRoute.Sitemap = [
    { url: siteUrl, changeFrequency: "daily", priority: 1.0 },
    ...contentPaths.map((path) => ({
      url: `${siteUrl}${path}`,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
  ];

  return [...staticEntries, ...productEntries, ...collectionEntries];
}
