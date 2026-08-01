"use client";

import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  const handleContinueShopping = () => {
    router.push("/collections/best-sellers");
  };
  return (
    <div className="flex flex-col min-h-screen">
      {/* Main content */}
      <div className="flex-grow flex items-center justify-center px-2.5 mt-[100px] mb-[204px] ">
        <section className="w-full container max-w-container-lg mx-auto px-4">
          <div className="text-center text-[15px]   ">
            <h1 className=" text-[28px] leading-highTight  md:text-[2.5rem] font-medium text-text-darker mb-2 ">
              Page not found
            </h1>
            <p className="mb-7  md:text-[16px] text-black leading-highTight   ">
              The page you were looking for does not exist.
            </p>

            <button
              onClick={handleContinueShopping}
              className="inline-flex items-center justify-center px-7 py-3.5 rounded-md
                        bg-primary-lighter text-white font-medium transition-all duration-200
                        hover:bg-primary-light hover:shadow-md md:text-[18px] leading-highTight  "
            >
              Continue Shopping
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
