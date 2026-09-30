"use client";

import { useAuth } from "@shopkit/core/context";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { getCustomerAddresses } from "../../Addresses/api";
import { getCustomerPhoneFromStorage } from "../../Addresses/utils/customerUtils";
import { getCustomerDetails } from "../api";
import { Customer } from "../api/type";

interface AccountDataState {
  customer: Customer | null;
  addressCount: number;
  loading: boolean;
  error: string;
  refetchAccountData: () => void;
}

const placeholderFn = () => {};
const AccountDataContext = createContext<AccountDataState>({
  customer: null,
  addressCount: 0,
  loading: true,
  error: "",
  refetchAccountData: placeholderFn,
});

function resolveToken(authToken: unknown): string {
  if (typeof authToken === "string") {
    return authToken;
  }
  const t = authToken as { accessToken?: string; token?: string } | null;
  return t?.accessToken ?? t?.token ?? "";
}

function storeCustomerLocally(customer: Customer): void {
  const details = {
    email: customer.email || customer.defaultAddress?.email || "",
    phone: customer.phone || customer.defaultAddress?.phone || "",
    firstName: customer.firstName || customer.defaultAddress?.firstName || "",
    lastName: customer.lastName || customer.defaultAddress?.lastName || "",
  };
  if (details.email || details.phone) {
    localStorage.setItem("customerDetails", JSON.stringify(details));
  }
}

function extractAddressCount(
  response: Awaited<ReturnType<typeof getCustomerAddresses>>
): number {
  return response?.success && response.data?.addresses
    ? response.data.addresses.length
    : 0;
}

// Single provider lives in ProtectedRoute — mounts once per page, fetches once.
// Every widget that calls useAccountData() reads from this shared state.
export function AccountDataProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { accessToken: authToken } = useAuth();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [addressCount, setAddressCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Tracks which token we already started fetching for.
  // When React Strict Mode fires the effect a second time with the same token,
  // the guard below skips the second fetch entirely — no duplicate network calls.
  const fetchedForToken = useRef<string>("");
  const gkMerchantId = process.env.NEXT_PUBLIC_MERCHANT_ID || "";

  const runFetch = useCallback(
    async (gkToken: string, showLoading: boolean) => {
      try {
        if (showLoading) {
          setLoading(true);
          setError("");
        }
        const cachedPhone = getCustomerPhoneFromStorage();
        if (cachedPhone) {
          const [customerResult, addressResult] = await Promise.all([
            getCustomerDetails(gkToken, gkMerchantId),
            getCustomerAddresses(cachedPhone, gkToken),
          ]);
          if (fetchedForToken.current !== gkToken) {
            return;
          }
          if (customerResult) {
            storeCustomerLocally(customerResult);
            setCustomer(customerResult);
          } else if (showLoading) {
            setError("Failed to fetch customer data");
          }
          setAddressCount(extractAddressCount(addressResult));
        } else {
          const customerResult = await getCustomerDetails(
            gkToken,
            gkMerchantId
          );
          if (fetchedForToken.current !== gkToken) {
            return;
          }
          if (!customerResult) {
            if (showLoading) {
              setError("Failed to fetch customer data");
            }
            return;
          }
          storeCustomerLocally(customerResult);
          setCustomer(customerResult);
          const phone =
            customerResult.phone || customerResult.defaultAddress?.phone;
          if (phone) {
            const addressResult = await getCustomerAddresses(phone, gkToken);
            if (fetchedForToken.current !== gkToken) {
              return;
            }
            setAddressCount(extractAddressCount(addressResult));
          }
        }
      } catch {
        if (fetchedForToken.current === gkToken && showLoading) {
          setError("An error occurred while fetching customer data");
        }
      } finally {
        if (fetchedForToken.current === gkToken) {
          setLoading(false);
        }
      }
    },
    [gkMerchantId]
  );

  const refetchAccountData = useCallback(() => {
    const gkToken = resolveToken(authToken);
    if (gkToken) {
      runFetch(gkToken, false);
    }
  }, [authToken, runFetch]);

  useEffect(() => {
    const gkToken = resolveToken(authToken);
    if (!gkToken) {
      setLoading(false);
      return;
    }
    if (gkToken === fetchedForToken.current) {
      return;
    }
    fetchedForToken.current = gkToken;
    runFetch(gkToken, true);
  }, [authToken, runFetch]);

  return (
    <AccountDataContext.Provider
      value={{ customer, addressCount, loading, error, refetchAccountData }}
    >
      {children}
    </AccountDataContext.Provider>
  );
}

export const useAccountData = () => useContext(AccountDataContext);
