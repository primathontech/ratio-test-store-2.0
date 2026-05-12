import type { MetadataRoute } from "next";
import { getCommerceClient } from "@/config/commerce";
import { getSEOConfig } from "@/config";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { siteUrl } = getSEOConfig();
  const client = getCommerceClient();

  const [productsResult, collectionsResult] = await Promise.all([
    client.getProducts({ first: 100 }).catch(() => ({ data: [] })),
    client.getCollections({ first: 100 }).catch(() => ({ data: [] })),
  ]);

  const products = productsResult?.data ?? [];
  const collections = collectionsResult?.data ?? [];

  const productUrls: MetadataRoute.Sitemap = products
    .filter((p: any) => p?.handle)
    .map((p: any) => ({
      url: `${siteUrl}/products/${p.handle}`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.8,
    }));

  const collectionUrls: MetadataRoute.Sitemap = collections
    .filter((c: any) => c?.handle)
    .map((c: any) => ({
      url: `${siteUrl}/collections/${c.handle}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));

  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1.0,
    },
    ...collectionUrls,
    ...productUrls,
  ];
}
