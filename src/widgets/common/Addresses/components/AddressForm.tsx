"use client";

import React from "react";
import { INDIAN_STATES } from "../constants/indianStates";
import { AddressFormProps } from "../types";

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
  province: "State",
  postal_zip_code: "PIN code",
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
}) => {
  const labels = { ...DEFAULT_FORM_LABELS, ...formLabels };

  const isFloating = (fieldName: string) => {
    return (
      focusedFields.has(fieldName) ||
      !!formData[fieldName as keyof typeof formData]
    );
  };

  return (
    <div className="px-[15px] md:px-10 pt-2.5 pb-5 mt-5 border border-neutral-200 rounded-2xl shadow-sm">
      {/* Page Title */}
      <h2 className="text-2xl font-semibold tracking-tight text-[#1D1D1D] my-5 text-center">
        {title}
      </h2>

      {/* Address Form */}
      <form onSubmit={onSubmit} className="mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="relative">
            <label
              className={`absolute left-[18px] text-neutral-500 transition-all duration-200 pointer-events-none transform ${
                isFloating("firstName")
                  ? "top-1 text-xs"
                  : "top-1/2 -translate-y-1/2 text-sm"
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
              className="w-full px-[18px] pt-5 pb-1.5 border border-neutral-200 rounded-xl !text-sm text-neutral-700 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-neutral-400 disabled:bg-neutral-50 disabled:cursor-not-allowed"
            />
          </div>
          <div className="relative">
            <label
              className={`absolute left-[18px] text-neutral-500 transition-all duration-200 pointer-events-none transform ${
                isFloating("lastName")
                  ? "top-1 text-xs"
                  : "top-1/2 -translate-y-1/2 text-sm"
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
              className="w-full px-[18px] pt-5 pb-1.5 border border-neutral-200 rounded-xl !text-sm text-neutral-700 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-neutral-400 disabled:bg-neutral-50 disabled:cursor-not-allowed"
            />
          </div>
        </div>

        <div className="mt-[15px] relative">
          <label
            className={`absolute left-[18px] text-neutral-500 transition-all duration-200 pointer-events-none transform ${
              isFloating("company")
                ? "top-1 text-xs"
                : "top-1/2 -translate-y-1/2 text-sm"
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
            className="w-full px-[18px] pt-5 pb-1.5 border border-neutral-200 rounded-xl !text-sm text-neutral-700 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-neutral-400 disabled:bg-neutral-50 disabled:cursor-not-allowed"
          />
        </div>

        <div className="mt-[15px] relative">
          <label
            className={`absolute left-[18px] text-neutral-500 transition-all duration-200 pointer-events-none transform ${
              isFloating("address1")
                ? "top-1 text-xs"
                : "top-1/2 -translate-y-1/2 text-sm"
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
            className="w-full px-[18px] pt-5 pb-1.5 border border-neutral-200 rounded-xl !text-sm text-neutral-700 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-neutral-400 disabled:bg-neutral-50 disabled:cursor-not-allowed"
          />
        </div>

        <div className="mt-[15px] relative">
          <label
            className={`absolute left-[18px] text-neutral-500 transition-all duration-200 pointer-events-none transform ${
              isFloating("address2")
                ? "top-1 text-xs"
                : "top-1/2 -translate-y-1/2 text-sm"
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
            className="w-full px-[18px] pt-5 pb-1.5 border border-neutral-200 rounded-xl !text-sm text-neutral-700 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-neutral-400 disabled:bg-neutral-50 disabled:cursor-not-allowed"
          />
        </div>

        <div className="mt-[15px] relative">
          <label
            className={`absolute left-[18px] text-neutral-500 transition-all duration-200 pointer-events-none transform ${
              isFloating("city")
                ? "top-1 text-xs"
                : "top-1/2 -translate-y-1/2 text-sm"
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
            className="w-full px-[18px] pt-5 pb-1.5 border border-neutral-200 rounded-xl !text-sm text-neutral-700 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-neutral-400 disabled:bg-neutral-50 disabled:cursor-not-allowed"
          />
        </div>

        <div className="mt-[15px]">
          <p className=" text-neutral-500 text-sm font-body">
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
              className="w-full px-[18px] py-[13px] border border-neutral-200 rounded-xl !text-sm text-neutral-700 focus:outline-none focus:ring-2 focus:ring-black/10 appearance-none bg-white pr-10 disabled:bg-neutral-50 disabled:cursor-not-allowed cursor-pointer focus:border-neutral-400"
            >
              <option value="" className="text-primary">
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
          <p className=" text-neutral-500 text-sm font-body">
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
              className="w-full px-[18px] py-[13px] border border-neutral-200 rounded-xl !text-sm text-neutral-700 focus:outline-none focus:ring-2 focus:ring-black/10 appearance-none bg-white pr-10 disabled:bg-neutral-50 disabled:cursor-not-allowed cursor-pointer focus:border-neutral-400"
            >
              <option value="" className="text-primary">
                {labels.select_placeholder}
              </option>
              {INDIAN_STATES.map((state) => (
                <option key={state} value={state} className="text-neutral-600">
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
            className={`absolute left-[18px] text-neutral-500 transition-all duration-200 pointer-events-none transform ${
              isFloating("zip")
                ? "top-1 text-xs"
                : "top-1/2 -translate-y-1/2 text-sm"
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
            className={`w-full px-[18px] pt-5 pb-1.5 border rounded-xl !text-sm text-neutral-700 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-neutral-400 disabled:bg-neutral-50 disabled:cursor-not-allowed ${
              errors.zip ? "border-red-500" : "border-neutral-200"
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
            className={`absolute left-[18px] text-neutral-500 transition-all duration-200 pointer-events-none transform ${
              isFloating("phone")
                ? "top-1 text-xs"
                : "top-1/2 -translate-y-1/2 text-sm"
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
            className={`w-full px-[18px] pt-5 pb-1.5 border rounded-xl text-sm text-neutral-700 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-neutral-400 disabled:bg-neutral-50 disabled:cursor-not-allowed ${
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
              onChange={onInputChange}
              disabled={isSubmitting}
              className="w-4 h-4 text-black border-neutral-200 rounded focus:ring-black/20 disabled:cursor-not-allowed"
            />
            <span className="text-sm text-neutral-700">
              {labels.set_as_default}
            </span>
          </label>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2  mt-[15px]">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-black text-white px-[25px] md:px-[31px] py-2 md:py-3 rounded-full text-sm font-semibold hover:bg-neutral-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shine-link-button"
          >
            {submitButtonText}
          </button>
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="bg-white text-black ring-1 ring-black/10 ml-5 px-6 md:px-[30px] py-2 md:py-3 rounded-full text-sm font-semibold hover:bg-neutral-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {labels.cancel}
          </button>
        </div>
      </form>
    </div>
  );
};
