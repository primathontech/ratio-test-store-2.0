/**
 * Address service — list, create, update, delete customer addresses.
 *
 * Owns the address types (`ApiAddress`, `AddressApiResponse`,
 * `AddressPayload`, `AddressResponse`) so the Addresses widget and any other
 * caller share a single source of truth.
 */

import { getCommerceClient } from "@/config/commerce";
import { getMerchantId, resolveAccessToken } from "./_helpers";
import { getCustomerDetails } from "./customer.service";

function getAddressApiBaseUrl(): string {
  return process.env.NEXT_PUBLIC_ADDRESS_API_URL || "";
}

// ─── Types ─────────────────────────────────────────────────────────────────

export interface ApiAddress {
  address_id: string;
  address_line1: string | null;
  address_line2: string | null;
  address_type: string;
  recipient_phone: string;
  customerPhone: string;
  city: string;
  state: string;
  country: string;
  address: string;
  pincode: string;
  lat: string | null;
  long: string | null;
  email: string;
  first_name: string;
  last_name: string;
  company?: string;
}

export interface AddressApiResponse {
  data?: {
    addresses: ApiAddress[];
    phone: string;
  };
  success: boolean;
  status_code: number;
  timestamp: number;
  error?: {
    message: string;
    type: string;
    code: string;
    reference?: {
      location: string;
      name: string;
      validation: string;
    };
  };
}

export interface AddressPayload {
  first_name: string;
  last_name: string;
  email: string;
  company?: string;
  recipient_phone: string;
  country: string;
  city: string;
  state: string;
  pincode: string;
  address_1: string;
  address_2?: string;
  address: string;
  address_type: string;
}

export interface AddressResponse {
  success: boolean;
  data?: any;
  message?: string;
  error?: string;
  statusCode?: number;
  fieldErrors?: Record<string, string>;
}

// ─── Helpers ──────────────────────────────────────────────────────────────

/**
 * Maps an upstream address record to the internal `ApiAddress` shape used by
 * the UI components.
 */
function mapToApiAddress(
  a: Record<string, unknown>,
  customerPhone: string
): ApiAddress {
  const address1 = (a.address1 ?? a.address ?? "") as string;
  const addressType =
    a.isDefault === true
      ? "default"
      : ((a.address_type as string) ?? "secondary");
  return {
    address_id: (a.id ?? a.address_id ?? "") as string,
    first_name: (a.firstName ?? a.first_name ?? "") as string,
    last_name: (a.lastName ?? a.last_name ?? "") as string,
    company: (a.company ?? undefined) as string | undefined,
    address: address1,
    address_line1: address1,
    address_line2: (a.address2 ?? a.address_line2 ?? null) as string | null,
    city: (a.city ?? "") as string,
    state: (a.province ?? a.state ?? "") as string,
    country: (a.country ?? "") as string,
    pincode: (a.zip ?? a.pincode ?? "") as string,
    recipient_phone: (a.phone ?? a.recipient_phone ?? customerPhone) as string,
    customerPhone,
    address_type: addressType,
    email: (a.email ?? "") as string,
    lat: (a.lat ?? null) as string | null,
    long: (a.long ?? null) as string | null,
  };
}

// ─── Calls ─────────────────────────────────────────────────────────────────

/**
 * List all addresses for the customer with the given phone.
 */
