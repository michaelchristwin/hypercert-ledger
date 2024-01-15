"use client";

import { useEffect, useState } from "react";
import HyperCertCard from "./HyperCertCard";
import { myChains } from "@/providers/Walletprovider";

function Hero() {
  // const [currentText, setCurrentText] = useState("");
  // const [currentIndex, setCurrentIndex] = useState(0);
  // const text = "Mint Your HyperCerts";
  // const delay = 120;
  // useEffect(() => {
  //   if (currentIndex < text.length) {
  //     const timeout = setTimeout(() => {
  //       setCurrentText((prevText) => prevText + text[currentIndex]);
  //       setCurrentIndex((prevIndex) => prevIndex + 1);
  //     }, delay);

  //     return () => clearTimeout(timeout);
  //   }
  // }, [currentIndex, delay, text]);

  return (
    <div className={`flex w-full h-[70vh] pt-[100px] justify-center space-x-4`}>
      <HyperCertCard
    
        name="GG19: Climate"
        roundId="0x5eB890e41c8D2cFF75ea942085E406bB90016561"
        bannerImg="clir2.jpeg"
        logoImg="clir1.jpeg"
        chain={myChains.optimism}
      />

      <div className={`flex flex-col w-[50%] space-y-4`}>
        <p
          className={`bg-gradient-to-r from-black via-slate-700 to-gray-500 text-transparent inline-block bg-clip-text text-center text-[60px] font-extrabold `}
        >
          Mint Your HyperCerts
        </p>
        <div className={`w-[80%] block mx-auto text-[20px]`}>
          <p className={``}>
            HyperMinter is a tool for minting a HyperCert to make an onchain
            claim of the impact your project will make with the grant funding
          </p>
          <ul className={`list-disc`}>
            <li>Connect the grant payout wallet</li>
            <li>Click mint on the round you participated in</li>
            <li>Modifiy the form that is generated and mint your HyperCert</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Hero;
