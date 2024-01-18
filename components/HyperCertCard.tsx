"use client";
import { useWeb3Modal, useWeb3ModalAccount } from "@web3modal/ethers/react";
import { useRouter } from "next/navigation";
import { useAppContext } from "@/context/appContext";
import { Chain } from "viem";
import { useEffect, useState } from "react";

interface HyperCertCardProps {
  name: string;
  logoImg: string;
  bannerImg: string;
  roundId: string;
  chain?: Chain;
}
function HyperCertCard({
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
      className={`block max-w-[300px] lg:mx-0 md:mx-0 mx-auto w-[100%] h-[380px] rounded-[12px] p-3`}
      id="hypercert"
      style={{
        background: `linear-gradient(
        to bottom,
        rgba(88, 28, 135, 0.3) 0%,
        rgb(127,49,167, 1) 75%,
        rgb(127,49,167, 1) 100%
      ),
      url("/svg/black.png") center/cover repeat, url("${bannerImg}") center/310px 380px no-repeat`,
      }}
    >
      <div className={`flex justify-between`}>
        <div
          className={`w-[40px] h-[40px] bg-cover rounded-full bg-[]`}
          style={{ backgroundImage: `url("${logoImg}")` }}
        ></div>
        <button
          className={`bg-white text-black w-fit px-2 h-[35px] rounded-lg`}
          type="button"
          onClick={handleClick}
        >
          Mint HyperCert
        </button>
      </div>
      <div
        className={`mt-[24%] w-full space-y-4 min-h-[130px] h-fit flex items-center border-black border-t-[2px] border-b`}
      >
        <p className={`text-[20px] text-black font-bold`}>{name}</p>
      </div>
      <div className={`flex justify-between w-full pt-2 text-black`}>
        <div className={`block`}>
          <p className={`font-bold text-[13px]`}>IMPACT</p>
          <div className={`grid grid-cols-2 gap-2`}></div>
        </div>
        <div className={`flex items-cente`}>
          <p className={`text-[14px]`}>work-start</p>
          <p className={`text-[13px] space-x-1`}>&rarr;</p>
          <p className={`text-[14px]`}>work-end</p>
        </div>
      </div>
    </div>
  );
}

export default HyperCertCard;
