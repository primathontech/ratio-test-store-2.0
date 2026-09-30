"use client";

import { useAuth } from "@shopkit/core/context";
import React, { useEffect, useState } from "react";
import { AccountData } from "../../Account/types";
import { getCustomerAddresses, updateCustomerAddress } from "../api";
import { DEFAULT_INDIAN_STATE, INDIAN_STATES } from "../constants/indianStates";
import { Address, AddressFormData, AddressesSettings } from "../types";
import {
  getCustomerEmailFromStorage,
  getCustomerPhoneFromStorage,
} from "../utils/customerUtils";
import { AddressCard } from "./AddressCard";

interface UpdateAddressProps {
  address: Address;
  data?: AccountData;
  currentAddresses?: Address[];
  onAddressUpdate?: (updatedAddresses: any[]) => void;
  onCancel: () => void;
  settings?: AddressesSettings;
}

const DEFAULT_FORM_LABELS = {
  first_name: "First name",
  last_name: "Last name",
  company: "Company",
  address1: "Address 1",
  address2: "Address 2",
  city: "City",
  country_region: "Country/region",
  select_placeholder: "---",
  india: "India",
  province: "Province",
  postal_zip_code: "Postal/ZIP code",
  phone: "Phone",
  set_as_default: "Set as default address",
  cancel: "Cancel",
} as const;

