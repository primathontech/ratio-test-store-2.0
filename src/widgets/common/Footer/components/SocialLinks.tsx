import React from "react";
import Link from "next/link";

import { SocialLink } from "../types";
import { SocialIcon } from "./SocialIcon";

interface SocialLinksProps {
  socialLinks: SocialLink[];
  className?: string;
}

export const SocialLinks: React.FC<SocialLinksProps> = ({
  socialLinks,
  className,
}) => {
  if (socialLinks.length === 0) {
    return null;
  }

  return (
    <div data-testid="footer-social-links-container" className={className}>
      <div
        data-testid="footer-social-links-wrapper"
        className="flex gap-[16px] md:gap-4"
      >
        {socialLinks.map((social: SocialLink, index: number) => (
          <Link
            key={index}
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            data-testid={`footer-social-link-${index}`}
            className="flex justify-center items-center transition-colors duration-200"
          >
            <SocialIcon iconName={social.icon} />
          </Link>
        ))}
      </div>
    </div>
  );
};
