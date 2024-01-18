"use client";
import { useAppContext } from "@/context/appContext";
import { DM_Sans } from "next/font/google";
import Link from "next/link";
const font = DM_Sans({
  weight: "600",
  subsets: ["latin"],
});
function Navbar() {
  const { isWrongNetwork, correctNetwork } = useAppContext();
  const CheckNet = () => {
    if (isWrongNetwork) {
      return (
        <button
          className={`bg-red-500 font-semibold border-0 w-fit text-white ${font.className} rounded-[24px] px-3 h-[37px] hover:opacity-80 active:opacity-60`}
        >
          Wrong Network
        </button>
      );
    } else {
      return <w3m-button />;
    }
  };
  return (
    <nav
      className={`flex w-full h-[90px] lg:px-9 md:px-7 px-2 items-center justify-between z-20 fixed top-0 shadow bg-[#ffffff] backdrop-filter backdrop-blur-[20px] bg-opacity-10`}
    >
      <Link
        href={`/`}
        className={`lg:text-[23px] md:text-[22px] text-[20px] block font-bold text-[#3a59ef]`}
      >
        MINTER
      </Link>
      <div className={`block`}>
        <w3m-button size="sm" />
      </div>
    </nav>
  );
}

export default Navbar;
