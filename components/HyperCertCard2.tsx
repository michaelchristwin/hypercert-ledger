"use client";
import { useWeb3Modal, useWeb3ModalAccount } from "@web3modal/ethers/react";
import { useRouter } from "next/navigation";
import { useAppContext } from "@/context/appContext";
import { Chain } from "viem";
import { useEffect, useState } from "react";
import Image from "next/image";

interface HyperCertCardProps {
  name: string;
  logoImg: string;
  bannerImg: string;
  roundId: string;
  chain: Chain;
}
function HyperCertCard2({
  name,
  bannerImg,
  logoImg,
  roundId,
  chain,
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
      className={`block max-w-[300px] relative lg:mx-0 md:mx-0 mx-auto w-[100%] h-[380px] rounded-[12px]`}
      id="hypercert"
    >
      <Image
        className={`max-w-[300px] w-[100%] rounded-[12px] h-[380px]`}
        alt="bg-image"
        src={`/${bannerImg}`}
        width={300}
        height={360}
      />
      <div
        className={`w-full h-[100%] absolute bottom-[0px] rounded-[12px] p-3`}
        style={{
          background: `linear-gradient(to bottom, rgba(226,188,245,0.25) 15%, rgb(153,50,204) 75%)`,
        }}
      >
        <div className={`flex justify-between`}>
          <Image
            width={40}
            height={40}
            alt="logo"
            src={`/${logoImg as string}`}
            className={`w-[40px] h-[40px] rounded-full`}
          />
          <button
            className={`bg-white text-black w-fit px-2 h-[35px] rounded-lg`}
            type="button"
            onClick={handleClick}
          >
            Mint HyperCert
          </button>
        </div>
        <div
          className={`border-t-2 border-b justify-center flex flex-col border-black h-[100px] mt-[120px]`}
        >
          <p className={`font-[600] text-[22px]`}>{name}</p>
        </div>
        <div className={`flex justify-between w-full pt-2 text-black`}>
          <div className={`block`}>
            <p className={`font-bold text-[13px]`}>Work</p>
            <div className={`grid grid-cols-2 gap-2`}></div>
          </div>
          <div className={`flex items-cente`}>
            <p className={`text-[14px]`}>work-start</p>
            <p className={`text-[13px] space-x-1`}>&rarr;</p>
            <p className={`text-[14px]`}>work-end</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HyperCertCard2;
