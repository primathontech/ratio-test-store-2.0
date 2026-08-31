import { createPagesRoute } from "@shopkit/editor-bridge/pages";
import { getStaticLocale } from "@/bootstrap/i18n";
import { getPageBuilder } from "@/bootstrap/builder";
import {
  getPreviewConfig,
  isPreviewSession,
} from "@/editor-integration/preview-link/preview-session";
import { getRouteTranslations, getThemeName } from "@/utils";

const route = createPagesRoute({
  getThemeName,
  getLocale: getStaticLocale,
  getPageBuilder,
  getRouteTranslations,
  isPreviewSession,
  getPreviewConfig,
});

export const revalidate = 3600;
export const dynamicParams = true;
export const generateStaticParams = route.generateStaticParams;
export const generateMetadata = route.generateMetadata;
export default route.Page;
