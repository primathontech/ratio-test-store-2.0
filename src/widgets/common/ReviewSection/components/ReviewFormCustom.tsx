"use client";

import type React from "react";
import { useState } from "react";
import Image from "next/image";
import { submitCustomerStoryReview } from "../submit-review-api";
import { useAuth } from "@shopkit/core/context";

// import { uploadImageFile } from "./image-upload-api";

interface ValidationErrors {
  rating?: string;
  name?: string;
  email?: string;
  comment?: string;
  submit?: string;
}

interface ReviewData {
  rating: number;
  title: string;
  comment: string;
  name: string;
  email: string;
  pictureUrls?: string[];
}

interface ReviewFormCustomProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (reviewData: ReviewData) => void;
  productId?: string;
  externalId?: number | null;
  setReviewSubmitted?: (value: boolean) => void;
}

interface ImageUploadProps {
  onUploadSuccess: (url: string) => void;
  className?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  onUploadSuccess,
  className,
}) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const { accessToken } = useAuth();

  return (
    <div
      data-testid="image-upload-container"
      className={`${className} relative`}
    >
      <div data-testid="image-upload-wrapper" className="flex gap-4">
        <div
          data-testid="image-upload-area"
          className="relative w-48 h-32 border-2 border-gray-300 rounded-lg hover:border-red-500 transition-colors bg-[#FFF1F2]"
        >
          <div
            data-testid="image-upload-placeholder"
            className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
          >
            <svg className="w-8 h-8 text-[#86868B] mb-2" viewBox="0 0 24 24">
              <path fill="currentColor" d="M12 4L20 12H15V20H9V12H4L12 4Z" />
            </svg>
            <p className="text-sm text-[#86868B]">
              Click to upload
              <br />
              image
            </p>
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={() => {}}
            className="w-full h-full opacity-0 cursor-pointer"
          />
        </div>

        {(previewUrl || isUploading) && (
          <div
            data-testid="image-upload-preview"
            className="relative w-48 h-32 border-2 border-gray-300 rounded-lg overflow-hidden"
          >
            {previewUrl && (
              <Image
                src={previewUrl}
                alt="Preview"
                fill
                className="object-contain"
              />
            )}
            {isUploading && (
              <div
                data-testid="image-upload-progress-overlay"
                className="absolute inset-0 bg-white flex flex-col items-center justify-center"
              >
                <div
                  data-testid="image-upload-progress-bar-container"
                  className="w-[80%] bg-gray-200 rounded-full h-2.5 mb-2"
                >
                  <div
                    data-testid="image-upload-progress-bar-fill"
                    className="bg-red-500 h-2.5 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <p className="text-sm text-[#86868B]">{uploadProgress}%</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Error message display */}
      {uploadError && (
        <div
          data-testid="image-upload-error"
          className="mt-2 p-2 bg-red-50 border border-red-200 rounded-md"
        >
          <div
            data-testid="image-upload-error-content"
            className="flex items-center"
          >
            <svg
              className="w-4 h-4 text-red-500 mr-2 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <p className="text-sm text-red-600">{uploadError}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export const ReviewFormCustom: React.FC<ReviewFormCustomProps> = ({
  isOpen,
  onClose,
  onSubmit,
  productId,
  externalId,
  setReviewSubmitted,
}) => {
  const [rating, setRating] = useState<number>(0);
  const [title, setTitle] = useState<string>("");
  const [comment, setComment] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const { accessToken } = useAuth();

  const validateField = (field: string, value: any): string | undefined => {
    switch (field) {
      case "rating":
        return value === 0 ? "This field is required." : undefined;
      case "name":
        return !value.trim() ? "This field is required." : undefined;
      case "email": {
        if (!value.trim()) {
          return "This field is required.";
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return !emailRegex.test(value)
          ? "Please enter a valid email address."
          : undefined;
      }
      case "comment":
        return !value.trim() ? "This field is required." : undefined;
      default:
        return undefined;
    }
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const fieldValues = {
      rating,
      title,
      comment,
      name,
      email,
    };
    const error = validateField(
      field,
      fieldValues[field as keyof typeof fieldValues],
    );
    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  const handleChange = (field: string, value: any) => {
    switch (field) {
      case "rating":
        setRating(value);
        break;
      case "title":
        setTitle(value);
        break;
      case "comment":
        setComment(value);
        break;
      case "name":
        setName(value);
        break;
      case "email":
        setEmail(value);
        break;
    }

    // Clear error if field is now valid
    const error = validateField(field, value);
    if (!error) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate all fields
    const newErrors: ValidationErrors = {
      rating: validateField("rating", rating),
      name: validateField("name", name),
      email: validateField("email", email),
      comment: validateField("comment", comment),
    };

    setErrors(newErrors);
    setTouched({
      rating: true,
      name: true,
      email: true,
      comment: true,
    });

    // Check if there are any errors
    if (Object.values(newErrors).some((error) => error !== undefined)) {
      setIsSubmitting(false);
      return;
    }

    try {
      // Use externalId as the product_id if available, otherwise use productId
      const actualProductId = productId;

      if (!actualProductId) {
        throw new Error("Product ID is required to submit a review");
      }

      // Submit review using submitCustomerStoryReview
      const formData = {
        name: name,
        email: email,
        title: title,
        comment: comment,
        rating: rating,
      };

      const result = await submitCustomerStoryReview(
        formData,
        actualProductId,
        accessToken ?? undefined,
      );

      if (!result.success) {
        throw new Error(result.error || "Failed to submit review");
      }

      setIsSubmitted(true);
      setReviewSubmitted?.(true);

      // Call the onSubmit callback if provided
      if (onSubmit) {
        onSubmit({
          rating,
          title,
          comment,
          name,
          email,
        });
      }

      // Don't reset form here - let the success message show
      // Form will be reset when user closes the modal via handleClose
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

  return (
    <div
      data-testid="review-form-container"
      className={isOpen ? "block" : "hidden"}
    >
      {isSubmitted ? (
        <div
          data-testid="review-form-success"
          className="p-8 rounded-lg max-w-3xl mx-auto mt-4 text-center"
        >
          <div
            data-testid="review-form-success-icon-wrapper"
            className="flex justify-center mb-4"
          >
            <div
              data-testid="review-form-success-icon"
              className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
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
          <h2 className="text-[25.5px] font-bold font-Poppins text-[#DA011A] mb-4">
            Review Submitted!
          </h2>
          <p className="text-gray-700 text-[17px] text-[#DA011A] font-Poppins mb-6">
            Thank you! Your review will be published as soon as it is approved.
          </p>
        </div>
      ) : (
        <div
          data-testid="review-form-form-container"
          className="p-8 rounded-lg max-w-6xl mx-auto mt-4"
        >
          <h2 className="text-[25.5px] font-semibold font-Poppins text-[#1c1d1d] text-center mb-6">
            Write a review
          </h2>

          <form onSubmit={handleSubmit}>
            <div data-testid="review-form-rating-field" className="mb-6">
              <label className="block text-center uppercase text-text-sm font-system text-[#1c1d1d] font-medium mb-2">
                Rating
              </label>
              <div>
                <div
                  data-testid="review-form-rating-stars"
                  className="flex justify-center space-x-2"
                >
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => handleChange("rating", star)}
                      className="focus:outline-none"
                      id="rating"
                      aria-label="rating"
                    >
                      <svg
                        className={`w-8 h-8 ${
                          star <= rating ? "" : "text-gray-300"
                        }`}
                        fill={star <= rating ? "#FBC210" : "currentColor"}
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </button>
                  ))}
                </div>
                {touched.rating && errors.rating && (
                  <div
                    data-testid="review-form-rating-error"
                    className="bg-[#F2847D1A] border border-[#f2847d] text-[#1C1D1D] font-Poppins text-[17px] mt-1 py-1 px-2 flex items-center"
                  >
                    <svg
                      className="mr-1 w-5 h-5 text-red-500 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>{errors.rating}</span>
                  </div>
                )}
              </div>
            </div>

            <div data-testid="review-form-title-field" className="mb-6">
              <label className="block uppercase text-text-sm font-system text-[#1c1d1d] font-medium mb-2 text-center">
                Review Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => handleChange("title", e.target.value)}
                placeholder="Give your review a title"
                className="w-full rounded-3xl p-3 border border-gray-200 focus:outline-none focus:ring-1 focus:ring-black/40"
              />
            </div>

            <div data-testid="review-form-comment-field" className="mb-6">
              <label className="block uppercase text-text-sm font-medium mb-2 text-center">
                Review Content
              </label>
              <textarea
                value={comment}
                onChange={(e) => handleChange("comment", e.target.value)}
                onBlur={() => handleBlur("comment")}
                placeholder="Write your comments here"
                rows={5}
                className="w-full rounded-3xl p-3 border border-gray-200 focus:outline-none focus:ring-1 focus:ring-black/40"
              />
              {touched.comment && errors.comment && (
                <div
                  data-testid="review-form-comment-error"
                  className="bg-[#F2847D1A] border border-[#f2847d] text-[#1C1D1D] font-Poppins text-[17px] mt-1 py-1 px-2 flex items-center"
                >
                  <svg
                    className="mr-1 w-5 h-5 text-red-500 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>{errors.comment}</span>
                </div>
              )}
            </div>
            <div data-testid="review-form-name-field" className="mb-6">
              <label className="block text-text-sm font-system text-[#1c1d1d] font-medium mb-2 text-center">
                Display Name (displayed publicly like{" "}
                <span className="">John Smith</span> )
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => handleChange("name", e.target.value)}
                onBlur={() => handleBlur("name")}
                placeholder="Enter your name (public)"
                className="w-full p-3 border border-gray-200 rounded-3xl focus:outline-none focus:ring-1 focus:ring-black/40"
              />
              {touched.name && errors.name && (
                <div
                  data-testid="review-form-name-error"
                  className="bg-[#F2847D1A] border border-[#f2847d] text-[#1C1D1D] font-Poppins text-[17px] mt-1 py-1 px-2 flex items-center"
                >
                  <svg
                    className="mr-1 w-5 h-5 text-red-500 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>{errors.name}</span>
                </div>
              )}
            </div>

            <div data-testid="review-form-email-field" className="mb-6">
              <label className="block uppercase text-text-sm font-medium mb-2 text-center">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => handleChange("email", e.target.value)}
                onBlur={() => handleBlur("email")}
                placeholder="Enter your email (private)"
                className="w-full p-3 border border-gray-200 rounded-3xl focus:outline-none focus:ring-1 focus:ring-black/40"
              />
              {touched.email && errors.email && (
                <div
                  data-testid="review-form-email-error"
                  className="bg-[#F2847D1A] border border-[#f2847d] text-[#1C1D1D] font-Poppins text-[17px] mt-1 py-1 px-2 flex items-center"
                >
                  <svg
                    className="mr-1 w-5 h-5 text-red-500 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>{errors.email}</span>
                </div>
              )}
            </div>

            {errors.submit && (
              <div
                data-testid="review-form-submit-error"
                className="bg-[#F2847D1A] border border-[#f2847d] text-[#1C1D1D] font-Poppins text-[17px] mt-1 py-1 px-2 mb-6 flex items-center justify-center"
              >
                <svg
                  className="mr-1 w-5 h-5 text-red-500 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>{errors.submit}</span>
              </div>
            )}

            {/* <div className="font-Poppins text-[#1c1d1d] text-text-sm text-center mb-6">
              How we use your data: We'll only contact you about the review you
              left, and only if necessary. By submitting your review, you agree
              to Judge.me's terms, privacy and content policies.
            </div> */}

            <div
              data-testid="review-form-buttons"
              className="flex justify-center space-x-4"
            >
              <button
                id="cancel-review"
                aria-label="cancel-review"
                type="button"
                onClick={handleClose}
                className="text-text-sm px-6 py-3 rounded-3xl border-2 border-[#636E6E] text-[#636E6E] font-medium hover:opacity-80 transition-colors"
              >
                Cancel review
              </button>
              <button
                type="submit"
                className={`text-text-sm px-6 py-3 bg-[#636E6E] text-white rounded-3xl font-medium transition-colors ${
                  isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                }`}
                disabled={isSubmitting}
                id="submit-review"
                aria-label="submit review"
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
