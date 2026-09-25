import { Customer } from "./type";

/**
 * Fetches customer profile using access token and merchant ID.
 */
export const getCustomerDetails = async (
  gkAccessToken: string,
  gkMerchantId: string
): Promise<Customer | null> => {
  try {
    // eslint-disable-next-line no-restricted-syntax
    const response = await fetch("/api/v1/customer", {
      method: "GET",
      headers: {
        "gk-access-token": gkAccessToken,
        "gk-merchant-id": gkMerchantId,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      console.error(`API Error: ${response.status} ${response.statusText}`);
      return null;
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error fetching customer details:", error);
    return null;
  }
};
