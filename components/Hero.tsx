"use client";

import { useEffect, useState } from "react";
import HyperCertCard from "./HyperCertCard";
import { myChains } from "@/providers/Walletprovider";

function Hero() {
  const [currentText, setCurrentText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const text = "Mint Your HyperCerts";
  const delay = 120;
  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setCurrentText((prevText) => prevText + text[currentIndex]);
        setCurrentIndex((prevIndex) => prevIndex + 1);
      }, delay);

      return () => clearTimeout(timeout);
    }
  }, [currentIndex, delay, text]);

  return (
    <div
      className={`flex w-full h-[80vh] items-center justify-center space-x-4`}
    >
      <HyperCertCard
        chainId="10"
        name="GG19: Climate"
        roundId="0x5eb890e41c8d2cff75ea942085e406bb90016561"
        bannerImg="clir2.jpeg"
        logoImg="clir1.jpeg"
        chain={myChains.optimism}
      />

      <div className={`flex flex-col w-[50%] space-y-4`}>
        <p
          className={`bg-gradient-to-r from-black via-slate-700 to-gray-500 text-transparent inline-block bg-clip-text text-center text-[60px] font-extrabold `}
        >
          {currentText}
        </p>
        {/* <button
          className={`bg-white text-black w-fit px-2 h-[37px] rounded-lg mx-auto`}
        >
          Mint HyperCert
        </button> */}
        {/* <HyperCertCard name="GG19: Climate" /> */}
      </div>
    </div>
  );
}

export default Hero;
