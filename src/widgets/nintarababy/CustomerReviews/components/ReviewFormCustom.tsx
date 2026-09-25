"use client";

import React, { useState } from "react";
import { submitReview } from "@/utils/submit-review-api";
import { useAuth } from "@shopkit/core/context";
import { handleKwikpassLogin } from "@/integrations/kwikpass-custom";

interface ValidationErrors {
  rating?: string;
  name?: string;
  email?: string;
  comment?: string;
  submit?: string;
}

interface ReviewFormCustomProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (reviewData: {
    rating: number;
    title: string;
    comment: string;
    name: string;
    email: string;
  }) => void;
  productId?: string;
  setReviewSubmitted?: (value: boolean) => void;
}

export const ReviewFormCustom: React.FC<ReviewFormCustomProps> = ({
  isOpen,
  onClose,
  onSubmit,
  productId,
  setReviewSubmitted,
}) => {
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const { accessToken } = useAuth();

  const validateField = (
    field: string,
    value: string | number
  ): string | undefined => {
    switch (field) {
      case "rating":
        return value === 0 ? "This field is required." : undefined;
      case "name":
        return !(value as string).trim()
          ? "This field is required."
          : undefined;
      case "email": {
        const v = value as string;
        if (!v.trim()) {
          return "This field is required.";
        }
        return !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
          ? "Please enter a valid email address."
          : undefined;
      }
      case "comment":
        return !(value as string).trim()
          ? "This field is required."
          : undefined;
      default:
        return undefined;
    }
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const fieldValues: Record<string, string | number> = {
      rating,
      title,
      comment,
      name,
      email,
    };
    const error = validateField(field, fieldValues[field]);
    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  const handleChange = (field: string, value: string | number) => {
    switch (field) {
      case "rating":
        setRating(value as number);
        break;
      case "title":
        setTitle(value as string);
        break;
      case "comment":
        setComment(value as string);
        break;
      case "name":
        setName(value as string);
        break;
      case "email":
        setEmail(value as string);
        break;
    }
    const error = validateField(field, value);
    if (!error) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const newErrors: ValidationErrors = {
      rating: validateField("rating", rating),
      name: validateField("name", name),
      email: validateField("email", email),
      comment: validateField("comment", comment),
    };
    setErrors(newErrors);
    setTouched({ rating: true, name: true, email: true, comment: true });

    if (Object.values(newErrors).some((e) => e !== undefined)) {
      setIsSubmitting(false);
      return;
    }

    try {
      if (!accessToken) {
        handleKwikpassLogin();
        setIsSubmitting(false);
        return;
      }

      if (!productId) {
        throw new Error("Product ID is required");
      }

      const result = await submitReview(
        { name, email, title, comment, rating },
        productId,
        accessToken
      );

      if (!result.success) {
        // If auth expired, trigger login
        if (
          result.error?.includes("session has expired") ||
          result.error?.includes("gk-access-token")
        ) {
          handleKwikpassLogin();
          setIsSubmitting(false);
          return;
        }
        const errMsg =
          typeof result.error === "string"
            ? result.error
            : "Failed to submit review";
        throw new Error(errMsg);
      }

      setIsSubmitted(true);
      setReviewSubmitted?.(true);
      // Show the success view for 5s, then refresh the list and reset.
      setTimeout(() => {
        onSubmit?.({ rating, title, comment, name, email });
        resetForm();
      }, 5000);
    } catch (error) {
      console.error("Error submitting review:", error);
      setErrors((prev) => ({
        ...prev,
        submit:
          error instanceof Error ? error.message : "Failed to submit review",
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setRating(0);
    setTitle("");
    setComment("");
    setName("");
    setEmail("");
    setIsSubmitted(false);
    setIsSubmitting(false);
    setErrors({});
    setTouched({});
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const ErrorMessage = ({ message }: { message: string }) => (
    <div className="bg-red-50 border border-red-300 text-[#1C1D1D] text-sm mt-1 py-1 px-2 flex items-center">
      <svg
        className="mr-1 w-4 h-4 text-red-500 flex-shrink-0"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path
          fillRule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
          clipRule="evenodd"
        />
      </svg>
      <span>{message}</span>
    </div>
  );

  return (
    <div className={isOpen ? "block" : "hidden"}>
      {isSubmitted ? (
        <div className="p-8 rounded-lg max-w-3xl mx-auto mt-4 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
              <svg
                className="h-6 w-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>
          <h2 className="text-xl font-bold text-[#333333] mb-4">
            Review Submitted!
          </h2>
          <p className="text-gray-700 mb-6">
            Thank you! Your review will be published as soon as it is approved.
          </p>
        </div>
      ) : (
        <div className="p-8 rounded-lg max-w-6xl mx-auto mt-4">
          <h2 className="text-xl font-semibold text-[#333333] text-center mb-6">
            Write a review
          </h2>

          <form onSubmit={handleSubmit}>
            {/* Rating */}
            <div className="mb-6">
              <label className="block text-center uppercase text-sm font-medium text-[#333333] mb-2">
                Rating
              </label>
              <div className="flex justify-center space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleChange("rating", star)}
                    className="focus:outline-none"
                    aria-label={`Rate ${star} stars`}
                  >
                    <svg
                      className={`w-8 h-8 ${star <= rating ? "" : "text-gray-300"}`}
                      fill={star <= rating ? "#076CD9" : "currentColor"}
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </button>
                ))}
              </div>
              {touched.rating && errors.rating && (
                <ErrorMessage message={errors.rating} />
              )}
            </div>

            {/* Title */}
            <div className="mb-6">
              <label className="block uppercase text-sm font-medium text-[#333333] mb-2 text-center">
                Review Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => handleChange("title", e.target.value)}
                placeholder="Give your review a title"
                className="w-full rounded-3xl p-3 border border-gray-200 focus:outline-none focus:ring-1 focus:ring-[#076CD9]"
              />
            </div>

            {/* Comment */}
            <div className="mb-6">
              <label className="block uppercase text-sm font-medium mb-2 text-center">
                Review Content
              </label>
              <textarea
                value={comment}
                onChange={(e) => handleChange("comment", e.target.value)}
                onBlur={() => handleBlur("comment")}
                placeholder="Write your comments here"
                rows={5}
                className="w-full rounded-3xl p-3 border border-gray-200 focus:outline-none focus:ring-1 focus:ring-[#076CD9]"
              />
              {touched.comment && errors.comment && (
                <ErrorMessage message={errors.comment} />
              )}
            </div>

            {/* Name */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-[#333333] mb-2 text-center">
                Display Name (displayed publicly)
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => handleChange("name", e.target.value)}
                onBlur={() => handleBlur("name")}
                placeholder="Enter your name (public)"
                className="w-full p-3 border border-gray-200 rounded-3xl focus:outline-none focus:ring-1 focus:ring-[#076CD9]"
              />
              {touched.name && errors.name && (
                <ErrorMessage message={errors.name} />
              )}
            </div>

            {/* Email */}
            <div className="mb-6">
              <label className="block uppercase text-sm font-medium mb-2 text-center">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => handleChange("email", e.target.value)}
                onBlur={() => handleBlur("email")}
                placeholder="Enter your email (private)"
                className="w-full p-3 border border-gray-200 rounded-3xl focus:outline-none focus:ring-1 focus:ring-[#076CD9]"
              />
              {touched.email && errors.email && (
                <ErrorMessage message={errors.email} />
              )}
            </div>

            {errors.submit && (
              <div className="mb-6">
                <ErrorMessage message={errors.submit} />
              </div>
            )}

            <div className="flex justify-center space-x-4">
              <button
                type="button"
                onClick={handleClose}
                className="text-sm px-6 py-3 rounded-3xl border-2 border-[#076CD9] text-[#076CD9] font-medium hover:opacity-80 transition-colors"
              >
                Cancel review
              </button>
              <button
                type="submit"
                className={`text-sm px-6 py-3 bg-[#076CD9] text-white rounded-3xl font-medium transition-colors ${isSubmitting ? "opacity-70 cursor-not-allowed" : ""}`}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit Review"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
