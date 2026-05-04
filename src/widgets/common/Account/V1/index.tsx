"use client";

import { useAuth } from "@shopkit/core/context";
import { clearKwikpassAuthStorage } from "@/integrations/kwikpass-custom";
import { usePathname } from "next/navigation";
import React, { useCallback, useMemo } from "react";
import { defaultSettings, getDefaultNavigationItems } from "../common/constant";
import { LeftSideBar } from "../common/LeftSideBar";
import { AccountDetails } from "../components/AccountDetails";
import { useAccountData } from "../hooks/useAccountData";
import { AccountProps } from "../types";

export const AccountV1: React.FC<AccountProps> = ({ data, settings = {} }) => {
  const pathname = usePathname();
  const { logout: authLogout } = useAuth();
  const { customer, addressCount, loading, error } = useAccountData();

  const hasAddresses = (data?.addressesCount ?? addressCount) > 0;
  const isAddressListEmpty = !hasAddresses;

  const getFieldValue = useCallback(
    (field: string) =>
      (customer as any)?.[field] ||
      (customer?.defaultAddress as any)?.[field] ||
      " ",
    [customer]
  );

  const customerEmail = getFieldValue("email");
  const firstName = getFieldValue("firstName").trim();
  const lastName = getFieldValue("lastName").trim();
  const hasName = Boolean(firstName || lastName);
  const customerName = hasName
    ? `${firstName} ${lastName}`.trim()
    : customerEmail || "Guest";

  const customerDetailsArray = useMemo(() => {
    const configs = [
      {
        key: "name",
        label: "Name",
        value: customerName,
        condition: customerName !== "Guest",
      },
      { key: "email", label: "E-mail", value: customerEmail },
      { key: "address1", label: "Address 1", value: getFieldValue("address1") },
      { key: "address2", label: "Address 2", value: getFieldValue("address2") },
      {
        key: "country",
        label: "Country/region",
        value: (() => {
          const city = getFieldValue("city");
          const country = getFieldValue("country");
          const formattedCountry = country
            ? country
                .split(" ")
                .map(
                  (w: string) =>
                    w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()
                )
                .join(" ")
            : "";
          return [city, formattedCountry]
            .filter((v) => v && v.trim())
            .join(", ");
        })(),
      },
      { key: "zip", label: "Postal/ZIP code", value: getFieldValue("zip") },
      { key: "phone", label: "Phone", value: getFieldValue("phone") },
    ];

    return configs
      .filter(
        ({ key, value, condition = true }) =>
          value &&
          condition &&
          (!isAddressListEmpty || key === "name" || key === "email")
      )
      .map(({ label, value }) => ({ label, value }));
  }, [customerName, customerEmail, getFieldValue, isAddressListEmpty]);

  const config = useMemo(
    () => ({
      ...defaultSettings,
      ...settings,
      navigationItems:
        settings.navigationItems ||
        getDefaultNavigationItems(
          pathname === "/account",
          false,
          false,
          addressCount
        ),
    }),
    [settings, pathname, addressCount]
  );

  const handleLogout = useCallback(() => {
    clearKwikpassAuthStorage();
    if (typeof window !== "undefined" && (window as any).handleLogout) {
      (window as any).handleLogout("/");
    }
    authLogout();
    window.location.replace("/");
  }, [authLogout]);

  // Show loading state
  if (loading) {
    return (
      <div className="bg-white">
        <div className="mx-auto">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading customer data...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      data-testid="account-container"
      className="bg-white min-h-[600px] md:min-h-[341px]"
    >
      <div data-testid="account-inner-container" className="mx-auto">
        <div
          data-testid="account-grid"
          className="grid grid-cols-1 md:grid-cols-[1fr_3fr] gap-4 px-[15px] md:px-[30px] xl:px-[70px]"
        >
          {/* Left Sidebar */}
          <LeftSideBar
            showGetAppBanner={config.showGetAppBanner}
            getAppBannerTitle={config.getAppBannerTitle}
            getAppBannerSubtitle={config.getAppBannerSubtitle}
            getAppButtonText={config.getAppButtonText}
            getAppButtonUrl={config.getAppButtonUrl}
            navigationItems={config.navigationItems}
            onLogout={handleLogout}
            isNavSticky
          />

          {/* Main Content Area - key remounts on pathname change to re-trigger entrance animation */}
          <main
            key={pathname}
            className="flex-1"
            data-testid="account-main-content"
          >
            {error ? (
              <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                  <div className="text-red-500 text-xl mb-4">⚠️</div>
                  <p className="text-red-600 mb-4">{error}</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    Retry
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Greeting */}
                <div>
                  <p className="text-primary text-sm">
                    {config.greetingText} <strong>{customerName}</strong>{" "}
                    {customerEmail && (
                      <>
                        ({config.notYouText} <strong>{customerName}</strong>?{" "}
                        <button
                          onClick={handleLogout}
                          className="transition-colors duration-300 text-primary hover:text-[#0089dd] font-normal underline decoration-primary/12 underline-offset-4"
                        >
                          {config.logoutText}
                        </button>
                        )
                      </>
                    )}
                  </p>
                </div>

                {/* Account Details */}
                <AccountDetails
                  customerDetails={customerDetailsArray}
                  accountDetailsTitle={config.accountDetailsTitle}
                />
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};
