import { getCustomerDetails } from "../../Account/api";

/**
 * Helper function to get phone number from localStorage
 */
export const getPhoneFromStorage = (): string | null => {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const customerDetails = localStorage.getItem("customerDetails");
    if (customerDetails) {
      const parsed = JSON.parse(customerDetails);
      return parsed.phone || null;
    }
  } catch (error) {
    console.error("Error reading phone from localStorage:", error);
  }
  return null;
};

/**
 * Helper function to fetch customer details and store phone in localStorage
 */
export const fetchAndStoreCustomerDetails = async (
  accessToken: string
): Promise<string | null> => {
  if (!accessToken) {
    return null;
  }

  try {
    const gkMerchantId = process.env.NEXT_PUBLIC_MERCHANT_ID || "";
    const customerData = await getCustomerDetails(accessToken, gkMerchantId);

    if (customerData) {
      const phone =
        customerData.phone || customerData.defaultAddress?.phone || null;

      if (phone) {
        // Store customer details in localStorage for future use
        const customerDetails = {
          email: customerData.email || customerData.defaultAddress?.email || "",
          phone: phone,
          firstName:
            customerData.firstName ||
            customerData.defaultAddress?.firstName ||
            "",
          lastName:
            customerData.lastName ||
            customerData.defaultAddress?.lastName ||
            "",
        };

        if (typeof window !== "undefined") {
          localStorage.setItem(
            "customerDetails",
            JSON.stringify(customerDetails)
          );
        }

        return phone;
      }
    }
  } catch (error) {
    console.error("Error fetching customer details:", error);
  }

  return null;
};

/**
 * Helper function to resolve phone number with priority logic
 * 1. First checks localStorage
 * 2. Falls back to fetching customer details using accessToken
 */
export const resolvePhoneNumber = async (
  accessToken?: string
): Promise<string | null> => {
  // Step 1: Check localStorage first
  const phoneFromStorage = getPhoneFromStorage();
  if (phoneFromStorage) {
    return phoneFromStorage;
  }

  // Step 2: Fallback to accessToken - fetch customer details
  if (accessToken) {
    return await fetchAndStoreCustomerDetails(accessToken);
  }

  return null;
};
