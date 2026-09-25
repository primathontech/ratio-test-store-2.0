"use client";

import { useAuth } from "@shopkit/core/context";
import React, { useEffect, useState } from "react";
import { AccountData } from "../../Account/types";
import { deleteCustomerAddress, getCustomerAddresses } from "../api";
import { Address, AddressesSettings } from "../types";
import { getCustomerPhoneFromStorage } from "../utils/customerUtils";
import { AddAddress } from "./AddAddress";
import { AddressCard } from "./AddressCard";
import { Pagination } from "./Pagination";
import { UpdateAddress } from "./UpdateAddress";

const ADDRESSES_PER_PAGE = 5;

interface AddressesProps {
  data?: AccountData;
  addresses?: Address[];
  onAddressUpdate?: (updatedAddresses: any[]) => void;
  isInitialLoading?: boolean;
  settings?: AddressesSettings;
  accessToken?: string;
}

export const Addresses: React.FC<AddressesProps> = ({
  data,
  addresses = [],
  onAddressUpdate,
  isInitialLoading = false,
  settings,
  accessToken: accessTokenProp,
}) => {
  const { accessToken: authToken } = useAuth();
  const gkToken =
    typeof accessTokenProp === "string"
      ? accessTokenProp
      : typeof authToken === "string"
        ? authToken
        : ((authToken as { accessToken?: string; token?: string } | null)
            ?.accessToken ?? (authToken as { token?: string } | null)?.token);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const listLabels = {
    loading_addresses: "Loading addresses...",
    add_new_address_button: "Add a new address",
    pagination_prev_label: "Previous page",
    pagination_next_label: "Next page",
    pagination_page_current_prefix: "Page",
    pagination_page_other_prefix: "Go to page",
    ...(settings?.list || {}),
  };

  const displayAddresses = addresses.length > 0 ? addresses : [];
  const hasDefaultAddress = displayAddresses.some(
    (a) => a.isDefault || a.address_type === "default"
  );
  const totalPages = Math.max(
    1,
    Math.ceil(displayAddresses.length / ADDRESSES_PER_PAGE)
  );
  const paginatedAddresses = displayAddresses.slice(
    (currentPage - 1) * ADDRESSES_PER_PAGE,
    currentPage * ADDRESSES_PER_PAGE
  );

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [currentPage, totalPages]);

  const handleEdit = (address: Address) => {
    setEditingAddressId(address.address_id);
    setShowAddForm(false); // Close add form if open
  };

  const handleCancelEdit = (scrollToId?: string) => {
    const targetId = scrollToId || editingAddressId;
    setEditingAddressId(null);
    if (targetId) {
      requestAnimationFrame(() => {
        const el = document.querySelector(`[data-address-id="${targetId}"]`);
        el?.scrollIntoView({ behavior: "smooth", block: "center" });
      });
    }
  };

  const handleCancelAdd = () => {
    setShowAddForm(false);
  };
  const handleDelete = async (addressId: string) => {
    const token = gkToken ?? null;
    const phoneNumber =
      getCustomerPhoneFromStorage() ||
      data?.customer?.phone ||
      (authToken as { phone?: string })?.phone ||
      null;

    if (!addressId || !token) {
      console.error("Missing addressId or access token");
      return;
    }
    setIsDeleting(addressId);

    try {
      const deleteResult = await deleteCustomerAddress(addressId, token);

      if (deleteResult?.success && onAddressUpdate && phoneNumber) {
        const updatedAddresses = await getCustomerAddresses(phoneNumber, token);
        if (updatedAddresses?.success && updatedAddresses.data?.addresses) {
          onAddressUpdate(updatedAddresses.data.addresses);
        }
      }
    } catch (err) {
      console.error("Failed to delete address", err);
    } finally {
      setIsDeleting(null);
    }
  };

  const handleAddNewAddress = () => {
    if (showAddForm) {
      setShowAddForm(false);
    } else if (editingAddressId) {
      setEditingAddressId(null);
      setShowAddForm(true);
    } else {
      setShowAddForm(true);
    }
  };

  return (
    <div data-testid="momsco-addresses-container" className="flex-1">
      {/* Addresses Section */}
      <div>
        <>
          {/* Show loading state only when initially loading and no addresses */}
          {isInitialLoading && displayAddresses.length === 0 ? (
            <div className="flex items-center justify-center min-h-[200px]">
              <div className="text-gray-500 text-[14px]">
                {listLabels.loading_addresses}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {paginatedAddresses.map((address) => (
                <div
                  key={address.address_id}
                  data-address-id={address.address_id}
                  className={`border border-gray-200 rounded-[10px] p-[10px] !mb-[50px] !mt-0 ${
                    isDeleting === address.address_id ? "opacity-50" : ""
                  }`}
                >
                  {editingAddressId === address.address_id ? (
                    <>
                      <UpdateAddress
                        address={address}
                        data={data}
                        currentAddresses={displayAddresses}
                        onAddressUpdate={onAddressUpdate}
                        onCancel={handleCancelEdit}
                        settings={settings}
                        hasDefaultAddress={hasDefaultAddress}
                      />
                    </>
                  ) : (
                    <AddressCard
                      address={address}
                      isDeleting={isDeleting === address.address_id}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      onAddressUpdate={onAddressUpdate}
                      customerPhone={data?.customer?.phone || address.phone}
                      cardLabels={settings?.card}
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </>

        {/* Add new address button above the add form */}
        {showAddForm && !editingAddressId && (
          <div>
            <div className="flex flex-col justify-center items-center mb-[20px]">
              <button
                onClick={handleAddNewAddress}
                className="bg-black text-white px-[30.5px] py-[12px] rounded-[10px] text-[14px] font-semibold hover:bg-gray-800 transition-colors"
              >
                {listLabels.add_new_address_button}
              </button>
            </div>
            <AddAddress
              data={data}
              onAddressUpdate={onAddressUpdate}
              onCancel={handleCancelAdd}
              settings={settings}
              hasDefaultAddress={hasDefaultAddress}
            />
          </div>
        )}

        {/* Show add button when no forms are active OR when editing */}
        {(!showAddForm && !editingAddressId) || editingAddressId ? (
          <div className="flex flex-col justify-center items-center my-0 md:my-[20px]">
            <button
              onClick={handleAddNewAddress}
              className="bg-black text-white px-[24.5px] md:px-[30.5px] py-[8px] md:py-[12px] rounded-[10px] text-[14px] font-semibold transition-colors"
            >
              {listLabels.add_new_address_button}
            </button>
          </div>
        ) : null}

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          position="center"
        />
      </div>
    </div>
  );
};
