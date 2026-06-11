import { useState, useEffect, useRef } from "react";
import { useAuth } from "@shopkit/core/context";
import { getCustomerAddresses } from "../../Addresses/api";
import { getCustomerPhoneFromStorage } from "../../Addresses/utils/customerUtils";

const CACHE_KEY = "addressCount";

const getCachedCount = (): number | null => {
  if (typeof window === "undefined") {
    return null;
  }
  try {
    const cached = sessionStorage.getItem(CACHE_KEY);
    return cached !== null ? parseInt(cached, 10) : null;
  } catch {
    return null;
  }
};

const setCachedCount = (count: number) => {
  if (typeof window === "undefined") {
    return;
  }
  try {
    sessionStorage.setItem(CACHE_KEY, count.toString());
  } catch {
    // ignore
  }
};

export const useAddressCount = () => {
  const [addressCount, setAddressCount] = useState<number | null>(
    getCachedCount
  );
  const isInitialized = useRef(false);
  const { accessToken: authToken } = useAuth();

  const gkToken =
    typeof authToken === "string"
      ? authToken
      : ((authToken as { accessToken?: string; token?: string } | null)
          ?.accessToken ?? (authToken as { token?: string } | null)?.token);

  const fetchAddressCount = async () => {
    const phoneNumber = getCustomerPhoneFromStorage();

    if (!phoneNumber || !gkToken) {
      if (addressCount === null) {
        setAddressCount(0);
      }
      return;
    }

    try {
      const addressesResponse = await getCustomerAddresses(
        phoneNumber,
        gkToken
      );
      const count =
        addressesResponse?.success && addressesResponse.data?.addresses
          ? addressesResponse.data.addresses.length
          : 0;
      setAddressCount(count);
      setCachedCount(count);
    } catch (error) {
      console.error("Error fetching address count:", error);
      if (!isInitialized.current) {
        setAddressCount(0);
      }
    }
  };

  useEffect(() => {
    fetchAddressCount().finally(() => {
      isInitialized.current = true;
    });
  }, [gkToken]);

  return addressCount ?? 0;
};
