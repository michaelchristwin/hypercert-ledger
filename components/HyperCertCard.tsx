"use client";

import { useWeb3Modal, useWeb3ModalAccount } from "@web3modal/ethers/react";
import { useRouter } from "next/navigation";
import { useAppContext } from "@/context/appContext";
import { Chain } from "viem";
import { useEffect, useState } from "react";
import { impactCertProps } from "@/utils/randomizer/props";
import { Colors } from "@/utils/randomizer/styles/colors";
import { Patterns } from "@/utils/randomizer/styles/patterns";

interface HyperCertCardProps {
  name: string;
  logoImg: string;
  seed: string;
  bannerImg: string;
  roundId: number;
  chain: Chain;
}
function HyperCertCard({
  name,
  bannerImg,
  logoImg,
  roundId,
  seed,
  chain,
}: HyperCertCardProps) {
  const { isConnected, chainId } = useWeb3ModalAccount();
  const { patternIndex, colorIndex } = impactCertProps(seed);
  console.log("seed:", seed);
  const [isClicked, setIsClicked] = useState(false);
  const { open } = useWeb3Modal();
  const router = useRouter();
  const { setCorrectNetwork, setIsWrongNetwork } = useAppContext();
  const handleClick = async () => {
    setIsClicked(false);
    if (!isConnected) {
      setIsClicked(true);
      open();
    } else if (isConnected) {
      router.push(`/form?chainId=${chain?.id}&roundId=${roundId}`);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        if (isClicked && isConnected && chain) {
          router.push(`/form?chainId=${chain.id}&roundId=${roundId}`);

          setIsClicked(false);
        }
      } catch (err) {
        console.error(err);
      }
    })();
  }, [
    isClicked,
    isConnected,
    roundId,
    chain,
    router,

    chainId,
    setCorrectNetwork,
    setIsWrongNetwork,
  ]);
  return (
    <div
      className={`block min-w-[260px] relative w-[100%] h-[400px] rounded-[12px]`}
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
          className={`border-t-2 border-b block border-black min-h-[100px] h-fit mt-[130px]`}
        >
          <p className={`font-[600] text-[22px]`}>{name}</p>
        </div>
        {/* <div className={`flex justify-between w-full pt-2 text-black`}>
          <div className={`block`}>
            <p className={`font-bold text-[13px] text-transparent`}>Work</p>
            <div className={`grid grid-cols-2 gap-2`}></div>
          </div>
          <div className={`flex items-cente`}>
            <p className={`text-[14px] text-transparent`}>work-start</p>
            <p className={`text-[13px] text-transparent space-x-1`}>&rarr;</p>
            <p className={`text-[14px] text-transparent`}>work-end</p>
          </div>
        </div> */}
        <button
          className={`text-black mx-auto disabled:bg-gray-300 disabled:text-gray-300 disabled:opacity-100 disabled:active:opacity-100 bg-["${Colors[colorIndex]}"] backdrop-filter backdrop-brightness-150 block mt-[40px] w-fit hover:opacity-60 hover:border active:opacity-50 px-2 h-[35px] rounded-lg`}
          type="button"
          //disabled
          onClick={handleClick}
        >
          Mint Hypercert
        </button>
      </div>
    </div>
  );
}

export default HyperCertCard;
