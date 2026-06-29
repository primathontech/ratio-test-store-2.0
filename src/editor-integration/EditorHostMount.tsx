"use client";

import {
  EditorHost,
  type FetchDataSourceOptions,
} from "@shopkit/editor-bridge/client";
import type {
  AvailableSectionRegistry,
  WidgetRegistry,
} from "@shopkit/editor-bridge";
import { ALLOWED_EDITOR_ORIGINS } from "./editor-bridge-config";
import { availableSectionsRegistry } from "./registries";
import { widgetRegistry } from "./widget-registry";

/**
 * Resolves the editor's data-source dropdown lists. Runs in the iframe
 * (browser) and hits the same-origin route, which calls this storefront's
 * data-layer client server-side — so there's no CORS. Module-level so the
 * EditorHost prop stays referentially stable. Best-effort: `[]` on failure.
 */
const fetchDataSourceOptions: FetchDataSourceOptions = async ({ source }) => {
  try {
    const res = await fetch("/api/data-source-options", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ source }),
    });
    if (!res.ok) {
      return [];
    }
    const json = (await res.json()) as {
      data?: Array<{ value: string; label: string }>;
    };
    return json?.data ?? [];
  } catch {
    return [];
  }
};

/**
 * Mounts <EditorHost /> for every route in this storefront.
 *
 * - Origin allowlist is module-level (see editor-bridge-config) so the
 *   EditorHost prop is referentially stable across renders — no
 *   tear-down + rebuild of the bridge on layout re-renders.
 * - Hands off the merchant's widgetSchemas + section library so the
 *   editor's sidebar can render forms against this storefront's actual
 *   schema set. No HTTP round-trip — these registries are part of this
 *   bundle.
 *
 * EditorHost handles the customer-vs-editor gate internally (returns null
 * unless ?editor=true is present), so this can mount unconditionally from
 * app/layout.tsx without paying the inner-runtime cost on customer traffic.
 */
export function EditorHostMount(): JSX.Element {
  return (
    <EditorHost
      allowedEditorOrigins={ALLOWED_EDITOR_ORIGINS}
      widgetSchemas={widgetRegistry as WidgetRegistry}
      availableSections={
        availableSectionsRegistry.availableSections as AvailableSectionRegistry
      }
      fetchDataSourceOptions={fetchDataSourceOptions}
      previewCodeSync={true}
    />
  );
}
