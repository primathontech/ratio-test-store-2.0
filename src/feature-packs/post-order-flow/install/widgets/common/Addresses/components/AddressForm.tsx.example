"use client";

import React from "react";
import { AddressFormProps } from "../types";
import { INDIAN_STATES } from "../constants/indianStates";

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

export const AddressForm: React.FC<AddressFormProps> = ({
  formData,
  focusedFields,
  errors,
  isSubmitting,
  onInputChange,
  onFocus,
  onBlur,
  onSubmit,
  onCancel,
  submitButtonText,
  title,
  formLabels,
  hideDefaultCheckbox,
}) => {
  const labels = { ...DEFAULT_FORM_LABELS, ...formLabels };

  const isFloating = (fieldName: string) => {
    return (
      focusedFields.has(fieldName) ||
      !!formData[fieldName as keyof typeof formData]
    );
  };

  return (
    <div className="px-[15px] md:px-[40px] pt-[10px] pb-[20px] mt-[20px] !border !border-solid !border-gray-300 rounded-[10px]">
      {/* Page Title */}
      <h2 className="text-[28px] font-normal text-black my-[20px] text-center">
        {title}
      </h2>

      {/* Address Form */}
      <form onSubmit={onSubmit} className="mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="relative">
            <label
              className={`absolute left-[18px] text-gray-400 transition-all duration-200 pointer-events-none transform ${
                isFloating("firstName")
                  ? "top-[4px] text-[12px]"
                  : "top-1/2 -translate-y-1/2 text-[14px]"
              }`}
            >
              {labels.first_name}
            </label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={onInputChange}
              onFocus={() => onFocus("firstName")}
              onBlur={() => onBlur("firstName")}
              disabled={isSubmitting}
              className="w-full px-[18px] pt-[20px] pb-[6px] !border !border-solid !border-gray-300 rounded-[3px] !text-[14px] text-gray-400 focus:outline-none disabled:bg-gray-50 disabled:cursor-not-allowed"
            />
          </div>
          <div className="relative">
            <label
              className={`absolute left-[18px] text-gray-400 transition-all duration-200 pointer-events-none transform ${
                isFloating("lastName")
                  ? "top-[4px] text-[12px]"
                  : "top-1/2 -translate-y-1/2 text-[14px]"
              }`}
            >
              {labels.last_name}
            </label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={onInputChange}
              onFocus={() => onFocus("lastName")}
              onBlur={() => onBlur("lastName")}
              disabled={isSubmitting}
              className="w-full px-[18px] pt-[20px] pb-[6px] !border !border-solid !border-gray-300 rounded-[3px] !text-[14px] text-gray-400 focus:outline-none disabled:bg-gray-50 disabled:cursor-not-allowed"
            />
          </div>
        </div>

        <div className="mt-[15px] relative">
          <label
            className={`absolute left-[18px] text-gray-400 transition-all duration-200 pointer-events-none transform ${
              isFloating("company")
                ? "top-[4px] text-[12px]"
                : "top-1/2 -translate-y-1/2 text-[14px]"
            }`}
          >
            {labels.company}
          </label>
          <input
            type="text"
            name="company"
            value={formData.company}
            onChange={onInputChange}
            onFocus={() => onFocus("company")}
            onBlur={() => onBlur("company")}
            disabled={isSubmitting}
            className="w-full px-[18px] pt-[20px] pb-[6px] !border !border-solid !border-gray-300 rounded-[3px] !text-[14px] text-gray-400 focus:outline-none disabled:bg-gray-50 disabled:cursor-not-allowed"
          />
        </div>

        <div className="mt-[15px] relative">
          <label
            className={`absolute left-[18px] text-gray-400 transition-all duration-200 pointer-events-none transform ${
              isFloating("address1")
                ? "top-[4px] text-[12px]"
                : "top-1/2 -translate-y-1/2 text-[14px]"
            }`}
          >
            {labels.address1}
          </label>
          <input
            type="text"
            name="address1"
            value={formData.address1}
            onChange={onInputChange}
            onFocus={() => onFocus("address1")}
            onBlur={() => onBlur("address1")}
            disabled={isSubmitting}
            className="w-full px-[18px] pt-[20px] pb-[6px] !border !border-solid !border-gray-300 rounded-[3px] !text-[14px] text-gray-400 focus:outline-none disabled:bg-gray-50 disabled:cursor-not-allowed"
          />
        </div>

        <div className="mt-[15px] relative">
          <label
            className={`absolute left-[18px] text-gray-400 transition-all duration-200 pointer-events-none transform ${
              isFloating("address2")
                ? "top-[4px] text-[12px]"
                : "top-1/2 -translate-y-1/2 text-[14px]"
            }`}
          >
            {labels.address2}
          </label>
          <input
            type="text"
            name="address2"
            value={formData.address2}
            onChange={onInputChange}
            onFocus={() => onFocus("address2")}
            onBlur={() => onBlur("address2")}
            disabled={isSubmitting}
            className="w-full px-[18px] pt-[20px] pb-[6px] !border !border-solid !border-gray-300 rounded-[3px] !text-[14px] text-gray-400 focus:outline-none disabled:bg-gray-50 disabled:cursor-not-allowed"
          />
        </div>

        <div className="mt-[15px] relative">
          <label
            className={`absolute left-[18px] text-gray-400 transition-all duration-200 pointer-events-none transform ${
              isFloating("city")
                ? "top-[4px] text-[12px]"
                : "top-1/2 -translate-y-1/2 text-[14px]"
            }`}
          >
            {labels.city}
          </label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={onInputChange}
            onFocus={() => onFocus("city")}
            onBlur={() => onBlur("city")}
            disabled={isSubmitting}
            className="w-full px-[18px] pt-[20px] pb-[6px] !border !border-solid !border-gray-300 rounded-[3px] !text-[14px] text-gray-400 focus:outline-none disabled:bg-gray-50 disabled:cursor-not-allowed"
          />
        </div>

        <div className="mt-[15px]">
          <p className=" text-gray-500 text-[14px] font-body">
            {labels.country_region}
          </p>
          <div className="relative">
            <select
              name="country"
              value={formData.country}
              onChange={onInputChange}
              onFocus={() => onFocus("country")}
              onBlur={() => onBlur("country")}
              disabled={isSubmitting}
              className="w-full px-[18px] py-[13px] !border !border-solid !border-gray-300 rounded-[3px] !text-[14px] text-gray-400 focus:outline-none appearance-none bg-white pr-10 disabled:bg-gray-50 disabled:cursor-not-allowed cursor-pointer focus:!border-black"
            >
              <option value="" className="text-black">
                {labels.select_placeholder}
              </option>
              <option value="IN" className="text-black">
                {labels.india}
              </option>
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

        <div className="mt-[15px]">
          <p className=" text-gray-500 text-[14px] font-body">
            {labels.province}
          </p>
          <div className="relative">
            <select
              name="state"
              value={formData.state}
              onChange={onInputChange}
              onFocus={() => onFocus("state")}
              onBlur={() => onBlur("state")}
              disabled={isSubmitting}
              className="w-full px-[18px] py-[13px] !border !border-solid !border-gray-300 rounded-[3px] !text-[14px] text-gray-400 focus:outline-none appearance-none bg-white pr-10 disabled:bg-gray-50 disabled:cursor-not-allowed cursor-pointer focus:!border-black"
            >
              <option value="" className="text-black">
                {labels.select_placeholder}
              </option>
              {INDIAN_STATES.map((state) => (
                <option key={state} value={state} className="text-gray-400">
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
            className={`absolute left-[18px] text-gray-400 transition-all duration-200 pointer-events-none transform ${
              isFloating("zip")
                ? "top-[4px] text-[12px]"
                : "top-1/2 -translate-y-1/2 text-[14px]"
            }`}
          >
            {labels.postal_zip_code}
          </label>
          <input
            type="text"
            name="zip"
            value={formData.zip}
            onChange={onInputChange}
            onFocus={() => onFocus("zip")}
            onBlur={() => onBlur("zip")}
            disabled={isSubmitting}
            className={`w-full px-[18px] pt-[20px] pb-[6px] !border !border-solid rounded-[3px] !text-[14px] text-gray-400 focus:outline-none disabled:bg-gray-50 disabled:cursor-not-allowed ${
              errors.zip ? "!border-red-500" : "!border-gray-300"
            }`}
          />
          {errors.zip && (
            <div className="text-red-500 text-xs mt-1 px-[18px]">
              {errors.zip}
            </div>
          )}
        </div>

        <div className="mt-[15px] relative">
          <label
            className={`absolute left-[18px] text-gray-400 transition-all duration-200 pointer-events-none transform ${
              isFloating("phone")
                ? "top-[4px] text-[12px]"
                : "top-1/2 -translate-y-1/2 text-[14px]"
            }`}
          >
            {labels.phone}
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={onInputChange}
            onFocus={() => onFocus("phone")}
            onBlur={() => onBlur("phone")}
            disabled={isSubmitting}
            className={`w-full px-[18px] pt-[20px] pb-[6px] !border !border-solid rounded-[3px] text-[14px] text-gray-400 focus:outline-none disabled:bg-gray-50 disabled:cursor-not-allowed ${
              errors.phone ? "!border-red-500" : "!border-gray-300"
            }`}
          />
          {errors.phone && (
            <div className="text-red-500 text-xs mt-1 px-[18px]">
              {errors.phone}
            </div>
          )}
        </div>

        {!hideDefaultCheckbox && (
          <div>
            <label className="flex items-center gap-2 cursor-pointer mt-[15px]">
              <input
                type="checkbox"
                name="isDefault"
                checked={formData.isDefault}
                onChange={onInputChange}
                disabled={isSubmitting}
                className="w-[16px] h-[16px] text-black border-gray-300 rounded focus:ring-black disabled:cursor-not-allowed"
              />
              <span className="text-[14px] text-gray-700">
                {labels.set_as_default}
              </span>
            </label>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4 mt-[15px]">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-black text-white ml-[20px] my-[40px] px-[24px] lg:px-[30px] py-[12.1px] rounded-lg text-[14px] font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitButtonText}
          </button>
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="bg-black text-white !border !border-solid !border-gray-300 ml-[20px] my-[40px] px-[24px] lg:px-[30px] py-[12.1px] rounded-lg text-[14px] font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {labels.cancel}
          </button>
        </div>
      </form>
    </div>
  );
};
