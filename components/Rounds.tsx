"use client";

import Round from "./Round";

function Rounds() {
  return (
    <div
      className={`w-full flex justify-center items-center h-fit py-[90px] mt-[100px]`}
    >
      <div
        className={`grid lg:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-[20px]`}
      >
        <Round
          roundId="0x5eb890e41c8d2cff75ea942085e406bb90016561"
          chainId="10"
          name="GGI9: Climate"
          image="bg-top.jpg"
        />
        <Round
          roundId="0xa1d52f9b5339792651861329a046dd912761e9a9"
          chainId="10"
          name="GG19: Infra"
          image="edited.jpg"
        />
        <Round
          roundId="0xd4cc0dd193c7dc1d665ae244ce12d7fab337a008"
          chainId="10"
          image="sky.jpg"
          name="GG19: OSS"
        />
        <Round
          roundId="0x98720dd1925d34a2453ebc1f91c9d48e7e89ec29"
          chainId="10"
          name="GG19: Community and Ed"
          image="sun.jpg"
        />
      </div>
    </div>
  );
}

export default Rounds;
