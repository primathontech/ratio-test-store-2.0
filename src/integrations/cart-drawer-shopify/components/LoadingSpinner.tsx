"use client";

export const LoadingSpinner = () => {
  return (
    <div className="fixed top-0 left-0 right-0 w-full h-[3px] z-[9999] overflow-hidden">
      <div className="h-full bg-loading-blue relative animate-[progress_2s_ease-in-out]">
        <div className="absolute top-0 left-0 h-full w-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-[shimmer_1s_infinite]" />
      </div>
    </div>
  );
};
