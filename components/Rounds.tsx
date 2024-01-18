"use client";

import { myChains } from "@/providers/Walletprovider";

import HyperCertCard from "./HyperCertCard";
import HyperCertCard2 from "./HyperCertCard2";

function Rounds() {
  const { pgn, polygon, optimism } = myChains;
  return (
    <div
      className={`w-full flex justify-center items-center h-fit lg:py-[60px] py-[40px] md:py-[90px] lg:mt-[100px] md:mt-[80px] mt-[50px]`}
    >
      <div
        className={`grid lg:grid-cols-4 md:grid-cols-3 grid-cols-1 gap-[20px] w-[90%]`}
      >
        <HyperCertCard2
          roundId="0x5eB890e41c8D2cFF75ea942085E406bB90016561"
          name="GGI9: Climate"
          bannerImg="/clir2.jpeg"
          logoImg="/clir1.jpeg"
          chain={optimism}
          bannerPattern="/svg/black.png"
          gradient="rgb(37,123,84)"
        />
        <HyperCertCard2
          roundId="0xa1d52f9b5339792651861329a046dd912761e9a9"
          name="GG19: Infra"
          logoImg="/infra2.webp"
          bannerImg="/infra.jpg"
          chain={polygon}
          bannerPattern="/svg/hex.png"
          gradient="rgb(187,54,54)"
        />
        <HyperCertCard2
          roundId="0xd4cc0dd193c7dc1d665ae244ce12d7fab337a008"
          bannerImg="/oss.jpg"
          logoImg="/oss2.jpg"
          name="GG19: OSS"
          bannerPattern="/svg/rand.png"
          gradient="rgb(34,61,104)"
          chain={pgn}
        />
        <HyperCertCard2
          roundId="0x98720dd1925d34a2453ebc1f91c9d48e7e89ec29"
          name="GG19: Community and Ed"
          bannerImg="/ed2.jpg"
          logoImg="/ed.jpeg"
          gradient="rgb(223,221,67)"
          chain={pgn}
          bannerPattern="/svg/dia.png"
        />
      </div>
    </div>
  );
}

export default Rounds;
