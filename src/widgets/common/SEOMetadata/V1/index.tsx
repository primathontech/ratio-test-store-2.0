import React from "react";
import { Props } from "../types";

const SEO_DEFAULTS = {
  title: "Ratio — Shop Our Collections",
  description:
    "Ratio — quality everyday essentials with secure checkout and fast delivery.",
  canonical: process.env.NEXT_PUBLIC_BASE_URL || "/",
  image: {
    id: "ratio-logo",
    url: "/ratio-logo.svg",
    altText: "Ratio Logo",
    width: 1200,
    height: 630,
  },
};

export const SEOMetadataV1: React.FC<Props> = ({ settings }) => {
  const title = settings?.title || SEO_DEFAULTS.title;
  const description = settings?.description || SEO_DEFAULTS.description;
  const canonical = settings?.canonical || SEO_DEFAULTS.canonical;
  const image = settings?.image || SEO_DEFAULTS.image;

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />

      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={image.url} />
      {image.altText && (
        <meta property="og:image:alt" content={image.altText} />
      )}
      {image.width && (
        <meta property="og:image:width" content={String(image.width)} />
      )}
      {image.height && (
        <meta property="og:image:height" content={String(image.height)} />
      )}

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image.url} />
    </>
  );
};