export async function getCustomerAddresses(
  phoneNumber: string,
  accessToken?: string | null
): Promise<AddressApiResponse | null> {
  const baseUrl = getAddressApiBaseUrl();
  const token = resolveAccessToken(accessToken);
  if (!phoneNumber || !token || !baseUrl) {
    return null;
  }

  try {
    const client = getCommerceClient();
    const response = await client.fetchRequest({
      url: `${baseUrl}/addresses/customer`,
      method: "GET",
      headers: {
        accept: "*/*",
        "gk-merchant-id": getMerchantId(),
        "gk-phone": phoneNumber,
        "gk-access-token": token,
      },
    });

    const data = response.data ?? response;
    const rawList = Array.isArray(data)
      ? (data as Record<string, unknown>[])
      : Array.isArray((data as { addresses?: unknown[] })?.addresses)
        ? (data as { addresses: Record<string, unknown>[] }).addresses
        : null;

    if (rawList !== null) {
      return {
        success: true,
        data: {
          addresses: rawList.map((a) => mapToApiAddress(a, phoneNumber)),
          phone: phoneNumber,
        },
        status_code: 200,
        timestamp: Date.now(),
      };
    }
    return data as AddressApiResponse;
  } catch (error) {
    console.error("Addresses list fetch error:", error);
    return null;
  }
}

/**
 * Create a new address. Resolves customerId from the profile if not in payload.
 */
export async function createAddress(
  payload: AddressPayload,
  customerPhone: string,
  accessToken?: string | null
): Promise<AddressResponse> {
  const token = resolveAccessToken(accessToken);
  if (!token) {
    return {
      success: false,
      error: "Authentication required",
      fieldErrors: {},
    };
  }

  const baseUrl = getAddressApiBaseUrl();
  const merchantId = getMerchantId();
  if (!baseUrl || !merchantId) {
    return {
      success: false,
      error: "Server configuration error",
      fieldErrors: {},
    };
  }

  if (
    !payload.first_name ||
    !payload.last_name ||
    !payload.recipient_phone ||
    !payload.pincode ||
    !payload.address_1
  ) {
    return {
      success: false,
      error: "Missing required fields",
      fieldErrors: {},
    };
  }

  // Resolve customer id (the server-side route did this; do the same here)
  let customerId: string | null = null;
  try {
    const profile = await getCustomerDetails(token);
    customerId = profile?.id ?? null;
  } catch {
    // ignore — we'll error out below if still null
  }
  if (!customerId) {
    return {
      success: false,
      error: "Could not resolve customer.",
      fieldErrors: {},
    };
  }

  const upstreamPayload = {
    customerId,
    firstName: payload.first_name,
    lastName: payload.last_name,
    address1: payload.address_1 ?? payload.address,
    address2: payload.address_2 || "",
    city: payload.city ?? "",
    company: payload.company || "",
    country: payload.country === "IN" ? "India" : (payload.country ?? "India"),
    countryCode: payload.country === "IN" ? "91" : "91",
    phone: payload.recipient_phone ?? customerPhone,
    email: payload.email,
    province: payload.state ?? "",
    provinceCode: payload.pincode ?? "",
    zip: payload.pincode,
    isDefault: payload.address_type === "default",
  };

  try {
    const client = getCommerceClient();
    const response = await client.fetchRequest({
      url: `${baseUrl}/addresses`,
      method: "POST",
      headers: {
        accept: "*/*",
        "Content-Type": "application/json",
        "gk-merchant-id": merchantId,
        "gk-phone": customerPhone,
        "gk-access-token": token,
      },
      body: JSON.stringify(upstreamPayload),
    });

    const data = response.data ?? response;
    const statusCode =
      (data as { statusCode?: number })?.statusCode ??
      (data as { status?: number })?.status ??
      (response as { statusCode?: number })?.statusCode ??
      (response as { status?: number })?.status ??
      200;

    if (statusCode >= 400) {
      const err = data as {
        message?: string;
        error?: string | { message?: string; error?: string };
        fieldErrors?: Record<string, string>;
        errors?: Record<string, string>;
      };
      let errorMessage = err.message;
      if (!errorMessage && typeof err.error === "object" && err.error) {
        errorMessage = err.error.message ?? err.error.error;
      } else if (!errorMessage && typeof err.error === "string") {
        errorMessage = err.error;
      }
      return {
        success: false,
        error: errorMessage ?? `Request failed with status ${statusCode}`,
        statusCode,
        fieldErrors: err.fieldErrors ?? err.errors ?? {},
      };
    }

    return { success: true, data };
  } catch (error: any) {
    return {
      success: false,
      error: error?.message ?? "Unknown error occurred",
      fieldErrors: {},
    };
  }
}

