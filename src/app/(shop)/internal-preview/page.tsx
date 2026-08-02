import { getThemeName } from "@/utils";
import { getPageBuilder } from "@/bootstrap/builder";
import { createInternalPreviewPage } from "@shopkit/editor-bridge/internal-preview";

// Editor-only live-preview lane; force-dynamic scoped here so shopper routes
// stay ISR. Render logic + i18n live in the package factory.
export const dynamic = "force-dynamic";

export default createInternalPreviewPage({ getThemeName, getPageBuilder });
