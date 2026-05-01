/**
 * Variant Registry
 *
 * Maps template types to their available variants.
 */

import { TEMPLATE_TYPES } from "./.generated/types";

export const variantRegistry = {
  [TEMPLATE_TYPES.home]: {
    default: () => import("./home/default").then((m) => m.template),
  },
  [TEMPLATE_TYPES["home-b"]]: {
    default: () => import("./home-b/default").then((m) => m.template),
  },
  [TEMPLATE_TYPES.products]: {
    default: () => import("./products/default").then((m) => m.template),
  },
  [TEMPLATE_TYPES["products-b"]]: {
    default: () => import("./products-b/default").then((m) => m.template),
  },
  [TEMPLATE_TYPES.collection]: {
    default: () => import("./collection/default").then((m) => m.template),
  },
  [TEMPLATE_TYPES["collection-b"]]: {
    default: () => import("./collection-b/default").then((m) => m.template),
  },
  [TEMPLATE_TYPES.orders]: {
    default: () => import("./orders/default").then((m) => m.template),
  },
  [TEMPLATE_TYPES["thank-you"]]: {
    default: () => import("./thank-you/default").then((m) => m.template),
  },
  [TEMPLATE_TYPES["about-us"]]: {
    default: () => import("./about-us/default").then((m) => m.template),
  },
};
