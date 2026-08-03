import {
  createInstalledAppsGetHandler,
  createInstalledAppsResolvers,
} from "@shopkit/apps-platform-react/server";

export const GET = createInstalledAppsGetHandler(
  createInstalledAppsResolvers({
    baseUrl: process.env.RATIO_APPS_API_URL ?? "http://localhost:4347",
  })
);
export const dynamic = "force-dynamic";
