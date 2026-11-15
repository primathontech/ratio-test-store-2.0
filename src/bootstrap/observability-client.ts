/** Browser monitoring identity, shared by instrumentation-client.ts and the head stub. */
export const browserObservability = {
  app: "storefront",
  serviceName: "storefront-web",
  relayUrl: "/api/obs",
} as const;
