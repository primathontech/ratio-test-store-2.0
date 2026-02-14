"use client";

import React from "react";
import { useTranslation } from "@shopkit/i18n/client";

interface EditableIframeProps extends Omit<
  React.IframeHTMLAttributes<HTMLIFrameElement>,
  "src"
> {
  translationKey: string;
}

const isValidUrl = (value: string): boolean => {
  const trimmed = value?.trim();
  if (!trimmed) {
    return false;
  }

  try {
    const url = new URL(trimmed);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
};

export const EditableIframe: React.FC<EditableIframeProps> = ({
  translationKey,
  allowFullScreen = true,
  loading = "lazy",
  ...props
}) => {
  const { t, setHighlightedKey, highlightedKey, isEditor } = useTranslation();
  const normalizedKey = translationKey.startsWith("t:")
    ? translationKey.substring(2)
    : translationKey;

  const translationValue = t(translationKey);
  const embedSrc =
    typeof translationValue === "string" && isValidUrl(translationValue)
      ? translationValue.trim()
      : null;
  const isFocused = highlightedKey === normalizedKey;

  if (!embedSrc) {
    return null;
  }

  const iframe = (
    <iframe
      {...props}
      src={embedSrc}
      allowFullScreen={allowFullScreen}
      loading={loading}
      className={`${props.className ?? ""} ${
        isEditor ? "pointer-events-none" : ""
      }`}
    />
  );

  if (!isEditor) {
    return iframe;
  }

  return (
    <div
      className={`h-full w-full cursor-pointer inline-block rounded transition-all duration-200 ${
        isFocused ? "ring-2 ring-blue-500" : "hover:ring-1 hover:ring-blue-300"
      }`}
      onClickCapture={() => setHighlightedKey(normalizedKey)}
    >
      {iframe}
    </div>
  );
};

export default EditableIframe;
