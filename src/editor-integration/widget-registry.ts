import { WIDGET_TYPES } from "@/widgets/.generated/types";

/**
 * Widget Registry for Visual Editor
 *
 * Maps each widget type to its schema definition.
 * The editor's SettingsSidebar uses these schemas to generate
 * the form fields shown in the right-side settings panel.
 *
 * Schema field types:
 *   text        – plain text input
 *   number      – numeric input (supports min/max/step/unit)
 *   boolean     – toggle switch
 *   select      – dropdown with options[]
 *   menu-select – dropdown of the merchant's live nav menus (editor-fetched)
 *   spacing     – responsive padding/margin control
 *   image       – image picker
 *   richtext    – rich text editor
 *   html        – raw HTML code editor
 *   array       – simple array of scalar values
 *   objectArray – array of objects (fields lists the editable keys per item)
 *   faq         – FAQ question/answer pairs
 *
 * Structure:
 *   commonWidgetSchemas  – registered for every merchant (CustomHtml, etc.)
 *   Merchant-specific    – uncomment and extend per widget when forking
 */

// =============================================================================
// COMMON WIDGETS — registered for all merchants
// =============================================================================

const commonWidgetSchemas = {
  [WIDGET_TYPES.CustomHtml]: {
    type: WIDGET_TYPES.CustomHtml,
    name: "Custom HTML",
    description: "Raw HTML snippet with support for <style> and <script> tags",
    settingsSchema: {
      html: {
        type: "html" as const,
        label: "HTML (supports <style> and <script>)",
        default: "",
      },
    },
  },
};

// =============================================================================
// MERCHANT-SPECIFIC WIDGETS — uncomment and extend when forking this starter
// =============================================================================

const merchantWidgetSchemas = {
  [WIDGET_TYPES.Header]: {
    type: WIDGET_TYPES.Header,
    name: "Header",
    description: "Site header with logo, navigation, and cart icon",
    settingsSchema: {
      // Mega-menu source. Picks WHICH published menu feeds the nav — options are
      // the merchant's live menus, fetched by the editor's "menu-select" control
      // (no static list to maintain). The menu CONTENT (links, columns, panels)
      // is still managed in the admin panel. `default` is the fallback handle.
      menuHandle: {
        type: "menu-select" as const,
        label: "Menu",
        default: "main-menu",
      },
      variant: {
        type: "select" as const,
        label: "Widget Variant",
        options: [
          { value: "v1", label: "Version 1 (Classic)" },
          { value: "v2", label: "Version 2 (Enhanced)" },
        ],
        default: "v1",
      },
    },
  },
  [WIDGET_TYPES.Footer]: {
    type: WIDGET_TYPES.Footer,
    name: "Footer",
    description: "Site footer with links and branding",
    settingsSchema: {
      // Mega-menu source. Picks WHICH published menu feeds the nav — options are
      // the merchant's live menus, fetched by the editor's "menu-select" control
      // (no static list to maintain). The menu CONTENT is still managed in the
      // admin panel. `default` is the fallback handle.
      menuHandle: {
        type: "menu-select" as const,
        label: "Menu",
        default: "footer",
      },
      variant: {
        type: "select" as const,
        label: "Widget Variant",
        options: [{ value: "v1", label: "Version 1 (Classic)" }],
        default: "v1",
      },
    },
  },
  // [WIDGET_TYPES.PageContent]: {
  //   type: WIDGET_TYPES.PageContent,
  //   name: "Page Content",
  //   description: "Generic page content block",
  //   settingsSchema: {
  //     variant: {
  //       type: "select",
  //       label: "Widget Variant",
  //       options: [{ value: "v1", label: "Version 1 (Classic)" }],
  //       default: "v1",
  //     },
  //   },
  // },
};

export const widgetRegistry: Record<string, any> = {
  ...commonWidgetSchemas,
  ...merchantWidgetSchemas,
};
