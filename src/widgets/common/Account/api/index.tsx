/**
 * Backwards-compatible thin wrapper over the centralised customer service.
 *
 * New code should import directly from `@/services/customer.service`.
 */

import { getCustomerDetails as getCustomerDetailsService } from "@/services/customer.service";
import { Customer } from "./type";

export const getCustomerDetails = async (
  gkAccessToken: string,
  _gkMerchantId?: string
): Promise<Customer | null> => {
  return (await getCustomerDetailsService(gkAccessToken)) as Customer | null;
};
