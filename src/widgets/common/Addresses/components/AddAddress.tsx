"use client";

import { useAuth } from "@shopkit/core/context";
import React, { useState } from "react";
import { AccountData } from "../../Account/types";
import { createAddress, getCustomerAddresses } from "../api";
import { DEFAULT_INDIAN_STATE } from "../constants/indianStates";
import { AddressFormData, AddressesSettings } from "../types";
import {
  getCustomerEmailFromStorage,
  getCustomerPhoneFromStorage,
} from "../utils/customerUtils";
import { AddressForm } from "./AddressForm";

const API_FIELD_TO_FORM: Record<string, string> = {
  firstName: "firstName",
  lastName: "lastName",
  company: "company",
  address1: "address1",
  address2: "address2",
  city: "city",
  province: "state",
  zip: "zip",
  phone: "phone",
  email: "email",
  country: "country",
};

interface AddAddressProps {
  data?: AccountData;
  onAddressUpdate?: (updatedAddresses: any[]) => void;
  onCancel: () => void;
  settings?: AddressesSettings;
}

export const AddAddress: React.FC<AddAddressProps> = ({
  data,
  onAddressUpdate,
  onCancel,
  settings = {},
}) => {
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
    state: DEFAULT_INDIAN_STATE,
    country: "IN",
    zip: "",
    phone: "",
    isDefault: false,
  });
  const [submitError, setSubmitError] = useState<string>("");
  const [focusedFields, setFocusedFields] = useState<Set<string>>(new Set());
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validatePincode = (pincode: string): string => {
    if (!pincode.trim()) {
      return "Pincode is required";
    }
    // Indian pincode validation (6 digits)
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
    // Indian phone number validation (10 digits)
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

    // Validate fields on change
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");

    // Get customer details from localStorage
    const customerPhone = getCustomerPhoneFromStorage();
    const customerEmail =
      getCustomerEmailFromStorage() || data?.customer?.email || "";

    if (!customerPhone) {
      setSubmitError(
        "Customer phone number not found. Please try logging in again."
      );
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
    setErrors({});

    const payload = {
      first_name: formData.firstName,
      last_name: formData.lastName,
      email: customerEmail,
      company: formData.company,
      recipient_phone: formData.phone,
      country: formData.country,
      city: formData.city,
      state: formData.state,
      pincode: formData.zip,
      address_1: formData.address1,
      address_2: formData.address2 || "",
      address: formData.address1,
      address_type: formData.isDefault ? "default" : "home",
    };

    try {
      const createResult = await createAddress(
        payload,
        customerPhone,
        gkToken ?? undefined
      );

      if (createResult?.success) {
        if (onAddressUpdate) {
          await new Promise((resolve) => setTimeout(resolve, 100));
          const updatedAddresses = await getCustomerAddresses(
            customerPhone,
            gkToken ?? undefined
          );
          if (updatedAddresses?.success && updatedAddresses?.data?.addresses) {
            onAddressUpdate(updatedAddresses.data.addresses);
          }
        }
        onCancel();
      } else {
        const message =
          createResult?.statusCode === 409
            ? "Address already exists"
            : createResult?.error || "Failed to create address";
        setSubmitError(message);
        if (process.env.NODE_ENV !== "production") {
          console.error(
            "[AddAddress QA] Create failed:",
            message,
            createResult?.fieldErrors
          );
        }
        const fieldErrors = createResult?.fieldErrors ?? {};
        const mapped: Record<string, string> = {};
        for (const [apiField, msg] of Object.entries(fieldErrors)) {
          const formField = API_FIELD_TO_FORM[apiField] ?? apiField;
          if (formField in formData) {
            mapped[formField] = msg;
          }
        }
        if (Object.keys(mapped).length > 0) {
          setErrors((prev) => ({ ...prev, ...mapped }));
        }
      }
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "An unexpected error occurred. Please try again.";
      setSubmitError(message);
      if (process.env.NODE_ENV !== "production") {
        console.error("[AddAddress QA] Create exception:", err);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {submitError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600 text-sm">{submitError}</p>
        </div>
      )}
      <AddressForm
        formData={formData}
        focusedFields={focusedFields}
        errors={errors}
        isSubmitting={isSubmitting}
        onInputChange={handleInputChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onSubmit={handleSubmit}
        onCancel={onCancel}
        submitButtonText={
          isSubmitting
            ? (settings.adding_address_button ?? "Adding...")
            : (settings.add_address_button ?? "Add address")
        }
        title={settings.add_address_title ?? "Add a new address"}
        formLabels={settings.form}
      />
    </>
  );
};