/**
 * Update an existing address.
 */
export async function updateCustomerAddress(
  addressId: string,
  payload: Record<string, unknown>,
  phoneNumber: string,
  accessToken?: string | null
): Promise<AddressApiResponse | null> {
  const token = resolveAccessToken(accessToken);
  const baseUrl = getAddressApiBaseUrl();
  const merchantId = getMerchantId();
  if (!addressId || !token || !baseUrl || !merchantId) {
    return null;
  }

  const {
    first_name,
    last_name,
    email,
    recipient_phone,
    country,
    city,
    state,
    pincode,
    address_1,
    address_2,
    address_type,
    ...rest
  } = payload as any;

  let customerId: string | null =
    (rest as { customerId?: string }).customerId ?? null;
  if (!customerId) {
    try {
      const profile = await getCustomerDetails(token);
      customerId = profile?.id ?? null;
    } catch {
      // ignore
    }
  }

  const upstreamPayload = {
    customerId: customerId ?? "string",
    firstName: first_name ?? rest.firstName ?? "",
    lastName: last_name ?? rest.lastName ?? "",
    address1: address_1 ?? rest.address1 ?? rest.address ?? "",
    address2: address_2 ?? rest.address2 ?? "",
    city: city ?? rest.city ?? "",
    company: rest.company ?? "string",
    country:
      country === "IN" || country === "India"
        ? "INDIA"
        : (country ?? rest.country ?? "string"),
    countryCode: country === "IN" ? "IN" : (rest.countryCode ?? "string"),
    phone: recipient_phone ?? rest.phone ?? phoneNumber,
    email: email ?? rest.email ?? "",
    province: state ?? rest.province ?? "string",
    provinceCode: pincode ?? rest.provinceCode ?? "string",
    zip: pincode ?? rest.zip ?? "",
    isDefault:
      rest.isDefault === true ||
      rest.is_default === true ||
      address_type === "default",
  };

  try {
    const client = getCommerceClient();
    const response = await client.fetchRequest({
      url: `${baseUrl}/addresses/${addressId}`,
      method: "PUT",
      headers: {
        accept: "*/*",
        "Content-Type": "application/json",
        "gk-merchant-id": merchantId,
        "gk-phone": phoneNumber,
        "gk-access-token": token,
      },
      body: JSON.stringify(upstreamPayload),
    });

    const data = response.data ?? response;
    return {
      success: true,
      data: {
        addresses: Array.isArray(data)
          ? (data as ApiAddress[])
          : ([data] as ApiAddress[]),
        phone: phoneNumber,
      },
      status_code: 200,
      timestamp: Date.now(),
    };
  } catch (error) {
    console.error("Address update error:", error);
    return null;
  }
}

/**
 * Delete an address.
 */
export async function deleteCustomerAddress(
  addressId: string,
  accessToken?: string | null
): Promise<AddressApiResponse | null> {
  const token = resolveAccessToken(accessToken);
  const baseUrl = getAddressApiBaseUrl();
  const merchantId = getMerchantId();
  if (!addressId || !token || !baseUrl || !merchantId) {
    return null;
  }

  try {
    const client = getCommerceClient();
    const response = await client.fetchRequest({
      url: `${baseUrl}/addresses/${addressId}`,
      method: "DELETE",
      headers: {
        accept: "*/*",
        "gk-merchant-id": merchantId,
        "gk-access-token": token,
      },
    });

    const data = response.data ?? response;
    return {
      success: true,
      status_code: 200,
      timestamp: Date.now(),
      ...((data as object) || {}),
    } as AddressApiResponse;
  } catch (error) {
    console.error("Address delete error:", error);
    return null;
  }
}