export const UpdateAddress: React.FC<UpdateAddressProps> = ({
  address,
  onAddressUpdate,
  onCancel,
  settings = {},
}) => {
  const labels = { ...DEFAULT_FORM_LABELS, ...settings?.form };
  const { accessToken } = useAuth();
  const gkToken =
    typeof accessToken === "string"
      ? accessToken
      : ((accessToken as { accessToken?: string; token?: string } | null)
          ?.accessToken ?? (accessToken as { token?: string } | null)?.token);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<AddressFormData>({
    firstName: "",
    lastName: "",
    company: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    country: "",
    zip: "",
    phone: "",
    isDefault: false,
  });
  const [focusedFields, setFocusedFields] = useState<Set<string>>(new Set());
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const formValues = {
      firstName: address.first_name || "",
      lastName: address.last_name || "",
      company: address.company || "",
      address1: address.address || "",
      address2: address.address2 || "",
      city: address.city || "",
      state: address.state || "",
      country: address.country || "",
      zip: address.pincode || address.zip || "",
      phone: address.recipient_phone || address.phone || "",
      isDefault:
        address.address_type === "default" || address.isDefault === true,
    };

    setFormData(formValues);

    const newFocusedFields = new Set<string>();
    if (formValues.firstName) {
      newFocusedFields.add("firstName");
    }
    if (formValues.lastName) {
      newFocusedFields.add("lastName");
    }
    if (formValues.company) {
      newFocusedFields.add("company");
    }
    if (formValues.address1) {
      newFocusedFields.add("address1");
    }
    if (formValues.address2) {
      newFocusedFields.add("address2");
    }
    if (formValues.city) {
      newFocusedFields.add("city");
    }
    if (formValues.state) {
      newFocusedFields.add("state");
    }
    if (formValues.country) {
      newFocusedFields.add("country");
    }
    if (formValues.zip) {
      newFocusedFields.add("zip");
    }
    if (formValues.phone) {
      newFocusedFields.add("phone");
    }

    setFocusedFields(newFocusedFields);
  }, [address]);

  const validatePincode = (pincode: string): string => {
    if (!pincode.trim()) {
      return "Pincode is required";
    }
    const pincodeRegex = /^\d{6}$/;
    if (!pincodeRegex.test(pincode.trim())) {
      return "Please enter a valid 6-digit pincode";
    }
    return "";
  };

  const validatePhone = (phone: string): string => {
    if (!phone.trim()) {
      return "Phone number is required";
    }
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(phone.trim())) {
      return "Please enter a valid 10-digit phone number";
    }
    return "";
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const newValue =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : value;

    setFormData((prev) => {
      const next = { ...prev, [name]: newValue };
      if (name === "country" && (value === "IN" || value === "India")) {
        next.state = DEFAULT_INDIAN_STATE;
      }
      return next;
    });

    if (name === "zip") {
      const error = validatePincode(value);
      setErrors((prev) => ({
        ...prev,
        zip: error,
      }));
    } else if (name === "phone") {
      const error = validatePhone(value);
      setErrors((prev) => ({
        ...prev,
        phone: error,
      }));
    }
  };

  const handleFocus = (fieldName: string) => {
    setFocusedFields((prev) => new Set(prev).add(fieldName));
  };

  const handleBlur = (fieldName: string) => {
    if (!formData[fieldName as keyof typeof formData]) {
      setFocusedFields((prev) => {
        const newSet = new Set(prev);
        newSet.delete(fieldName);
        return newSet;
      });
    }
  };

  const cleanPayload = (payload: Record<string, any>) => {
    const cleaned: Record<string, any> = {};
    for (const [key, value] of Object.entries(payload)) {
      if (value !== "" && value !== null && value !== undefined) {
        cleaned[key] = value;
      }
    }
    return cleaned;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const phoneNumber = getCustomerPhoneFromStorage();
    const email = getCustomerEmailFromStorage();
    if (!phoneNumber) {
      console.error("No customer phone number found in localStorage");
      return;
    }

    const pincodeError = validatePincode(formData.zip);
    const phoneError = validatePhone(formData.phone);

    if (pincodeError || phoneError) {
      setErrors((prev) => ({
        ...prev,
        zip: pincodeError,
        phone: phoneError,
      }));
      return;
    }
    setIsSubmitting(true);

    const payload = {
      phone: phoneNumber,
      first_name: formData.firstName,
      last_name: formData.lastName,
      email: email || "",
      company: formData.company,
      recipient_phone: formData.phone,
      country: formData.country,
      city: formData.city,
      state: formData.state,
      pincode: formData.zip,
      address_1: formData.address1,
      address_2: formData.address2,
      address: formData.address1,
      address_type: "home",
      is_default: formData.isDefault,
      isDefault: formData.isDefault,
    };
    try {
      const cleanedPayload = cleanPayload(payload);
      const updateResult = await updateCustomerAddress(
        address.address_id,
        cleanedPayload,
        phoneNumber,
        gkToken ?? undefined
      );

      if (updateResult?.success && onAddressUpdate) {
        const updatedAddresses = await getCustomerAddresses(
          phoneNumber,
          gkToken ?? undefined
        );
        if (
          updatedAddresses?.success &&
          updatedAddresses?.data?.addresses != null
        ) {
          onAddressUpdate([...updatedAddresses.data.addresses]);
          onCancel();
        }
      }
    } catch {
      // preserve existing behavior: no UI break
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-2xl">
      <div className="text-center space-y-2">
        <AddressCard
          address={address}
          isDeleting={false}
          onEdit={() => {}}
          onDelete={() => {}}
          cardLabels={settings?.card}
        />
      </div>

      <div className="pt-[15px] md:pt-2.5 pb-[15px] md:pb-5 px-[15px] md:px-10 mt-5 border border-neutral-200 rounded-2xl shadow-sm">
        <h2 className="text-sm font-semibold tracking-tight text-[#1D1D1D] my-5 text-center">
          {settings.edit_address_title ?? "Edit address"}
        </h2>

        {/* Address Form */}
        <form onSubmit={handleSubmit} className="mx-auto">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="relative">
              <label
                className={`absolute left-[18px] text-neutral-500 transition-all duration-200 pointer-events-none ${
                  focusedFields.has("firstName") || formData.firstName
                    ? "top-[5px] text-xs"
                    : "text-sm"
                }`}
              >
                {labels.first_name}
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                onFocus={() => handleFocus("firstName")}
                onBlur={() => handleBlur("firstName")}
                disabled={isSubmitting}
                className="w-full px-[18px] pt-5 pb-1.5 border border-neutral-200 rounded-xl text-sm text-neutral-700 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-neutral-400 disabled:bg-neutral-50 disabled:cursor-not-allowed"
              />
            </div>
            <div className="relative">
              <label
                className={`absolute left-[18px] text-neutral-500 transition-all duration-200 pointer-events-none ${
                  focusedFields.has("lastName") || formData.lastName
                    ? "top-[5px] text-xs"
                    : "text-sm"
                }`}
              >
                {labels.last_name}
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                onFocus={() => handleFocus("lastName")}
                onBlur={() => handleBlur("lastName")}
                disabled={isSubmitting}
                className="w-full  px-[18px] pt-5 pb-1.5 border border-neutral-200 rounded-xl text-sm text-neutral-700 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-neutral-400 disabled:bg-neutral-50 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          <div className="mt-[15px] relative">
            <label
              className={`absolute left-[18px] text-neutral-500 transition-all duration-200 pointer-events-none ${
                focusedFields.has("company") || formData.company
                  ? "top-[5px] text-xs"
                  : "text-sm"
              }`}
            >
              {labels.company}
            </label>
            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleInputChange}
              onFocus={() => handleFocus("company")}
              onBlur={() => handleBlur("company")}
              disabled={isSubmitting}
              className="w-full  px-[18px] pt-5 pb-1.5 border border-neutral-200 rounded-xl !text-sm text-neutral-700 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-neutral-400 disabled:bg-neutral-50 disabled:cursor-not-allowed"
            />
          </div>

          <div className="mt-[15px] relative">
            <label
              className={`absolute left-[18px] text-neutral-500 transition-all duration-200 pointer-events-none ${
                focusedFields.has("address1") || formData.address1
                  ? "top-[5px] text-xs"
                  : "!text-sm"
              }`}
            >
              {labels.address1}
            </label>
            <input
              type="text"
              name="address1"
              value={formData.address1}
              onChange={handleInputChange}
              onFocus={() => handleFocus("address1")}
              onBlur={() => handleBlur("address1")}
              disabled={isSubmitting}
              className="w-full px-[18px] pt-5 pb-1.5 border border-neutral-200 rounded-xl text-sm text-neutral-700 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-neutral-400 disabled:bg-neutral-50 disabled:cursor-not-allowed"
            />
          </div>

          <div className="mt-[15px] relative">
            <label
              className={`absolute left-[18px] text-neutral-500 transition-all duration-200 pointer-events-none ${
                focusedFields.has("address2") || formData.address2
                  ? "top-[5px] text-xs"
                  : "text-sm"
              }`}
            >
              {labels.address2}
            </label>
            <input
              type="text"
              name="address2"
              value={formData.address2}
              onChange={handleInputChange}
              onFocus={() => handleFocus("address2")}
              onBlur={() => handleBlur("address2")}
              disabled={isSubmitting}
              className="w-full px-[18px] pt-5 pb-1.5 border border-neutral-200 rounded-xl text-sm text-neutral-700 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-neutral-400 disabled:bg-neutral-50 disabled:cursor-not-allowed"
            />
          </div>

          <div className="mt-[15px] relative">
            <label
              className={`absolute left-[18px] text-neutral-500 transition-all duration-200 pointer-events-none ${
                focusedFields.has("city") || formData.city
                  ? "top-[5px] text-xs"
                  : "text-sm"
              }`}
            >
              {labels.city}
            </label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              onFocus={() => handleFocus("city")}
              onBlur={() => handleBlur("city")}
              disabled={isSubmitting}
              className="w-full px-[18px] pt-5 pb-1.5 border border-neutral-200 rounded-xl text-sm text-neutral-700 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-neutral-400 disabled:bg-neutral-50 disabled:cursor-not-allowed"
            />
          </div>

          <div className="mt-[15px] relative">
            <label
              className={`left-[18px] !text-sm text-neutral-500 transition-all duration-200 pointer-events-none z-10 ${
                focusedFields.has("country") || formData.country
                  ? "top-[5px] text-xs"
                  : "text-sm"
              }`}
            >
              {labels.country_region}
            </label>
            <select
              name="country"
              value={formData.country}
              onChange={handleInputChange}
              onFocus={() => handleFocus("country")}
              onBlur={() => handleBlur("country")}
              disabled={isSubmitting}
              className="w-full px-[18px] py-[13px] border border-neutral-200 rounded-xl text-sm text-neutral-700 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-neutral-400 appearance-none bg-white pr-10 disabled:bg-neutral-50 disabled:cursor-not-allowed"
            >
              <option value="" className="text-primary">
                {labels.select_placeholder}
              </option>
              <option value="IN" className="text-neutral-600">
                {labels.india}
              </option>
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2 4L6 8L10 4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>

          <div className="mt-[15px]">
            <p className="text-neutral-500 text-sm font-body">
              {labels.province}
            </p>
            <div className="relative">
              <select
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                onFocus={() => handleFocus("state")}
                onBlur={() => handleBlur("state")}
                disabled={isSubmitting}
                className="w-full px-[18px] py-[13px] border border-neutral-200 rounded-xl text-sm text-neutral-700 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-neutral-400 appearance-none bg-white pr-10 disabled:bg-neutral-50 disabled:cursor-not-allowed cursor-pointer"
              >
                <option value="" className="text-primary">
                  {labels.select_placeholder}
                </option>
                {INDIAN_STATES.map((state) => (
                  <option
                    key={state}
                    value={state}
                    className="text-neutral-600"
                  >
                    {state}
                  </option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none flex items-center justify-center">
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M2 4L6 8L10 4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="mt-[15px] relative">
            <label
              className={`absolute left-[18px] text-neutral-500 transition-all duration-200 pointer-events-none ${
                focusedFields.has("zip") || formData.zip
                  ? "top-[5px] text-xs"
                  : "text-sm"
              }`}
            >
              {labels.postal_zip_code}
            </label>
            <input
              type="text"
              name="zip"
              value={formData.zip}
              onChange={handleInputChange}
              onFocus={() => handleFocus("zip")}
              onBlur={() => handleBlur("zip")}
              disabled={isSubmitting}
              className={`w-full px-[18px] pt-6 pb-[7px] border border-neutral-200 rounded-xl text-sm text-neutral-700 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-neutral-400 disabled:bg-neutral-50 disabled:cursor-not-allowed`}
            />
            {errors.zip && (
              <div className="text-red-500 text-xs mt-1 px-[18px]">
                {errors.zip}
              </div>
            )}
          </div>

          <div className="mt-[15px] relative">
            <label
              className={`absolute left-[18px] text-neutral-500 transition-all duration-200 pointer-events-none ${
                focusedFields.has("phone") || formData.phone
                  ? "top-[5px] text-xs"
                  : "text-sm"
              }`}
            >
              {labels.phone}
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              onFocus={() => handleFocus("phone")}
              onBlur={() => handleBlur("phone")}
              disabled={isSubmitting}
              className={`w-full px-[18px] pt-6 pb-[7px] border rounded-xl text-sm text-neutral-700 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-neutral-400 disabled:bg-neutral-50 disabled:cursor-not-allowed ${
                errors.phone ? "border-red-500" : "border-neutral-200"
              }`}
            />
            {errors.phone && (
              <div className="text-red-500 text-xs mt-1 px-[18px]">
                {errors.phone}
              </div>
            )}
          </div>

          <div>
            <label className="flex items-center gap-2 cursor-pointer mt-[15px]">
              <input
                type="checkbox"
                name="isDefault"
                checked={formData.isDefault}
                onChange={handleInputChange}
                disabled={isSubmitting}
                className="w-4 h-4 text-black border-neutral-200 rounded focus:ring-black/20 disabled:cursor-not-allowed"
              />
              <span className="text-sm text-neutral-700">
                {labels.set_as_default}
              </span>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mt-[15px]">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-black text-white md:ml-5 my-10 px-6 lg:px-[30px] py-3 rounded-full text-sm font-semibold hover:bg-neutral-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shine-link-button"
            >
              {isSubmitting
                ? (settings.updating_address_button ?? "Updating...")
                : (settings.update_address_button ?? "Update address")}
            </button>
            <button
              type="button"
              onClick={onCancel}
              disabled={isSubmitting}
              className="bg-white text-black ring-1 ring-black/10 md:ml-5 my-10 px-6 lg:px-[30px] py-3 rounded-full text-sm font-semibold hover:bg-neutral-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {labels.cancel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
