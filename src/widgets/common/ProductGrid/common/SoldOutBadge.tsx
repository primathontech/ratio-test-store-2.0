export default function SoldOutBadge() {
  return (
    <div
      data-testid="sold-out-badge-container"
      className="relative flex items-center justify-center rounded-full bg-white text-black font-medium text-sm size-[50px] md:w-[83px] md:h-[83px] xl:w-[93px] xl:h-[93px]"
    >
      <span
        data-testid="sold-out-badge-text"
        className="relative z-[2] font-normal text-[8px] md:text-text-base md:leading-9 bg-white"
      >
        Sold Out
      </span>

      {/* Diagonal Slash */}
      <div
        data-testid="sold-out-badge-slash"
        className="absolute inset-0 m-auto w-[calc(100%-16px)] h-px xl:w-[calc(100%-24px)] z-[1] opacity-10 rotate-[-45deg] bg-black"
      />
    </div>
  );
}
