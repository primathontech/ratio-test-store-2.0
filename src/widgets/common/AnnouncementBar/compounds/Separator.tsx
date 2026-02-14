import React from "react";
import { getSeparatorStyles } from "./utils";

interface SeparatorProps {
  type: "dot" | "line";
  fontColor?: string;
}

export const Separator: React.FC<SeparatorProps> = ({ type, fontColor }) => {
  const separatorStyles = getSeparatorStyles(fontColor);

  if (type === "dot") {
    return <span style={separatorStyles}>•</span>;
  }

  if (type === "line") {
    return <span style={{ ...separatorStyles, fontSize: "0.8em" }}>|</span>;
  }

  return null;
};
