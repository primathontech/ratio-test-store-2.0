import Link from "next/link";
import React from "react";
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
    <div className={className} data-testid="footer-social-links-container">
      <div className="flex gap-2.5" data-testid="footer-social-links-wrapper">
        {socialLinks.map((social, index) => (
          <Link
            key={index}
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex justify-center items-center transition-opacity duration-200 hover:opacity-70"
            data-testid={`footer-social-link-${index}`}
          >
            <SocialIcon iconName={social.icon} />
          </Link>
        ))}
      </div>
    </div>
  );
};
