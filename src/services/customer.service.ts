/**
 * Customer service — fetches the authenticated customer profile.
 *
 * Owns the `Customer` and `CustomerAddress` types so widgets in the account
 * area can share a single source of truth.
 */

import { getCommerceClient } from "@/config/commerce";
import { getMerchantId, resolveAccessToken } from "./_helpers";

function getCustomerApiBaseUrl(): string {
  return (
    process.env.NEXT_PUBLIC_CUSTOMER_API_URL ||
    process.env.NEXT_PUBLIC_CUSTOM_API_CUSTOMER_URL ||
    ""
  );
}

export interface CustomerAddress {
  id: string;
  customerId: string;

  firstName: string;
  lastName: string;

  address1: string;
  address2: string;

  city: string;
  company: string | null;

  country: string;
  countryCode: string | null;

  province: string;
  provinceCode: string | null;

  zip: string;

  phone: string;
  email: string;

  isDefault: boolean;
  isDeleted: boolean;

  oldId: string;

  createdAt: string;
  updatedAt: string;
}

export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  tags: string[];
  company: string;
  emailDomain: string | null;
  language: string;

  hasEmailSubscription: boolean;
  hasSmsSubscription: boolean;
  hasPushSubscription: boolean;

  notes: string | null;
  taxSetting: "COLLECT_TAX" | "EXEMPT";
  taxExemptionCards: unknown[] | null;

  anniversaryDate: string | null;

  totalOrders: number;
  totalSpent: string;
  averageOrderValue: string;

  firstOrderDate: string | null;
  lastOrderDate: string | null;
  abandonedCheckoutDate: string | null;

  isDeleted: boolean;
  isBlocked: boolean;

  createdAt: string;
  updatedAt: string;

  defaultAddress: CustomerAddress | null;
}

/**
 * Fetch the authenticated customer's profile.
 */
export async function getCustomerDetails(
  accessToken?: string | null
): Promise<Customer | null> {
  const baseURL = getCustomerApiBaseUrl();
  if (!baseURL) {
    return null;
  }

  const token = resolveAccessToken(accessToken);
  if (!token) {
    return null;
  }

  try {
    const client = getCommerceClient();
    const response = await client.fetchRequest({
      url: `${baseURL}/storefront/customers/profile`,
      method: "GET",
      headers: {
        accept: "*/*",
        "gk-merchant-id": getMerchantId(),
        "gk-access-token": token,
        "gk-request-id": Date.now().toString(),
      },
    });
    // Upstream may return either a flat Customer or `{ data: Customer }`;
    // unwrap one level if it does, otherwise return the payload as-is.
    const payload = response.data as any;
    return (payload?.data ?? payload) as Customer | null;
  } catch (error) {
    console.error("Customer profile fetch error:", error);
    return null;
  }
}
