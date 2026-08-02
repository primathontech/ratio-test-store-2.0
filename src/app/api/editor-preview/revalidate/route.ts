import { createRevalidateRoute } from "@shopkit/editor-bridge/server";
import { REVALIDATION_ROUTES } from "@/editor-integration/.generated/revalidation-routes";

// Editor-publish webhook. Logic lives in the package factory; the
// templateName→path map is generated from src/app (shopkit generate:routes).
// TODO(security): add the shared-secret check before prod.
export const dynamic = "force-dynamic";

export const { POST } = createRevalidateRoute({
  routeMap: REVALIDATION_ROUTES,
});
