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
