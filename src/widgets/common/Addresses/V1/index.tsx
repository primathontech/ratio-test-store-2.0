"use client";

import { useAuth } from "@shopkit/core/context";
import { clearKwikpassAuthStorage } from "@/integrations/kwikpass-custom";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { LeftSideBar } from "../../Account/common/LeftSideBar";
import {
  defaultSettings,
  getDefaultNavigationItems,
} from "../../Account/common/constant";
import { useAccountData } from "../../Account/hooks/useAccountData";
import { getCustomerAddresses, getCustomerDetails } from "../api";
import { AddressApiResponse } from "../api/type";
import { Addresses } from "../components/Addresses";
import { AddressesProps } from "../types";

export const AddressesV1: React.FC<AddressesProps> = ({
  settings = {},
  onAddressListEmptyChange,
}) => {
  const pathname = usePathname();
  const { accessToken, logout: authLogout } = useAuth();
  const [customerAddresses, setCustomerAddresses] =
    useState<AddressApiResponse | null>(null);
  const [customerDetails, setCustomerDetails] = useState<any>(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const { addressCount: baseAddressCount, refetchAccountData } =
    useAccountData();
  const addressCount =
    customerAddresses?.data?.addresses?.length ?? baseAddressCount;

  const addressList =
    customerAddresses?.data?.addresses?.map((address) => {
      const a = address as typeof address & {
        isDefault?: boolean;
        is_default?: boolean;
      };
      return {
        address_id: address.address_id,
        first_name: address.first_name,
        last_name: address.last_name,
        address: address.address,
        address2: address.address_line2 || undefined,
        city: address.city,
        state: address.state,
        zip: address.pincode,
        country: address.country,
        phone: address.recipient_phone || undefined,
        company: address.company || undefined,
        isDefault:
          a.isDefault === true ||
          a.is_default === true ||
          address.address_type === "default",
      };
    }) || [];
  const isAddressListEmpty = !isInitialLoad && addressList.length === 0;

  useEffect(() => {
    onAddressListEmptyChange?.(isAddressListEmpty);
  }, [isAddressListEmpty, onAddressListEmptyChange]);

  const fetchCustomerDetails = async (
    isMounted: boolean,
    phoneNumber: string
  ) => {
    try {
      const [customerData, customerAddresses] = await Promise.all([
        getCustomerDetails(phoneNumber),
        getCustomerAddresses(phoneNumber, accessToken),
      ]);
      if (isMounted && customerData?.success) {
        setCustomerDetails(customerData);
      }
      if (isMounted && customerAddresses?.success) {
        setCustomerAddresses(customerAddresses);
      }
    } catch (error) {
      console.error("Failed to fetch customer details:", error);
    } finally {
      if (isMounted) {
        setIsInitialLoad(false);
      }
    }
  };

  useEffect(() => {
    if (!accessToken) {
      setIsInitialLoad(false);
      return;
    }

    let isMounted = true;
    let phoneNumber: string | null = null;

    try {
      const storedCustomerDetails = localStorage.getItem("customerDetails");
      if (storedCustomerDetails) {
        const customerDetails = JSON.parse(storedCustomerDetails);
        if (customerDetails.phone) {
          phoneNumber = customerDetails.phone;
        }
      }
    } catch (error) {
      console.warn("Error reading customer details from localStorage:", error);
    }
    if (!phoneNumber && (accessToken as { phone?: string })?.phone) {
      phoneNumber = (accessToken as { phone?: string }).phone ?? null;
    }

    if (!phoneNumber) {
      setIsInitialLoad(false);
      return () => {
        isMounted = false;
      };
    }

    setIsInitialLoad(true);
    fetchCustomerDetails(isMounted, phoneNumber);

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken]);

  const handleAddressUpdate = (updatedAddresses: any[]) => {
    setCustomerAddresses((prev) => {
      const phone =
        prev?.data?.phone || (accessToken as { phone?: string })?.phone || "";
      if (!prev) {
        return {
          success: true,
          data: { addresses: updatedAddresses, phone },
        } as AddressApiResponse;
      }
      return {
        ...prev,
        data: { ...prev.data, addresses: updatedAddresses, phone },
      };
    });
    refetchAccountData();
  };

  const handleLogout = () => {
    clearKwikpassAuthStorage();
    if (typeof window !== "undefined" && (window as any).handleLogout) {
      (window as any).handleLogout("/");
    }
    authLogout();
    window.location.replace("/");
  };

  const isOrdersPage = pathname === "/pages/orders";
  const isAddressesPage = pathname === "/account/addresses";
  const isDashboardPage = pathname === "/account";

  const {
    showGetAppBanner = defaultSettings.showGetAppBanner,
    getAppBannerTitle = defaultSettings.getAppBannerTitle,
    getAppBannerSubtitle = defaultSettings.getAppBannerSubtitle,
    getAppButtonText = defaultSettings.getAppButtonText,
    getAppButtonUrl = defaultSettings.getAppButtonUrl,
    navigationItems = getDefaultNavigationItems(
      isDashboardPage,
      isOrdersPage,
      isAddressesPage,
      addressCount
    ),
  } = settings;

  return (
    <div className="bg-white min-h-[600px] md:min-h-[341px]">
      <div className="mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_3fr] gap-4 px-[15px] md:px-[30px] xl:px-[70px]">
          {/* Left Sidebar */}
          <LeftSideBar
            showGetAppBanner={showGetAppBanner}
            getAppBannerTitle={getAppBannerTitle}
            getAppBannerSubtitle={getAppBannerSubtitle}
            getAppButtonText={getAppButtonText}
            getAppButtonUrl={getAppButtonUrl}
            navigationItems={navigationItems}
            onLogout={handleLogout}
            isNavSticky
          />

          {/* Main Content Area - key remounts on pathname change to re-trigger entrance animation */}
          <main
            key={pathname}
            className="flex-1"
            data-testid="account-main-content"
          >
            {/* Addresses Component */}
            <Addresses
              addresses={addressList}
              data={{
                customer: {
                  firstName: customerDetails?.data?.firstname || "",
                  lastName: customerDetails?.data?.lastName || "",
                  email: customerDetails?.data?.email || "",
                  phone:
                    customerDetails?.data?.phone ||
                    (accessToken as { phone?: string })?.phone ||
                    "",
                },
              }}
              isInitialLoading={isInitialLoad}
              onAddressUpdate={handleAddressUpdate}
              settings={settings || {}}
            />
          </main>
        </div>
      </div>
    </div>
  );
};

export default AddressesV1;
