"use client";

import HyperCertCard from "./HyperCertCard";
import { myChains } from "@/providers/Walletprovider";
import HyperCertCard2 from "./HyperCertCard2";

function Hero() {
  return (
    <div
      className={`lg:flex md:flex block w-full h-fit py-[100px] justify-center space-x-[10%]`}
    >
      <HyperCertCard2
        name="GG19: Climate"
        roundId="0x5eB890e41c8D2cFF75ea942085E406bB90016561"
        bannerImg="clir2.jpeg"
        logoImg="clir1.jpeg"
        chain={myChains.optimism}
      />

      <div className={`block lg:w-[50%] md:w-[60%] w-[80%] space-y-4`}>
        <p
          className={`bg-gradient-to-r from-black via-slate-700 to-gray-500 text-transparent text-center inline-block bg-clip-text lg:text-[55px] md:text-[50px] text-[40px] font-extrabold `}
        >
          Mint Your HyperCerts
        </p>
        <div className={`w-[90%] block p-6 text-[20px]`}>
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
