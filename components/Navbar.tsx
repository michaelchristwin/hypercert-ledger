"use client";
import { useAppContext } from "@/context/appContext";
import { DM_Sans } from "next/font/google";
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
      className={`flex w-[100vw] h-[90px] px-9 items-center justify-between z-20 fixed top-0 shadow bg-[#ffffff] backdrop-filter backdrop-blur-[20px] bg-opacity-10`}
    >
      <p className={`text-[23px] font-bold text-[#3a59ef]`}>MINTER</p>
      <div className={`block`}>
        <w3m-button />
      </div>
    </nav>
  );
}

export default Navbar;
