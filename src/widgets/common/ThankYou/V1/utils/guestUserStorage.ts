/**
 * GuestUserStorage
 *
 * Reads/writes guest checkout user data (token, phone, etc.) from localStorage.
 * Used by the ThankYou page to authenticate the order-fetch request when the
 * user is not logged in.
 */
const KEYS = {
  GUESTUSERDATA: "GUESTUSERDATA",
};

export const GuestUserStorage = {
  saveGuestUserData: (data: any): void => {
    if (data) {
      localStorage.setItem(KEYS.GUESTUSERDATA, JSON.stringify(data));
    }
  },

  getGuestUserData: (): any | null => {
    try {
      const data = localStorage.getItem(KEYS.GUESTUSERDATA);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error("Error parsing guest user data:", error);
      return null;
    }
  },

  clear: (): void => {
    Object.values(KEYS).forEach((key) => {
      localStorage.removeItem(key);
    });
  },
};
