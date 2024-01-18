"use client";

import { useWeb3Modal, useWeb3ModalAccount } from "@web3modal/ethers/react";
import { useRouter } from "next/navigation";
import { useAppContext } from "@/context/appContext";
import { Chain } from "viem";
import { ForwardedRef, useEffect, useState } from "react";
import Image from "next/image";

interface HyperCertCardProps {
  name: string;
  logoImg: string;
  bannerImg: string;
  roundId: string;
  chain: Chain;
  startDate?: string;
  endDate?: string;
  ref?: React.LegacyRef<HTMLDivElement>;
  workScope?: string[];
  bannerPattern: string;
  gradient?: string;
}
function HyperCertCard2({
  name,
  bannerImg,
  logoImg,
  roundId,
  workScope,
  chain,
  ref,
  startDate,
  endDate,
  gradient,
  bannerPattern,
}: HyperCertCardProps) {
  const { isConnected, chainId } = useWeb3ModalAccount();
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
        if (isClicked && isConnected && chain && chainId) {
          console.log("Route effect ran");
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
      className={`block max-w-[300px] relative lg:mx-0 md:mx-0 mx-auto w-[100%] bg-[] h-[380px] rounded-[12px]`}
      id="hypercert"
      ref={ref}
    >
      <Image
        className={`max-w-[300px] w-[100%] rounded-[12px] h-[380px]`}
        alt="bg-image"
        src={`${bannerImg}`}
        width={300}
        height={360}
      />
      <div
        className={`w-full h-[100%] absolute bottom-[0px] rounded-[12px] p-3`}
        style={{
          background: `linear-gradient(to bottom, rgba(226,188,245,0.25) 15%, ${gradient} 75%), url("${bannerPattern}") center/cover no-repeat`,
        }}
      >
        <div
          className={`flex ${startDate ? "justify-start" : "justify-between"}`}
        >
          <Image
            width={40}
            height={40}
            alt="logo"
            src={`${logoImg as string}`}
            className={`w-[40px] h-[40px] rounded-full`}
          />
          {!startDate && (
            <button
              className={`bg-white text-black w-fit hover:opacity-80 active:opacity-65 px-2 h-[35px] rounded-lg`}
              type="button"
              onClick={handleClick}
            >
              Mint HyperCert
            </button>
          )}
        </div>
        <div
          className={`border-t-2 border-b block border-black min-h-[100px] h-fit mt-[130px]`}
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
                    className={`border-[2px] border-gray-800 flex justify-around rounded-[4px] min-w-[20px] h-[20px] px-[2px]`}
                  >
                    <p className={`text-[12px] text-center truncate`}>{item}</p>
                  </div>
                ))}
            </div>
          </div>
          <div className={`flex items-cente`}>
            <p className={`text-[14px]`}>
              {startDate ? startDate : "work-start"}
            </p>
            <p className={`text-[13px] space-x-1`}>&rarr;</p>
            <p className={`text-[14px]`}>{endDate ? endDate : "work-end"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HyperCertCard2;
