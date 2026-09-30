"use client";

import React, { memo, useEffect, useRef, useState } from "react";
import { useAuth } from "@shopkit/core/context";
import { getCommerceClient } from "@/config/commerce";
import { DeleteAccountProps } from "../types";

const PLACEHOLDERS: Record<string, string> = {
  name: "Name",
  email: "Email",
  message: "Message",
};

export const V1 = memo(function DeleteAccountV1({
  settings,
  className,
}: DeleteAccountProps) {
  const heading = settings?.heading || "Delete Your Account";
  const description =
    settings?.description ||
    "Deleting your account will permanently remove your personal data, app activity, and any associated information. This action cannot be undone. To proceed, please verify your identity by entering your registered email address or phone number below. We'll send you a confirmation link or code to complete your account deletion request.";
  const submitLabel = settings?.submitLabel || "Send";
  const successMessage =
    settings?.successMessage ||
    "Thanks for contacting us. We'll get back to you as soon as possible.";

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { accessToken } = useAuth();
  const commerceClient = getCommerceClient();
  const MERCHANT_ID = process.env.NEXT_PUBLIC_MERCHANT_ID || "";
  const DELETE_ACCOUNT_BASE_URL_V1 = process.env.NEXT_PUBLIC_CUSTOMER_API_URL;

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.1 }
    );

    const node = containerRef.current;
    if (node) {
      observer.observe(node);
    }

    return () => {
      if (node) {
        observer.unobserve(node);
      }
    };
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = `${DELETE_ACCOUNT_BASE_URL_V1}/storefront/customers/profile/request-deletion`;
    try {
      await commerceClient.fetchRequest({
        url,
        method: "POST",
        headers: {
          accept: "*/*",
          "gk-merchant-id": MERCHANT_ID,
          "gk-access-token":
            (typeof window !== "undefined" &&
              localStorage.getItem("KWIKUSERTOKEN")) ||
            accessToken ||
            "",
        },
      });
    } catch {
      // Show same message and clear form as on success
    } finally {
      setStatus(successMessage);
      setFormData({ name: "", email: "", message: "" });
    }
  };

  const renderFormField = (
    fieldName: string,
    fieldType: string,
    required: boolean = false
  ) => {
    const fieldValue = formData[fieldName as keyof typeof formData];
    const placeholder = PLACEHOLDERS[fieldName] ?? fieldName;
    if (fieldType === "textarea") {
      return (
        <div className="relative">
          <textarea
            name={fieldName}
            id={fieldName}
            placeholder=" "
            value={fieldValue}
            onChange={handleChange}
            required={false}
            className="w-full px-[18px] py-[12px] h-[235px] resize-none bg-white border border-dark-gray text-light-gray focus:outline-none focus:border-light-gray focus:ring-0 peer transition-colors duration-200 text-[14px]"
          />
          <label
            htmlFor={fieldName}
            className="absolute left-[18px] top-[12px] text-light-gray cursor-text peer-focus:opacity-0 peer-[:not(:placeholder-shown)]:opacity-0 transition-opacity duration-200 text-[14px]"
          >
            {placeholder}
            {fieldName === "name" || fieldName === "email" ? " *" : ""}
          </label>
        </div>
      );
    }
    return (
      <div className="relative">
        <input
          type={fieldType}
          name={fieldName}
          id={fieldName}
          placeholder=" "
          value={fieldValue}
          onChange={handleChange}
          required={required}
          className="w-full px-[18px] py-[12px] bg-white border border-dark-gray rounded-sm text-[14px] text-light-gray focus:outline-none focus:border-light-gray focus:ring-0 peer transition-colors duration-200 leading-tight"
        />
        <label
          htmlFor={fieldName}
          className="absolute left-[18px] top-[12px] text-light-gray cursor-text peer-focus:opacity-0 peer-[:not(:placeholder-shown)]:opacity-0 transition-opacity duration-200 text-[14px]"
        >
          {placeholder}
          {fieldName === "name" || fieldName === "email" ? " *" : ""}
        </label>
      </div>
    );
  };

  return (
    <div
      ref={containerRef}
      className={`${className || ""} mx-auto px-[15px] md:px-[30px] lg:px-[30px] xl:px-[50px] py-[30px] md:py-[34px] lg:py-[40px] mt-[22px] md:mt-[32px] transition-all duration-1000 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
    >
      <div className="w-full xl:max-w-[642px] xl:mx-auto">
        <h2 className="text-[22px] text-base-dark-text font-normal text-center">
          {heading}
        </h2>
        <p className="text-center text-[14px] text-base-light-text mt-[20px] leading-[22.4px]">
          {description}
        </p>
        <form onSubmit={handleSubmit} className="space-y-4 mt-[24px]">
          <div className="grid grid-cols-2 gap-[15px] lg:gap-6 mb-[20px]">
            <div className="col-span-1 md:col-span-1">
              {renderFormField("name", "text", true)}
            </div>
            <div className="col-span-1 md:col-span-1">
              {renderFormField("email", "email", true)}
            </div>
            <div className="col-span-2">
              {renderFormField("message", "textarea", true)}
            </div>
          </div>
          <div className="flex justify-center">
            <button
              type="submit"
              className="text-white text-[14px] px-7 py-[8.5px] md:py-[12.5px] lg:w-auto min-w-[215px] tracking-widest rounded-[10px] bg-black"
            >
              {submitLabel}
            </button>
          </div>
        </form>
        {!!status && (
          <div className="flex justify-center mt-6">
            <p className="text-center text-text-base font-normal text-green-700">
              {status}
            </p>
          </div>
        )}
      </div>
    </div>
  );
});

export { V1 as default };
