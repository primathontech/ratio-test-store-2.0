import { useState, useEffect } from "react";

export const useMobileDropdown = (isOpen: boolean, onToggle: () => void) => {
  const [showContent, setShowContent] = useState(false);
  const [isTextClosing, setIsTextClosing] = useState(false);
  const [isDropdownClosing, setIsDropdownClosing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsTextClosing(false);
      setIsDropdownClosing(false);
      const timer = setTimeout(() => {
        setShowContent(true);
      }, 250);
      return () => clearTimeout(timer);
    } else {
      setShowContent(false);
      setIsTextClosing(false);
      setIsDropdownClosing(false);
    }
  }, [isOpen]);

  const handleClose = () => {
    if (isTextClosing || isDropdownClosing) {
      return;
    }

    setIsTextClosing(true);
    setShowContent(false);

    setTimeout(() => {
      setIsDropdownClosing(true);
      setTimeout(() => {
        onToggle();
      }, 300);
    }, 250);
  };

  return { showContent, isTextClosing, isDropdownClosing, handleClose };
};
