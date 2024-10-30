"use client";

import { Chain } from "viem";
import { forwardRef } from "react";
import { impactCertProps } from "@/utils/randomizer/props";
import { Patterns } from "@/utils/randomizer/styles/patterns";
import { Colors } from "@/utils/randomizer/styles/colors";

export interface HyperCertCardProps {
  name: string;
  logoImg: string;
  bannerImg: string;
  roundId: string;
  chain: Chain;
  startDate?: string;
  endDate?: string;
  workScope?: string[];
  seed: string;
}
const MyHypercert = forwardRef(function HyperCertCard(
  {
    name,
    bannerImg,
    logoImg,
    workScope,
    startDate,
    endDate,
    seed,
  }: HyperCertCardProps,
  ref
) {
  console.log("seed:", seed);
  const { patternIndex, colorIndex } = impactCertProps(seed);
  console.log("Pattern index C: ", patternIndex);
  console.log("Color index C: ", colorIndex);
  return (
    (<div
      className={`block max-w-[300px] relative lg:mx-0 md:mx-0 mx-auto w-[300px] h-[380px] rounded-[12px]`}
      ref={ref as React.Ref<HTMLDivElement>}
    >
      <div
        className={`bg-cover bg-center w-[100%] rounded-[12px] h-full`}
        style={{ backgroundImage: `url("${bannerImg}")` }}
      />
      <div
        className={`w-full h-[100%] absolute bottom-[0px] rounded-[12px] p-3`}
        style={{
          background: `linear-gradient(to bottom, rgba(226,188,245,0.25) 15%, ${Colors[colorIndex]} 75%), url("${Patterns[patternIndex]}") center/cover no-repeat`,
        }}
      >
        <div className={`flex justify-start`}>
          <div
            className={`w-[40px] h-[40px] bg-cover rounded-full`}
            style={{ backgroundImage: `url("${logoImg}")` }}
          />
        </div>
        <div
          className={`border-t-2 border-b block py-[6px] border-black min-h-[100px] h-fit mt-[110px]`}
        >
          <p className={`font-[600] text-[22px]`}>{name}</p>
        </div>
        <div className={`flex justify-between w-full pt-2 text-black`}>
          <div className={`block`}>
            <p className={`font-bold text-[13px]`}>Work</p>
            <div className={`grid grid-cols-2 gap-2`}>
              {workScope &&
                workScope.map((item, index) => (
                  <div
                    key={index}
                    className={`border-[2px] border-gray-800 items-center flex justify-around rounded-[4px] min-w-[20px] max-w-[40px] h-[20px] px-[2px]`}
                  >
                    <p className={`text-[12px] text-center truncate`}>{item}</p>
                  </div>
                ))}
            </div>
          </div>
          <div className={`flex items-center w-fit leading-[14px]`}>
            <p className={`text-[14px]`}>{startDate}</p>
            <p className={`text-[10px] space-x-[6px]`}>→</p>
            <p className={`text-[14px]`}>{endDate}</p>
          </div>
        </div>
      </div>
    </div>)
  );
});

export default MyHypercert;
