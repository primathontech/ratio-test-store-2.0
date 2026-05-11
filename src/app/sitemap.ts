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

  const staticEntries: MetadataRoute.Sitemap = [
    { url: siteUrl, changeFrequency: "daily", priority: 1.0 },
    { url: `${siteUrl}/about-us`, changeFrequency: "monthly", priority: 0.5 },
    {
      url: `${siteUrl}/privacy-policy`,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${siteUrl}/terms-of-use`,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${siteUrl}/shipping-policy`,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${siteUrl}/cancellation-policy`,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  return [...staticEntries, ...productEntries, ...collectionEntries];
}
