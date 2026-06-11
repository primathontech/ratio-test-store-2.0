import React from "react";
import { getStaticLocale } from "@shopkit/i18n/server";
import { TranslationProvider } from "@shopkit/i18n/client";
import type { Locale } from "@shopkit/i18n";
import { getRouteTranslations, getThemeName } from "@/utils";
import { resolvePageSEO } from "@shopkit/seo";
import { getSEOConfig } from "@/config";
import type { Metadata } from "next";

/**
 * Shared server-side rendering helpers for static-pages feature-pack routes.
 *
 * Each `app/<slug>/page.tsx` is a one-line re-export shim (Next.js requires a
 * file under app/ to register a route — nothing else lives outside this pack).
 * The real logic — metadata + translation wiring + provider — is here.
 *
 * Translation source order:
 *   1. The pack's own default locale JSON (always present → page renders its
 *      copy even with the editor backend disabled).
 *   2. `getRouteTranslations` (common + any editor-backend overrides when
 *      NEXT_PUBLIC_ENABLE_EDITOR_CHANGES=true) layered ON TOP, so a merchant's
 *      edited copy wins over the bundled default.
 */

export function makeStaticPageMetadata(title: string, path: string) {
  return async function generateMetadata(): Promise<Metadata> {
    const { siteUrl, siteName } = getSEOConfig();
    return resolvePageSEO({ title }, { siteUrl, siteName, path });
  };
}

export async function renderStaticPage({
  slug,
  defaultContent,
  Template,
}: {
  /** Template id, e.g. "privacy-policy" — also the top-level key in the JSON. */
  slug: string;
  /** The pack's default locale JSON, shaped `{ [slug]: { title, content__rich } }`. */
  defaultContent: Record<string, unknown>;
  Template: React.ComponentType;
}) {
  const locale = getStaticLocale();
  const themeName = getThemeName();

  const routeTranslations = await getRouteTranslations({
    themeName,
    language: locale,
    staticTemplateId: slug,
  });

  // Pack default as the base; editor/common translations layered on top.
  const translations = { ...defaultContent, ...routeTranslations };

  return (
    <TranslationProvider locale={locale as Locale} translations={translations}>
      <Template />
    </TranslationProvider>
  );
}
