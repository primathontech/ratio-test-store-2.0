import type { ITemplateLoader } from "@shopkit/builder";
import { cookies, draftMode } from "next/headers";
import { merchantTemplateLoader } from "./loaders/template-loader";
import { TemplateResolver } from "./loaders/template-resolver";
import { getResolvedPreview } from "./preview-link/fetch-preview";
import {
  PREVIEW_ID_COOKIE,
  PREVIEW_VERSION_COOKIE,
} from "./preview-link/cookies";
import { getTemplateId } from "./template-id";

const resolver = new TemplateResolver(merchantTemplateLoader);

/**
 * Editor-aware template loader.
 *
 * API-first when NEXT_PUBLIC_ENABLE_EDITOR_CHANGES is set and the template
 * has fetchAPITemplate: true. Falls back to the filesystem loader always.
 *
 * Used as a drop-in replacement for the core templateLoader in builder.ts
 * when the editor integration is active.
 *
 * SHAREABLE PREVIEW (single chokepoint): every route's renderPage/renderChrome
 * funnels through loadTemplate, so this is the one place that resolves preview
 * snapshots. Entry is via Next.js DRAFT MODE: the `/api/editor-preview/enter`
 * handler (reached through the middleware redirect) enables draft mode and
 * stores the previewId in a cookie. Draft mode is the key design choice — it
 * keeps every route STATIC for normal traffic and at build time (draftMode()
 * reports disabled, so we never touch cookies() and never bail static
 * generation), and bypasses the static cache ONLY for requests that carry the
 * draft cookie. That request renders dynamically and we read the previewId
 * cookie here to fetch the editor's saved snapshot.
 *
 * @internal
 */
export const editorTemplateLoader: ITemplateLoader = {
  loadTemplate: async (merchantName, templateName, variant) => {
    // Draft-mode gate. `draftMode()` is static-generation safe: it returns
    // disabled at build / on normal traffic without opting the route into
    // dynamic rendering, so cookies() below is only ever reached on an actual
    // preview request (which draft mode has already made dynamic).
    const { isEnabled } = await draftMode();
    if (isEnabled) {
      const jar = await cookies();
      const previewId = jar.get(PREVIEW_ID_COOKIE)?.value;
      const previewVersion = jar.get(PREVIEW_VERSION_COOKIE)?.value ?? null;
      if (previewId) {
        // In preview mode we always ask the backend to resolve this route. The
        // backend owns the matching/mapping: it returns the draft for the page
        // being edited and the live config for every other page (so a product
        // preview never leaks onto the home route). We just render the result.
        // null = transport/backend failure → fall through to local live resolve.
        const templateId = getTemplateId({
          merchantName,
          templateName,
          variant: variant || "default",
        });
        const resolved = await getResolvedPreview(
          previewId,
          previewVersion,
          merchantName,
          templateId
        );
        if (resolved) {
          return resolved;
        }
      }
    }

    return resolver.resolveTemplate({
      merchantName,
      routeContext: {
        templateName,
        path: "",
        params: {},
        query: {},
        fetchAPITemplate: true,
      },
      variant,
    });
  },
  loadVariantRegistry: (merchantName) =>
    merchantTemplateLoader.loadVariantRegistry
      ? merchantTemplateLoader.loadVariantRegistry(merchantName)
      : Promise.resolve(null),
};
