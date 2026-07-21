// Content + policy pages under Shopify's /pages/* scheme:
//   /pages/{contact,faq,privacy-policy,refund-policy,terms-of-service,shipping-policy}
// Rendered via @/bootstrap/builder → createPageBuildingEngine (shopkit page builder).
// Coexists with the static /pages/about-us and /pages/orders routes — Next.js
// resolves those static segments first, so only handles listed here reach this
// dynamic route. Add a template folder + locale + an entry below to add another.
import { notFound } from "next/navigation";
import {
  TEMPLATE_TYPES,
  isValidTemplateType,
} from "@/themes/ratio/templates/.generated/types";
import { getStaticLocale } from "@/bootstrap/i18n";
import { getThemeName, getRouteTranslations } from "@/utils";
import { getPageBuilder } from "@/bootstrap/builder";
import { readEditorPreviewState } from "@shopkit/editor-bridge/server";
import type { PageConfig } from "@shopkit/builder";
import type { Metadata } from "next";
import { getPageMetadata } from "@shopkit/seo";

const CONTENT_PAGES: Record<string, { title: string; description: string }> = {
  contact: {
    title: "Contact Us",
    description: "Get in touch with our customer support team.",
  },
  faq: {
    title: "Frequently Asked Questions",
    description: "Answers to the questions we hear most often.",
  },
  "privacy-policy": {
    title: "Privacy Policy",
    description: "How we collect, use, and protect your personal information.",
  },
  "refund-policy": {
    title: "Refund & Return Policy",
    description: "Our returns, exchanges, and refunds policy.",
  },
  "terms-of-service": {
    title: "Terms of Service",
    description: "The terms that govern your use of our store.",
  },
  "shipping-policy": {
    title: "Shipping Policy",
    description: "Processing times, delivery estimates, and shipping charges.",
  },
};

export function generateStaticParams() {
  return Object.keys(CONTENT_PAGES).map((handle) => ({ handle }));
}

// Only the handles enumerated by generateStaticParams are valid. Handles
// outside that set 404 at the routing level (a real HTTP 404) instead of
// being rendered on-demand and served as a soft-404 (HTTP 200).
export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string }>;
}): Promise<Metadata> {
  const { handle } = await params;
  const page = CONTENT_PAGES[handle];
  return getPageMetadata({
    pageType: "page",
    path: `/pages/${handle}`,
    fallback: {
      title: page?.title ?? "Page",
      description: page?.description ?? "",
    },
  });
}

export default async function ContentPage({
  params,
  searchParams,
}: {
  params: Promise<{ handle: string }>;
  searchParams: Promise<{ editor?: string; previewKey?: string }>;
}) {
  const { handle } = await params;

  if (!CONTENT_PAGES[handle] || !isValidTemplateType(handle)) {
    notFound();
  }

  const { isEditor, pageConfig: previewPageConfig } =
    await readEditorPreviewState<PageConfig>(searchParams);

  const themeName = getThemeName();
  const locale = getStaticLocale();

  const routeContext = {
    templateName: TEMPLATE_TYPES[handle as keyof typeof TEMPLATE_TYPES],
    path: `/pages/${handle}`,
    params: { handle },
    query: {},
    fetchAPITemplate: true,
  };

  const messages = await getRouteTranslations({
    themeName,
    routeContext,
    language: locale,
  });

  const pageBuilder = getPageBuilder({ isEditor });

  const pageContent = await pageBuilder.renderPage({
    merchantName: themeName,
    routeContext,
    locale,
    messages,
    pageConfig: previewPageConfig,
  });

  return <>{pageContent}</>;
}
