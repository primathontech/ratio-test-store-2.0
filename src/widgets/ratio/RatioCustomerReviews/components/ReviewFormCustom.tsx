"use client";

import { useAuth } from "@shopkit/core/context";

import type React from "react";
import { useRef, useState } from "react";
import {
  submitCustomerStoryReview,
  uploadReviewMedia,
} from "../utils/submit-review-api";

const UPLOAD_ENABLED =
  process.env.NEXT_PUBLIC_REVIEWS_UPLOAD_ENABLED === "true";

interface ValidationErrors {
  rating?: string;
  title?: string;
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
  /** When true, form renders without its own card/shadow so it can sit inside a parent card */
  embedInCard?: boolean;
}

export const ReviewFormCustom: React.FC<ReviewFormCustomProps> = ({
  isOpen,
  onClose,
  onSubmit,
  productId,
  setReviewSubmitted,
  embedInCard = false,
}) => {
  const [rating, setRating] = useState<number>(0);
  const [title, setTitle] = useState<string>("");
  const [comment, setComment] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [displayNameOption, setDisplayNameOption] =
    useState<string>("John Smith");
  const [email, setEmail] = useState<string>("");
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<"image" | "video" | null>(null);
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { accessToken } = useAuth();

  const handleFileSelect = async (
    e: React.ChangeEvent<HTMLInputElement>
  ): Promise<void> => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }
    setUploadError(null);
    setMediaUrl(null);
    if (mediaPreview) {
      URL.revokeObjectURL(mediaPreview);
    }
    setMediaType(file.type.startsWith("video/") ? "video" : "image");
    setMediaPreview(URL.createObjectURL(file));
    setIsUploading(true);
    const result = await uploadReviewMedia(file);
    setIsUploading(false);
    if (result.success && result.url) {
      setMediaUrl(result.url);
    } else {
      setUploadError(result.error || "Upload failed");
    }
  };

  const clearMedia = () => {
    if (mediaPreview) {
      URL.revokeObjectURL(mediaPreview);
    }
    setMediaPreview(null);
    setMediaType(null);
    setMediaUrl(null);
    setUploadError(null);
    setIsUploading(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
      case "title":
        return value.length > 100
          ? "Please enter no more than 100 characters."
          : undefined;
      case "comment":
        if (!value.trim()) {
          return "This field is required.";
        }
        return value.length > 5000
          ? "Please enter no more than 5000 characters."
          : undefined;
      default:
        return undefined;
    }
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const fieldValues = { rating, title, comment, name, email };
    const error = validateField(
      field,
      fieldValues[field as keyof typeof fieldValues]
    );
    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

    const error = validateField(field, value);
    if (touched[field]) {
      setErrors((prev) => ({ ...prev, [field]: error }));
    } else if (!error) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isUploading) {
      return;
    }
    setIsSubmitting(true);

    const newErrors: ValidationErrors = {
      rating: validateField("rating", rating),
      title: validateField("title", title),
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

    if (Object.values(newErrors).some((error) => error !== undefined)) {
      setIsSubmitting(false);
      return;
    }

    try {
      const actualProductId = productId;

      if (!actualProductId) {
        throw new Error("Product ID is required to submit a review");
      }

      const formData = { name, email, title, comment, rating, mediaUrl };

      const result = await submitCustomerStoryReview(
        formData,
        actualProductId,
        accessToken
      );

      if (!result.success) {
        throw new Error(result.error || "Failed to submit review");
      }

      setIsSubmitted(true);
      setReviewSubmitted?.(true);

      if (onSubmit) {
        onSubmit({ rating, title, comment, name, email });
      }
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
    clearMedia();
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <div
      data-testid="review-form-container"
      aria-hidden={!isOpen}
      className={`grid transition-[grid-template-rows,opacity] duration-500 ease-in-out ${
        isOpen
          ? "grid-rows-[1fr] opacity-100"
          : "grid-rows-[0fr] opacity-0 pointer-events-none"
      }`}
    >
      <div className="overflow-hidden">
        {isSubmitted ? (
          <div
            data-testid="review-form-success"
            className={
              embedInCard
                ? "p-8 w-full text-center"
                : "p-8 rounded-2xl w-full mx-auto mt-4 text-center bg-white shadow-[0px_4px_16px_rgba(0,0,0,0.1)]"
            }
          >
            <div
              data-testid="review-form-success-icon-wrapper"
              className="flex justify-center mb-4"
            >
              <div
                data-testid="review-form-success-icon"
                className="w-8 h-8 bg-[#636E6E] rounded-[50%] flex items-center justify-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-white"
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
            <p className="text-[12px] min-[375px]:text-[14px] leading-[16.8px] min-[375px]:leading-[19.6px] font-bold font-Poppins text-[#636E6E] mb-4">
              Review Submitted!
            </p>
            <p className="text-[12px] min-[375px]:text-[14px] leading-[16.8px] min-[375px]:leading-[19.6px] text-[#636E6E] font-Poppins mx-auto mb-6 max-w-[568px] pb-6 border-b border-[#E0E0E0]">
              Thank you! Please refresh the page in a few moments to see your
              review. You can remove or edit your review by logging into{" "}
              <a
                href="https://judge.me/login"
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-[#636E6E] hover:text-[#333333]"
              >
                Judge.me
              </a>
            </p>
          </div>
        ) : (
          <div
            data-testid="review-form-form-container"
            className={
              embedInCard
                ? "py-8 px-[16px] w-full"
                : "p-8 rounded-2xl w-full mx-auto mt-4 bg-white shadow-[0px_4px_16px_rgba(0,0,0,0.1)]"
            }
          >
            <h2 className="text-[12px] min-[375px]:text-[14px] leading-[16.8px] min-[375px]:leading-[19.6px] font-bold font-Poppins text-[#333333] text-center mb-4">
              Write a review
            </h2>

            <form onSubmit={handleSubmit}>
              <div data-testid="review-form-rating-field" className="mb-6">
                <label className="block text-center text-[12px] min-[375px]:text-[14px] leading-[16.8px] min-[375px]:leading-[19.6px] font-system text-[#333333] font-normal mb-2">
                  Rating
                </label>
                <div>
                  <div
                    data-testid="review-form-rating-stars"
                    className="flex justify-center space-x-[2px]"
                  >
                    {[1, 2, 3, 4, 5].map((star) => {
                      const isFilled = star <= (hoverRating || rating);
                      return (
                        <button
                          key={star}
                          type="button"
                          onClick={() => handleChange("rating", star)}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          className="focus:outline-none"
                          id="rating"
                          aria-label={`${star} star${star > 1 ? "s" : ""}`}
                        >
                          {isFilled ? (
                            <svg
                              className="w-4 h-4"
                              fill="#FBC210"
                              viewBox="0 0 20 20"
                              aria-hidden
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ) : (
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="#FBC210"
                              strokeWidth="2"
                              strokeLinejoin="round"
                              strokeLinecap="round"
                              viewBox="0 0 20 20"
                              aria-hidden
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          )}
                        </button>
                      );
                    })}
                  </div>
                  {touched.rating && errors.rating && (
                    <div
                      data-testid="review-form-rating-error"
                      className="w-full md:w-[568px] mx-auto bg-[#F2847D1A] border border-[#F2847D] text-[#333333] font-Poppins text-[12px] min-[375px]:text-[14px] leading-[16.8px] min-[375px]:leading-[19.6px] mt-3 p-2 rounded-sm flex items-center justify-start"
                    >
                      <svg
                        className="mr-1 w-5 h-5 text-[#F28478] flex-shrink-0"
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

              <div
                data-testid="review-form-title-field"
                className="mb-6 md:flex md:flex-col md:items-center"
              >
                <label className="block text-[12px] min-[375px]:text-[14px] leading-[16.8px] min-[375px]:leading-[19.6px] font-system text-[#333333] font-normal mb-2 text-center">
                  Review Title{title.length > 0 && `(${100 - title.length})`}
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => handleChange("title", e.target.value)}
                  placeholder="Give your review a title"
                  className="w-full md:w-[568px] rounded-[20px] border border-gray-200 px-4 py-2 text-[12px] min-[375px]:text-[14px] leading-[16.8px] min-[375px]:leading-[19.6px] text-[#333333] placeholder:text-[12px] min-[375px]:placeholder:text-[14px] placeholder:text-[#636E6E] focus:outline-none focus:border-[#636E6E] focus:ring-1 focus:ring-[#636E6E]/30"
                />
                {title.length > 100 && (
                  <div
                    data-testid="review-form-title-error"
                    className="w-full md:w-[568px] bg-[#F2847D1A] border border-[#F2847D] text-[#333333] font-Poppins text-[12px] min-[375px]:text-[14px] leading-[16.8px] min-[375px]:leading-[19.6px] mt-3 p-2 rounded-sm flex items-center max-h-[33.6px]"
                  >
                    <svg
                      className="mr-1 w-5 h-5 text-[#F28478] flex-shrink-0"
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
                    <span>Please enter no more than 100 characters.</span>
                  </div>
                )}
              </div>

              <div
                data-testid="review-form-comment-field"
                className="mb-6 md:flex md:flex-col md:items-center"
              >
                <label className="block text-[12px] min-[375px]:text-[14px] leading-[16.8px] min-[375px]:leading-[19.6px] font-normal mb-2 text-center text-[#333333]">
                  Review Content
                  {comment.length > 0 && `(${5000 - comment.length})`}
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => handleChange("comment", e.target.value)}
                  onBlur={() => handleBlur("comment")}
                  placeholder="Start writing here..."
                  rows={5}
                  className="w-full md:w-[568px] rounded-3xl py-2 px-4 border border-gray-200 text-[#333333] placeholder:text-[12px] min-[375px]:placeholder:text-[14px] placeholder:text-[#636E6E] focus:outline-none focus:border-[#636E6E] focus:ring-1 focus:ring-[#636E6E]/30 max-h-[115px]"
                />
                {touched.comment && errors.comment && (
                  <div
                    data-testid="review-form-comment-error"
                    className="w-full md:w-[568px] bg-[#F2847D1A] border border-[#F2847D] text-[#333333] font-Poppins text-[12px] min-[375px]:text-[14px] leading-[16.8px] min-[375px]:leading-[19.6px] mt-3 p-2 rounded-sm flex items-center max-h-[33.6px]"
                  >
                    <svg
                      className="mr-1 w-5 h-5 text-[#F28478] flex-shrink-0"
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
              {UPLOAD_ENABLED && (
                <div
                  data-testid="review-form-media-field"
                  className="mb-6 md:flex md:flex-col md:items-center"
                >
                  <label className="block text-[12px] min-[375px]:text-[14px] leading-[16.8px] min-[375px]:leading-[19.6px] font-system text-[#333333] font-normal mb-2 text-center">
                    Photo / Video (optional)
                  </label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,video/*"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="review-media-input"
                    aria-label="Upload a photo or video for your review"
                  />
                  {mediaPreview ? (
                    <div className="w-full md:w-[568px] flex items-center gap-3 rounded-[20px] border border-gray-200 px-4 py-3">
                      {mediaType === "video" ? (
                        // eslint-disable-next-line no-restricted-syntax
                        <video
                          src={mediaPreview}
                          width={64}
                          height={64}
                          muted
                          playsInline
                          controls
                          className="h-16 w-16 rounded-lg object-cover"
                        />
                      ) : (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={mediaPreview}
                          alt="Review media preview"
                          className="h-16 w-16 rounded-lg object-cover"
                        />
                      )}
                      <div className="flex-1 text-[12px] min-[375px]:text-[14px] text-[#636E6E]">
                        {isUploading
                          ? "Uploading..."
                          : mediaUrl
                            ? mediaType === "video"
                              ? "Video added"
                              : "Photo added"
                            : uploadError || "Not uploaded"}
                      </div>
                      <button
                        type="button"
                        onClick={clearMedia}
                        className="text-[12px] min-[375px]:text-[14px] font-bold text-[#636E6E] underline"
                        aria-label="Remove photo"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <label
                      htmlFor="review-media-input"
                      className="w-full md:w-[568px] cursor-pointer rounded-[20px] border border-dashed border-gray-300 px-4 py-6 text-center text-[12px] min-[375px]:text-[14px] leading-[16.8px] min-[375px]:leading-[19.6px] text-[#636E6E] hover:border-[#636E6E] transition-colors flex flex-col items-center justify-center gap-2"
                    >
                      <svg
                        className="h-7 w-7 text-[#636E6E]"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden
                      >
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="7 10 12 5 17 10" />
                        <line x1="12" y1="5" x2="12" y2="15" />
                      </svg>
                      <span>Add a photo or video</span>
                    </label>
                  )}
                  {uploadError && (
                    <div
                      data-testid="review-form-media-error"
                      className="w-full md:w-[568px] bg-[#F2847D1A] border border-[#F2847D] text-[#333333] font-Poppins text-[12px] min-[375px]:text-[14px] leading-[16.8px] min-[375px]:leading-[19.6px] mt-3 p-2 rounded-sm flex items-center"
                    >
                      <span>{uploadError}</span>
                    </div>
                  )}
                </div>
              )}

              <div
                data-testid="review-form-name-field"
                className="mb-6 pt-6 md:flex md:flex-col md:items-center"
              >
                <label className="block text-[12px] min-[375px]:text-[14px] leading-[16.8px] min-[375px]:leading-[19.6px] font-system text-[#333333] font-normal mb-2 text-center">
                  Display Name (displayed publicly like{" "}
                  <span className="inline-flex items-center text-nowrap">
                    <select
                      value={displayNameOption}
                      onChange={(e) => setDisplayNameOption(e.target.value)}
                      className="inline text-[12px] min-[375px]:text-[14px] leading-[16.8px] min-[375px]:leading-[19.6px] text-[#333333] bg-transparent border-none focus:outline-none cursor-pointer appearance-none"
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 12 12'%3E%3Cpath d='M6 8L1 3h10z' fill='%23666'/%3E%3C/svg%3E")`,
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "right center",
                        paddingRight: "16px",
                      }}
                    >
                      <option value="John Smith">John Smith</option>
                      <option value="John S.">John S.</option>
                      <option value="John">John</option>
                      <option value="J.S.">J.S.</option>
                      <option value="Anonymous">Anonymous</option>
                    </select>
                    {")"}
                  </span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  onBlur={() => handleBlur("name")}
                  placeholder="Display name"
                  className="w-full md:w-[568px] rounded-[20px] border border-gray-200 px-4 py-2 text-[12px] min-[375px]:text-[14px] leading-[16.8px] min-[375px]:leading-[19.6px] text-[#333333] placeholder:text-[12px] min-[375px]:placeholder:text-[14px] placeholder:text-[#636E6E] focus:outline-none focus:border-[#636E6E] focus:ring-1 focus:ring-[#636E6E]/30"
                />
                {touched.name && errors.name && (
                  <div
                    data-testid="review-form-name-error"
                    className="w-full md:w-[568px] bg-[#F2847D1A] border border-[#F2847D] text-[#333333] font-Poppins text-[12px] min-[375px]:text-[14px] leading-[16.8px] min-[375px]:leading-[19.6px] mt-3 p-2 rounded-sm flex items-center max-h-[33.6px]"
                  >
                    <svg
                      className="mr-1 w-5 h-5 text-[#F28478] flex-shrink-0"
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

              <div
                data-testid="review-form-email-field"
                className="mb-6 md:flex md:flex-col md:items-center"
              >
                <label className="block text-[12px] min-[375px]:text-[14px] leading-[16.8px] min-[375px]:leading-[19.6px] font-normal text-[#333333] mb-2 text-center">
                  Email address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  onBlur={() => handleBlur("email")}
                  placeholder="Your email address"
                  className="w-full md:w-[568px] rounded-[20px] border border-gray-200 px-4 py-2 text-[12px] min-[375px]:text-[14px] leading-[16.8px] min-[375px]:leading-[19.6px] text-[#333333] placeholder:text-[12px] min-[375px]:placeholder:text-[14px] placeholder:text-[#636E6E] focus:outline-none focus:border-[#636E6E] focus:ring-1 focus:ring-[#636E6E]/30"
                />
                {touched.email && errors.email && (
                  <div
                    data-testid="review-form-email-error"
                    className="w-full md:w-[568px] bg-[#F2847D1A] border border-[#F2847D] text-[#333333] font-Poppins text-[12px] min-[375px]:text-[14px] leading-[16.8px] min-[375px]:leading-[19.6px] mt-3 p-2 rounded-sm flex items-center max-h-[33.6px]"
                  >
                    <svg
                      className="mr-1 w-5 h-5 text-[#F28478] flex-shrink-0"
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
                  className="bg-[#F2847D1A] border border-[#F2847D] text-[#333333] font-Poppins text-[12px] min-[375px]:text-[14px] leading-[16.8px] min-[375px]:leading-[19.6px] mt-1 py-1 px-2 mb-6 flex items-center justify-center"
                >
                  <svg
                    className="mr-1 w-5 h-5 text-[#F28478] flex-shrink-0"
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

              <p className="text-[12px] min-[375px]:text-[14px] leading-[16.8px] min-[375px]:leading-[19.6px] text-[#333333] text-center mb-6 mx-auto md:w-[568px]">
                How we use your data: We&apos;ll only contact you about the
                review you left, and only if necessary. By submitting your
                review, you agree to Judge.me&apos;s{" "}
                <a
                  href="https://judge.me/terms"
                  target="_blank"
                  rel="nofollow noopener"
                  className="no-underline"
                >
                  terms
                </a>
                ,{" "}
                <a
                  href="https://judge.me/privacy"
                  target="_blank"
                  rel="nofollow noopener"
                  className="no-underline"
                >
                  privacy
                </a>{" "}
                and{" "}
                <a
                  href="https://judge.me/content-policy"
                  target="_blank"
                  rel="nofollow noopener"
                  className="no-underline"
                >
                  content
                </a>{" "}
                policies.
              </p>

              <div
                data-testid="review-form-buttons"
                className="flex flex-col md:flex-row md:justify-center gap-3 w-full"
              >
                <button
                  id="cancel-review"
                  aria-label="cancel-review"
                  type="button"
                  onClick={handleClose}
                  className="w-full max-w-[142px] text-[12px] min-[375px]:text-[14px] leading-[16.8px] min-[375px]:leading-[19.6px] px-5 py-2.5 rounded-3xl border-2 border-[#636E6E] text-[#636E6E] font-bold hover:opacity-80 transition-colors max-h-[37.2px] items-center justify-center flex"
                >
                  Cancel review
                </button>
                <button
                  type="submit"
                  className={`w-full max-w-[149px] text-[12px] min-[375px]:text-[14px] leading-[16.8px] min-[375px]:leading-[19.6px] px-5 py-2.5 rounded-3xl bg-[#636E6E] text-white font-bold transition-colors max-h-[37.2px] items-center justify-center flex ${
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
    </div>
  );
};
