import { Box } from "@/ui/atomic";

interface EmptyCartViewProps {
  onNavigateToCollection: () => void;
}

const ArrowIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="9"
    height="9"
    viewBox="0 0 64 64"
    fill="currentColor"
    className="ml-1.5"
  >
    <path d="M6.89,64,0,57.11,47.26,9.85H4.92V0H64V59.08H54.15V16.74Z"></path>
  </svg>
);

export const EmptyCartView = ({
  onNavigateToCollection,
}: EmptyCartViewProps) => {
  return (
    <Box
      className="cart-empty flex flex-col items-center justify-center text-center mx-6 md:mx-[15px] lg:mx-[54px] my-[50px] lg:my-[130px] font-body"
      data-testid="bblunt-cart-drawer-empty"
    >
      <p className="text-[28px] text-black !leading-none">Your cart is empty</p>
      <p className="text-sm text-[#545454] mt-6 text-center">
        You may check out all the available products and buy some in the shop
      </p>
      <div
        onClick={onNavigateToCollection}
        className="bg-black cursor-pointer text-white text-sm text-center font-semibold flex justify-center items-baseline rounded-xl mt-6 px-[22px] md:px-[30px] py-2 md:py-[13px] shine-link-button"
        data-testid="bblunt-cart-drawer-empty-cta"
      >
        <span>Return to shop</span>
        <ArrowIcon />
      </div>
    </Box>
  );
};
