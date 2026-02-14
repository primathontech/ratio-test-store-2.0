import React from "react";

interface CloseButtonProps {
  onClose: () => void;
  className?: string;
}

export const CloseButton: React.FC<CloseButtonProps> = ({ onClose }) => {
  return (
    <button
      onClick={onClose}
      className="absolute flex items-center justify-center h-4 w-4 top-1/2 transform -translate-y-1/2 right-2 text-white hover:bg-white hover:bg-opacity-30 transition-colors rounded-full"
      aria-label="Close announcement"
    >
      ×
    </button>
  );
};
