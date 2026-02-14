import React from "react";
import { FooterProps } from "./types";
import { FooterV1 } from "./V1/FooterV1";

export const Footer: React.FC<FooterProps> = (props) => {
  const { variant = "v1", ...restProps } = props;

  switch (variant) {
    case "v1":
    default:
      return <FooterV1 {...restProps} />;
  }
};

export default Footer;
