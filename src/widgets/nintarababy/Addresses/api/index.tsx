import {
  AddressApiResponse,
  CustomerApiResponse,
  AddressPayload,
  AddressResponse,
} from "./type";

/**
 * Fetches customer details using access token and merchant ID.
 *
 * @param gkAccessToken - The customer's access token
 * @param gkMerchantId - The merchant ID
 * @returns The customer details response or null if the request fails.
 */
export const getCustomerDetails = async (
  gkAccessToken: string,
  gkMerchantId: string
): Promise<CustomerApiResponse | null> => {
  try {
    // eslint-disable-next-line no-restricted-syntax
    const response = await fetch("/api/v1/customer", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "gk-access-token": gkAccessToken,
        "gk-merchant-id": gkMerchantId,
      },
    });

    if (!response.ok) {
      return null;
    }
    const result: CustomerApiResponse = await response.json();
    return result;
  } catch {
    return null;
  }
};

/**
 * Fetches customer addresses by phone number.
 *
 * @param phoneNumber - The customer's phone number
 * @param accessToken
 * @returns The address details response or null if the request fails.
 */
export const getCustomerAddresses = async (
  phoneNumber: string,
  accessToken?: string | null
): Promise<AddressApiResponse | null> => {
  if (!accessToken) {
    return null;
  }
  try {
    // eslint-disable-next-line no-restricted-syntax
    const response = await fetch("/api/v1/address", {
      method: "GET",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        "gk-phone": phoneNumber,
        "gk-access-token": accessToken,
      },
    });
    if (!response.ok) {
      return null;
    }
    const result: AddressApiResponse = await response.json();
    return result;
  } catch {
    return null;
  }
};

export const updateCustomerAddress = async (
  addressId: string,
  payload: Record<string, unknown>,
  phoneNumber: string,
  accessToken?: string | null
): Promise<AddressApiResponse | null> => {
  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (accessToken) {
      headers["gk-phone"] = phoneNumber;
      headers["gk-access-token"] = accessToken;
    }

    // eslint-disable-next-line no-restricted-syntax
    const response = await fetch(`/api/v1/address/${addressId}`, {
      method: "PUT",
      headers,
      body: JSON.stringify(payload),
    });

    const result: AddressApiResponse = await response.json();
    if (!response.ok) {
      return result;
    }
    return result;
  } catch {
    return null;
  }
};

export const deleteCustomerAddress = async (
  addressId: string,
  accessToken: string
): Promise<AddressApiResponse | null> => {
  if (!accessToken) {
    return null;
  }
  try {
    const merchantId = process.env.NEXT_PUBLIC_MERCHANT_ID || "";
    // eslint-disable-next-line no-restricted-syntax
    const response = await fetch(`/api/v1/address/${addressId}`, {
      method: "DELETE",
      headers: {
        accept: "*/*",
        "gk-merchant-id": merchantId,
        "gk-access-token": accessToken,
      },
    });

    if (!response.ok) {
      return null;
    }
    const result: AddressApiResponse = await response.json();
    return result;
  } catch {
    return null;
  }
};
/**
 * Creates a new address
 *
 * @param payload - Address payload
 * @param customerPhone
 * @param accessToken
 * @returns
 */
export const createAddress = async (
  payload: AddressPayload,
  customerPhone: string,
  accessToken?: string | null
): Promise<AddressResponse | null> => {
  if (!accessToken) {
    return {
      success: false,
      error: "Authentication required",
      fieldErrors: {},
    };
  }
  try {
    // eslint-disable-next-line no-restricted-syntax
    const response = await fetch("/api/v1/address", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "gk-phone": customerPhone,
        "gk-access-token": accessToken,
      },
      body: JSON.stringify(payload),
    });

    const result: AddressResponse = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error:
          result.error ??
          `API Error: ${response.status} ${response.statusText}`,
        fieldErrors: result.fieldErrors ?? {},
      };
    }

    return result.success ? result : { ...result, success: false };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown error occurred",
      fieldErrors: {},
    };
  }
};
