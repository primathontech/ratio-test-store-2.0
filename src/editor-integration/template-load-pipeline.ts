import type { ITemplateLoader } from "@shopkit/builder";
import { merchantTemplateLoader } from "./loaders/template-loader";
import { TemplateResolver } from "./loaders/template-resolver";
// Shareable-preview imports disabled (rolled back 2026-06-23) — these were only
// used by the commented-out draft-mode branch in loadTemplate below:
// import { cookies, draftMode } from "next/headers";
// import { getResolvedPreview } from "./preview-link/fetch-preview";
// import {
//   PREVIEW_ID_COOKIE,
//   PREVIEW_VERSION_COOKIE,
// } from "./preview-link/cookies";
// import { getTemplateId } from "./template-id";

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
 * SHAREABLE PREVIEW: the draft-mode snapshot resolution that used to live here
 * is disabled (rolled back 2026-06-23) — see the commented-out branch in
 * loadTemplate. The loader now always resolves the live template, so normal
 * storefront traffic and static generation are unaffected.
 *
 * @internal
 */
export const editorTemplateLoader: ITemplateLoader = {
  loadTemplate: async (merchantName, templateName, variant) => {
    // Shareable-preview draft resolution DISABLED (rolled back 2026-06-23).
    // Commented out (not deleted) for an easy restore. Draft mode is never
    // enabled now (the /api/editor-preview/enter route and the middleware
    // routing are disabled), so this branch was already inert; dropping the
    // draftMode() call keeps loadTemplate purely on the live-resolve path below.
    //
    // const { isEnabled } = await draftMode();
    // if (isEnabled) {
    //   const jar = await cookies();
    //   const previewId = jar.get(PREVIEW_ID_COOKIE)?.value;
    //   const previewVersion = jar.get(PREVIEW_VERSION_COOKIE)?.value ?? null;
    //   if (previewId) {
    //     // In preview mode we always ask the backend to resolve this route. The
    //     // backend owns the matching/mapping: it returns the draft for the page
    //     // being edited and the live config for every other page (so a product
    //     // preview never leaks onto the home route). We just render the result.
    //     // null = transport/backend failure → fall through to local live resolve.
    //     const templateId = getTemplateId({
    //       merchantName,
    //       templateName,
    //       variant: variant || "default",
    //     });
    //     const resolved = await getResolvedPreview(
    //       previewId,
    //       previewVersion,
    //       merchantName,
    //       templateId
    //     );
    //     if (resolved) {
    //       return resolved;
    //     }
    //   }
    // }

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
