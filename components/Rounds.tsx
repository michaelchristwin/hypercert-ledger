"use client";

import { myChains } from "@/providers/Walletprovider";
import HyperCertCard from "./HyperCertCard";

function Rounds() {
  const {  arbitrum, optimism } = myChains;
  return (
    <div
      className={`w-full flex justify-center items-center lg:py-[60px] py-[40px] md:py-[90px] lg:my-[100px] md:my-[100px] my-[70px]`}
    >
      <div
        className={`grid lg:grid-cols-4 md:grid-cols-3 grid-cols-1 w-full gap-x-[3%] gap-y-[20px] lg:px-[100px] md:px-[100px] px-[20px]`}
      >
        <HyperCertCard
          roundId={29}
          name="GG20: Climate"
          bannerImg="/pg1.webp"
          logoImg="/logo.webp"
          chain={arbitrum}
          seed="29"
        />

        <HyperCertCard
          roundId={23}
          bannerImg="/pg3.webp"
          logoImg="/logo.webp"
          name="GG20: Hackathon Alumini"
          seed="23"
          chain={arbitrum}
        />
        <HyperCertCard
          roundId={25}
          name="GG20: dApps and Apps"
          bannerImg="/pg5.webp"
          logoImg="/logo.webp"
          chain={arbitrum}
          seed="25"
        />
        <HyperCertCard
          roundId={28}
          name="GG20: Hypercerts Ecosystem"
          bannerImg="/pg5.webp"
          logoImg="/logo.webp"
          chain={arbitrum}
          seed="28"
        />
        <HyperCertCard
          roundId={31}
          name="GG20: Open Civics"
          bannerImg="/pg5.webp"
          logoImg="/logo.webp"
          chain={arbitrum}
          seed="31"
        />
        <HyperCertCard
          roundId={26}
          name="GG20: Web3 Infra"
          logoImg="/logo.webp"
          bannerImg="/pg2.webp"
          chain={arbitrum}
          seed="26"
        />
        <HyperCertCard
          name="GG20: Developer Tooling"
          roundId={27}
          logoImg="/logo.webp"
          bannerImg="/pg4.webp"
          seed="27"
          chain={arbitrum}
        />
        <HyperCertCard
          name="GG20: ENS"
          roundId={24}
          logoImg="/logo.webp"
          bannerImg="/pg5.webp"
          seed="24"
          chain={arbitrum}
        />
        <HyperCertCard
          name="GG20: TEC"
          roundId={9}
          logoImg="/logo.webp"
          bannerImg="/pg2.webp"
          seed="9"
          chain={optimism}
        />
      </div>
    </div>
  );
}

export default Rounds;
