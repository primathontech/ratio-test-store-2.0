"use client";

import React from "react";
import { Box } from "@/ui/atomic";
import { KwikpassLoginCustom } from "@/integrations/kwikpass-custom";

interface UserActionsComponentProps {
  textColor: string;
  className?: string;
  userActionsTranslations?: any;
  navigationTranslations?: any;
  accessibilityTranslations?: any;
}

export const UserActionsComponent: React.FC<UserActionsComponentProps> = ({
  textColor,
  className = "",
}) => {
  return (
    <Box
      data-testid="header-user-actions-component"
      className={`user-actions-dropdown relative ${className}`}
    >
      <KwikpassLoginCustom />
    </Box>
  );
};
