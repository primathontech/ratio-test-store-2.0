"use client";

import React from "react";
import { useTranslation } from "@shopkit/i18n/client";
import BaseImage, { ImageProps as BaseImageProps } from "./Image";

interface EditableImageProps extends Omit<BaseImageProps, "src"> {
  translationKey: string;
}

export const EditableImage: React.FC<EditableImageProps> = ({
  translationKey,
  ...props
}) => {
  const { t, setHighlightedKey, highlightedKey, isEditor } = useTranslation();

  const normalizedKey = translationKey.startsWith("t:")
    ? translationKey.substring(2)
    : translationKey;

  const computedSrc = t(translationKey);
  const isFocused = highlightedKey === normalizedKey;

  // Guard: only render when we have a valid URL (not the translation key)
  const isValidSrc =
    typeof computedSrc === "string" &&
    (computedSrc.startsWith("http") || computedSrc.startsWith("/"));

  if (!isValidSrc) {
    // Return null or a placeholder while translations are loading
    return null;
  }

  // Plain image in non-editor mode
  if (!isEditor) {
    return <BaseImage {...props} src={computedSrc} />;
  }

  // Editable wrapper in editor mode
  return (
    <div
      className={`cursor-pointer inline-block rounded transition-all duration-200 ${
        isFocused ? "ring-2 ring-blue-500" : "hover:ring-1 hover:ring-blue-300"
      }`}
      onClick={() => setHighlightedKey(normalizedKey)}
      style={{ display: "inline-block" }}
    >
      <BaseImage {...props} src={computedSrc} />
    </div>
  );
};

export default EditableImage;
