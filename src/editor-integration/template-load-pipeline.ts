import type { ITemplateLoader, PageConfig } from "@shopkit/builder";
import { SECTION_TYPES } from "@shopkit/builder";
import { cookies, draftMode } from "next/headers";
import { merchantTemplateLoader } from "./loaders/template-loader";
import { TemplateResolver } from "./loaders/template-resolver";
import { TemplateNotFoundError } from "./loaders/api-client";
import { getResolvedPreview } from "./preview-link/fetch-preview";
import {
  PREVIEW_ID_COOKIE,
  PREVIEW_SUFFIX_COOKIE,
  PREVIEW_VERSION_COOKIE,
} from "./preview-link/cookies";
import { getTemplateId } from "./template-id";

const resolver = new TemplateResolver(merchantTemplateLoader);

/**
 * Drop chrome (announcement bar / header / footer / bottom bar) sections from a
 * page-body pageConfig.
 *
 * The root layout renders chrome separately via `renderChrome()`. Page bodies
 * MUST NOT contain chrome sections — otherwise the storefront double-renders
 * chrome (once from the layout, once inline). This filter defends against two
 * known sources of inline chrome in preview mode:
 *
 *  1. **DB-live drift**: the editor backend's preview resolver falls back to
 *     the DB-saved live template when no draft exists for the route. If that
 *     DB row was seeded before the chrome migration (page templates were
 *     chrome-stripped on disk but DB rows weren't re-uploaded), it still
 *     carries inline chrome.
 *  2. **Stale drafts**: a body preview saved by an older editor build (before
 *     chrome was split into its own template) may still contain chrome.
 *
 * Caller is responsible for NOT applying this to chrome templates themselves
 * (templateName === "header"/"footer") — those are SUPPOSED to contain these
 * sections, that's their entire purpose.
 */
function stripChromeSections(pageConfig: PageConfig): PageConfig {
  const sections = pageConfig.sections;
  if (!sections?.length) {
    return pageConfig;
  }
  const filtered = sections.filter(
    (s) =>
      s.type !== SECTION_TYPES.HEADER_SECTION &&
      s.type !== SECTION_TYPES.FOOTER_SECTION
  );
  if (filtered.length === sections.length) {
    return pageConfig;
  }
  return { ...pageConfig, sections: filtered };
}

/** Chrome templates by templateName. Their bodies legitimately contain the
 * chrome sections — `stripChromeSections` must not be applied to them. */
function isChromeTemplate(templateName: string): boolean {
  return templateName === "header" || templateName === "footer";
}

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
    // Effective variant: normally the passed one ("default" for a plain page).
    // In preview, a resource-scoped `PREVIEW_SUFFIX_COOKIE` ("{type}:{suffix}")
    // forces a specific template — but only when its type matches THIS route
    // (so chrome/header/footer rendered on the same page keep their own).
    let effectiveVariant = variant;
    let previewId: string | undefined;
    let previewVersion: string | null = null;

    const { isEnabled } = await draftMode();
    if (isEnabled) {
      const jar = await cookies();
      previewId = jar.get(PREVIEW_ID_COOKIE)?.value;
      previewVersion = jar.get(PREVIEW_VERSION_COOKIE)?.value ?? null;

      const suffixCookie = jar.get(PREVIEW_SUFFIX_COOKIE)?.value;
      if (suffixCookie) {
        const sep = suffixCookie.indexOf(":");
        const forcedType = sep >= 0 ? suffixCookie.slice(0, sep) : "";
        const forcedSuffix = sep >= 0 ? suffixCookie.slice(sep + 1) : "";
        if (forcedType === templateName && forcedSuffix) {
          effectiveVariant = forcedSuffix;
        }
      }
    }

    const loadVariant = async (target: string): Promise<PageConfig> => {
      if (previewId) {
        // In preview mode we always ask the backend to resolve this route. The
        // backend owns the matching/mapping: it returns the draft for the page
        // being edited and the live config for every other page (so a product
        // preview never leaks onto the home route). We just render the result.
        // null = transport/backend failure → fall through to local live resolve.
        const templateId = getTemplateId({
          merchantName,
          templateName,
          variant: target,
        });
        const resolved = await getResolvedPreview(
          previewId,
          previewVersion,
          merchantName,
          templateId
        );
        if (resolved) {
          // Layout renders chrome via renderChrome(); the page body must not
          // carry chrome sections or the storefront double-renders them. The
          // backend's preview resolver may return DB-live (when no draft for
          // this route under the previewId), and that DB row can still carry
          // inline chrome if the on-disk chrome-strip migration didn't
          // re-upload page templates. Chrome templates are intentionally
          // pass-through — their bodies ARE the chrome.
          return isChromeTemplate(templateName)
            ? resolved
            : stripChromeSections(resolved);
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
        variant: target,
      });
    };

    const requestedVariant = effectiveVariant || "default";
    try {
      return await loadVariant(requestedVariant);
    } catch (error) {
      // Assigned template the editor doesn't have → the merchant's default
      // (Shopify parity). Handled here, not in the builder: the preview suffix
      // cookie would re-force the suffix on the builder's retry.
      if (
        requestedVariant === "default" ||
        !(error instanceof TemplateNotFoundError)
      ) {
        throw error;
      }
      return loadVariant("default");
    }
  },
  loadVariantRegistry: (merchantName) =>
    merchantTemplateLoader.loadVariantRegistry
      ? merchantTemplateLoader.loadVariantRegistry(merchantName)
      : Promise.resolve(null),
};
