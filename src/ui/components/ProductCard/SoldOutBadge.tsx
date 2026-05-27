export default function SoldOutBadge() {
  return (
    <div
      data-testid="sold-out-badge-container"
      className="relative flex items-center justify-center rounded-[50%] bg-surface-4 text-black font-medium text-sm w-[73px] h-[73px] md:w-[83px] md:h-[83px] xl:w-[93px] xl:h-[93px]"
    >
      <span
        data-testid="sold-out-badge-text"
        className="relative z-[2] text-[12px] md:text-text-base md:leading-9 bg-surface-4 !font-[500]"
      >
        Sold Out
      </span>

      {/* Diagonal Slash */}
      <div
        data-testid="sold-out-badge-slash"
        className="absolute inset-0 m-auto w-[calc(100%-16px)] h-px xl:w-[calc(100%-24px)] z-[1] opacity-10 rotate-[-45deg] bg-[#000000]"
      />
    </div>
  );
}
