import React from "react";
import { IBannerTextItemFlat } from "../types";
import Link from "next/link";

interface AnnouncementTextProps {
  text: IBannerTextItemFlat;
  fontColor?: string;
  showUnderline?: boolean;
}

export const AnnouncementText: React.FC<AnnouncementTextProps> = ({
  text,
  fontColor,
  showUnderline = true,
}) => {
  const htmlContent = { __html: text.text };

  if (text.href) {
    return (
      <>
        <Link
          href={text.href}
          target={text.target || "_self"}
          className={`${showUnderline ? "hover:underline focus:underline focus:outline-none fill-current" : ""} text-center font-medium md:hidden`}
          style={{
            color: fontColor || "currentcolor",
            letterSpacing: "-0.33px !important",
          }}
          dangerouslySetInnerHTML={htmlContent}
        />
        <Link
          href={text.href}
          target={text.target || "_self"}
          className={`${showUnderline ? "hover:underline focus:underline focus:outline-none fill-current" : ""} text-center font-medium hidden md:block`}
          style={{
            color: fontColor || "currentcolor",
          }}
          dangerouslySetInnerHTML={htmlContent}
        />
      </>
    );
  }

  return (
    <>
      <span
        className="block fill-current font-medium md:hidden"
        style={{
          color: fontColor || "currentcolor",
          letterSpacing: "-0.33px !important",
        }}
        dangerouslySetInnerHTML={htmlContent}
      />
      <span
        className="fill-current font-medium hidden md:block"
        style={{
          color: fontColor || "currentcolor",
        }}
        dangerouslySetInnerHTML={htmlContent}
      />
    </>
  );
};
