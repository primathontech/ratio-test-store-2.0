import type { ITemplateLoader } from "@shopkit/builder";
import { headers } from "next/headers";
import { merchantTemplateLoader } from "./loaders/template-loader";
import { TemplateResolver } from "./loaders/template-resolver";
import { getResolvedPreview } from "./preview-link/fetch-preview";
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
 * SHAREABLE PREVIEW (single chokepoint): every route's renderPage funnels
 * through loadTemplate, so this is the one place that handles preview links.
 * `middleware.ts` detects `?editorPreview=true&previewId=…&version=…` and
 * forwards them as the `x-editor-preview-id` / `x-editor-preview-version`
 * request headers; here we read them once and, when present, fetch the editor's
 * saved snapshot from the backend (that version, or latest). No per-page wiring
 * needed. Reading headers() makes the render dynamic — acceptable because this
 * loader is only wired in when NEXT_PUBLIC_ENABLE_EDITOR_CHANGES is on (see
 * bootstrap/builder.ts), so production (flag off) keeps static generation.
 *
 * @internal
 */
export const editorTemplateLoader: ITemplateLoader = {
  loadTemplate: async (merchantName, templateName, variant) => {
    const h = await headers();
    const previewId = h.get("x-editor-preview-id");
    const previewVersion = h.get("x-editor-preview-version");
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
