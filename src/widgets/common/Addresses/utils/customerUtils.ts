/**
 * Utility functions for handling customer data from localStorage
 */

interface CustomerDetails {
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
}

/**
 * Get customer details from localStorage
 * @returns CustomerDetails object or null if not found
 */
export const getCustomerDetailsFromStorage = (): CustomerDetails | null => {
  try {
    const storedCustomerDetails = localStorage.getItem("customerDetails");
    if (storedCustomerDetails) {
      return JSON.parse(storedCustomerDetails);
    }
  } catch (error) {
    console.warn("Error reading customer details from localStorage:", error);
  }
  return null;
};

/**
 * Get customer phone number from localStorage
 * @returns phone number string or null if not found
 */
export const getCustomerPhoneFromStorage = (): string | null => {
  const customerDetails = getCustomerDetailsFromStorage();
  return customerDetails?.phone || null;
};

/**
 * Get customer email from localStorage
 * @returns email string or null if not found
 */
export const getCustomerEmailFromStorage = (): string | null => {
  const customerDetails = getCustomerDetailsFromStorage();
  return customerDetails?.email || null;
};
